ALTER TABLE public.company_settings
  ADD COLUMN IF NOT EXISTS renewal_cc_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS renewal_cc_email text NOT NULL DEFAULT 'info@webfluid.in';