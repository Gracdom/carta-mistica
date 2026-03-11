import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle, Star, Users, TrendingUp, Shield, Globe,
  CreditCard, ArrowRight, ChevronLeft, Sparkles
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const BENEFICIOS = [
  { icon: <Globe size={20} />, titulo: 'Perfil con URL única', desc: 'Tu propia página personalizada, optimizada para buscadores, que podés compartir donde quieras.' },
  { icon: <Star size={20} />, titulo: 'Reputación verificada', desc: 'Sistema de reseñas automático. Cada cliente puede dejar su opinión, aumentando tu credibilidad.' },
  { icon: <CreditCard size={20} />, titulo: 'Cobros y facturación', desc: 'Soporte completo para recibir pagos online. Trabajamos con los principales medios de pago locales.' },
  { icon: <Globe size={20} />, titulo: 'Visibilidad latinoamericana', desc: 'Llegá a consultantes de Argentina, Chile, México y toda la comunidad latina en el exterior.' },
  { icon: <TrendingUp size={20} />, titulo: 'Estadísticas de tu perfil', desc: 'Tablero con visitas, conversiones y reseñas para que optimices tu presencia.' },
  { icon: <Shield size={20} />, titulo: 'Soporte dedicado', desc: 'Equipo de soporte disponible para ayudarte con todo lo que necesites.' },
]

const PASOS = [
  { n: '01', titulo: 'Registrarte', desc: 'Completá el formulario con tus datos básicos. Solo lleva 5 minutos.' },
  { n: '02', titulo: 'Verificación', desc: 'Nuestro equipo revisa tu solicitud en 24-48 hs hábiles.' },
  { n: '03', titulo: 'Activar perfil', desc: 'Completás tu perfil con foto, descripción y precios.' },
  { n: '04', titulo: 'Recibir clientes', desc: 'Empezás a aparecer en el directorio y a recibir consultas.' },
]

export default function Unirse() {
  const [form, setForm] = useState({
    nombre: '', email: '', whatsapp: '', pais: 'Argentina',
    especialidad: '', modelo: 'comision', mensaje: ''
  })
  const [enviado, setEnviado] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = e => { e.preventDefault(); setEnviado(true) }

  return (
    <div className="bg-[#050511] min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Page header */}
        <div
          className="py-14 sm:py-20 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0D0B2B 0%, #050511 100%)' }}
        >
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 80% at 70% 50%, rgba(124,58,237,0.15) 0%, transparent 60%)' }} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
            <Link to="/" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors mb-6">
              <ChevronLeft size={15} /> Volver al inicio
            </Link>
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-purple-700/20 border border-purple-500/30 rounded-full px-4 py-1.5 mb-5">
                <Sparkles size={13} className="text-purple-400" />
                <span className="text-purple-300 text-xs font-semibold">Para tarotistas y videntes profesionales</span>
              </div>
              <h1 className="font-playfair text-3xl sm:text-5xl font-bold text-white leading-tight mb-5">
                ¿Sos tarotista?{' '}
                <span className="text-purple-400">Sumate y conseguí más consultantes</span>
              </h1>
              <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
                Llegá a miles de personas en Argentina, Chile, México y toda la comunidad latina del mundo.
                Vos elegís el modelo que mejor se adapta a tu forma de trabajar.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">

          {/* Modelos de precio */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <p className="text-purple-400 text-xs font-semibold tracking-widest uppercase mb-3">Sin letra chica</p>
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white">
                Elegís cómo trabajar
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* Opción 1 */}
              <div className="bg-[#0D0B2B] border border-white/10 rounded-2xl p-8">
                <div className="inline-block bg-purple-700/20 border border-purple-500/30 text-purple-300 text-xs font-bold px-3 py-1 rounded-full mb-5 uppercase tracking-wide">
                  Opción 1 — Suscripción
                </div>
                <h3 className="font-playfair text-white text-2xl font-bold mb-3">Destacado mensual</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-5">
                  Aparecés destacado en el directorio. <strong className="text-white">Sin comisión por cliente.</strong>{' '}
                  Pagás una tarifa mensual fija y te quedás con el 100% de lo que gana cada lectura.
                </p>
                <div className="border-t border-white/8 pt-5">
                  <p className="text-white font-bold text-3xl font-playfair">
                    Consultar<span className="text-gray-400 font-normal text-base ml-2">precio</span>
                  </p>
                  <p className="text-gray-500 text-xs mt-1">Precio variable según país</p>
                </div>
                <ul className="mt-5 space-y-2">
                  {['Perfil destacado en búsquedas', 'Sin comisión por lectura', 'Soporte prioritario'].map(b => (
                    <li key={b} className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircle size={14} className="text-purple-400 flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Opción 2 */}
              <div className="bg-purple-700/15 border border-purple-500/30 rounded-2xl p-8 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Más popular
                </div>
                <div className="inline-block bg-green-700/20 border border-green-500/30 text-green-300 text-xs font-bold px-3 py-1 rounded-full mb-5 uppercase tracking-wide">
                  Opción 2 — Sin costo fijo
                </div>
                <h3 className="font-playfair text-white text-2xl font-bold mb-3">Solo comisión</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-5">
                  <strong className="text-white">Sin suscripción mensual.</strong> Registrarte es gratis.
                  Pagás solo una comisión por cada lectura realizada. Ideal para empezar sin riesgo.
                </p>
                <div className="border-t border-purple-500/20 pt-5">
                  <p className="text-white font-bold text-3xl font-playfair">
                    Gratis<span className="text-gray-400 font-normal text-base ml-2">para empezar</span>
                  </p>
                  <p className="text-gray-500 text-xs mt-1">Solo % por lectura completada</p>
                </div>
                <ul className="mt-5 space-y-2">
                  {['Alta gratuita, sin tarjeta', 'Comisión solo por lectura realizada', 'Podés pasar a suscripción cuando quieras'].map(b => (
                    <li key={b} className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Beneficios */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <p className="text-purple-400 text-xs font-semibold tracking-widest uppercase mb-3">Todo incluido</p>
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white">
                Lo que incluye tu perfil
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {BENEFICIOS.map((b, i) => (
                <div key={i} className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-purple-500/25 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:bg-purple-600/30 transition-colors">
                    {b.icon}
                  </div>
                  <h3 className="text-white font-semibold mb-2">{b.titulo}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pasos */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white">¿Cómo me sumo?</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {PASOS.map((p, i) => (
                <div key={i} className="text-center">
                  <div className="w-14 h-14 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-playfair font-bold text-xl mx-auto mb-4">
                    {p.n}
                  </div>
                  <h3 className="text-white font-semibold mb-2">{p.titulo}</h3>
                  <p className="text-gray-400 text-sm">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-[#0D0B2B] border border-white/8 rounded-2xl p-7 sm:p-10">
              <h2 className="font-playfair text-2xl font-bold text-white mb-6 text-center">
                Quiero registrarme como tarotista
              </h2>

              {enviado ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle size={28} className="text-purple-400" />
                  </div>
                  <h3 className="font-playfair text-white text-xl font-bold mb-2">¡Solicitud enviada!</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Recibimos tu solicitud. Nuestro equipo la revisará y te contactará en un plazo de 24-48 hs hábiles.
                  </p>
                  <Link to="/" className="inline-flex items-center gap-2 mt-6 text-purple-400 hover:text-purple-300 text-sm font-semibold transition-colors">
                    Volver al inicio <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-xs font-semibold mb-1.5">Nombre completo *</label>
                      <input required type="text" name="nombre" value={form.nombre} onChange={handleChange}
                        placeholder="Tu nombre" className="w-full bg-white/5 border border-white/10 focus:border-purple-500/60 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition-all text-sm" />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-xs font-semibold mb-1.5">Email *</label>
                      <input required type="email" name="email" value={form.email} onChange={handleChange}
                        placeholder="tu@email.com" className="w-full bg-white/5 border border-white/10 focus:border-purple-500/60 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition-all text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-xs font-semibold mb-1.5">WhatsApp / Teléfono</label>
                      <input type="text" name="whatsapp" value={form.whatsapp} onChange={handleChange}
                        placeholder="+54 9 11 xxxx xxxx" className="w-full bg-white/5 border border-white/10 focus:border-purple-500/60 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition-all text-sm" />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-xs font-semibold mb-1.5">País *</label>
                      <select required name="pais" value={form.pais} onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 focus:border-purple-500/60 rounded-xl px-4 py-3 text-white outline-none [color-scheme:dark] text-sm">
                        {['Argentina', 'Chile', 'México', 'Uruguay', 'Colombia', 'Perú', 'España', 'Otro'].map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-xs font-semibold mb-1.5">Principal especialidad</label>
                    <input type="text" name="especialidad" value={form.especialidad} onChange={handleChange}
                      placeholder="Ej: Tarot, Amor y Relaciones, Videncia..." className="w-full bg-white/5 border border-white/10 focus:border-purple-500/60 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition-all text-sm" />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-xs font-semibold mb-2">Modelo de trabajo preferido</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'suscripcion', label: 'Suscripción mensual' },
                        { value: 'comision', label: 'Solo comisión (gratis para empezar)' },
                      ].map(opt => (
                        <label key={opt.value}
                          className={`flex items-center gap-2.5 border rounded-xl px-4 py-3 cursor-pointer transition-all ${form.modelo === opt.value ? 'border-purple-500/60 bg-purple-700/15' : 'border-white/10 hover:border-purple-500/30'}`}>
                          <input type="radio" name="modelo" value={opt.value} checked={form.modelo === opt.value} onChange={handleChange} className="accent-purple-500" />
                          <span className="text-gray-300 text-sm">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-xs font-semibold mb-1.5">Contanos brevemente sobre vos y tu trabajo (opcional)</label>
                    <textarea name="mensaje" value={form.mensaje} onChange={handleChange} rows={3}
                      placeholder="Años de experiencia, especialidades, estilo de lectura..." className="w-full bg-white/5 border border-white/10 focus:border-purple-500/60 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition-all text-sm resize-none" />
                  </div>
                  <button type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-purple-900/40">
                    <Sparkles size={16} />
                    Enviar solicitud de registro
                  </button>
                  <p className="text-gray-500 text-xs text-center">
                    Al enviar aceptás nuestros <a href="#" className="text-purple-400 hover:underline">Términos de uso</a> y{' '}
                    <a href="#" className="text-purple-400 hover:underline">Política de Privacidad</a>.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
