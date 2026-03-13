/**
 * Supabase Edge Function — Registros Akáshicos
 * Llama a OpenAI GPT-4o-mini para generar una lectura personalizada.
 * Devuelve { teaser, completa }
 *
 * Secrets necesarios (Supabase → Settings → Edge Functions → Secrets):
 *   OPENAI_API_KEY
 */
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { nombre, fechaNacimiento, lugar, pregunta } = await req.json()

    if (!nombre || !fechaNacimiento || !pregunta) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos obligatorios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const SYSTEM_PROMPT = `Eres un canal espiritual especializado en la lectura de los Registros Akáshicos.
Hablas en primera persona dirigiéndote directamente al consultante con un tono cálido, sabio y revelador.
Usas términos esotéricos apropiados: alma, registros, karma, misión de vida, contrato del alma, guardianes.
Tu respuesta SIEMPRE contiene los dos bloques exactos separados por el marcador [LECTURA_COMPLETA].`

    const USER_PROMPT = `Lectura de Registros Akáshicos

Datos del consultante:
- Nombre completo: ${nombre}
- Fecha de nacimiento: ${fechaNacimiento}
${lugar ? `- Lugar de nacimiento: ${lugar}` : ''}
- Pregunta / intención: ${pregunta}

Genera la lectura en el siguiente formato EXACTO:

[TEASER]
(Escribe EXACTAMENTE 2-3 oraciones cortas y poderosas. Menciona el nombre, una revelación impactante sobre su energía akáshica y termina con una frase que genere urgencia por conocer más.)

[LECTURA_COMPLETA]
(Lectura completa dividida en secciones con sus títulos:)

✦ Origen del alma y misión de vida
(3-4 párrafos sobre origen espiritual, arquetipo, vidas pasadas relevantes y misión en esta encarnación)

✦ Patrones kármicos y bloqueos actuales
(2-3 párrafos sobre patrones repetitivos, contratos kármicos pendientes y bloqueos)

✦ Respuesta desde los Registros: ${pregunta}
(3-4 párrafos respondiendo directamente la pregunta con orientación espiritual específica)

✦ Mensaje de tus Guardianes Akáshicos
(1-2 párrafos con mensaje especial y cierre amoroso de los guardianes del registro)`

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user',   content: USER_PROMPT   },
        ],
        max_tokens: 2200,
        temperature: 0.85,
      }),
    })

    if (!openaiRes.ok) {
      const err = await openaiRes.text()
      console.error('OpenAI error:', err)
      return new Response(
        JSON.stringify({ error: 'Error al consultar los registros. Intentá de nuevo.' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const data  = await openaiRes.json()
    const texto = data.choices?.[0]?.message?.content ?? ''

    const [teaserPart, completaPart] = texto.split('[LECTURA_COMPLETA]')
    const teaser   = teaserPart.replace('[TEASER]', '').trim()
    const completa = (completaPart ?? '').trim()

    return new Response(
      JSON.stringify({ teaser, completa }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error(err)
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
