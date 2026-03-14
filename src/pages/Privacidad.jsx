import { Link } from 'react-router-dom'
import { LegalPage, Seccion, P, Li } from '../components/LegalLayout'

export default function Privacidad() {
  return (
    <LegalPage titulo="Política de Privacidad" ultimaActualizacion="1 de marzo de 2026">

      <Seccion titulo="1. Responsable del tratamiento">
        <P>El responsable del tratamiento de los datos personales recogidos a través de <strong className="text-white">cartamistica.com</strong> es La Carta Mística, con email de contacto <a href="mailto:info@cartamistica.com" className="text-purple-400 hover:text-purple-300">info@cartamistica.com</a>.</P>
      </Seccion>

      <Seccion titulo="2. Datos que recopilamos">
        <P>Recopilamos los siguientes datos personales según el servicio utilizado:</P>
        <Li items={[
          'Nombre completo y fecha de nacimiento (para el servicio de Registro Akáshico).',
          'Dirección de correo electrónico (para envío de lecturas y comunicaciones).',
          'Ciudad o país de nacimiento (opcional, para el servicio de Registro Akáshico).',
          'Datos de pago procesados por Stripe (no almacenamos datos de tarjeta).',
          'Datos de navegación mediante cookies técnicas y analíticas.',
        ]} />
      </Seccion>

      <Seccion titulo="3. Finalidad del tratamiento">
        <P>Usamos tus datos para:</P>
        <Li items={[
          'Prestar los servicios solicitados (lecturas de Registros Akáshicos, directorio de tarotistas).',
          'Enviar la lectura completa al email indicado tras el pago.',
          'Responder a consultas y solicitudes de soporte.',
          'Gestionar el proceso de pago de forma segura a través de Stripe.',
          'Mejorar la experiencia de usuario y analizar el uso del Sitio.',
        ]} />
      </Seccion>

      <Seccion titulo="4. Base legal">
        <P>El tratamiento de tus datos se basa en:</P>
        <Li items={[
          'Tu consentimiento explícito al completar formularios en el Sitio.',
          'La ejecución del contrato de prestación del servicio solicitado.',
          'Nuestro interés legítimo en mejorar el servicio y prevenir fraudes.',
        ]} />
      </Seccion>

      <Seccion titulo="5. Conservación de datos">
        <P>Conservamos tus datos personales durante el tiempo necesario para cumplir con la finalidad para la que fueron recogidos. Los datos de consultas de Registro Akáshico se conservan durante 2 años desde su creación, salvo solicitud de eliminación previa.</P>
      </Seccion>

      <Seccion titulo="6. Destinatarios y transferencias">
        <P>No vendemos ni cedemos tus datos a terceros. Compartimos datos únicamente con los siguientes proveedores de servicios necesarios para el funcionamiento de la plataforma:</P>
        <Li items={[
          'Stripe Inc. — procesamiento de pagos (política en stripe.com/es/privacy).',
          'Supabase Inc. — almacenamiento seguro en base de datos.',
          'Resend Inc. — envío de emails transaccionales.',
        ]} />
        <P>Todos los proveedores operan bajo contratos de tratamiento de datos conforme al RGPD.</P>
      </Seccion>

      <Seccion titulo="7. Tus derechos">
        <P>Conforme al RGPD (Reglamento General de Protección de Datos), tienes derecho a:</P>
        <Li items={[
          'Acceder a los datos personales que tenemos sobre ti.',
          'Rectificar datos inexactos o incompletos.',
          'Solicitar la eliminación de tus datos ("derecho al olvido").',
          'Oponerte al tratamiento o solicitar su limitación.',
          'Solicitar la portabilidad de tus datos.',
          'Retirar tu consentimiento en cualquier momento.',
        ]} />
        <P>Para ejercer cualquiera de estos derechos, escríbenos a <a href="mailto:info@cartamistica.com" className="text-purple-400 hover:text-purple-300">info@cartamistica.com</a>. Responderemos en un plazo máximo de 30 días.</P>
        <P>También tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) en <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">aepd.es</a>.</P>
      </Seccion>

      <Seccion titulo="8. Seguridad">
        <P>Implementamos medidas técnicas y organizativas adecuadas para proteger tus datos contra acceso no autorizado, pérdida o alteración. Las comunicaciones con el Sitio están cifradas mediante HTTPS/TLS.</P>
      </Seccion>

      <Seccion titulo="9. Cookies">
        <P>Utilizamos cookies propias y de terceros. Para más información, consultá nuestra <Link to="/cookies" className="text-purple-400 hover:text-purple-300">Política de Cookies</Link>.</P>
      </Seccion>

      <div className="mt-10 pt-6 flex flex-wrap gap-4 text-xs" style={{ borderTop: '1px solid rgba(255,255,255,.06)' }}>
        {[['Términos y Condiciones', '/terminos'], ['Política de Cookies', '/cookies'], ['Aviso Legal', '/aviso-legal']].map(([label, to]) => (
          <Link key={to} to={to} className="text-purple-400/60 hover:text-purple-400 transition-colors">{label}</Link>
        ))}
      </div>
    </LegalPage>
  )
}
