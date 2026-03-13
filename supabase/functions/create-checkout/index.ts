/**
 * Supabase Edge Function — Crear sesión de pago con Stripe
 * Recibe: { consultaId, email, nombre }
 * Devuelve: { url }
 *
 * Secrets necesarios (Supabase → Settings → Edge Functions → Secrets):
 *   STRIPE_SECRET_KEY
 *   PRECIO_LECTURA_CENTAVOS  (ej: 1500 = $15 USD)
 *   MONEDA                   (ej: usd)
 *   SITE_URL                 (ej: https://cartamistica.com)
 */
import Stripe from 'npm:stripe@14'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { consultaId, email, nombre } = await req.json()

    if (!consultaId || !email) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos obligatorios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
      apiVersion: '2024-06-20',
    })

    const preciocentavos = parseInt(Deno.env.get('PRECIO_LECTURA_CENTAVOS') ?? '1500')
    const moneda         = Deno.env.get('MONEDA') ?? 'usd'
    const siteUrl        = Deno.env.get('SITE_URL') ?? 'https://cartamistica.com'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: moneda,
            unit_amount: preciocentavos,
            product_data: {
              name: 'Lectura de Registros Akáshicos Completa',
              description: `Lectura completa personalizada para ${nombre}`,
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
      success_url: `${siteUrl}/pago-exitoso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  siteUrl,
    })

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Stripe error:', err)
    return new Response(
      JSON.stringify({ error: 'No se pudo crear el pago. Intentá de nuevo.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
