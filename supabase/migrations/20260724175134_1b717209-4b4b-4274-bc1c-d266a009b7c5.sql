
ALTER TABLE public.invoices 
  ADD COLUMN IF NOT EXISTS document_type text NOT NULL DEFAULT 'invoice',
  ADD COLUMN IF NOT EXISTS valid_until date,
  ADD COLUMN IF NOT EXISTS converted_from_id uuid REFERENCES public.invoices(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS sent_to_email text,
  ADD COLUMN IF NOT EXISTS sent_at timestamptz;

ALTER TABLE public.invoices DROP CONSTRAINT IF EXISTS invoices_document_type_check;
ALTER TABLE public.invoices ADD CONSTRAINT invoices_document_type_check CHECK (document_type IN ('invoice','quote'));

CREATE TABLE IF NOT EXISTS public.company_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL DEFAULT 'Webfluid',
  address text,
  city text,
  country text,
  phone text,
  email text,
  website text,
  tax_id text,
  logo_url text,
  invoice_template text NOT NULL DEFAULT 'classic',
  quote_template text NOT NULL DEFAULT 'classic',
  primary_color text NOT NULL DEFAULT '#1E5FAD',
  reply_to_email text,
  email_from_name text NOT NULL DEFAULT 'Webfluid',
  invoice_email_subject text NOT NULL DEFAULT 'Invoice {{number}} from {{company}}',
  invoice_email_body text NOT NULL DEFAULT E'Hi {{client}},\n\nPlease find attached invoice {{number}} for {{total}}.\n\nThank you,\n{{company}}',
  quote_email_subject text NOT NULL DEFAULT 'Quotation {{number}} from {{company}}',
  quote_email_body text NOT NULL DEFAULT E'Hi {{client}},\n\nPlease find attached quotation {{number}}. It is valid until {{valid_until}}.\n\nThank you,\n{{company}}',
  bank_details text,
  footer_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.company_settings TO authenticated;
GRANT ALL ON public.company_settings TO service_role;
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view settings" ON public.company_settings FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins can modify settings" ON public.company_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER update_company_settings_updated_at BEFORE UPDATE ON public.company_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.company_settings (company_name, email) SELECT 'Webfluid','hello@webfluid.in' WHERE NOT EXISTS (SELECT 1 FROM public.company_settings);

CREATE POLICY "Staff read company-assets" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'company-assets' AND public.is_staff(auth.uid()));
CREATE POLICY "Admins upload company-assets" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'company-assets' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update company-assets" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'company-assets' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete company-assets" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'company-assets' AND public.has_role(auth.uid(),'admin'));
