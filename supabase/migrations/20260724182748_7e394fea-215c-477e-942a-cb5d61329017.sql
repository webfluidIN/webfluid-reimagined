
CREATE TABLE public.email_provider_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL DEFAULT 'brevo',
  api_key TEXT,
  api_base_url TEXT,
  sender_email TEXT NOT NULL DEFAULT 'hello@webfluid.in',
  sender_name TEXT NOT NULL DEFAULT 'Webfluid',
  reply_to_email TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_provider_settings TO authenticated;
GRANT ALL ON public.email_provider_settings TO service_role;

ALTER TABLE public.email_provider_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage email provider settings"
ON public.email_provider_settings
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_email_provider_settings_updated_at
BEFORE UPDATE ON public.email_provider_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed a default row using the current Brevo secret configuration
INSERT INTO public.email_provider_settings (provider, sender_email, sender_name, notes)
VALUES ('brevo', 'hello@webfluid.in', 'Webfluid', 'Uses BREVO_API_KEY secret when api_key is empty');
