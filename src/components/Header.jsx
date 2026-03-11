import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const NAV = [
  { label: 'Inicio', to: '/' },
  { label: 'Ver Tarotistas', to: '/tarotistas' },
  { label: 'Soy Tarotista', to: '/unirse' },
  { label: 'Blog', to: '#' },
  { label: 'Soporte', to: '#' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#050511]/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center flex-shrink-0">
          <img
            src="/logo.png"
            alt="Carta Mística"
            className="h-10 sm:h-11 w-auto object-contain"
            style={{ filter: 'drop-shadow(0 0 8px rgba(167,139,250,0.4))' }}
          />
        </Link>

        {/* Nav desktop */}
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

        {/* CTAs desktop */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          <a href="#" className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
            Iniciar sesión
          </a>
          <Link
            to="/unirse"
            className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors shadow-md shadow-purple-900/40"
          >
            Registrarme
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white p-1"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-[#0D0B2B] border-t border-white/10 px-5 py-5 flex flex-col gap-4">
          {/* Logo mobile */}
          <Link to="/" onClick={() => setOpen(false)} className="mb-1">
            <img src="/logo.png" alt="Carta Mística" className="h-9 w-auto object-contain"
              style={{ filter: 'drop-shadow(0 0 6px rgba(167,139,250,0.4))' }} />
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
            <a href="#" className="text-gray-300 text-sm font-medium">Iniciar sesión</a>
            <Link
              to="/unirse"
              onClick={() => setOpen(false)}
              className="bg-purple-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full text-center"
            >
              Registrarme
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
