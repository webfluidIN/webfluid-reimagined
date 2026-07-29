import { supabase } from "@/integrations/supabase/client";

export type BrandSettings = Record<string, any>;

const YEAR = 60 * 60 * 24 * 365;

export async function loadBrand(): Promise<{ settings: BrandSettings; logoUrl: string | null }> {
  const { data } = await supabase.from("company_settings").select("*").limit(1).maybeSingle();
  let logoUrl: string | null = null;
  if ((data as any)?.logo_url) {
    const { data: signed } = await supabase.storage
      .from("company-assets")
      .createSignedUrl((data as any).logo_url, YEAR);
    logoUrl = signed?.signedUrl ?? null;
  }
  return { settings: (data as any) ?? {}, logoUrl };
}

export const esc = (s: any) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

export const para = (t: string) =>
  t
    .split("\n")
    .map((l) => `<p style="margin:0 0 12px 0;font-size:15px;line-height:1.6;color:#374151;">${esc(l) || "&nbsp;"}</p>`)
    .join("");

const SOCIALS: { key: string; label: string; color: string }[] = [
  { key: "social_facebook", label: "Facebook", color: "#1877F2" },
  { key: "social_instagram", label: "Instagram", color: "#E1306C" },
  { key: "social_linkedin", label: "LinkedIn", color: "#0A66C2" },
  { key: "social_x", label: "X", color: "#111827" },
  { key: "social_youtube", label: "YouTube", color: "#FF0000" },
  { key: "social_whatsapp", label: "WhatsApp", color: "#25D366" },
];

function normalizeUrl(v: string) {
  const t = v.trim();
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
}

/** Wraps arbitrary HTML content in a branded email shell (logo header + address/social footer). */
export function brandedEmail(opts: {
  settings: BrandSettings;
  logoUrl?: string | null;
  contentHtml: string;
  preheader?: string;
}): string {
  const { settings: s, logoUrl, contentHtml, preheader } = opts;
  const brand = s?.primary_color || "#1E5FAD";
  const company = s?.company_name || "Webfluid";

  const addressLine = [s?.address, s?.city, s?.country].filter(Boolean).map(esc).join(", ");
  const contactLine = [
    s?.phone ? `Tel: ${esc(s.phone)}` : "",
    s?.email ? `<a href="mailto:${esc(s.email)}" style="color:#6b7280;text-decoration:none;">${esc(s.email)}</a>` : "",
    s?.website
      ? `<a href="${esc(normalizeUrl(s.website))}" style="color:#6b7280;text-decoration:none;">${esc(s.website)}</a>`
      : "",
  ]
    .filter(Boolean)
    .join(" &nbsp;·&nbsp; ");

  const socialCells = SOCIALS.filter((x) => s?.[x.key])
    .map(
      (x) => `<td style="padding:0 4px;">
        <a href="${esc(normalizeUrl(String(s[x.key])))}" style="display:inline-block;background:${x.color};color:#ffffff;font-size:11px;font-weight:bold;letter-spacing:.3px;text-decoration:none;padding:7px 12px;border-radius:14px;font-family:Arial,sans-serif;">${esc(x.label)}</a>
      </td>`,
    )
    .join("");

  const header = logoUrl
    ? `<img src="${esc(logoUrl)}" alt="${esc(company)}" height="40" style="height:40px;width:auto;display:block;border:0;" />`
    : `<div style="font-size:22px;font-weight:bold;color:${esc(brand)};font-family:Arial,sans-serif;">${esc(company)}</div>`;

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background-color:#f3f4f6;">
${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>` : ""}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;">
  <tr><td align="center">
    <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
      <tr><td style="height:5px;background:${esc(brand)};line-height:5px;font-size:0;">&nbsp;</td></tr>
      <tr><td style="padding:22px 28px 6px 28px;">${header}</td></tr>
      <tr><td style="padding:10px 28px 26px 28px;">${contentHtml}</td></tr>
      <tr><td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:22px 28px;text-align:center;">
        ${socialCells ? `<table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto 14px auto;"><tr>${socialCells}</tr></table>` : ""}
        <div style="font-size:13px;font-weight:bold;color:#374151;margin-bottom:4px;">${esc(company)}</div>
        ${addressLine ? `<div style="font-size:12px;color:#6b7280;line-height:1.5;">${addressLine}</div>` : ""}
        ${contactLine ? `<div style="font-size:12px;color:#6b7280;line-height:1.5;margin-top:4px;">${contactLine}</div>` : ""}
        ${s?.footer_notes ? `<div style="font-size:11px;color:#9ca3af;margin-top:10px;line-height:1.5;">${esc(s.footer_notes)}</div>` : ""}
        <div style="font-size:11px;color:#9ca3af;margin-top:10px;">© ${new Date().getFullYear()} ${esc(company)}. All rights reserved.</div>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

/** Renewal items table used in reminder + thank-you emails. */
export function renewalTable(
  items: { label: string; type: string; vendor?: string | null; renews_on: string; cost?: any; currency?: string | null }[],
  opts: { brand: string; dateHeading?: string; showDue?: boolean } = { brand: "#1E5FAD" },
): string {
  const { brand, dateHeading = "Renews on", showDue = true } = opts;
  const daysUntil = (d: string) => Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
  const total = items.reduce((sum, r) => sum + (Number(r.cost) || 0), 0);
  const currency = items.find((r) => r.cost)?.currency ?? "INR";

  const rows = items
    .map((r) => {
      const d = daysUntil(r.renews_on);
      const due = d < 0 ? `${-d} day(s) overdue` : `in ${d} day(s)`;
      return `<tr>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;">${esc(r.label)}
        <div style="font-size:12px;color:#6b7280;margin-top:2px;">${esc(String(r.type).replace(/_/g, " "))}${r.vendor ? ` · ${esc(r.vendor)}` : ""}</div>
      </td>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;">${esc(r.renews_on)}
        ${showDue ? `<div style="font-size:12px;color:${d < 0 ? "#dc2626" : "#6b7280"};margin-top:2px;">${due}</div>` : ""}
      </td>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;text-align:right;">${r.cost ? `${esc(r.currency ?? currency)} ${Number(r.cost).toLocaleString()}` : "—"}</td>
    </tr>`;
    })
    .join("");

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin:18px 0;">
    <thead><tr style="background:${esc(brand)};">
      <th style="padding:10px 12px;text-align:left;font-size:12px;color:#ffffff;text-transform:uppercase;letter-spacing:.4px;">Service</th>
      <th style="padding:10px 12px;text-align:left;font-size:12px;color:#ffffff;text-transform:uppercase;letter-spacing:.4px;">${esc(dateHeading)}</th>
      <th style="padding:10px 12px;text-align:right;font-size:12px;color:#ffffff;text-transform:uppercase;letter-spacing:.4px;">Cost</th>
    </tr></thead>
    <tbody>${rows}</tbody>
    ${
      total > 0
        ? `<tfoot><tr style="background:#f9fafb;">
      <td colspan="2" style="padding:10px 12px;text-align:right;font-weight:bold;font-size:14px;color:#111827;">Total</td>
      <td style="padding:10px 12px;text-align:right;font-weight:bold;font-size:14px;color:#111827;">${esc(currency)} ${total.toLocaleString()}</td>
    </tr></tfoot>`
        : ""
    }
  </table>`;
}
