import { Link } from 'react-router-dom'
import { LegalPage, Seccion, P, Li } from '../components/LegalLayout'

const TABLA_COOKIES = [
  { nombre: '_ga, _ga_*',        tipo: 'Analítica',  proveedor: 'Google Analytics', duracion: '2 años',    finalidad: 'Medir el tráfico y comportamiento de los usuarios en el Sitio.' },
  { nombre: 'sb-*-auth-token',   tipo: 'Técnica',    proveedor: 'Supabase',         duracion: 'Sesión',    finalidad: 'Mantener la sesión del usuario autenticado.' },
  { nombre: '_gtm_*',            tipo: 'Analítica',  proveedor: 'Google Tag Manager',duracion: 'Sesión',    finalidad: 'Gestión de etiquetas de seguimiento y conversión.' },
  { nombre: 'cookie_consent',    tipo: 'Técnica',    proveedor: 'Propia',           duracion: '1 año',     finalidad: 'Recordar las preferencias de consentimiento del usuario.' },
]

export default function Cookies() {
  return (
    <LegalPage titulo="Política de Cookies" ultimaActualizacion="1 de marzo de 2026">

      <Seccion titulo="1. ¿Qué son las cookies?">
        <P>Las cookies son pequeños archivos de texto que los sitios web almacenan en el dispositivo del usuario cuando los visita. Se utilizan para recordar preferencias, analizar el comportamiento de navegación y mejorar la experiencia del usuario.</P>
      </Seccion>

      <Seccion titulo="2. Tipos de cookies que usamos">
        <P><strong className="text-white">Cookies técnicas o necesarias:</strong> Son imprescindibles para el funcionamiento del Sitio. No requieren consentimiento y no pueden desactivarse.</P>
        <P><strong className="text-white">Cookies analíticas:</strong> Nos permiten conocer cómo los usuarios interactúan con el Sitio para mejorarlo. Se activan solo con tu consentimiento.</P>
        <P><strong className="text-white">Cookies de marketing:</strong> Actualmente no utilizamos cookies de publicidad comportamental de terceros.</P>
      </Seccion>

      <Seccion titulo="3. Cookies utilizadas en este Sitio">
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(139,92,246,.2)' }}>
                {['Nombre', 'Tipo', 'Proveedor', 'Duración', 'Finalidad'].map(h => (
                  <th key={h} className="text-left py-2 pr-4 text-white/50 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABLA_COOKIES.map((c, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                  <td className="py-2.5 pr-4 font-mono text-purple-300/70">{c.nombre}</td>
                  <td className="py-2.5 pr-4 text-gray-400">{c.tipo}</td>
                  <td className="py-2.5 pr-4 text-gray-400">{c.proveedor}</td>
                  <td className="py-2.5 pr-4 text-gray-400 whitespace-nowrap">{c.duracion}</td>
                  <td className="py-2.5 text-gray-500">{c.finalidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Seccion>

      <Seccion titulo="4. Gestión del consentimiento">
        <P>Al entrar por primera vez al Sitio, verás una barra de consentimiento de cookies. Podés aceptar todas las cookies, rechazar las no esenciales o gestionar tus preferencias en cualquier momento.</P>
        <P>Podés retirar tu consentimiento o cambiar tus preferencias haciendo clic en el botón de gestión de cookies disponible en el pie de página.</P>
      </Seccion>

      <Seccion titulo="5. Cómo desactivar las cookies en tu navegador">
        <P>También podés gestionar las cookies directamente desde la configuración de tu navegador:</P>
        <Li items={[
          'Chrome: Configuración → Privacidad y seguridad → Cookies.',
          'Firefox: Opciones → Privacidad y seguridad → Cookies y datos del sitio.',
          'Safari: Preferencias → Privacidad → Gestionar datos de sitios web.',
          'Edge: Configuración → Privacidad, búsqueda y servicios → Cookies.',
        ]} />
        <P>Ten en cuenta que desactivar ciertas cookies puede afectar al funcionamiento del Sitio.</P>
      </Seccion>

      <Seccion titulo="6. Actualizaciones de esta política">
        <P>Podemos actualizar esta Política de Cookies cuando cambiemos las cookies que usamos o cuando la legislación lo requiera. Te notificaremos los cambios relevantes mediante el banner de consentimiento.</P>
      </Seccion>

      <div className="mt-10 pt-6 flex flex-wrap gap-4 text-xs" style={{ borderTop: '1px solid rgba(255,255,255,.06)' }}>
        {[['Términos y Condiciones', '/terminos'], ['Política de Privacidad', '/privacidad'], ['Aviso Legal', '/aviso-legal']].map(([label, to]) => (
          <Link key={to} to={to} className="text-purple-400/60 hover:text-purple-400 transition-colors">{label}</Link>
        ))}
      </div>
    </LegalPage>
  )
}
