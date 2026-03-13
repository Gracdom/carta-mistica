import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Eye, EyeOff, Shield } from 'lucide-react'

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL

const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: ((i * 137.5) % 100).toFixed(1),
  top:  ((i * 97.3) % 100).toFixed(1),
  size: (((i * 7 + 3) % 10) / 10 + 0.4).toFixed(1),
  dur:  (((i * 3 + 2) % 20) / 10 + 2.5).toFixed(1),
  delay:(((i * 5) % 40) / 10).toFixed(1),
}))

const INPUT = 'w-full bg-white/[0.04] border border-white/10 focus:border-violet-500/50 rounded-lg px-4 py-3 text-white placeholder-white/20 outline-none transition-all text-sm'

export default function AdminLogin() {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const navigate              = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: authErr } = await supabase.auth.signInWithPassword({
      email:    form.email,
      password: form.password,
    })

    setLoading(false)

    if (authErr) {
      setError('Credenciales incorrectas.')
      return
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (ADMIN_EMAIL && user?.email !== ADMIN_EMAIL) {
      await supabase.auth.signOut()
      setError('Esta cuenta no tiene permisos de administrador.')
      return
    }

    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-[#03020e] flex items-center justify-center px-4"
      style={{background:'radial-gradient(ellipse 70% 50% at 50% 0%,rgba(109,40,217,.1),#03020e 60%)'}}>
      <style>{`@keyframes tp{0%,100%{opacity:.08}50%{opacity:.3}}`}</style>

      {/* Partículas */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map(p => (
          <div key={p.id} className="absolute rounded-full bg-white"
            style={{left:`${p.left}%`,top:`${p.top}%`,width:`${p.size}px`,height:`${p.size}px`,animation:`tp ${p.dur}s ${p.delay}s ease-in-out infinite`}}/>
        ))}
      </div>

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="relative rounded-2xl overflow-hidden"
          style={{background:'#07051c',border:'1px solid rgba(139,92,246,.15)',boxShadow:'0 0 60px rgba(109,40,217,.12)'}}>

          {/* Glow top */}
          <div className="absolute top-0 inset-x-0 h-32 pointer-events-none"
            style={{background:'radial-gradient(ellipse 80% 100% at 50% 0%,rgba(109,40,217,.1),transparent)'}}/>
          <div className="absolute top-0 inset-x-10 h-px pointer-events-none"
            style={{background:'linear-gradient(90deg,transparent,rgba(139,92,246,.3),transparent)'}}/>

          <div className="relative px-8 py-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{background:'rgba(109,40,217,.2)',border:'1px solid rgba(139,92,246,.25)'}}>
                <Shield size={20} className="text-violet-400"/>
              </div>
              <h1 className="font-playfair text-white text-xl font-bold mb-1">Panel de Administración</h1>
              <p className="text-white/25 text-xs tracking-wide">La Carta Mística · Acceso restringido</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/30 text-[10px] uppercase tracking-widest mb-2">Email</label>
                <input
                  required type="email"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  placeholder="admin@carta.com"
                  className={INPUT}
                />
              </div>

              <div>
                <label className="block text-white/30 text-[10px] uppercase tracking-widest mb-2">Contraseña</label>
                <div className="relative">
                  <input
                    required type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm({...form, password: e.target.value})}
                    placeholder="••••••••"
                    className={INPUT + ' pr-10'}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors">
                    {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-red-400/70 text-xs px-3 py-2.5 rounded-lg"
                  style={{background:'rgba(220,38,38,.07)',border:'1px solid rgba(220,38,38,.12)'}}>
                  {error}
                </p>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50 mt-2"
                style={{background:'linear-gradient(135deg,rgba(109,40,217,.7),rgba(139,92,246,.5))',border:'1px solid rgba(139,92,246,.2)',color:'rgba(255,255,255,.85)'}}>
                {loading
                  ? <span className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"/>
                  : <><Shield size={14}/> Ingresar al panel</>
                }
              </button>
            </form>

            <p className="text-white/10 text-[10px] text-center mt-6">
              ¿Sos usuario? <a href="/login" className="text-violet-400/40 hover:text-violet-400/60 transition-colors">Ir al login</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
