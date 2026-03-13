import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Users, Star, FileText, TrendingUp, ArrowRight, Clock } from 'lucide-react'

function StatCard({ icon: Icon, label, value, color, to }) {
  const card = (
    <div className="rounded-xl p-5 flex items-center gap-4 transition-all hover:scale-[1.02]"
      style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: color + '22', border: `1px solid ${color}44` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-gray-500 text-xs font-medium mb-0.5">{label}</p>
        <p className="text-white text-2xl font-bold font-playfair">{value ?? '—'}</p>
      </div>
      {to && <ArrowRight size={14} className="text-gray-600 flex-shrink-0" />}
    </div>
  )
  return to ? <Link to={to}>{card}</Link> : card
}

export default function Dashboard() {
  const [stats, setStats] = useState({})
  const [solicitudes, setSolicitudes] = useState([])
  const [resenas, setResenas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [
        { count: totalTarotistas },
        { count: totalResenas },
        { count: totalSolicitudes },
        { data: ultSolicitudes },
        { data: ultResenas },
      ] = await Promise.all([
        supabase.from('tarotistas').select('*', { count: 'exact', head: true }),
        supabase.from('resenas').select('*', { count: 'exact', head: true }),
        supabase.from('solicitudes_tarotista').select('*', { count: 'exact', head: true }),
        supabase.from('solicitudes_tarotista').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('resenas').select('*').order('created_at', { ascending: false }).limit(5),
      ])
      setStats({ totalTarotistas, totalResenas, totalSolicitudes })
      setSolicitudes(ultSolicitudes ?? [])
      setResenas(ultResenas ?? [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-gray-500 text-sm">Resumen general de Carta Mística</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatCard icon={Users}    label="Tarotistas"          value={stats.totalTarotistas}  color="#a78bfa" to="/admin/tarotistas" />
        <StatCard icon={FileText} label="Solicitudes"         value={stats.totalSolicitudes} color="#34d399" to="/admin/solicitudes" />
        <StatCard icon={Star}     label="Reseñas"             value={stats.totalResenas}     color="#fbbf24" to="/admin/resenas" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimas solicitudes */}
        <div className="rounded-xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.07)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b"
            style={{ borderColor: 'rgba(255,255,255,.07)' }}>
            <div className="flex items-center gap-2">
              <FileText size={15} className="text-green-400" />
              <span className="text-white text-sm font-semibold">Últimas solicitudes</span>
            </div>
            <Link to="/admin/solicitudes" className="text-purple-400 hover:text-purple-300 text-xs transition-colors">
              Ver todas →
            </Link>
          </div>
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
            {solicitudes.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-8">Sin solicitudes aún</p>
            )}
            {solicitudes.map((s, i) => (
              <div key={i} className="px-5 py-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-purple-300 flex-shrink-0"
                  style={{ background: 'rgba(109,40,217,.25)' }}>
                  {s.nombre?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{s.nombre}</p>
                  <p className="text-gray-500 text-xs truncate">{s.email}</p>
                </div>
                <div className="flex items-center gap-1 text-gray-600 text-xs flex-shrink-0">
                  <Clock size={11} />
                  {s.created_at ? new Date(s.created_at).toLocaleDateString('es-AR') : '—'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Últimas reseñas */}
        <div className="rounded-xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.07)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b"
            style={{ borderColor: 'rgba(255,255,255,.07)' }}>
            <div className="flex items-center gap-2">
              <Star size={15} className="text-yellow-400" />
              <span className="text-white text-sm font-semibold">Últimas reseñas</span>
            </div>
            <Link to="/admin/resenas" className="text-purple-400 hover:text-purple-300 text-xs transition-colors">
              Ver todas →
            </Link>
          </div>
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
            {resenas.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-8">Sin reseñas aún</p>
            )}
            {resenas.map((r, i) => (
              <div key={i} className="px-5 py-3.5">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-white text-sm font-medium">{r.autor || 'Anónimo'}</p>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={11} className={j < (r.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-400 text-xs line-clamp-2">{r.texto || r.comentario || '—'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
