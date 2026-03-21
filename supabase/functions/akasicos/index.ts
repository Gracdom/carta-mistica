/**
 * Supabase Edge Function — Registros Akáshicos
 * Llama a OpenAI GPT-4o-mini para generar una lectura personalizada.
 * Devuelve siempre HTTP 200 con { teaser, completa } o { error: "..." }
 * para que el cliente Supabase pueda leer el cuerpo en caso de error.
 *
 * Secrets necesarios (Supabase → Settings → Edge Functions → Secrets):
 *   OPENAI_API_KEY
 */
import { corsHeaders } from '../_shared/cors.ts'

const ok  = (body: object) =>
  new Response(JSON.stringify(body), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

const err = (msg: string, detail = '') => {
  console.error('[akasicos]', msg, detail)
  return ok({ error: msg })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    if (!OPENAI_API_KEY) return err('Configuración incompleta: falta OPENAI_API_KEY.')

    const body = await req.json().catch(() => ({}))
    const { nombre, fechaNacimiento, lugar, pregunta } = body

    if (!nombre?.trim())         return err('Falta el nombre del consultante.')
    if (!fechaNacimiento?.trim()) return err('Falta la fecha de nacimiento.')
    if (!pregunta?.trim())       return err('Falta la intención o pregunta.')

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
        Authorization: `Bearer ${OPENAI_API_KEY}`,
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
      const detail = await openaiRes.text()
      console.error('[akasicos] OpenAI error:', openaiRes.status, detail)
      if (openaiRes.status === 401) return err('API Key de OpenAI inválida o no configurada.')
      if (openaiRes.status === 429) return err('Los Registros están muy demandados en este momento. Intentá en unos segundos.')
      if (openaiRes.status === 402) return err('Créditos de OpenAI agotados. Contactá al administrador.')
      return err('Los Registros no pudieron abrirse en este momento. Intentá de nuevo.')
    }

    const data  = await openaiRes.json()
    const texto = data.choices?.[0]?.message?.content ?? ''

    if (!texto) return err('La lectura llegó vacía. Intentá de nuevo.')

    const [teaserPart, completaPart] = texto.split('[LECTURA_COMPLETA]')
    const teaser   = teaserPart.replace('[TEASER]', '').trim()
    const completa = (completaPart ?? '').trim()

    return ok({ teaser, completa })

  } catch (e) {
    return err('Error interno al procesar la lectura.', String(e))
  }
})
