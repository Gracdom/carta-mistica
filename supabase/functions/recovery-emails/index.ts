/**
 * Supabase Edge Function — Recovery Emails
 * Flujo de 3 emails para clientes que vieron el teaser pero no pagaron.
 *
 * Email 1 →  1h después del teaser: "Tu lectura está esperando"
 * Email 2 → 24h después del Email 1: "Los Guardianes tienen un mensaje urgente"
 * Email 3 → 72h después del Email 2: "Último aviso — el portal se está cerrando"
 *
 * Esta función se llama desde un cron job en Supabase (pg_cron) cada hora.
 * Ver: supabase/migrations/recovery_cron.sql
 *
 * Secrets requeridos (Supabase → Settings → Edge Functions → Secrets):
 *   RESEND_API_KEY, EMAIL_FROM, SITE_URL
 */
import { createClient } from 'npm:@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const resendKey  = Deno.env.get('RESEND_API_KEY') ?? ''
const emailFrom  = Deno.env.get('EMAIL_FROM') ?? 'Carta Mística <noreply@cartamistica.com>'
const siteUrl    = Deno.env.get('SITE_URL') ?? 'https://cartamistica.com'

// ── Helpers ───────────────────────────────────────────────────────────────────
async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendKey}` },
    body: JSON.stringify({ from: emailFrom, to: [to], subject, html }),
  })
  if (!res.ok) console.error(`Resend error (${to}):`, await res.text())
  return res.ok
}

// ── Templates ─────────────────────────────────────────────────────────────────
function emailBase(contenido: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#030312;font-family:Georgia,serif;color:#e2e0ff;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <p style="color:#a78bfa;letter-spacing:.5em;font-size:14px;margin:0 0 6px;">✦ ☽ ✦</p>
      <p style="color:#4c3775;font-size:13px;margin:0;">Carta Mística · Registros Akáshicos</p>
    </div>
    ${contenido}
    <div style="text-align:center;border-top:1px solid rgba(139,92,246,.15);padding-top:24px;margin-top:32px;">
      <p style="color:#4c3775;font-size:12px;margin:0;">
        © Carta Mística · <a href="${siteUrl}" style="color:#7c6fa0;">cartamistica.com</a><br/>
        <a href="${siteUrl}/baja?email={{EMAIL}}" style="color:#4c3775;font-size:11px;">Darme de baja</a>
      </p>
    </div>
  </div>
</body>
</html>`
}

function email1Html(nombre: string, teaser: string) {
  return emailBase(`
    <div style="background:linear-gradient(135deg,rgba(109,40,217,.2),rgba(139,92,246,.08));border:1px solid rgba(139,92,246,.35);border-radius:16px;padding:32px 28px;margin-bottom:24px;">
      <h1 style="font-size:22px;color:#fff;margin:0 0 8px;font-family:Georgia,serif;">
        Tu Registro Akáshico está esperando, ${nombre}
      </h1>
      <p style="color:#a78bfa;font-size:13px;margin:0 0 20px;letter-spacing:.05em;">Los Guardianes abrieron tu portal hace una hora</p>
      <div style="background:rgba(0,0,0,.3);border-left:3px solid #a78bfa;padding:16px 20px;border-radius:8px;margin-bottom:24px;">
        <p style="color:#d4bbff;font-style:italic;margin:0;font-size:15px;line-height:1.7;">"${teaser}"</p>
      </div>
      <p style="color:#9ca3af;font-size:14px;line-height:1.7;margin:0 0 24px;">
        Este es solo el inicio. Tu lectura completa contiene el mensaje que tu alma necesita escuchar: 
        tu misión de vida, los bloqueos kármicos que te frenan y la respuesta directa desde los Registros.
      </p>
      <a href="${siteUrl}" style="display:inline-block;background:linear-gradient(135deg,#6d28d9,#9333ea);color:#fff;text-decoration:none;padding:14px 32px;border-radius:50px;font-size:15px;font-weight:bold;">
        ✦ Desbloquear mi lectura completa
      </a>
    </div>
    <p style="color:#4c3775;font-size:12px;text-align:center;margin:0;">
      Completar tu consulta toma menos de 2 minutos · Pago seguro
    </p>`)
}

function email2Html(nombre: string) {
  return emailBase(`
    <div style="background:linear-gradient(135deg,rgba(147,51,234,.15),rgba(109,40,217,.08));border:1px solid rgba(139,92,246,.3);border-radius:16px;padding:32px 28px;margin-bottom:24px;">
      <p style="color:#f59e0b;font-size:12px;letter-spacing:.1em;font-family:Arial,sans-serif;margin:0 0 12px;">☽ MENSAJE DE TUS GUARDIANES</p>
      <h1 style="font-size:22px;color:#fff;margin:0 0 16px;font-family:Georgia,serif;">
        ${nombre}, hay algo que debés saber
      </h1>
      <p style="color:#c4a8e8;font-size:15px;line-height:1.75;margin:0 0 20px;">
        Es inusual que un alma llegue tan lejos — completar el formulario, recibir el teaser — 
        y no recoja su mensaje completo.
      </p>
      <p style="color:#c4a8e8;font-size:15px;line-height:1.75;margin:0 0 20px;">
        Esto tiene un significado. Los Registros rara vez se abren por casualidad. 
        Tu alma <em>buscó</em> esta lectura por alguna razón profunda.
      </p>
      <div style="background:rgba(109,40,217,.2);border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="color:#e9d5ff;font-size:14px;margin:0;line-height:1.7;">
          Tu lectura incluye:<br/>
          <span style="color:#a78bfa;">✦</span> Origen del alma y misión de vida<br/>
          <span style="color:#a78bfa;">✦</span> Patrones kármicos que se repiten hoy<br/>
          <span style="color:#a78bfa;">✦</span> Respuesta directa a tu pregunta<br/>
          <span style="color:#a78bfa;">✦</span> Mensaje especial de tus Guardianes
        </p>
      </div>
      <a href="${siteUrl}" style="display:inline-block;background:linear-gradient(135deg,#6d28d9,#9333ea);color:#fff;text-decoration:none;padding:14px 32px;border-radius:50px;font-size:15px;font-weight:bold;">
        Recibir mi lectura completa ahora
      </a>
    </div>`)
}

function email3Html(nombre: string) {
  return emailBase(`
    <div style="border:1px solid rgba(239,68,68,.3);border-radius:16px;padding:32px 28px;margin-bottom:24px;background:linear-gradient(135deg,rgba(109,40,217,.12),rgba(239,68,68,.05));">
      <p style="color:#f87171;font-size:12px;letter-spacing:.1em;font-family:Arial,sans-serif;margin:0 0 12px;">⚠️ ÚLTIMO AVISO</p>
      <h1 style="font-size:22px;color:#fff;margin:0 0 16px;font-family:Georgia,serif;">
        El portal akáshico de ${nombre} está por cerrarse
      </h1>
      <p style="color:#c4a8e8;font-size:15px;line-height:1.75;margin:0 0 16px;">
        Este es nuestro último mensaje. Después de esto, archivaremos tu consulta 
        y el portal de tu registro se cerrará.
      </p>
      <p style="color:#c4a8e8;font-size:15px;line-height:1.75;margin:0 0 24px;">
        Los Registros Akáshicos no siempre están disponibles. La puerta que se abrió 
        para vos tiene una energía particular — y esa energía no dura para siempre.
      </p>
      <a href="${siteUrl}" style="display:inline-block;background:linear-gradient(135deg,#6d28d9,#9333ea);color:#fff;text-decoration:none;padding:16px 36px;border-radius:50px;font-size:16px;font-weight:bold;">
        ✦ Abrir mi portal antes de que se cierre
      </a>
      <p style="color:#6b7280;font-size:12px;margin:20px 0 0;">
        Si ya no te interesa, simplemente ignorá este mensaje. No te enviaremos más recordatorios.
      </p>
    </div>`)
}

// ── Handler principal ─────────────────────────────────────────────────────────
Deno.serve(async () => {
  const now = new Date()
  let enviados = 0

  try {
    // ── Email 1: 1h después del teaser, aún no enviado ────────────────────
    const { data: pendientes1 } = await supabase
      .from('consultas_akasicas')
      .select('id, nombre, email, lectura_teaser')
      .eq('estado', 'preview')
      .eq('recovery_step', 0)
      .not('lectura_teaser', 'is', null)
      .not('email', 'is', null)
      .lt('updated_at', new Date(now.getTime() - 60 * 60 * 1000).toISOString())

    for (const c of pendientes1 ?? []) {
      const ok = await sendEmail(
        c.email,
        `✦ Tu Registro Akáshico está esperando, ${c.nombre}`,
        email1Html(c.nombre, c.lectura_teaser ?? '')
      )
      if (ok) {
        await supabase.from('consultas_akasicas')
          .update({ recovery_step: 1, recovery_last_sent_at: now.toISOString() })
          .eq('id', c.id)
        enviados++
      }
    }

    // ── Email 2: 24h después del Email 1 ─────────────────────────────────
    const { data: pendientes2 } = await supabase
      .from('consultas_akasicas')
      .select('id, nombre, email')
      .eq('estado', 'preview')
      .eq('recovery_step', 1)
      .lt('recovery_last_sent_at', new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString())

    for (const c of pendientes2 ?? []) {
      const ok = await sendEmail(
        c.email,
        `☽ ${c.nombre}, hay algo que debés saber`,
        email2Html(c.nombre)
      )
      if (ok) {
        await supabase.from('consultas_akasicas')
          .update({ recovery_step: 2, recovery_last_sent_at: now.toISOString() })
          .eq('id', c.id)
        enviados++
      }
    }

    // ── Email 3: 72h después del Email 2 ─────────────────────────────────
    const { data: pendientes3 } = await supabase
      .from('consultas_akasicas')
      .select('id, nombre, email')
      .eq('estado', 'preview')
      .eq('recovery_step', 2)
      .lt('recovery_last_sent_at', new Date(now.getTime() - 72 * 60 * 60 * 1000).toISOString())

    for (const c of pendientes3 ?? []) {
      const ok = await sendEmail(
        c.email,
        `⚠️ Último aviso — el portal de ${c.nombre} está por cerrarse`,
        email3Html(c.nombre)
      )
      if (ok) {
        await supabase.from('consultas_akasicas')
          .update({ recovery_step: 3, recovery_last_sent_at: now.toISOString() })
          .eq('id', c.id)
        enviados++
      }
    }

    console.log(`Recovery emails: ${enviados} enviados`)
    return new Response(JSON.stringify({ ok: true, enviados }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error('Recovery error:', err)
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    })
  }
})
