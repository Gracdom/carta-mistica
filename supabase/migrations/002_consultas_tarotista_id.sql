-- Tarotista elegida en el flujo de consulta akáshica (id lógico: luna, gale, aurora)
ALTER TABLE public.consultas_akasicas
  ADD COLUMN IF NOT EXISTS tarotista_id text;
