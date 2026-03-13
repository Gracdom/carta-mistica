/**
 * Netlify Function — Registros Akáshicos
 * Llama a OpenAI GPT-4o-mini para generar una lectura akáshica personalizada.
 * Devuelve { teaser, completa }
 */
exports.handler = async function (event) {
  const origin = event.headers.origin || event.headers.Origin || '*'
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

  const { nombre, fechaNacimiento, lugar, pregunta } = body

  if (!nombre || !fechaNacimiento || !pregunta) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Faltan campos obligatorios' }) }
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
(Escribe EXACTAMENTE 2-3 oraciones cortas y poderosas. Menciona el nombre, una revelación impactante sobre su energía akáshica y termina con una frase que genere urgencia por conocer más. Ejemplo de tono: "Tu alma lleva marcas de una vida anterior de abandono que hoy se manifiesta en tus relaciones. Hay un contrato kármico pendiente que está definiendo tu presente. Lo que tus Registros tienen para mostrarte cambiará la forma en que ves todo.")

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

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
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

    if (!response.ok) {
      const err = await response.text()
      console.error('OpenAI error:', err)
      return { statusCode: 502, headers: CORS, body: JSON.stringify({ error: 'Error al consultar los registros. Intentá de nuevo.' }) }
    }

    const data  = await response.json()
    const texto = data.choices?.[0]?.message?.content ?? ''

    const [teaserPart, completaPart] = texto.split('[LECTURA_COMPLETA]')
    const teaser  = teaserPart.replace('[TEASER]', '').trim()
    const completa = (completaPart ?? '').trim()

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ teaser, completa }),
    }
  } catch (err) {
    console.error(err)
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Error interno del servidor.' }) }
  }
}
