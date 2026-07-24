import { supabase } from "@/integrations/supabase/client";

export interface CompanySettings {
  id?: string;
  company_name: string;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  tax_id?: string | null;
  logo_url?: string | null;
  invoice_template: string;
  quote_template: string;
  primary_color: string;
  reply_to_email?: string | null;
  email_from_name: string;
  invoice_email_subject: string;
  invoice_email_body: string;
  quote_email_subject: string;
  quote_email_body: string;
  bank_details?: string | null;
  footer_notes?: string | null;
}

export async function loadCompanySettings(): Promise<{ settings: CompanySettings | null; logoUrl: string | null }> {
  const { data } = await supabase.from("company_settings").select("*").limit(1).maybeSingle();
  let logoUrl: string | null = null;
  if (data?.logo_url) {
    const { data: signed } = await supabase.storage.from("company-assets").createSignedUrl(data.logo_url, 3600);
    logoUrl = signed?.signedUrl ?? null;
  }
  return { settings: (data as any) ?? null, logoUrl };
}

export function renderTemplate(tpl: string, vars: Record<string, string>): string {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? "");
}
