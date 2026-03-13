import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { CheckCircle, XCircle, Clock, Mail, Phone, Globe, AlertCircle, Trash2 } from 'lucide-react'

const ESTADO = {
  pendiente:  { label: 'Pendiente',  bg: 'rgba(251,191,36,.12)', border: 'rgba(251,191,36,.4)',  text: '#fbbf24', icon: Clock },
  aprobado:   { label: 'Aprobado',   bg: 'rgba(52,211,153,.12)', border: 'rgba(52,211,153,.4)',  text: '#34d399', icon: CheckCircle },
  rechazado:  { label: 'Rechazado',  bg: 'rgba(248,113,113,.12)',border: 'rgba(248,113,113,.4)', text: '#f87171', icon: XCircle },
}

export default function AdminSolicitudes() {
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [filtro, setFiltro]     = useState('todos')
  const [expanded, setExpanded] = useState(null)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('solicitudes_tarotista')
      .select('*')
      .order('created_at', { ascending: false })
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const updateEstado = async (id, estado) => {
    await supabase.from('solicitudes_tarotista').update({ estado }).eq('id', id)
    setItems(items.map(i => i.id === id ? { ...i, estado } : i))
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta solicitud?')) return
    await supabase.from('solicitudes_tarotista').delete().eq('id', id)
    setItems(items.filter(i => i.id !== id))
  }

  const filtered = filtro === 'todos' ? items : items.filter(i => (i.estado ?? 'pendiente') === filtro)

  const counts = {
    todos:     items.length,
    pendiente: items.filter(i => !i.estado || i.estado === 'pendiente').length,
    aprobado:  items.filter(i => i.estado === 'aprobado').length,
    rechazado: items.filter(i => i.estado === 'rechazado').length,
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-white mb-1">Solicitudes</h1>
        <p className="text-gray-500 text-sm">Solicitudes de registro de nuevos tarotistas</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[
          { key: 'todos',    label: 'Todas' },
          { key: 'pendiente',label: 'Pendientes' },
          { key: 'aprobado', label: 'Aprobadas' },
          { key: 'rechazado',label: 'Rechazadas' },
        ].map(f => (
          <button key={f.key} onClick={() => setFiltro(f.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filtro === f.key
                ? 'bg-purple-600/25 text-purple-300 border border-purple-500/40'
                : 'text-gray-400 hover:text-white border border-white/8 hover:border-white/15'
            }`}>
            {f.label}
            <span className="ml-1.5 text-xs opacity-60">({counts[f.key]})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <AlertCircle size={24} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No hay solicitudes {filtro !== 'todos' ? `"${filtro}"` : ''}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(s => {
            const estado = s.estado ?? 'pendiente'
            const badge  = ESTADO[estado] ?? ESTADO.pendiente
            const Icon   = badge.icon
            const isOpen = expanded === s.id

            return (
              <div key={s.id} className="rounded-xl overflow-hidden transition-all"
                style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.07)' }}>

                {/* Header row */}
                <div className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-white/2"
                  onClick={() => setExpanded(isOpen ? null : s.id)}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-purple-300 flex-shrink-0"
                    style={{ background: 'rgba(109,40,217,.25)' }}>
                    {s.nombre?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium">{s.nombre}</p>
                    <p className="text-gray-500 text-xs">{s.email} · {s.pais}</p>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 hidden sm:flex"
                    style={{ background: badge.bg, border: `1px solid ${badge.border}`, color: badge.text }}>
                    <Icon size={11} /> {badge.label}
                  </span>
                  <p className="text-gray-600 text-xs hidden md:block flex-shrink-0">
                    {s.created_at ? new Date(s.created_at).toLocaleDateString('es-AR') : '—'}
                  </p>
                </div>

                {/* Expanded */}
                {isOpen && (
                  <div className="px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.07)' }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 mb-4 text-sm">
                      {s.email && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <Mail size={13} className="text-purple-400 flex-shrink-0" /> {s.email}
                        </div>
                      )}
                      {s.whatsapp && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <Phone size={13} className="text-purple-400 flex-shrink-0" /> {s.whatsapp}
                        </div>
                      )}
                      {s.pais && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <Globe size={13} className="text-purple-400 flex-shrink-0" /> {s.pais}
                        </div>
                      )}
                      {s.especialidad && (
                        <div className="text-gray-300">
                          <span className="text-gray-500">Especialidad:</span> {s.especialidad}
                        </div>
                      )}
                      {s.modelo && (
                        <div className="text-gray-300">
                          <span className="text-gray-500">Modelo:</span> {s.modelo}
                        </div>
                      )}
                    </div>
                    {s.mensaje && (
                      <div className="mb-4 p-3 rounded-lg text-sm text-gray-300 leading-relaxed"
                        style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                        {s.mensaje}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <button onClick={() => updateEstado(s.id, 'aprobado')} disabled={estado === 'aprobado'}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all disabled:opacity-40"
                        style={{ background: 'rgba(52,211,153,.15)', border: '1px solid rgba(52,211,153,.35)', color: '#34d399' }}>
                        <CheckCircle size={13} /> Aprobar
                      </button>
                      <button onClick={() => updateEstado(s.id, 'rechazado')} disabled={estado === 'rechazado'}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all disabled:opacity-40"
                        style={{ background: 'rgba(248,113,113,.12)', border: '1px solid rgba(248,113,113,.35)', color: '#f87171' }}>
                        <XCircle size={13} /> Rechazar
                      </button>
                      {estado !== 'pendiente' && (
                        <button onClick={() => updateEstado(s.id, 'pendiente')}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all"
                          style={{ background: 'rgba(251,191,36,.1)', border: '1px solid rgba(251,191,36,.3)', color: '#fbbf24' }}>
                          <Clock size={13} /> Pendiente
                        </button>
                      )}
                      <button onClick={() => handleDelete(s.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all ml-auto"
                        style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', color: '#6b7280' }}>
                        <Trash2 size={13} /> Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
