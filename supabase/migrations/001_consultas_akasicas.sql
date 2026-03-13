-- ── Tabla principal de consultas akáshicas ───────────────────────────────────
CREATE TABLE IF NOT EXISTS consultas_akasicas (
  id                    uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre                text NOT NULL,
  fecha_nacimiento      date,
  lugar_nacimiento      text,
  intenciones           text[],
  email                 text,
  lectura_teaser        text,
  lectura_completa      text,
  estado                text DEFAULT 'pendiente',  -- pendiente | preview | pagado
  stripe_session_id     text,
  recovery_step         integer DEFAULT 0,          -- 0=ninguno, 1=email1, 2=email2, 3=email3
  recovery_last_sent_at timestamptz,
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now()
);

-- Actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON consultas_akasicas;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON consultas_akasicas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Columnas si la tabla ya existe (migraciones incrementales) ────────────────
ALTER TABLE consultas_akasicas ADD COLUMN IF NOT EXISTS email                 text;
ALTER TABLE consultas_akasicas ADD COLUMN IF NOT EXISTS intenciones           text[];
ALTER TABLE consultas_akasicas ADD COLUMN IF NOT EXISTS lectura_teaser        text;
ALTER TABLE consultas_akasicas ADD COLUMN IF NOT EXISTS stripe_session_id     text;
ALTER TABLE consultas_akasicas ADD COLUMN IF NOT EXISTS estado                text DEFAULT 'pendiente';
ALTER TABLE consultas_akasicas ADD COLUMN IF NOT EXISTS recovery_step         integer DEFAULT 0;
ALTER TABLE consultas_akasicas ADD COLUMN IF NOT EXISTS recovery_last_sent_at timestamptz;
ALTER TABLE consultas_akasicas ADD COLUMN IF NOT EXISTS updated_at            timestamptz DEFAULT now();

-- ── Cron job: ejecutar recovery-emails cada hora ──────────────────────────────
-- Requiere extensiones pg_cron y pg_net habilitadas en Supabase.
-- Habilitarlas en: Supabase → Database → Extensions → pg_cron + pg_net
--
-- Reemplazá YOUR_SERVICE_ROLE_KEY con la tuya antes de ejecutar.

SELECT cron.schedule(
  'recovery-emails-hourly',
  '0 * * * *',
  $$
    SELECT net.http_post(
      url     := 'https://wjqbpqvdnbggjiuvhkqu.supabase.co/functions/v1/recovery-emails',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY'
      ),
      body    := '{}'::jsonb
    );
  $$
);
