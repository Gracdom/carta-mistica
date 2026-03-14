import Header from '../components/Header'
import Footer from '../components/Footer'

export function LegalPage({ titulo, ultimaActualizacion, children }) {
  return (
    <div className="min-h-screen bg-[#050511]">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-32 pb-20">
        <div className="mb-10">
          <p className="text-purple-400/60 text-xs uppercase tracking-widest mb-3">La Carta Mística · Legal</p>
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-white mb-2">{titulo}</h1>
          <p className="text-gray-500 text-sm">Última actualización: {ultimaActualizacion}</p>
        </div>
        <div className="prose-legal">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export function Seccion({ titulo, children }) {
  return (
    <section className="mb-8">
      <h2 className="font-playfair text-white text-xl font-semibold mb-3 pb-2"
        style={{ borderBottom: '1px solid rgba(139,92,246,.15)' }}>
        {titulo}
      </h2>
      <div className="space-y-3 text-gray-400 text-sm leading-relaxed">
        {children}
      </div>
    </section>
  )
}

export function P({ children }) {
  return <p className="text-gray-400 text-sm leading-relaxed">{children}</p>
}

export function Li({ items }) {
  return (
    <ul className="space-y-1.5 pl-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-gray-400 text-sm">
          <span className="text-purple-400/50 flex-shrink-0 mt-0.5">✦</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
