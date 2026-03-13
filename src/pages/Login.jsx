import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Sparkles, Eye, EyeOff } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  w: (((i * 7 + 3) % 20) / 10 + 0.8).toFixed(1),
  left: ((i * 137.5) % 100).toFixed(1),
  top: ((i * 97.3) % 100).toFixed(1),
  dur: (((i * 3 + 2) % 25) / 10 + 2).toFixed(1),
  delay: (((i * 5) % 40) / 10).toFixed(1),
}))

const INPUT = 'w-full bg-white/4 border border-white/10 focus:border-purple-500/60 focus:bg-white/6 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition-all text-sm'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })
    setLoading(false)
    if (error) {
      setError('Email o contraseña incorrectos. Verificá tus datos.')
    } else {
      navigate('/')
    }
  }

  return (
    <div className="bg-[#030312] min-h-screen">
      <style>{`
        @keyframes twinkle { 0%,100%{opacity:.12;transform:scale(.8)} 50%{opacity:.9;transform:scale(1.2)} }
        @keyframes floatY  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes orbPulse{ 0%,100%{opacity:.2} 50%{opacity:.45} }
      `}</style>

      <Header />

      <main className="relative min-h-screen flex items-center justify-center px-4 py-32 overflow-hidden"
        style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 0%, #120d38 0%, #030312 60%)' }}>

        {/* Stars */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {STARS.map(s => (
            <div key={s.id} className="absolute rounded-full bg-white"
              style={{ width: s.w + 'px', height: s.w + 'px', left: s.left + '%', top: s.top + '%', animation: `twinkle ${s.dur}s ease-in-out infinite`, animationDelay: s.delay + 's' }} />
          ))}
        </div>

        {/* Orbs */}
        <div className="absolute rounded-full pointer-events-none"
          style={{ width: '500px', height: '500px', background: 'radial-gradient(circle,rgba(109,40,217,.12) 0%,transparent 65%)', top: '-150px', left: '50%', transform: 'translateX(-50%)', animation: 'orbPulse 8s ease-in-out infinite' }} />
        <div className="absolute rounded-full pointer-events-none"
          style={{ width: '300px', height: '300px', background: 'radial-gradient(circle,rgba(168,85,247,.08) 0%,transparent 65%)', bottom: '0', right: '10%', animation: 'orbPulse 10s ease-in-out infinite', animationDelay: '3s' }} />

        {/* Card */}
        <div className="relative w-full max-w-md">
          <div className="relative rounded-2xl p-px"
            style={{ background: 'linear-gradient(135deg,rgba(139,92,246,.4),rgba(109,40,217,.15) 50%,rgba(168,85,247,.4))' }}>
            <div className="rounded-2xl p-8 sm:p-10 overflow-hidden"
              style={{ background: '#06041a' }}>

              {/* Top glow */}
              <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 70% 100% at 50% 0%,rgba(109,40,217,.1) 0%,transparent 70%)' }} />

              <div className="relative text-center mb-8">
                <div className="text-purple-400/50 text-lg mb-4 tracking-[.5em]"
                  style={{ animation: 'floatY 5s ease-in-out infinite' }}>✦ ☽ ✦</div>
                <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-white mb-2">
                  Iniciar sesión
                </h1>
                <p className="text-gray-500 text-sm">Bienvenido/a de vuelta</p>
              </div>

              <form onSubmit={handleSubmit} className="relative space-y-4">
                <div>
                  <label className="block text-gray-300 text-xs font-semibold mb-1.5">Email</label>
                  <input
                    required type="email" name="email"
                    value={form.email} onChange={handleChange}
                    placeholder="tu@email.com" className={INPUT}
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-xs font-semibold mb-1.5">Contraseña</label>
                  <div className="relative">
                    <input
                      required type={showPass ? 'text' : 'password'} name="password"
                      value={form.password} onChange={handleChange}
                      placeholder="••••••••" className={INPUT + ' pr-11'}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading}
                  className="w-full text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg,#6d28d9,#9333ea)', boxShadow: '0 0 20px rgba(139,92,246,.3)' }}>
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><Sparkles size={15} /> Entrar</>
                  )}
                </button>

                <p className="text-center text-gray-500 text-sm pt-1">
                  ¿No tenés cuenta?{' '}
                  <Link to="/registro" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                    Registrate
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
