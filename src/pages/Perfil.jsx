import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Star, MessageCircle, Phone, ChevronLeft, MapPin,
  CheckCircle, XCircle, Shield, Lock, ChevronDown, ChevronUp
} from 'lucide-react'
import { TAROTISTAS } from '../data/tarotistas'
import Header from '../components/Header'
import Footer from '../components/Footer'

const ESTADO_CONFIG = {
  online: { dot: 'bg-green-400', label: 'EN LÍNEA', color: 'text-green-400 bg-green-400/10 border-green-400/30' },
  disponible_hoy: { dot: 'bg-yellow-400', label: 'DISPONIBLE HOY', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' },
  solo_reserva: { dot: 'bg-gray-400', label: 'SOLO CON RESERVA', color: 'text-gray-400 bg-gray-400/10 border-gray-400/30' },
}

const CHIP_COLORS = [
  'bg-purple-700/20 text-purple-300 border-purple-500/30',
  'bg-indigo-700/20 text-indigo-300 border-indigo-500/30',
  'bg-pink-700/20 text-pink-300 border-pink-500/30',
  'bg-blue-700/20 text-blue-300 border-blue-500/30',
  'bg-violet-700/20 text-violet-300 border-violet-500/30',
  'bg-fuchsia-700/20 text-fuchsia-300 border-fuchsia-500/30',
]

export default function Perfil() {
  const { id } = useParams()
  const t = TAROTISTAS.find(x => x.id === id)
  const [verMasReseñas, setVerMasReseñas] = useState(false)

  if (!t) {
    return (
      <div className="bg-[#050511] min-h-screen flex items-center justify-center">
        <Header />
        <div className="text-center">
          <p className="text-white text-xl mb-4">Tarotista no encontrado.</p>
          <Link to="/tarotistas" className="text-purple-400 hover:text-purple-300 transition-colors">
            ← Volver al directorio
          </Link>
        </div>
      </div>
    )
  }

  const estado = ESTADO_CONFIG[t.estado] ?? ESTADO_CONFIG.solo_reserva

  return (
    <div className="bg-[#050511] min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Back */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <Link
            to="/tarotistas"
            className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors"
          >
            <ChevronLeft size={15} /> Volver al directorio
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* ─── Main column ─────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Header block */}
              <div className="bg-[#0D0B2B] border border-white/8 rounded-2xl p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Photo */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={t.foto}
                      alt={t.nombre}
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover"
                    />
                    <span className={`absolute -bottom-1.5 -right-1.5 w-4 h-4 rounded-full border-2 border-[#0D0B2B] ${estado.dot}`} />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                      <div>
                        <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-white">{t.nombre}</h1>
                        <div className="flex items-center gap-1.5 mt-1">
                          <MapPin size={13} className="text-purple-400" />
                          <span className="text-gray-400 text-sm">Tarotista en {t.ciudad}, {t.pais}</span>
                        </div>
                      </div>
                      <span className={`text-xs font-bold tracking-wider px-3 py-1.5 rounded-full border ${estado.color}`}>
                        {estado.label}
                      </span>
                    </div>

                    <p className="text-gray-300 text-sm italic mb-3">"{t.tagline}"</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {t.etiquetas.map((e, i) => (
                        <span key={i} className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-purple-600/15 text-purple-300 border-purple-500/25">
                          {e}
                        </span>
                      ))}
                    </div>

                    {/* Stats row */}
                    <div className="flex flex-wrap gap-5">
                      <div className="flex items-center gap-1.5">
                        <div className="flex">
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} size={14} className={i <= Math.round(t.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'} />
                          ))}
                        </div>
                        <span className="text-yellow-400 font-bold text-lg">{t.rating.toFixed(1)}</span>
                      </div>
                      <div className="text-gray-400 text-sm">
                        <span className="text-white font-semibold">{t.lecturas.toLocaleString('es-AR')}</span> lecturas desde {t.desde}
                      </div>
                      <div className="text-gray-400 text-sm">
                        <span className="text-white font-semibold">{t.reseñas.toLocaleString('es-AR')}</span> opiniones
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sobre sus servicios */}
              <div className="bg-[#0D0B2B] border border-white/8 rounded-2xl p-6 sm:p-8 space-y-6">
                <section>
                  <h2 className="font-playfair text-xl font-bold text-white mb-3">Sobre mis servicios</h2>
                  <p className="text-gray-400 text-sm leading-relaxed">{t.descripcionServicios}</p>
                </section>

                <div className="border-t border-white/8" />

                <section>
                  <h2 className="font-playfair text-xl font-bold text-white mb-3">Sobre mí</h2>
                  <p className="text-gray-400 text-sm leading-relaxed">{t.sobreMi}</p>
                </section>

                {t.serviciosAdicionales.length > 0 && (
                  <>
                    <div className="border-t border-white/8" />
                    <section>
                      <h2 className="font-playfair text-xl font-bold text-white mb-3">Servicios adicionales</h2>
                      <ul className="space-y-2">
                        {t.serviciosAdicionales.map((s, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-gray-300 text-sm">
                            <CheckCircle size={14} className="text-purple-400 flex-shrink-0 mt-0.5" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </section>
                  </>
                )}

                <div className="border-t border-white/8" />

                <section>
                  <h2 className="font-playfair text-xl font-bold text-white mb-3">No realizo lecturas sobre</h2>
                  <ul className="space-y-2">
                    {t.noRealiza.map((s, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-gray-400 text-sm">
                        <XCircle size={14} className="text-red-400/60 flex-shrink-0 mt-0.5" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              {/* Especialidades */}
              <div className="bg-[#0D0B2B] border border-white/8 rounded-2xl p-6 sm:p-8">
                <h2 className="font-playfair text-xl font-bold text-white mb-4">Especialidades</h2>
                <div className="flex flex-wrap gap-2">
                  {t.especialidades.map((e, i) => (
                    <span key={i} className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${CHIP_COLORS[i % CHIP_COLORS.length]}`}>
                      {e}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <p className="text-gray-500 text-xs w-full mb-1">Métodos que usa</p>
                  {t.metodos.map((m, i) => (
                    <span key={i} className="text-xs text-gray-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reseñas */}
              <div className="bg-[#0D0B2B] border border-white/8 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-playfair text-xl font-bold text-white">
                    Lo que dicen los clientes
                  </h2>
                  <div className="flex items-center gap-1.5">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-yellow-400 font-bold">{t.rating.toFixed(1)}</span>
                    <span className="text-gray-500 text-sm">({t.reseñas.toLocaleString('es-AR')})</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {(verMasReseñas ? t.reseñasRecientes : t.reseñasRecientes.slice(0, 3)).map((r, i) => (
                    <div key={i} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-purple-600/30 border border-purple-500/30 flex items-center justify-center text-purple-300 text-xs font-bold">
                            {r.nombre[0]}
                          </div>
                          <span className="text-white text-sm font-medium">{r.nombre}</span>
                        </div>
                        <span className="text-gray-500 text-xs">{r.fecha}</span>
                      </div>
                      <div className="flex gap-0.5 mb-1.5 ml-10">
                        {[1,2,3,4,5].map(i => <Star key={i} size={11} className="fill-yellow-400 text-yellow-400" />)}
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed ml-10">"{r.comentario}"</p>
                    </div>
                  ))}
                </div>

                {t.reseñasRecientes.length > 3 && (
                  <button
                    className="mt-4 text-purple-400 hover:text-purple-300 text-sm font-semibold flex items-center gap-1 transition-colors"
                    onClick={() => setVerMasReseñas(!verMasReseñas)}
                  >
                    {verMasReseñas ? (
                      <><ChevronUp size={14} /> Ver menos reseñas</>
                    ) : (
                      <><ChevronDown size={14} /> Ver todas las reseñas</>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* ─── Sticky CTA column ───────────────────────────────── */}
            <div className="space-y-4 lg:sticky lg:top-24">
              {/* Promo badge */}
              {t.minutosGratis > 0 && (
                <div className="bg-purple-700/20 border border-purple-500/30 rounded-2xl p-4 text-sm text-purple-200 leading-relaxed">
                  🎁 <strong>Nuevos clientes:</strong> {t.minutosGratis} minutos gratis{' '}
                  {t.descuentoPromo > 0 && `+ ${t.descuentoPromo}% de descuento`} en tu primera lectura con {t.nombre.split(' ')[0]}.
                </div>
              )}

              {/* Precios */}
              <div className="bg-[#0D0B2B] border border-white/8 rounded-2xl p-6">
                <h3 className="font-playfair text-white font-bold text-lg mb-4">Precios</h3>
                <div className="space-y-3 mb-5">
                  {t.precioLlamada && (
                    <div className="flex items-center justify-between py-3 border-b border-white/8">
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-purple-400" />
                        <span className="text-gray-300 text-sm">Llamada</span>
                      </div>
                      <div className="text-right">
                        {t.precioPromoLlamada ? (
                          <div>
                            <span className="text-gray-500 text-xs line-through">${t.precioLlamada.toLocaleString('es-AR')}</span>
                            <span className="text-white font-bold text-sm ml-2">${t.precioPromoLlamada.toLocaleString('es-AR')}</span>
                            <span className="text-gray-400 text-xs">/min</span>
                          </div>
                        ) : (
                          <span className="text-white font-bold text-sm">${t.precioLlamada.toLocaleString('es-AR')}<span className="text-gray-400 font-normal text-xs">/min</span></span>
                        )}
                      </div>
                    </div>
                  )}
                  {t.precioChat && (
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-2">
                        <MessageCircle size={14} className="text-purple-400" />
                        <span className="text-gray-300 text-sm">Chat</span>
                      </div>
                      <div className="text-right">
                        {t.precioPromoChat ? (
                          <div>
                            <span className="text-gray-500 text-xs line-through">${t.precioChat.toLocaleString('es-AR')}</span>
                            <span className="text-white font-bold text-sm ml-2">${t.precioPromoChat.toLocaleString('es-AR')}</span>
                            <span className="text-gray-400 text-xs">/min</span>
                          </div>
                        ) : (
                          <span className="text-white font-bold text-sm">${t.precioChat.toLocaleString('es-AR')}<span className="text-gray-400 font-normal text-xs">/min</span></span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2.5">
                  {t.canales.includes('Chat') && (
                    <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm">
                      <MessageCircle size={16} />
                      Chatear con {t.nombre.split(' ')[0]} ahora
                    </button>
                  )}
                  {t.canales.includes('Llamada') && (
                    <button className="w-full border border-purple-500/40 hover:border-purple-400 hover:bg-purple-900/20 text-purple-300 font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all text-sm">
                      <Phone size={16} />
                      Llamar a {t.nombre.split(' ')[0]} ahora
                    </button>
                  )}
                </div>

                <p className="text-gray-500 text-xs text-center mt-4 leading-relaxed">
                  Pagás solo el tiempo de tu consulta. Lecturas 100% privadas.
                </p>
              </div>

              {/* Trust signals */}
              <div className="bg-[#0D0B2B] border border-white/8 rounded-2xl p-5 space-y-3">
                {[
                  { icon: <Lock size={14} />, text: 'Sesión 100% confidencial' },
                  { icon: <Shield size={14} />, text: 'Tarotista verificado por TarotYa' },
                  { icon: <Star size={14} className="fill-yellow-400 text-yellow-400" />, text: `${t.reseñas.toLocaleString('es-AR')} clientes satisfechos` },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-gray-400 text-xs">
                    <span className="text-purple-400">{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>

              {/* CTA bottom */}
              <div className="bg-purple-700/10 border border-purple-500/20 rounded-2xl p-5 text-center">
                <p className="text-purple-200 text-sm font-semibold mb-1">
                  {t.nombre.split(' ')[0]} está listo para ayudarte hoy.
                </p>
                <p className="text-gray-500 text-xs">Sin esperas. Conectate cuando quieras.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
