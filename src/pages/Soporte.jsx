import { useState } from 'react'
import { ChevronDown, ChevronUp, Mail, MessageCircle, Clock, CheckCircle, Send, HelpCircle, Shield, CreditCard, User } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const FAQS = [
  {
    categoria: 'Consultas',
    icon: MessageCircle,
    preguntas: [
      {
        q: '¿Cómo funciona una consulta de tarot online?',
        a: 'Las consultas se realizan de forma privada mediante chat de texto o llamada de voz con la tarotista que elijas. Solo necesitás crear una cuenta, seleccionar una tarotista disponible y conectarte. La sesión es completamente confidencial.',
      },
      {
        q: '¿Cuánto dura una sesión de tarot?',
        a: 'La duración varía según la tarotista y el tipo de consulta. Las sesiones de chat suelen ser de 20 a 60 minutos. Las llamadas dependen del paquete elegido. Podés ver la información de cada tarotista en su perfil.',
      },
      {
        q: '¿Puedo hablar del mismo tema en varias consultas?',
        a: 'Sí, podés consultar sobre el mismo tema con la misma tarotista o con diferentes. Sin embargo, recomendamos dejar pasar un tiempo prudente entre consultas para que la energía fluya y las acciones que emprendas puedan manifestarse.',
      },
      {
        q: '¿Qué pasa si la tarotista no está disponible?',
        a: 'Podés ver en tiempo real el estado de cada tarotista: online ahora, disponible hoy o solo por reserva. Si no está disponible, podés reservar una sesión para más adelante o elegir otra tarotista del directorio.',
      },
    ],
  },
  {
    categoria: 'Tarotistas',
    icon: User,
    preguntas: [
      {
        q: '¿Cómo verifican a las tarotistas del directorio?',
        a: 'Cada tarotista pasa por un proceso de revisión antes de aparecer en el directorio. Evaluamos su experiencia, calidad de comunicación y coherencia en sus lecturas. Además, las reseñas reales de los clientes forman parte de su perfil.',
      },
      {
        q: '¿Puedo dejar una reseña sobre una tarotista?',
        a: 'Sí. Después de cada consulta podés dejar tu valoración y comentario. Las reseñas son verificadas para garantizar que solo quienes consultaron puedan opinar, lo que asegura la autenticidad del sistema de puntuación.',
      },
      {
        q: '¿Puedo hablar con la misma tarotista siempre?',
        a: 'Claro que sí. Podés guardar tus tarotistas favoritas y volver a ellas cuando quieras. Muchos de nuestros usuarios mantienen una relación de largo plazo con su tarotista de confianza.',
      },
    ],
  },
  {
    categoria: 'Pagos y precios',
    icon: CreditCard,
    preguntas: [
      {
        q: '¿Cómo se pagan las consultas?',
        a: 'Actualmente las consultas se coordinan directamente con cada tarotista, que indica sus métodos de pago aceptados en su perfil (transferencia bancaria, Mercado Pago, PayPal, etc.).',
      },
      {
        q: '¿Cuánto cuesta una consulta de tarot?',
        a: 'Los precios varían según cada tarotista y el tipo de consulta. En el directorio podés ver el rango de precio de cada una antes de contactarla. Hay opciones para todos los presupuestos.',
      },
      {
        q: '¿Hay garantía de devolución?',
        a: 'Como el servicio es brindado directamente por las tarotistas independientes, La Carta Mística no gestiona pagos directamente. Te recomendamos leer las reseñas y aclarar condiciones con la tarotista antes de la sesión.',
      },
    ],
  },
  {
    categoria: 'Privacidad',
    icon: Shield,
    preguntas: [
      {
        q: '¿Mis consultas son privadas y confidenciales?',
        a: 'Sí, absolutamente. Las sesiones son privadas entre vos y la tarotista. La Carta Mística no accede al contenido de las consultas. Las tarotistas están comprometidas con la confidencialidad de sus clientes.',
      },
      {
        q: '¿Qué datos personales recopilan?',
        a: 'Solo los necesarios para el funcionamiento de la plataforma (nombre, email). No compartimos tus datos con terceros. Podés leer nuestra Política de Privacidad completa para más detalles.',
      },
      {
        q: '¿Puedo eliminar mi cuenta?',
        a: 'Sí, podés solicitar la eliminación de tu cuenta y datos personales en cualquier momento escribiéndonos a info@cartamistica.com. Procesamos estas solicitudes en un plazo máximo de 7 días hábiles.',
      },
    ],
  },
]

function FaqItem({ pregunta, respuesta }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${open ? 'border-purple-500/40 bg-purple-900/10' : 'border-white/8 bg-white/3 hover:border-white/15'}`}>
      <button
        className="w-full flex items-start justify-between gap-4 p-5 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className={`text-sm font-medium leading-relaxed ${open ? 'text-white' : 'text-gray-200'}`}>
          {pregunta}
        </span>
        <span className="flex-shrink-0 mt-0.5">
          {open
            ? <ChevronUp size={16} className="text-purple-400" />
            : <ChevronDown size={16} className="text-gray-500" />
          }
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5">
          <p className="text-gray-400 text-sm leading-relaxed">{respuesta}</p>
        </div>
      )}
    </div>
  )
}

export default function Soporte() {
  const [categoriaActiva, setCategoriaActiva] = useState(0)
  const [form, setForm] = useState({ nombre: '', email: '', asunto: '', mensaje: '' })
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)

  const [error, setError] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    setEnviando(true)
    setError('')
    try {
      const res = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setEnviado(true)
    } catch {
      setError('Hubo un problema al enviar el mensaje. Intentá de nuevo o escribinos a info@cartamistica.com.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050511]">
      <Header />

      {/* Hero */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/15 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-purple-600/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-purple-900/30 border border-purple-500/20 rounded-full px-4 py-1.5 mb-6">
            <HelpCircle size={13} className="text-purple-400" />
            <span className="text-purple-300 text-xs font-medium tracking-wide">Centro de Ayuda</span>
          </div>
          <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-white mb-4">
            ¿En qué podemos ayudarte?
          </h1>
          <p className="text-gray-400 text-lg max-w-lg mx-auto">
            Encontrá respuestas en nuestras preguntas frecuentes o escribinos directamente.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">

        {/* Canales de contacto rápido */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
          {[
            {
              icon: Mail,
              titulo: 'Email',
              desc: 'Respondemos en menos de 24 hs',
              valor: 'info@cartamistica.com',
              href: 'mailto:info@cartamistica.com',
              color: 'purple',
            },
            {
              icon: MessageCircle,
              titulo: 'WhatsApp',
              desc: 'Solo mensajes de WhatsApp',
              valor: '+34 910 202 911',
              href: 'https://wa.me/34910202911',
              color: 'green',
            },
            {
              icon: Clock,
              titulo: 'Horario de atención',
              desc: 'Lun–Vie 9:00 a 18:00 (GMT+1)',
              valor: 'España & Latam',
              href: null,
              color: 'violet',
            },
          ].map(({ icon: Icon, titulo, desc, valor, href, color }) => (
            <div
              key={titulo}
              className={`bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-${color}-500/30 transition-all group`}
            >
              <div className={`w-10 h-10 rounded-xl bg-${color}-900/30 border border-${color}-500/20 flex items-center justify-center mb-4`}>
                <Icon size={18} className={`text-${color}-400`} />
              </div>
              <h3 className="text-white font-semibold mb-1">{titulo}</h3>
              <p className="text-gray-500 text-sm mb-2">{desc}</p>
              {href
                ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className={`text-${color}-400 hover:text-${color}-300 text-sm font-medium transition-colors`}>{valor}</a>
                : <p className={`text-${color}-400 text-sm font-medium`}>{valor}</p>
              }
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="font-playfair text-3xl font-bold text-white mb-2">Preguntas frecuentes</h2>
            <p className="text-gray-400">Todo lo que necesitás saber sobre La Carta Mística.</p>
          </div>

          {/* Tabs de categoría */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {FAQS.map(({ categoria, icon: Icon }, idx) => (
              <button
                key={categoria}
                onClick={() => setCategoriaActiva(idx)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  categoriaActiva === idx
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                }`}
              >
                <Icon size={14} />
                {categoria}
              </button>
            ))}
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS[categoriaActiva].preguntas.map(({ q, a }) => (
              <FaqItem key={q} pregunta={q} respuesta={a} />
            ))}
          </div>
        </div>

        {/* Formulario de contacto */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-playfair text-3xl font-bold text-white mb-2">Contactanos</h2>
            <p className="text-gray-400">¿No encontraste lo que buscabas? Escribinos y te respondemos a la brevedad.</p>
          </div>

          <div className="bg-[#0D0B2B]/60 border border-white/8 rounded-2xl p-6 sm:p-8">
            {enviado ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-900/30 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={28} className="text-green-400" />
                </div>
                <h3 className="text-white font-semibold text-xl mb-2">¡Mensaje enviado!</h3>
                <p className="text-gray-400">Te respondemos en menos de 24 horas hábiles.</p>
                <button
                  onClick={() => { setEnviado(false); setForm({ nombre: '', email: '', asunto: '', mensaje: '' }) }}
                  className="mt-5 text-purple-400 hover:text-purple-300 text-sm underline"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1.5 uppercase tracking-wide">Nombre</label>
                    <input
                      type="text"
                      required
                      value={form.nombre}
                      onChange={e => setForm({ ...form, nombre: e.target.value })}
                      placeholder="Tu nombre"
                      className="w-full bg-white/5 border border-white/10 focus:border-purple-500/50 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1.5 uppercase tracking-wide">Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="tu@correo.com"
                      className="w-full bg-white/5 border border-white/10 focus:border-purple-500/50 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-xs font-medium mb-1.5 uppercase tracking-wide">Asunto</label>
                  <select
                    required
                    value={form.asunto}
                    onChange={e => setForm({ ...form, asunto: e.target.value })}
                    className="w-full bg-[#0D0B2B] border border-white/10 focus:border-purple-500/50 rounded-xl px-4 py-3 text-sm outline-none transition-colors text-white"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="" disabled className="bg-[#0D0B2B] text-gray-500">Seleccioná un asunto</option>
                    <option value="consulta-general" className="bg-[#0D0B2B]">Consulta general</option>
                    <option value="problema-tecnico" className="bg-[#0D0B2B]">Problema técnico</option>
                    <option value="quiero-unirme" className="bg-[#0D0B2B]">Quiero unirme como tarotista</option>
                    <option value="reporte-tarotista" className="bg-[#0D0B2B]">Reportar una tarotista</option>
                    <option value="privacidad" className="bg-[#0D0B2B]">Privacidad y datos</option>
                    <option value="otro" className="bg-[#0D0B2B]">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 text-xs font-medium mb-1.5 uppercase tracking-wide">Mensaje</label>
                  <textarea
                    required
                    rows={5}
                    value={form.mensaje}
                    onChange={e => setForm({ ...form, mensaje: e.target.value })}
                    placeholder="Contanos tu consulta con el mayor detalle posible..."
                    className="w-full bg-white/5 border border-white/10 focus:border-purple-500/50 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 outline-none transition-colors resize-none"
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-sm bg-red-900/20 border border-red-500/20 rounded-xl px-4 py-3">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={enviando}
                  className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  {enviando ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Enviar mensaje
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Aviso legal pequeño */}
          <p className="text-gray-600 text-xs text-center mt-4 leading-relaxed">
            Al enviar este formulario aceptás nuestra{' '}
            <a href="#" className="text-gray-500 hover:text-gray-300 underline">Política de Privacidad</a>.
            Tus datos no serán compartidos con terceros.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
