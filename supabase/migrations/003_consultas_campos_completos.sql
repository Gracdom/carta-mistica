-- Datos completos de la consulta (tarotista en texto + prompt a la IA + snapshot JSON del formulario)
ALTER TABLE public.consultas_akasicas ADD COLUMN IF NOT EXISTS tarotista_nombre text;
ALTER TABLE public.consultas_akasicas ADD COLUMN IF NOT EXISTS tarotista_especialidad text;
ALTER TABLE public.consultas_akasicas ADD COLUMN IF NOT EXISTS pregunta_enviada text;
ALTER TABLE public.consultas_akasicas ADD COLUMN IF NOT EXISTS snapshot_formulario jsonb;
