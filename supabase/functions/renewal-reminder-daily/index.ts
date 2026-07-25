import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

serve(async () => {
  try {
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const brevo = Deno.env.get("BREVO_API_KEY");
    if (!brevo) return new Response("no key", { status: 500 });

    const { data: settings } = await admin
      .from("company_settings")
      .select("renewal_notify_enabled, renewal_notify_email, renewal_notify_days")
      .limit(1)
      .maybeSingle();

    if (settings && settings.renewal_notify_enabled === false) {
      return new Response(JSON.stringify({ skipped: "disabled" }), { headers: { "Content-Type": "application/json" } });
    }

    const notifyEmail = (settings?.renewal_notify_email || "info@webfluid.in").trim();
    const notifyDays: number[] = Array.isArray(settings?.renewal_notify_days) && settings!.renewal_notify_days.length
      ? settings!.renewal_notify_days.map((n: any) => Number(n)).filter((n) => Number.isFinite(n))
      : [1, 15];
    const maxDays = Math.max(...notifyDays);

    const today = new Date();
    const todayISO = today.toISOString().slice(0, 10);

    const { data: rows } = await admin
      .from("renewals")
      .select("*, clients(business_name, email)")
      .eq("status", "active");

    const due = (rows ?? []).filter((r: any) => {
      const days = Math.ceil((new Date(r.renews_on).getTime() - today.getTime()) / 86400000);
      // Notify if overdue, or if days-remaining matches any configured threshold,
      // or is within the largest configured window (catches missed days).
      const matches = days < 0 || notifyDays.includes(days) || days <= maxDays;
      return matches && r.last_reminded_on !== todayISO;
    });

    if (due.length === 0) {
      return new Response(JSON.stringify({ sent: 0 }), { headers: { "Content-Type": "application/json" } });
    }

    const esc = (s: any) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
    const rowsHtml = due.map((r: any) => {
      const days = Math.ceil((new Date(r.renews_on).getTime() - today.getTime()) / 86400000);
      return `<tr>
        <td style="padding:8px;border:1px solid #e5e7eb;">${esc(r.clients?.business_name || "—")}</td>
        <td style="padding:8px;border:1px solid #e5e7eb;">${esc(r.label)} <em>(${esc(r.type)})</em></td>
        <td style="padding:8px;border:1px solid #e5e7eb;">${esc(r.vendor || "")}</td>
        <td style="padding:8px;border:1px solid #e5e7eb;">${esc(r.renews_on)}</td>
        <td style="padding:8px;border:1px solid #e5e7eb;font-weight:600;color:${days < 0 ? "#dc2626" : days <= 7 ? "#ea580c" : "#1E5FAD"};">${days < 0 ? `${-days}d overdue` : `${days} days`}</td>
        <td style="padding:8px;border:1px solid #e5e7eb;">${r.cost ? `${esc(r.currency)} ${esc(r.cost)}` : ""}</td>
      </tr>`;
    }).join("");

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:720px;margin:0 auto;">
        <h2 style="color:#1E5FAD;">Upcoming renewals — ${todayISO}</h2>
        <p>${due.length} item${due.length === 1 ? "" : "s"} need${due.length === 1 ? "s" : ""} attention.</p>
        <table style="border-collapse:collapse;width:100%;font-size:14px;">
          <thead><tr style="background:#f9fafb;">
            <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Client</th>
            <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Item</th>
            <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Vendor</th>
            <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Renews on</th>
            <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Due</th>
            <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Cost</th>
          </tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>`;

    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json", "api-key": brevo },
      body: JSON.stringify({
        sender: { name: "Webfluid Admin", email: "noreply@webfluid.in" },
        to: [{ email: notifyEmail, name: "Webfluid Team" }],
        subject: `Renewals reminder: ${due.length} item(s) due`,
        htmlContent: html,
      }),
    });

    await admin.from("renewals").update({ last_reminded_on: todayISO }).in("id", due.map((r: any) => r.id));

    return new Response(JSON.stringify({ sent: due.length, to: notifyEmail }), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});
