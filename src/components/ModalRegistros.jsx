import { useState, useEffect, useRef } from 'react'
import { X, Sparkles, ChevronDown, Check, Mail } from 'lucide-react'
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

const INPUT = 'w-full bg-white/4 border border-white/10 focus:border-purple-500/60 focus:bg-white/6 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition-all text-sm'

// ── Multi-select de intenciones ───────────────────────────────────────────────
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
        <span className={value.length ? 'text-white' : 'text-gray-500'}>
          {value.length === 0
            ? 'Seleccioná una o más intenciones'
            : value.length === 1
              ? value[0]
              : `${value[0]} +${value.length - 1} más`
          }
        </span>
        <ChevronDown size={14} className={`text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 rounded-xl overflow-hidden"
          style={{ background:'#0d0b2b', border:'1px solid rgba(139,92,246,.35)', boxShadow:'0 16px 40px rgba(0,0,0,.6)' }}>
          {INTENCIONES.map(item => (
            <button key={item} type="button" onClick={() => toggle(item)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors hover:bg-white/5">
              <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all ${
                value.includes(item)
                  ? 'bg-purple-600 border-purple-500'
                  : 'border border-white/20'
              }`} style={{ border: value.includes(item) ? 'none' : undefined }}>
                {value.includes(item) && <Check size={10} className="text-white" />}
              </div>
              <span className={value.includes(item) ? 'text-white' : 'text-gray-400'}>{item}</span>
            </button>
          ))}
        </div>
      )}

      {/* Tags seleccionados */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {value.map(v => (
            <span key={v} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full text-purple-300"
              style={{ background:'rgba(109,40,217,.2)', border:'1px solid rgba(139,92,246,.3)' }}>
              {v}
              <button type="button" onClick={() => toggle(v)} className="hover:text-white ml-0.5">
                <X size={9} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Animación "Analizando" ────────────────────────────────────────────────────
function Analizando() {
  const FRASES = [
    'Abriendo el campo akáshico...',
    'Consultando los Registros del alma...',
    'Los Guardianes están preparando tu lectura...',
    'Accediendo a tus vidas pasadas...',
    'Canalizando el mensaje de tu alma...',
  ]
  const [frase, setFrase] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setFrase(f => (f + 1) % FRASES.length), 2200)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="text-center py-10 px-4">
      <style>{`
        @keyframes ringRot  { from{transform:rotate(0deg)}   to{transform:rotate(360deg)} }
        @keyframes ringRotR { from{transform:rotate(360deg)} to{transform:rotate(0deg)} }
        @keyframes orbGlow  { 0%,100%{opacity:.3} 50%{opacity:.8} }
        @keyframes fadeMsg  { 0%{opacity:0;transform:translateY(6px)} 20%,80%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(-6px)} }
        .spin-ring  { animation: ringRot  3s linear infinite; }
        .spin-ringr { animation: ringRotR 2s linear infinite; }
        .orb-glow   { animation: orbGlow 2s ease-in-out infinite; }
      `}</style>

      <div className="relative w-24 h-24 mx-auto mb-8">
        <div className="spin-ring  absolute inset-0 rounded-full"
          style={{ border:'2px solid rgba(139,92,246,.2)' }} />
        <div className="spin-ringr absolute inset-2 rounded-full"
          style={{ border:'2px dashed rgba(167,139,250,.3)' }} />
        <div className="spin-ring  absolute inset-4 rounded-full"
          style={{ border:'1px dotted rgba(139,92,246,.2)' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl text-purple-300 orb-glow select-none">✦</span>
        </div>
      </div>

      <h3 className="font-playfair text-white text-xl font-bold mb-3">Analizando tu registro</h3>

      <p key={frase} className="text-purple-300/80 text-sm"
        style={{ animation:'fadeMsg 2.2s ease forwards' }}>
        {FRASES[frase]}
      </p>

      <div className="flex justify-center gap-1.5 mt-5">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-purple-500 orb-glow"
            style={{ animationDelay:`${i * 0.4}s` }} />
        ))}
      </div>
    </div>
  )
}

// ── Modal principal ───────────────────────────────────────────────────────────
export default function ModalRegistros({ onClose }) {
  const [estado, setEstado] = useState('form')  // form | analyzing | preview
  const [form, setForm] = useState({
    nombre: '', fechaNacimiento: '', lugar: '', intenciones: [], email: ''
  })
  const [teaser, setTeaser] = useState('')
  const [consultaId, setConsultaId] = useState(null)
  const [loadingPago, setLoadingPago] = useState(false)
  const [error, setError] = useState('')

  // Cerrar con Escape
  useEffect(() => {
    const fn = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (form.intenciones.length === 0) {
      setError('Seleccioná al menos una intención.')
      return
    }
    setError('')
    setEstado('analyzing')

    try {
      // 1. Guardar consulta en Supabase
      const { data: consulta, error: dbErr } = await supabase
        .from('consultas_akasicas')
        .insert({
          nombre:           form.nombre,
          fecha_nacimiento: form.fechaNacimiento,
          lugar_nacimiento: form.lugar || null,
          intenciones:      form.intenciones,
          email:            form.email,
          estado:           'pendiente',
        })
        .select('id')
        .single()

      if (dbErr) console.error('DB error:', dbErr)
      const id = consulta?.id
      setConsultaId(id)

      // 2. Llamar a la Edge Function de Supabase
      const pregunta = form.intenciones.join(', ')
      const { data, error: fnErr } = await supabase.functions.invoke('akasicos', {
        body: {
          nombre:          form.nombre,
          fechaNacimiento: form.fechaNacimiento,
          lugar:           form.lugar,
          pregunta,
        },
      })
      if (fnErr || data?.error) throw new Error(data?.error || fnErr?.message || 'Error al consultar los registros.')

      // 3. Actualizar consulta con el resultado
      if (id) {
        await supabase
          .from('consultas_akasicas')
          .update({
            lectura_teaser:   data.teaser,
            lectura_completa: data.completa,
            estado:           'preview',
          })
          .eq('id', id)
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
      if (data?.url) {
        window.location.href = data.url
      }
    } catch (err) {
      alert(err.message)
      setLoadingPago(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:'rgba(0,0,0,.75)', backdropFilter:'blur(8px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>

      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{ background:'#06041a', border:'1px solid rgba(139,92,246,.35)', boxShadow:'0 0 60px rgba(109,40,217,.3)' }}>

        {/* Cerrar */}
        <button onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
          <X size={16} />
        </button>

        {/* Top glow */}
        <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none rounded-t-2xl"
          style={{ background:'radial-gradient(ellipse 70% 100% at 50% 0%,rgba(109,40,217,.12) 0%,transparent 70%)' }} />
        <div className="absolute top-0 left-6 right-6 h-px"
          style={{ background:'linear-gradient(90deg,transparent,rgba(139,92,246,.6),transparent)' }} />

        {/* ─── ESTADO: FORMULARIO ─── */}
        {estado === 'form' && (
          <div className="relative p-6 sm:p-8">
            <div className="text-center mb-7">
              <div className="text-purple-400/50 text-lg mb-3 tracking-[.5em]">✦ ☽ ✦</div>
              <h2 className="font-playfair text-2xl font-bold text-white mb-1">
                Abrí tu Registro Akáshico
              </h2>
              <p className="text-gray-500 text-sm">Completá con sinceridad. Los Registros responden a tu verdad.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-xs font-semibold mb-1.5">Nombre completo *</label>
                <input required value={form.nombre} onChange={e => set('nombre', e.target.value)}
                  placeholder="Tu nombre y apellido" className={INPUT} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 text-xs font-semibold mb-1.5">Fecha de nacimiento *</label>
                  <input required type="date" value={form.fechaNacimiento}
                    onChange={e => set('fechaNacimiento', e.target.value)}
                    className={INPUT + ' [color-scheme:dark]'} />
                </div>
                <div>
                  <label className="block text-gray-300 text-xs font-semibold mb-1.5">Ciudad / País</label>
                  <input value={form.lugar} onChange={e => set('lugar', e.target.value)}
                    placeholder="Ej: Buenos Aires" className={INPUT} />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-xs font-semibold mb-1.5">
                  Intención de consulta * <span className="text-gray-500 font-normal">(podés elegir varias)</span>
                </label>
                <MultiSelect value={form.intenciones} onChange={v => set('intenciones', v)} />
              </div>

              <div>
                <label className="block text-gray-300 text-xs font-semibold mb-1.5">
                  <Mail size={11} className="inline mr-1.5 text-purple-400" />
                  Email *
                  <span className="text-gray-500 font-normal ml-1">— aquí recibirás tu lectura completa</span>
                </label>
                <input required type="email" value={form.email} onChange={e => set('email', e.target.value)}
                  placeholder="tu@email.com" className={INPUT} />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button type="submit"
                className="w-full text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all"
                style={{ background:'linear-gradient(135deg,#6d28d9,#9333ea)', boxShadow:'0 0 20px rgba(139,92,246,.35)' }}>
                <Sparkles size={16} /> Consultar mis Registros Akáshicos
              </button>

              <p className="text-gray-600 text-xs text-center">
                Vista previa gratuita · Lectura completa disponible tras el pago
              </p>
            </form>
          </div>
        )}

        {/* ─── ESTADO: ANALIZANDO ─── */}
        {estado === 'analyzing' && <Analizando />}

        {/* ─── ESTADO: PREVIEW / TEASER ─── */}
        {estado === 'preview' && (
          <div className="relative p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="text-purple-400/50 text-lg mb-3 tracking-[.5em]">✦ ☽ ✦</div>
              <h2 className="font-playfair text-xl font-bold text-white mb-1">
                Tu Registro Akáshico está listo
              </h2>
              <p className="text-gray-500 text-sm">Hola <span className="text-purple-300">{form.nombre}</span></p>
            </div>

            {/* Teaser */}
            <div className="rounded-xl p-5 mb-6"
              style={{ background:'linear-gradient(135deg,rgba(109,40,217,.15),rgba(139,92,246,.07))', border:'1px solid rgba(139,92,246,.3)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-yellow-400 text-xs font-semibold uppercase tracking-wider">✦ Vista previa gratuita</span>
              </div>
              <p className="text-gray-200 text-sm leading-relaxed italic">"{teaser}"</p>
            </div>

            {/* Locked section */}
            <div className="rounded-xl p-5 mb-5 text-center"
              style={{ background:'rgba(255,255,255,.02)', border:'1px dashed rgba(139,92,246,.25)' }}>
              <div className="text-3xl mb-3 select-none" style={{ filter:'blur(4px)', userSelect:'none' }}>
                Tu misión de vida · Bloqueos kármicos · Respuesta a tu intención · Mensaje de tus Guardianes
              </div>
              <p className="text-gray-500 text-xs">La lectura completa está lista. Desbloqueala ahora.</p>
            </div>

            {/* Lo que incluye */}
            <div className="space-y-1.5 mb-5">
              {[
                'Origen del alma y misión de vida completa',
                'Patrones kármicos y bloqueos actuales',
                `Respuesta específica: ${form.intenciones.slice(0,2).join(', ')}${form.intenciones.length > 2 ? '...' : ''}`,
                'Mensaje especial de tus Guardianes Akáshicos',
                'Enviada a tu email: ' + form.email,
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-purple-400 text-xs flex-shrink-0">✦</span> {item}
                </div>
              ))}
            </div>

            <button onClick={handlePagar} disabled={loadingPago}
              className="w-full text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2.5 transition-all disabled:opacity-60"
              style={{ background:'linear-gradient(135deg,#6d28d9,#9333ea)', boxShadow:'0 0 25px rgba(139,92,246,.4)' }}>
              {loadingPago ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Sparkles size={17} /> Desbloquear lectura completa</>
              )}
            </button>

            <p className="text-gray-600 text-xs text-center mt-3">
              Pago seguro · La lectura completa se enviará a {form.email}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
