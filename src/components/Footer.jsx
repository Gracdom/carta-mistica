import { Link } from 'react-router-dom'
import { Mail, Instagram, Facebook, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#030310] border-t border-white/5 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <img
                src="/logo.png"
                alt="Carta Mística"
                className="h-12 w-auto object-contain"
                style={{ mixBlendMode: 'screen' }}
              />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              El directorio de tarotistas y videntes más completo de habla hispana.
              Consultas privadas, tarotistas verificados.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-full border border-white/10 hover:border-purple-500/50 hover:bg-purple-900/20 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Directorio */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">Directorio</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Ver todos los tarotistas', to: '/tarotistas' },
                { label: 'Tarotistas en Argentina', to: '/tarotistas' },
                { label: 'Tarotistas en Chile', to: '/tarotistas' },
                { label: 'Tarotistas en México', to: '/tarotistas' },
                { label: 'Tarotistas online ahora', to: '/tarotistas' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Especialidades */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">Especialidades</h4>
            <ul className="space-y-2.5">
              {[
                'Amor y Relaciones',
                'Llamas Gemelas',
                'Trabajo y Dinero',
                'Lecturas Psíquicas',
                'Karma y Vidas Pasadas',
                'Tarot General',
              ].map(l => (
                <li key={l}>
                  <Link to="/tarotistas" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">Empresa</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Blog', to: '/blog' },
                { label: 'Soporte', to: '/soporte' },
                { label: 'Contacto', to: '/soporte' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  to="/directoriotarot"
                  className="inline-flex items-center gap-1.5 text-purple-400 hover:text-purple-300 text-sm font-semibold transition-colors"
                >
                  ✦ Soy Tarotista, quiero unirme
                </Link>
              </li>
            </ul>
            <div className="mt-5 flex items-center gap-2 text-gray-500 text-sm">
              <Mail size={14} className="text-purple-400 flex-shrink-0" />
              hola@cartamistica.com
            </div>
          </div>
        </div>

        {/* Aviso legal */}
        <div className="border-t border-white/5 pt-6 mb-5">
          <p className="text-gray-600 text-xs leading-relaxed">
            <strong className="text-gray-500">Aviso legal:</strong> Las lecturas de tarot y videncia ofrecidas en esta plataforma tienen carácter de orientación espiritual y entretenimiento. No reemplazan la consulta con profesionales de la salud, el derecho o la psicología. La Carta Mística no se responsabiliza por decisiones tomadas en base a las lecturas.
          </p>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs">
            © 2026 La Carta Mística. Servicio enfocado en Argentina y para toda la comunidad latina en el mundo.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Términos de uso', 'Privacidad', 'Cookies', 'Aviso legal'].map(l => (
              <a key={l} href="#" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
