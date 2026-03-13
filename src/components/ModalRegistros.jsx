import { useState, useEffect, useRef } from 'react'
import { X, Check, ChevronDown, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'

// ── Datos ─────────────────────────────────────────────────────────────────────
const INTENCIONES = [
  { label: 'Amor y relaciones',   icon: '♡' },
  { label: 'Propósito de vida',   icon: '✦' },
  { label: 'Bloqueos espirituales', icon: '◈' },
  { label: 'Dinero y abundancia', icon: '☽' },
  { label: 'Llamas gemelas',      icon: '⟡' },
  { label: 'Trabajo y carrera',   icon: '✴' },
  { label: 'Karma y vidas pasadas', icon: '∞' },
  { label: 'Salud y energía',     icon: '✧' },
  { label: 'Familia y vínculos',  icon: '⋆' },
  { label: 'Misión del alma',     icon: '◎' },
]

const PASOS = [
  {
    num: 1,
    simbolo: '☽',
    titulo: 'Cuéntanos sobre ti',
    subtitulo: 'Los Registros te conocen por tu nombre y el momento en que llegaste a este mundo.',
  },
  {
    num: 2,
    simbolo: '✦',
    titulo: 'Tu origen en el mapa',
    subtitulo: 'El lugar donde naciste y tu correo son el portal por donde recibirás tu mensaje.',
  },
  {
    num: 3,
    simbolo: '◈',
    titulo: '¿Qué deseas revelar?',
    subtitulo: 'Elegí las áreas que tu alma desea iluminar. Podés seleccionar todas las que sientas.',
  },
]

const FRASES_LOADING = [
  'Abriendo el campo akáshico…',
  'Consultando los Registros del alma…',
  'Los Guardianes preparan tu lectura…',
  'Accediendo a tus vidas pasadas…',
  'Canalizando el mensaje de tu alma…',
]

// Partículas de fondo
const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  left: `${((i * 137.5) % 100).toFixed(1)}%`,
  top:  `${((i * 97.3) % 100).toFixed(1)}%`,
  size: (((i * 7 + 3) % 10) / 10 + 0.4).toFixed(1),
  dur:  `${(((i * 3 + 2) % 28) / 10 + 3).toFixed(1)}s`,
  delay:`${(((i * 5) % 60) / 10).toFixed(1)}s`,
}))

const INPUT_BASE = 'w-full bg-white/[0.04] border border-white/10 focus:border-violet-400/40 rounded-xl px-4 py-3.5 text-white placeholder-white/20 outline-none transition-all text-sm'

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
        @keyframes orbita  { to{transform:rotate(360deg)} }
        @keyframes orbitaR { to{transform:rotate(-360deg)} }
        @keyframes pulso   { 0%,100%{opacity:.2;transform:scale(.9)} 50%{opacity:.7;transform:scale(1.1)} }
        @keyframes aparece { 0%{opacity:0;transform:translateY(8px)} 15%,80%{opacity:1;transform:translateY(0)} 100%{opacity:0} }
        .r1{animation:orbita  4s linear infinite}
        .r2{animation:orbitaR 2.8s linear infinite}
        .r3{animation:orbita  7s linear infinite}
        .orbe{animation:pulso 2.5s ease-in-out infinite}
        .msg{animation:aparece 2.4s ease forwards}
      `}</style>
      <div className="relative w-32 h-32 mb-10">
        <div className="absolute inset-0 rounded-full" style={{background:'radial-gradient(circle,rgba(139,92,246,.12),transparent 70%)'}}/>
        <div className="r1 absolute inset-0 rounded-full" style={{border:'1px solid rgba(139,92,246,.15)'}}/>
        <div className="r2 absolute inset-3 rounded-full" style={{border:'1px dashed rgba(167,139,250,.18)'}}/>
        <div className="r3 absolute inset-6 rounded-full" style={{border:'1px dotted rgba(139,92,246,.12)'}}/>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="orbe text-4xl select-none" style={{color:'rgba(196,181,253,.55)'}}>✦</span>
        </div>
        {[0,1,2,3].map(i=>(
          <div key={i} className="r1 absolute inset-0" style={{animationDelay:`${i*.75}s`}}>
            <div className="absolute w-1 h-1 rounded-full bg-violet-400/50" style={{top:0,left:'50%',transform:'translateX(-50%)'}}/>
          </div>
        ))}
      </div>
      <p className="font-playfair text-white/80 text-xl font-semibold mb-2 tracking-wide">Consultando los Registros</p>
      <p key={frase} className="msg text-violet-300/50 text-sm mb-8 h-5">{FRASES_LOADING[frase]}</p>
      <div className="w-full max-w-xs">
        <div className="h-px rounded-full overflow-hidden" style={{background:'rgba(255,255,255,.06)'}}>
          <div className="h-full rounded-full transition-all duration-300"
            style={{width:`${prog}%`,background:'linear-gradient(90deg,rgba(109,40,217,.6),rgba(167,139,250,.8))'}}/>
        </div>
        <p className="text-white/15 text-xs mt-2 text-right tabular-nums">{prog}%</p>
      </div>
    </div>
  )
}

// ── Modal principal ───────────────────────────────────────────────────────────
export default function ModalRegistros({ onClose }) {
  const [estado, setEstado]       = useState('form')   // form | analyzing | preview
  const [paso, setPaso]           = useState(0)        // 0,1,2
  const [dir, setDir]             = useState(1)        // 1=avanza -1=retrocede
  const [animKey, setAnimKey]     = useState(0)
  const [form, setForm]           = useState({ nombre:'', fechaNacimiento:'', lugar:'', intenciones:[], email:'' })
  const [teaser, setTeaser]       = useState('')
  const [consultaId, setConsultaId] = useState(null)
  const [loadingPago, setLoadingPago] = useState(false)
  const [error, setError]         = useState('')

  useEffect(() => {
    const fn = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  const set = (k, v) => setForm(f => ({...f, [k]: v}))

  const irA = (n) => {
    setDir(n > paso ? 1 : -1)
    setAnimKey(k => k+1)
    setPaso(n)
    setError('')
  }

  const validarPaso = () => {
    if (paso === 0) {
      if (!form.nombre.trim()) { setError('Ingresá tu nombre completo.'); return false }
      if (!form.fechaNacimiento) { setError('Ingresá tu fecha de nacimiento.'); return false }
    }
    if (paso === 1) {
      if (!form.email.trim()) { setError('Ingresá tu email.'); return false }
    }
    if (paso === 2) {
      if (form.intenciones.length === 0) { setError('Seleccioná al menos una intención.'); return false }
    }
    return true
  }

  const siguiente = () => {
    if (!validarPaso()) return
    if (paso < 2) { irA(paso + 1) } else { handleSubmit() }
  }

  const handleSubmit = async () => {
    setEstado('analyzing')
    setError('')
    try {
      const { data: consulta, error: dbErr } = await supabase
        .from('consultas_akasicas')
        .insert({
          nombre: form.nombre, fecha_nacimiento: form.fechaNacimiento,
          lugar_nacimiento: form.lugar || null, intenciones: form.intenciones,
          email: form.email, estado: 'pendiente',
        })
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
      style={{background:'rgba(2,1,14,.88)', backdropFilter:'blur(14px)'}}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <style>{`
        @keyframes tw{0%,100%{opacity:.1}50%{opacity:.4}}
        @keyframes stepIn {
          from{opacity:0;transform:translateX(${32}px)}
          to{opacity:1;transform:translateX(0)}
        }
        @keyframes stepInL {
          from{opacity:0;transform:translateX(-32px)}
          to{opacity:1;transform:translateX(0)}
        }
        .step-enter-r{animation:stepIn .35s cubic-bezier(.25,.46,.45,.94) forwards}
        .step-enter-l{animation:stepInL .35s cubic-bezier(.25,.46,.45,.94) forwards}
      `}</style>

      <div className="relative w-full sm:max-w-xl max-h-[96vh] sm:max-h-[90vh] overflow-hidden rounded-t-3xl sm:rounded-2xl"
        style={{background:'#06041a', boxShadow:'0 -4px 80px rgba(109,40,217,.18), 0 0 0 1px rgba(139,92,246,.1)'}}>

        {/* Partículas de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {PARTICLES.map(p=>(
            <div key={p.id} className="absolute rounded-full bg-white"
              style={{left:p.left,top:p.top,width:`${p.size}px`,height:`${p.size}px`,animation:`tw ${p.dur} ${p.delay} ease-in-out infinite`}}/>
          ))}
        </div>
        {/* Glow top */}
        <div className="absolute top-0 inset-x-0 h-48 pointer-events-none"
          style={{background:'radial-gradient(ellipse 90% 100% at 50% -5%,rgba(109,40,217,.1),transparent 70%)'}}/>
        <div className="absolute top-0 inset-x-10 h-px pointer-events-none"
          style={{background:'linear-gradient(90deg,transparent,rgba(139,92,246,.3),transparent)'}}/>

        {/* Cerrar */}
        <button onClick={onClose}
          className="absolute top-4 right-4 z-20 w-7 h-7 rounded-full flex items-center justify-center text-white/20 hover:text-white/50 hover:bg-white/5 transition-all">
          <X size={14}/>
        </button>

        {/* ─── FORM ─── */}
        {estado === 'form' && (
          <div className="flex flex-col" style={{minHeight:'520px'}}>

            {/* Barra de progreso + pasos */}
            <div className="relative px-8 pt-7 pb-5 flex-shrink-0">
              {/* Pasos con línea */}
              <div className="flex items-center justify-center gap-0 mb-6">
                {PASOS.map((p, i) => (
                  <div key={i} className="flex items-center">
                    <button
                      onClick={() => i < paso && irA(i)}
                      className={`relative w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300 ${
                        i === paso ? 'text-white' : i < paso ? 'text-violet-300/60 cursor-pointer' : 'text-white/15 cursor-default'
                      }`}
                      style={i === paso ? {background:'rgba(109,40,217,.35)',border:'1px solid rgba(139,92,246,.35)',boxShadow:'0 0 16px rgba(109,40,217,.3)'} : {background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.07)'}}
                    >
                      {i < paso ? <Check size={12}/> : <span className="text-base leading-none">{p.simbolo}</span>}
                    </button>
                    {i < 2 && (
                      <div className="w-12 sm:w-20 h-px mx-1 transition-all duration-500"
                        style={{background: i < paso ? 'rgba(139,92,246,.4)' : 'rgba(255,255,255,.06)'}}/>
                    )}
                  </div>
                ))}
              </div>

              {/* Título del paso */}
              <div key={`title-${paso}`} className={dir > 0 ? 'step-enter-r' : 'step-enter-l'}>
                <p className="text-white/15 text-[10px] tracking-[.5em] text-center uppercase mb-1.5">
                  paso {paso + 1} de 3
                </p>
                <h2 className="font-playfair text-white text-xl sm:text-2xl font-bold text-center mb-1.5">
                  {PASOS[paso].titulo}
                </h2>
                <p className="text-white/30 text-xs text-center leading-relaxed max-w-sm mx-auto">
                  {PASOS[paso].subtitulo}
                </p>
              </div>
            </div>

            {/* Separador */}
            <div className="flex items-center gap-3 px-8 mb-5 flex-shrink-0">
              <div className="flex-1 h-px" style={{background:'linear-gradient(90deg,transparent,rgba(255,255,255,.05))'}}/>
              <span className="text-white/10 text-xs">{PASOS[paso].simbolo}</span>
              <div className="flex-1 h-px" style={{background:'linear-gradient(90deg,rgba(255,255,255,.05),transparent)'}}/>
            </div>

            {/* Campos — zona scrolleable */}
            <div className="flex-1 overflow-y-auto px-8 pb-2">
              <div key={`fields-${animKey}`} className={dir > 0 ? 'step-enter-r' : 'step-enter-l'}>

                {/* PASO 1: Nombre + Fecha */}
                {paso === 0 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/30 text-[10px] uppercase tracking-widest mb-2">Tu nombre completo</label>
                      <input
                        autoFocus
                        value={form.nombre}
                        onChange={e => set('nombre', e.target.value)}
                        onKeyDown={e => e.key==='Enter' && siguiente()}
                        placeholder="¿Cómo te llamas?"
                        className={INPUT_BASE}
                      />
                    </div>
                    <div>
                      <label className="block text-white/30 text-[10px] uppercase tracking-widest mb-2">Fecha en que llegaste al mundo</label>
                      <input
                        type="date"
                        value={form.fechaNacimiento}
                        onChange={e => set('fechaNacimiento', e.target.value)}
                        className={INPUT_BASE + ' [color-scheme:dark]'}
                      />
                    </div>
                  </div>
                )}

                {/* PASO 2: Lugar + Email */}
                {paso === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/30 text-[10px] uppercase tracking-widest mb-2">Ciudad o país donde naciste</label>
                      <input
                        autoFocus
                        value={form.lugar}
                        onChange={e => set('lugar', e.target.value)}
                        onKeyDown={e => e.key==='Enter' && siguiente()}
                        placeholder="Ej: Buenos Aires, Argentina"
                        className={INPUT_BASE}
                      />
                      <p className="text-white/15 text-[11px] mt-1.5">Opcional, pero ayuda a precisar la lectura</p>
                    </div>
                    <div>
                      <label className="block text-white/30 text-[10px] uppercase tracking-widest mb-2">Tu email sagrado</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => set('email', e.target.value)}
                        onKeyDown={e => e.key==='Enter' && siguiente()}
                        placeholder="aquí recibirás tu lectura completa"
                        className={INPUT_BASE}
                      />
                    </div>
                  </div>
                )}

                {/* PASO 3: Intenciones */}
                {paso === 2 && (
                  <div>
                    <p className="text-white/20 text-xs mb-4">Tocá las que resuenan con tu alma en este momento</p>
                    <div className="grid grid-cols-2 gap-2">
                      {INTENCIONES.map(({ label, icon }) => {
                        const sel = form.intenciones.includes(label)
                        return (
                          <button
                            key={label}
                            type="button"
                            onClick={() => {
                              const next = sel
                                ? form.intenciones.filter(v => v !== label)
                                : [...form.intenciones, label]
                              set('intenciones', next)
                            }}
                            className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-left text-sm transition-all duration-200 ${
                              sel
                                ? 'text-violet-200'
                                : 'text-white/35 hover:text-white/55'
                            }`}
                            style={sel
                              ? {background:'rgba(109,40,217,.2)',border:'1px solid rgba(139,92,246,.3)',boxShadow:'0 0 12px rgba(109,40,217,.15)'}
                              : {background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.07)'}
                            }
                          >
                            <span className={`text-base flex-shrink-0 transition-all ${sel ? 'opacity-80' : 'opacity-25'}`}>{icon}</span>
                            <span className="text-xs leading-snug">{label}</span>
                            {sel && <Check size={10} className="text-violet-400 ml-auto flex-shrink-0"/>}
                          </button>
                        )
                      })}
                    </div>
                    {form.intenciones.length > 0 && (
                      <p className="text-violet-400/40 text-xs text-center mt-3">
                        {form.intenciones.length} {form.intenciones.length === 1 ? 'intención elegida' : 'intenciones elegidas'}
                      </p>
                    )}
                  </div>
                )}

              </div>
            </div>

            {/* Footer: error + botones */}
            <div className="flex-shrink-0 px-8 pt-4 pb-7">
              {error && (
                <p className="text-red-400/70 text-xs text-center mb-3 px-3 py-2 rounded-lg"
                  style={{background:'rgba(220,38,38,.07)',border:'1px solid rgba(220,38,38,.12)'}}>
                  {error}
                </p>
              )}

              <div className={`flex gap-3 ${paso > 0 ? 'justify-between' : 'justify-end'}`}>
                {paso > 0 && (
                  <button
                    onClick={() => irA(paso - 1)}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-white/30 hover:text-white/50 text-sm transition-all"
                    style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.06)'}}>
                    <ArrowLeft size={13}/> Volver
                  </button>
                )}

                <button
                  onClick={siguiente}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-white/85 text-sm font-semibold transition-all hover:opacity-90 ml-auto"
                  style={{background:'linear-gradient(135deg,rgba(109,40,217,.65),rgba(139,92,246,.45))',border:'1px solid rgba(139,92,246,.2)',boxShadow:'0 0 24px rgba(109,40,217,.2)'}}>
                  {paso < 2 ? (
                    <>{paso === 0 ? 'Continuar' : 'Continuar'} <ArrowRight size={13}/></>
                  ) : (
                    <><Sparkles size={13} className="text-violet-300"/> Abrir mis Registros</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── ANALIZANDO ─── */}
        {estado === 'analyzing' && <Analizando/>}

        {/* ─── PREVIEW ─── */}
        {estado === 'preview' && (
          <div className="relative px-7 sm:px-10 pt-8 pb-8">
            <div className="text-center mb-7">
              <p className="text-white/15 text-xs tracking-[.6em] mb-4">✦ ◈ ✦</p>
              <h2 className="font-playfair text-white text-2xl font-bold mb-1.5">Tu Registro está listo</h2>
              <p className="text-white/25 text-sm">Hola, <span className="text-violet-300/60">{form.nombre}</span></p>
            </div>

            {/* Teaser */}
            <div className="rounded-xl p-5 mb-5"
              style={{background:'linear-gradient(135deg,rgba(109,40,217,.1),rgba(79,46,220,.05))',border:'1px solid rgba(139,92,246,.15)'}}>
              <p className="text-[10px] text-violet-400/50 uppercase tracking-widest mb-3">✦ Vista previa gratuita</p>
              <p className="text-white/65 text-sm leading-relaxed italic">"{teaser}"</p>
            </div>

            {/* Bloqueado */}
            <div className="rounded-xl p-5 mb-5 text-center overflow-hidden relative"
              style={{background:'rgba(255,255,255,.015)',border:'1px dashed rgba(255,255,255,.06)'}}>
              <p className="text-white/8 text-xs blur-sm select-none leading-loose pointer-events-none">
                Misión de vida · Bloqueos kármicos · Mensaje de tus Guardianes · Propósito del alma · Respuesta a tu intención
              </p>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                <span className="text-white/20 text-lg">◈</span>
                <p className="text-white/20 text-[11px]">Desbloqueá tu lectura completa</p>
              </div>
            </div>

            {/* Incluye */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6">
              {[
                'Origen del alma y misión de vida',
                'Patrones kármicos activos',
                `Respuesta a: ${form.intenciones[0] || ''}${form.intenciones.length > 1 ? '…' : ''}`,
                'Mensaje de tus Guardianes',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-white/35">
                  <span className="text-violet-400/40 text-[10px] mt-0.5 flex-shrink-0">✦</span>
                  {item}
                </div>
              ))}
            </div>

            <button onClick={handlePagar} disabled={loadingPago}
              className="w-full text-white/85 font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
              style={{background:'linear-gradient(135deg,rgba(109,40,217,.7),rgba(139,92,246,.5))',border:'1px solid rgba(139,92,246,.2)',boxShadow:'0 0 40px rgba(109,40,217,.22)'}}>
              {loadingPago
                ? <span className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"/>
                : <><Sparkles size={14} className="text-violet-300"/> Desbloquear lectura completa</>
              }
            </button>
            <p className="text-white/15 text-[11px] text-center mt-3">Pago seguro · Se enviará a {form.email}</p>
          </div>
        )}
      </div>
    </div>
  )
}
