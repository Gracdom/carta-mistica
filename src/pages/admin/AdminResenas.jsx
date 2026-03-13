import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Star, Trash2, AlertCircle, Search } from 'lucide-react'

export default function AdminResenas() {
  const [resenas, setResenas]   = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch]     = useState('')
  const [loading, setLoading]   = useState(true)
  const [deleting, setDeleting] = useState(null)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('resenas')
      .select('*, tarotistas(nombre)')
      .order('created_at', { ascending: false })
    setResenas(data ?? [])
    setFiltered(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(resenas.filter(r =>
      r.autor?.toLowerCase().includes(q) ||
      r.texto?.toLowerCase().includes(q) ||
      r.comentario?.toLowerCase().includes(q) ||
      r.tarotistas?.nombre?.toLowerCase().includes(q)
    ))
  }, [search, resenas])

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta reseña?')) return
    setDeleting(id)
    await supabase.from('resenas').delete().eq('id', id)
    setResenas(r => r.filter(i => i.id !== id))
    setDeleting(null)
  }

  const Stars = ({ n = 0 }) => (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={12} className={i < n ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700'} />
      ))}
    </div>
  )

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-white mb-1">Reseñas</h1>
        <p className="text-gray-500 text-sm">{filtered.length} de {resenas.length} reseñas</p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por autor, tarotista o contenido..."
          className="w-full bg-white/4 border border-white/10 focus:border-purple-500/50 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 outline-none transition-all text-sm" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <AlertCircle size={24} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No hay reseñas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => (
            <div key={r.id} className="rounded-xl p-5 flex gap-4"
              style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.07)' }}>
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-yellow-300 flex-shrink-0 mt-0.5"
                style={{ background: 'rgba(251,191,36,.15)' }}>
                {r.autor?.charAt(0)?.toUpperCase() ?? '?'}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1 flex-wrap">
                  <div>
                    <span className="text-white text-sm font-medium">{r.autor ?? 'Anónimo'}</span>
                    {r.tarotistas?.nombre && (
                      <span className="text-gray-500 text-xs ml-2">→ {r.tarotistas.nombre}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Stars n={r.rating} />
                    <span className="text-gray-600 text-xs">
                      {r.created_at ? new Date(r.created_at).toLocaleDateString('es-AR') : '—'}
                    </span>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{r.texto ?? r.comentario ?? '—'}</p>
              </div>

              <button onClick={() => handleDelete(r.id)} disabled={deleting === r.id}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0 mt-0.5 disabled:opacity-40"
                title="Eliminar reseña">
                {deleting === r.id
                  ? <span className="w-3.5 h-3.5 border border-gray-500/40 border-t-gray-400 rounded-full animate-spin" />
                  : <Trash2 size={14} />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
