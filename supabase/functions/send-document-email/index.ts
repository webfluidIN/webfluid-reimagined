import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type ProviderCfg = {
  provider: string;
  api_key: string | null;
  api_base_url: string | null;
  sender_email: string;
  sender_name: string;
  reply_to_email: string | null;
};

async function sendViaProvider(cfg: ProviderCfg, params: {
  to: string; cc?: string; subject: string; htmlBody: string;
  pdfBase64?: string; pdfFilename?: string; replyTo?: string; fromName?: string;
}) {
  const senderEmail = cfg.sender_email;
  const senderName = params.fromName || cfg.sender_name || "Webfluid";
  const replyTo = params.replyTo || cfg.reply_to_email || undefined;
  const apiKey = cfg.api_key || Deno.env.get("BREVO_API_KEY") || Deno.env.get("SENDGRID_API_KEY") || Deno.env.get("RESEND_API_KEY");
  if (!apiKey) throw new Error("Email provider API key not configured");

  const provider = (cfg.provider || "brevo").toLowerCase();

  if (provider === "brevo") {
    const body: any = {
      sender: { name: senderName, email: senderEmail },
      to: [{ email: params.to }],
      subject: params.subject,
      htmlContent: params.htmlBody,
    };
    if (params.pdfBase64 && params.pdfFilename) body.attachment = [{ name: params.pdfFilename, content: params.pdfBase64 }];
    if (params.cc) body.cc = [{ email: params.cc }];
    if (replyTo) body.replyTo = { email: replyTo };
    const url = cfg.api_base_url || "https://api.brevo.com/v3/smtp/email";
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-key": apiKey, accept: "application/json" },
      body: JSON.stringify(body),
    });
  }

  if (provider === "sendgrid") {
    const personalization: any = { to: [{ email: params.to }], subject: params.subject };
    if (params.cc) personalization.cc = [{ email: params.cc }];
    const body: any = {
      personalizations: [personalization],
      from: { email: senderEmail, name: senderName },
      content: [{ type: "text/html", value: params.htmlBody }],
    };
    if (params.pdfBase64 && params.pdfFilename) body.attachments = [{ content: params.pdfBase64, filename: params.pdfFilename, type: "application/pdf", disposition: "attachment" }];
    if (replyTo) body.reply_to = { email: replyTo };
    const url = cfg.api_base_url || "https://api.sendgrid.com/v3/mail/send";
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(body),
    });
  }

  if (provider === "resend") {
    const body: any = {
      from: `${senderName} <${senderEmail}>`,
      to: [params.to],
      subject: params.subject,
      html: params.htmlBody,
    };
    if (params.pdfBase64 && params.pdfFilename) body.attachments = [{ filename: params.pdfFilename, content: params.pdfBase64 }];
    if (params.cc) body.cc = [params.cc];
    if (replyTo) body.reply_to = replyTo;
    const url = cfg.api_base_url || "https://api.resend.com/emails";
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(body),
    });
  }

  throw new Error(`Unsupported provider: ${provider}`);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const jwt = authHeader.replace("Bearer ", "");
    const url = Deno.env.get("SUPABASE_URL")!;
    const svc = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anon = Deno.env.get("SUPABASE_ANON_KEY")!;

    const userClient = createClient(url, anon, { global: { headers: { Authorization: `Bearer ${jwt}` } } });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...cors, "Content-Type": "application/json" } });

    const admin = createClient(url, svc);
    const { data: staff } = await admin.from("user_roles").select("role").eq("user_id", user.id);
    const isStaff = (staff ?? []).some((r: any) => r.role === "admin" || r.role === "staff");
    if (!isStaff) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...cors, "Content-Type": "application/json" } });

    const { to, cc, subject, htmlBody, pdfBase64, pdfFilename, replyTo, fromName, invoiceId } = await req.json();
    if (!to || !subject || !htmlBody || !pdfBase64 || !pdfFilename) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
    }

    // Load provider config
    const { data: cfgRow } = await admin
      .from("email_provider_settings")
      .select("provider,api_key,api_base_url,sender_email,sender_name,reply_to_email")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    const cfg: ProviderCfg = cfgRow ?? {
      provider: "brevo",
      api_key: null,
      api_base_url: null,
      sender_email: "hello@webfluid.in",
      sender_name: "Webfluid",
      reply_to_email: null,
    };

    const resp = await sendViaProvider(cfg, { to, cc, subject, htmlBody, pdfBase64, pdfFilename, replyTo, fromName });

    if (!resp.ok) {
      const err = await resp.text();
      console.error(`${cfg.provider} error`, resp.status, err);
      return new Response(JSON.stringify({ error: "Send failed", details: err }), { status: 502, headers: { ...cors, "Content-Type": "application/json" } });
    }

    if (invoiceId) {
      await admin.from("invoices").update({ status: "sent", sent_to_email: to, sent_at: new Date().toISOString() }).eq("id", invoiceId);
    }

    return new Response(JSON.stringify({ ok: true, provider: cfg.provider }), { headers: { ...cors, "Content-Type": "application/json" } });
  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ error: e.message ?? "Server error" }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
  }
});
