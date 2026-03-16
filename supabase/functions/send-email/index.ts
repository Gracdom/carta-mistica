/**
 * Supabase Edge Function — send-email
 * Recibe el formulario de Soporte y envía dos correos via Resend:
 *   1. Notificación al equipo (info@cartamistica.com)
 *   2. Confirmación al usuario
 *
 * Secrets requeridos (Supabase → Settings → Edge Functions → Secrets):
 *   RESEND_API_KEY
 *   EMAIL_FROM  (ej: "La Carta Mística <info@cartamistica.com>")
 */
import { corsHeaders } from '../_shared/cors.ts'

const DESTINO   = 'info@cartamistica.com'
const resendKey = Deno.env.get('RESEND_API_KEY') ?? ''
const fromAddr  = Deno.env.get('EMAIL_FROM') ?? 'La Carta Mística <info@cartamistica.com>'

const ASUNTOS: Record<string, string> = {
  'consulta-general':   'Consulta general',
  'problema-tecnico':   'Problema técnico',
  'quiero-unirme':      'Quiero unirme como tarotista',
  'reporte-tarotista':  'Reportar una tarotista',
  'privacidad':         'Privacidad y datos',
  'otro':               'Otro',
}

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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return new Response('Método no permitido', { status: 405, headers: corsHeaders })

  let body: { nombre?: string; email?: string; asunto?: string; mensaje?: string }
  try { body = await req.json() } catch {
    return new Response(JSON.stringify({ error: 'JSON inválido' }), { status: 400, headers: corsHeaders })
  }

  const { nombre, email, asunto, mensaje } = body
  if (!nombre || !email || !asunto || !mensaje) {
    return new Response(JSON.stringify({ error: 'Faltan campos requeridos' }), { status: 400, headers: corsHeaders })
  }

  const asuntoLabel = ASUNTOS[asunto] ?? asunto

  const baseStyle = `font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0b2b;color:#e5e7eb;padding:32px;border-radius:12px;`

  try {
    // 1. Notificación al equipo
    await sendEmail(DESTINO, `[Soporte] ${asuntoLabel} — ${nombre}`, `
      <div style="${baseStyle}">
        <h1 style="color:#a78bfa;font-size:22px;margin:0 0 4px;">La Carta Mística</h1>
        <p style="color:#6b7280;font-size:13px;margin:0 0 24px;">Nuevo mensaje de soporte</p>
        <hr style="border:none;border-top:1px solid #ffffff14;margin:0 0 20px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:7px 0;color:#9ca3af;font-size:13px;width:100px;">Nombre</td><td style="padding:7px 0;color:#fff;font-size:14px;">${nombre}</td></tr>
          <tr><td style="padding:7px 0;color:#9ca3af;font-size:13px;">Email</td><td style="padding:7px 0;font-size:14px;"><a href="mailto:${email}" style="color:#a78bfa;">${email}</a></td></tr>
          <tr><td style="padding:7px 0;color:#9ca3af;font-size:13px;">Asunto</td><td style="padding:7px 0;color:#fff;font-size:14px;">${asuntoLabel}</td></tr>
        </table>
        <hr style="border:none;border-top:1px solid #ffffff14;margin:20px 0;">
        <h3 style="color:#d1d5db;font-size:14px;margin:0 0 10px;">Mensaje</h3>
        <p style="color:#e5e7eb;font-size:14px;line-height:1.7;white-space:pre-wrap;background:#050511;padding:16px;border-radius:8px;border-left:3px solid #7c3aed;">${mensaje}</p>
        <p style="color:#6b7280;font-size:12px;margin-top:20px;text-align:center;">Podés responder directamente a este correo para contactar a ${nombre}.</p>
      </div>`)

    // Pausa para no exceder rate limit de Resend (2 req/seg)
    await new Promise(r => setTimeout(r, 600))

    // 2. Confirmación al usuario
    await sendEmail(email, 'Recibimos tu mensaje — La Carta Mística', `
      <div style="${baseStyle}">
        <h1 style="color:#a78bfa;font-size:22px;margin:0 0 24px;text-align:center;">✦ La Carta Mística</h1>
        <hr style="border:none;border-top:1px solid #ffffff14;margin:0 0 20px;">
        <h2 style="color:#ffffff;font-size:18px;margin:0 0 12px;">Hola, ${nombre} 👋</h2>
        <p style="color:#d1d5db;line-height:1.7;font-size:14px;">
          Recibimos tu mensaje sobre <strong style="color:#a78bfa;">${asuntoLabel}</strong> y te responderemos a la brevedad, en menos de 24 horas hábiles.
        </p>
        <p style="color:#9ca3af;font-size:13px;line-height:1.7;margin-top:14px;">
          Si tenés alguna consulta urgente podés escribirnos por WhatsApp al <strong>+34 910 202 911</strong>.
        </p>
        <hr style="border:none;border-top:1px solid #ffffff14;margin:24px 0;">
        <p style="color:#6b7280;font-size:12px;text-align:center;">© 2026 La Carta Mística · <a href="mailto:info@cartamistica.com" style="color:#7c3aed;">info@cartamistica.com</a></p>
      </div>`)

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: corsHeaders })
  } catch (err) {
    console.error('send-email error:', err)
    return new Response(JSON.stringify({ error: 'Error al enviar el correo' }), { status: 500, headers: corsHeaders })
  }
})
