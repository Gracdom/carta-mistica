import { Link } from 'react-router-dom'
import { LegalPage, Seccion, P, Li } from '../components/LegalLayout'

export default function AvisoLegal() {
  return (
    <LegalPage titulo="Aviso Legal" ultimaActualizacion="1 de marzo de 2026">

      <Seccion titulo="1. Identificación del titular">
        <div className="space-y-1.5 text-sm">
          {[
            ['Denominación', 'La Carta Mística'],
            ['Actividad', 'Directorio de tarotistas y servicios de orientación espiritual online'],
            ['Email de contacto', 'info@cartamistica.com'],
            ['Teléfono', '+34 910 202 911 (solo WhatsApp)'],
            ['Sitio web', 'cartamistica.com'],
          ].map(([label, val]) => (
            <div key={label} className="flex gap-3">
              <span className="text-white/30 flex-shrink-0 w-36">{label}:</span>
              <span className="text-gray-400">{val}</span>
            </div>
          ))}
        </div>
      </Seccion>

      <Seccion titulo="2. Objeto y ámbito de aplicación">
        <P>El presente Aviso Legal regula el acceso y uso del sitio web <strong className="text-white">cartamistica.com</strong> y todos sus subdominios. El acceso al Sitio implica la aceptación plena y sin reservas de las disposiciones contenidas en este Aviso Legal.</P>
      </Seccion>

      <Seccion titulo="3. Condiciones de acceso y uso">
        <P>El usuario se compromete a hacer un uso diligente del Sitio y a no emplearlo para actividades contrarias a la ley, la moral, el orden público o que puedan causar daño a La Carta Mística o a terceros.</P>
        <P>Queda expresamente prohibido:</P>
        <Li items={[
          'Reproducir, distribuir o comunicar públicamente cualquier contenido del Sitio sin autorización.',
          'Llevar a cabo acciones que puedan dañar, sobrecargar o deteriorar los sistemas del Sitio.',
          'Utilizar el Sitio para enviar comunicaciones comerciales no solicitadas (spam).',
          'Intentar acceder a datos de otros usuarios o a áreas restringidas del Sitio.',
        ]} />
      </Seccion>

      <Seccion titulo="4. Propiedad intelectual e industrial">
        <P>Todos los derechos de propiedad intelectual sobre los contenidos del Sitio —incluyendo, sin limitación, textos, diseño gráfico, logotipos, imágenes, código fuente, base de datos y software— pertenecen a La Carta Mística o a sus licenciantes.</P>
        <P>Queda estrictamente prohibida la reproducción, distribución, comunicación pública o transformación de dichos contenidos sin la autorización expresa y por escrito del titular.</P>
      </Seccion>

      <Seccion titulo="5. Exclusión de garantías y responsabilidad">
        <P>La Carta Mística no garantiza la disponibilidad continua del Sitio ni la ausencia de errores en los contenidos. Los servicios de orientación espiritual y tarot ofrecidos en la Plataforma son de naturaleza subjetiva y no constituyen:</P>
        <Li items={[
          'Asesoramiento médico, psicológico ni de salud mental.',
          'Asesoramiento jurídico ni legal.',
          'Asesoramiento financiero ni de inversiones.',
          'Predicciones con certeza científica.',
        ]} />
        <P>La Carta Mística no asume ninguna responsabilidad por los daños y perjuicios que pudieran derivarse de la utilización de la información, contenidos o servicios del Sitio.</P>
      </Seccion>

      <Seccion titulo="6. Links a terceros">
        <P>El Sitio puede contener enlaces a páginas web de terceros. La Carta Mística no controla ni es responsable de los contenidos, políticas de privacidad o prácticas de dichos sitios externos. La inclusión de cualquier enlace no implica aprobación del sitio enlazado.</P>
      </Seccion>

      <Seccion titulo="7. Legislación y jurisdicción aplicable">
        <P>Este Aviso Legal se rige íntegramente por la legislación española, en particular por:</P>
        <Li items={[
          'Ley 34/2002, de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI-CE).',
          'Ley Orgánica 3/2018 de Protección de Datos Personales y Garantía de Derechos Digitales (LOPDGDD).',
          'Reglamento (UE) 2016/679 General de Protección de Datos (RGPD).',
          'Real Decreto Legislativo 1/1996, Ley de Propiedad Intelectual.',
        ]} />
        <P>Para la resolución de cualquier conflicto derivado de la interpretación o aplicación de este Aviso Legal, las partes se someten a los Juzgados y Tribunales de España, con renuncia a cualquier otro fuero que pudiera corresponderles.</P>
      </Seccion>

      <Seccion titulo="8. Contacto">
        <P>Para cualquier consulta legal, podés contactarnos en <a href="mailto:info@cartamistica.com" className="text-purple-400 hover:text-purple-300">info@cartamistica.com</a>.</P>
      </Seccion>

      <div className="mt-10 pt-6 flex flex-wrap gap-4 text-xs" style={{ borderTop: '1px solid rgba(255,255,255,.06)' }}>
        {[['Términos y Condiciones', '/terminos'], ['Política de Privacidad', '/privacidad'], ['Política de Cookies', '/cookies']].map(([label, to]) => (
          <Link key={to} to={to} className="text-purple-400/60 hover:text-purple-400 transition-colors">{label}</Link>
        ))}
      </div>
    </LegalPage>
  )
}
