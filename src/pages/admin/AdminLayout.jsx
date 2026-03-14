import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Users, FileText, Star, BookOpen, TrendingUp,
  LogOut, Menu, X, ChevronRight, Sparkles
} from 'lucide-react'

const NAV = [
  { to: '/admin',              label: 'Dashboard',    icon: LayoutDashboard, end: true },
  { to: '/admin/consultas',    label: 'Consultas ✦',  icon: BookOpen        },
  { to: '/admin/leads',        label: 'Leads',        icon: TrendingUp      },
  { to: '/admin/tarotistas',   label: 'Tarotistas',   icon: Users           },
  { to: '/admin/solicitudes',  label: 'Solicitudes',  icon: FileText        },
  { to: '/admin/resenas',      label: 'Reseñas',      icon: Star            },
]

export default function AdminLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const Sidebar = ({ mobile = false }) => (
    <aside className={`flex flex-col h-full ${mobile ? '' : ''}`}
      style={{ background: '#06041a', borderRight: '1px solid rgba(139,92,246,.12)' }}>
      {/* Brand */}
      <div className="px-5 py-5 border-b" style={{ borderColor: 'rgba(139,92,246,.12)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-purple-300"
            style={{ background: 'rgba(109,40,217,.3)', border: '1px solid rgba(139,92,246,.4)' }}>
            <Sparkles size={15} />
          </div>
          <div>
            <p className="text-white text-sm font-semibold leading-tight">Carta Mística</p>
            <p className="text-purple-400/60 text-[10px] uppercase tracking-wider">Panel Admin</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-purple-600/20 text-white border border-purple-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }>
            <Icon size={16} />
            {label}
            <ChevronRight size={12} className="ml-auto opacity-40" />
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t" style={{ borderColor: 'rgba(139,92,246,.12)' }}>
        <div className="px-3 py-2 mb-2">
          <p className="text-gray-500 text-xs truncate">{user?.email}</p>
        </div>
        <button onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all">
          <LogOut size={16} /> Cerrar sesión
        </button>
      </div>
    </aside>
  )

  return (
    <div className="min-h-screen flex" style={{ background: '#030312' }}>

      {/* Sidebar desktop */}
      <div className="hidden lg:flex lg:flex-col lg:w-56 xl:w-60 fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-60 flex flex-col z-50">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-56 xl:ml-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center gap-4 px-5 py-4"
          style={{ background: 'rgba(3,3,18,.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
          <button onClick={() => setOpen(!open)}
            className="lg:hidden text-gray-400 hover:text-white transition-colors p-1">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="h-4 w-px bg-white/10 lg:hidden" />
          <NavLink to="/" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">
            ← Volver al sitio
          </NavLink>
        </header>

        {/* Content */}
        <main className="flex-1 p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
