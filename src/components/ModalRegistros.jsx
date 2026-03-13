import { useState, useEffect, useRef } from 'react'
import { X, Check, ChevronDown, Sparkles, Mail, Lock } from 'lucide-react'
import { supabase } from '../lib/supabase'

// ── Constantes ────────────────────────────────────────────────────────────────
const INTENCIONES = [
  'Amor y relaciones',
  'Propósito de vida',
  'Bloqueos espirituales',
  'Dinero y abundancia',
  'Llamas gemelas',
  'Trabajo y carrera',
  'Karma y vidas pasadas',
  'Salud y energía',
  'Familia y vínculos',
  'Misión del alma',
]

const FRASES_LOADING = [
  'Abriendo el campo akáshico…',
  'Consultando los Registros del alma…',
  'Los Guardianes preparan tu lectura…',
  'Accediendo a tus vidas pasadas…',
  'Canalizando el mensaje de tu alma…',
]

// Estrellas de fondo del modal
const STARS = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: `${((i * 137.5) % 100).toFixed(1)}%`,
  top:  `${((i * 97.3) % 100).toFixed(1)}%`,
  size: (((i * 7 + 3) % 12) / 10 + 0.5).toFixed(1),
  dur:  `${(((i * 3 + 2) % 28) / 10 + 2.5).toFixed(1)}s`,
  delay:`${(((i * 5) % 50) / 10).toFixed(1)}s`,
}))

const INPUT = 'w-full bg-white/[0.04] border border-white/10 focus:border-violet-400/50 focus:bg-white/[0.06] rounded-lg px-4 py-3 text-white placeholder-white/20 outline-none transition-all text-sm tracking-wide'

// ── MultiSelect ───────────────────────────────────────────────────────────────
function MultiSelect({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const toggle = item =>
    onChange(value.includes(item) ? value.filter(v => v !== item) : [...value, item])

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(!open)}
        className={INPUT + ' text-left flex items-center justify-between'}>
        <span className={value.length ? 'text-white/80' : 'text-white/20'}>
          {value.length === 0
            ? 'Seleccioná una o más intenciones'
            : value.length === 1 ? value[0]
            : `${value[0]} +${value.length - 1} más`}
        </span>
        <ChevronDown size={13} className={`text-white/30 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-lg overflow-hidden"
          style={{ background:'#0a0720', border:'1px solid rgba(139,92,246,.2)', boxShadow:'0 20px 50px rgba(0,0,0,.7)' }}>
          {INTENCIONES.map(item => (
            <button key={item} type="button" onClick={() => toggle(item)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors
                ${value.includes(item) ? 'bg-violet-900/20' : 'hover:bg-white/[0.03]'}`}>
              <div className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center flex-shrink-0 transition-all
                ${value.includes(item) ? 'bg-violet-600' : 'border border-white/15'}`}>
                {value.includes(item) && <Check size={9} className="text-white" />}
              </div>
              <span className={value.includes(item) ? 'text-violet-200' : 'text-white/40'}>{item}</span>
            </button>
          ))}
        </div>
      )}

      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {value.map(v => (
            <span key={v} onClick={() => toggle(v)}
              className="cursor-pointer inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full text-violet-300/80 hover:text-violet-200 transition-colors"
              style={{ background:'rgba(109,40,217,.15)', border:'1px solid rgba(139,92,246,.2)' }}>
              {v} <X size={8} className="ml-0.5" />
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Pantalla de carga ─────────────────────────────────────────────────────────
function Analizando() {
  const [frase, setFrase] = useState(0)
  const [prog, setProg]   = useState(0)

  useEffect(() => {
    const t1 = setInterval(() => setFrase(f => (f + 1) % FRASES_LOADING.length), 2400)
    const t2 = setInterval(() => setProg(p => Math.min(p + 1, 95)), 180)
    return () => { clearInterval(t1); clearInterval(t2) }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <style>{`
        @keyframes orbita  { from{transform:rotate(0deg)}   to{transform:rotate(360deg)} }
        @keyframes orbitaR { from{transform:rotate(0deg)}   to{transform:rotate(-360deg)} }
        @keyframes pulso   { 0%,100%{opacity:.2;transform:scale(.95)} 50%{opacity:.7;transform:scale(1.05)} }
        @keyframes aparece { 0%{opacity:0;transform:translateY(8px)} 15%,85%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(-6px)} }
        .anillo-1 { animation: orbita  4s linear infinite; }
        .anillo-2 { animation: orbitaR 2.5s linear infinite; }
        .anillo-3 { animation: orbita  6s linear infinite; }
        .orbe-centro { animation: pulso 2.5s ease-in-out infinite; }
        .frase-anim { animation: aparece 2.4s ease forwards; }
      `}</style>

      {/* Orbe animado */}
      <div className="relative w-28 h-28 mb-10">
        {/* Glow */}
        <div className="absolute inset-0 rounded-full"
          style={{ background:'radial-gradient(circle,rgba(139,92,246,.15) 0%,transparent 70%)' }} />
        {/* Anillos */}
        <div className="anillo-1 absolute inset-0 rounded-full"
          style={{ border:'1px solid rgba(139,92,246,.15)' }} />
        <div className="anillo-2 absolute inset-3 rounded-full"
          style={{ border:'1px dashed rgba(167,139,250,.2)' }} />
        <div className="anillo-3 absolute inset-6 rounded-full"
          style={{ border:'1px solid rgba(139,92,246,.12)' }} />
        {/* Centro */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="orbe-centro text-4xl select-none" style={{ color:'rgba(196,181,253,.6)' }}>✦</span>
        </div>
        {/* Puntos orbitando */}
        {[0,1,2,3].map(i => (
          <div key={i} className="anillo-1 absolute inset-0"
            style={{ animationDelay:`${i * 0.75}s`, animationDuration:'4s' }}>
            <div className="absolute w-1 h-1 rounded-full bg-violet-400/60"
              style={{ top:0, left:'50%', transform:'translateX(-50%)' }} />
          </div>
        ))}
      </div>

      <p className="font-playfair text-white/90 text-lg font-semibold mb-2 tracking-wide">
        Consultando los Registros
      </p>
      <p key={frase} className="frase-anim text-violet-300/60 text-sm mb-8 h-5">
        {FRASES_LOADING[frase]}
      </p>

      {/* Barra de progreso */}
      <div className="w-full max-w-xs">
        <div className="h-px rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,.06)' }}>
          <div className="h-full rounded-full transition-all duration-300"
            style={{ width:`${prog}%`, background:'linear-gradient(90deg,rgba(109,40,217,.6),rgba(167,139,250,.8))' }} />
        </div>
        <p className="text-white/20 text-xs mt-2 text-right tabular-nums">{prog}%</p>
      </div>
    </div>
  )
}

// ── Modal principal ───────────────────────────────────────────────────────────
export default function ModalRegistros({ onClose }) {
  const [estado, setEstado] = useState('form')
  const [form, setForm] = useState({ nombre: '', fechaNacimiento: '', lugar: '', intenciones: [], email: '' })
  const [teaser, setTeaser] = useState('')
  const [consultaId, setConsultaId] = useState(null)
  const [loadingPago, setLoadingPago] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fn = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (form.intenciones.length === 0) { setError('Seleccioná al menos una intención.'); return }
    setError('')
    setEstado('analyzing')
    try {
      const { data: consulta, error: dbErr } = await supabase
        .from('consultas_akasicas')
        .insert({ nombre: form.nombre, fecha_nacimiento: form.fechaNacimiento, lugar_nacimiento: form.lugar || null, intenciones: form.intenciones, email: form.email, estado: 'pendiente' })
        .select('id').single()
      if (dbErr) console.error('DB error:', dbErr)
      const id = consulta?.id
      setConsultaId(id)
      const pregunta = form.intenciones.join(', ')
      const { data, error: fnErr } = await supabase.functions.invoke('akasicos', {
        body: { nombre: form.nombre, fechaNacimiento: form.fechaNacimiento, lugar: form.lugar, pregunta },
      })
      if (fnErr || data?.error) throw new Error(data?.error || fnErr?.message || 'Error al consultar los registros.')
      if (id) {
        await supabase.from('consultas_akasicas').update({ lectura_teaser: data.teaser, lectura_completa: data.completa, estado: 'preview' }).eq('id', id)
      }
      setTeaser(data.teaser)
      setEstado('preview')
    } catch (err) {
      setError(err.message || 'Ocurrió un error. Intentá de nuevo.')
      setEstado('form')
    }
  }

  const handlePagar = async () => {
    setLoadingPago(true)
    try {
      const { data, error: fnErr } = await supabase.functions.invoke('create-checkout', {
        body: { consultaId, email: form.email, nombre: form.nombre },
      })
      if (fnErr || data?.error) throw new Error(data?.error || fnErr?.message || 'Error al crear el pago.')
      if (data?.url) window.location.href = data.url
    } catch (err) {
      alert(err.message)
      setLoadingPago(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background:'rgba(2,1,15,.85)', backdropFilter:'blur(12px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full sm:max-w-md max-h-[96vh] sm:max-h-[88vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl"
        style={{ background:'#07051c', boxShadow:'0 -4px 80px rgba(109,40,217,.2), 0 0 0 1px rgba(139,92,246,.12)' }}
      >
        {/* Estrellas de fondo */}
        <div className="absolute inset-0 overflow-hidden rounded-t-3xl sm:rounded-2xl pointer-events-none">
          <style>{`@keyframes tw{0%,100%{opacity:.15}50%{opacity:.55}}`}</style>
          {STARS.map(s => (
            <div key={s.id} className="absolute rounded-full bg-white"
              style={{ left:s.left, top:s.top, width:`${s.size}px`, height:`${s.size}px`, animation:`tw ${s.dur} ${s.delay} ease-in-out infinite` }} />
          ))}
        </div>

        {/* Glow superior */}
        <div className="absolute top-0 inset-x-0 h-40 pointer-events-none rounded-t-3xl sm:rounded-t-2xl"
          style={{ background:'radial-gradient(ellipse 80% 100% at 50% -10%,rgba(109,40,217,.12),transparent 70%)' }} />
        {/* Línea superior */}
        <div className="absolute top-0 inset-x-8 h-px pointer-events-none"
          style={{ background:'linear-gradient(90deg,transparent,rgba(139,92,246,.35),transparent)' }} />

        {/* Botón cerrar */}
        <button onClick={onClose}
          className="absolute top-4 right-4 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all text-white/30 hover:text-white/70 hover:bg-white/5">
          <X size={14} />
        </button>

        {/* ─── FORMULARIO ─── */}
        {estado === 'form' && (
          <div className="relative px-6 sm:px-8 pt-8 pb-7">
            {/* Header */}
            <div className="text-center mb-8">
              <p className="text-white/15 text-xs tracking-[.6em] uppercase mb-4">✦ ◈ ✦</p>
              <h2 className="font-playfair text-white text-2xl font-bold leading-snug mb-2">
                Registro Akáshico
              </h2>
              <p className="text-white/30 text-xs tracking-wide leading-relaxed max-w-xs mx-auto">
                Los Registros responden a tu verdad interior.<br />Completá con sinceridad.
              </p>
            </div>

            {/* Separador */}
            <div className="flex items-center gap-3 mb-7">
              <div className="flex-1 h-px" style={{ background:'linear-gradient(90deg,transparent,rgba(255,255,255,.06))' }} />
              <span className="text-white/15 text-xs tracking-widest">✦</span>
              <div className="flex-1 h-px" style={{ background:'linear-gradient(90deg,rgba(255,255,255,.06),transparent)' }} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-white/40 text-[11px] font-medium mb-2 uppercase tracking-widest">Nombre completo</label>
                <input required value={form.nombre} onChange={e => set('nombre', e.target.value)}
                  placeholder="Tu nombre y apellido" className={INPUT} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/40 text-[11px] font-medium mb-2 uppercase tracking-widest">Fecha de nacimiento</label>
                  <input required type="date" value={form.fechaNacimiento}
                    onChange={e => set('fechaNacimiento', e.target.value)}
                    className={INPUT + ' [color-scheme:dark]'} />
                </div>
                <div>
                  <label className="block text-white/40 text-[11px] font-medium mb-2 uppercase tracking-widest">Ciudad / País</label>
                  <input value={form.lugar} onChange={e => set('lugar', e.target.value)}
                    placeholder="Buenos Aires" className={INPUT} />
                </div>
              </div>

              <div>
                <label className="block text-white/40 text-[11px] font-medium mb-2 uppercase tracking-widest">
                  Intención <span className="normal-case tracking-normal text-white/20">(podés elegir varias)</span>
                </label>
                <MultiSelect value={form.intenciones} onChange={v => set('intenciones', v)} />
              </div>

              <div>
                <label className="block text-white/40 text-[11px] font-medium mb-2 uppercase tracking-widest">Email</label>
                <input required type="email" value={form.email} onChange={e => set('email', e.target.value)}
                  placeholder="tu@email.com" className={INPUT} />
                <p className="text-white/20 text-[11px] mt-1.5">Aquí recibirás tu lectura completa</p>
              </div>

              {error && (
                <p className="text-red-400/80 text-xs px-4 py-3 rounded-lg"
                  style={{ background:'rgba(220,38,38,.08)', border:'1px solid rgba(220,38,38,.15)' }}>
                  {error}
                </p>
              )}

              <div className="pt-1">
                <button type="submit"
                  className="w-full text-white/90 text-sm font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90"
                  style={{ background:'linear-gradient(135deg,rgba(109,40,217,.7),rgba(139,92,246,.5))', border:'1px solid rgba(139,92,246,.25)', boxShadow:'0 0 30px rgba(109,40,217,.2)' }}>
                  <Sparkles size={14} className="text-violet-300" />
                  Consultar mis Registros Akáshicos
                </button>
                <p className="text-white/15 text-[11px] text-center mt-3 tracking-wide">
                  Vista previa gratuita · Lectura completa tras el pago
                </p>
              </div>
            </form>
          </div>
        )}

        {/* ─── ANALIZANDO ─── */}
        {estado === 'analyzing' && <Analizando />}

        {/* ─── PREVIEW ─── */}
        {estado === 'preview' && (
          <div className="relative px-6 sm:px-8 pt-8 pb-7">
            {/* Header */}
            <div className="text-center mb-7">
              <p className="text-white/15 text-xs tracking-[.6em] mb-4">✦ ◈ ✦</p>
              <h2 className="font-playfair text-white text-2xl font-bold mb-1">
                Tu Registro está listo
              </h2>
              <p className="text-white/30 text-sm">Hola, <span className="text-violet-300/70">{form.nombre}</span></p>
            </div>

            {/* Teaser */}
            <div className="rounded-xl p-5 mb-5"
              style={{ background:'linear-gradient(135deg,rgba(109,40,217,.1),rgba(79,46,220,.06))', border:'1px solid rgba(139,92,246,.18)' }}>
              <p className="text-[11px] text-violet-400/60 uppercase tracking-widest mb-3">✦ Vista previa</p>
              <p className="text-white/70 text-sm leading-relaxed italic">"{teaser}"</p>
            </div>

            {/* Bloqueado */}
            <div className="rounded-xl p-5 mb-5 text-center"
              style={{ background:'rgba(255,255,255,.015)', border:'1px dashed rgba(255,255,255,.06)' }}>
              <Lock size={14} className="text-white/15 mx-auto mb-3" />
              <p className="text-white/10 text-xs blur-sm select-none leading-relaxed">
                Tu misión de vida · Bloqueos kármicos · Mensaje de tus Guardianes · Respuesta a tu intención
              </p>
              <p className="text-white/25 text-[11px] mt-3">La lectura completa está lista. Desbloqueala ahora.</p>
            </div>

            {/* Incluye */}
            <div className="space-y-2 mb-6">
              {[
                'Origen del alma y misión de vida',
                'Patrones kármicos y bloqueos actuales',
                `Respuesta a: ${form.intenciones.slice(0,2).join(', ')}${form.intenciones.length > 2 ? '…' : ''}`,
                'Mensaje de tus Guardianes Akáshicos',
                `Enviada a ${form.email}`,
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-white/40">
                  <span className="text-violet-400/50 text-[10px]">✦</span>
                  {item}
                </div>
              ))}
            </div>

            {/* CTA */}
            <button onClick={handlePagar} disabled={loadingPago}
              className="w-full text-white/90 font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background:'linear-gradient(135deg,rgba(109,40,217,.75),rgba(139,92,246,.55))', border:'1px solid rgba(139,92,246,.25)', boxShadow:'0 0 40px rgba(109,40,217,.25)' }}>
              {loadingPago
                ? <span className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                : <><Sparkles size={14} className="text-violet-300" /> Desbloquear lectura completa</>
              }
            </button>

            <p className="text-white/15 text-[11px] text-center mt-3 tracking-wide">
              Pago seguro · Se enviará a {form.email}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
