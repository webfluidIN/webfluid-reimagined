
-- Revoke over-permissive privileges from anon on all public tables
REVOKE ALL ON public.profiles, public.user_roles, public.onboarding_submissions,
  public.quote_submissions, public.clients, public.invoices, public.invoice_items,
  public.renewals FROM anon;

-- Re-grant only what authenticated needs (staff-only tables). RLS still enforces access.
REVOKE ALL ON public.profiles, public.user_roles, public.onboarding_submissions,
  public.quote_submissions, public.clients, public.invoices, public.invoice_items,
  public.renewals FROM authenticated;

GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.onboarding_submissions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quote_submissions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoices TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoice_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.renewals TO authenticated;

GRANT ALL ON public.profiles, public.user_roles, public.onboarding_submissions,
  public.quote_submissions, public.clients, public.invoices, public.invoice_items,
  public.renewals TO service_role;

-- Drop overly-permissive anon INSERT policies (public forms go through edge
-- functions using the service role, which bypasses RLS)
DROP POLICY IF EXISTS "Anyone can submit onboarding" ON public.onboarding_submissions;
DROP POLICY IF EXISTS "Anyone can submit quote" ON public.quote_submissions;

-- Lock down SECURITY DEFINER helper functions so only privileged roles can call them
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_staff(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO authenticated, service_role;
