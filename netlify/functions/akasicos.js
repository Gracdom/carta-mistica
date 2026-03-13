/**
 * Netlify Function — Registros Akáshicos
 * Llama a OpenAI GPT-4o-mini para generar una lectura akáshica personalizada.
 * La API key nunca se expone al browser.
 */
exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const origin = event.headers.origin || event.headers.Origin || '*'
  const CORS = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }

  // Preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' }
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
Tu misión es acceder al campo akáshico de la persona y transmitir su información del alma con profundidad, calidez y precisión espiritual.
Hablas en primera persona dirigiéndote directamente al consultante, con un tono cálido, sabio y revelador.
Usas términos esotéricos apropiados: alma, registros, guardas, karma, misión de vida, contrato del alma, etc.
Tu respuesta debe estar estructurada en dos bloques separados por el marcador [LECTURA_COMPLETA].`

  const USER_PROMPT = `Accede a los Registros Akáshicos de:
- Nombre completo: ${nombre}
- Fecha de nacimiento: ${fechaNacimiento}
${lugar ? `- Lugar de nacimiento: ${lugar}` : ''}
- Pregunta / intención: ${pregunta}

Genera la lectura akáshica en el siguiente formato exacto:

[VISTA_PREVIA]
(Escribe 2 párrafos introductorios que sean poderosos y reveladores. Menciona el nombre de la persona, una primera impresión de su energía akáshica y un destello de su misión de alma. Termina con una frase que genere curiosidad hacia la lectura completa, como "Pero esto es solo el comienzo de lo que tus Registros tienen para revelar...")

[LECTURA_COMPLETA]
(Continúa con la lectura completa dividida en estas secciones con sus títulos:)

✦ Origen del alma y misión de vida
(3-4 párrafos sobre el origen espiritual del alma, su arquetipo, sus vidas pasadas más relevantes y su misión en esta encarnación)

✦ Patrones kármicos y bloqueos actuales
(2-3 párrafos sobre los patrones repetitivos, contratos kármicos pendientes y bloqueos que frenan su avance)

✦ Respuesta desde los Registros: ${pregunta}
(3-4 párrafos respondiendo directamente la pregunta o intención, con orientación espiritual específica y práctica)

✦ Mensaje de tus Guardianes Akáshicos
(1-2 párrafos con un mensaje especial y cierre amoroso de sus guías y guardianes del registro)`

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
          { role: 'user', content: USER_PROMPT },
        ],
        max_tokens: 2000,
        temperature: 0.85,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('OpenAI error:', err)
      return { statusCode: 502, headers: CORS, body: JSON.stringify({ error: 'Error al consultar los registros. Intentá de nuevo.' }) }
    }

    const data = await response.json()
    const texto = data.choices?.[0]?.message?.content ?? ''

    // Separa preview de lectura completa
    const [previaPart, completaPart] = texto.split('[LECTURA_COMPLETA]')
    const preview  = previaPart.replace('[VISTA_PREVIA]', '').trim()
    const completa = (completaPart ?? '').trim()

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ preview, completa }),
    }
  } catch (err) {
    console.error(err)
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Error interno del servidor.' }) }
  }
}
