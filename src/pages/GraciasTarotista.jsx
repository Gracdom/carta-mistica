import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, CheckCircle2, Mail, ArrowRight, Star } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const PASOS = [
  { n: '01', label: 'Revisión de solicitud',  desc: 'Nuestro equipo revisa tu perfil en 2-3 días hábiles.' },
  { n: '02', label: 'Contacto personalizado', desc: 'Te escribimos para conocerte mejor y completar tu perfil.' },
  { n: '03', label: 'Perfil publicado',        desc: 'Tu perfil aparece en el directorio y empezás a recibir clientes.' },
]

export default function GraciasTarotista() {
  const [dots, setDots] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setDots(d => (d + 1) % 4), 600)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="min-h-screen bg-[#050511]">
      <Header />

      <main className="relative flex items-center justify-center min-h-screen px-4 pt-20 pb-12">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle,#7c3aed,transparent 70%)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-60 h-60 rounded-full opacity-8"
            style={{ background: 'radial-gradient(circle,#4f46e5,transparent 70%)' }} />
          {/* Partículas */}
          {['top-20 left-1/3','top-40 right-1/4','bottom-32 left-1/4','bottom-20 right-1/3'].map((pos, i) => (
            <div key={i} className={`absolute ${pos} text-purple-400/20 text-lg animate-pulse`}
              style={{ animationDelay: `${i * 0.5}s` }}>✦</div>
          ))}
        </div>

        <div className="relative max-w-xl w-full">
          {/* Card principal */}
          <div className="rounded-3xl p-8 sm:p-10 text-center mb-6"
            style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(139,92,246,.15)' }}>

            {/* Ícono animado */}
            <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full mx-auto mb-6"
              style={{ background: 'rgba(52,211,153,.12)', border: '2px solid rgba(52,211,153,.3)' }}>
              <CheckCircle2 size={36} className="text-emerald-400" />
              <div className="absolute inset-0 rounded-full animate-ping opacity-20"
                style={{ background: 'rgba(52,211,153,.3)' }} />
            </div>

            <div className="flex items-center justify-center gap-2 mb-3">
              <Star size={12} className="text-purple-400/50" fill="currentColor" />
              <span className="text-purple-400/60 text-xs uppercase tracking-widest font-medium">Solicitud enviada</span>
              <Star size={12} className="text-purple-400/50" fill="currentColor" />
            </div>

            <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-white mb-3">
              ¡Gracias por tu interés!
            </h1>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6">
              Recibimos tu solicitud para unirte a <span className="text-purple-300 font-medium">La Carta Mística</span>.
              Nuestro equipo la revisará y te contactaremos muy pronto.
            </p>

            {/* Alerta email */}
            <div className="flex items-start gap-3 rounded-xl px-4 py-3 mb-2 text-left"
              style={{ background: 'rgba(139,92,246,.08)', border: '1px solid rgba(139,92,246,.18)' }}>
              <Mail size={16} className="text-purple-400 flex-shrink-0 mt-0.5" />
              <p className="text-gray-300 text-sm">
                Te enviamos un email de confirmación. Revisá también tu carpeta de <strong className="text-white">spam</strong> por si acaso.
              </p>
            </div>
          </div>

          {/* Pasos */}
          <div className="rounded-2xl p-6 mb-6"
            style={{ background: 'rgba(255,255,255,.015)', border: '1px solid rgba(255,255,255,.06)' }}>
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-4 text-center">¿Qué sigue?</p>
            <div className="space-y-4">
              {PASOS.map(({ n, label, desc }) => (
                <div key={n} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-purple-300 flex-shrink-0"
                    style={{ background: 'rgba(109,40,217,.2)', border: '1px solid rgba(139,92,246,.25)' }}>
                    {n}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{label}</p>
                    <p className="text-gray-500 text-xs leading-relaxed mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contacto */}
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-5">
              ¿Tenés alguna pregunta?{' '}
              <a href="https://wa.me/34910202911" target="_blank" rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300 transition-colors">
                Escribinos por WhatsApp
              </a>
            </p>
            <Link to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
              <ArrowRight size={14} className="rotate-180" />
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
