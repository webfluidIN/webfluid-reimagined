import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus } from "lucide-react";

const ClientDetail = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { toast } = useToast();
  const [client, setClient] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [renewals, setRenewals] = useState<any[]>([]);
  const [subs, setSubs] = useState<any[]>([]);

  const load = async () => {
    const [c, i, r, s] = await Promise.all([
      supabase.from("clients").select("*").eq("id", id).single(),
      supabase.from("invoices").select("*").eq("client_id", id).order("issue_date", { ascending: false }),
      supabase.from("renewals").select("*").eq("client_id", id).order("renews_on"),
      supabase.from("onboarding_submissions").select("id, business_name, status, created_at").eq("client_id", id),
    ]);
    setClient(c.data);
    setInvoices(i.data ?? []);
    setRenewals(r.data ?? []);
    setSubs(s.data ?? []);
  };
  useEffect(() => { load(); }, [id]);

  const save = async () => {
    const { error } = await supabase.from("clients").update({
      full_name: client.full_name, business_name: client.business_name, email: client.email, phone: client.phone,
      whatsapp: client.whatsapp, country: client.country, city: client.city, website: client.website, notes: client.notes,
      address: client.address,
    } as any).eq("id", id!);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: "Saved" });
  };

  if (!client) return <div className="p-8">Loading…</div>;

  return (
    <div className="max-w-5xl space-y-4">
      <Link to="/admin/clients" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </Link>
      <h2 className="text-2xl font-display font-bold">{client.business_name}</h2>

      <Card className="p-5">
        <h3 className="font-semibold mb-3">Contact</h3>
        <div className="grid md:grid-cols-2 gap-3">
          <div><Label>Full name</Label><Input value={client.full_name || ""} onChange={(e) => setClient({ ...client, full_name: e.target.value })} /></div>
          <div><Label>Business</Label><Input value={client.business_name || ""} onChange={(e) => setClient({ ...client, business_name: e.target.value })} /></div>
          <div><Label>Email</Label><Input value={client.email || ""} onChange={(e) => setClient({ ...client, email: e.target.value })} /></div>
          <div><Label>Phone</Label><Input value={client.phone || ""} onChange={(e) => setClient({ ...client, phone: e.target.value })} /></div>
          <div><Label>WhatsApp</Label><Input value={client.whatsapp || ""} onChange={(e) => setClient({ ...client, whatsapp: e.target.value })} /></div>
          <div><Label>Website</Label><Input value={client.website || ""} onChange={(e) => setClient({ ...client, website: e.target.value })} /></div>
          <div><Label>City</Label><Input value={client.city || ""} onChange={(e) => setClient({ ...client, city: e.target.value })} /></div>
          <div><Label>Country</Label><Input value={client.country || ""} onChange={(e) => setClient({ ...client, country: e.target.value })} /></div>
        </div>
        <div className="mt-3"><Label>Notes</Label><Textarea value={client.notes || ""} onChange={(e) => setClient({ ...client, notes: e.target.value })} rows={3} /></div>
        <Button onClick={save} className="mt-3">Save</Button>
      </Card>

      <Card className="p-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">Invoices</h3>
          <Button size="sm" onClick={() => nav(`/admin/invoices/new?client=${id}`)}><Plus className="w-4 h-4 mr-1" /> New invoice</Button>
        </div>
        {invoices.length === 0 ? <p className="text-sm text-muted-foreground">None yet.</p> : (
          <ul className="divide-y">
            {invoices.map((iv) => (
              <li key={iv.id}>
                <Link to={`/admin/invoices/${iv.id}`} className="flex justify-between py-2 hover:bg-muted/30 -mx-2 px-2 rounded">
                  <span className="font-mono text-sm">{iv.invoice_number}</span>
                  <span className="text-sm">{iv.currency} {Number(iv.total).toLocaleString()}</span>
                  <StatusBadge status={iv.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="p-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">Renewals</h3>
          <Button size="sm" onClick={() => nav(`/admin/renewals?client=${id}`)}><Plus className="w-4 h-4 mr-1" /> Manage renewals</Button>
        </div>
        {renewals.length === 0 ? <p className="text-sm text-muted-foreground">None tracked.</p> : (
          <ul className="divide-y text-sm">
            {renewals.map((r) => (
              <li key={r.id} className="flex justify-between py-2">
                <span>{r.label} <span className="text-xs text-muted-foreground">({r.type})</span></span>
                <span>{r.renews_on}</span>
                <StatusBadge status={r.status} />
              </li>
            ))}
          </ul>
        )}
      </Card>

      {subs.length > 0 && (
        <Card className="p-5">
          <h3 className="font-semibold mb-3">Linked submissions</h3>
          <ul className="text-sm space-y-1">
            {subs.map((s) => (
              <li key={s.id}>
                <Link to={`/admin/onboarding/${s.id}`} className="hover:text-primary">
                  {s.business_name} · {new Date(s.created_at).toLocaleDateString()} · {s.status}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

export default ClientDetail;
