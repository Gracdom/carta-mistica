/**
 * Supabase Edge Function — lead-tarotista
 * Envía 3 correos via Resend cuando una tarotista se registra:
 *   1. Notificación interna a info@cartamistica.com  (asunto con [Lead Tarotista])
 *   2. Notificación interna a karen.rivera@gracdom.com
 *   3. Bienvenida esotérica al email del cliente
 *
 * FROM siempre: info@cartamistica.com
 * Secrets: RESEND_API_KEY, EMAIL_FROM
 */
import { corsHeaders } from '../_shared/cors.ts'

const EQUIPO    = 'info@cartamistica.com'
const NOTIF     = 'karen.rivera@gracdom.com'
const resendKey = Deno.env.get('RESEND_API_KEY') ?? ''
const fromAddr  = Deno.env.get('EMAIL_FROM') ?? 'La Carta Mística <info@cartamistica.com>'

async function sendEmail(to: string, subject: string, html: string, replyTo?: string) {
  const payload: Record<string, unknown> = { from: fromAddr, to: [to], subject, html }
  if (replyTo) payload.reply_to = [replyTo]
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendKey}` },
    body: JSON.stringify(payload),
  })
  const resText = await res.text()
  if (!res.ok) {
    console.error(`Resend error (${to}) [${res.status}]:`, resText)
    throw new Error(`Resend ${res.status}: ${resText}`)
  }
  console.log(`Email OK -> ${to}`)
}

function adminHtml(subtitulo: string, cuerpo: string) {
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

function clienteHtml(nombre: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#030312;font-family:Georgia,serif;color:#e2e0ff;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:36px;">
      <p style="color:#a78bfa;letter-spacing:.5em;font-size:14px;margin:0 0 8px;">✦ ☽ ✦</p>
      <h1 style="font-size:26px;color:#ffffff;margin:0 0 8px;font-family:Georgia,serif;">El universo recibió tu señal</h1>
      <p style="color:#7c6fa0;font-size:14px;margin:0;">La Carta Mística · Portal de Tarotistas</p>
    </div>
    <div style="background:linear-gradient(135deg,rgba(109,40,217,.18),rgba(139,92,246,.08));border:1px solid rgba(139,92,246,.3);border-radius:16px;padding:28px 24px;margin-bottom:24px;">
      <p style="color:#c4b5fd;font-size:15px;line-height:1.8;margin:0 0 18px;">
        Hola, <strong style="color:#ffffff;">${nombre}</strong> ✨
      </p>
      <p style="color:#d1d5db;font-size:14px;line-height:1.8;margin:0 0 16px;">
        Tu energía ha llegado hasta nosotros. Recibimos tu solicitud para unirte a
        <strong style="color:#a78bfa;">La Carta Mística</strong> como guía espiritual y
        ya está siendo revisada por nuestro equipo.
      </p>
      <p style="color:#9ca3af;font-size:14px;line-height:1.8;margin:0;font-style:italic;">
        "Cada alma que guía a otra, primero debió encontrar su propio camino."
      </p>
    </div>
    <div style="background:rgba(255,255,255,.03);border:1px solid rgba(139,92,246,.15);border-radius:12px;padding:20px 24px;margin-bottom:24px;">
      <p style="color:#c4b5fd;font-size:13px;font-weight:600;margin:0 0 14px;letter-spacing:.05em;">LO QUE VIENE AHORA</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 0;vertical-align:top;width:28px;color:#a78bfa;font-size:16px;">✦</td>
          <td style="padding:8px 0;color:#d1d5db;font-size:13px;line-height:1.7;">Nuestro equipo revisará tu perfil en los próximos <strong style="color:#fff;">2 a 3 días hábiles</strong>.</td>
        </tr>
        <tr>
          <td style="padding:8px 0;vertical-align:top;color:#a78bfa;font-size:16px;">✦</td>
          <td style="padding:8px 0;color:#d1d5db;font-size:13px;line-height:1.7;">Te contactaremos por email para los siguientes pasos del proceso.</td>
        </tr>
        <tr>
          <td style="padding:8px 0;vertical-align:top;color:#a78bfa;font-size:16px;">✦</td>
          <td style="padding:8px 0;color:#d1d5db;font-size:13px;line-height:1.7;">Si eres seleccionada, te ayudaremos a crear tu perfil público en la plataforma.</td>
        </tr>
      </table>
    </div>
    <p style="color:#6b7280;font-size:13px;line-height:1.7;text-align:center;margin:0 0 8px;">
      ¿Tienes alguna pregunta? Estamos aquí para ti.
    </p>
    <p style="text-align:center;margin:0 0 32px;">
      <a href="https://wa.me/34910202911" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#fff;text-decoration:none;padding:12px 28px;border-radius:50px;font-size:14px;font-weight:600;font-family:Arial,sans-serif;">
        Escribirnos por WhatsApp
      </a>
    </p>
    <div style="text-align:center;border-top:1px solid rgba(139,92,246,.15);padding-top:24px;">
      <p style="color:#4c3775;font-size:12px;margin:0;">
        © 2026 La Carta Mística ·
        <a href="mailto:info@cartamistica.com" style="color:#7c6fa0;">info@cartamistica.com</a>
      </p>
    </div>
  </div>
</body>
</html>`
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

  console.log(`Procesando lead: ${nombre} <${email}>`)
  console.log(`EMAIL_FROM: ${fromAddr}`)
  console.log(`RESEND_API_KEY presente: ${resendKey ? 'SI' : 'NO'}`)

  const filas = [
    ['Nombre',       nombre],
    ['Email',        email],
    ['WhatsApp',     whatsapp     || '—'],
    ['País',         pais         || '—'],
    ['Especialidad', especialidad || '—'],
    ['Experiencia',  experiencia  || '—'],
  ].map(([k, v]) => `
    <tr>
      <td style="padding:8px 0;color:#9ca3af;font-size:13px;width:120px;">${k}</td>
      <td style="padding:8px 0;color:#ffffff;font-size:14px;">${v}</td>
    </tr>`).join('')

  const errors: string[] = []

  // 1. Notificación interna al equipo
  try {
    await sendEmail(
      EQUIPO,
      `[Lead Tarotista] ${nombre} — ${especialidad || 'sin especialidad'}`,
      adminHtml('Nueva tarotista interesada en unirse', `
        <h2 style="color:#fff;font-size:17px;margin:0 0 16px;">Nueva solicitud de tarotista 🌟</h2>
        <table style="width:100%;border-collapse:collapse;">${filas}</table>
        ${mensaje ? `
          <hr style="border:none;border-top:1px solid #ffffff14;margin:20px 0;">
          <h3 style="color:#d1d5db;font-size:13px;margin:0 0 10px;">Mensaje</h3>
          <p style="color:#e5e7eb;font-size:14px;line-height:1.7;white-space:pre-wrap;background:#050511;padding:14px;border-radius:8px;border-left:3px solid #7c3aed;">${mensaje}</p>` : ''}
        <a href="mailto:${email}" style="display:inline-block;margin-top:20px;background:#7c3aed;color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:600;">
          Responder a ${nombre}
        </a>`),
      email
    )
  } catch (e) { errors.push(`equipo: ${e}`) }

  // Pausa para no exceder rate limit de Resend (2 req/seg)
  await new Promise(r => setTimeout(r, 600))

  // 2. Notificación a Karen
  try {
    await sendEmail(
      NOTIF,
      `[Lead Tarotista] ${nombre} se registró — ${new Date().toLocaleDateString('es-ES')}`,
      adminHtml('Alerta de nuevo lead', `
        <h2 style="color:#fff;font-size:17px;margin:0 0 16px;">¡Nuevo lead de tarotista! 🔔</h2>
        <p style="color:#d1d5db;font-size:14px;line-height:1.7;margin:0 0 16px;">
          <strong style="color:#a78bfa;">${nombre}</strong> acaba de completar el formulario.
        </p>
        <table style="width:100%;border-collapse:collapse;">${filas}</table>
        ${mensaje ? `<p style="color:#9ca3af;font-size:13px;margin-top:16px;font-style:italic;">"${mensaje}"</p>` : ''}`),
      email
    )
  } catch (e) { errors.push(`karen: ${e}`) }

  // Pausa para no exceder rate limit de Resend
  await new Promise(r => setTimeout(r, 600))

  // 3. Bienvenida esotérica al cliente
  try {
    await sendEmail(
      email,
      `${nombre}, el universo recibió tu señal ✦`,
      clienteHtml(nombre)
    )
  } catch (e) { errors.push(`cliente: ${e}`) }

  if (errors.length === 3) {
    // Todos fallaron — devolver error con detalle
    return new Response(JSON.stringify({ error: errors.join(' | ') }), { status: 500, headers: corsHeaders })
  }

  // Al menos uno llegó — devolver ok con advertencias si las hay
  return new Response(JSON.stringify({ ok: true, warnings: errors.length ? errors : undefined }), { status: 200, headers: corsHeaders })
})
