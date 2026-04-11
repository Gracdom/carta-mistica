import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import {
  Search, Trash2, Mail, Clock, CheckCircle, Eye, EyeOff,
  Send, RefreshCw, X, ChevronLeft, ChevronRight, Download,
} from 'lucide-react'

// ── Constantes ────────────────────────────────────────────────────────────────
const ESTADOS = {
  incompleto: { label: 'Incompleto', bg: 'rgba(107,114,128,.12)', border: 'rgba(107,114,128,.35)', text: '#9ca3af' },
  pendiente:  { label: 'Pendiente',  bg: 'rgba(251,191,36,.12)',  border: 'rgba(251,191,36,.4)',   text: '#fbbf24' },
  preview:    { label: 'Vista previa',bg:'rgba(139,92,246,.15)',  border: 'rgba(139,92,246,.4)',   text: '#a78bfa' },
  pagado:     { label: 'Pagado',     bg: 'rgba(52,211,153,.12)',  border: 'rgba(52,211,153,.4)',   text: '#34d399' },
}
const RECOVERY_LABELS = ['—', 'Email 1 enviado', 'Email 2 enviado', 'Email 3 enviado']

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = d => d
  ? new Date(d).toLocaleDateString('es-AR', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })
  : '—'

const shortId = id => id ? id.slice(0, 8).toUpperCase() : '—'

const csvEscape = (value) => {
  if (value === null || value === undefined) return ''
  const str = String(value).replace(/"/g, '""')
  return `"${str}"`
}

const toCsvRow = (values) => values.map(csvEscape).join(',')

// ── Badge ─────────────────────────────────────────────────────────────────────
function Badge({ estado }) {
  const e = ESTADOS[estado] ?? ESTADOS.pendiente
  return (
    <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ background: e.bg, border: `1px solid ${e.border}`, color: e.text }}>
      {e.label}
    </span>
  )
}

// ── Drawer de detalle ─────────────────────────────────────────────────────────
function Drawer({ consulta: c, onClose, onDelete, onRecovery, sendingRecovery }) {
  const [showTeaser,   setShowTeaser]   = useState(false)
  const [showCompleta, setShowCompleta] = useState(false)

  if (!c) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full z-50 w-full max-w-md flex flex-col overflow-hidden"
        style={{ background: '#0a0818', borderLeft: '1px solid rgba(139,92,246,.2)', boxShadow: '-8px 0 40px rgba(0,0,0,.5)' }}>

        {/* Header del drawer */}
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,.06)' }}>
          <div>
            <p className="text-white font-semibold">{c.nombre ?? '—'}</p>
            <p className="text-gray-500 text-xs font-mono">{shortId(c.id)}</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-all">
            <X size={16} />
          </button>
        </div>

        {/* Contenido scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

          {/* Estado + Recovery */}
          <div className="flex items-center gap-3 flex-wrap">
            <Badge estado={c.estado} />
            {(c.recovery_step ?? 0) > 0 && (
              <span className="text-[10px] text-yellow-400/70 flex items-center gap-1">
                ✉ {RECOVERY_LABELS[c.recovery_step]}
              </span>
            )}
            {c.recovery_last_sent_at && (
              <span className="text-[10px] text-gray-600">· {fmt(c.recovery_last_sent_at)}</span>
            )}
          </div>

          {/* Datos personales */}
          <Section title="Datos del consultante">
            <Field label="Nombre"      value={c.nombre} />
            <Field label="Email"       value={c.email} />
            <Field label="Nacimiento"  value={c.fecha_nacimiento} />
            <Field label="Lugar"       value={c.lugar_nacimiento} />
            <Field label="Fecha"       value={fmt(c.created_at)} />
            {c.stripe_session_id && <Field label="Stripe ID" value={c.stripe_session_id} mono />}
          </Section>

          {/* Intenciones */}
          {Array.isArray(c.intenciones) && c.intenciones.length > 0 && (
            <Section title="Intenciones seleccionadas">
              <div className="flex flex-wrap gap-1.5 pt-1">
                {c.intenciones.map(t => (
                  <span key={t} className="text-xs px-2.5 py-1 rounded-full text-purple-300"
                    style={{ background: 'rgba(109,40,217,.2)', border: '1px solid rgba(139,92,246,.3)' }}>
                    {t}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {(c.tarotista_id || c.tarotista_nombre || c.pregunta_enviada) && (
            <Section title="Tarotista y consulta">
              {c.tarotista_id && <Field label="Tarotista (id)" value={c.tarotista_id} mono />}
              {c.tarotista_nombre && <Field label="Tarotista" value={c.tarotista_nombre} />}
              {c.tarotista_especialidad && <Field label="Especialidad" value={c.tarotista_especialidad} />}
              {c.pregunta_enviada && (
                <div className="pt-1">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Prompt enviado a la IA</p>
                  <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap break-words">{c.pregunta_enviada}</p>
                </div>
              )}
              {c.snapshot_formulario && (
                <details className="pt-2">
                  <summary className="text-[11px] text-purple-400/80 cursor-pointer hover:text-purple-300">Snapshot del formulario (JSON)</summary>
                  <pre className="mt-2 text-[10px] text-gray-500 overflow-x-auto p-2 rounded-lg bg-black/30 border border-white/5">
                    {JSON.stringify(c.snapshot_formulario, null, 2)}
                  </pre>
                </details>
              )}
            </Section>
          )}

          {/* Lectura teaser */}
          {c.lectura_teaser && (
            <Section title="Vista previa (teaser)">
              <button onClick={() => setShowTeaser(v => !v)}
                className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors mb-2">
                {showTeaser ? <EyeOff size={11} /> : <Eye size={11} />}
                {showTeaser ? 'Ocultar' : 'Mostrar teaser'}
              </button>
              {showTeaser && (
                <p className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap rounded-xl p-3"
                  style={{ background: 'rgba(109,40,217,.08)', border: '1px solid rgba(139,92,246,.15)' }}>
                  {c.lectura_teaser}
                </p>
              )}
            </Section>
          )}

          {/* Lectura completa */}
          {c.lectura_completa && (
            <Section title="Lectura completa">
              <button onClick={() => setShowCompleta(v => !v)}
                className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors mb-2">
                {showCompleta ? <EyeOff size={11} /> : <Eye size={11} />}
                {showCompleta ? 'Ocultar' : 'Mostrar lectura'}
              </button>
              {showCompleta && (
                <p className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap rounded-xl p-3"
                  style={{ background: 'rgba(109,40,217,.08)', border: '1px solid rgba(139,92,246,.15)' }}>
                  {c.lectura_completa}
                </p>
              )}
            </Section>
          )}
        </div>

        {/* Acciones footer */}
        <div className="flex-shrink-0 px-5 py-4 space-y-2"
          style={{ borderTop: '1px solid rgba(255,255,255,.06)' }}>
          <button
            onClick={() => onRecovery(c)}
            disabled={sendingRecovery}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
            style={{ background: 'rgba(251,191,36,.1)', border: '1px solid rgba(251,191,36,.3)', color: '#fbbf24' }}>
            {sendingRecovery
              ? <><RefreshCw size={13} className="animate-spin"/> Enviando...</>
              : <><Send size={13}/> Enviar email de recuperación manual</>
            }
          </button>
          <button
            onClick={() => onDelete(c.id)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
            style={{ background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.25)', color: '#f87171' }}>
            <Trash2 size={13}/> Eliminar consulta
          </button>
        </div>
      </div>
    </>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-purple-400/60 uppercase tracking-widest mb-2">{title}</p>
      <div className="space-y-1.5">{children}</div>
    </div>
  )
}

function Field({ label, value, mono = false }) {
  if (!value) return null
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-gray-600 w-24 flex-shrink-0 text-xs pt-0.5">{label}</span>
      <span className={`text-gray-300 break-all text-xs ${mono ? 'font-mono text-gray-500' : ''}`}>{value}</span>
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────
const PAGE_SIZE = 20

export default function AdminConsultas() {
  const [items, setItems]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [dbError, setDbError]       = useState(null)
  const [buscar, setBuscar]         = useState('')
  const [filtro, setFiltro]         = useState('todos')
  const [selected, setSelected]     = useState(null)
  const [page, setPage]             = useState(1)
  const [sendingRecovery, setSendingRecovery] = useState(false)

  const load = async () => {
    setLoading(true)
    setDbError(null)
    const { data, error } = await supabase
      .from('consultas_akasicas')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      console.error('[AdminConsultas] error:', error)
      setDbError(error.message || error.code || 'Error desconocido')
    }
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta consulta? No se puede deshacer.')) return
    await supabase.from('consultas_akasicas').delete().eq('id', id)
    setItems(prev => prev.filter(i => i.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const handleRecovery = async (c) => {
    if (!c.email) return alert('Este consultante no tiene email registrado.')
    // El siguiente paso de recovery a enviar (siempre al menos el 1)
    const nextStep = Math.min((c.recovery_step ?? 0) + 1, 3)
    if (!confirm(`¿Enviar el Email de recuperación #${nextStep} a ${c.email}?`)) return
    setSendingRecovery(true)
    try {
      const { data, error } = await supabase.functions.invoke('recovery-emails', {
        body: { consultaId: c.id, email: c.email, emailStep: nextStep },
      })
      if (error) throw new Error(error.message)
      if (data?.error) throw new Error(data.error)
      // Actualizar el item localmente para reflejar el nuevo step
      setItems(prev => prev.map(i => i.id === c.id
        ? { ...i, recovery_step: nextStep, recovery_last_sent_at: new Date().toISOString() }
        : i
      ))
      if (selected?.id === c.id) setSelected(s => ({ ...s, recovery_step: nextStep }))
      alert(`✓ Email #${nextStep} enviado a ${c.email}`)
    } catch (e) {
      alert(`Error al enviar: ${e.message}`)
    } finally {
      setSendingRecovery(false)
    }
  }

  // Filtrado
  const filtered = items
    .filter(i => filtro === 'todos' || i.estado === filtro)
    .filter(i => {
      if (!buscar) return true
      const q = buscar.toLowerCase()
      return (
        i.nombre?.toLowerCase().includes(q) ||
        i.email?.toLowerCase().includes(q) ||
        i.id?.toLowerCase().includes(q) ||
        i.tarotista_id?.toLowerCase().includes(q) ||
        i.tarotista_nombre?.toLowerCase().includes(q)
      )
    })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleDownloadCsv = (sourceItems, scopeLabel) => {
    if (!sourceItems.length) {
      alert(`No hay consultas para exportar (${scopeLabel}).`)
      return
    }

    const headers = [
      'id',
      'nombre',
      'email',
      'estado',
      'fecha_nacimiento',
      'lugar_nacimiento',
      'intenciones',
      'tarotista_id',
      'tarotista_nombre',
      'tarotista_especialidad',
      'pregunta_enviada',
      'snapshot_formulario',
      'recovery_step',
      'recovery_last_sent_at',
      'created_at',
      'stripe_session_id',
    ]

    const rows = sourceItems.map((c) => toCsvRow([
      c.id,
      c.nombre ?? '',
      c.email ?? '',
      c.estado ?? '',
      c.fecha_nacimiento ?? '',
      c.lugar_nacimiento ?? '',
      Array.isArray(c.intenciones) ? c.intenciones.join(' | ') : '',
      c.tarotista_id ?? '',
      c.tarotista_nombre ?? '',
      c.tarotista_especialidad ?? '',
      c.pregunta_enviada ?? '',
      c.snapshot_formulario != null ? JSON.stringify(c.snapshot_formulario) : '',
      c.recovery_step ?? 0,
      c.recovery_last_sent_at ?? '',
      c.created_at ?? '',
      c.stripe_session_id ?? c.checkout_session ?? '',
    ]))

    const csv = [toCsvRow(headers), ...rows].join('\n')
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `consultas-akasicas-${scopeLabel}-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const counts = {
    todos:      items.length,
    incompleto: items.filter(i => i.estado === 'incompleto').length,
    pendiente:  items.filter(i => i.estado === 'pendiente').length,
    preview:    items.filter(i => i.estado === 'preview').length,
    pagado:     items.filter(i => i.estado === 'pagado').length,
  }

  const TH = ({ children, w }) => (
    <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
      style={{ width: w }}>
      {children}
    </th>
  )

  return (
    <div className="max-w-6xl">

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-white mb-1">Consultas Akáshicas</h1>
        <p className="text-gray-500 text-sm">Registros de todas las consultas de clientes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Total',        valor: counts.todos,      color: '#a78bfa' },
          { label: 'Incompleto',   valor: counts.incompleto, color: '#9ca3af' },
          { label: 'Pendiente',    valor: counts.pendiente,  color: '#fbbf24' },
          { label: 'Vista previa', valor: counts.preview,    color: '#8b5cf6' },
          { label: 'Pagadas',      valor: counts.pagado,     color: '#34d399' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-3 text-center cursor-pointer transition-all hover:scale-[1.02]"
            style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}
            onClick={() => { setFiltro(s.label === 'Total' ? 'todos' : s.label.toLowerCase().replace(' ', '')); setPage(1) }}>
            <p className="text-xl font-bold" style={{ color: s.color }}>{s.valor}</p>
            <p className="text-gray-500 text-[10px] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filtros + Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={buscar} onChange={e => { setBuscar(e.target.value); setPage(1) }}
            placeholder="Buscar por nombre, email o ID..."
            className="w-full bg-white/4 border border-white/10 focus:border-purple-500/50 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder-gray-600 outline-none transition-all" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'todos',      label: `Todas (${counts.todos})` },
            { key: 'pendiente',  label: `Pendiente (${counts.pendiente})` },
            { key: 'preview',    label: `Preview (${counts.preview})` },
            { key: 'pagado',     label: `Pagadas (${counts.pagado})` },
          ].map(f => (
            <button key={f.key} onClick={() => { setFiltro(f.key); setPage(1) }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                filtro === f.key
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                  : 'text-gray-500 border border-white/8 hover:text-gray-300'
              }`}>
              {f.label}
            </button>
          ))}
          <button onClick={load} className="p-2 rounded-xl text-gray-500 hover:text-white border border-white/8 hover:border-white/20 transition-all">
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => handleDownloadCsv(filtered, 'filtradas')}
            disabled={filtered.length === 0}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 border border-white/8 hover:text-white hover:border-white/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
            title="Descargar consultas filtradas en CSV"
          >
            <Download size={12} />
            Descargar filtradas
          </button>
          <button
            onClick={() => handleDownloadCsv(items, 'todas')}
            disabled={items.length === 0}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 border border-white/8 hover:text-white hover:border-white/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
            title="Descargar todas las consultas en CSV"
          >
            <Download size={12} />
            Descargar todas
          </button>
        </div>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="flex items-center justify-center h-48 gap-3 text-gray-600">
          <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"/>
          Cargando...
        </div>
      ) : dbError ? (
        <div className="rounded-xl p-6 text-center" style={{ background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)' }}>
          <p className="text-red-400 font-semibold mb-1">Error al cargar los datos</p>
          <p className="text-red-400/70 text-sm font-mono mb-3">{dbError}</p>
          <p className="text-gray-500 text-xs mb-4">
            Ejecutá el SQL de políticas RLS (<code className="text-purple-300">manage_authenticated</code>) en Supabase SQL Editor.
          </p>
          <button onClick={load} className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ background: 'rgba(139,92,246,.3)', border: '1px solid rgba(139,92,246,.4)' }}>
            Reintentar
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-600 text-sm">
          {items.length === 0 ? 'Aún no hay consultas registradas' : 'Sin resultados para el filtro aplicado'}
        </div>
      ) : (
        <>
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,.07)' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ background: 'rgba(255,255,255,.03)', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
                  <tr>
                    <TH w="90px">ID</TH>
                    <TH>Nombre</TH>
                    <TH>Email</TH>
                    <TH w="150px">Fecha</TH>
                    <TH w="110px">Estado</TH>
                    <TH w="130px">Recovery</TH>
                    <TH w="120px">Acciones</TH>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((c, idx) => (
                    <tr key={c.id}
                      className="transition-colors hover:bg-white/[.02] cursor-pointer"
                      style={{ borderBottom: idx < paginated.length - 1 ? '1px solid rgba(255,255,255,.05)' : 'none' }}
                      onClick={() => setSelected(c)}>

                      {/* ID */}
                      <td className="px-3 py-3">
                        <span className="font-mono text-[10px] text-gray-500">{shortId(c.id)}</span>
                      </td>

                      {/* Nombre */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-purple-300 flex-shrink-0"
                            style={{ background: 'rgba(109,40,217,.3)' }}>
                            {c.nombre?.[0]?.toUpperCase() ?? '?'}
                          </div>
                          <span className="text-white text-sm truncate max-w-[130px]">{c.nombre ?? '—'}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-3 py-3">
                        <span className="text-gray-400 text-xs truncate max-w-[160px] block">{c.email ?? '—'}</span>
                      </td>

                      {/* Fecha */}
                      <td className="px-3 py-3">
                        <span className="text-gray-500 text-xs whitespace-nowrap">{fmt(c.created_at)}</span>
                      </td>

                      {/* Estado */}
                      <td className="px-3 py-3">
                        <Badge estado={c.estado ?? 'incompleto'} />
                      </td>

                      {/* Recovery */}
                      <td className="px-3 py-3">
                        <span className="text-gray-600 text-[10px]">
                          {RECOVERY_LABELS[c.recovery_step ?? 0]}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          {/* Ver detalle */}
                          <button title="Ver detalle"
                            onClick={() => setSelected(c)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-purple-400 hover:bg-purple-400/10 transition-all">
                            <Eye size={13} />
                          </button>

                          {/* Enviar recovery */}
                          <button title="Enviar email de recuperación"
                            onClick={() => handleRecovery(c)}
                            disabled={!c.email}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-yellow-400 hover:bg-yellow-400/10 transition-all disabled:opacity-30">
                            <Send size={13} />
                          </button>

                          {/* Eliminar */}
                          <button title="Eliminar"
                            onClick={() => handleDelete(c.id)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 px-1">
              <p className="text-gray-600 text-xs">
                Mostrando {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}
              </p>
              <div className="flex gap-1">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30">
                  <ChevronLeft size={15} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .map((p, i, arr) => (
                    <>
                      {i > 0 && arr[i - 1] !== p - 1 && (
                        <span key={`ellipsis-${p}`} className="px-2 text-gray-600 text-xs self-center">…</span>
                      )}
                      <button key={p} onClick={() => setPage(p)}
                        className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                          p === page
                            ? 'bg-purple-600/40 text-purple-300 border border-purple-500/40'
                            : 'text-gray-500 hover:text-white hover:bg-white/5'
                        }`}>
                        {p}
                      </button>
                    </>
                  ))
                }
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30">
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Drawer de detalle */}
      <Drawer
        consulta={selected}
        onClose={() => setSelected(null)}
        onDelete={handleDelete}
        onRecovery={handleRecovery}
        sendingRecovery={sendingRecovery}
      />
    </div>
  )
}
