const { Resend } = require('resend')

const resend = new Resend(process.env.RESEND_API_KEY)

const DESTINO = 'info@cartamistica.com'

const ASUNTOS = {
  'consulta-general': 'Consulta general',
  'problema-tecnico': 'Problema técnico',
  'quiero-unirme': 'Quiero unirme como tarotista',
  'reporte-tarotista': 'Reportar una tarotista',
  'privacidad': 'Privacidad y datos',
  'otro': 'Otro',
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Método no permitido' }) }
  }

  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'JSON inválido' }) }
  }

  const { nombre, email, asunto, mensaje } = body

  if (!nombre || !email || !asunto || !mensaje) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Faltan campos requeridos' }) }
  }

  const asuntoLabel = ASUNTOS[asunto] || asunto

  try {
    // Email de notificación al equipo
    await resend.emails.send({
      from: 'La Carta Mística <noreply@cartamistica.com>',
      to: DESTINO,
      replyTo: email,
      subject: `[Soporte] ${asuntoLabel} — ${nombre}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d0b2b; color: #e5e7eb; padding: 32px; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #a78bfa; font-size: 22px; margin: 0;">La Carta Mística</h1>
            <p style="color: #6b7280; font-size: 13px; margin: 4px 0 0;">Nuevo mensaje de soporte</p>
          </div>
          <hr style="border: none; border-top: 1px solid #ffffff14; margin: 0 0 24px;" />
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #9ca3af; font-size: 13px; width: 100px;">Nombre</td>
              <td style="padding: 8px 0; color: #ffffff; font-size: 14px;">${nombre}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9ca3af; font-size: 13px;">Email</td>
              <td style="padding: 8px 0; color: #ffffff; font-size: 14px;"><a href="mailto:${email}" style="color: #a78bfa;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9ca3af; font-size: 13px;">Asunto</td>
              <td style="padding: 8px 0; color: #ffffff; font-size: 14px;">${asuntoLabel}</td>
            </tr>
          </table>
          <hr style="border: none; border-top: 1px solid #ffffff14; margin: 24px 0;" />
          <h3 style="color: #d1d5db; font-size: 14px; margin: 0 0 12px;">Mensaje</h3>
          <p style="color: #e5e7eb; font-size: 14px; line-height: 1.7; white-space: pre-wrap; background: #050511; padding: 16px; border-radius: 8px; border-left: 3px solid #7c3aed;">${mensaje}</p>
          <p style="color: #6b7280; font-size: 12px; margin-top: 24px; text-align: center;">
            Podés responder directamente a este correo para contactar a ${nombre}.
          </p>
        </div>
      `,
    })

    // Email de confirmación al usuario
    await resend.emails.send({
      from: 'La Carta Mística <noreply@cartamistica.com>',
      to: email,
      subject: 'Recibimos tu mensaje — La Carta Mística',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d0b2b; color: #e5e7eb; padding: 32px; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #a78bfa; font-size: 22px; margin: 0;">✦ La Carta Mística</h1>
          </div>
          <hr style="border: none; border-top: 1px solid #ffffff14; margin: 0 0 24px;" />
          <h2 style="color: #ffffff; font-size: 18px; margin: 0 0 12px;">Hola, ${nombre} 👋</h2>
          <p style="color: #d1d5db; line-height: 1.7; font-size: 14px;">
            Recibimos tu mensaje sobre <strong style="color: #a78bfa;">${asuntoLabel}</strong> y te responderemos a la brevedad, en menos de 24 horas hábiles.
          </p>
          <p style="color: #9ca3af; font-size: 13px; line-height: 1.7; margin-top: 16px;">
            Si tenés alguna consulta urgente podés escribirnos por WhatsApp al <strong>+34 910 202 911</strong>.
          </p>
          <hr style="border: none; border-top: 1px solid #ffffff14; margin: 24px 0;" />
          <p style="color: #6b7280; font-size: 12px; text-align: center;">
            © 2026 La Carta Mística · <a href="mailto:info@cartamistica.com" style="color: #7c3aed;">info@cartamistica.com</a>
          </p>
        </div>
      `,
    })

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    }
  } catch (err) {
    console.error('Error Resend:', err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al enviar el correo' }),
    }
  }
}
