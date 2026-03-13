import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL

export default function AdminGuard({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030312] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (ADMIN_EMAIL && user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-[#030312] flex items-center justify-center text-center px-4">
        <div>
          <div className="text-purple-400 text-4xl mb-4">✦</div>
          <h1 className="text-white font-playfair text-2xl font-bold mb-2">Acceso denegado</h1>
          <p className="text-gray-400 text-sm">No tenés permisos para acceder al panel de administración.</p>
        </div>
      </div>
    )
  }

  return children
}
