
# Client Onboarding Page — Multi-Step Requirements Form

A dedicated `/onboarding` page with a beautiful, step-by-step wizard, progress bar, conditional sections based on service type, and email delivery to `hello@webfluid.in`. Admin panel is scoped as Phase 2.

## Route & Entry Points

- New route `/onboarding` (page: `src/pages/Onboarding.tsx`).
- Add "Start Onboarding" links in Navbar CTA (secondary), Footer, and CTASection alongside the existing quote dialog.

## Wizard Structure (progress bar + step nav)

**Step 1 — About You**
- Full name, business name, email, phone, WhatsApp (optional), country, city, preferred contact time.

**Step 2 — Services Needed** (multi-select, drives which later steps show)
- Business Website (WordPress)
- E-Commerce Website (WooCommerce / Shopify)
- SEO
- Google Ads (Search, Display, Performance Max, Shopping)
- Google Merchant Center setup
- Google My Business optimization
- Meta Ads (Shopping via feeds, Awareness, Lead gen)
- Only Consulting / Not sure yet

**Step 3 — Business Profile** (always)
- About us / business description
- Industry/category
- Target audience (short brief)
- Social media URLs (Facebook, Instagram, LinkedIn, YouTube, TikTok, X — all optional)
- Existing website URL (if any)
- Logo upload (optional, image file)
- Brand colors (optional — up to 3 color pickers + free text)
- Design/inspiration reference URLs (optional, multi-line)

**Step 4 — Website Requirements** (only if a website service selected)
- Platform preference: WordPress, Shopify, WooCommerce, No preference
- Page scope: Single page / Basic 5-page (About, Contact, Services, Privacy, Terms) / 5+ pages (with count + list of extra pages)
- For eCommerce: approx product count, need product import help?, payment gateways needed (Stripe, Razorpay, PayPal, COD, other), shipping regions
- Domain:
  - Suggested domain name
  - Radio: "I already purchased the domain" / "Please help me register one"
  - If purchased: registrar name
- Hosting: Standard (free 1 yr with package) / Premium (Cloudways — extra cost) / I have my own hosting
- Content readiness: I'll provide all content / I need copywriting help / Mix
- Multilingual? languages list
- Target launch date

**Step 5 — Marketing Requirements** (only if any marketing service selected)
- Primary marketing goals (multi-select: Leads, Sales, Traffic, Brand awareness, App installs, Store visits)
- Target customer brief (textarea)
- Suggested keywords / search terms (textarea)
- Target locations / countries (textarea)
- Competitors (URLs, optional)
- Monthly ad spend budget (select ranges) — separate for Google Ads and Meta Ads if both selected
- Existing ad accounts? (Google Ads ID, Meta Business Manager ID — optional)
- Existing GA4 / GSC / GMC / Pixel setup? (checkboxes)
- GMB listing exists? URL

**Step 6 — Optional Add-ons** (checkboxes with short descriptions)
- Custom business email (info@yourdomain.com)
- Transactional email provider integration (SendGrid / Brevo / Mailgun) — better deliverability for WP/WooCommerce
- Login security: reCAPTCHA on login, 2FA, limit login attempts
- Form spam protection: reCAPTCHA, Akismet, Cloudflare Turnstile
- Image optimization plugin
- SEO plugin (Yoast / RankMath)
- Google Analytics 4 integration
- Google Search Console integration
- Facebook/Meta Pixel integration
- Cookie consent / GDPR banner
- Backup & auto-update service
- SSL (usually included — confirm)
- Sitemap + robots.txt setup
- Schema markup / rich snippets

**Step 7 — Budget & Timeline**
- Overall project budget range
- Timeline urgency (ASAP / 2–4 weeks / 1–2 months / Flexible)
- How did you hear about us? (dropdown)
- Anything else (free text)

**Step 8 — Review & Submit**
- Read-only summary of all entered data grouped by step
- Checkbox: agree to be contacted; link to Privacy Policy
- Submit button → success screen with next steps + WhatsApp CTA.

## UX Details

- Sticky progress bar with step labels (horizontal on desktop, compact on mobile).
- Prev / Next buttons; Next validates current step only.
- Auto-save to `localStorage` per step so refresh doesn't lose data.
- Smooth transitions between steps.
- Uses existing design tokens (primary blue #1E5FAD, primary green #5DC43C), gradient-bg buttons, shadcn components.

## Backend

- New Supabase Storage bucket `onboarding-uploads` (public read of logos not needed — use signed URL in email) for optional logo file.
- New edge function `send-onboarding-request` mirroring the security posture of `send-quote-request`:
  - Locked CORS, rate limit (3/min/IP), input length caps, HTML-escape all fields.
  - Zod-style validation for required fields.
  - Sends nicely formatted HTML email via Brevo to `hello@webfluid.in`, reply-to = client email, subject `New Onboarding: {business} — {services}`.
  - Includes logo as inline attachment link (signed URL, 30-day expiry) if uploaded.
- No database table in this phase (Phase 2 will add `onboarding_submissions` + admin panel + auth + invoicing + renewals).

## Phase 2 (not built now, acknowledged)

Admin panel with:
- Auth (email + Google)
- `onboarding_submissions` table with RLS + admin role
- Client list, detail view, status pipeline (New → Contacted → Proposal → Won/Lost)
- Invoicing module
- Renewal management (domains, hosting, plugins, ad retainers) with reminder emails

I will build Phase 1 now and confirm before starting Phase 2.

## Files to Create/Modify

- Create `src/pages/Onboarding.tsx`
- Create `src/components/onboarding/` — `OnboardingWizard.tsx`, `ProgressBar.tsx`, and one file per step (`Step1About.tsx` … `Step8Review.tsx`), plus `types.ts` and `schema.ts` (zod).
- Modify `src/App.tsx` — add `/onboarding` route.
- Modify `src/components/Navbar.tsx`, `src/components/Footer.tsx`, `src/components/CTASection.tsx` — add link.
- Create `supabase/functions/send-onboarding-request/index.ts`.
- Create Storage bucket `onboarding-uploads` (private) via migration/tool.
