-- Tabla para captar leads de tarotistas interesadas en unirse
CREATE TABLE IF NOT EXISTS public.leads_tarotistas (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at    timestamptz DEFAULT now() NOT NULL,
  nombre        text NOT NULL,
  email         text NOT NULL,
  whatsapp      text,
  pais          text,
  especialidad  text,
  experiencia   text,
  mensaje       text,
  estado        text NOT NULL DEFAULT 'nuevo' CHECK (estado IN ('nuevo','contactado','convertido','descartado'))
);

ALTER TABLE public.leads_tarotistas ENABLE ROW LEVEL SECURITY;

-- Cualquier visitante anónimo puede insertar (captura de lead desde el popup)
CREATE POLICY "insert_anon_lead" ON public.leads_tarotistas
  FOR INSERT TO anon WITH CHECK (true);

-- Solo el service_role (backend/admin) puede leer, actualizar y borrar
CREATE POLICY "manage_service_role" ON public.leads_tarotistas
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE INDEX idx_leads_email  ON public.leads_tarotistas (email);
CREATE INDEX idx_leads_estado ON public.leads_tarotistas (estado);
CREATE INDEX idx_leads_fecha  ON public.leads_tarotistas (created_at DESC);
