import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const jwt = authHeader.replace("Bearer ", "");
    const url = Deno.env.get("SUPABASE_URL")!;
    const svc = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const brevo = Deno.env.get("BREVO_API_KEY");
    if (!brevo) return new Response(JSON.stringify({ error: "Email not configured" }), { status: 503, headers: { ...cors, "Content-Type": "application/json" } });

    // Verify caller is staff
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

    const senderEmail = "hello@webfluid.in";
    const body: any = {
      sender: { name: fromName || "Webfluid", email: senderEmail },
      to: [{ email: to }],
      subject,
      htmlContent: htmlBody,
      attachment: [{ name: pdfFilename, content: pdfBase64 }],
    };
    if (cc) body.cc = [{ email: cc }];
    if (replyTo) body.replyTo = { email: replyTo };

    const resp = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-key": brevo, accept: "application/json" },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const err = await resp.text();
      console.error("Brevo error", resp.status, err);
      return new Response(JSON.stringify({ error: "Send failed", details: err }), { status: 502, headers: { ...cors, "Content-Type": "application/json" } });
    }

    if (invoiceId) {
      await admin.from("invoices").update({ status: "sent", sent_to_email: to, sent_at: new Date().toISOString() }).eq("id", invoiceId);
    }

    return new Response(JSON.stringify({ ok: true }), { headers: { ...cors, "Content-Type": "application/json" } });
  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ error: e.message ?? "Server error" }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
  }
});
