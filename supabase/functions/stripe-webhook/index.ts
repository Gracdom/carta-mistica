/**
 * Supabase Edge Function — Stripe Webhook
 * Al confirmar el pago: actualiza la consulta en Supabase y envía la lectura completa por email (Resend).
 *
 * ⚠️ Esta función debe desplegarse con --no-verify-jwt para que Stripe pueda llamarla sin token.
 *    supabase functions deploy stripe-webhook --no-verify-jwt
 *
 * Secrets necesarios (Supabase → Settings → Edge Functions → Secrets):
 *   STRIPE_SECRET_KEY
 *   STRIPE_WEBHOOK_SECRET
 *   RESEND_API_KEY
 *   EMAIL_FROM              (ej: Carta Mística <noreply@cartamistica.com>)
 *
 * Variables automáticas de Supabase (no necesitan configurarse):
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */
import Stripe from 'npm:stripe@14'
import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const sig    = req.headers.get('stripe-signature') ?? ''
  const secret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? ''

  const rawBody = await req.text()

  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
    apiVersion: '2024-06-20',
  })

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, sig, secret)
  } catch (err) {
    console.error('Webhook signature error:', err)
    return new Response(`Webhook Error: ${err}`, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return new Response('Ignored', { status: 200 })
  }

  const session    = event.data.object as Stripe.Checkout.Session
  const consultaId = session.metadata?.consulta_id
  const email      = session.metadata?.email ?? session.customer_email ?? ''
  const nombre     = session.metadata?.nombre ?? 'consultante'

  if (!consultaId || !email) {
    console.error('Missing consultaId or email in metadata')
    return new Response('Missing metadata', { status: 200 })
  }

  // ── Supabase ──────────────────────────────────────────────────────────────
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { data: consulta, error: dbErr } = await supabase
    .from('consultas_akasicas')
    .select('lectura_completa, intenciones')
    .eq('id', consultaId)
    .single()

  if (dbErr || !consulta) {
    console.error('Supabase fetch error:', dbErr)
    return new Response('DB error', { status: 200 })
  }

  await supabase
    .from('consultas_akasicas')
    .update({ estado: 'pagado', stripe_session_id: session.id })
    .eq('id', consultaId)

  // ── Enviar email con Resend ───────────────────────────────────────────────
  const lectura     = consulta.lectura_completa ?? ''
  const intenciones = Array.isArray(consulta.intenciones) ? consulta.intenciones.join(', ') : ''

  const htmlLectura = lectura
    .split('\n')
    .map((line: string) => {
      if (line.startsWith('✦ ')) return `<h3 style="color:#c084fc;margin-top:28px;font-size:17px;">${line}</h3>`
      if (line.trim() === '')   return '<br/>'
      return `<p style="margin:0 0 12px;line-height:1.75;">${line}</p>`
    })
    .join('')

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Tu Lectura de Registros Akáshicos</title></head>
<body style="margin:0;padding:0;background:#030312;font-family:Georgia,serif;color:#e2e0ff;">
  <div style="max-width:620px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:36px;">
      <p style="color:#a78bfa;letter-spacing:.4em;font-size:13px;margin-bottom:8px;">✦ ☽ ✦</p>
      <h1 style="font-size:26px;color:#fff;margin:0 0 8px;">Lectura de Registros Akáshicos</h1>
      <p style="color:#7c6fa0;font-size:14px;margin:0;">Preparada especialmente para <strong style="color:#c084fc;">${nombre}</strong></p>
      ${intenciones ? `<p style="color:#7c6fa0;font-size:13px;margin-top:6px;">Intención: ${intenciones}</p>` : ''}
    </div>
    <div style="background:rgba(109,40,217,.1);border:1px solid rgba(139,92,246,.3);border-radius:16px;padding:28px 24px;margin-bottom:28px;">
      ${htmlLectura}
    </div>
    <div style="text-align:center;border-top:1px solid rgba(139,92,246,.2);padding-top:24px;">
      <p style="color:#7c6fa0;font-size:12px;margin:0;">
        Esta lectura fue generada especialmente para vos.<br/>
        Es confidencial y de uso personal.<br/><br/>
        <strong style="color:#9d8fc4;">Carta Mística</strong> · cartamistica.com
      </p>
    </div>
  </div>
</body>
</html>`

  const resendFrom = Deno.env.get('EMAIL_FROM') ?? 'Carta Mística <noreply@cartamistica.com>'
  const resendKey  = Deno.env.get('RESEND_API_KEY') ?? ''

  const sendEmail = async (to: string, subject: string, htmlBody: string) => {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendKey}` },
      body: JSON.stringify({ from: resendFrom, to: [to], subject, html: htmlBody }),
    })
    if (!res.ok) console.error(`Email error (${to}):`, await res.text())
    else console.log('Email enviado a:', to)
  }

  try {
    // 1. Email al cliente con su lectura completa
    await sendEmail(email, `✦ Tu Lectura de Registros Akáshicos, ${nombre}`, html)

    // 2. Notificación de venta al equipo interno
    const notifEmail = Deno.env.get('NOTIF_EMAIL') ?? 'karen.rivera@gracdom.com'
    const precioTexto = `$${(parseInt(Deno.env.get('PRECIO_LECTURA_CENTAVOS') ?? '1500') / 100).toFixed(2)} ${(Deno.env.get('MONEDA') ?? 'USD').toUpperCase()}`
    const htmlNotif = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">
    <div style="background:linear-gradient(135deg,#6d28d9,#9333ea);padding:24px 28px;">
      <h1 style="color:#fff;margin:0;font-size:20px;">💸 Nueva venta — Carta Mística</h1>
    </div>
    <div style="padding:28px;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:8px 0;color:#6b7280;">Cliente</td>      <td style="padding:8px 0;font-weight:600;color:#111;">${nombre}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;">Email</td>         <td style="padding:8px 0;color:#111;">${email}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;">Intención</td>     <td style="padding:8px 0;color:#111;">${intenciones || '—'}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;">Monto</td>         <td style="padding:8px 0;font-weight:700;color:#7c3aed;">${precioTexto}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;">Consulta ID</td>   <td style="padding:8px 0;font-size:12px;color:#9ca3af;">${consultaId}</td></tr>
      </table>
      <p style="margin:20px 0 0;font-size:13px;color:#9ca3af;">
        La lectura completa fue enviada automáticamente al cliente.<br/>
        Podés ver todos los detalles en el <a href="https://cartamistica.com/admin" style="color:#7c3aed;">panel de administración</a>.
      </p>
    </div>
  </div>
</body>
</html>`
    await sendEmail(notifEmail, `💸 Nueva venta: ${nombre} — ${precioTexto}`, htmlNotif)

  } catch (emailErr) {
    console.error('Email send error:', emailErr)
  }

  return new Response('OK', { status: 200 })
})
