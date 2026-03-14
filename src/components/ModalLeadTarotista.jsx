import { useState, useEffect, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Sparkles, ChevronRight, Star, Globe, Phone, Mail, MessageSquare } from 'lucide-react'
import { supabase } from '../lib/supabase'

const PAISES = [
  'Argentina', 'México', 'España', 'Colombia', 'Chile', 'Perú', 'Venezuela',
  'Ecuador', 'Bolivia', 'Uruguay', 'Paraguay', 'Cuba', 'Puerto Rico',
  'República Dominicana', 'Guatemala', 'Honduras', 'El Salvador', 'Nicaragua',
  'Costa Rica', 'Panamá', 'Otro',
]

const ESPECIALIDADES = [
  'Tarot General', 'Amor y Relaciones', 'Llamas Gemelas',
  'Trabajo y Dinero', 'Karma y Vidas Pasadas', 'Videncia',
  'Registros Akáshicos', 'Astrología', 'Runas', 'Numerología', 'Otro',
]

const EXPERIENCIAS = [
  'Menos de 1 año', '1 a 3 años', '3 a 5 años', '5 a 10 años', 'Más de 10 años',
]

const INIT = { nombre: '', email: '', whatsapp: '', pais: '', especialidad: '', experiencia: '', mensaje: '' }

const inputCls = (err) =>
  `w-full bg-white/[.04] border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/60 transition-colors ${
    err ? 'border-red-500/50' : 'border-white/10'
  }`

function Field({ id, label, icon: Icon, error: err, children }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-400 mb-1.5" htmlFor={id}>
        {Icon && <Icon size={12} className="text-purple-400" />}
        {label}
      </label>
      {children}
      {err && <p className="text-red-400 text-xs mt-1">{err}</p>}
    </div>
  )
}

const ModalLeadTarotista = memo(function ModalLeadTarotista({ open, onClose }) {
  const navigate   = useNavigate()
  const [form, setForm]       = useState(INIT)
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (open) {
      setForm(INIT)
      setErrors({})
      setError('')
      setLoading(false)
    }
  }, [open])

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const validar = () => {
    const e = {}
    if (!form.nombre.trim())      e.nombre      = 'Requerido'
    if (!form.email.trim())       e.email       = 'Requerido'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido'
    if (!form.especialidad)       e.especialidad = 'Seleccioná una especialidad'
    if (!form.pais)               e.pais        = 'Seleccioná tu país'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!validar()) return
    setLoading(true)
    setError('')

    try {
      const { error: dbErr } = await supabase.from('leads_tarotistas').insert({
        nombre:       form.nombre.trim(),
        email:        form.email.trim().toLowerCase(),
        whatsapp:     form.whatsapp.trim() || null,
        pais:         form.pais,
        especialidad: form.especialidad,
        experiencia:  form.experiencia || null,
        mensaje:      form.mensaje.trim() || null,
        estado:       'nuevo',
      })
      if (dbErr) throw new Error(dbErr.message)

      await fetch('/.netlify/functions/lead-tarotista', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      onClose()
      navigate('/gracias-tarotista')
    } catch (err) {
      console.error(err)
      setError('Hubo un error al enviar. Intentá de nuevo o escribinos a info@cartamistica.com')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{
        background: 'rgba(0,0,0,.75)',
        backdropFilter: 'blur(8px)',
        display: open ? undefined : 'none',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>

      <div className="relative w-full sm:max-w-lg max-h-[96vh] sm:max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl"
        style={{ background: 'linear-gradient(160deg,#0d0b25 0%,#06041a 100%)', border: '1px solid rgba(139,92,246,.2)' }}>

        <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none overflow-hidden rounded-t-3xl sm:rounded-t-2xl">
          <div className="absolute -top-4 left-1/4 w-40 h-40 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle,#7c3aed,transparent 70%)' }} />
          <div className="absolute -top-4 right-1/4 w-32 h-32 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle,#4f46e5,transparent 70%)' }} />
        </div>

        <button onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          style={{ background: 'rgba(255,255,255,.07)' }}>
          <X size={16} />
        </button>

        <div className="relative px-6 sm:px-8 pt-8 pb-8">
          <div className="mb-6 pr-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(124,58,237,.25)', border: '1px solid rgba(139,92,246,.35)' }}>
                <Sparkles size={15} className="text-purple-300" />
              </div>
              <span className="text-purple-400/70 text-xs uppercase tracking-widest font-medium">Para tarotistas</span>
            </div>
            <h2 className="font-playfair text-2xl font-bold text-white mb-1.5">
              Únete a La Carta Mística
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Conectá con cientos de consultantes que buscan una guía espiritual. Sin costos de entrada — solo tu talento.
            </p>

            <div className="flex flex-wrap gap-2 mt-3">
              {['Perfil verificado', 'Clientes nuevos', 'Sin comisiones fijas', '100% online'].map(b => (
                <span key={b} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full text-purple-300/80"
                  style={{ background: 'rgba(109,40,217,.15)', border: '1px solid rgba(139,92,246,.2)' }}>
                  <Star size={9} fill="currentColor" /> {b}
                </span>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field id="nombre" label="Nombre completo" icon={null} error={errors.nombre}>
                <input
                  id="nombre" type="text" placeholder="Tu nombre"
                  value={form.nombre} onChange={e => set('nombre', e.target.value)}
                  className={inputCls(errors.nombre)} />
              </Field>
              <Field id="email" label="Email de contacto" icon={Mail} error={errors.email}>
                <input
                  id="email" type="email" placeholder="tu@email.com"
                  value={form.email} onChange={e => set('email', e.target.value)}
                  className={inputCls(errors.email)} />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field id="whatsapp" label="WhatsApp (opcional)" icon={Phone} error={errors.whatsapp}>
                <input
                  id="whatsapp" type="tel" placeholder="+54 9 11 ..."
                  value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)}
                  className={inputCls(errors.whatsapp)} />
              </Field>
              <Field id="pais" label="País" icon={Globe} error={errors.pais}>
                <select
                  id="pais" value={form.pais} onChange={e => set('pais', e.target.value)}
                  className={`${inputCls(errors.pais)} appearance-none cursor-pointer`}
                  style={{ backgroundImage: 'none' }}>
                  <option value="" disabled className="bg-[#0d0b25]">Seleccioná tu país</option>
                  {PAISES.map(p => <option key={p} value={p} className="bg-[#0d0b25]">{p}</option>)}
                </select>
              </Field>
            </div>

            <Field id="especialidad" label="Especialidad principal" icon={null} error={errors.especialidad}>
              <select
                id="especialidad" value={form.especialidad} onChange={e => set('especialidad', e.target.value)}
                className={`${inputCls(errors.especialidad)} appearance-none cursor-pointer`}
                style={{ backgroundImage: 'none' }}>
                <option value="" disabled className="bg-[#0d0b25]">¿En qué sos especialista?</option>
                {ESPECIALIDADES.map(e => <option key={e} value={e} className="bg-[#0d0b25]">{e}</option>)}
              </select>
            </Field>

            <Field id="experiencia" label="Años de experiencia" icon={null} error={errors.experiencia}>
              <div className="flex flex-wrap gap-2">
                {EXPERIENCIAS.map(ex => (
                  <button key={ex} type="button" onClick={() => set('experiencia', ex)}
                    className={`text-xs px-3 py-1.5 rounded-full transition-all ${
                      form.experiencia === ex
                        ? 'text-white border-purple-500/60 bg-purple-600/25'
                        : 'text-gray-400 hover:text-white border-white/10 hover:border-white/20'
                    }`}
                    style={{ border: '1px solid', borderColor: form.experiencia === ex ? 'rgba(139,92,246,.5)' : undefined }}>
                    {ex}
                  </button>
                ))}
              </div>
            </Field>

            <Field id="mensaje" label="¿Qué te motivó a buscar esta plataforma? (opcional)" icon={MessageSquare} error={errors.mensaje}>
              <textarea
                id="mensaje" rows={3} placeholder="Contanos un poco sobre vos..."
                value={form.mensaje} onChange={e => set('mensaje', e.target.value)}
                className={`${inputCls(errors.mensaje)} resize-none`} />
            </Field>

            {error && (
              <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg,#7c3aed,#6d28d9)',
                boxShadow: '0 0 24px rgba(124,58,237,.35)',
              }}>
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Quiero unirme <ChevronRight size={16} />
                </>
              )}
            </button>

            <p className="text-center text-gray-600 text-xs">
              Al enviar aceptás nuestra{' '}
              <a href="/privacidad" target="_blank" className="text-purple-400/70 hover:text-purple-400 underline underline-offset-2">
                política de privacidad
              </a>. Sin spam.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
})

export default ModalLeadTarotista
