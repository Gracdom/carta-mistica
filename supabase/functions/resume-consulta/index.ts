/**
 * Devuelve una fila de consultas_akasicas por id (enlace de recuperación).
 * Usa service role para no requerir SELECT anónimo sobre la tabla.
 */
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const json = (body: object, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Método no permitido' }, 405)

  try {
    const body = await req.json().catch(() => ({}))
    const consultaId = typeof body?.consultaId === 'string' ? body.consultaId.trim() : ''
    if (!consultaId) return json({ error: 'Falta consultaId' })

    const { data, error } = await supabase
      .from('consultas_akasicas')
      .select('*')
      .eq('id', consultaId)
      .maybeSingle()

    if (error) {
      console.error('[resume-consulta]', error)
      return json({ error: 'No se pudo cargar la consulta' })
    }
    if (!data) return json({ error: 'Consulta no encontrada' })

    return json({ consulta: data })
  } catch (e) {
    console.error('[resume-consulta]', e)
    return json({ error: String(e) })
  }
})
