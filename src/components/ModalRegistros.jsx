import { useState, useEffect, useRef, useMemo } from 'react'
import { X, Sparkles, Send, Check } from 'lucide-react'
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
  { key: 'nombre',          type: 'text',  pregunta: '¿Cómo te llamas?',                                     placeholder: 'Tu nombre completo'                 },
  { key: 'email',           type: 'email', pregunta: '¿Me compartes tu correo? Ahi te envio tu lectura.',   placeholder: 'tu@email.com'                       },
  { key: 'fechaNacimiento', type: 'date',  pregunta: 'Perfecto. ¿Cual es tu fecha de nacimiento?',           placeholder: ''                                   },
  { key: 'lugar',           type: 'text',  pregunta: '¿Y en que ciudad o pais naciste?',                     placeholder: 'Ej: Buenos Aires, Argentina'        },
]

const TAROTISTAS = [
  {
    id: 'luna',
    nombre: 'Esmeralda Llanos',
    especialidad: 'Amor y relaciones',
    icon: '♡',
    color: 'rgba(236,72,153,.65)',
    foto: '/tarotistas/esmeralda.png',
    experiencia: '8 años',
    estilo: 'Empatica y directa',
    descripcion: 'Te ayuda a entender vinculos, bloqueos afectivos y decisiones del corazon.',
    tags: ['Amor', 'Relaciones', 'Reconciliacion'],
  },
  {
    id: 'gale',
    nombre: 'Maestro Joao',
    especialidad: 'Trabajo y proposito',
    icon: '✴',
    color: 'rgba(16,185,129,.65)',
    foto: '/tarotistas/maestro.png',
    experiencia: '11 años',
    estilo: 'Practico y claro',
    descripcion: 'Enfocado en decisiones laborales, cambios de rumbo y activacion de proposito.',
    tags: ['Trabajo', 'Proposito', 'Carrera'],
  },
  {
    id: 'aurora',
    nombre: 'Marta de la Cruz',
    especialidad: 'Dinero y abundancia',
    icon: '☽',
    color: 'rgba(234,179,8,.65)',
    foto: '/tarotistas/marta.png',
    experiencia: '7 años',
    estilo: 'Motivadora y estrategica',
    descripcion: 'Te guia para desbloquear creencias, ordenar energia y abrir caminos de prosperidad.',
    tags: ['Dinero', 'Abundancia', 'Prosperidad'],
  },
]

function tarotistaFromSnapshot(s) {
  if (!s?.id) return null
  const full = TAROTISTAS.find(t => t.id === s.id)
  if (full) return full
  return {
    id: s.id,
    nombre: s.nombre ?? 'Tu tarotista',
    especialidad: s.especialidad ?? 'General',
    icon: '✦',
    color: 'rgba(139,92,246,.65)',
    foto: '/tarotistas/esmeralda.png',
    experiencia: '',
    estilo: '',
    descripcion: '',
    tags: [],
  }
}

const FRASES_LOADING = [
  'Estoy conectando con tus Registros...',
  'Dame unos segundos, ya casi termino...',
  'Organizando el mensaje para que sea claro para vos...',
  'Ultimos detalles de tu lectura...',
]

function horaCorta(date = new Date()) {
  return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
}

/** Fondo en capas: base casi nocturna + bruma al color del tarotista + profundidad mística. */
function tarotistaCardBackground(accentRgba) {
  const halo = accentRgba.replace('.65)', '.16)')
  const niebla = accentRgba.replace('.65)', '.09)')
  const borde = accentRgba.replace('.65)', '.11)')
  return `
    radial-gradient(ellipse 125% 95% at 50% -8%, ${halo}, transparent 50%),
    radial-gradient(ellipse 95% 75% at 94% 90%, ${niebla}, transparent 58%),
    radial-gradient(ellipse 85% 65% at 6% 88%, ${borde}, transparent 56%),
    radial-gradient(circle at 45% 35%, rgba(88,28,135,.12), transparent 64%),
    radial-gradient(ellipse 110% 85% at 50% 115%, rgba(0,0,0,.55), transparent 55%),
    linear-gradient(168deg, rgba(3,1,9,.995) 0%, rgba(12,6,34,.98) 44%, rgba(2,1,8,1) 100%)
  `
}

function buildPreguntaEnvio(formActual) {
  return `Tarotista elegida: ${formActual.tarotista?.nombre ?? 'Sin definir'} (${formActual.tarotista?.especialidad ?? 'General'}). Intenciones: ${(formActual.intenciones ?? []).join(', ')}`
}

function snapshotFormulario(formActual) {
  return {
    nombre: formActual.nombre ?? '',
    email: formActual.email ?? '',
    fechaNacimiento: formActual.fechaNacimiento ?? '',
    lugar: formActual.lugar ?? '',
    intenciones: formActual.intenciones ?? [],
    tarotista: formActual.tarotista
      ? {
          id: formActual.tarotista.id,
          nombre: formActual.tarotista.nombre,
          especialidad: formActual.tarotista.especialidad,
        }
      : null,
  }
}

/** Fila alineada con la tabla consultas_akasicas (guardado parcial y final). */
function filaConsultaDb(formActual) {
  const t = formActual.tarotista
  return {
    nombre: formActual.nombre,
    fecha_nacimiento: formActual.fechaNacimiento || null,
    lugar_nacimiento: formActual.lugar || null,
    email: formActual.email || null,
    intenciones: formActual.intenciones ?? [],
    tarotista_id: t?.id ?? null,
    tarotista_nombre: t?.nombre ?? null,
    tarotista_especialidad: t?.especialidad ?? null,
    snapshot_formulario: snapshotFormulario(formActual),
  }
}

function TarotistaCardsGrid({ selectedId, onSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:px-1">
      {TAROTISTAS.map(t => {
        const selected = selectedId === t.id
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelect(t)}
            className="relative overflow-hidden rounded-[18px] px-2.5 py-2.5 sm:px-3 sm:py-3 text-left text-xs transition-all min-h-[220px] sm:min-h-[300px] flex flex-col"
            style={{
              background: tarotistaCardBackground(t.color),
              border: `1px solid ${selected ? t.color.replace('.65', '.5') : 'rgba(255,255,255,.07)'}`,
              boxShadow: selected
                ? `0 0 0 1px ${t.color.replace('.65', '.22')}, 0 18px 48px rgba(0,0,0,.5), 0 0 52px ${t.color.replace('.65', '.15')}, inset 0 1px 0 rgba(255,255,255,.06)`
                : '0 12px 32px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.04)',
              color: selected ? 'rgba(255,255,255,.95)' : 'rgba(255,255,255,.72)',
            }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-40 mix-blend-soft-light"
              style={{
                background: `
                  repeating-linear-gradient(38deg, rgba(255,255,255,.025) 0 1px, transparent 1px 10px),
                  repeating-linear-gradient(128deg, rgba(139,92,246,.035) 0 1px, transparent 1px 12px)
                `,
              }}
            />
            <div
              className="pointer-events-none absolute inset-0 z-[1] rounded-[18px]"
              style={{
                background: 'radial-gradient(ellipse 85% 78% at 50% 42%, transparent 22%, rgba(0,0,0,.58) 100%)',
              }}
            />
            <div
              className="pointer-events-none absolute inset-0 z-[1] opacity-[0.4]"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 18% 22%, rgba(255,255,255,.35) 0, transparent 2px),
                  radial-gradient(circle at 82% 16%, rgba(255,255,255,.25) 0, transparent 2px),
                  radial-gradient(circle at 74% 76%, rgba(255,255,255,.3) 0, transparent 2px),
                  radial-gradient(circle at 26% 80%, rgba(255,255,255,.22) 0, transparent 2px),
                  radial-gradient(circle at 50% 10%, rgba(255,255,255,.2) 0, transparent 1.5px)
                `,
              }}
            />

            <div className="relative z-10 flex items-center gap-1.5 mb-2 text-white/85">
              <div className="h-px flex-1 bg-white/45" />
              <span className="text-[10px] tracking-[.2em]">◇◇◇</span>
              <div className="h-px flex-1 bg-white/45" />
            </div>

            {selected && (
              <div
                className="absolute top-2 right-2 z-20 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: t.color.replace('.65', '.45'), border: `1px solid ${t.color.replace('.65', '.85')}` }}
              >
                <Check size={12} className="text-white" />
              </div>
            )}

            <div className="relative z-10 flex items-center justify-center">
              <img
                src={t.foto}
                alt={t.nombre}
                className="w-[72px] h-[72px] rounded-full object-cover"
                style={{
                  border: `2px solid ${selected ? t.color.replace('.65', '.8') : 'rgba(255,255,255,.25)'}`,
                  boxShadow: selected ? `0 0 30px ${t.color.replace('.65', '.35')}` : '0 8px 20px rgba(0,0,0,.35)',
                }}
              />
            </div>

            <div className="relative z-10 text-center mt-2 px-0.5">
              <p className="font-playfair text-xl sm:text-2xl md:text-[28px] leading-tight text-white mb-1 tracking-wide break-words hyphens-auto">{t.nombre}</p>
              <p className="text-[10px] text-white/95 leading-relaxed px-0.5 line-clamp-3">{t.descripcion}</p>
              <p className="text-[9px] text-white/92 leading-relaxed mt-1">Especialista en {t.especialidad.toLowerCase()}.</p>
              <p className="text-[10px] text-white font-semibold mt-1">{t.experiencia}</p>
              <p className="text-[9px] text-white/80 mt-0.5">{t.estilo}</p>
            </div>

            <div className="relative z-10 mt-auto pt-2">
              <div className="flex items-center justify-center gap-1 mb-2 flex-wrap">
                {(t.tags || []).map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[9px] font-medium"
                    style={{
                      border: '1px solid rgba(255,255,255,.72)',
                      color: 'rgba(255,255,255,.96)',
                      background: 'rgba(255,255,255,.03)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 text-white/85">
                <div className="h-px flex-1 bg-white/45" />
                <span className="text-[10px] tracking-[.2em]">◇◇◇</span>
                <div className="h-px flex-1 bg-white/45" />
              </div>
            </div>

            <div
              className="pointer-events-none absolute inset-0 rounded-[22px]"
              style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.08)' }}
            />
          </button>
        )
      })}
    </div>
  )
}

function BubbleBot({ children, className = '', time = horaCorta(), showAvatar = true }) {
  return (
    <div className={`flex items-end gap-2 max-w-[92%] ${className}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 transition-opacity ${showAvatar ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: 'rgba(109,40,217,.35)', border: '1px solid rgba(167,139,250,.4)' }}>
        ✦
      </div>
      <div className="rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed text-white/90 min-w-0 max-w-full"
        style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.08)' }}>
        {children}
        <div className="text-[10px] text-white/40 mt-2">{time}</div>
      </div>
    </div>
  )
}

function BubbleUser({ children, time = horaCorta() }) {
  return (
    <div className="max-w-[min(88%,100%)] ml-auto min-w-0 rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed text-white">
      <div style={{ background: 'linear-gradient(135deg,rgba(109,40,217,.9),rgba(139,92,246,.78))', border: '1px solid rgba(167,139,250,.45)' }}
        className="rounded-2xl rounded-tr-sm px-4 py-3 break-words">
        {children}
        <div className="text-[10px] text-white/65 mt-2 flex items-center justify-end gap-1">
          <span>{time}</span>
          <Check size={10} />
        </div>
      </div>
    </div>
  )
}

function TypingBubble({ time }) {
  return (
    <BubbleBot time={time}>
      <div className="flex items-center gap-1.5 py-1">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-violet-200/75 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </BubbleBot>
  )
}

function formatValue(paso, form) {
  if (paso === 0) return form.nombre || '—'
  if (paso === 1) return form.email || '—'
  if (paso === 2) {
    if (!form.fechaNacimiento) return '—'
    try {
      return new Date(`${form.fechaNacimiento}T00:00:00`).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    } catch {
      return form.fechaNacimiento
    }
  }
  if (paso === 3) return form.lugar || 'No indicado'
  return (form.intenciones ?? []).join(', ')
}

function AnalizandoChat() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % FRASES_LOADING.length), 1700)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-4 py-4 space-y-3 overscroll-contain">
      <BubbleBot>
        Estoy consultando tus Registros. Esto puede tomar unos segundos...
      </BubbleBot>
      <BubbleBot className="animate-pulse text-violet-200/85">
        {FRASES_LOADING[idx]}
      </BubbleBot>
      <div className="flex items-center gap-1.5 pl-2">
        {[0, 1, 2].map(i => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-violet-300/55 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  )
}

// ── Modal principal ───────────────────────────────────────────────────────────
export default function ModalRegistros({ onClose, resumeConsultaId = null, resumeCheckout = false }) {
  const [estado, setEstado]         = useState('form')
  const [paso, setPaso]             = useState(0)       // 0-3 = 4 preguntas, 4 = intenciones
  const [form, setForm]             = useState({ nombre:'', fechaNacimiento:'', lugar:'', intenciones:[], email:'', tarotista: null })
  const [tarotistaConfirmada, setTarotistaConfirmada] = useState(false)
  const [pendingResumeStep, setPendingResumeStep] = useState(null) // número de paso al retomar tras elegir tarotista
  const [teaser, setTeaser]         = useState('')
  const [consultaId, setConsultaId] = useState(null)
  const [loadingPago, setLoadingPago] = useState(false)
  const [error, setError]           = useState('')
  const [botEscribiendo, setBotEscribiendo] = useState(true)
  const bodyRef = useRef(null)
  const autoCheckoutStarted = useRef(false)
  const startedAt = useMemo(() => horaCorta(), [])

  useEffect(() => {
    const fn = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  useEffect(() => {
    if (!resumeConsultaId) return

    let cancelled = false
    ;(async () => {
      setError('')
      try {
        const { data, error: fnErr } = await supabase.functions.invoke('resume-consulta', {
          body: { consultaId: resumeConsultaId },
        })
        if (cancelled) return
        if (fnErr || data?.error) {
          setError(typeof data?.error === 'string' ? data.error : fnErr?.message || 'No se pudo recuperar tu consulta.')
          return
        }
        const c = data?.consulta
        if (!c) {
          setError('Consulta no encontrada.')
          return
        }

        const snap = c.snapshot_formulario || {}
        const tObj = tarotistaFromSnapshot(
          snap.tarotista ||
            (c.tarotista_id
              ? { id: c.tarotista_id, nombre: c.tarotista_nombre, especialidad: c.tarotista_especialidad }
              : null)
        )

        setForm({
          nombre: c.nombre || snap.nombre || '',
          email: c.email || snap.email || '',
          fechaNacimiento: c.fecha_nacimiento || snap.fechaNacimiento || '',
          lugar: c.lugar_nacimiento || snap.lugar || '',
          intenciones: Array.isArray(c.intenciones) ? c.intenciones : (snap.intenciones || []),
          tarotista: tObj,
        })
        setConsultaId(c.id)

        const tienePreview = c.estado === 'preview' && String(c.lectura_teaser || '').trim() !== ''
        if (tienePreview) {
          setTeaser(c.lectura_teaser)
          setEstado('preview')
          setTarotistaConfirmada(true)
          setPaso(4)
          setPendingResumeStep(null)
          return
        }

        const wp = typeof c.wizard_paso === 'number' ? c.wizard_paso : 0
        setPendingResumeStep(Math.min(Math.max(wp, 0), 4))
        setTarotistaConfirmada(false)
        setEstado('form')
      } catch (e) {
        if (!cancelled) setError(e.message || 'Error al cargar tu consulta.')
      }
    })()

    return () => { cancelled = true }
  }, [resumeConsultaId])

  const set = (k, v) => setForm(f => ({...f, [k]: v}))

  const irA = (n) => {
    setPaso(n)
    setError('')
  }

  const TOTAL_PASOS = 5  // 4 inputs + 1 intenciones

  const validar = () => {
    if (!tarotistaConfirmada || !form.tarotista) { setError('Elegi primero con que tarotista queres hablar.'); return false }
    if (paso === 0 && !form.nombre.trim())        { setError('Necesito tu nombre para seguir 🙂'); return false }
    if (paso === 1 && !form.email.trim())         { setError('Dejame tu correo para enviarte la lectura completa.'); return false }
    if (paso === 1 && !/\S+@\S+\.\S+/.test(form.email)) { setError('Ese correo parece tener un error. ¿Lo revisamos?'); return false }
    if (paso === 2 && !form.fechaNacimiento)      { setError('Contame tu fecha de nacimiento para continuar.'); return false }
    if (paso === 4 && form.intenciones.length===0){ setError('Elegi al menos un tema para enfocar tu lectura.'); return false }
    return true
  }

  // Guarda o actualiza la consulta en Supabase con los datos disponibles hasta el paso actual
  const guardarParcial = async (formActual, idActual, wizardPaso) => {
    try {
      const row = { ...filaConsultaDb(formActual), wizard_paso: wizardPaso }
      if (!idActual) {
        const { data, error: dbErr } = await supabase
          .from('consultas_akasicas')
          .insert({
            ...row,
            estado: 'incompleto',
          })
          .select('id').single()
        if (dbErr) { console.error('DB insert:', dbErr); return null }
        return data?.id ?? null
      }
      const { error: dbErr } = await supabase
        .from('consultas_akasicas')
        .update(row)
        .eq('id', idActual)
      if (dbErr) console.error('DB update:', dbErr)
      return idActual
    } catch (e) {
      console.error('guardarParcial error:', e)
      return idActual
    }
  }

  const siguiente = async () => {
    if (!validar()) return
    const nextWizardPaso = paso < TOTAL_PASOS - 1 ? paso + 1 : paso
    const nuevoId = await guardarParcial(form, consultaId, nextWizardPaso)
    const idActivo = nuevoId || consultaId
    if (nuevoId && nuevoId !== consultaId) setConsultaId(nuevoId)

    if (paso < TOTAL_PASOS - 1) { irA(paso + 1) }
    else { handleSubmit(idActivo) }
  }

  const handleSubmit = async (idParam) => {
    setEstado('analyzing')
    setError('')
    const id = idParam || consultaId
    const pregunta = buildPreguntaEnvio(form)
    try {
      if (id) {
        await supabase
          .from('consultas_akasicas')
          .update({
            ...filaConsultaDb(form),
            pregunta_enviada: pregunta,
            estado: 'pendiente',
            wizard_paso: 4,
          })
          .eq('id', id)
      }

      const { data, error: fnErr } = await supabase.functions.invoke('akasicos', {
        body: {
          nombre:          form.nombre,
          fechaNacimiento: form.fechaNacimiento,
          lugar:           form.lugar,
          pregunta,
        },
      })

      // La función siempre devuelve 200; los errores vienen en data.error
      const errorMsg = data?.error || fnErr?.message
      if (errorMsg) throw new Error(errorMsg)

      if (!data?.teaser) throw new Error('La lectura llegó incompleta. Intentá de nuevo.')

      if (id) {
        await supabase.from('consultas_akasicas')
          .update({
            lectura_teaser: data.teaser,
            lectura_completa: data.completa,
            estado: 'preview',
            wizard_paso: 4,
            ...filaConsultaDb(form),
            pregunta_enviada: pregunta,
          })
          .eq('id', id)
      }
      if (id) setConsultaId(id)
      setTeaser(data.teaser)
      setEstado('preview')
    } catch (e) {
      console.error('[ModalRegistros] handleSubmit error:', e)
      setError(e.message || 'No pude abrir los Registros esta vez. Probemos de nuevo en un momento.')
      setEstado('form')
      setPaso(4) // volver al paso de intenciones, no al inicio
    }
  }

  useEffect(() => {
    if (!bodyRef.current) return
    bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [paso, form, error, estado, teaser])

  useEffect(() => {
    if (estado !== 'form') return
    setBotEscribiendo(true)
    const t = setTimeout(() => setBotEscribiendo(false), 520)
    return () => clearTimeout(t)
  }, [paso, estado, tarotistaConfirmada])

  useEffect(() => {
    if (!resumeCheckout || estado !== 'preview' || !consultaId || autoCheckoutStarted.current) return
    autoCheckoutStarted.current = true
    ;(async () => {
      setLoadingPago(true)
      try {
        const { data, error: fnErr } = await supabase.functions.invoke('create-checkout', {
          body: { consultaId, email: form.email, nombre: form.nombre },
        })
        if (fnErr || data?.error) throw new Error(data?.error || fnErr?.message)
        if (data?.url) window.location.href = data.url
      } catch (err) {
        alert(err.message)
        autoCheckoutStarted.current = false
      } finally {
        setLoadingPago(false)
      }
    })()
  }, [resumeCheckout, estado, consultaId, form.email, form.nombre])

  const currentQuestion = paso < 4 ? PREGUNTAS[paso] : null
  const pasosCompletados = useMemo(() => Array.from({ length: paso }, (_, i) => i), [paso])

  const enviarRespuestaActual = () => siguiente()

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
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-3 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-[max(0.5rem,env(safe-area-inset-top,0px))] overflow-x-hidden overflow-y-auto"
      style={{ background: 'rgba(2,1,14,.92)', backdropFilter: 'blur(20px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <style>{`
        .chat-scroll::-webkit-scrollbar { width: 0 }
        .chat-scroll { -ms-overflow-style: none; scrollbar-width: none }
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(8px) scale(.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .msg-in { animation: msgIn .28s ease both; }
      `}</style>

      {estado === 'form' && !tarotistaConfirmada ? (
        <div
          className="relative w-full max-w-[min(100%,72rem)] flex flex-col min-h-0 rounded-2xl overflow-hidden my-auto sm:my-0"
          style={{
            background: '#05030f',
            boxShadow: '0 0 80px rgba(109,40,217,.2), 0 0 0 1px rgba(139,92,246,.1)',
            maxHeight: 'min(90svh, 90vh)',
          }}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex shrink-0 items-center justify-between px-3 sm:px-4 py-3 border-b border-white/10 bg-[#090517]">
            <p className="text-white text-sm font-semibold pr-2">Elegí tu tarotista</p>
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] shrink-0 rounded-full flex items-center justify-center text-white/35 hover:text-white/75 hover:bg-white/5 transition-all -mr-1"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto chat-scroll px-3 sm:px-4 py-4 sm:py-5 space-y-4 overscroll-contain">
            <p className="text-white/90 text-sm text-center leading-relaxed px-1">
              Antes de empezar, ¿con cual tarotista queres hablar?
            </p>
            <TarotistaCardsGrid
              selectedId={form.tarotista?.id}
              onSelect={t => { set('tarotista', t); setError('') }}
            />
            {form.tarotista && (
              <div className="pt-1">
                <BubbleUser>
                  Quiero hablar con {form.tarotista.nombre} ({form.tarotista.especialidad})
                </BubbleUser>
              </div>
            )}
            {error && (
              <div
                className="max-w-[90%] rounded-xl px-3 py-2 text-xs text-red-200"
                style={{ background: 'rgba(220,38,38,.15)', border: '1px solid rgba(220,38,38,.35)' }}
              >
                {error}
              </div>
            )}
          </div>
          <div className="border-t border-white/10 p-3 bg-[#090517] shrink-0">
            <button
              type="button"
              onClick={() => {
                if (!form.tarotista) {
                  setError('Elegi una tarotista para empezar el chat.')
                  return
                }
                setTarotistaConfirmada(true)
                setPaso(pendingResumeStep == null ? 0 : pendingResumeStep)
                setPendingResumeStep(null)
              }}
              className="w-full h-11 px-5 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all"
              style={{ background: 'linear-gradient(135deg,rgba(109,40,217,.9),rgba(139,92,246,.8))', color: 'white' }}
            >
              Continuar con {form.tarotista?.nombre ?? 'tu tarotista'}
            </button>
          </div>
        </div>
      ) : (
      <div
        className="relative w-full max-w-2xl flex flex-col min-h-0 rounded-2xl overflow-hidden my-auto sm:my-0"
        style={{
          background: '#05030f',
          boxShadow: '0 0 80px rgba(109,40,217,.2), 0 0 0 1px rgba(139,92,246,.1)',
          maxHeight: 'min(90svh, 90vh)',
        }}
      >
        <div className="flex shrink-0 items-center justify-between px-3 sm:px-4 py-3 border-b border-white/10 bg-[#090517]">
          <div className="min-w-0 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
              style={{ background: 'rgba(109,40,217,.35)', border: '1px solid rgba(167,139,250,.4)' }}>
              ✦
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">Consulta de Registros Akashicos</p>
              <p className="text-violet-300/65 text-xs">En linea</p>
            </div>
          </div>
          <button type="button" onClick={onClose}
            className="min-h-[44px] min-w-[44px] shrink-0 rounded-full flex items-center justify-center text-white/35 hover:text-white/75 hover:bg-white/5 transition-all -mr-1"
            aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        {estado === 'form' && (
          <>
            <div ref={bodyRef} className="flex-1 min-h-0 overflow-y-auto chat-scroll px-3 sm:px-4 py-4 space-y-3 overscroll-contain">
              <BubbleBot className="msg-in" time={startedAt}>
                Hola ✨ Soy {form.tarotista?.nombre ?? 'tu tarotista'}, tu guia en esta consulta. Te voy a hacer unas preguntas cortitas para preparar tu lectura.
              </BubbleBot>

              {pasosCompletados.map(i => (
                <div key={i} className="space-y-2">
                  <BubbleBot className="msg-in" time={startedAt}>{PREGUNTAS[i].pregunta}</BubbleBot>
                  <BubbleUser>{formatValue(i, form)}</BubbleUser>
                </div>
              ))}

              {paso < 4 ? (
                <>
                  {botEscribiendo && <TypingBubble time={horaCorta()} />}
                  {!botEscribiendo && (
                    <BubbleBot className="msg-in" time={horaCorta()}>
                      {PREGUNTAS[paso].pregunta}
                    </BubbleBot>
                  )}
                </>
              ) : (
                <>
                  {botEscribiendo && <TypingBubble time={horaCorta()} />}
                  {!botEscribiendo && (
                    <BubbleBot className="msg-in" time={horaCorta()}>
                      Para enfocarme mejor, decime en que temas queres que profundice.
                    </BubbleBot>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {INTENCIONES.map(({ label, icon, color }) => {
                      const selected = form.intenciones.includes(label)
                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() => set('intenciones', selected
                            ? form.intenciones.filter(v => v !== label)
                            : [...form.intenciones, label])}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs transition-all"
                          style={{
                            background: selected ? `linear-gradient(135deg,${color.replace('.6', '.15')},rgba(0,0,0,0))` : 'rgba(255,255,255,.03)',
                            border: `1px solid ${selected ? color.replace('.6', '.35') : 'rgba(255,255,255,.08)'}`,
                            color: selected ? 'rgba(255,255,255,.95)' : 'rgba(255,255,255,.72)',
                          }}
                        >
                          <span className="text-sm">{icon}</span>
                          <span className="flex-1">{label}</span>
                          {selected && <Check size={12} />}
                        </button>
                      )
                    })}
                  </div>
                  {form.intenciones.length > 0 && (
                    <BubbleUser>Quiero consultar sobre: {form.intenciones.join(', ')}</BubbleUser>
                  )}
                </>
              )}

              {error && (
                <div className="max-w-[90%] rounded-xl px-3 py-2 text-xs text-red-200"
                  style={{ background: 'rgba(220,38,38,.15)', border: '1px solid rgba(220,38,38,.35)' }}>
                  {error}
                </div>
              )}
            </div>

            <div className="border-t border-white/10 p-3 bg-[#090517] shrink-0">
              <div className="flex flex-col gap-2 min-w-0">
                <div className="flex flex-wrap gap-2 items-center">
                  {paso > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const np = paso - 1
                        irA(np)
                        if (consultaId) void guardarParcial(form, consultaId, np)
                      }}
                      className="h-11 px-3 rounded-xl text-xs text-white/70 border border-white/15 hover:bg-white/5 transition-colors"
                    >
                      Volver
                    </button>
                  )}
                  {paso === 0 && (
                    <button
                      type="button"
                      onClick={() => setTarotistaConfirmada(false)}
                      className="h-11 px-3 rounded-xl text-xs text-white/70 border border-white/15 hover:bg-white/5 transition-colors"
                    >
                      Cambiar tarotista
                    </button>
                  )}
                </div>

                {paso < 4 ? (
                  <div className="flex flex-col sm:flex-row gap-2 min-w-0 sm:items-stretch">
                    <input
                      type={currentQuestion.type}
                      value={form[currentQuestion.key]}
                      onChange={e => set(currentQuestion.key, e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && enviarRespuestaActual()}
                      placeholder={currentQuestion.placeholder}
                      className="w-full min-w-0 flex-1 h-12 sm:h-11 rounded-xl px-3 text-base sm:text-sm bg-white/5 border border-white/10 focus:border-violet-400/60 outline-none text-white placeholder:text-white/35 [color-scheme:dark]"
                    />
                    <button
                      type="button"
                      onClick={enviarRespuestaActual}
                      className="h-11 w-full sm:w-auto shrink-0 px-4 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all"
                      style={{ background: 'linear-gradient(135deg,rgba(109,40,217,.9),rgba(139,92,246,.8))', color: 'white' }}
                    >
                      Responder <Send size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={siguiente}
                    className="h-11 w-full px-5 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all"
                    style={{ background: 'linear-gradient(135deg,rgba(109,40,217,.9),rgba(139,92,246,.8))', color: 'white' }}
                  >
                    <Sparkles size={14} /> Abrir mis Registros
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {estado === 'analyzing' && (
          <div className="flex-1 min-h-0 flex flex-col">
            <AnalizandoChat />
          </div>
        )}

        {estado === 'preview' && (
          <div className="flex-1 min-h-0 overflow-y-auto chat-scroll px-3 sm:px-4 py-4 space-y-3 overscroll-contain">
            <BubbleBot className="msg-in" time={horaCorta()}>
              Gracias por esperar, {form.nombre.split(' ')[0] || form.nombre}. Soy {form.tarotista?.nombre ?? 'tu tarotista'} y ya tengo la primera parte de tu lectura.
            </BubbleBot>
            <BubbleBot className="msg-in" time={horaCorta()} showAvatar={false}>
              <p className="text-violet-200/90 text-xs uppercase tracking-wider mb-2">Vista previa</p>
              <p className="text-white/85 italic">"{teaser}"</p>
            </BubbleBot>
            <BubbleBot className="msg-in" time={horaCorta()} showAvatar={false}>
              Si queres, ahora podes desbloquear la lectura completa con todo el detalle: mision del alma, patrones karmicos, respuestas y guia final.
            </BubbleBot>
            <div className="max-w-[92%] rounded-2xl p-3"
              style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-white text-sm font-semibold">Desbloqueo completo</p>
                  <p className="text-violet-300/75 text-xs">Unico pago de 6€</p>
                </div>
                <button
                  type="button"
                  onClick={handlePagar}
                  disabled={loadingPago}
                  className="w-full sm:w-auto shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg,#6d28d9,#8b5cf6)', color: 'white' }}
                >
                  {loadingPago ? 'Procesando...' : <><Sparkles size={14} /> Desbloquear</>}
                </button>
              </div>
            </div>
            <p className="text-[11px] text-white/35">Pago seguro con Stripe · {form.email}</p>
          </div>
        )}
      </div>
      )}
    </div>
  )
}
