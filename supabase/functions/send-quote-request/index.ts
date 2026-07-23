import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";


// Restrict CORS to known origins
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
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

interface QuoteRequest {
  name: string;
  phone: string;
  email: string;
  businessName: string;
  websiteType: string;
  message?: string;
}

// Simple in-memory rate limiter: 5 requests / minute / IP
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;
const rateBuckets = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = (rateBuckets.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  );
  bucket.push(now);
  rateBuckets.set(ip, bucket);
  return bucket.length > RATE_LIMIT_MAX;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const handler = async (req: Request): Promise<Response> => {
  const corsHeaders = buildCorsHeaders(req.headers.get("origin"));

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }

  try {
    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    if (!brevoApiKey) {
      console.error("BREVO_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
        { status: 503, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    const body = (await req.json()) as Partial<QuoteRequest>;
    const name = (body.name ?? "").toString().trim();
    const phone = (body.phone ?? "").toString().trim();
    const email = (body.email ?? "").toString().trim();
    const businessName = (body.businessName ?? "").toString().trim();
    const websiteType = (body.websiteType ?? "").toString().trim();
    const message = (body.message ?? "").toString().trim();

    if (!name || !phone || !email || !businessName || !websiteType) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    if (
      name.length > 100 ||
      phone.length > 30 ||
      email.length > 255 ||
      businessName.length > 150 ||
      websiteType.length > 50 ||
      message.length > 2000
    ) {
      return new Response(
        JSON.stringify({ error: "Input exceeds allowed length" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    if (!EMAIL_RE.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    const websiteTypeLabel =
      websiteType === "ecommerce" ? "E-Commerce Website" : "Business Website";

    // Persist to DB (non-fatal)
    try {
      const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
      await admin.from("quote_submissions").insert({
        name,
        email,
        phone,
        service: websiteTypeLabel,
        message: message || null,
        data: { businessName, websiteType, message },
      });
    } catch (dbErr) {
      console.error("DB insert error:", dbErr);
    }

    const safe = {
      name: escapeHtml(name),
      phone: escapeHtml(phone),
      email: escapeHtml(email),
      businessName: escapeHtml(businessName),
      websiteType: escapeHtml(websiteTypeLabel),
      message: message ? escapeHtml(message) : "",
    };


    const emailHtml = `
      <h2>New Quote Request from Webfluid Website</h2>
      <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Name</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${safe.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Phone</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${safe.phone}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${safe.email}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Business Name</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${safe.businessName}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Website Type</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${safe.websiteType}</td>
        </tr>
        ${safe.message ? `
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Message</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${safe.message}</td>
        </tr>
        ` : ""}
      </table>
      <p style="margin-top: 20px; color: #666;">This quote request was submitted via the Webfluid website.</p>
    `;

    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "api-key": brevoApiKey,
      },
      body: JSON.stringify({
        sender: { name: "Webfluid Website", email: "noreply@webfluid.in" },
        to: [{ email: "info@webfluid.in", name: "Webfluid Team" }],
        replyTo: { email, name },
        subject: `New Quote Request: ${businessName} - ${websiteTypeLabel}`,
        htmlContent: emailHtml,
      }),
    });

    if (!brevoResponse.ok) {
      const errorData = await brevoResponse.text();
      console.error("Brevo API error:", brevoResponse.status, errorData);
      return new Response(
        JSON.stringify({ error: "Failed to send quote request. Please try again later." }),
        { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    console.log("Quote request email sent successfully for:", businessName);

    return new Response(
      JSON.stringify({ success: true, message: "Quote request sent successfully" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  } catch (error) {
    console.error("Error in send-quote-request function:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send quote request. Please try again later." }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }
};

serve(handler);
