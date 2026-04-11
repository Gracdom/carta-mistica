import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import Tarotistas from './pages/Tarotistas'
import Perfil from './pages/Perfil'
import DirectorioTarot from './pages/DirectorioTarot'
import Login from './pages/Login'
import Register from './pages/Register'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Soporte from './pages/Soporte'
import Terminos from './pages/Terminos'
import Privacidad from './pages/Privacidad'
import Cookies from './pages/Cookies'
import AvisoLegal from './pages/AvisoLegal'
import GraciasTarotista from './pages/GraciasTarotista'
import CookieBanner from './components/CookieBanner'
import RegistrosAkasicos from './pages/RegistrosAkasicos'
import PagoExitoso from './pages/PagoExitoso'
import AdminGuard from './pages/admin/AdminGuard'
import AdminLayout from './pages/admin/AdminLayout'
import AdminLogin from './pages/admin/AdminLogin'
import Dashboard from './pages/admin/Dashboard'
import AdminTarotistas from './pages/admin/AdminTarotistas'
import AdminTarotistasForm from './pages/admin/AdminTarotistasForm'
import AdminSolicitudes from './pages/admin/AdminSolicitudes'
import AdminResenas from './pages/admin/AdminResenas'
import AdminLeads from './pages/admin/AdminLeads'
import AdminConsultas from './pages/admin/AdminConsultas'
import { AuthProvider } from './context/AuthContext'
import { LeadModalProvider, useLeadModalShow, useLeadModalActions } from './context/LeadModalContext'
import ModalLeadTarotista from './components/ModalLeadTarotista'
import './App.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

const subdomain = window.location.hostname.split('.')[0]
const isDirectorioSubdomain = subdomain === 'directoriotarot'

const DEV_ROUTES = [
  { label: 'Inicio', path: '/' },
  { label: 'Tarotistas', path: '/tarotistas' },
  { label: 'Directorio Tarot', path: '/directoriotarot' },
  { label: 'Registros Akasicos', path: '/registros-akasicos' },
  { label: 'Blog', path: '/blog' },
  { label: 'Soporte', path: '/soporte' },
  { label: 'Terminos', path: '/terminos' },
  { label: 'Privacidad', path: '/privacidad' },
  { label: 'Cookies', path: '/cookies' },
  { label: 'Aviso Legal', path: '/aviso-legal' },
  { label: 'Login', path: '/login' },
  { label: 'Registro', path: '/registro' },
  { label: 'Admin Login', path: '/admin/login' },
  { label: 'Admin Dashboard', path: '/admin' },
  { label: 'Admin Tarotistas', path: '/admin/tarotistas' },
  { label: 'Admin Consultas', path: '/admin/consultas' },
  { label: 'Admin Leads', path: '/admin/leads' },
  { label: 'Admin Solicitudes', path: '/admin/solicitudes' },
  { label: 'Admin Resenas', path: '/admin/resenas' },
]

function AppGlobal() {
  const show         = useLeadModalShow()
  const { closeLeadModal } = useLeadModalActions()
  return <ModalLeadTarotista open={show} onClose={closeLeadModal} />
}

function DevRoutePicker() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  if (!import.meta.env.DEV) return null

  return (
    <div
      className="fixed left-4 bottom-4 z-[60] rounded-xl p-3 w-[270px]"
      style={{ background: 'rgba(7,4,20,.92)', border: '1px solid rgba(139,92,246,.35)', backdropFilter: 'blur(8px)' }}
    >
      <p className="text-[10px] tracking-wide text-violet-300/80 uppercase mb-2">Navegacion rapida (dev)</p>
      <select
        value={DEV_ROUTES.some(r => r.path === pathname) ? pathname : ''}
        onChange={(e) => e.target.value && navigate(e.target.value)}
        className="w-full bg-white/5 text-white text-sm rounded-lg px-3 py-2 border border-white/15 focus:outline-none focus:border-violet-400/70"
      >
        <option value="" className="bg-[#110a2c]">Seleccionar pagina...</option>
        {DEV_ROUTES.map(route => (
          <option key={route.path} value={route.path} className="bg-[#110a2c]">
            {route.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default function App() {
  if (isDirectorioSubdomain) {
    return (
      <AuthProvider>
        <LeadModalProvider>
          <BrowserRouter>
            <ScrollToTop />
            <DevRoutePicker />
            <Routes>
              <Route path="*" element={<DirectorioTarot />} />
            </Routes>
          </BrowserRouter>
        </LeadModalProvider>
      </AuthProvider>
    )
  }

  return (
    <AuthProvider>
      <LeadModalProvider>
      <BrowserRouter>
        <ScrollToTop />
        <DevRoutePicker />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tarotistas" element={<Tarotistas />} />
          <Route path="/tarotistas/:id" element={<Perfil />} />
          <Route path="/directoriotarot" element={<DirectorioTarot />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/soporte" element={<Soporte />} />
          <Route path="/terminos" element={<Terminos />} />
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/aviso-legal" element={<AvisoLegal />} />
          <Route path="/gracias-tarotista" element={<GraciasTarotista />} />
          <Route path="/registros-akasicos" element={<RegistrosAkasicos />} />
          <Route path="/pago-exitoso" element={<PagoExitoso />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
            <Route index element={<Dashboard />} />
            <Route path="tarotistas" element={<AdminTarotistas />} />
            <Route path="tarotistas/nuevo" element={<AdminTarotistasForm />} />
            <Route path="tarotistas/:id" element={<AdminTarotistasForm />} />
            <Route path="consultas" element={<AdminConsultas />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="solicitudes" element={<AdminSolicitudes />} />
            <Route path="resenas" element={<AdminResenas />} />
          </Route>
        </Routes>

      {/* Botón flotante de WhatsApp */}
      <a
        href="https://wa.me/34910202911"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-24 right-6 w-12 h-12 lg:w-14 lg:h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-900/40 z-50 transition-all duration-300 hover:scale-110"
      >
        <svg className="w-6 h-6 lg:w-7 lg:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.93 3.297" />
        </svg>
      </a>

      <CookieBanner />
      <AppGlobal />
    </BrowserRouter>
    </LeadModalProvider>
    </AuthProvider>
  )
}
