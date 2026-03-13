/**
 * Netlify Function — Stripe Webhook
 * Escucha checkout.session.completed → lee la lectura completa de Supabase
 * y la envía por email al cliente usando Resend.
 *
 * Variables de entorno necesarias:
 *   STRIPE_WEBHOOK_SECRET  — secret del webhook en el dashboard de Stripe
 *   STRIPE_SECRET_KEY      — clave secreta de Stripe
 *   SUPABASE_URL           — URL de Supabase (sin VITE_ — server-side)
 *   SUPABASE_SERVICE_KEY   — service role key (bypassa RLS)
 *   RESEND_API_KEY         — clave de Resend para envío de emails
 *   EMAIL_FROM             — dirección remitente, ej: "Carta Mística <noreply@cartamistica.com>"
 */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { createClient } = require('@supabase/supabase-js')

exports.handler = async function (event) {
  const sig     = event.headers['stripe-signature']
  const secret  = process.env.STRIPE_WEBHOOK_SECRET

  let stripeEvent
  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, secret)
  } catch (err) {
    console.error('Webhook signature error:', err.message)
    return { statusCode: 400, body: `Webhook Error: ${err.message}` }
  }

  if (stripeEvent.type !== 'checkout.session.completed') {
    return { statusCode: 200, body: 'Ignored' }
  }

  const session    = stripeEvent.data.object
  const consultaId = session.metadata?.consulta_id
  const email      = session.metadata?.email || session.customer_email
  const nombre     = session.metadata?.nombre || 'consultante'

  if (!consultaId || !email) {
    console.error('Missing consultaId or email in metadata')
    return { statusCode: 200, body: 'Missing metadata' }
  }

  // ── Supabase ──────────────────────────────────────────────────────────────
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )

  const { data: consulta, error: dbErr } = await supabase
    .from('consultas_akasicas')
    .select('lectura_completa, nombre, intenciones')
    .eq('id', consultaId)
    .single()

  if (dbErr || !consulta) {
    console.error('Supabase fetch error:', dbErr)
    return { statusCode: 200, body: 'DB error - not blocking webhook' }
  }

  // Marcar como pagado
  await supabase
    .from('consultas_akasicas')
    .update({ estado: 'pagado', stripe_session_id: session.id })
    .eq('id', consultaId)

  // ── Enviar email con Resend ───────────────────────────────────────────────
  const lectura   = consulta.lectura_completa || ''
  const intenciones = Array.isArray(consulta.intenciones) ? consulta.intenciones.join(', ') : ''

  const htmlLectura = lectura
    .split('\n')
    .map(line => {
      if (line.startsWith('✦ ')) return `<h3 style="color:#c084fc;margin-top:28px;font-size:17px;">${line}</h3>`
      if (line.trim() === '') return '<br/>'
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

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from:    process.env.EMAIL_FROM || 'Carta Mística <noreply@cartamistica.com>',
        to:      [email],
        subject: `✦ Tu Lectura de Registros Akáshicos, ${nombre}`,
        html,
      }),
    })

    if (!resendRes.ok) {
      const errText = await resendRes.text()
      console.error('Resend error:', errText)
    } else {
      console.log('Email enviado a:', email)
    }
  } catch (emailErr) {
    console.error('Email send error:', emailErr)
  }

  return { statusCode: 200, body: 'OK' }
}
