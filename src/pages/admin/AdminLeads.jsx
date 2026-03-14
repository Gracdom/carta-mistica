import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Mail, Phone, Globe, Sparkles, AlertCircle, Trash2, RefreshCw } from 'lucide-react'

const ESTADOS = {
  nuevo:       { label: 'Nuevo',       bg: 'rgba(124,58,237,.15)', border: 'rgba(139,92,246,.4)', text: '#c4b5fd' },
  contactado:  { label: 'Contactado',  bg: 'rgba(59,130,246,.12)', border: 'rgba(96,165,250,.4)', text: '#60a5fa' },
  convertido:  { label: 'Convertido',  bg: 'rgba(52,211,153,.12)', border: 'rgba(52,211,153,.4)', text: '#34d399' },
  descartado:  { label: 'Descartado',  bg: 'rgba(107,114,128,.1)', border: 'rgba(107,114,128,.3)', text: '#6b7280' },
}

const FILTROS = [
  { key: 'todos',      label: 'Todos'      },
  { key: 'nuevo',      label: 'Nuevos'     },
  { key: 'contactado', label: 'Contactados'},
  { key: 'convertido', label: 'Convertidos'},
  { key: 'descartado', label: 'Descartados'},
]

export default function AdminLeads() {
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [filtro, setFiltro]     = useState('todos')
  const [expanded, setExpanded] = useState(null)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('leads_tarotistas')
      .select('*')
      .order('created_at', { ascending: false })
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const updateEstado = async (id, estado) => {
    await supabase.from('leads_tarotistas').update({ estado }).eq('id', id)
    setItems(items.map(i => i.id === id ? { ...i, estado } : i))
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este lead?')) return
    await supabase.from('leads_tarotistas').delete().eq('id', id)
    setItems(items.filter(i => i.id !== id))
  }

  const filtered = filtro === 'todos' ? items : items.filter(i => i.estado === filtro)

  const counts = {
    todos:      items.length,
    nuevo:      items.filter(i => i.estado === 'nuevo').length,
    contactado: items.filter(i => i.estado === 'contactado').length,
    convertido: items.filter(i => i.estado === 'convertido').length,
    descartado: items.filter(i => i.estado === 'descartado').length,
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-white mb-1">Leads Tarotistas</h1>
          <p className="text-gray-500 text-sm">Tarotistas interesadas en unirse a la plataforma</p>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-xl border border-white/8 hover:border-white/15">
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Actualizar
        </button>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total',       value: counts.todos,      color: '#c4b5fd' },
          { label: 'Nuevos',      value: counts.nuevo,      color: '#c4b5fd' },
          { label: 'Contactados', value: counts.contactado, color: '#60a5fa' },
          { label: 'Convertidos', value: counts.convertido, color: '#34d399' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl px-4 py-3"
            style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.06)' }}>
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
            <p className="text-gray-500 text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-5">
        {FILTROS.map(f => (
          <button key={f.key} onClick={() => setFiltro(f.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filtro === f.key
                ? 'bg-purple-600/25 text-purple-300 border border-purple-500/40'
                : 'text-gray-400 hover:text-white border border-white/8 hover:border-white/15'
            }`}>
            {f.label}
            <span className="ml-1.5 text-xs opacity-60">({counts[f.key] ?? items.length})</span>
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
          <p className="text-gray-500 text-sm">No hay leads {filtro !== 'todos' ? `"${filtro}"` : ''}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(s => {
            const estado = s.estado ?? 'nuevo'
            const badge  = ESTADOS[estado] ?? ESTADOS.nuevo
            const isOpen = expanded === s.id

            return (
              <div key={s.id} className="rounded-xl overflow-hidden transition-all"
                style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.07)' }}>

                {/* Fila resumen */}
                <div className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-white/[.02]"
                  onClick={() => setExpanded(isOpen ? null : s.id)}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-purple-300 flex-shrink-0"
                    style={{ background: 'rgba(109,40,217,.25)' }}>
                    {s.nombre?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{s.nombre}</p>
                    <p className="text-gray-500 text-xs truncate">{s.email} · {s.especialidad || '—'} · {s.pais || '—'}</p>
                  </div>
                  <span className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{ background: badge.bg, border: `1px solid ${badge.border}`, color: badge.text }}>
                    <Sparkles size={10} /> {badge.label}
                  </span>
                  <p className="text-gray-600 text-xs hidden md:block flex-shrink-0">
                    {s.created_at ? new Date(s.created_at).toLocaleDateString('es-AR') : '—'}
                  </p>
                </div>

                {/* Detalle */}
                {isOpen && (
                  <div className="px-5 pb-5 border-t" style={{ borderColor: 'rgba(255,255,255,.07)' }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 mb-4 text-sm">
                      {s.email && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <Mail size={13} className="text-purple-400 flex-shrink-0" />
                          <a href={`mailto:${s.email}`} className="hover:text-white transition-colors truncate">{s.email}</a>
                        </div>
                      )}
                      {s.whatsapp && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <Phone size={13} className="text-green-400 flex-shrink-0" />
                          <a href={`https://wa.me/${s.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                            className="hover:text-green-400 transition-colors">{s.whatsapp}</a>
                        </div>
                      )}
                      {s.pais && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <Globe size={13} className="text-purple-400 flex-shrink-0" /> {s.pais}
                        </div>
                      )}
                      {s.especialidad && (
                        <div className="text-gray-300">
                          <span className="text-gray-500 text-xs">Especialidad:</span> {s.especialidad}
                        </div>
                      )}
                      {s.experiencia && (
                        <div className="text-gray-300">
                          <span className="text-gray-500 text-xs">Experiencia:</span> {s.experiencia}
                        </div>
                      )}
                    </div>
                    {s.mensaje && (
                      <div className="mb-4 p-3 rounded-lg text-sm text-gray-300 leading-relaxed"
                        style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                        {s.mensaje}
                      </div>
                    )}

                    {/* Acciones de estado */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {Object.entries(ESTADOS).map(([key, { label, bg, border, text }]) => (
                        <button key={key} onClick={() => updateEstado(s.id, key)} disabled={estado === key}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all disabled:opacity-40"
                          style={{ background: bg, border: `1px solid ${border}`, color: text }}>
                          {label}
                        </button>
                      ))}
                      <a href={`mailto:${s.email}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all ml-auto"
                        style={{ background: 'rgba(124,58,237,.15)', border: '1px solid rgba(139,92,246,.3)', color: '#c4b5fd' }}>
                        <Mail size={12} /> Enviar email
                      </a>
                      <button onClick={() => handleDelete(s.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all"
                        style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', color: '#6b7280' }}>
                        <Trash2 size={12} /> Eliminar
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
