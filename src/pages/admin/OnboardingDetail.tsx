import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, UserPlus } from "lucide-react";

const OnboardingDetail = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { toast } = useToast();
  const [row, setRow] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("new");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("onboarding_submissions").select("*").eq("id", id).single();
      if (data) {
        setRow(data);
        setNotes(data.admin_notes ?? "");
        setStatus(data.status);
        if (data.logo_storage_path) {
          const { data: signed } = await supabase.storage.from("onboarding-uploads").createSignedUrl(data.logo_storage_path, 3600);
          if (signed) setLogoUrl(signed.signedUrl);
        }
      }
    })();
  }, [id]);

  const save = async () => {
    const { error } = await supabase.from("onboarding_submissions").update({ status: status as any, admin_notes: notes }).eq("id", id!);
    if (error) return toast({ title: "Save failed", description: error.message, variant: "destructive" });
    toast({ title: "Saved" });
    setRow({ ...row, status, admin_notes: notes });
  };

  const convertToClient = async () => {
    if (!row) return;
    const d = row.data ?? {};
    const { data: client, error } = await supabase.from("clients").insert({
      full_name: row.full_name,
      business_name: row.business_name,
      email: row.email,
      phone: row.phone,
      whatsapp: d.whatsapp || null,
      country: d.country || null,
      city: d.city || null,
      website: d.existingWebsite || null,
    }).select().single();
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    await supabase.from("onboarding_submissions").update({ client_id: client.id, status: "won" as any }).eq("id", id!);
    toast({ title: "Client created" });
    nav(`/admin/clients/${client.id}`);
  };

  if (!row) return <div className="p-8">Loading…</div>;
  const d = row.data ?? {};

  const Section = ({ title, entries }: { title: string; entries: [string, any][] }) => {
    const filtered = entries.filter(([, v]) => v && (!Array.isArray(v) || v.length));
    if (!filtered.length) return null;
    return (
      <Card className="p-5">
        <h3 className="font-semibold mb-3 text-primary">{title}</h3>
        <dl className="text-sm space-y-2">
          {filtered.map(([k, v]) => (
            <div key={k} className="grid grid-cols-3 gap-3">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="col-span-2 whitespace-pre-wrap break-words">
                {Array.isArray(v) ? v.join(", ") : typeof v === "object" ? JSON.stringify(v) : String(v)}
              </dd>
            </div>
          ))}
        </dl>
      </Card>
    );
  };

  return (
    <div className="max-w-4xl space-y-4">
      <Link to="/admin/onboarding" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </Link>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-display font-bold">{row.business_name}</h2>
          <p className="text-sm text-muted-foreground">{row.full_name} · {row.email} · {row.phone}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={row.status} />
          {!row.client_id && (
            <Button onClick={convertToClient} size="sm">
              <UserPlus className="w-4 h-4 mr-2" /> Convert to client
            </Button>
          )}
        </div>
      </div>

      <Card className="p-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="proposal_sent">Proposal sent</SelectItem>
                <SelectItem value="won">Won</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Admin notes</label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
          </div>
        </div>
        <Button className="mt-4" onClick={save}>Save</Button>
      </Card>

      <Section title="About" entries={[["Name", row.full_name], ["Business", row.business_name], ["Email", row.email], ["Phone", row.phone], ["WhatsApp", d.whatsapp], ["Country", d.country], ["City", d.city], ["Preferred contact time", d.preferredContactTime]]} />
      <Section title="Services" entries={[["Selected", row.services]]} />
      <Section title="Business profile" entries={[["About", d.aboutBusiness], ["Industry", d.industry], ["Target audience", d.targetAudience], ["Existing website", d.existingWebsite], ["Design references", d.designReferences], ["Brand colors", (d.brandColors ?? []).filter(Boolean)], ["Palette notes", d.brandColorsNote], ["Socials", Object.entries(d.socials ?? {}).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`)]]} />
      {logoUrl && (
        <Card className="p-5">
          <h3 className="font-semibold mb-3 text-primary">Logo</h3>
          <a href={logoUrl} target="_blank" rel="noopener noreferrer"><img src={logoUrl} alt="logo" className="max-h-32 border rounded" /></a>
        </Card>
      )}
      <Section title="Website requirements" entries={[["Platform", d.platform], ["Page scope", d.pageScope], ["Extra pages count", d.extraPagesCount], ["Extra pages list", d.extraPagesList], ["Product count", d.ecomProductCount], ["Import help", d.ecomImportHelp], ["Payment gateways", d.ecomPaymentGateways], ["Shipping regions", d.ecomShippingRegions], ["Domain name", d.domainName], ["Domain status", d.domainStatus], ["Registrar", d.domainRegistrar], ["Hosting", d.hosting], ["Content readiness", d.contentReadiness], ["Multilingual", d.multilingual], ["Languages", d.languages], ["Launch date", d.launchDate]]} />
      <Section title="Marketing" entries={[["Goals", d.marketingGoals], ["Target customer", d.targetCustomerBrief], ["Keywords", d.keywords], ["Target locations", d.targetLocations], ["Competitors", d.competitors], ["Google Ads budget", d.googleAdsBudget], ["Meta Ads budget", d.metaAdsBudget], ["Google Ads account", d.googleAdsAccountId], ["Meta Business Manager", d.metaBusinessId], ["Existing tracking", d.existingTracking], ["GMB URL", d.gmbUrl]]} />
      <Section title="Add-ons" entries={[["Selected", d.addons], ["Notes", d.addonsNote]]} />
      <Section title="Budget & timeline" entries={[["Overall budget", d.overallBudget], ["Timeline", d.timelineUrgency], ["Referral", d.referralSource], ["Additional notes", d.additionalNotes]]} />
    </div>
  );
};

export default OnboardingDetail;
