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
  { key: 'nombre',          type: 'text',  pregunta: '¿Cuál es tu nombre?',                placeholder: 'Escribe tu nombre completo…'          },
  { key: 'fechaNacimiento', type: 'date',  pregunta: '¿Cuándo llegaste a este mundo?',      placeholder: ''                                     },
  { key: 'lugar',           type: 'text',  pregunta: '¿Desde qué rincón del universo?',     placeholder: 'Ciudad o país donde naciste…'         },
  { key: 'email',           type: 'email', pregunta: 'El portal donde recibirás tu mensaje', placeholder: 'tu@email.com'                         },
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
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
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
    <div className="flex flex-col items-center justify-center text-center px-6 py-4">
      {/* Pregunta con typewriter */}
      <p className="font-playfair text-white/80 text-xl sm:text-2xl font-semibold mb-1 min-h-[2rem] leading-snug tracking-wide">
        {shown}
        <span className="inline-block w-0.5 h-5 bg-violet-400/60 ml-1 align-middle animate-pulse" />
      </p>

      {/* Input sublínea */}
      <div className="relative w-full max-w-sm mt-8">
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
          className="w-full bg-transparent border-0 border-b text-center text-white text-lg sm:text-xl placeholder-white/15 outline-none pb-3 transition-all duration-300 [color-scheme:dark]"
          style={{
            borderBottomColor: focused ? 'rgba(139,92,246,.6)' : 'rgba(255,255,255,.1)',
            boxShadow: focused ? '0 1px 0 rgba(139,92,246,.3)' : 'none',
            caretColor: 'rgba(139,92,246,.8)',
          }}
        />

        {/* Indicador de foco */}
        <div className="absolute bottom-0 left-1/2 h-px transition-all duration-500 rounded-full"
          style={{
            background: 'rgba(139,92,246,.6)',
            width: focused ? '100%' : '0%',
            transform: 'translateX(-50%)',
          }}/>
      </div>

      {tipo !== 'date' && (
        <p className="text-white/15 text-xs mt-4">Presioná Enter para continuar</p>
      )}
    </div>
  )
}

// ── Grid de intenciones ──────────────────────────────────────────────────────
function GridIntenciones({ valor, onChange }) {
  const { shown } = useTypewriter('¿Qué desea revelar tu alma?', 40)
  return (
    <div className="flex flex-col items-center px-4 py-2">
      <p className="font-playfair text-white/80 text-xl sm:text-2xl font-semibold mb-1 text-center min-h-[2rem] tracking-wide">
        {shown}
        <span className="inline-block w-0.5 h-5 bg-violet-400/60 ml-1 align-middle animate-pulse" />
      </p>
      <p className="text-white/20 text-xs mb-6 text-center">Elegí todo lo que resuene en este momento</p>

      <div className="grid grid-cols-2 gap-2 w-full">
        {INTENCIONES.map(({ label, icon, color }) => {
          const sel = valor.includes(label)
          return (
            <button
              key={label}
              type="button"
              onClick={() => onChange(sel ? valor.filter(v => v !== label) : [...valor, label])}
              className="group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all duration-300 overflow-hidden"
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
              <span className="text-xl leading-none relative z-10 transition-all duration-300"
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
        <p className="text-violet-400/40 text-xs text-center mt-4">
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
    if (paso === 1 && !form.fechaNacimiento)      { setError('Ingresá tu fecha de nacimiento.'); return false }
    if (paso === 4 && form.intenciones.length===0){ setError('Elegí al menos una intención.'); return false }
    return true
  }

  const siguiente = () => {
    if (!validar()) return
    if (paso < TOTAL_PASOS - 1) { irA(paso + 1) }
    else { handleSubmit() }
  }

  const handleSubmit = async () => {
    setEstado('analyzing')
    setError('')
    try {
      const { data: consulta, error: dbErr } = await supabase
        .from('consultas_akasicas')
        .insert({ nombre: form.nombre, fecha_nacimiento: form.fechaNacimiento, lugar_nacimiento: form.lugar||null, intenciones: form.intenciones, email: form.email, estado: 'pendiente' })
        .select('id').single()
      if (dbErr) console.error('DB:', dbErr)
      const id = consulta?.id
      setConsultaId(id)
      const { data, error: fnErr } = await supabase.functions.invoke('akasicos', {
        body: { nombre: form.nombre, fechaNacimiento: form.fechaNacimiento, lugar: form.lugar, pregunta: form.intenciones.join(', ') },
      })
      if (fnErr || data?.error) throw new Error(data?.error || fnErr?.message || 'Error al consultar los registros.')
      if (id) await supabase.from('consultas_akasicas').update({ lectura_teaser: data.teaser, lectura_completa: data.completa, estado: 'preview' }).eq('id', id)
      setTeaser(data.teaser)
      setEstado('preview')
    } catch (err) {
      setError(err.message || 'Ocurrió un error. Intentá de nuevo.')
      setEstado('form')
      setPaso(0)
    }
  }

  const handlePagar = async () => {
    setLoadingPago(true)
    try {
      const { data, error: fnErr } = await supabase.functions.invoke('create-checkout', {
        body: { consultaId, email: form.email, nombre: form.nombre },
      })
      if (fnErr || data?.error) throw new Error(data?.error || fnErr?.message)
      if (data?.url) window.location.href = data.url
    } catch (err) { alert(err.message); setLoadingPago(false) }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{background:'rgba(2,1,14,.9)', backdropFilter:'blur(16px)'}}
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
      `}</style>

      <div
        className="relative w-full sm:max-w-xl max-h-[96vh] sm:max-h-[88vh] overflow-hidden rounded-t-3xl sm:rounded-2xl flex flex-col"
        style={{background:'#05030f', boxShadow:'0 -8px 100px rgba(109,40,217,.15), 0 0 0 1px rgba(139,92,246,.08)'}}
      >
        {/* ── Partículas de fondo ── */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          {PARTICLES.map(p => (
            <div key={p.id} className="absolute rounded-full bg-white"
              style={{left:`${p.x}%`,top:`${p.y}%`,width:`${p.s}px`,height:`${p.s}px`,animation:`tw ${p.d}s ${p.dl}s ease-in-out infinite`}}/>
          ))}
          {/* Símbolos flotantes */}
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
        <div className="absolute top-0 inset-x-0 h-40 pointer-events-none"
          style={{background:'radial-gradient(ellipse 80% 100% at 50% -5%,rgba(109,40,217,.1),transparent 70%)'}}/>
        <div className="absolute top-0 inset-x-16 h-px pointer-events-none"
          style={{background:'linear-gradient(90deg,transparent,rgba(139,92,246,.25),transparent)'}}/>

        {/* Cerrar */}
        <button onClick={onClose}
          className="absolute top-4 right-4 z-20 w-7 h-7 rounded-full flex items-center justify-center text-white/15 hover:text-white/40 hover:bg-white/5 transition-all">
          <X size={13}/>
        </button>

        {/* ── FORM ── */}
        {estado === 'form' && (
          <>
            {/* Barra de progreso */}
            <div className="relative px-8 pt-7 pb-4 flex-shrink-0">
              {/* Símbolo central */}
              <p className="text-center text-white/10 text-base tracking-[1em] mb-5 select-none">✦ ◈ ☽</p>

              {/* Puntos de progreso */}
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

            {/* Zona de contenido animada */}
            <div className="flex-1 overflow-y-auto flex flex-col justify-center py-4">
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

            {/* Footer */}
            <div className="flex-shrink-0 px-8 pb-7 pt-2">
              {error && (
                <p className="text-red-400/60 text-xs text-center mb-3 px-3 py-2 rounded-lg"
                  style={{background:'rgba(220,38,38,.06)',border:'1px solid rgba(220,38,38,.1)'}}>
                  {error}
                </p>
              )}
              <div className={`flex items-center ${paso > 0 ? 'justify-between' : 'justify-end'}`}>
                {paso > 0 && (
                  <button onClick={() => irA(paso - 1)}
                    className="text-white/20 hover:text-white/40 text-xs transition-colors px-2 py-1">
                    ← Volver
                  </button>
                )}
                <button
                  onClick={siguiente}
                  className="flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-semibold transition-all hover:opacity-85"
                  style={{
                    background: 'linear-gradient(135deg,rgba(109,40,217,.6),rgba(139,92,246,.4))',
                    border: '1px solid rgba(139,92,246,.2)',
                    boxShadow: '0 0 28px rgba(109,40,217,.18)',
                    color: 'rgba(255,255,255,.8)',
                  }}>
                  {paso === TOTAL_PASOS - 1
                    ? <><Sparkles size={13} className="text-violet-300"/>Abrir mis Registros</>
                    : <>Continuar <ArrowRight size={13}/></>
                  }
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── ANALIZANDO ── */}
        {estado === 'analyzing' && <Analizando/>}

        {/* ── PREVIEW ── */}
        {estado === 'preview' && (
          <div className="relative px-8 sm:px-10 pt-9 pb-8 fu">
            <div className="text-center mb-8">
              <p className="text-white/10 text-xs tracking-[.7em] mb-4 select-none">✦ ◈ ✦</p>
              <h2 className="font-playfair text-white/85 text-2xl font-bold mb-2">Tu Registro está listo</h2>
              <p className="text-white/20 text-sm">
                Hola, <span className="text-violet-300/50 font-medium">{form.nombre}</span>
              </p>
            </div>

            {/* Teaser */}
            <div className="rounded-2xl p-5 mb-5"
              style={{background:'linear-gradient(135deg,rgba(109,40,217,.1),rgba(79,46,220,.04))',border:'1px solid rgba(139,92,246,.14)'}}>
              <p className="text-[10px] text-violet-400/40 uppercase tracking-widest mb-3">Vista previa gratuita</p>
              <p className="text-white/60 text-sm leading-relaxed italic">"{teaser}"</p>
            </div>

            {/* Lectura bloqueada */}
            <div className="rounded-2xl p-5 mb-5 text-center relative overflow-hidden"
              style={{background:'rgba(255,255,255,.01)',border:'1px dashed rgba(255,255,255,.05)'}}>
              <p className="text-white/[0.07] text-xs leading-loose blur-[3px] select-none pointer-events-none">
                Misión de vida · Bloqueos kármicos · Respuesta específica · Mensaje de tus Guardianes · Propósito del alma · Patrones de karma
              </p>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
                <span className="text-white/15 text-2xl">◈</span>
                <p className="text-white/20 text-[11px] tracking-wide">Contenido bloqueado</p>
              </div>
            </div>

            {/* Incluye */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-6 px-1">
              {[
                'Misión y propósito de tu alma',
                'Bloqueos kármicos activos',
                `Respuesta: ${form.intenciones[0] || ''}${form.intenciones.length > 1 ? '…' : ''}`,
                'Mensaje de tus Guardianes',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-white/30">
                  <span className="text-violet-400/35 mt-0.5 flex-shrink-0">✦</span>{item}
                </div>
              ))}
            </div>

            <button onClick={handlePagar} disabled={loadingPago}
              className="w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-85 disabled:opacity-40"
              style={{background:'linear-gradient(135deg,rgba(109,40,217,.65),rgba(139,92,246,.45))',border:'1px solid rgba(139,92,246,.18)',boxShadow:'0 0 40px rgba(109,40,217,.18)',color:'rgba(255,255,255,.8)'}}>
              {loadingPago
                ? <span className="w-4 h-4 border-2 border-white/20 border-t-white/50 rounded-full animate-spin"/>
                : <><Sparkles size={14} className="text-violet-300/70"/>Desbloquear lectura completa</>
              }
            </button>
            <p className="text-white/12 text-[10px] text-center mt-3">Pago seguro · Enviada a {form.email}</p>
          </div>
        )}
      </div>
    </div>
  )
}
