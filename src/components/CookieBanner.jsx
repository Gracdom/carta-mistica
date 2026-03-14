import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X, Cookie, CheckCircle2, XCircle } from 'lucide-react'

const COOKIE_KEY = 'cookie_consent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY)
    if (!consent) {
      const t = setTimeout(() => setVisible(true), 1200)
      return () => clearTimeout(t)
    }
  }, [])

  const accept = () => {
    setSaving(true)
    localStorage.setItem(COOKIE_KEY, 'accepted')
    setTimeout(() => setVisible(false), 300)
  }

  const reject = () => {
    localStorage.setItem(COOKIE_KEY, 'rejected')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[200] px-4 py-3 sm:px-6 sm:py-4 transition-all duration-500"
      style={{
        background: 'linear-gradient(to top, rgba(3,3,16,.98) 80%, rgba(3,3,16,.92))',
        borderTop: '1px solid rgba(139,92,246,.18)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Icono + texto */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <Cookie size={18} className="text-purple-400/70 flex-shrink-0 mt-0.5" />
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
            Usamos cookies propias y de terceros para mejorar tu experiencia, analizar el tráfico y personalizar contenido.
            Podés gestionar tus preferencias en cualquier momento.{' '}
            <Link to="/cookies" className="text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors">
              Más información
            </Link>
          </p>
        </div>

        {/* Botones */}
        <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
          <button
            onClick={reject}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white transition-colors border border-white/8 hover:border-white/15"
          >
            <XCircle size={14} />
            Solo necesarias
          </button>
          <button
            onClick={accept}
            disabled={saving}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold text-white transition-all disabled:opacity-60"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              boxShadow: '0 0 20px rgba(124,58,237,.3)',
            }}
          >
            <CheckCircle2 size={14} />
            Aceptar todo
          </button>
          <button
            onClick={reject}
            aria-label="Cerrar"
            className="ml-1 text-gray-600 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
