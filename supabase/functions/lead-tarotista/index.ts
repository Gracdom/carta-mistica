/**
 * Supabase Edge Function — lead-tarotista
 * Envía 3 correos via Resend cuando una tarotista se registra:
 *   1. Notificación a info@cartamistica.com
 *   2. Notificación a karen.rivera@gracdom.com
 *   3. Confirmación a la tarotista
 *
 * Secrets requeridos (Supabase → Settings → Edge Functions → Secrets):
 *   RESEND_API_KEY
 *   EMAIL_FROM  (ej: "La Carta Mística <info@cartamistica.com>")
 */
import { corsHeaders } from '../_shared/cors.ts'

const EQUIPO    = 'info@cartamistica.com'
const NOTIF     = 'karen.rivera@gracdom.com'
const resendKey = Deno.env.get('RESEND_API_KEY') ?? ''
const fromAddr  = Deno.env.get('EMAIL_FROM') ?? 'La Carta Mística <info@cartamistica.com>'

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendKey}` },
    body: JSON.stringify({ from: fromAddr, to: [to], subject, html }),
  })
  if (!res.ok) {
    const text = await res.text()
    console.error(`Resend error (${to}):`, text)
    throw new Error(text)
  }
}

function baseHtml(subtitulo: string, cuerpo: string) {
  return `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0b2b;color:#e5e7eb;padding:32px;border-radius:12px;">
    <div style="text-align:center;margin-bottom:24px;">
      <h1 style="color:#a78bfa;font-size:22px;margin:0;">✦ La Carta Mística</h1>
      <p style="color:#6b7280;font-size:13px;margin:4px 0 0;">${subtitulo}</p>
    </div>
    <hr style="border:none;border-top:1px solid #ffffff14;margin:0 0 24px;">
    ${cuerpo}
    <hr style="border:none;border-top:1px solid #ffffff14;margin:24px 0;">
    <p style="color:#6b7280;font-size:12px;text-align:center;">
      © 2026 La Carta Mística · <a href="mailto:info@cartamistica.com" style="color:#7c3aed;">info@cartamistica.com</a>
    </p>
  </div>`
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return new Response('Método no permitido', { status: 405, headers: corsHeaders })

  let body: Record<string, string>
  try { body = await req.json() } catch {
    return new Response(JSON.stringify({ error: 'JSON inválido' }), { status: 400, headers: corsHeaders })
  }

  const { nombre, email, whatsapp, pais, especialidad, experiencia, mensaje } = body

  if (!nombre || !email) {
    return new Response(JSON.stringify({ error: 'Faltan campos requeridos' }), { status: 400, headers: corsHeaders })
  }

  const filas = [
    ['Nombre',       nombre],
    ['Email',        email],
    ['WhatsApp',     whatsapp  || '—'],
    ['País',         pais      || '—'],
    ['Especialidad', especialidad || '—'],
    ['Experiencia',  experiencia  || '—'],
  ].map(([k, v]) => `
    <tr>
      <td style="padding:8px 0;color:#9ca3af;font-size:13px;width:120px;">${k}</td>
      <td style="padding:8px 0;color:#ffffff;font-size:14px;">${v}</td>
    </tr>`).join('')

  try {
    // 1. Notificación al equipo
    await sendEmail(
      EQUIPO,
      `[Lead Tarotista] ${nombre} — ${especialidad || 'sin especialidad'}`,
      baseHtml('Nueva tarotista interesada en unirse', `
        <h2 style="color:#fff;font-size:17px;margin:0 0 16px;">Nueva solicitud de tarotista 🌟</h2>
        <table style="width:100%;border-collapse:collapse;">${filas}</table>
        ${mensaje ? `
          <hr style="border:none;border-top:1px solid #ffffff14;margin:20px 0;">
          <h3 style="color:#d1d5db;font-size:13px;margin:0 0 10px;">Mensaje</h3>
          <p style="color:#e5e7eb;font-size:14px;line-height:1.7;white-space:pre-wrap;background:#050511;padding:14px;border-radius:8px;border-left:3px solid #7c3aed;">${mensaje}</p>` : ''}
        <a href="mailto:${email}" style="display:inline-block;margin-top:20px;background:#7c3aed;color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:600;">
          Responder a ${nombre}
        </a>`)
    )

    // 2. Notificación a Karen
    await sendEmail(
      NOTIF,
      `[Lead Tarotista] ${nombre} se registró — ${new Date().toLocaleDateString('es-ES')}`,
      baseHtml('Alerta de nuevo lead', `
        <h2 style="color:#fff;font-size:17px;margin:0 0 16px;">¡Nuevo lead de tarotista! 🔔</h2>
        <p style="color:#d1d5db;font-size:14px;line-height:1.7;margin:0 0 16px;">
          <strong style="color:#a78bfa;">${nombre}</strong> acaba de completar el formulario de registro en La Carta Mística.
        </p>
        <table style="width:100%;border-collapse:collapse;">${filas}</table>
        ${mensaje ? `<p style="color:#9ca3af;font-size:13px;margin-top:16px;font-style:italic;">"${mensaje}"</p>` : ''}`)
    )

    // 3. Confirmación a la tarotista
    await sendEmail(
      email,
      '¡Gracias por tu interés! — La Carta Mística',
      baseHtml('Solicitud recibida', `
        <h2 style="color:#ffffff;font-size:18px;margin:0 0 12px;">Hola, ${nombre} ✨</h2>
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
        <p style="color:#9ca3af;font-size:13px;line-height:1.7;">
          ¿Tenés preguntas? Escribinos a <a href="mailto:info@cartamistica.com" style="color:#a78bfa;">info@cartamistica.com</a>
          o por WhatsApp al <strong>+34 910 202 911</strong>.
        </p>`)
    )

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: corsHeaders })
  } catch (err) {
    console.error('lead-tarotista error:', err)
    return new Response(JSON.stringify({ error: 'Error al enviar emails' }), { status: 500, headers: corsHeaders })
  }
})
