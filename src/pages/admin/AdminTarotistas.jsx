import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Plus, Search, Edit2, Trash2, Star, Globe, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

const ESTADO_BADGE = {
  online:           { label: 'Online',       bg: 'rgba(52,211,153,.15)', border: 'rgba(52,211,153,.4)',  text: '#34d399' },
  disponible_hoy:   { label: 'Disponible',   bg: 'rgba(251,191,36,.15)', border: 'rgba(251,191,36,.4)',  text: '#fbbf24' },
  solo_reserva:     { label: 'Solo reserva', bg: 'rgba(148,163,184,.1)', border: 'rgba(148,163,184,.3)', text: '#94a3b8' },
}

export default function AdminTarotistas() {
  const [tarotistas, setTarotistas] = useState([])
  const [filtered, setFiltered]     = useState([])
  const [search, setSearch]         = useState('')
  const [loading, setLoading]       = useState(true)
  const [deleting, setDeleting]     = useState(null)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('tarotistas').select('*').order('nombre')
    setTarotistas(data ?? [])
    setFiltered(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(tarotistas.filter(t =>
      t.nombre?.toLowerCase().includes(q) ||
      t.pais?.toLowerCase().includes(q) ||
      t.especialidades?.join(' ').toLowerCase().includes(q)
    ))
  }, [search, tarotistas])

  const handleDelete = async (id, nombre) => {
    if (!confirm(`¿Eliminar a ${nombre}? Esta acción no se puede deshacer.`)) return
    setDeleting(id)
    await supabase.from('tarotistas').delete().eq('id', id)
    await load()
    setDeleting(null)
  }

  const toggleActivo = async (t) => {
    await supabase.from('tarotistas').update({ activo: !t.activo }).eq('id', t.id)
    await load()
  }

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-white mb-1">Tarotistas</h1>
          <p className="text-gray-500 text-sm">{filtered.length} de {tarotistas.length} tarotistas</p>
        </div>
        <Link to="/admin/tarotistas/nuevo"
          className="inline-flex items-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all"
          style={{ background: 'linear-gradient(135deg,#6d28d9,#9333ea)', boxShadow: '0 0 20px rgba(139,92,246,.3)' }}>
          <Plus size={16} /> Nuevo tarotista
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre, país, especialidad..."
          className="w-full bg-white/4 border border-white/10 focus:border-purple-500/50 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 outline-none transition-all text-sm"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,.07)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'rgba(255,255,255,.03)', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
                <th className="text-left text-gray-400 font-semibold px-5 py-3.5">Tarotista</th>
                <th className="text-left text-gray-400 font-semibold px-4 py-3.5 hidden sm:table-cell">País</th>
                <th className="text-left text-gray-400 font-semibold px-4 py-3.5 hidden md:table-cell">Estado</th>
                <th className="text-left text-gray-400 font-semibold px-4 py-3.5 hidden lg:table-cell">Rating</th>
                <th className="text-left text-gray-400 font-semibold px-4 py-3.5">Activo</th>
                <th className="text-right text-gray-400 font-semibold px-5 py-3.5">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
              {filtered.map(t => {
                const badge = ESTADO_BADGE[t.estado] ?? ESTADO_BADGE.solo_reserva
                return (
                  <tr key={t.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {t.foto_url ? (
                          <img src={t.foto_url} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-purple-300 flex-shrink-0"
                            style={{ background: 'rgba(109,40,217,.25)' }}>
                            {t.nombre?.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-white font-medium truncate">{t.nombre}</p>
                          <p className="text-gray-500 text-xs truncate">{t.tagline}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className="text-gray-300 flex items-center gap-1.5">
                        <Globe size={12} className="text-gray-500" /> {t.pais}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: badge.bg, border: `1px solid ${badge.border}`, color: badge.text }}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className="flex items-center gap-1 text-yellow-400">
                        <Star size={12} className="fill-yellow-400" />
                        {t.rating?.toFixed(1) ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button onClick={() => toggleActivo(t)}
                        className="transition-colors"
                        title={t.activo ? 'Desactivar' : 'Activar'}>
                        {t.activo
                          ? <CheckCircle size={18} className="text-green-400" />
                          : <XCircle size={18} className="text-gray-600" />}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/tarotistas/${t.id}`}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/8 transition-all"
                          title="Editar">
                          <Edit2 size={14} />
                        </Link>
                        <button onClick={() => handleDelete(t.id, t.nombre)} disabled={deleting === t.id}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-40"
                          title="Eliminar">
                          {deleting === t.id
                            ? <span className="w-3.5 h-3.5 border border-gray-500/40 border-t-gray-400 rounded-full animate-spin" />
                            : <Trash2 size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <AlertCircle size={20} className="text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No se encontraron tarotistas</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
