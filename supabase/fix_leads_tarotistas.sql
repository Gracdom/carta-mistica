-- Ejecutar en el SQL Editor de Supabase para diagnosticar y reparar la tabla leads_tarotistas

-- 1. Verificar si la tabla existe
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'leads_tarotistas'
) AS tabla_existe;

-- 2. Verificar políticas RLS activas
SELECT policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'leads_tarotistas';

-- 3. Si la tabla NO existe, créala:
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

-- 4. Asegurarse de que RLS está habilitado
ALTER TABLE public.leads_tarotistas ENABLE ROW LEVEL SECURITY;

-- 5. Eliminar políticas previas que puedan estar en conflicto
DROP POLICY IF EXISTS "insert_anon_lead"    ON public.leads_tarotistas;
DROP POLICY IF EXISTS "manage_service_role" ON public.leads_tarotistas;

-- 6. Recrear políticas correctas
-- Anónimos pueden insertar (captura de leads desde el web)
CREATE POLICY "insert_anon_lead" ON public.leads_tarotistas
  FOR INSERT TO anon WITH CHECK (true);

-- Service role y authenticated pueden hacer todo (panel admin)
CREATE POLICY "manage_service_role" ON public.leads_tarotistas
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "manage_authenticated" ON public.leads_tarotistas
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7. Test de inserción anónima (simula lo que hace el cliente)
-- Descomenta para probar:
-- INSERT INTO public.leads_tarotistas (nombre, email, especialidad, pais, estado)
-- VALUES ('Test', 'test@test.com', 'Tarot General', 'España', 'nuevo');
