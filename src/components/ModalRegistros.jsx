import { useState, useEffect, useRef } from 'react'
import { X, Sparkles, ArrowRight, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'

// ── Datos ─────────────────────────────────────────────────────────────────────
const INTENCIONES = [
  { label: 'Amor y relaciones',     icon: '♡', color: 'rgba(236,72,153,.6)'  },
  { label: 'Propósito de vida',     icon: '✦', color: 'rgba(139,92,246,.6)'  },
  { label: 'Bloqueos espirituales', icon: '◈', color: 'rgba(99,102,241,.6)'  },
  { label: 'Dinero y abundancia',   icon: '☽', color: 'rgba(234,179,8,.6)'   },
  { label: 'Llamas gemelas',        icon: '⟡', color: 'rgba(239,68,68,.6)'   },
  { label: 'Trabajo y carrera',     icon: '✴', color: 'rgba(16,185,129,.6)'  },
  { label: 'Karma y vidas pasadas', icon: '∞', color: 'rgba(139,92,246,.6)'  },
  { label: 'Salud y energía',       icon: '✧', color: 'rgba(20,184,166,.6)'  },
  { label: 'Familia y vínculos',    icon: '⋆', color: 'rgba(249,115,22,.6)'  },
  { label: 'Misión del alma',       icon: '◎', color: 'rgba(168,85,247,.6)'  },
]

const PREGUNTAS = [
  { key: 'nombre',          type: 'text',  pregunta: '¿Cuál es tu nombre?',                     placeholder: 'Escribe tu nombre completo…'          },
  { key: 'email',           type: 'email', pregunta: 'Dejanos tu correo para recibir tu lectura', placeholder: 'tu@email.com'                         },
  { key: 'fechaNacimiento', type: 'date',  pregunta: '¿Cuándo llegaste a este mundo?',           placeholder: ''                                     },
  { key: 'lugar',           type: 'text',  pregunta: '¿Desde qué rincón del universo?',          placeholder: 'Ciudad o país donde naciste…'         },
]

const FRASES_LOADING = [
  'Abriendo el campo akáshico…',
  'Los Guardianes de los Registros te escuchan…',
  'Accediendo a las memorias de tu alma…',
  'Tejiendo los hilos de tu historia cósmica…',
  'Canalizando el mensaje de tus Guardianes…',
]

// Partículas estáticas
const PARTICLES = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  x: ((i * 137.5) % 100).toFixed(1),
  y: ((i * 97.3) % 100).toFixed(1),
  s: (((i * 7 + 3) % 12) / 10 + 0.4).toFixed(1),
  d: (((i * 3 + 2) % 28) / 10 + 3).toFixed(1),
  dl: (((i * 5) % 60) / 10).toFixed(1),
}))

// ── Hook: typewriter ─────────────────────────────────────────────────────────
function useTypewriter(text, speed = 35) {
  const [shown, setShown] = useState('')
  const [done, setDone]   = useState(false)
  useEffect(() => {
    setShown('')
    setDone(false)
    let i = 0
    const t = setInterval(() => {
      i++
      setShown(text.slice(0, i))
      if (i >= text.length) { clearInterval(t); setDone(true) }
    }, speed)
    return () => clearInterval(t)
  }, [text, speed])
  return { shown, done }
}

// ── Pantalla de carga ─────────────────────────────────────────────────────────
function Analizando() {
  const [frase, setFrase] = useState(0)
  const [prog, setProg]   = useState(0)
  useEffect(() => {
    const t1 = setInterval(() => setFrase(f => (f + 1) % FRASES_LOADING.length), 2400)
    const t2 = setInterval(() => setProg(p => Math.min(p + 1, 95)), 160)
    return () => { clearInterval(t1); clearInterval(t2) }
  }, [])
  return (
    <div className="flex flex-col items-center justify-center py-12 px-8 text-center">
      <style>{`
        @keyframes orb { to{transform:rotate(360deg)} }
        @keyframes orbR{ to{transform:rotate(-360deg)} }
        @keyframes puls{ 0%,100%{opacity:.15;transform:scale(.9)} 50%{opacity:.6;transform:scale(1.1)} }
        @keyframes fmsg{ 0%{opacity:0;transform:translateY(8px)} 15%,80%{opacity:1;transform:translateY(0)} 100%{opacity:0} }
        .ra{animation:orb  4s linear infinite}
        .rb{animation:orbR 2.8s linear infinite}
        .rc{animation:orb  7s linear infinite}
        .pc{animation:puls 2.5s ease-in-out infinite}
        .fm{animation:fmsg 2.4s ease forwards}
      `}</style>
      <div className="relative w-32 h-32 mb-10">
        <div className="absolute inset-0 rounded-full" style={{background:'radial-gradient(circle,rgba(139,92,246,.14),transparent 70%)'}}/>
        <div className="ra absolute inset-0 rounded-full" style={{border:'1px solid rgba(139,92,246,.14)'}}/>
        <div className="rb absolute inset-3 rounded-full" style={{border:'1px dashed rgba(167,139,250,.18)'}}/>
        <div className="rc absolute inset-6 rounded-full" style={{border:'1px dotted rgba(139,92,246,.1)'}}/>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="pc text-5xl select-none" style={{color:'rgba(196,181,253,.45)'}}>✦</span>
        </div>
        {[0,1,2,3].map(i => (
          <div key={i} className="ra absolute inset-0" style={{animationDelay:`${i*.75}s`}}>
            <div className="absolute w-1 h-1 rounded-full" style={{top:0,left:'50%',transform:'translateX(-50%)',background:'rgba(167,139,250,.5)'}}/>
          </div>
        ))}
      </div>
      <p className="font-playfair text-white/70 text-xl font-semibold mb-3 tracking-wide">Consultando los Registros</p>
      <p key={frase} className="fm text-violet-300/40 text-sm mb-10 h-5">{FRASES_LOADING[frase]}</p>
      <div className="w-64">
        <div className="h-px rounded-full overflow-hidden" style={{background:'rgba(255,255,255,.05)'}}>
          <div className="h-full transition-all duration-200" style={{width:`${prog}%`,background:'linear-gradient(90deg,rgba(109,40,217,.5),rgba(167,139,250,.7))'}}/>
        </div>
        <p className="text-white/12 text-xs mt-2 text-right">{prog}%</p>
      </div>
    </div>
  )
}

// ── Un campo tipo ritual ─────────────────────────────────────────────────────
function CampoRitual({ preguntaKey, tipo, preguntaTexto, placeholder, valor, onChange, onEnter, autoFocus }) {
  const { shown } = useTypewriter(preguntaTexto, 38)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (autoFocus) setTimeout(() => inputRef.current?.focus(), 400)
  }, [autoFocus, preguntaKey])

  return (
    <div className="flex flex-col items-center text-center px-6 py-8">
      {/* Pregunta con typewriter */}
      <p className="font-playfair text-white/80 text-xl font-semibold leading-snug tracking-wide">
        {shown}
        <span className="inline-block w-0.5 h-5 bg-violet-400/60 ml-1 align-middle animate-pulse" />
      </p>

      {/* Input sublínea */}
      <div className="relative w-full max-w-xs mt-8">
        {/* Glow de foco */}
        <div className="absolute -inset-4 rounded-full pointer-events-none transition-all duration-700"
          style={{background: focused ? 'radial-gradient(ellipse 80% 60% at 50% 100%,rgba(109,40,217,.12),transparent)' : 'transparent'}}/>

        <input
          ref={inputRef}
          type={tipo}
          value={valor}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={e => e.key === 'Enter' && onEnter()}
          placeholder={placeholder}
          className="w-full bg-transparent border-0 border-b text-center text-white text-lg placeholder-white/15 outline-none pb-3 transition-all duration-300 [color-scheme:dark]"
          style={{
            borderBottomColor: focused ? 'rgba(139,92,246,.6)' : 'rgba(255,255,255,.1)',
            boxShadow: focused ? '0 1px 0 rgba(139,92,246,.3)' : 'none',
            caretColor: 'rgba(139,92,246,.8)',
          }}
        />

        {/* Indicador de foco animado */}
        <div className="absolute bottom-0 left-1/2 h-px transition-all duration-500 rounded-full"
          style={{
            background: 'rgba(139,92,246,.6)',
            width: focused ? '100%' : '0%',
            transform: 'translateX(-50%)',
          }}/>
      </div>

      {tipo !== 'date' && (
        <p className="text-white/15 text-xs mt-5">Presioná Enter para continuar</p>
      )}
    </div>
  )
}

// ── Grid de intenciones ──────────────────────────────────────────────────────
function GridIntenciones({ valor, onChange }) {
  const { shown } = useTypewriter('¿Qué desea revelar tu alma?', 40)
  return (
    <div className="flex flex-col items-center px-4 py-4">
      <p className="font-playfair text-white/80 text-lg font-semibold mb-1 text-center tracking-wide">
        {shown}
        <span className="inline-block w-0.5 h-5 bg-violet-400/60 ml-1 align-middle animate-pulse" />
      </p>
      <p className="text-white/20 text-xs mb-3 text-center">Elegí todo lo que resuene en este momento</p>

      <div className="grid grid-cols-2 gap-2 w-full">
        {INTENCIONES.map(({ label, icon, color }) => {
          const sel = valor.includes(label)
          return (
            <button
              key={label}
              type="button"
              onClick={() => onChange(sel ? valor.filter(v => v !== label) : [...valor, label])}
              className="group relative flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all duration-300 overflow-hidden"
              style={{
                background: sel ? `linear-gradient(135deg,${color.replace('.6','.15')},rgba(0,0,0,0))` : 'rgba(255,255,255,.025)',
                border: `1px solid ${sel ? color.replace('.6','.35') : 'rgba(255,255,255,.06)'}`,
                boxShadow: sel ? `0 0 16px ${color.replace('.6','.12')}` : 'none',
              }}
            >
              {/* Glow de fondo al seleccionar */}
              {sel && (
                <div className="absolute inset-0 pointer-events-none"
                  style={{background:`radial-gradient(circle at 20% 50%,${color.replace('.6','.08')},transparent 60%)`}}/>
              )}
              <span className="text-lg sm:text-xl leading-none relative z-10 transition-all duration-300"
                style={{opacity: sel ? 1 : 0.2, textShadow: sel ? `0 0 12px ${color}` : 'none'}}>
                {icon}
              </span>
              <span className="text-xs leading-snug relative z-10 transition-colors duration-200"
                style={{color: sel ? 'rgba(255,255,255,.8)' : 'rgba(255,255,255,.3)'}}>
                {label}
              </span>
              {sel && (
                <div className="ml-auto relative z-10 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{background: color.replace('.6','.3'), border:`1px solid ${color.replace('.6','.5')}`}}>
                  <Check size={9} className="text-white"/>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {valor.length > 0 && (
        <p className="text-violet-400/40 text-xs text-center mt-3">
          {valor.length} {valor.length === 1 ? 'intención elegida' : 'intenciones elegidas'}
        </p>
      )}
    </div>
  )
}

// ── Modal principal ───────────────────────────────────────────────────────────
export default function ModalRegistros({ onClose }) {
  const [estado, setEstado]         = useState('form')
  const [paso, setPaso]             = useState(0)       // 0-3 = 4 preguntas, 4 = intenciones
  const [animDir, setAnimDir]       = useState(1)
  const [animKey, setAnimKey]       = useState(0)
  const [form, setForm]             = useState({ nombre:'', fechaNacimiento:'', lugar:'', intenciones:[], email:'' })
  const [teaser, setTeaser]         = useState('')
  const [consultaId, setConsultaId] = useState(null)
  const [loadingPago, setLoadingPago] = useState(false)
  const [error, setError]           = useState('')

  useEffect(() => {
    const fn = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  const set = (k, v) => setForm(f => ({...f, [k]: v}))

  const irA = (n) => {
    setAnimDir(n > paso ? 1 : -1)
    setAnimKey(k => k + 1)
    setPaso(n)
    setError('')
  }

  const TOTAL_PASOS = 5  // 4 inputs + 1 intenciones

  const validar = () => {
    if (paso === 0 && !form.nombre.trim())        { setError('Escribe tu nombre para continuar.'); return false }
    if (paso === 1 && !form.email.trim())         { setError('Ingresá tu email para continuar.'); return false }
    if (paso === 1 && !/\S+@\S+\.\S+/.test(form.email)) { setError('El email no es válido.'); return false }
    if (paso === 2 && !form.fechaNacimiento)      { setError('Ingresá tu fecha de nacimiento.'); return false }
    if (paso === 4 && form.intenciones.length===0){ setError('Elegí al menos una intención.'); return false }
    return true
  }

  // Guarda o actualiza la consulta en Supabase con los datos disponibles hasta el paso actual
  const guardarParcial = async (formActual, idActual) => {
    try {
      if (!idActual) {
        // Primera vez: INSERT con los datos mínimos (nombre ya validado)
        const { data, error: dbErr } = await supabase
          .from('consultas_akasicas')
          .insert({
            nombre:           formActual.nombre,
            fecha_nacimiento: formActual.fechaNacimiento || null,
            lugar_nacimiento: formActual.lugar || null,
            email:            formActual.email || null,
            intenciones:      formActual.intenciones,
            estado:           'incompleto',
          })
          .select('id').single()
        if (dbErr) { console.error('DB insert:', dbErr); return null }
        return data?.id ?? null
      } else {
        // Siguientes pasos: UPDATE
        await supabase
          .from('consultas_akasicas')
          .update({
            fecha_nacimiento: formActual.fechaNacimiento || null,
            lugar_nacimiento: formActual.lugar || null,
            email:            formActual.email || null,
            intenciones:      formActual.intenciones,
          })
          .eq('id', idActual)
        return idActual
      }
    } catch (e) {
      console.error('guardarParcial error:', e)
      return idActual
    }
  }

  const siguiente = async () => {
    if (!validar()) return
    const nuevoId = await guardarParcial(form, consultaId)
    const idActivo = nuevoId || consultaId
    if (nuevoId && nuevoId !== consultaId) setConsultaId(nuevoId)

    if (paso < TOTAL_PASOS - 1) { irA(paso + 1) }
    else { handleSubmit(idActivo) }
  }

  const handleSubmit = async (idParam) => {
    setEstado('analyzing')
    setError('')
    const id = idParam || consultaId
    try {
      if (id) {
        await supabase
          .from('consultas_akasicas')
          .update({ intenciones: form.intenciones, estado: 'pendiente' })
          .eq('id', id)
      }

      const { data, error: fnErr } = await supabase.functions.invoke('akasicos', {
        body: {
          nombre:          form.nombre,
          fechaNacimiento: form.fechaNacimiento,
          lugar:           form.lugar,
          pregunta:        form.intenciones.join(', '),
        },
      })

      // La función siempre devuelve 200; los errores vienen en data.error
      const errorMsg = data?.error || fnErr?.message
      if (errorMsg) throw new Error(errorMsg)

      if (!data?.teaser) throw new Error('La lectura llegó incompleta. Intentá de nuevo.')

      if (id) {
        await supabase.from('consultas_akasicas')
          .update({ lectura_teaser: data.teaser, lectura_completa: data.completa, estado: 'preview' })
          .eq('id', id)
      }
      if (id) setConsultaId(id)
      setTeaser(data.teaser)
      setEstado('preview')
    } catch (e) {
      console.error('[ModalRegistros] handleSubmit error:', e)
      setError(e.message || 'Los Registros no pudieron abrirse. Intentá de nuevo.')
      setEstado('form')
      setPaso(4) // volver al paso de intenciones, no al inicio
    }
  }

  const handlePagar = async () => {
    setLoadingPago(true)
    const idFinal = consultaId
    if (!idFinal) {
      alert('Error: no se encontró la consulta. Intentá de nuevo.')
      setLoadingPago(false)
      return
    }
    try {
      const { data, error: fnErr } = await supabase.functions.invoke('create-checkout', {
        body: { consultaId: idFinal, email: form.email, nombre: form.nombre },
      })
      if (fnErr || data?.error) throw new Error(data?.error || fnErr?.message)
      if (data?.url) window.location.href = data.url
    } catch (err) { alert(err.message); setLoadingPago(false) }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{background:'rgba(2,1,14,.92)', backdropFilter:'blur(20px)'}}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <style>{`
        @keyframes tw  { 0%,100%{opacity:.08} 50%{opacity:.35} }
        @keyframes sIn { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes sInL{ from{opacity:0;transform:translateX(-40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .s-r{ animation: sIn  .4s cubic-bezier(.25,.46,.45,.94) forwards }
        .s-l{ animation: sInL .4s cubic-bezier(.25,.46,.45,.94) forwards }
        .fu { animation: fadeUp .5s ease forwards }
        @keyframes floatSymbol { 0%,100%{transform:translateY(0) rotate(0deg);opacity:.08} 50%{transform:translateY(-12px) rotate(8deg);opacity:.18} }
        @keyframes lockPulse { 0%,100%{box-shadow:0 0 0px rgba(109,40,217,0)} 50%{box-shadow:0 0 40px rgba(109,40,217,.25)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes btnPulse { 0%,100%{box-shadow:0 0 20px rgba(109,40,217,.3),0 0 0px rgba(139,92,246,0)} 50%{box-shadow:0 0 50px rgba(109,40,217,.5),0 0 80px rgba(139,92,246,.15)} }
        @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(400%)} }
        @keyframes revealGlow { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }
        .btn-pulse { animation: btnPulse 2.5s ease-in-out infinite }
        .lock-pulse { animation: lockPulse 3s ease-in-out infinite }
        .reveal-glow { animation: revealGlow .6s ease forwards }
        .modal-scroll::-webkit-scrollbar { display: none }
        .modal-scroll { -ms-overflow-style: none; scrollbar-width: none }
      `}</style>

      <div
        className="relative w-full max-w-lg flex flex-col rounded-2xl overflow-hidden"
        style={{
          background:'#05030f',
          boxShadow:'0 0 80px rgba(109,40,217,.2), 0 0 0 1px rgba(139,92,246,.1)',
          maxHeight: 'min(90svh, 90vh)',
        }}
      >
        {/* ── Partículas de fondo ── */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none rounded-2xl">
          {PARTICLES.map(p => (
            <div key={p.id} className="absolute rounded-full bg-white"
              style={{left:`${p.x}%`,top:`${p.y}%`,width:`${p.s}px`,height:`${p.s}px`,animation:`tw ${p.d}s ${p.dl}s ease-in-out infinite`}}/>
          ))}
          {['✦','☽','◈','✧','⟡','∞'].map((s,i) => (
            <span key={i} className="absolute text-white/10 text-2xl select-none pointer-events-none font-light"
              style={{
                left:`${[8,85,15,78,45,92][i]}%`,
                top:`${[15,20,60,55,80,75][i]}%`,
                animation:`floatSymbol ${6+i*1.5}s ${i*.8}s ease-in-out infinite`,
              }}>
              {s}
            </span>
          ))}
        </div>

        {/* Glow top */}
        <div className="absolute top-0 inset-x-0 h-32 pointer-events-none"
          style={{background:'radial-gradient(ellipse 80% 100% at 50% -5%,rgba(109,40,217,.1),transparent 70%)'}}/>
        <div className="absolute top-0 inset-x-16 h-px pointer-events-none"
          style={{background:'linear-gradient(90deg,transparent,rgba(139,92,246,.25),transparent)'}}/>

        {/* Cerrar */}
        <button onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center text-white/20 hover:text-white/50 hover:bg-white/5 transition-all">
          <X size={14}/>
        </button>

        {/* ── FORM ── */}
        {estado === 'form' && (
          <>
            {/* Barra de progreso — fija arriba */}
            <div className="relative z-10 px-6 pt-5 pb-3 flex-shrink-0">
              <p className="text-center text-white/10 text-xs tracking-[.8em] mb-3 select-none">✦ ◈ ☽</p>
              <div className="flex items-center justify-center gap-1.5">
                {Array.from({length: TOTAL_PASOS}).map((_, i) => (
                  <div key={i} className="transition-all duration-500 rounded-full"
                    style={{
                      width:  i === paso ? '20px' : '5px',
                      height: '5px',
                      background: i < paso
                        ? 'rgba(139,92,246,.6)'
                        : i === paso
                          ? 'linear-gradient(90deg,rgba(109,40,217,.8),rgba(167,139,250,.8))'
                          : 'rgba(255,255,255,.07)',
                    }}/>
                ))}
              </div>
            </div>

            {/* Zona de contenido — scrollable. min-h-0 es obligatorio para que overflow-y funcione en flexbox */}
            <div className="relative z-10 flex-1 min-h-0 overflow-y-auto modal-scroll">
              <div
                key={animKey}
                className={animDir > 0 ? 's-r' : 's-l'}
              >
                {paso < 4 ? (
                  <CampoRitual
                    preguntaKey={paso}
                    tipo={PREGUNTAS[paso].type}
                    preguntaTexto={PREGUNTAS[paso].pregunta}
                    placeholder={PREGUNTAS[paso].placeholder}
                    valor={form[PREGUNTAS[paso].key]}
                    onChange={v => set(PREGUNTAS[paso].key, v)}
                    onEnter={siguiente}
                    autoFocus
                  />
                ) : (
                  <GridIntenciones
                    valor={form.intenciones}
                    onChange={v => set('intenciones', v)}
                  />
                )}
              </div>
            </div>

            {/* Footer — fijo abajo */}
            <div className="relative z-10 flex-shrink-0 px-5 pt-3 pb-5"
              style={{borderTop:'1px solid rgba(255,255,255,.04)'}}>
              {error && (
                <p className="text-red-400/60 text-xs text-center mb-3 px-3 py-2 rounded-lg"
                  style={{background:'rgba(220,38,38,.06)',border:'1px solid rgba(220,38,38,.1)'}}>
                  {error}
                </p>
              )}
              {paso > 0 ? (
                <div className="flex items-center justify-between">
                  <button onClick={() => irA(paso - 1)}
                    className="text-white/25 hover:text-white/50 text-xs transition-colors px-3 py-2">
                    ← Volver
                  </button>
                  <button
                    onClick={siguiente}
                    className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg,rgba(109,40,217,.7),rgba(139,92,246,.5))',
                      border: '1px solid rgba(139,92,246,.25)',
                      boxShadow: '0 0 28px rgba(109,40,217,.2)',
                      color: 'rgba(255,255,255,.9)',
                    }}>
                    {paso === TOTAL_PASOS - 1
                      ? <><Sparkles size={13} className="text-violet-300"/>Abrir mis Registros</>
                      : <>Continuar <ArrowRight size={13}/></>
                    }
                  </button>
                </div>
              ) : (
                <button
                  onClick={siguiente}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-semibold transition-all active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg,rgba(109,40,217,.7),rgba(139,92,246,.5))',
                    border: '1px solid rgba(139,92,246,.25)',
                    boxShadow: '0 0 28px rgba(109,40,217,.2)',
                    color: 'rgba(255,255,255,.9)',
                  }}>
                  Continuar <ArrowRight size={13}/>
                </button>
              )}
            </div>
          </>
        )}

        {/* ── ANALIZANDO ── */}
        {estado === 'analyzing' && (
          <div className="flex-1 min-h-0 overflow-y-auto modal-scroll">
            <Analizando/>
          </div>
        )}

        {/* ── PREVIEW ── */}
        {estado === 'preview' && (
          <div className="relative reveal-glow flex-1 min-h-0 overflow-y-auto modal-scroll px-4 sm:px-7 pt-5 pb-6">
            <div className="absolute inset-0 pointer-events-none"
              style={{background:'radial-gradient(ellipse 80% 60% at 50% 100%,rgba(109,40,217,.1),transparent 70%)'}}/>

            {/* Header */}
            <div className="text-center mb-4 relative z-10">
              <span className="text-violet-400/30 text-[10px] tracking-widest">✦ ◈ ✦</span>
              <h2 className="font-playfair text-white text-xl font-bold mt-1">
                Listo, <span style={{background:'linear-gradient(135deg,#c4b5fd,#a78bfa)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{form.nombre.split(' ')[0]}</span>
              </h2>
            </div>

            {/* Teaser — ancho completo en móvil */}
            <div className="relative rounded-xl p-4 overflow-hidden mb-3 relative z-10"
              style={{background:'linear-gradient(135deg,rgba(109,40,217,.12),rgba(79,46,220,.05))',border:'1px solid rgba(139,92,246,.18)'}}>
              <div className="absolute inset-x-0 h-10 pointer-events-none opacity-20"
                style={{background:'linear-gradient(180deg,transparent,rgba(139,92,246,.1),transparent)',animation:'scanline 4s linear infinite'}}/>
              <p className="text-violet-400/50 text-[9px] uppercase tracking-widest mb-2">✦ Vista previa de tu lectura</p>
              <p className="text-white/65 text-xs leading-relaxed italic relative z-10">"{teaser}"</p>
            </div>

            {/* Bloqueado + features en fila */}
            <div className="relative rounded-xl overflow-hidden lock-pulse mb-3 relative z-10"
              style={{border:'1px solid rgba(139,92,246,.2)'}}>
              <div className="absolute inset-0"
                style={{background:'linear-gradient(135deg,rgba(30,10,60,.92),rgba(10,5,30,.96))'}}/>
              <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{background:'linear-gradient(90deg,transparent,rgba(139,92,246,.15),transparent)',backgroundSize:'200% 100%',animation:'shimmer 3s linear infinite'}}/>
              <div className="relative p-4 flex items-center gap-4">
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{background:'rgba(109,40,217,.3)',border:'1px solid rgba(139,92,246,.4)'}}>
                  <span className="text-violet-300">◈</span>
                </div>
                <div>
                  <p className="text-white/40 text-[9px] tracking-widest uppercase mb-1">Contenido bloqueado</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                    {['✦ Misión del alma','◈ Bloqueos kármicos','☽ Amor y relaciones','⟡ Guardianes'].map((t,i)=>(
                      <span key={i} className="text-white/25 text-[9px]">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Precio + CTA */}
            <div className="relative z-10 flex items-center gap-3 mb-3">
              <div className="text-center flex-shrink-0 w-14">
                <p className="font-playfair text-white/85 text-2xl font-bold leading-none">
                  6<span className="text-violet-300/70 text-lg">€</span>
                </p>
                <p className="text-white/20 text-[9px] mt-0.5">único</p>
              </div>
              <button
                onClick={handlePagar}
                disabled={loadingPago}
                className="btn-pulse relative flex-1 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[.98] disabled:opacity-40 overflow-hidden"
                style={{background:'linear-gradient(135deg,#6d28d9,#7c3aed,#8b5cf6)',border:'1px solid rgba(167,139,250,.3)',color:'rgba(255,255,255,.95)'}}>
                <div className="absolute inset-0 pointer-events-none"
                  style={{background:'linear-gradient(90deg,transparent,rgba(255,255,255,.07),transparent)',backgroundSize:'200% 100%',animation:'shimmer 2s linear infinite'}}/>
                {loadingPago
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                  : <><Sparkles size={14} className="text-violet-200 relative z-10"/><span className="relative z-10">Desbloquear lectura completa</span></>
                }
              </button>
            </div>

            <p className="relative z-10 text-white/15 text-[9px] text-center">🔒 Pago seguro con Stripe · {form.email}</p>
          </div>
        )}
      </div>
    </div>
  )
}
