import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
  CheckCircle, Star, TrendingUp, Shield, Globe,
  CreditCard, ArrowRight, ChevronLeft, Sparkles
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

// Pre-computed so no re-render flicker
const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  w: (((i * 7 + 3) % 25) / 10 + 0.8).toFixed(1),
  left: ((i * 137.5) % 100).toFixed(1),
  top: ((i * 97.3) % 100).toFixed(1),
  dur: (((i * 3 + 2) % 30) / 10 + 2).toFixed(1),
  delay: (((i * 5) % 50) / 10).toFixed(1),
}))

const SYMBOLS = [
  { char: '✦', x: '6%',  y: '18%', size: '1.1rem', dur: 7,  delay: 0   },
  { char: '☽', x: '91%', y: '14%', size: '1.6rem', dur: 9,  delay: 1   },
  { char: '✧', x: '14%', y: '72%', size: '0.9rem', dur: 6,  delay: 2.2 },
  { char: '⬡', x: '87%', y: '66%', size: '1.2rem', dur: 8,  delay: 0.5 },
  { char: '✴', x: '4%',  y: '48%', size: '1rem',   dur: 7,  delay: 3   },
  { char: '◈', x: '96%', y: '42%', size: '0.9rem', dur: 8,  delay: 1.5 },
  { char: '✦', x: '49%', y: '88%', size: '0.8rem', dur: 6,  delay: 2.8 },
  { char: '⋆', x: '24%', y: '22%', size: '1.3rem', dur: 5,  delay: 0.8 },
  { char: '✧', x: '76%', y: '28%', size: '0.9rem', dur: 7,  delay: 1.8 },
  { char: '☽', x: '38%', y: '8%',  size: '1.1rem', dur: 10, delay: 3.5 },
  { char: '✴', x: '62%', y: '92%', size: '1rem',   dur: 8,  delay: 0.3 },
  { char: '◈', x: '78%', y: '82%', size: '0.85rem',dur: 6,  delay: 2   },
]

const BENEFICIOS = [
  { icon: <Globe size={22} />, titulo: 'Perfil con URL única', desc: 'Tu propia página personalizada, optimizada para buscadores, que podés compartir donde quieras.' },
  { icon: <Star size={22} />, titulo: 'Reputación verificada', desc: 'Sistema de reseñas automático. Cada cliente puede dejar su opinión, aumentando tu credibilidad.' },
  { icon: <CreditCard size={22} />, titulo: 'Cobros y facturación', desc: 'Soporte completo para recibir pagos online. Trabajamos con los principales medios de pago locales.' },
  { icon: <Globe size={22} />, titulo: 'Visibilidad latinoamericana', desc: 'Llegá a consultantes de Argentina, Chile, México y toda la comunidad latina en el exterior.' },
  { icon: <TrendingUp size={22} />, titulo: 'Estadísticas de tu perfil', desc: 'Tablero con visitas, conversiones y reseñas para que optimices tu presencia.' },
  { icon: <Shield size={22} />, titulo: 'Soporte dedicado', desc: 'Equipo de soporte disponible para ayudarte con todo lo que necesites.' },
]

const PASOS = [
  { n: '01', titulo: 'Registrarte',      desc: 'Completá el formulario con tus datos básicos. Solo lleva 5 minutos.', symbol: '✦' },
  { n: '02', titulo: 'Verificación',     desc: 'Nuestro equipo revisa tu solicitud en 24-48 hs hábiles.',              symbol: '◈' },
  { n: '03', titulo: 'Activar perfil',   desc: 'Completás tu perfil con foto, descripción y precios.',                  symbol: '☽' },
  { n: '04', titulo: 'Recibir clientes', desc: 'Empezás a aparecer en el directorio y a recibir consultas.',            symbol: '✴' },
]

const STATS = [
  { n: '+500',  label: 'Tarotistas activos'  },
  { n: '+10K',  label: 'Consultas al mes'    },
  { n: '8',     label: 'Países'              },
  { n: '4.9★',  label: 'Valoración media'   },
]

const INPUT = 'w-full bg-white/4 border border-white/10 focus:border-purple-500/60 focus:bg-white/6 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition-all text-sm'

export default function Unirse() {
  const [form, setForm] = useState({
    nombre: '', email: '', whatsapp: '', pais: 'Argentina',
    especialidad: '', modelo: 'comision', mensaje: ''
  })
  const [enviado, setEnviado] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = async e => {
    e.preventDefault()
    await supabase.from('solicitudes_tarotista').insert({
      nombre: form.nombre, email: form.email, whatsapp: form.whatsapp,
      pais: form.pais, especialidad: form.especialidad,
      modelo: form.modelo, mensaje: form.mensaje,
    })
    setEnviado(true)
  }

  return (
    <div className="bg-[#030312] min-h-screen">
      <style>{`
        @keyframes twinkle {
          0%,100% { opacity:.15; transform:scale(.8) }
          50%      { opacity:1;   transform:scale(1.2) }
        }
        @keyframes floatY {
          0%,100% { transform:translateY(0) }
          50%     { transform:translateY(-16px) }
        }
        @keyframes floatYR {
          0%,100% { transform:translateY(0) rotate(0deg) }
          50%     { transform:translateY(-20px) rotate(15deg) }
        }
        @keyframes orbPulse {
          0%,100% { opacity:.25 }
          50%     { opacity:.55 }
        }
        @keyframes ringRotate    { from{transform:translate(-50%,-50%) rotate(0deg)}   to{transform:translate(-50%,-50%) rotate(360deg)} }
        @keyframes ringRotateRev { from{transform:translate(-50%,-50%) rotate(360deg)} to{transform:translate(-50%,-50%) rotate(0deg)}   }
        @keyframes shimmerGrad {
          0%,100% { background-position:0% 50% }
          50%     { background-position:100% 50% }
        }
        @keyframes glowPulse {
          0%,100% { box-shadow:0 0 25px rgba(139,92,246,.3),0 4px 20px rgba(0,0,0,.5) }
          50%     { box-shadow:0 0 50px rgba(139,92,246,.6),0 4px 20px rgba(0,0,0,.5) }
        }
        @keyframes borderShimmer {
          0%,100% { opacity:.5 }
          50%     { opacity:1 }
        }
        .grad-text {
          background: linear-gradient(135deg,#c084fc 0%,#e879f9 30%,#a78bfa 65%,#818cf8 100%);
          background-size:200% 200%;
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
          animation: shimmerGrad 5s ease infinite;
        }
        .hero-btn { animation: glowPulse 3s ease-in-out infinite; }
        .hero-btn:hover { animation: none; box-shadow:0 0 60px rgba(139,92,246,.7),0 4px 20px rgba(0,0,0,.5) !important; }
        .card-hover { transition: box-shadow .3s, border-color .3s, background .3s; }
        .card-hover:hover { box-shadow:0 0 35px rgba(139,92,246,.18); }
        .benefit-card { transition: transform .3s, box-shadow .3s, border-color .3s; }
        .benefit-card:hover { transform:translateY(-4px); box-shadow:0 8px 30px rgba(109,40,217,.2); }
        .step-circle { transition: box-shadow .3s; }
        .step-circle:hover { box-shadow: 0 0 30px rgba(139,92,246,.4); }
        .top-shimmer {
          background: linear-gradient(90deg, transparent, rgba(139,92,246,.55), transparent);
          animation: borderShimmer 3s ease-in-out infinite;
        }
      `}</style>

      <Header />
      <main>

        {/* ══════════════════════════════════════════
            HERO — BANNER ESOTÉRICO
        ══════════════════════════════════════════ */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden text-center px-4"
          style={{ background: 'radial-gradient(ellipse 90% 80% at 50% -10%, #140e40 0%, #030312 65%)' }}>

          {/* Stars */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {STARS.map(s => (
              <div key={s.id}
                className="absolute rounded-full bg-white"
                style={{
                  width: s.w + 'px', height: s.w + 'px',
                  left: s.left + '%', top: s.top + '%',
                  animation: `twinkle ${s.dur}s ease-in-out infinite`,
                  animationDelay: s.delay + 's',
                }}
              />
            ))}
          </div>

          {/* Ambient orbs */}
          <div className="absolute rounded-full pointer-events-none"
            style={{ width:'750px', height:'750px', background:'radial-gradient(circle,rgba(109,40,217,.14) 0%,transparent 65%)', top:'-280px', left:'50%', transform:'translateX(-50%)', animation:'orbPulse 8s ease-in-out infinite' }} />
          <div className="absolute rounded-full pointer-events-none"
            style={{ width:'420px', height:'420px', background:'radial-gradient(circle,rgba(168,85,247,.1) 0%,transparent 65%)', bottom:'-60px', left:'-80px', animation:'orbPulse 10s ease-in-out infinite', animationDelay:'2s' }} />
          <div className="absolute rounded-full pointer-events-none"
            style={{ width:'360px', height:'360px', background:'radial-gradient(circle,rgba(217,70,239,.08) 0%,transparent 65%)', bottom:'40px', right:'-60px', animation:'orbPulse 7s ease-in-out infinite', animationDelay:'4s' }} />

          {/* Rotating arcane rings */}
          <div className="absolute rounded-full pointer-events-none"
            style={{ width:'540px', height:'540px', border:'1px solid rgba(139,92,246,.09)', top:'50%', left:'50%', animation:'ringRotate 30s linear infinite' }} />
          <div className="absolute rounded-full pointer-events-none"
            style={{ width:'700px', height:'700px', border:'1px solid rgba(167,139,250,.05)', top:'50%', left:'50%', animation:'ringRotateRev 22s linear infinite' }} />
          <div className="absolute rounded-full pointer-events-none"
            style={{ width:'380px', height:'380px', border:'1px dashed rgba(139,92,246,.07)', top:'50%', left:'50%', animation:'ringRotate 18s linear infinite' }} />

          {/* Floating mystical symbols */}
          {SYMBOLS.map((s, i) => (
            <div key={i}
              className="absolute pointer-events-none select-none text-purple-400/25"
              style={{ left:s.x, top:s.y, fontSize:s.size, animation:`floatYR ${s.dur}s ease-in-out infinite`, animationDelay:`${s.delay}s` }}>
              {s.char}
            </div>
          ))}

          {/* Content */}
          <div className="relative max-w-4xl mx-auto pt-28 pb-20">
            <Link to="/"
              className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-sm transition-colors mb-10">
              <ChevronLeft size={14} /> Volver al inicio
            </Link>

            {/* Badge */}
            <div className="inline-flex items-center gap-3 mb-8"
              style={{ background:'linear-gradient(135deg,rgba(109,40,217,.28),rgba(168,85,247,.15))', border:'1px solid rgba(167,139,250,.35)', borderRadius:'9999px', padding:'10px 22px' }}>
              <span className="text-purple-300 text-base" style={{ animation:'floatY 4s ease-in-out infinite' }}>✦</span>
              <span className="text-purple-200 text-xs font-semibold tracking-widest uppercase">Portal del Tarotista Profesional</span>
              <span className="text-purple-300 text-base" style={{ animation:'floatY 4s ease-in-out infinite', animationDelay:'.5s' }}>✦</span>
            </div>

            {/* Heading */}
            <h1 className="font-playfair font-bold text-white leading-[1.08] mb-6"
              style={{ fontSize:'clamp(2.6rem,7.5vw,5.2rem)' }}>
              Abrí tu portal<br />
              <span className="grad-text">espiritual al mundo</span>
            </h1>

            <p className="text-gray-400 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-12">
              Conectá con miles de personas que buscan guía espiritual.{' '}
              <span className="text-purple-300/80">Tu talento, nuestra plataforma.</span>{' '}
              Llegás a toda Latinoamérica desde el primer día.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <a href="#formulario"
                className="hero-btn inline-flex items-center gap-2.5 text-white font-semibold px-9 py-4 rounded-full"
                style={{ background:'linear-gradient(135deg,#6d28d9,#9333ea)', boxShadow:'0 0 25px rgba(139,92,246,.4),0 4px 20px rgba(0,0,0,.4)' }}>
                <Sparkles size={18} />
                Quiero unirme ahora
              </a>
              <a href="#como-funciona"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-colors border border-white/10 hover:border-white/20 px-6 py-4 rounded-full">
                Ver cómo funciona <ArrowRight size={14} />
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-10 sm:gap-16">
              {STATS.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="font-playfair text-2xl sm:text-3xl font-bold text-purple-300">{s.n}</div>
                  <div className="text-gray-500 text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
            style={{ background:'linear-gradient(to bottom,transparent,#030312)' }} />
        </section>


        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">

          {/* ══════════════════════════════════════════
              MODELOS DE PRECIO
          ══════════════════════════════════════════ */}
          <div id="precios" className="mb-28">
            <div className="text-center mb-12">
              <p className="text-purple-400 text-xs font-semibold tracking-widest uppercase mb-3">☽ Sin letra chica ☽</p>
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white mb-3">Elegís cómo trabajar</h2>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">Dos caminos hacia el mismo destino. Ninguno es mejor, solo distintos.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">

              {/* Opción 1 */}
              <div className="card-hover relative rounded-2xl p-8"
                style={{ background:'#080619', border:'1px solid rgba(255,255,255,.08)' }}>
                <div className="top-shimmer absolute top-0 left-6 right-6 h-px" />
                <div className="inline-block bg-purple-700/20 border border-purple-500/30 text-purple-300 text-xs font-bold px-3 py-1 rounded-full mb-5 uppercase tracking-wide">
                  ✦ Opción 1 — Suscripción
                </div>
                <h3 className="font-playfair text-white text-2xl font-bold mb-3">Destacado mensual</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-5">
                  Aparecés destacado en el directorio.{' '}
                  <strong className="text-white">Sin comisión por cliente.</strong>{' '}
                  Pagás una tarifa mensual fija y te quedás con el 100%.
                </p>
                <div className="border-t border-white/5 pt-5 mb-5">
                  <p className="text-white font-bold text-3xl font-playfair">
                    Consultar<span className="text-gray-400 font-normal text-base ml-2">precio</span>
                  </p>
                  <p className="text-gray-500 text-xs mt-1">Precio variable según país</p>
                </div>
                <ul className="space-y-2.5">
                  {['Perfil destacado en búsquedas', 'Sin comisión por lectura', 'Soporte prioritario'].map(b => (
                    <li key={b} className="flex items-center gap-2.5 text-sm text-gray-300">
                      <CheckCircle size={14} className="text-purple-400 flex-shrink-0" /> {b}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Opción 2 — Popular */}
              <div className="card-hover relative rounded-2xl p-8"
                style={{ background:'linear-gradient(135deg,rgba(109,40,217,.15),rgba(139,92,246,.07))', border:'1px solid rgba(139,92,246,.32)' }}>
                <div className="top-shimmer absolute top-0 left-6 right-6 h-px"
                  style={{ background:'linear-gradient(90deg,transparent,rgba(167,139,250,.8),transparent)' }} />
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider"
                  style={{ background:'linear-gradient(135deg,#6d28d9,#9333ea)', boxShadow:'0 0 18px rgba(139,92,246,.55)' }}>
                  ✦ Más popular ✦
                </div>
                <div className="inline-block bg-green-700/20 border border-green-500/30 text-green-300 text-xs font-bold px-3 py-1 rounded-full mb-5 uppercase tracking-wide mt-2">
                  ✧ Opción 2 — Sin costo fijo
                </div>
                <h3 className="font-playfair text-white text-2xl font-bold mb-3">Solo comisión</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-5">
                  <strong className="text-white">Sin suscripción mensual.</strong> Registrarte es gratis.
                  Pagás solo una comisión por cada lectura realizada. Ideal para empezar sin riesgo.
                </p>
                <div className="border-t border-purple-500/15 pt-5 mb-5">
                  <p className="text-white font-bold text-3xl font-playfair">
                    Gratis<span className="text-gray-400 font-normal text-base ml-2">para empezar</span>
                  </p>
                  <p className="text-gray-500 text-xs mt-1">Solo % por lectura completada</p>
                </div>
                <ul className="space-y-2.5">
                  {['Alta gratuita, sin tarjeta', 'Comisión solo por lectura realizada', 'Podés pasar a suscripción cuando quieras'].map(b => (
                    <li key={b} className="flex items-center gap-2.5 text-sm text-gray-300">
                      <CheckCircle size={14} className="text-green-400 flex-shrink-0" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════
              BENEFICIOS
          ══════════════════════════════════════════ */}
          <div className="mb-28">
            <div className="text-center mb-12">
              <p className="text-purple-400 text-xs font-semibold tracking-widest uppercase mb-3">✴ Todo incluido ✴</p>
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white mb-3">Lo que incluye tu perfil</h2>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">Todo lo que necesitás para brillar en el mundo espiritual digital.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {BENEFICIOS.map((b, i) => (
                <div key={i}
                  className="benefit-card group relative rounded-2xl p-6 overflow-hidden"
                  style={{ background:'rgba(255,255,255,.02)', border:'1px solid rgba(255,255,255,.06)' }}>
                  {/* Hover top line */}
                  <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background:'linear-gradient(90deg,transparent,rgba(139,92,246,.6),transparent)' }} />
                  {/* Subtle background glow on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                    style={{ background:'radial-gradient(ellipse 80% 60% at 50% 0%,rgba(109,40,217,.08) 0%,transparent 70%)' }} />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-purple-400 mb-4 group-hover:text-purple-300 transition-colors duration-300"
                      style={{ background:'linear-gradient(135deg,rgba(109,40,217,.22),rgba(139,92,246,.1))', border:'1px solid rgba(139,92,246,.28)' }}>
                      {b.icon}
                    </div>
                    <h3 className="text-white font-semibold mb-2">{b.titulo}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ══════════════════════════════════════════
              PASOS
          ══════════════════════════════════════════ */}
          <div id="como-funciona" className="mb-28">
            <div className="text-center mb-14">
              <p className="text-purple-400 text-xs font-semibold tracking-widest uppercase mb-3">☽ El camino ☽</p>
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white">¿Cómo me sumo?</h2>
            </div>
            <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Connecting line desktop */}
              <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px pointer-events-none"
                style={{ background:'linear-gradient(90deg,transparent,rgba(139,92,246,.25) 20%,rgba(139,92,246,.25) 80%,transparent)' }} />
              {PASOS.map((p, i) => (
                <div key={i} className="relative text-center group">
                  <div className="relative w-20 h-20 mx-auto mb-5">
                    {/* Outer glow ring on hover */}
                    <div className="absolute inset-0 rounded-full scale-[1.6] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background:'radial-gradient(circle,rgba(139,92,246,.18) 0%,transparent 70%)' }} />
                    <div className="step-circle w-20 h-20 rounded-full flex items-center justify-center mx-auto"
                      style={{ background:'linear-gradient(135deg,rgba(109,40,217,.28),rgba(139,92,246,.12))', border:'1px solid rgba(139,92,246,.38)' }}>
                      <span className="font-playfair font-bold text-purple-300 text-xl">{p.n}</span>
                    </div>
                    <div className="absolute -top-1.5 -right-1.5 text-purple-400/50 text-xs"
                      style={{ animation:`floatY 5s ease-in-out infinite`, animationDelay:`${i * 0.6}s` }}>
                      {p.symbol}
                    </div>
                  </div>
                  <h3 className="text-white font-semibold mb-2">{p.titulo}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ══════════════════════════════════════════
              FORMULARIO
          ══════════════════════════════════════════ */}
          <div id="formulario" className="max-w-2xl mx-auto">
            {/* Gradient border wrapper */}
            <div className="relative rounded-2xl p-px"
              style={{ background:'linear-gradient(135deg,rgba(139,92,246,.45),rgba(109,40,217,.2) 50%,rgba(168,85,247,.45))' }}>
              <div className="relative rounded-2xl p-7 sm:p-10 overflow-hidden"
                style={{ background:'#06041a' }}>

                {/* Inner top glow */}
                <div className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
                  style={{ background:'radial-gradient(ellipse 70% 100% at 50% 0%,rgba(109,40,217,.12) 0%,transparent 70%)' }} />

                <div className="relative text-center mb-8">
                  <div className="text-purple-400/60 text-xl mb-4 tracking-[.6em]">✦ ☽ ✦</div>
                  <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-white">
                    Quiero registrarme como tarotista
                  </h2>
                  <p className="text-gray-500 text-sm mt-2">Tu energía llegará al lugar correcto.</p>
                </div>

                {enviado ? (
                  <div className="text-center py-10">
                    <div className="text-5xl text-purple-400/70 mb-5" style={{ animation:'floatY 4s ease-in-out infinite' }}>✦</div>
                    <h3 className="font-playfair text-white text-2xl font-bold mb-3">¡Solicitud enviada!</h3>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                      Tu energía llegó. Nuestro equipo revisará tu solicitud y te contactará en 24-48 hs hábiles.
                    </p>
                    <Link to="/"
                      className="inline-flex items-center gap-2 mt-7 text-purple-400 hover:text-purple-300 text-sm font-semibold transition-colors">
                      Volver al inicio <ArrowRight size={14} />
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 relative">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 text-xs font-semibold mb-1.5">Nombre completo *</label>
                        <input required type="text" name="nombre" value={form.nombre} onChange={handleChange}
                          placeholder="Tu nombre" className={INPUT} />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-xs font-semibold mb-1.5">Email *</label>
                        <input required type="email" name="email" value={form.email} onChange={handleChange}
                          placeholder="tu@email.com" className={INPUT} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 text-xs font-semibold mb-1.5">WhatsApp / Teléfono</label>
                        <input type="text" name="whatsapp" value={form.whatsapp} onChange={handleChange}
                          placeholder="+54 9 11 xxxx xxxx" className={INPUT} />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-xs font-semibold mb-1.5">País *</label>
                        <select required name="pais" value={form.pais} onChange={handleChange}
                          className={INPUT + ' [color-scheme:dark]'}>
                          {['Argentina','Chile','México','Uruguay','Colombia','Perú','España','Otro'].map(p => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 text-xs font-semibold mb-1.5">Principal especialidad</label>
                      <input type="text" name="especialidad" value={form.especialidad} onChange={handleChange}
                        placeholder="Ej: Tarot, Amor y Relaciones, Videncia..." className={INPUT} />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-xs font-semibold mb-2">Modelo de trabajo preferido</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { value: 'suscripcion', label: 'Suscripción mensual' },
                          { value: 'comision',    label: 'Solo comisión (gratis para empezar)' },
                        ].map(opt => (
                          <label key={opt.value}
                            className={`flex items-center gap-2.5 border rounded-xl px-4 py-3 cursor-pointer transition-all ${
                              form.modelo === opt.value
                                ? 'border-purple-500/60 bg-purple-700/15'
                                : 'border-white/10 hover:border-purple-500/30 hover:bg-white/3'
                            }`}>
                            <input type="radio" name="modelo" value={opt.value}
                              checked={form.modelo === opt.value} onChange={handleChange}
                              className="accent-purple-500" />
                            <span className="text-gray-300 text-sm">{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 text-xs font-semibold mb-1.5">
                        Contanos brevemente sobre vos y tu trabajo (opcional)
                      </label>
                      <textarea name="mensaje" value={form.mensaje} onChange={handleChange} rows={3}
                        placeholder="Años de experiencia, especialidades, estilo de lectura..."
                        className={INPUT + ' resize-none'} />
                    </div>

                    <button type="submit"
                      className="w-full text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2.5 transition-all"
                      style={{ background:'linear-gradient(135deg,#6d28d9,#9333ea)', boxShadow:'0 0 20px rgba(139,92,246,.35),0 4px 15px rgba(0,0,0,.4)' }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow='0 0 40px rgba(139,92,246,.55),0 4px 15px rgba(0,0,0,.4)'}
                      onMouseLeave={e => e.currentTarget.style.boxShadow='0 0 20px rgba(139,92,246,.35),0 4px 15px rgba(0,0,0,.4)'}>
                      <Sparkles size={17} />
                      Enviar solicitud de registro
                    </button>

                    <p className="text-gray-600 text-xs text-center">
                      Al enviar aceptás nuestros{' '}
                      <a href="#" className="text-purple-500 hover:text-purple-400 transition-colors">Términos de uso</a>{' '}
                      y{' '}
                      <a href="#" className="text-purple-500 hover:text-purple-400 transition-colors">Política de Privacidad</a>.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
