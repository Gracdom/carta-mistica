-- ============================================================
-- FIX: Políticas RLS para panel Admin
-- Ejecutar en Supabase → SQL Editor → Run
-- ============================================================

-- ─── consultas_akasicas ───────────────────────────────────
ALTER TABLE public.consultas_akasicas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_consulta"  ON public.consultas_akasicas;
DROP POLICY IF EXISTS "manage_service_role"   ON public.consultas_akasicas;
DROP POLICY IF EXISTS "manage_authenticated"  ON public.consultas_akasicas;

CREATE POLICY "anon_insert_consulta" ON public.consultas_akasicas
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "manage_service_role" ON public.consultas_akasicas
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "manage_authenticated" ON public.consultas_akasicas
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ─── leads_tarotistas ─────────────────────────────────────
ALTER TABLE public.leads_tarotistas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "insert_anon_lead"      ON public.leads_tarotistas;
DROP POLICY IF EXISTS "manage_service_role"   ON public.leads_tarotistas;
DROP POLICY IF EXISTS "manage_authenticated"  ON public.leads_tarotistas;

CREATE POLICY "insert_anon_lead" ON public.leads_tarotistas
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "manage_service_role" ON public.leads_tarotistas
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "manage_authenticated" ON public.leads_tarotistas
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ─── solicitudes_tarotista ────────────────────────────────
ALTER TABLE public.solicitudes_tarotista ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_solicitud" ON public.solicitudes_tarotista;
DROP POLICY IF EXISTS "manage_service_role"   ON public.solicitudes_tarotista;
DROP POLICY IF EXISTS "manage_authenticated"  ON public.solicitudes_tarotista;

CREATE POLICY "anon_insert_solicitud" ON public.solicitudes_tarotista
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "manage_service_role" ON public.solicitudes_tarotista
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "manage_authenticated" ON public.solicitudes_tarotista
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ─── resenas ──────────────────────────────────────────────
ALTER TABLE public.resenas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_resena"   ON public.resenas;
DROP POLICY IF EXISTS "public_select_resena" ON public.resenas;
DROP POLICY IF EXISTS "manage_service_role"  ON public.resenas;
DROP POLICY IF EXISTS "manage_authenticated" ON public.resenas;

CREATE POLICY "public_select_resena" ON public.resenas
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "anon_insert_resena" ON public.resenas
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "manage_service_role" ON public.resenas
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "manage_authenticated" ON public.resenas
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ─── tarotistas ───────────────────────────────────────────
ALTER TABLE public.tarotistas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_tarotistas" ON public.tarotistas;
DROP POLICY IF EXISTS "manage_service_role"      ON public.tarotistas;
DROP POLICY IF EXISTS "manage_authenticated"     ON public.tarotistas;

CREATE POLICY "public_select_tarotistas" ON public.tarotistas
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "manage_service_role" ON public.tarotistas
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "manage_authenticated" ON public.tarotistas
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
