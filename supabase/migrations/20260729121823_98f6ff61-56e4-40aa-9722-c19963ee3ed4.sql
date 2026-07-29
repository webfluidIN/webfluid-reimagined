ALTER TABLE public.company_settings
  ADD COLUMN IF NOT EXISTS social_facebook text,
  ADD COLUMN IF NOT EXISTS social_instagram text,
  ADD COLUMN IF NOT EXISTS social_linkedin text,
  ADD COLUMN IF NOT EXISTS social_x text,
  ADD COLUMN IF NOT EXISTS social_youtube text,
  ADD COLUMN IF NOT EXISTS social_whatsapp text,
  ADD COLUMN IF NOT EXISTS renewal_thankyou_subject text NOT NULL DEFAULT 'Thank you — your renewal is confirmed',
  ADD COLUMN IF NOT EXISTS renewal_thankyou_body text NOT NULL DEFAULT 'Hi {{client}},

Thank you! We have successfully renewed the following service(s) for you. Your next renewal date is shown below.

We appreciate your continued trust in us.';