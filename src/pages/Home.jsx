import { useState } from 'react'
import {
  Sparkles, BookOpen, Lock, Star, ChevronDown, ChevronUp,
  ArrowRight, Shield, Heart, Eye, Zap, Moon, CheckCircle
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ModalRegistros from '../components/ModalRegistros'

// ── Datos estáticos ───────────────────────────────────────────────────────────
const STARS_BG = Array.from({ length: 65 }, (_, i) => ({
  id: i,
  top:  `${((i * 97.3) % 100).toFixed(1)}%`,
  left: `${((i * 137.5) % 100).toFixed(1)}%`,
  size: ((i * 7 + 3) % 22) / 10 + 0.7,
  dur:  `${(((i * 3 + 2) % 28) / 10 + 2).toFixed(1)}s`,
  delay:`${(((i * 5) % 50) / 10).toFixed(1)}s`,
}))

const SIMBOLOS_HERO = [
  { char:'✦', x:'5%',  y:'14%', dur:7,  delay:0   },
  { char:'☽', x:'93%', y:'10%', dur:9,  delay:1   },
  { char:'◈', x:'7%',  y:'60%', dur:8,  delay:2   },
  { char:'✴', x:'92%', y:'55%', dur:6,  delay:0.5 },
  { char:'⬡', x:'2%',  y:'82%', dur:10, delay:3   },
  { char:'✧', x:'95%', y:'78%', dur:7,  delay:1.5 },
  { char:'⋆', x:'48%', y:'4%',  dur:8,  delay:2.5 },
  { char:'✦', x:'18%', y:'92%', dur:6,  delay:0.8 },
  { char:'☽', x:'80%', y:'88%', dur:9,  delay:3.5 },
]

const PASOS = [
  { n:'01', icon:'✦', titulo:'Completás el formulario', desc:'Nombre, fecha y lugar de nacimiento, y tu pregunta o intención principal. Solo toma 2 minutos.' },
  { n:'02', icon:'☽', titulo:'La IA accede al campo akáshico', desc:'Nuestro sistema de inteligencia espiritual consulta los registros y genera tu lectura personalizada.' },
  { n:'03', icon:'◈', titulo:'Recibís tu vista previa gratis', desc:'Leés los primeros párrafos de tu registro: tu energía, primera impresión del alma y un destello de tu misión.' },
  { n:'04', icon:'✴', titulo:'Desbloqueás la lectura completa', desc:'Con un único pago accedés al registro completo: misión, karma, bloqueos y mensaje de tus Guardianes.' },
]

const QUE_INCLUYE = [
  { icon:<BookOpen size={20}/>, titulo:'Origen del alma y misión de vida', desc:'De dónde viene tu alma, cuál es su arquetipo y cuál es la misión que eligió en esta encarnación.' },
  { icon:<Moon size={20}/>,     titulo:'Patrones kármicos y bloqueos', desc:'Los contratos del alma pendientes, patrones repetitivos y qué te frena de avanzar en esta vida.' },
  { icon:<Eye size={20}/>,      titulo:'Respuesta a tu pregunta', desc:'Los Registros responden directamente tu intención: amor, propósito, dinero, relaciones, bloqueos.' },
  { icon:<Sparkles size={20}/>, titulo:'Mensaje de tus Guardianes', desc:'Un mensaje especial de los Guardianes y Maestros de tu Registro Akáshico, con cierre y guía.' },
  { icon:<Zap size={20}/>,      titulo:'IA entrenada en sabiduría akáshica', desc:'Generada por inteligencia artificial especializada, con el lenguaje y profundidad de un registro real.' },
  { icon:<Shield size={20}/>,   titulo:'100% privado y confidencial', desc:'Tus datos y tu lectura son completamente privados. Nadie más accede a tu registro.' },
]

const PREGUNTAS = [
  { emoji:'❤️', tema:'Amor y relaciones',     ej:'¿Por qué atraigo siempre el mismo tipo de relación?' },
  { emoji:'🌟', tema:'Propósito de vida',      ej:'¿Cuál es la misión de mi alma en esta encarnación?' },
  { emoji:'💰', tema:'Dinero y abundancia',    ej:'¿Qué bloqueos kármicos me impiden prosperar?' },
  { emoji:'🔥', tema:'Llamas gemelas',          ej:'¿Cuál es el contrato del alma con mi llama gemela?' },
  { emoji:'🌿', tema:'Salud y energía',         ej:'¿Qué debo sanar a nivel del alma para avanzar?' },
  { emoji:'✨', tema:'Dones espirituales',      ej:'¿Cuáles son mis talentos y dones del alma?' },
]

const TESTIMONIOS = [
  { nombre:'Valeria M.', pais:'Argentina', stars:5, texto:'Fue increíblemente preciso. Habló de patrones que nadie más conocía y me dio claridad sobre mi relación. La lectura completa fue un regalo para mi alma.' },
  { nombre:'Camila R.',  pais:'Chile',     stars:5, texto:'Lloré leyendo mi registro. Describió exactamente los bloqueos con el dinero que llevo años trabajando. Lo recomiendo a todos los que buscan respuestas profundas.' },
  { nombre:'Sofía L.',   pais:'México',    stars:5, texto:'La vista previa ya fue poderosa. Cuando desbloqueé la lectura completa entendí por qué repito los mismos patrones en el amor. Gracias por este servicio.' },
]

const FAQS = [
  { p:'¿Qué son los Registros Akáshicos?', r:'Los Registros Akáshicos son el campo energético que contiene la historia completa de cada alma: sus vidas pasadas, contratos, bloqueos kármicos y misión de vida. Acceder a ellos permite obtener orientación espiritual profunda.' },
  { p:'¿La lectura es generada por inteligencia artificial?', r:'Sí. Utilizamos inteligencia artificial especializada entrenada para acceder al campo akáshico con el lenguaje y la profundidad de una lectura real. Los datos que proporcionás (nombre, fecha, lugar y pregunta) son el "portal" para tu lectura personalizada.' },
  { p:'¿Cuánto cuesta la lectura completa?', r:'La vista previa siempre es gratuita. La lectura completa se desbloquea con un único pago que te dará acceso inmediato a todos los secciones de tu Registro Akáshico.' },
  { p:'¿Qué necesito para hacer mi consulta?', r:'Solo necesitás tu nombre completo, fecha de nacimiento, ciudad o país de nacimiento (opcional pero recomendado) y una pregunta o intención clara. Con eso los Registros se abren.' },
  { p:'¿Mis datos son privados?', r:'Absolutamente. Tu nombre, fecha de nacimiento y lectura son completamente confidenciales. Nunca compartimos tu información con terceros.' },
  { p:'¿Puedo hacer más de una consulta?', r:'Sí. Cada consulta abre un registro nuevo con una pregunta o intención diferente. Podés consultar sobre amor, trabajo, propósito o cualquier área de tu vida.' },
]

// ── Estilos globales ──────────────────────────────────────────────────────────
const GLOBAL_STYLES = `
  @keyframes twinkle    { 0%,100%{opacity:.1;transform:scale(.8)} 50%{opacity:.85;transform:scale(1.2)} }
  @keyframes floatY     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
  @keyframes floatYR    { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-18px) rotate(12deg)} }
  @keyframes orbPulse   { 0%,100%{opacity:.18} 50%{opacity:.45} }
  @keyframes ringRot    { from{transform:translate(-50%,-50%) rotate(0deg)}   to{transform:translate(-50%,-50%) rotate(360deg)} }
  @keyframes ringRotR   { from{transform:translate(-50%,-50%) rotate(360deg)} to{transform:translate(-50%,-50%) rotate(0deg)} }
  @keyframes shimmerGrd { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  @keyframes fadeUp     { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes glowBtn    { 0%,100%{box-shadow:0 0 25px rgba(139,92,246,.35),0 4px 20px rgba(0,0,0,.5)} 50%{box-shadow:0 0 50px rgba(139,92,246,.6),0 4px 20px rgba(0,0,0,.5)} }
  .grad-text {
    background:linear-gradient(135deg,#c084fc 0%,#e879f9 30%,#a78bfa 65%,#818cf8 100%);
    background-size:200% 200%; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
    animation:shimmerGrd 5s ease infinite;
  }
  .hero-title  { animation:fadeUp .7s ease forwards; }
  .hero-sub    { animation:fadeUp .7s .15s ease both; }
  .hero-cta    { animation:fadeUp .7s .3s ease both; }
  .hero-stats  { animation:fadeUp .7s .45s ease both; }
  .btn-glow    { animation:glowBtn 3s ease-in-out infinite; }
  .btn-glow:hover { animation:none; box-shadow:0 0 60px rgba(139,92,246,.7),0 4px 20px rgba(0,0,0,.5) !important; }
  .card-hover  { transition:transform .3s, box-shadow .3s, border-color .3s; }
  .card-hover:hover { transform:translateY(-4px); box-shadow:0 8px 30px rgba(109,40,217,.2); }
  .top-line    { background:linear-gradient(90deg,transparent,rgba(139,92,246,.55),transparent); }
`

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero({ onOpenModal }) {
  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden text-center px-4"
      style={{ background:'radial-gradient(ellipse 90% 75% at 50% -5%, #180f45 0%, #030312 65%)' }}>

      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {STARS_BG.map(s => (
          <div key={s.id} className="absolute rounded-full bg-white"
            style={{ width:s.size+'px', height:s.size+'px', top:s.top, left:s.left,
              animation:`twinkle ${s.dur} ease-in-out infinite`, animationDelay:s.delay }} />
        ))}
      </div>

      {/* Orbes */}
      <div className="absolute rounded-full pointer-events-none"
        style={{ width:'800px', height:'800px', background:'radial-gradient(circle,rgba(109,40,217,.13) 0%,transparent 65%)', top:'-280px', left:'50%', transform:'translateX(-50%)', animation:'orbPulse 9s ease-in-out infinite' }} />
      <div className="absolute rounded-full pointer-events-none"
        style={{ width:'380px', height:'380px', background:'radial-gradient(circle,rgba(168,85,247,.09) 0%,transparent 65%)', bottom:'-50px', left:'-80px', animation:'orbPulse 11s ease-in-out infinite', animationDelay:'2s' }} />
      <div className="absolute rounded-full pointer-events-none"
        style={{ width:'320px', height:'320px', background:'radial-gradient(circle,rgba(236,72,153,.07) 0%,transparent 65%)', bottom:'30px', right:'-50px', animation:'orbPulse 8s ease-in-out infinite', animationDelay:'5s' }} />

      {/* Anillos arcanos */}
      <div className="absolute rounded-full pointer-events-none"
        style={{ width:'560px', height:'560px', border:'1px solid rgba(139,92,246,.08)', top:'50%', left:'50%', animation:'ringRot 30s linear infinite' }} />
      <div className="absolute rounded-full pointer-events-none"
        style={{ width:'720px', height:'720px', border:'1px dashed rgba(167,139,250,.05)', top:'50%', left:'50%', animation:'ringRotR 22s linear infinite' }} />
      <div className="absolute rounded-full pointer-events-none"
        style={{ width:'400px', height:'400px', border:'1px dotted rgba(139,92,246,.06)', top:'50%', left:'50%', animation:'ringRot 18s linear infinite' }} />

      {/* Símbolos flotantes */}
      {SIMBOLOS_HERO.map((s, i) => (
        <div key={i} className="absolute pointer-events-none select-none text-purple-400/22"
          style={{ left:s.x, top:s.y, fontSize:'1.2rem', animation:`floatYR ${s.dur}s ease-in-out infinite`, animationDelay:`${s.delay}s` }}>
          {s.char}
        </div>
      ))}

      {/* Contenido */}
      <div className="relative max-w-4xl mx-auto pt-28 pb-16">
        {/* Badge */}
        <div className="hero-title inline-flex items-center gap-2.5 mb-8"
          style={{ background:'linear-gradient(135deg,rgba(109,40,217,.28),rgba(168,85,247,.15))', border:'1px solid rgba(167,139,250,.35)', borderRadius:'9999px', padding:'10px 22px' }}>
          <span className="text-purple-300" style={{ animation:'floatY 4s ease-in-out infinite' }}>✦</span>
          <BookOpen size={13} className="text-purple-300" />
          <span className="text-purple-200 text-xs font-semibold tracking-widest uppercase">Lectura de Registros Akáshicos con IA</span>
          <span className="text-purple-300" style={{ animation:'floatY 4s ease-in-out infinite', animationDelay:'.5s' }}>✦</span>
        </div>

        {/* Título */}
        <h1 className="hero-title font-playfair font-bold text-white leading-[1.08] mb-6"
          style={{ fontSize:'clamp(2.8rem,8vw,5.5rem)' }}>
          Descubre los secretos<br />
          <span className="grad-text">de tu alma</span>
        </h1>

        <p className="hero-sub text-gray-400 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-4">
          Accedé al campo akáshico de tu alma y conocé tu misión de vida, tus bloqueos kármicos
          y las respuestas espirituales que solo vos podés recibir.
        </p>
        <p className="text-purple-400/70 text-sm mb-10">
          Vista previa gratuita · Lectura completa disponible tras el pago
        </p>

        {/* CTA */}
        <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <button onClick={onOpenModal}
            className="btn-glow inline-flex items-center gap-2.5 text-white font-bold px-10 py-4 rounded-full text-base cursor-pointer"
            style={{ background:'linear-gradient(135deg,#6d28d9,#9333ea)', boxShadow:'0 0 28px rgba(139,92,246,.4)' }}>
            <Sparkles size={18} /> Consultar mis Registros
          </button>
          <a href="#como-funciona"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-colors border border-white/10 hover:border-white/20 px-6 py-4 rounded-full">
            Ver cómo funciona <ArrowRight size={14} />
          </a>
        </div>

        {/* Stats */}
        <div className="hero-stats flex flex-wrap justify-center gap-10 sm:gap-16 pt-8 border-t border-white/8">
          {[
            { n:'+2.000',  label:'Lecturas realizadas'   },
            { n:'Gratis',  label:'Vista previa'          },
            { n:'100%',    label:'Privado y confidencial'},
            { n:'4.9★',    label:'Valoración media'      },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="font-playfair text-2xl sm:text-3xl font-bold text-purple-300">{s.n}</p>
              <p className="text-gray-500 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{ background:'linear-gradient(to bottom,transparent,#030312)' }} />
    </section>
  )
}

// ── Cómo funciona ─────────────────────────────────────────────────────────────
function ComoFunciona({ onOpenModal }) {
  return (
    <section id="como-funciona" className="py-24 sm:py-32"
      style={{ background:'radial-gradient(ellipse 80% 60% at 50% 50%, #0d0830 0%, #030312 70%)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-purple-400 text-xs font-semibold tracking-widest uppercase mb-3">✦ Proceso ✦</p>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white mb-3">¿Cómo funciona?</h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto">Cuatro pasos para abrir el portal de tu alma</p>
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Línea conectora desktop */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px pointer-events-none"
            style={{ background:'linear-gradient(90deg,transparent,rgba(139,92,246,.25) 20%,rgba(139,92,246,.25) 80%,transparent)' }} />

          {PASOS.map((p, i) => (
            <div key={i} className="card-hover text-center group">
              <div className="relative w-20 h-20 mx-auto mb-5">
                <div className="absolute inset-0 rounded-full scale-[1.6] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background:'radial-gradient(circle,rgba(139,92,246,.18) 0%,transparent 70%)' }} />
                <div className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ background:'linear-gradient(135deg,rgba(109,40,217,.28),rgba(139,92,246,.12))', border:'1px solid rgba(139,92,246,.38)' }}>
                  <span className="font-playfair font-bold text-purple-300 text-xl">{p.n}</span>
                </div>
                <div className="absolute -top-1.5 -right-1.5 text-purple-400/50 text-xs"
                  style={{ animation:`floatY 5s ease-in-out infinite`, animationDelay:`${i * 0.5}s` }}>
                  {p.icon}
                </div>
              </div>
              <h3 className="text-white font-semibold mb-2">{p.titulo}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button onClick={onOpenModal}
            className="btn-glow inline-flex items-center gap-2 text-white font-semibold px-8 py-3.5 rounded-full cursor-pointer"
            style={{ background:'linear-gradient(135deg,#6d28d9,#9333ea)', boxShadow:'0 0 20px rgba(139,92,246,.35)' }}>
            <Sparkles size={16} /> Comenzar ahora — gratis
          </button>
        </div>
      </div>
    </section>
  )
}

// ── Qué incluye ───────────────────────────────────────────────────────────────
function QueIncluye() {
  return (
    <section className="py-24 sm:py-28" style={{ background:'#030312' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-purple-400 text-xs font-semibold tracking-widest uppercase mb-3">✴ Contenido ✴</p>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white mb-3">¿Qué incluye tu Registro?</h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto">La lectura completa cubre todos los aspectos de tu camino del alma</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {QUE_INCLUYE.map((q, i) => (
            <div key={i}
              className="card-hover group relative rounded-2xl p-6 overflow-hidden"
              style={{ background:'rgba(255,255,255,.02)', border:'1px solid rgba(255,255,255,.07)' }}>
              <div className="absolute top-0 left-0 right-0 h-px top-line opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{ background:'radial-gradient(ellipse 80% 60% at 50% 0%,rgba(109,40,217,.08) 0%,transparent 70%)' }} />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-purple-400 mb-4 group-hover:text-purple-300 transition-colors"
                  style={{ background:'linear-gradient(135deg,rgba(109,40,217,.22),rgba(139,92,246,.1))', border:'1px solid rgba(139,92,246,.28)' }}>
                  {q.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{q.titulo}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{q.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Preview vs Completo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
          <div className="rounded-2xl p-6"
            style={{ background:'rgba(255,255,255,.02)', border:'1px solid rgba(255,255,255,.07)' }}>
            <div className="flex items-center gap-2 mb-4">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400 text-sm font-semibold">Vista previa — Gratis</span>
            </div>
            <ul className="space-y-2">
              {['Introducción a tu energía akáshica','Primera impresión de tu alma','Destello de tu misión de vida'].map(i => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle size={13} className="text-yellow-400 flex-shrink-0" />{i}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl p-6"
            style={{ background:'linear-gradient(135deg,rgba(109,40,217,.15),rgba(139,92,246,.07))', border:'1px solid rgba(139,92,246,.32)' }}>
            <div className="flex items-center gap-2 mb-4">
              <Lock size={16} className="text-purple-400" />
              <span className="text-purple-300 text-sm font-semibold">Lectura completa — Pago único</span>
            </div>
            <ul className="space-y-2">
              {['Origen y misión del alma','Patrones kármicos y bloqueos','Respuesta a tu pregunta específica','Mensaje de tus Guardianes Akáshicos'].map(i => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle size={13} className="text-purple-400 flex-shrink-0" />{i}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Temas de consulta ─────────────────────────────────────────────────────────
function TemasConsulta({ onOpenModal }) {
  return (
    <section className="py-24 sm:py-28"
      style={{ background:'radial-gradient(ellipse 70% 60% at 50% 50%, #0d0830 0%, #030312 65%)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-purple-400 text-xs font-semibold tracking-widest uppercase mb-3">☽ Temas ☽</p>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white mb-3">¿Sobre qué podés consultar?</h2>
          <p className="text-gray-500 text-sm">Los Registros Akáshicos responden cualquier pregunta del alma</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {PREGUNTAS.map((p, i) => (
            <button key={i} onClick={onOpenModal}
              className="card-hover group rounded-2xl p-5 text-left transition-all w-full"
              style={{ background:'rgba(255,255,255,.02)', border:'1px solid rgba(255,255,255,.07)' }}>
              <div className="text-2xl mb-3">{p.emoji}</div>
              <p className="text-white text-sm font-semibold mb-1.5">{p.tema}</p>
              <p className="text-gray-500 text-xs leading-relaxed italic">"{p.ej}"</p>
              <div className="mt-3 flex items-center gap-1 text-purple-400/60 text-xs group-hover:text-purple-300 transition-colors">
                Consultar <ArrowRight size={11} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Testimonios ───────────────────────────────────────────────────────────────
function Testimonios() {
  return (
    <section className="py-24 sm:py-28" style={{ background:'#030312' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-purple-400 text-xs font-semibold tracking-widest uppercase mb-3">✦ Testimonios ✦</p>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white">Lo que dicen quienes ya consultaron</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIOS.map((t, i) => (
            <div key={i} className="card-hover rounded-2xl p-6"
              style={{ background:'rgba(255,255,255,.02)', border:'1px solid rgba(255,255,255,.07)' }}>
              <div className="flex gap-0.5 mb-3">
                {Array.from({length:t.stars}).map((_,j) => (
                  <Star key={j} size={13} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-5 italic">"{t.texto}"</p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-purple-300"
                  style={{ background:'rgba(109,40,217,.25)' }}>
                  {t.nombre.charAt(0)}
                </div>
                <div>
                  <p className="text-white text-xs font-semibold">{t.nombre}</p>
                  <p className="text-gray-500 text-xs">{t.pais}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CTA central ───────────────────────────────────────────────────────────────
function CTACentral({ onOpenModal }) {
  return (
    <section className="py-20 sm:py-24"
      style={{ background:'radial-gradient(ellipse 80% 100% at 50% 50%, #140e40 0%, #030312 65%)' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <div className="text-purple-400/60 text-2xl mb-5 tracking-[.6em]"
          style={{ animation:'floatY 5s ease-in-out infinite' }}>✦ ☽ ✦</div>
        <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white mb-4">
          Tu alma tiene algo<br />
          <span className="grad-text">importante que decirte</span>
        </h2>
        <p className="text-gray-400 leading-relaxed mb-8">
          Cada día que pasa sin conocer tu misión, tus bloqueos kármicos siguen actuando sin que lo sepas.
          Los Registros Akáshicos te dan las respuestas que buscabas.
        </p>
        <button onClick={onOpenModal}
          className="btn-glow inline-flex items-center gap-2.5 text-white font-bold px-10 py-4 rounded-full text-base cursor-pointer"
          style={{ background:'linear-gradient(135deg,#6d28d9,#9333ea)', boxShadow:'0 0 28px rgba(139,92,246,.4)' }}>
          <Sparkles size={18} /> Abrir mis Registros Akáshicos
        </button>
        <p className="text-gray-600 text-xs mt-4">Vista previa gratuita · Sin registro previo</p>
      </div>
    </section>
  )
}

// ── FAQs ──────────────────────────────────────────────────────────────────────
function FAQs() {
  const [open, setOpen] = useState(null)
  return (
    <section className="py-20 sm:py-24" style={{ background:'#030312' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-purple-400 text-xs font-semibold tracking-widest uppercase mb-3">Preguntas frecuentes</p>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white">Todo lo que necesitás saber</h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <div key={i} className={`border rounded-xl overflow-hidden transition-all duration-200 ${
              open === i ? 'border-purple-500/40' : 'border-white/8'}`}
              style={{ background: open === i ? 'rgba(109,40,217,.08)' : 'rgba(255,255,255,.02)' }}>
              <button className="w-full flex items-center justify-between gap-4 p-5 text-left"
                onClick={() => setOpen(open === i ? null : i)}>
                <span className="text-white font-medium text-sm">{f.p}</span>
                {open === i
                  ? <ChevronUp size={15} className="text-purple-400 flex-shrink-0" />
                  : <ChevronDown size={15} className="text-gray-500 flex-shrink-0" />}
              </button>
              {open === i && (
                <div className="px-5 pb-5">
                  <p className="text-gray-400 text-sm leading-relaxed">{f.r}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Página ────────────────────────────────────────────────────────────────────
export default function Home() {
  const [showModal, setShowModal] = useState(false)
  const openModal = () => setShowModal(true)

  return (
    <div style={{ background:'#030312' }}>
      <style>{GLOBAL_STYLES}</style>
      <Header />
      <main>
        <Hero onOpenModal={openModal} />
        <ComoFunciona onOpenModal={openModal} />
        <QueIncluye />
        <TemasConsulta onOpenModal={openModal} />
        <Testimonios />
        <CTACentral onOpenModal={openModal} />
        <FAQs />
      </main>
      <Footer />
      {showModal && <ModalRegistros onClose={() => setShowModal(false)} />}
    </div>
  )
}
