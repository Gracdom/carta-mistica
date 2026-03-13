import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import {
  Search, ChevronDown, ChevronUp, Trash2,
  Mail, Clock, CheckCircle, CreditCard, Eye, EyeOff
} from 'lucide-react'

const ESTADOS = {
  pendiente: { label: 'Pendiente',  bg: 'rgba(251,191,36,.12)', border: 'rgba(251,191,36,.4)',  text: '#fbbf24', icon: Clock },
  preview:   { label: 'Vista previa', bg: 'rgba(139,92,246,.15)', border: 'rgba(139,92,246,.4)', text: '#a78bfa', icon: Eye },
  pagado:    { label: 'Pagado',     bg: 'rgba(52,211,153,.12)', border: 'rgba(52,211,153,.4)',  text: '#34d399', icon: CheckCircle },
}

const RECOVERY = ['—', 'Email 1 enviado', 'Email 2 enviado', 'Email 3 enviado (final)']

function Badge({ estado }) {
  const e = ESTADOS[estado] ?? ESTADOS.pendiente
  const Icon = e.icon
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ background: e.bg, border: `1px solid ${e.border}`, color: e.text }}>
      <Icon size={10} /> {e.label}
    </span>
  )
}

function LecturaBlock({ titulo, contenido }) {
  const [visible, setVisible] = useState(false)
  if (!contenido) return null
  return (
    <div className="mt-4">
      <button onClick={() => setVisible(!visible)}
        className="flex items-center gap-2 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors mb-2">
        {visible ? <EyeOff size={12} /> : <Eye size={12} />}
        {titulo}
      </button>
      {visible && (
        <div className="rounded-xl p-4 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap"
          style={{ background: 'rgba(109,40,217,.08)', border: '1px solid rgba(139,92,246,.2)' }}>
          {contenido}
        </div>
      )}
    </div>
  )
}

export default function AdminConsultas() {
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [buscar, setBuscar]     = useState('')
  const [filtro, setFiltro]     = useState('todos')
  const [expanded, setExpanded] = useState(null)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('consultas_akasicas')
      .select('*')
      .order('created_at', { ascending: false })
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta consulta? Esta acción no se puede deshacer.')) return
    await supabase.from('consultas_akasicas').delete().eq('id', id)
    setItems(items.filter(i => i.id !== id))
    if (expanded === id) setExpanded(null)
  }

  const filtered = items
    .filter(i => filtro === 'todos' || i.estado === filtro)
    .filter(i => {
      if (!buscar) return true
      const q = buscar.toLowerCase()
      return (
        i.nombre?.toLowerCase().includes(q) ||
        i.email?.toLowerCase().includes(q)  ||
        (i.intenciones ?? []).some(x => x.toLowerCase().includes(q))
      )
    })

  const counts = {
    todos:    items.length,
    pendiente: items.filter(i => i.estado === 'pendiente').length,
    preview:  items.filter(i => i.estado === 'preview').length,
    pagado:   items.filter(i => i.estado === 'pagado').length,
  }

  const fmt = (d) => d ? new Date(d).toLocaleDateString('es-AR', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '—'

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-white mb-1">
          Consultas Akáshicas
        </h1>
        <p className="text-gray-500 text-sm">Todas las consultas realizadas por los clientes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total', valor: counts.todos,    color: '#a78bfa' },
          { label: 'Pendiente', valor: counts.pendiente, color: '#fbbf24' },
          { label: 'Vista previa', valor: counts.preview,  color: '#8b5cf6' },
          { label: 'Pagadas', valor: counts.pagado,  color: '#34d399' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 text-center"
            style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.valor}</p>
            <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filtros + Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={buscar} onChange={e => setBuscar(e.target.value)}
            placeholder="Buscar por nombre, email o intención..."
            className="w-full bg-white/4 border border-white/10 focus:border-purple-500/50 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder-gray-600 outline-none transition-all" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'todos',    label: `Todas (${counts.todos})` },
            { key: 'pendiente',label: `Pendiente (${counts.pendiente})` },
            { key: 'preview',  label: `Preview (${counts.preview})` },
            { key: 'pagado',   label: `Pagadas (${counts.pagado})` },
          ].map(f => (
            <button key={f.key} onClick={() => setFiltro(f.key)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                filtro === f.key
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                  : 'text-gray-500 border border-white/8 hover:text-gray-300 hover:border-white/15'
              }`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="text-center py-16 text-gray-600">Cargando...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-600">No hay consultas que coincidan</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(c => (
            <div key={c.id}
              className="rounded-2xl overflow-hidden transition-all"
              style={{ background: 'rgba(255,255,255,.03)', border: `1px solid ${expanded === c.id ? 'rgba(139,92,246,.4)' : 'rgba(255,255,255,.07)'}` }}>

              {/* Fila principal */}
              <div className="flex items-center gap-3 p-4 cursor-pointer"
                onClick={() => setExpanded(expanded === c.id ? null : c.id)}>

                {/* Avatar */}
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-purple-300"
                  style={{ background: 'rgba(109,40,217,.3)', border: '1px solid rgba(139,92,246,.3)' }}>
                  {c.nombre?.[0]?.toUpperCase() ?? '?'}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white font-medium text-sm truncate">{c.nombre ?? '—'}</p>
                    <Badge estado={c.estado ?? 'pendiente'} />
                    {(c.recovery_step ?? 0) > 0 && (
                      <span className="text-xs text-yellow-500/70 hidden sm:inline">
                        ✉ {RECOVERY[c.recovery_step] ?? '—'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-gray-500 text-xs flex items-center gap-1">
                      <Mail size={10} /> {c.email ?? '—'}
                    </span>
                    <span className="text-gray-600 text-xs hidden sm:inline">{fmt(c.created_at)}</span>
                  </div>
                </div>

                {/* Intenciones */}
                {Array.isArray(c.intenciones) && c.intenciones.length > 0 && (
                  <div className="hidden md:flex flex-wrap gap-1 max-w-[200px]">
                    {c.intenciones.slice(0, 2).map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full text-purple-300"
                        style={{ background: 'rgba(109,40,217,.2)', border: '1px solid rgba(139,92,246,.25)' }}>
                        {t}
                      </span>
                    ))}
                    {c.intenciones.length > 2 && (
                      <span className="text-[10px] text-gray-500">+{c.intenciones.length - 2}</span>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={e => { e.stopPropagation(); handleDelete(c.id) }}
                    className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-all">
                    <Trash2 size={14} />
                  </button>
                  {expanded === c.id
                    ? <ChevronUp size={14} className="text-purple-400" />
                    : <ChevronDown size={14} className="text-gray-600" />}
                </div>
              </div>

              {/* Detalle expandido */}
              {expanded === c.id && (
                <div className="px-4 pb-5 border-t" style={{ borderColor: 'rgba(139,92,246,.15)' }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    {/* Datos personales */}
                    <div>
                      <p className="text-xs font-semibold text-purple-400/70 uppercase tracking-wider mb-3">Datos del consultante</p>
                      <div className="space-y-2 text-sm">
                        <Row label="Nombre"       value={c.nombre} />
                        <Row label="Email"        value={c.email} />
                        <Row label="Nacimiento"   value={c.fecha_nacimiento} />
                        <Row label="Lugar"        value={c.lugar_nacimiento} />
                        <Row label="Consulta"     value={fmt(c.created_at)} />
                        {c.stripe_session_id && (
                          <Row label="Stripe ID"  value={c.stripe_session_id} mono />
                        )}
                      </div>
                    </div>

                    {/* Intenciones */}
                    <div>
                      <p className="text-xs font-semibold text-purple-400/70 uppercase tracking-wider mb-3">Intenciones</p>
                      {Array.isArray(c.intenciones) && c.intenciones.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {c.intenciones.map(t => (
                            <span key={t} className="text-xs px-2.5 py-1 rounded-full text-purple-300"
                              style={{ background: 'rgba(109,40,217,.2)', border: '1px solid rgba(139,92,246,.3)' }}>
                              {t}
                            </span>
                          ))}
                        </div>
                      ) : <p className="text-gray-600 text-sm">—</p>}

                      <p className="text-xs font-semibold text-purple-400/70 uppercase tracking-wider mb-2 mt-4">Recovery emails</p>
                      <p className="text-sm text-gray-400">{RECOVERY[c.recovery_step ?? 0]}</p>
                      {c.recovery_last_sent_at && (
                        <p className="text-xs text-gray-600 mt-0.5">Último: {fmt(c.recovery_last_sent_at)}</p>
                      )}
                    </div>
                  </div>

                  {/* Lecturas */}
                  <LecturaBlock titulo="Ver vista previa (teaser)" contenido={c.lectura_teaser} />
                  <LecturaBlock titulo="Ver lectura completa (ChatGPT)" contenido={c.lectura_completa} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Row({ label, value, mono = false }) {
  if (!value) return null
  return (
    <div className="flex gap-2">
      <span className="text-gray-600 w-24 flex-shrink-0">{label}</span>
      <span className={`text-gray-300 break-all ${mono ? 'font-mono text-xs text-gray-500' : ''}`}>{value}</span>
    </div>
  )
}
