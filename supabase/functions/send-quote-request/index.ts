import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface QuoteRequest {
  name: string;
  phone: string;
  email: string;
  businessName: string;
  websiteType: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    if (!brevoApiKey) {
      throw new Error("BREVO_API_KEY is not configured");
    }

    const { name, phone, email, businessName, websiteType, message }: QuoteRequest = await req.json();

    // Validate required fields
    if (!name || !phone || !email || !businessName || !websiteType) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Map website type to readable format
    const websiteTypeLabel = websiteType === "ecommerce" ? "E-Commerce Website" : "Business Website";

    // Email content
    const emailHtml = `
      <h2>New Quote Request from Webfluid Website</h2>
      <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Name</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Phone</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${phone}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Business Name</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${businessName}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Website Type</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${websiteTypeLabel}</td>
        </tr>
        ${message ? `
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Message</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${message}</td>
        </tr>
        ` : ""}
      </table>
      <p style="margin-top: 20px; color: #666;">This quote request was submitted via the Webfluid website.</p>
    `;

    // Send email via Brevo API
    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "api-key": brevoApiKey,
      },
      body: JSON.stringify({
        sender: {
          name: "Webfluid Website",
          email: "noreply@webfluid.in",
        },
        to: [
          {
            email: "info@webfluid.in",
            name: "Webfluid Team",
          },
        ],
        replyTo: {
          email: email,
          name: name,
        },
        subject: `New Quote Request: ${businessName} - ${websiteTypeLabel}`,
        htmlContent: emailHtml,
      }),
    });

    if (!brevoResponse.ok) {
      const errorData = await brevoResponse.text();
      console.error("Brevo API error:", errorData);
      throw new Error(`Failed to send email: ${errorData}`);
    }

    console.log("Quote request email sent successfully for:", businessName);

    return new Response(
      JSON.stringify({ success: true, message: "Quote request sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-quote-request function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
