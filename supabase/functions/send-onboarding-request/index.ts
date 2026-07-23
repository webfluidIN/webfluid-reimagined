import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const ALLOWED_ORIGINS = [
  "https://webfluid.in",
  "https://www.webfluid.in",
  "http://localhost:8080",
  "http://localhost:5173",
];

function buildCorsHeaders(origin: string | null): Record<string, string> {
  const allowOrigin =
    origin &&
    (ALLOWED_ORIGINS.includes(origin) ||
      /^https:\/\/[a-z0-9-]+\.lovable\.app$/.test(origin) ||
      /^https:\/\/[a-z0-9-]+\.lovableproject\.com$/.test(origin))
      ? origin
      : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Vary": "Origin",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Simple in-memory rate limiter: 3 req / min / IP
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60_000;
const rateBuckets = new Map<string, number[]>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = (rateBuckets.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  bucket.push(now);
  rateBuckets.set(ip, bucket);
  return bucket.length > RATE_LIMIT_MAX;
}

function esc(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function truncate(s: unknown, max: number): string {
  const v = String(s ?? "").trim();
  return v.length > max ? v.slice(0, max) : v;
}

function row(label: string, value: unknown): string {
  const v = value == null ? "" : Array.isArray(value) ? value.join(", ") : String(value);
  if (!v.trim()) return "";
  return `<tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;background:#f9fafb;width:220px;vertical-align:top;">${esc(label)}</td><td style="padding:8px 12px;border:1px solid #e5e7eb;white-space:pre-wrap;">${esc(v)}</td></tr>`;
}

function section(title: string, rows: string[]): string {
  const filtered = rows.filter(Boolean);
  if (filtered.length === 0) return "";
  return `
    <h3 style="margin:24px 0 8px;color:#1E5FAD;font-family:Arial,sans-serif;">${esc(title)}</h3>
    <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:14px;">${filtered.join("")}</table>
  `;
}

serve(async (req: Request): Promise<Response> => {
  const corsHeaders = buildCorsHeaders(req.headers.get("origin"));
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";
  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
      status: 429,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    if (!brevoApiKey) {
      console.error("BREVO_API_KEY missing");
      return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
        status: 503,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const payload = await req.json();
    const d = payload?.data ?? {};

    // Basic validation
    const fullName = truncate(d.fullName, 100);
    const businessName = truncate(d.businessName, 150);
    const email = truncate(d.email, 255);
    const phone = truncate(d.phone, 30);
    const services: string[] = Array.isArray(d.services) ? d.services.slice(0, 20).map((s: unknown) => truncate(s, 60)) : [];

    if (!fullName || !businessName || !phone) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    if (!EMAIL_RE.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    if (services.length === 0) {
      return new Response(JSON.stringify({ error: "Select at least one service" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    if (!d.consent) {
      return new Response(JSON.stringify({ error: "Consent required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Signed logo URL (30 days) if uploaded + persist submission
    let logoLine = "";
    const logoPath = truncate(d.logoStoragePath, 500);
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey);

    // Insert into DB (non-fatal if it fails)
    try {
      await admin.from("onboarding_submissions").insert({
        full_name: fullName,
        business_name: businessName,
        email,
        phone,
        services,
        data: d,
        logo_storage_path: logoPath || null,
      });
    } catch (dbErr) {
      console.error("DB insert error:", dbErr);
    }

    if (logoPath) {
      try {
        const { data: signed, error: signErr } = await admin.storage
          .from("onboarding-uploads")
          .createSignedUrl(logoPath, 60 * 60 * 24 * 30);
        if (!signErr && signed?.signedUrl) {
          logoLine = `${d.logoFileName || "logo"} — <a href="${esc(signed.signedUrl)}">download</a>`;
        } else {
          logoLine = `${d.logoFileName || "logo"} (uploaded — path: ${esc(logoPath)})`;
        }
      } catch (e) {
        console.error("Signed URL error:", e);
        logoLine = `${d.logoFileName || "logo"} (path: ${esc(logoPath)})`;
      }
    }


    const socialsPairs = Object.entries(d.socials ?? {})
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`);

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:720px;margin:0 auto;">
        <h2 style="color:#1E5FAD;margin-bottom:4px;">New Client Onboarding Submission</h2>
        <p style="color:#6b7280;margin-top:0;">From the Webfluid onboarding form</p>

        ${section("About", [
          row("Name", fullName),
          row("Business", businessName),
          row("Email", email),
          row("Phone", phone),
          row("WhatsApp", d.whatsapp),
          row("Country", d.country),
          row("City", d.city),
          row("Preferred contact time", d.preferredContactTime),
        ])}

        ${section("Services Needed", [row("Selected", services)])}

        ${section("Business Profile", [
          row("About", d.aboutBusiness),
          row("Industry", d.industry),
          row("Target audience", d.targetAudience),
          row("Existing website", d.existingWebsite),
          row("Socials", socialsPairs),
          row("Brand colors", (d.brandColors ?? []).filter((c: string) => c)),
          row("Palette notes", d.brandColorsNote),
          row("Design references", d.designReferences),
          row("Logo", logoLine || ""),
        ])}

        ${section("Website Requirements", [
          row("Platform", d.platform),
          row("Page scope", d.pageScope),
          row("Extra pages count", d.extraPagesCount),
          row("Extra pages list", d.extraPagesList),
          row("Product count", d.ecomProductCount),
          row("Import help", d.ecomImportHelp),
          row("Payment gateways", d.ecomPaymentGateways),
          row("Shipping regions", d.ecomShippingRegions),
          row("Domain name", d.domainName),
          row("Domain status", d.domainStatus),
          row("Registrar", d.domainRegistrar),
          row("Hosting", d.hosting),
          row("Content readiness", d.contentReadiness),
          row("Multilingual", d.multilingual),
          row("Languages", d.languages),
          row("Launch date", d.launchDate),
        ])}

        ${section("Marketing Requirements", [
          row("Goals", d.marketingGoals),
          row("Target customer", d.targetCustomerBrief),
          row("Keywords", d.keywords),
          row("Target locations", d.targetLocations),
          row("Competitors", d.competitors),
          row("Google Ads budget", d.googleAdsBudget),
          row("Meta Ads budget", d.metaAdsBudget),
          row("Google Ads account ID", d.googleAdsAccountId),
          row("Meta Business Manager ID", d.metaBusinessId),
          row("Already set up", d.existingTracking),
          row("GMB URL", d.gmbUrl),
        ])}

        ${section("Add-ons", [
          row("Selected", d.addons),
          row("Notes", d.addonsNote),
        ])}

        ${section("Budget & Timeline", [
          row("Overall budget", d.overallBudget),
          row("Timeline urgency", d.timelineUrgency),
          row("Referral source", d.referralSource),
          row("Additional notes", d.additionalNotes),
        ])}

        <p style="color:#6b7280;font-size:12px;margin-top:24px;">Submitted from IP ${esc(ip)}</p>
      </div>
    `;

    const subject = `New Onboarding: ${businessName} — ${services.slice(0, 3).join(", ")}`;

    const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "api-key": brevoApiKey,
      },
      body: JSON.stringify({
        sender: { name: "Webfluid Onboarding", email: "noreply@webfluid.in" },
        to: [{ email: "hello@webfluid.in", name: "Webfluid Team" }],
        replyTo: { email, name: fullName },
        subject,
        htmlContent: html,
      }),
    });

    if (!brevoRes.ok) {
      const errText = await brevoRes.text();
      console.error("Brevo error:", brevoRes.status, errText);
      return new Response(JSON.stringify({ error: "Failed to send. Please try again." }), {
        status: 502,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log("Onboarding submitted for:", businessName);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (e) {
    console.error("send-onboarding-request error:", e);
    return new Response(JSON.stringify({ error: "Failed to submit. Please try again." }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
