-- Paso del asistente (0=nombre … 4=intenciones) para retomar consultas incompletas desde el enlace de email.
ALTER TABLE public.consultas_akasicas ADD COLUMN IF NOT EXISTS wizard_paso integer NOT NULL DEFAULT 0;

COMMENT ON COLUMN public.consultas_akasicas.wizard_paso IS 'Índice de paso del modal Registros (0–4). Se actualiza al avanzar/volver.';

-- El cliente anónimo actualiza filas por UUID conocido (mismo patrón que el insert inicial).
DROP POLICY IF EXISTS "anon_update_consulta" ON public.consultas_akasicas;
CREATE POLICY "anon_update_consulta" ON public.consultas_akasicas
  FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);
