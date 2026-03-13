/**
 * Netlify Function — Crear sesión de pago con Stripe
 * Recibe: { consultaId, email, nombre }
 * Devuelve: { url } — URL de la página de pago de Stripe
 */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.handler = async function (event) {
  const origin = event.headers.origin || event.headers.Origin || 'https://cartamistica.com'
  const CORS = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' }
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method Not Allowed' }) }
  }

  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Body inválido' }) }
  }

  const { consultaId, email, nombre } = body

  if (!consultaId || !email) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Faltan campos obligatorios' }) }
  }

  const PRECIO_CENTAVOS = parseInt(process.env.PRECIO_LECTURA_CENTAVOS || '1500') // 15 USD por defecto
  const MONEDA = process.env.MONEDA || 'usd'

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: MONEDA,
            unit_amount: PRECIO_CENTAVOS,
            product_data: {
              name: 'Lectura de Registros Akáshicos Completa',
              description: `Lectura completa personalizada para ${nombre}`,
              images: ['https://cartamistica.com/logo.png'],
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        consulta_id: consultaId,
        nombre,
        email,
      },
      success_url: `${origin}/pago-exitoso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${origin}`,
    })

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ url: session.url }),
    }
  } catch (err) {
    console.error('Stripe error:', err.message)
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: 'No se pudo crear el pago. Intentá de nuevo.' }),
    }
  }
}
