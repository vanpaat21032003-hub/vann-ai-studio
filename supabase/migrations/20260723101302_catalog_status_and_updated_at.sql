-- Sprint 5 schema foundation
-- Adds status (active / archived) and updated_at to catalog tables.
-- Attaches the existing update_updated_at_column() trigger function defined
-- in migration 20260721171620_v1_database_foundation.
--
-- Scope:
--   public.models
--   public.styles
--   public.prompt_presets
--
-- No changes to:
--   models.height          (remains numeric(5,2) nullable)
--   RLS policies           (existing 28 table policies are unaffected)
--   Storage buckets        (unchanged)
--   Auth settings          (unchanged)
--   owner_id / grants      (unchanged)
--   products table         (unchanged)
--   product_images table   (unchanged)
--   projects table         (unchanged)
--   product_analysis table (unchanged)

-- ============================================================
-- 1. public.models
-- ============================================================

ALTER TABLE public.models
  ADD COLUMN status     text        NOT NULL DEFAULT 'active'
    CONSTRAINT models_status_check
    CHECK (status IN ('active', 'archived')),
  ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();

CREATE TRIGGER models_set_updated_at
  BEFORE UPDATE ON public.models
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 2. public.styles
-- ============================================================

ALTER TABLE public.styles
  ADD COLUMN status     text        NOT NULL DEFAULT 'active'
    CONSTRAINT styles_status_check
    CHECK (status IN ('active', 'archived')),
  ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();

CREATE TRIGGER styles_set_updated_at
  BEFORE UPDATE ON public.styles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 3. public.prompt_presets
-- ============================================================

ALTER TABLE public.prompt_presets
  ADD COLUMN status     text        NOT NULL DEFAULT 'active'
    CONSTRAINT prompt_presets_status_check
    CHECK (status IN ('active', 'archived')),
  ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();

CREATE TRIGGER prompt_presets_set_updated_at
  BEFORE UPDATE ON public.prompt_presets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
