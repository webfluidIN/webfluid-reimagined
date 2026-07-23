# Phase 2 — Admin Panel

Private admin area at `/admin` with email + Google login, restricted to your team, showing onboarding + quote submissions, plus lightweight invoicing and renewal management.

## Auth

- Email/password + Google sign-in (Lovable-managed, no extra config).
- New `/admin/login` page; all `/admin/*` routes protected by a client + server-side role check.
- **Roles table** (separate from profiles, security best-practice):
  - `app_role` enum: `admin`, `staff`
  - `user_roles` table + `has_role(uuid, app_role)` security-definer function
  - Only users with `admin` or `staff` role can access `/admin/*`
- On first deploy, I'll grant `admin` to your email (`hello@webfluid.in`) once you sign up.

## Database (all with RLS + admin-only policies)

1. `onboarding_submissions` — captures every wizard submission going forward (raw JSON + key columns like business_name, email, services, status). Status pipeline: `new → contacted → proposal_sent → won → lost`.
2. `quote_submissions` — same treatment for the existing quote form.
3. `clients` — promoted from a won submission (name, email, phone, business, notes).
4. `invoices` — client_id, number, issue_date, due_date, currency, subtotal, tax, total, status (`draft/sent/paid/overdue/void`), notes.
5. `invoice_items` — invoice_id, description, quantity, unit_price, amount.
6. `renewals` — client_id, type (`domain/hosting/plugin/ad_retainer/other`), label, vendor, cost, currency, renews_on, reminder_days_before, status, notes.
7. `user_roles` + `profiles` (display name/avatar).

Edge functions `send-onboarding-request` and `send-quote-request` will additionally insert rows into their tables (still sending email as today).

## Admin UI (`/admin`)

Sidebar layout (shadcn sidebar, collapsible):
- **Dashboard** — counts (new submissions, active clients, upcoming renewals ≤30 days, outstanding invoice total), recent activity.
- **Onboarding** — list + filter by status/service, detail drawer with full submission, status changer, "Convert to client" button.
- **Quotes** — same treatment for quote submissions.
- **Clients** — list, detail page with contact info, linked submissions, invoices, renewals, notes.
- **Invoices** — list with status filters, create/edit form with line items, auto-calculated totals, printable/PDF-ready detail view, mark as sent/paid.
- **Renewals** — list sorted by renews_on, filter by type/status, mark renewed (auto-advances date by 1 year), quick add.
- **Settings** — profile, sign out. (Team user management deferred.)

## Renewal reminders

Scheduled edge function `renewal-reminder-daily` (runs daily via Supabase cron): finds renewals where `renews_on - reminder_days_before <= today` and status is active, emails `hello@webfluid.in` via Brevo with a summary. Idempotent (tracks `last_reminded_on`).

## Out of scope (can add later)

- Client-facing portal / invoice payment links
- Multi-user team invites & granular permissions
- PDF generation server-side (initial version = print-optimized HTML)
- Recurring invoice automation

## Files

- Migrations: enum, tables, RLS, GRANTs, `has_role`, triggers for updated_at.
- New pages: `src/pages/admin/{Login,Layout,Dashboard,Onboarding,OnboardingDetail,Quotes,QuoteDetail,Clients,ClientDetail,Invoices,InvoiceEdit,InvoiceDetail,Renewals,Settings}.tsx`
- `src/components/admin/AppSidebar.tsx`, `RequireAdmin.tsx`, submission/invoice/renewal forms & tables.
- Update `send-onboarding-request` + `send-quote-request` to also insert into tables (email still sent).
- New edge function `renewal-reminder-daily` + cron entry.
- `src/App.tsx` — add `/admin/*` routes.

Approve and I'll build it in that order (auth + roles + tables first, then dashboard/submissions, then clients/invoices/renewals, then the reminder cron).