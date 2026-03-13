import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, Mail, Sparkles } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function PagoExitoso() {
  const [dots, setDots] = useState(1)

  useEffect(() => {
    const t = setInterval(() => setDots(d => (d % 3) + 1), 600)
    return () => clearInterval(t)
  }, [])

  // ── Evento de compra para GTM ─────────────────────────────────────────────
  useEffect(() => {
    const params      = new URLSearchParams(window.location.search)
    const session_id  = params.get('session_id') || ''
    const value       = parseFloat(params.get('value') || '0')
    const currency    = (params.get('currency') || 'EUR').toUpperCase()
    const email       = params.get('email') || ''
    const phone       = params.get('phone') || ''

    if (!session_id) return   // no disparar si no hay sesión válida

    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ ecommerce: null })   // limpiar objeto anterior
    window.dataLayer.push({
      event:          'purchase',
      ecommerce: {
        transaction_id: session_id,
        value,
        currency,
        items: [
          {
            item_id:   'registros-akasicos',
            item_name: 'Lectura de Registros Akáshicos Completa',
            price:     value,
            quantity:  1,
          },
        ],
      },
      user_data: {
        email_address: email,
        phone_number:  phone,
      },
    })
  }, [])

  return (
    <div style={{ background:'#030312', minHeight:'100vh' }}>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes checkIn { 0%{transform:scale(0) rotate(-20deg);opacity:0} 60%{transform:scale(1.15) rotate(5deg)} 100%{transform:scale(1) rotate(0);opacity:1} }
        @keyframes orbGlow { 0%,100%{opacity:.15} 50%{opacity:.35} }
        .fade-up   { animation:fadeUp  .7s ease forwards; }
        .check-anim{ animation:checkIn .6s .2s cubic-bezier(.34,1.56,.64,1) both; }
        .orb       { animation:orbGlow 4s ease-in-out infinite; }
      `}</style>

      <Header />

      <main className="relative flex items-center justify-center min-h-screen px-4 pt-20">
        {/* Orbes de fondo */}
        <div className="absolute rounded-full orb pointer-events-none"
          style={{ width:'600px', height:'600px', background:'radial-gradient(circle,rgba(109,40,217,.12) 0%,transparent 65%)', top:'50%', left:'50%', transform:'translate(-50%,-50%)' }} />

        <div className="relative text-center max-w-lg mx-auto fade-up">
          {/* Símbolo */}
          <div className="text-purple-400/40 text-2xl tracking-[.5em] mb-6">✦ ☽ ✦</div>

          {/* Check */}
          <div className="check-anim inline-flex items-center justify-center w-24 h-24 rounded-full mb-8"
            style={{ background:'linear-gradient(135deg,rgba(109,40,217,.3),rgba(16,185,129,.2))', border:'2px solid rgba(16,185,129,.5)', boxShadow:'0 0 40px rgba(16,185,129,.2)' }}>
            <CheckCircle size={44} className="text-emerald-400" />
          </div>

          <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-white mb-3">
            ¡Tu pago fue exitoso!
          </h1>
          <p className="text-purple-300/70 text-lg mb-8">Los Guardianes ya están entregando tu lectura</p>

          {/* Tarjeta info */}
          <div className="rounded-2xl p-6 mb-8 text-left"
            style={{ background:'linear-gradient(135deg,rgba(109,40,217,.15),rgba(139,92,246,.07))', border:'1px solid rgba(139,92,246,.35)' }}>

            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background:'rgba(109,40,217,.3)' }}>
                <Mail size={15} className="text-purple-300" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm mb-1">Revisá tu bandeja de entrada</p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Tu lectura completa de los Registros Akáshicos fue enviada al email que ingresaste.
                  Si no la ves en los próximos minutos, revisá la carpeta de spam.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background:'rgba(109,40,217,.3)' }}>
                <Sparkles size={15} className="text-purple-300" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm mb-1">¿Qué incluye tu lectura?</p>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>✦ Origen del alma y misión de vida</li>
                  <li>✦ Patrones kármicos y bloqueos actuales</li>
                  <li>✦ Respuesta directa a tu intención</li>
                  <li>✦ Mensaje de tus Guardianes Akáshicos</li>
                </ul>
              </div>
            </div>
          </div>

          <Link to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors border border-white/10 hover:border-white/20 px-6 py-3 rounded-full">
            Volver al inicio
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
