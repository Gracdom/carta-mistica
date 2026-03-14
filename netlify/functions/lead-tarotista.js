const { Resend } = require('resend')

const resend  = new Resend(process.env.RESEND_API_KEY)
const EQUIPO  = 'info@cartamistica.com'
const NOTIF   = 'karen.rivera@gracdom.com'

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

  const { nombre, email, whatsapp, pais, especialidad, experiencia, mensaje } = body

  if (!nombre || !email) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Faltan campos requeridos' }) }
  }

  const filas = [
    ['Nombre',        nombre],
    ['Email',         email],
    ['WhatsApp',      whatsapp || '—'],
    ['País',          pais || '—'],
    ['Especialidad',  especialidad || '—'],
    ['Experiencia',   experiencia || '—'],
  ].map(([k, v]) => `
    <tr>
      <td style="padding:8px 0;color:#9ca3af;font-size:13px;width:120px;">${k}</td>
      <td style="padding:8px 0;color:#ffffff;font-size:14px;">${v}</td>
    </tr>`).join('')

  const baseHtml = (titulo, subtitulo, cuerpo) => `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0b2b;color:#e5e7eb;padding:32px;border-radius:12px;">
      <div style="text-align:center;margin-bottom:24px;">
        <h1 style="color:#a78bfa;font-size:22px;margin:0;">✦ La Carta Mística</h1>
        <p style="color:#6b7280;font-size:13px;margin:4px 0 0;">${subtitulo}</p>
      </div>
      <hr style="border:none;border-top:1px solid #ffffff14;margin:0 0 24px;" />
      ${cuerpo}
      <hr style="border:none;border-top:1px solid #ffffff14;margin:24px 0;" />
      <p style="color:#6b7280;font-size:12px;text-align:center;">
        © 2026 La Carta Mística · <a href="mailto:info@cartamistica.com" style="color:#7c3aed;">info@cartamistica.com</a>
      </p>
    </div>`

  try {
    // 1. Notificación al equipo de Carta Mística
    await resend.emails.send({
      from:    'La Carta Mística <noreply@cartamistica.com>',
      to:      EQUIPO,
      replyTo: email,
      subject: `[Lead Tarotista] ${nombre} — ${especialidad || 'sin especialidad'}`,
      html: baseHtml(
        'Nuevo lead de tarotista',
        'Nueva tarotista interesada en unirse',
        `<h2 style="color:#fff;font-size:17px;margin:0 0 16px;">Nueva solicitud de tarotista 🌟</h2>
         <table style="width:100%;border-collapse:collapse;">${filas}</table>
         ${mensaje ? `<hr style="border:none;border-top:1px solid #ffffff14;margin:20px 0;"/>
           <h3 style="color:#d1d5db;font-size:13px;margin:0 0 10px;">Mensaje</h3>
           <p style="color:#e5e7eb;font-size:14px;line-height:1.7;white-space:pre-wrap;background:#050511;padding:14px;border-radius:8px;border-left:3px solid #7c3aed;">${mensaje}</p>` : ''}
         <a href="mailto:${email}" style="display:inline-block;margin-top:20px;background:#7c3aed;color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:600;">
           Responder a ${nombre}
         </a>`
      ),
    })

    // 2. Notificación a Karen Rivera
    await resend.emails.send({
      from:    'La Carta Mística <noreply@cartamistica.com>',
      to:      NOTIF,
      replyTo: email,
      subject: `[Lead Tarotista] ${nombre} se registró — ${new Date().toLocaleDateString('es-AR')}`,
      html: baseHtml(
        'Nuevo lead de tarotista',
        'Alerta de nuevo lead',
        `<h2 style="color:#fff;font-size:17px;margin:0 0 16px;">¡Nuevo lead de tarotista! 🔔</h2>
         <p style="color:#d1d5db;font-size:14px;line-height:1.7;margin:0 0 16px;">
           <strong style="color:#a78bfa;">${nombre}</strong> acaba de completar el formulario de registro de tarotista en La Carta Mística.
         </p>
         <table style="width:100%;border-collapse:collapse;">${filas}</table>
         ${mensaje ? `<p style="color:#9ca3af;font-size:13px;margin-top:16px;font-style:italic;">"${mensaje}"</p>` : ''}`
      ),
    })

    // 3. Confirmación a la tarotista
    await resend.emails.send({
      from:    'La Carta Mística <noreply@cartamistica.com>',
      to:      email,
      subject: '¡Gracias por tu interés! — La Carta Mística',
      html: baseHtml(
        'Gracias por unirte',
        'Solicitud recibida',
        `<h2 style="color:#ffffff;font-size:18px;margin:0 0 12px;">Hola, ${nombre} ✨</h2>
         <p style="color:#d1d5db;line-height:1.7;font-size:14px;">
           Recibimos tu solicitud para unirte a <strong style="color:#a78bfa;">La Carta Mística</strong> como tarotista.
           Estamos emocionadas de tenerte entre las profesionales que consideramos para nuestra plataforma.
         </p>
         <div style="background:rgba(124,58,237,.12);border:1px solid rgba(139,92,246,.25);border-radius:10px;padding:18px;margin:20px 0;">
           <p style="color:#c4b5fd;font-size:13px;font-weight:600;margin:0 0 8px;">¿Qué sigue?</p>
           <ul style="color:#d1d5db;font-size:13px;line-height:1.8;margin:0;padding-left:18px;">
             <li>Nuestro equipo revisará tu perfil en los próximos 2-3 días hábiles.</li>
             <li>Te contactaremos por email (y WhatsApp si lo dejaste) para los siguientes pasos.</li>
             <li>Si fuiste aprobada, te ayudaremos a configurar tu perfil público.</li>
           </ul>
         </div>
         <p style="color:#9ca3af;font-size:13px;line-height:1.7;margin-top:16px;">
           ¿Tenés alguna pregunta? Escribinos a <a href="mailto:info@cartamistica.com" style="color:#a78bfa;">info@cartamistica.com</a>
           o por WhatsApp al <strong>+34 910 202 911</strong>.
         </p>`
      ),
    })

    return { statusCode: 200, body: JSON.stringify({ ok: true }) }
  } catch (err) {
    console.error('Error Resend lead-tarotista:', err)
    return { statusCode: 500, body: JSON.stringify({ error: 'Error al enviar emails' }) }
  }
}
