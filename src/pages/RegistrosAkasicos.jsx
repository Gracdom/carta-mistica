import { useState } from 'react'
import { Sparkles, Lock, BookOpen, Star, ChevronDown } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const STARS = Array.from({ length: 55 }, (_, i) => ({
  id: i,
  w: (((i * 7 + 3) % 22) / 10 + 0.7).toFixed(1),
  left: ((i * 137.5) % 100).toFixed(1),
  top: ((i * 97.3) % 100).toFixed(1),
  dur: (((i * 3 + 2) % 28) / 10 + 2).toFixed(1),
  delay: (((i * 5) % 50) / 10).toFixed(1),
}))

const SIMBOLOS = [
  { char: '✦', x: '5%',  y: '12%', dur: 7,  delay: 0   },
  { char: '☽', x: '93%', y: '10%', dur: 9,  delay: 1   },
  { char: '◈', x: '8%',  y: '55%', dur: 8,  delay: 2   },
  { char: '✴', x: '91%', y: '50%', dur: 6,  delay: 0.5 },
  { char: '⬡', x: '3%',  y: '80%', dur: 10, delay: 3   },
  { char: '✧', x: '95%', y: '75%', dur: 7,  delay: 1.5 },
  { char: '⋆', x: '50%', y: '5%',  dur: 8,  delay: 2.5 },
  { char: '✦', x: '20%', y: '90%', dur: 6,  delay: 0.8 },
  { char: '☽', x: '78%', y: '88%', dur: 9,  delay: 3.5 },
]

const PREGUNTAS_EJEMPLO = [
  'Mi propósito de vida y misión del alma',
  'Bloqueos que me impiden avanzar',
  'Mi camino en el amor y las relaciones',
  'Cómo atraer abundancia y prosperidad',
  'Mis dones espirituales y talentos del alma',
]

const INPUT = 'w-full bg-white/4 border border-white/10 focus:border-purple-500/60 focus:bg-white/6 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition-all text-sm'

function TextoFormateado({ texto }) {
  return (
    <div className="space-y-4">
      {texto.split('\n').filter(l => l.trim()).map((linea, i) => {
        if (linea.startsWith('✦')) {
          return (
            <h3 key={i} className="font-playfair text-lg font-bold text-purple-300 mt-6 mb-2 flex items-center gap-2">
              <span className="text-purple-400">✦</span>
              {linea.replace('✦', '').trim()}
            </h3>
          )
        }
        return <p key={i} className="text-gray-300 text-sm leading-relaxed">{linea}</p>
      })}
    </div>
  )
}

export default function RegistrosAkasicos() {
  const [form, setForm] = useState({
    nombre: '', fechaNacimiento: '', lugar: '', pregunta: ''
  })
  const [estado, setEstado] = useState('idle') // idle | loading | resultado | error
  const [resultado, setResultado] = useState({ preview: '', completa: '' })
  const [error, setError] = useState('')
  const [desbloqueado, setDesbloqueado] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setEstado('loading')
    setDesbloqueado(false)

    try {
      const res = await fetch('/.netlify/functions/akasicos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error || 'Error al consultar los registros.')
      setResultado(data)
      setEstado('resultado')
    } catch (err) {
      setError(err.message)
      setEstado('error')
    }
  }

  const handleNueva = () => {
    setEstado('idle')
    setResultado({ preview: '', completa: '' })
    setDesbloqueado(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="bg-[#030312] min-h-screen">
      <style>{`
        @keyframes twinkle  { 0%,100%{opacity:.12;transform:scale(.8)} 50%{opacity:.9;transform:scale(1.2)} }
        @keyframes floatY   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
        @keyframes floatYR  { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-18px) rotate(12deg)} }
        @keyframes orbPulse { 0%,100%{opacity:.18} 50%{opacity:.42} }
        @keyframes ringRot  { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
        @keyframes ringRotR { from{transform:translate(-50%,-50%) rotate(360deg)} to{transform:translate(-50%,-50%) rotate(0deg)} }
        @keyframes shimmer  { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse-border { 0%,100%{box-shadow:0 0 0 0 rgba(139,92,246,0)} 50%{box-shadow:0 0 0 6px rgba(139,92,246,.15)} }
        .grad-text {
          background: linear-gradient(135deg,#c084fc 0%,#e879f9 30%,#a78bfa 65%,#818cf8 100%);
          background-size:200% 200%;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          animation: shimmer 5s ease infinite;
        }
        .fade-up { animation: fadeUp .6s ease forwards; }
        .fade-up-2 { animation: fadeUp .6s ease .2s both; }
        .fade-up-3 { animation: fadeUp .6s ease .4s both; }
        .btn-glow { transition: box-shadow .3s; }
        .btn-glow:hover { box-shadow: 0 0 40px rgba(139,92,246,.55), 0 4px 20px rgba(0,0,0,.5) !important; }
      `}</style>

      <Header />
      <main>

        {/* ══════ HERO ══════ */}
        <section className="relative min-h-[75vh] flex flex-col items-center justify-center overflow-hidden text-center px-4"
          style={{ background: 'radial-gradient(ellipse 90% 80% at 50% -5%, #180f45 0%, #030312 65%)' }}>

          {/* Stars */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {STARS.map(s => (
              <div key={s.id} className="absolute rounded-full bg-white"
                style={{ width: s.w + 'px', height: s.w + 'px', left: s.left + '%', top: s.top + '%',
                  animation: `twinkle ${s.dur}s ease-in-out infinite`, animationDelay: s.delay + 's' }} />
            ))}
          </div>

          {/* Orbes */}
          <div className="absolute rounded-full pointer-events-none"
            style={{ width:'700px', height:'700px', background:'radial-gradient(circle,rgba(109,40,217,.14) 0%,transparent 65%)', top:'-250px', left:'50%', transform:'translateX(-50%)', animation:'orbPulse 8s ease-in-out infinite' }} />
          <div className="absolute rounded-full pointer-events-none"
            style={{ width:'350px', height:'350px', background:'radial-gradient(circle,rgba(168,85,247,.09) 0%,transparent 65%)', bottom:'-50px', left:'-60px', animation:'orbPulse 11s ease-in-out infinite', animationDelay:'3s' }} />
          <div className="absolute rounded-full pointer-events-none"
            style={{ width:'280px', height:'280px', background:'radial-gradient(circle,rgba(236,72,153,.07) 0%,transparent 65%)', bottom:'20px', right:'-40px', animation:'orbPulse 9s ease-in-out infinite', animationDelay:'5s' }} />

          {/* Anillos */}
          <div className="absolute rounded-full pointer-events-none"
            style={{ width:'500px', height:'500px', border:'1px solid rgba(139,92,246,.08)', top:'50%', left:'50%', animation:'ringRot 28s linear infinite' }} />
          <div className="absolute rounded-full pointer-events-none"
            style={{ width:'660px', height:'660px', border:'1px dashed rgba(167,139,250,.05)', top:'50%', left:'50%', animation:'ringRotR 20s linear infinite' }} />

          {/* Símbolos flotantes */}
          {SIMBOLOS.map((s, i) => (
            <div key={i} className="absolute pointer-events-none select-none text-purple-400/20"
              style={{ left:s.x, top:s.y, fontSize:'1.2rem', animation:`floatYR ${s.dur}s ease-in-out infinite`, animationDelay:`${s.delay}s` }}>
              {s.char}
            </div>
          ))}

          <div className="relative max-w-3xl mx-auto pt-28 pb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 mb-7"
              style={{ background:'linear-gradient(135deg,rgba(109,40,217,.28),rgba(168,85,247,.15))', border:'1px solid rgba(167,139,250,.35)', borderRadius:'9999px', padding:'9px 20px' }}>
              <BookOpen size={13} className="text-purple-300" />
              <span className="text-purple-200 text-xs font-semibold tracking-widest uppercase">Servicio Espiritual · IA Akáshica</span>
            </div>

            <h1 className="font-playfair font-bold text-white leading-tight mb-5"
              style={{ fontSize:'clamp(2.4rem,7vw,4.8rem)', lineHeight:'1.1' }}>
              Registros<br />
              <span className="grad-text">Akáshicos</span>
            </h1>

            <p className="text-gray-400 text-lg leading-relaxed max-w-xl mx-auto mb-4">
              Accedé al campo akáshico de tu alma. Conocé tu misión de vida, tus bloqueos kármicos y las respuestas que tu espíritu necesita.
            </p>
            <p className="text-purple-400/70 text-sm mb-10">
              ✦ Vista previa gratuita · Lectura completa disponible tras el pago ✦
            </p>

            <a href="#formulario"
              className="btn-glow inline-flex items-center gap-2.5 text-white font-semibold px-8 py-4 rounded-full"
              style={{ background:'linear-gradient(135deg,#6d28d9,#9333ea)', boxShadow:'0 0 28px rgba(139,92,246,.4),0 4px 20px rgba(0,0,0,.4)' }}>
              <Sparkles size={17} /> Consultar mis Registros
            </a>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
            style={{ background:'linear-gradient(to bottom,transparent,#030312)' }} />
        </section>

        {/* ══════ FORMULARIO ══════ */}
        <section id="formulario" className="max-w-2xl mx-auto px-4 py-16">
          {estado === 'idle' || estado === 'error' ? (
            <div>
              {/* Card formulario */}
              <div className="relative rounded-2xl p-px mb-8"
                style={{ background:'linear-gradient(135deg,rgba(139,92,246,.45),rgba(109,40,217,.2) 50%,rgba(168,85,247,.45))' }}>
                <div className="rounded-2xl p-7 sm:p-10 overflow-hidden" style={{ background:'#06041a' }}>
                  <div className="absolute top-0 left-0 right-0 h-36 pointer-events-none"
                    style={{ background:'radial-gradient(ellipse 70% 100% at 50% 0%,rgba(109,40,217,.12) 0%,transparent 70%)' }} />

                  <div className="relative text-center mb-8">
                    <div className="text-purple-400/50 text-xl mb-3 tracking-[.5em]"
                      style={{ animation:'floatY 5s ease-in-out infinite' }}>✦ ☽ ✦</div>
                    <h2 className="font-playfair text-2xl font-bold text-white mb-2">
                      Abrí tu Registro Akáshico
                    </h2>
                    <p className="text-gray-500 text-sm">Completá con sinceridad — los Registros responden a tu verdad</p>
                  </div>

                  <form onSubmit={handleSubmit} className="relative space-y-4">
                    <div>
                      <label className="block text-gray-300 text-xs font-semibold mb-1.5">Nombre completo *</label>
                      <input required value={form.nombre} onChange={e => set('nombre', e.target.value)}
                        placeholder="Tu nombre y apellido" className={INPUT} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 text-xs font-semibold mb-1.5">Fecha de nacimiento *</label>
                        <input required type="date" value={form.fechaNacimiento} onChange={e => set('fechaNacimiento', e.target.value)}
                          className={INPUT + ' [color-scheme:dark]'} />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-xs font-semibold mb-1.5">Ciudad / País de nacimiento</label>
                        <input value={form.lugar} onChange={e => set('lugar', e.target.value)}
                          placeholder="Ej: Buenos Aires, Argentina" className={INPUT} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 text-xs font-semibold mb-1.5">
                        Tu pregunta o intención *
                      </label>
                      <textarea required rows={3} value={form.pregunta} onChange={e => set('pregunta', e.target.value)}
                        placeholder="¿Qué querés saber de tus Registros? Sé específico/a..."
                        className={INPUT + ' resize-none'} />
                      <div className="flex flex-wrap gap-2 mt-2">
                        {PREGUNTAS_EJEMPLO.map(p => (
                          <button key={p} type="button" onClick={() => set('pregunta', p)}
                            className="text-xs px-2.5 py-1 rounded-full text-purple-400/80 hover:text-purple-300 transition-colors"
                            style={{ background:'rgba(109,40,217,.15)', border:'1px solid rgba(139,92,246,.25)' }}>
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    {estado === 'error' && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                        {error}
                      </div>
                    )}

                    <button type="submit"
                      className="btn-glow w-full text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2.5 transition-all"
                      style={{ background:'linear-gradient(135deg,#6d28d9,#9333ea)', boxShadow:'0 0 22px rgba(139,92,246,.35)' }}>
                      <Sparkles size={17} />
                      Acceder a mis Registros Akáshicos
                    </button>

                    <p className="text-gray-600 text-xs text-center">
                      ✦ La vista previa es gratuita. La lectura completa requiere pago. ✦
                    </p>
                  </form>
                </div>
              </div>

              {/* Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon:'🔮', titulo:'IA Akáshica', desc:'Canal de inteligencia espiritual entrenado en sabiduría akáshica' },
                  { icon:'🌙', titulo:'Lectura personal', desc:'Cada registro es único, generado solo para vos en este momento' },
                  { icon:'✦',  titulo:'Privado y seguro', desc:'Tu información es confidencial y se usa solo para tu lectura' },
                ].map((c, i) => (
                  <div key={i} className="rounded-xl p-4 text-center"
                    style={{ background:'rgba(255,255,255,.02)', border:'1px solid rgba(255,255,255,.07)' }}>
                    <div className="text-2xl mb-2">{c.icon}</div>
                    <p className="text-white text-sm font-semibold mb-1">{c.titulo}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : estado === 'loading' ? (
            /* Loading */
            <div className="text-center py-20">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full"
                  style={{ border:'2px solid rgba(139,92,246,.2)', animation:'ringRot 3s linear infinite' }} />
                <div className="absolute inset-2 rounded-full"
                  style={{ border:'2px dashed rgba(167,139,250,.3)', animation:'ringRotR 2s linear infinite' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl text-purple-400" style={{ animation:'floatY 2s ease-in-out infinite' }}>✦</span>
                </div>
              </div>
              <p className="font-playfair text-white text-xl font-bold mb-2">Abriendo tus Registros...</p>
              <p className="text-gray-400 text-sm">Los Guardianes Akáshicos están preparando tu lectura</p>
              <div className="flex justify-center gap-1.5 mt-4">
                {[0,1,2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-purple-500"
                    style={{ animation:`orbPulse 1.2s ease-in-out infinite`, animationDelay:`${i * 0.4}s` }} />
                ))}
              </div>
            </div>
          ) : (
            /* Resultado */
            <div className="fade-up">
              {/* Header resultado */}
              <div className="text-center mb-8">
                <div className="text-purple-400/60 text-xl mb-3 tracking-[.5em]">✦ ☽ ✦</div>
                <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-white mb-2">
                  Registros de <span className="text-purple-300">{form.nombre}</span>
                </h2>
                <p className="text-gray-500 text-sm">
                  {new Date(form.fechaNacimiento).toLocaleDateString('es-AR', { day:'numeric', month:'long', year:'numeric' })}
                  {form.lugar ? ` · ${form.lugar}` : ''}
                </p>
              </div>

              {/* Preview (gratis) */}
              <div className="relative rounded-2xl p-px mb-5 fade-up-2"
                style={{ background:'linear-gradient(135deg,rgba(139,92,246,.4),rgba(109,40,217,.15) 50%,rgba(168,85,247,.4))' }}>
                <div className="rounded-2xl p-6 sm:p-8" style={{ background:'#06041a' }}>
                  <div className="flex items-center gap-2 mb-5">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-400 text-xs font-semibold uppercase tracking-wider">Vista previa gratuita</span>
                  </div>
                  <TextoFormateado texto={resultado.preview} />
                </div>
              </div>

              {/* Lectura completa bloqueada / desbloqueada */}
              <div className="relative rounded-2xl overflow-hidden fade-up-3"
                style={{ border:'1px solid rgba(255,255,255,.07)' }}>
                <div className={`p-6 sm:p-8 transition-all duration-500 ${desbloqueado ? '' : 'max-h-48 overflow-hidden'}`}
                  style={{ background:'rgba(255,255,255,.02)' }}>
                  {!desbloqueado && (
                    <div className="absolute inset-0 pointer-events-none z-10"
                      style={{ background:'linear-gradient(to bottom,transparent 20%,rgba(3,3,18,.98) 70%)' }} />
                  )}
                  <div className="flex items-center gap-2 mb-5">
                    <BookOpen size={14} className="text-purple-400" />
                    <span className="text-purple-300 text-xs font-semibold uppercase tracking-wider">Lectura completa</span>
                  </div>
                  {desbloqueado
                    ? <TextoFormateado texto={resultado.completa} />
                    : <TextoFormateado texto={resultado.completa.substring(0, 300) + '...'} />
                  }
                </div>

                {/* CTA pago */}
                {!desbloqueado && (
                  <div className="relative z-20 px-6 pb-8 pt-2 text-center"
                    style={{ background:'rgba(3,3,18,.98)' }}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ background:'rgba(109,40,217,.2)', border:'1px solid rgba(139,92,246,.4)', animation:'pulse-border 3s ease-in-out infinite' }}>
                      <Lock size={20} className="text-purple-400" />
                    </div>
                    <h3 className="font-playfair text-white text-xl font-bold mb-2">
                      Desbloqueá tu lectura completa
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm mx-auto">
                      Tu registro incluye: origen del alma, patrones kármicos, respuesta a tu pregunta y mensaje de tus Guardianes Akáshicos.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      <a
                        href="https://wa.me/TUNUMERO?text=Hola%2C%20quiero%20desbloquear%20mi%20lectura%20akáshica%20completa"
                        target="_blank" rel="noopener noreferrer"
                        className="btn-glow inline-flex items-center gap-2 text-white font-semibold px-7 py-3.5 rounded-full w-full sm:w-auto justify-center"
                        style={{ background:'linear-gradient(135deg,#6d28d9,#9333ea)', boxShadow:'0 0 22px rgba(139,92,246,.35)' }}>
                        <Sparkles size={16} /> Desbloquear por WhatsApp
                      </a>
                      <button
                        onClick={() => setDesbloqueado(true)}
                        className="text-purple-500 hover:text-purple-400 text-sm transition-colors underline underline-offset-4">
                        Ya pagué, mostrar lectura
                      </button>
                    </div>
                    <p className="text-gray-600 text-xs mt-4">
                      Una vez confirmado el pago, hacé clic en "Ya pagué" para ver tu lectura.
                    </p>
                  </div>
                )}
              </div>

              {/* Botón nueva consulta */}
              <div className="text-center mt-8">
                <button onClick={handleNueva}
                  className="text-gray-500 hover:text-gray-300 text-sm transition-colors border border-white/10 hover:border-white/20 px-6 py-3 rounded-full">
                  Hacer una nueva consulta
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
