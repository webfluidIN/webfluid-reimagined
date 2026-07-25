ALTER TABLE public.company_settings
  ADD COLUMN IF NOT EXISTS renewal_notify_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS renewal_notify_email text,
  ADD COLUMN IF NOT EXISTS renewal_notify_days integer[] NOT NULL DEFAULT '{1,15}';