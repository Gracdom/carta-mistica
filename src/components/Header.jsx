import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, User, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ModalLeadTarotista from './ModalLeadTarotista'

const NAV = [
  { label: 'Inicio', to: '/' },
  { label: 'Blog', to: '/blog' },
  { label: 'Soporte', to: '/soporte' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showLead, setShowLead] = useState(false)
  const { pathname } = useLocation()
  const { user, signOut } = useAuth()
  const isDirectorio = pathname === '/directoriotarot'
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <>
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-[#050511]/80 backdrop-blur-lg border-b border-white/8 shadow-lg shadow-black/30'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center flex-shrink-0">
          <img
            src="/logo.png"
            alt="Carta Mística"
            className="h-12 sm:h-14 w-auto object-contain"
            style={{ mixBlendMode: 'screen' }}
          />
        </Link>

        {/* Nav desktop */}
        {!isDirectorio && (
          <nav className="hidden md:flex items-center gap-6">
            {NAV.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className={`text-sm font-medium transition-colors duration-200 ${
                  pathname === to
                    ? 'text-purple-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        )}

        {/* CTAs desktop — solo visible si hay sesión activa */}
        {user && (
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <div className="flex items-center gap-1.5 text-gray-400 text-sm">
              <User size={14} className="text-purple-400" />
              <span className="max-w-[140px] truncate">{user.email}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm font-medium transition-colors"
            >
              <LogOut size={14} /> Salir
            </button>
          </div>
        )}

        {/* Botón ¿Eres tarotista? — siempre visible en desktop cuando no hay sesión */}
        {!user && !isDirectorio && (
          <button
            onClick={() => setShowLead(true)}
            className="hidden md:flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full transition-all flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg,rgba(124,58,237,.2),rgba(109,40,217,.1))',
              border: '1px solid rgba(139,92,246,.35)',
              color: '#c4b5fd',
              boxShadow: '0 0 14px rgba(124,58,237,.15)',
            }}
          >
            <Sparkles size={13} />
            ¿Eres tarotista?
          </button>
        )}

        {/* Mobile toggle */}
        {!isDirectorio && (
          <button
            className="md:hidden text-white p-1"
            onClick={() => setOpen(!open)}
            aria-label="Menú"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        )}
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-[#0D0B2B] border-t border-white/10 px-5 py-5 flex flex-col gap-4">
          {/* Logo mobile */}
          <Link to="/" onClick={() => setOpen(false)} className="mb-1">
            <img src="/logo.png" alt="Carta Mística" className="h-11 w-auto object-contain" style={{ mixBlendMode: 'screen' }} />
          </Link>

          {NAV.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              onClick={() => setOpen(false)}
              className={`text-sm font-medium transition-colors ${
                pathname === to ? 'text-purple-400' : 'text-gray-300'
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
            {user && (
              <>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <User size={14} className="text-purple-400" />
                  <span className="truncate">{user.email}</span>
                </div>
                <button
                  onClick={() => { handleSignOut(); setOpen(false) }}
                  className="flex items-center gap-2 text-gray-300 text-sm font-medium"
                >
                  <LogOut size={14} /> Cerrar sesión
                </button>
              </>
            )}
            {!user && (
              <button
                onClick={() => { setOpen(false); setShowLead(true) }}
                className="flex items-center justify-center gap-1.5 text-sm font-semibold px-5 py-2.5 rounded-full transition-all"
                style={{
                  background: 'linear-gradient(135deg,rgba(124,58,237,.25),rgba(109,40,217,.15))',
                  border: '1px solid rgba(139,92,246,.4)',
                  color: '#c4b5fd',
                }}>
                <Sparkles size={13} /> ¿Eres tarotista? Únete
              </button>
            )}
          </div>
        </div>
      )}
    </header>

    {showLead && <ModalLeadTarotista onClose={() => setShowLead(false)} />}
  </>
  )
}
