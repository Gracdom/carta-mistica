import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Star, Search, MessageCircle, Phone, ChevronDown, ChevronUp,
  CheckCircle, Shield, Lock, Heart, Briefcase, Users, Flame,
  Clock, CreditCard, ArrowRight, Sparkles, MapPin, Loader2
} from 'lucide-react'
import { FAQS } from '../data/tarotistas'
import { supabase } from '../lib/supabase'
import TarotistCard from '../components/TarotistCard'
import Header from '../components/Header'
import Footer from '../components/Footer'

const PAISES = ['Argentina', 'Chile', 'México']

// Estrellas flotantes animadas con CSS puro
const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: Math.random() < 0.3 ? 2 : 1,
  delay: `${(Math.random() * 6).toFixed(2)}s`,
  duration: `${(3 + Math.random() * 5).toFixed(2)}s`,
  opacity: (0.15 + Math.random() * 0.55).toFixed(2),
}))

// Símbolos arcanos flotantes
const ARCANA = ['☽', '✦', '⊕', '⋆', '᯾', '⌖', '✧', '◈', '⟡', '᳁']

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  const [pais, setPais] = useState('Argentina')

  return (
    <section className="relative min-h-screen flex items-center justify-start bg-[#050511] overflow-hidden">

      {/* ── Estilos de animación global ── */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: var(--op); transform: scale(1); }
          50% { opacity: calc(var(--op) * 0.2); transform: scale(0.5); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-18px) rotate(3deg); }
          66% { transform: translateY(8px) rotate(-2deg); }
        }
        @keyframes floatMed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(5deg); }
        }
        @keyframes orbitCW {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes orbitCCW {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px 4px rgba(124,58,237,0.3); }
          50% { box-shadow: 0 0 50px 16px rgba(124,58,237,0.55); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-title  { animation: fadeInUp 0.8s ease forwards; }
        .hero-sub    { animation: fadeInUp 0.8s 0.15s ease both; }
        .hero-bullets{ animation: fadeInUp 0.8s 0.3s ease both; }
        .hero-cta    { animation: fadeInUp 0.8s 0.45s ease both; }
        .hero-stats  { animation: fadeInUp 0.8s 0.6s ease both; }
        .shimmer-text {
          background: linear-gradient(90deg, #c4b5fd, #a78bfa, #7c3aed, #a78bfa, #c4b5fd);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .orbit-cw  { animation: orbitCW  28s linear infinite; }
        .orbit-ccw { animation: orbitCCW 20s linear infinite; }
        .orbit-cw2 { animation: orbitCW  40s linear infinite; }
        .glow-pulse { animation: pulseGlow 3s ease-in-out infinite; }
      `}</style>

      {/* ── Fondo nebulosa multicapa ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 80% 70% at 68% 42%, rgba(109,40,217,0.28) 0%, transparent 55%)' }} />
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 45% 55% at 80% 20%, rgba(124,58,237,0.18) 0%, transparent 50%)' }} />
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 40% 40% at 10% 80%, rgba(79,70,229,0.15) 0%, transparent 50%)' }} />
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 30% 30% at 90% 75%, rgba(139,92,246,0.12) 0%, transparent 50%)' }} />
      </div>

      {/* ── Campo de estrellas ── */}
      <div className="absolute inset-0 pointer-events-none">
        {STARS.map(s => (
          <span
            key={s.id}
            className="absolute rounded-full bg-white"
            style={{
              top: s.top, left: s.left,
              width: s.size, height: s.size,
              '--op': s.opacity,
              opacity: s.opacity,
              animation: `twinkle ${s.duration} ${s.delay} ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* ── Símbolos arcanos flotantes ── */}
      {[
        { sym:'☽', top:'12%', left:'6%',  size:'text-2xl', anim:'floatSlow 7s ease-in-out infinite', op:0.18 },
        { sym:'✦', top:'22%', left:'88%', size:'text-lg',   anim:'floatMed  5s ease-in-out infinite', op:0.2  },
        { sym:'⋆', top:'65%', left:'4%',  size:'text-xl',   anim:'floatSlow 9s 1s ease-in-out infinite', op:0.15 },
        { sym:'◈', top:'75%', left:'92%', size:'text-2xl',  anim:'floatMed  6s 2s ease-in-out infinite', op:0.14 },
        { sym:'✧', top:'88%', left:'20%', size:'text-lg',   anim:'floatSlow 8s 0.5s ease-in-out infinite', op:0.12 },
        { sym:'⟡', top:'8%',  left:'55%', size:'text-xl',   anim:'floatMed  7s 1.5s ease-in-out infinite', op:0.13 },
      ].map((a, i) => (
        <span key={i} className={`absolute pointer-events-none ${a.size} text-purple-300 select-none`}
          style={{ top:a.top, left:a.left, opacity:a.op, animation:a.anim }}>
          {a.sym}
        </span>
      ))}

      {/* ── Sistema de órbitas (lado derecho) ── */}
      <div className="absolute right-[-8%] top-1/2 -translate-y-1/2 w-[480px] h-[480px] lg:w-[640px] lg:h-[640px] hidden lg:flex items-center justify-center pointer-events-none">

        {/* Anillo exterior giratorio CW */}
        <div className="orbit-cw2 absolute inset-0 rounded-full border border-purple-400/10" />

        {/* Anillo medio giratorio CCW */}
        <div className="orbit-ccw absolute inset-[70px] rounded-full border border-purple-500/18" style={{ borderStyle:'dashed' }}>
          {/* Punto orbitante */}
          <span className="absolute -top-1.5 left-1/2 w-3 h-3 -translate-x-1/2 rounded-full bg-purple-400/70 shadow-[0_0_10px_3px_rgba(167,139,250,0.6)]" />
        </div>

        {/* Anillo interior CW */}
        <div className="orbit-cw absolute inset-[140px] rounded-full border border-violet-400/22">
          <span className="absolute -top-1 left-1/2 w-2 h-2 -translate-x-1/2 rounded-full bg-violet-300/80 shadow-[0_0_8px_2px_rgba(196,181,253,0.5)]" />
          <span className="absolute top-1/2 -right-1 w-1.5 h-1.5 -translate-y-1/2 rounded-full bg-purple-400/60" />
        </div>

        {/* Glow central */}
        <div className="absolute inset-[200px] rounded-full glow-pulse"
          style={{ background:'radial-gradient(circle, rgba(124,58,237,0.35) 0%, rgba(109,40,217,0.15) 50%, transparent 70%)' }} />

        {/* Símbolo central */}
        <div className="absolute inset-[210px] flex items-center justify-center">
          <span className="text-5xl lg:text-6xl text-purple-300/30 select-none font-playfair" style={{ animation:'floatSlow 10s ease-in-out infinite' }}>
            ☽
          </span>
        </div>

        {/* Mini estrellas en la órbita */}
        {[0,60,120,180,240,300].map(deg => (
          <span key={deg} className="absolute w-1 h-1 rounded-full bg-purple-300/40"
            style={{
              top: `calc(50% + ${Math.sin(deg * Math.PI/180) * 230}px)`,
              left: `calc(50% + ${Math.cos(deg * Math.PI/180) * 230}px)`,
            }} />
        ))}
      </div>

      {/* ── Líneas de luz (rayos diagonales sutiles) ── */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block">
        <div className="absolute top-0 left-[45%] w-px h-full opacity-5"
          style={{ background:'linear-gradient(to bottom, transparent 0%, rgba(167,139,250,1) 40%, rgba(167,139,250,1) 60%, transparent 100%)' }} />
        <div className="absolute top-0 left-[60%] w-px h-full opacity-3"
          style={{ background:'linear-gradient(to bottom, transparent 0%, rgba(124,58,237,0.8) 50%, transparent 100%)' }} />
      </div>

      {/* ── Contenido ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-16 lg:pt-0 lg:py-0">
        <div className="max-w-[600px] text-left">

          {/* Badge */}
          <div className="hero-title inline-flex items-center gap-2 bg-purple-700/20 border border-purple-500/30 rounded-full px-4 py-1.5 mb-7 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_2px_rgba(74,222,128,0.6)]" />
            <Sparkles size={12} className="text-purple-400" />
            <span className="text-purple-300 text-xs font-semibold tracking-wide">+1.200 tarotistas verificados · En línea ahora</span>
          </div>

          {/* H1 */}
          <h1 className="hero-title font-playfair text-4xl sm:text-5xl lg:text-[3.8rem] font-bold text-white leading-[1.12] mb-5 tracking-tight">
            Los mejores tarotistas,{' '}
            <span className="shimmer-text block sm:inline">en un solo lugar</span>
          </h1>

          {/* Subtítulo */}
          <p className="hero-sub text-gray-400 text-base sm:text-lg leading-relaxed mb-7 max-w-lg">
            Consultas privadas por chat o llamada con tarotistas verificados,
            especializados en <span className="text-purple-300">amor</span>,{' '}
            <span className="text-purple-300">trabajo</span> y{' '}
            <span className="text-purple-300">camino de vida</span>.
          </p>

          {/* Bullets */}
          <ul className="hero-bullets space-y-3 mb-9">
            {[
              { text: 'Tarotistas latinos que entienden tu realidad.', sym: '☽' },
              { text: 'Perfiles transparentes: experiencia, reseñas y precio.', sym: '✦' },
              { text: 'Atienden desde Argentina para todo el país y el exterior.', sym: '⋆' },
            ].map((b, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                <span className="text-purple-400 text-base w-5 flex-shrink-0 text-center">{b.sym}</span>
                {b.text}
              </li>
            ))}
          </ul>

          {/* CTAs */}
          <div className="hero-cta flex flex-col sm:flex-row gap-3 flex-wrap mb-10">
            {/* CTA principal */}
            <div className="flex items-center">
              <Link
                to="/tarotistas"
                className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-3.5 rounded-l-full text-sm transition-all duration-200 shadow-lg shadow-purple-900/50 flex items-center gap-2 hover:shadow-purple-700/40 hover:shadow-xl"
              >
                <Search size={14} />
                Ver tarotistas en
              </Link>
              <select
                value={pais}
                onChange={e => setPais(e.target.value)}
                className="bg-purple-700 hover:bg-purple-600 text-white text-sm font-semibold px-3 py-3.5 rounded-r-full border-l border-purple-400/30 outline-none cursor-pointer transition-colors appearance-none"
              >
                {PAISES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {/* CTA secundario */}
            <Link
              to="/unirse"
              className="border border-white/15 hover:border-purple-400/50 text-white/80 hover:text-white font-medium px-6 py-3.5 rounded-full text-sm flex items-center gap-2 transition-all hover:bg-purple-900/20 backdrop-blur-sm"
            >
              Soy tarotista, quiero unirme
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-stats flex flex-wrap gap-7 sm:gap-10 pt-7 border-t border-white/8">
            {[
              { value: '1.200+', label: 'Tarotistas activos' },
              { value: '48k+', label: 'Consultas realizadas' },
              { value: '4.9★', label: 'Valoración media' },
            ].map((s, i) => (
              <div key={i}>
                <p className="font-playfair text-2xl font-bold text-white">{s.value}</p>
                <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Degradado inferior (transición a siguiente sección) ── */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background:'linear-gradient(to top, #050511 0%, transparent 100%)' }} />
    </section>
  )
}

// ── Cómo funciona ─────────────────────────────────────────────────────────────
function ComoFunciona() {
  const pasos = [
    {
      n: '01',
      icon: <Search size={24} />,
      titulo: 'Elegí a tu tarotista ideal',
      desc: 'Filtrá por especialidad (amor, trabajo, llamas gemelas), método (tarot, videncia, péndulo) y precio en pesos argentinos o tu moneda local.',
    },
    {
      n: '02',
      icon: <CreditCard size={24} />,
      titulo: 'Reservá y pagá de forma segura',
      desc: 'Pagos online en pocos pasos. Aceptamos tarjeta, transferencia y MercadoPago. Sin llamadas a números de tarificación especial.',
    },
    {
      n: '03',
      icon: <MessageCircle size={24} />,
      titulo: 'Conectate por chat o llamada',
      desc: 'Recibí tu lectura en el momento o reservá para más tarde, según la disponibilidad del tarotista. 100% privado.',
    },
  ]

  return (
    <section className="bg-[#050511] py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-purple-400 text-xs font-semibold tracking-widest uppercase mb-3">Simple y seguro</p>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            ¿Cómo funciona?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-12 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

          {pasos.map((p, i) => (
            <div key={i} className="relative bg-white/3 border border-white/8 rounded-2xl p-7 hover:border-purple-500/30 transition-all group">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-full bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 group-hover:bg-purple-600/30 transition-colors flex-shrink-0">
                  {p.icon}
                </div>
                <span className="font-playfair text-purple-500/50 text-4xl font-bold leading-none">{p.n}</span>
              </div>
              <h3 className="font-playfair text-white text-xl font-semibold mb-3">{p.titulo}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 text-sm mt-8 flex items-center justify-center gap-2">
          <MapPin size={14} className="text-purple-400" />
          Funciona estés en Buenos Aires, Córdoba, Rosario, Mendoza o cualquier provincia.
        </p>
      </div>
    </section>
  )
}

// ── Tarotistas destacados ─────────────────────────────────────────────────────
function TarotistasDestacados() {
  const [top, setTop] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('tarotistas')
      .select('*')
      .eq('estado', 'online')
      .eq('activo', true)
      .order('rating', { ascending: false })
      .limit(4)
      .then(({ data }) => {
        if (data) setTop(data.map(t => ({
          ...t,
          id: t.slug,
          reseñas: t['reseñas_count'],
          lecturas: t.lecturas_count,
          precioPorMinuto: t.precio_por_minuto,
          precioChat: t.precio_chat,
          precioLlamada: t.precio_llamada,
          foto: t.foto_url,
        })))
        setLoading(false)
      })
  }, [])

  return (
    <section className="bg-[#050511] py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-purple-400 text-xs font-semibold tracking-widest uppercase mb-3">En línea ahora</p>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white">
              Tarotistas disponibles ahora
            </h2>
          </div>
          <Link
            to="/tarotistas"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-semibold transition-colors whitespace-nowrap"
          >
            Ver todos <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={32} className="text-purple-400 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {top.map(t => <TarotistCard key={t.id} t={t} />)}
          </div>
        )}
      </div>
    </section>
  )
}

// ── Por qué elegirnos ─────────────────────────────────────────────────────────
function PorQue() {
  const items = [
    {
      icon: <Shield size={22} />,
      titulo: 'Solo tarotistas verificados',
      desc: 'Cada profesional pasa un proceso de verificación y es evaluado continuamente por la comunidad.',
    },
    {
      icon: <Search size={22} />,
      titulo: 'Perfiles 100% transparentes',
      desc: 'Ves experiencia, reseñas reales y precios antes de decidir. Sin sorpresas.',
    },
    {
      icon: <Heart size={22} />,
      titulo: 'Lecturas éticas y responsables',
      desc: 'Sin temas de salud, embarazo ni cuestiones legales. Orientación espiritual responsable.',
    },
    {
      icon: <MapPin size={22} />,
      titulo: 'Pensado para vos',
      desc: 'Plataforma diseñada para usuarios latinos. Precios en tu moneda, tarotistas que entienden tu cultura.',
    },
  ]

  return (
    <section
      className="py-20 sm:py-28 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0D0B2B 0%, #050511 100%)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-purple-400 text-xs font-semibold tracking-widest uppercase mb-3">Nuestra diferencia</p>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            ¿Por qué este directorio de tarot?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-white/3 border border-white/8 rounded-2xl p-7 hover:border-purple-500/25 hover:bg-purple-900/8 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-5 group-hover:bg-purple-600/30 transition-colors">
                {item.icon}
              </div>
              <h3 className="text-white font-semibold mb-2 leading-snug">{item.titulo}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Soy tarotista ─────────────────────────────────────────────────────────────
function SoyTarotista() {
  return (
    <section className="bg-[#050511] py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          className="relative rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16"
          style={{
            background: 'radial-gradient(ellipse 80% 100% at 30% 50%, rgba(124,58,237,0.2) 0%, transparent 60%), linear-gradient(135deg, #130F40 0%, #0D0B2B 100%)',
            border: '1px solid rgba(124,58,237,0.2)',
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-purple-400 text-xs font-semibold tracking-widest uppercase mb-4">Para profesionales</p>
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white mb-5 leading-tight">
                ¿Sos tarotista? Sumate y conseguí más consultantes
              </h2>
              <p className="text-gray-400 leading-relaxed mb-8">
                Llegá a miles de personas en Argentina, Chile, México y toda la comunidad latina del mundo.
                Elegís el modelo que mejor se adapta a tu forma de trabajar.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Tu propia página de perfil con URL única y posicionada',
                  'Herramientas de reputación: reseñas verificadas automáticamente',
                  'Soporte completo para cobros y facturación',
                  'Visibilidad ante consultantes de toda Latinoamérica',
                ].map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-gray-300 text-sm">
                    <CheckCircle size={15} className="text-purple-400 flex-shrink-0 mt-0.5" />
                    {b}
                  </li>
                ))}
              </ul>
              <Link
                to="/unirse"
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold px-8 py-3.5 rounded-full transition-colors shadow-lg shadow-purple-900/40"
              >
                Quiero registrarme como tarotista
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Pricing cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <p className="text-purple-300 text-xs font-bold uppercase tracking-widest mb-3">Opción 1</p>
                <h4 className="text-white font-semibold text-lg mb-2">Suscripción mensual</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Aparecé destacado en el directorio. Sin comisión por cliente. Pagás una tarifa fija mensual y te quedás con el 100% de tus ingresos.
                </p>
                <div className="mt-4 pt-4 border-t border-white/8">
                  <p className="text-white font-bold text-xl">$XX<span className="text-gray-400 font-normal text-sm">/mes</span></p>
                </div>
              </div>
              <div className="bg-purple-700/15 border border-purple-500/25 rounded-2xl p-6">
                <p className="text-purple-300 text-xs font-bold uppercase tracking-widest mb-3">Opción 2</p>
                <h4 className="text-white font-semibold text-lg mb-2">Sin costo fijo</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Sin suscripción. Pagás solo una comisión por cada lectura realizada. Ideal para empezar sin riesgo.
                </p>
                <div className="mt-4 pt-4 border-t border-purple-500/20">
                  <p className="text-white font-bold text-xl">XX%<span className="text-gray-400 font-normal text-sm"> comisión</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Confianza ─────────────────────────────────────────────────────────────────
function Confianza() {
  return (
    <section className="bg-[#050511] py-10 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { icon: <Lock size={20} />, titulo: 'Privacidad total', desc: 'Tus consultas son 100% confidenciales. Nunca compartimos tus datos personales.' },
            { icon: <Shield size={20} />, titulo: 'Lecturas responsables', desc: 'El tarot es orientación espiritual. No reemplaza a médicos, abogados ni psicólogos.' },
            { icon: <Heart size={20} />, titulo: 'Decisiones conscientes', desc: 'Fomentamos el uso del tarot para el autoconocimiento, no la dependencia.' },
          ].map((c, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-600/15 border border-purple-500/25 flex items-center justify-center text-purple-400">
                {c.icon}
              </div>
              <div>
                <p className="text-white font-semibold text-sm mb-1">{c.titulo}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── FAQs ──────────────────────────────────────────────────────────────────────
function FAQs() {
  const [open, setOpen] = useState(null)

  return (
    <section className="bg-[#050511] py-20 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-purple-400 text-xs font-semibold tracking-widest uppercase mb-3">Preguntas frecuentes</p>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white">
            Todo lo que necesitás saber
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                open === i ? 'border-purple-500/40 bg-purple-900/10' : 'border-white/8 bg-white/3'
              }`}
            >
              <button
                className="w-full flex items-center justify-between gap-4 p-5 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="text-white font-medium text-sm">{faq.pregunta}</span>
                {open === i
                  ? <ChevronUp size={16} className="text-purple-400 flex-shrink-0" />
                  : <ChevronDown size={16} className="text-gray-500 flex-shrink-0" />
                }
              </button>
              {open === i && (
                <div className="px-5 pb-5">
                  <p className="text-gray-400 text-sm leading-relaxed">{faq.respuesta}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="bg-[#050511]">
      <Header />
      <main>
        <Hero />
        <ComoFunciona />
        <TarotistasDestacados />
        <PorQue />
        <SoyTarotista />
        <Confianza />
        <FAQs />
      </main>
      <Footer />
    </div>
  )
}
