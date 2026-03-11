import { Link } from 'react-router-dom'
import { Star, MessageCircle, Phone } from 'lucide-react'

const ESTADO_CONFIG = {
  online: { dot: 'bg-green-400', label: 'EN LÍNEA', color: 'text-green-400' },
  disponible_hoy: { dot: 'bg-yellow-400', label: 'DISPONIBLE HOY', color: 'text-yellow-400' },
  solo_reserva: { dot: 'bg-gray-400', label: 'SOLO CON RESERVA', color: 'text-gray-400' },
}

const ETIQUETA_STYLES = {
  'Tendencia': 'bg-purple-600/20 text-purple-300 border-purple-500/30',
  'Nuevo': 'bg-blue-600/20 text-blue-300 border-blue-500/30',
  'Top en Amor y Relaciones': 'bg-pink-600/20 text-pink-300 border-pink-500/30',
  'Top en Trabajo y Dinero': 'bg-yellow-600/20 text-yellow-300 border-yellow-500/30',
  'Top en Karma': 'bg-orange-600/20 text-orange-300 border-orange-500/30',
}

export default function TarotistCard({ t, compact = false }) {
  const estado = ESTADO_CONFIG[t.estado] ?? ESTADO_CONFIG.solo_reserva

  return (
    <div className="bg-[#0D0B2B] border border-white/8 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 flex flex-col group">
      {/* Header card */}
      <div className="p-5 flex gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <img
            src={t.foto}
            alt={t.nombre}
            className="w-16 h-16 rounded-xl object-cover"
          />
          <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#0D0B2B] ${estado.dot}`} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-white font-semibold text-base leading-tight group-hover:text-purple-200 transition-colors">
                {t.nombre}
              </h3>
              <p className="text-gray-500 text-xs mt-0.5">{t.ciudad}, {t.pais}</p>
            </div>
            <span className={`text-[10px] font-bold tracking-wider flex-shrink-0 mt-0.5 ${estado.color}`}>
              {estado.label}
            </span>
          </div>
          <p className="text-gray-400 text-xs mt-1.5 leading-snug line-clamp-2">{t.tagline}</p>
        </div>
      </div>

      {/* Tags */}
      <div className="px-5 flex flex-wrap gap-1.5 mb-3">
        {t.etiquetas.slice(0, 2).map(e => (
          <span
            key={e}
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${ETIQUETA_STYLES[e] ?? 'bg-white/5 text-gray-400 border-white/10'}`}
          >
            {e}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="px-5 flex items-center gap-3 mb-3">
        <div className="flex items-center gap-1">
          <Star size={12} className="fill-yellow-400 text-yellow-400" />
          <span className="text-yellow-400 text-xs font-bold">{t.rating.toFixed(1)}</span>
        </div>
        <span className="text-gray-600 text-xs">
          {t.reseñas.toLocaleString('es-AR')} opiniones
        </span>
        <span className="text-gray-600 text-[11px]">
          {t.lecturas.toLocaleString('es-AR')} lecturas desde {t.desde}
        </span>
      </div>

      {/* Precio */}
      <div className="px-5 mb-4">
        <p className="text-white text-sm">
          <span className="font-bold">
            Desde ${t.precioPorMinuto.toLocaleString('es-AR')}
          </span>
          <span className="text-gray-400 text-xs"> /min</span>
        </p>
        {t.badge && (
          <span className="inline-block mt-1 text-[10px] font-semibold text-purple-300 bg-purple-700/20 border border-purple-500/30 px-2 py-0.5 rounded-full">
            🎁 {t.badge}
          </span>
        )}
      </div>

      {/* Canales */}
      <div className="px-5 pb-5 mt-auto flex gap-2">
        {t.canales.includes('Chat') && (
          <Link
            to={`/tarotistas/${t.id}`}
            className="flex-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold py-2.5 rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors"
          >
            <MessageCircle size={13} />
            Chat ahora
          </Link>
        )}
        {t.canales.includes('Llamada') && (
          <Link
            to={`/tarotistas/${t.id}`}
            className={`flex-1 border border-purple-500/40 hover:border-purple-400 hover:bg-purple-900/20 text-purple-300 text-xs font-semibold py-2.5 rounded-xl text-center flex items-center justify-center gap-1.5 transition-all ${!t.canales.includes('Chat') ? 'bg-purple-600 hover:bg-purple-500 text-white border-transparent' : ''}`}
          >
            <Phone size={13} />
            Llamar
          </Link>
        )}
      </div>
    </div>
  )
}
