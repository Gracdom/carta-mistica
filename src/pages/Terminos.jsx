import { Link } from 'react-router-dom'
import { LegalPage, Seccion, P, Li } from '../components/LegalLayout'

export default function Terminos() {
  return (
    <LegalPage titulo="Términos y Condiciones de Uso" ultimaActualizacion="1 de marzo de 2026">

      <Seccion titulo="1. Aceptación de los términos">
        <P>Al acceder y utilizar el sitio web <strong className="text-white">cartamistica.com</strong> (en adelante, "La Carta Mística", "el Sitio" o "la Plataforma"), el usuario acepta quedar vinculado por los presentes Términos y Condiciones de Uso. Si no estás de acuerdo con alguno de estos términos, te pedimos que no uses el Sitio.</P>
        <P>La Carta Mística se reserva el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor desde su publicación en el Sitio.</P>
      </Seccion>

      <Seccion titulo="2. Naturaleza del servicio">
        <P>La Carta Mística es un <strong className="text-white">directorio de tarotistas y videntes independientes</strong>. El Sitio actúa como plataforma de conexión entre consultantes y profesionales del tarot, la videncia y la espiritualidad.</P>
        <P>Todos los servicios ofrecidos en esta plataforma tienen carácter de <strong className="text-white">entretenimiento y orientación espiritual</strong>. Las lecturas de tarot y videncia no constituyen asesoramiento profesional en materia de salud, legal, financiera o psicológica.</P>
      </Seccion>

      <Seccion titulo="3. Limitación de responsabilidad">
        <P>La Carta Mística no se hace responsable de:</P>
        <Li items={[
          'Las decisiones que los usuarios tomen basándose en las lecturas recibidas.',
          'La exactitud, veracidad o completitud de las lecturas proporcionadas por las tarotistas.',
          'Pérdidas económicas, emocionales o de cualquier tipo derivadas del uso de los servicios.',
          'Interrupciones técnicas del servicio por causas ajenas a nuestra voluntad.',
          'El contenido publicado por las tarotistas registradas en el directorio.',
        ]} />
      </Seccion>

      <Seccion titulo="4. Registro de Akáshico — Servicio de IA">
        <P>El servicio "Registro Akáshico" es generado mediante inteligencia artificial y tiene carácter exclusivamente de <strong className="text-white">entretenimiento y reflexión personal</strong>. No representa canalizaciones, lecturas espiritistas ni comunicación con entidades de ningún tipo.</P>
        <P>El pago de 6 € por la lectura completa es un pago único, no reembolsable una vez entregado el contenido al email del usuario.</P>
      </Seccion>

      <Seccion titulo="5. Conducta del usuario">
        <P>Al usar la Plataforma, el usuario se compromete a:</P>
        <Li items={[
          'No utilizar el Sitio para fines ilegales o no autorizados.',
          'No intentar acceder a áreas restringidas del Sitio.',
          'No publicar contenido falso, difamatorio o inapropiado en reseñas.',
          'No suplantar la identidad de otras personas.',
          'No interferir con el funcionamiento técnico del Sitio.',
        ]} />
      </Seccion>

      <Seccion titulo="6. Propiedad intelectual">
        <P>Todo el contenido del Sitio —incluyendo textos, diseños, logotipos, imágenes y código— es propiedad de La Carta Mística o de sus respectivos autores, y está protegido por las leyes de propiedad intelectual. Queda prohibida su reproducción sin autorización expresa.</P>
      </Seccion>

      <Seccion titulo="7. Legislación aplicable">
        <P>Estos términos se rigen por la legislación española. Para cualquier controversia derivada del uso del Sitio, las partes se someten a la jurisdicción de los tribunales de España, con renuncia expresa a cualquier otro fuero.</P>
      </Seccion>

      <Seccion titulo="8. Contacto">
        <P>Para consultas sobre estos términos, podés contactarnos en <a href="mailto:info@cartamistica.com" className="text-purple-400 hover:text-purple-300">info@cartamistica.com</a> o por WhatsApp al <a href="https://wa.me/34910202911" className="text-purple-400 hover:text-purple-300">+34 910 202 911</a>.</P>
      </Seccion>

      <div className="mt-10 pt-6 flex flex-wrap gap-4 text-xs" style={{ borderTop: '1px solid rgba(255,255,255,.06)' }}>
        {[['Política de Privacidad', '/privacidad'], ['Política de Cookies', '/cookies'], ['Aviso Legal', '/aviso-legal']].map(([label, to]) => (
          <Link key={to} to={to} className="text-purple-400/60 hover:text-purple-400 transition-colors">{label}</Link>
        ))}
      </div>
    </LegalPage>
  )
}
