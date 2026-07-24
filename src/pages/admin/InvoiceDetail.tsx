import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ArrowLeft, Pencil, Printer, Mail, FileCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { loadCompanySettings, type CompanySettings } from "@/lib/companySettings";
import { EmailDocumentDialog } from "@/components/admin/EmailDocumentDialog";
import { DocumentTemplate } from "@/components/admin/DocumentTemplate";

const InvoiceDetail = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { toast } = useToast();
  const [inv, setInv] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [client, setClient] = useState<any>(null);
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [emailOpen, setEmailOpen] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    const { data: i } = await supabase.from("invoices").select("*").eq("id", id).single();
    if (!i) return;
    setInv(i);
    const [it, c, cs] = await Promise.all([
      supabase.from("invoice_items").select("*").eq("invoice_id", id).order("position"),
      supabase.from("clients").select("*").eq("id", i.client_id).single(),
      loadCompanySettings(),
    ]);
    setItems(it.data ?? []);
    setClient(c.data);
    setSettings(cs.settings);
    setLogoUrl(cs.logoUrl);
  };
  useEffect(() => { load(); }, [id]);

  const setStatus = async (s: string) => {
    const patch: any = { status: s };
    if (s === "paid") patch.paid_at = new Date().toISOString();
    const { error } = await supabase.from("invoices").update(patch).eq("id", id!);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    load();
  };

  const convertToInvoice = async () => {
    const { data, error } = await supabase.from("invoices").insert({
      client_id: inv.client_id,
      document_type: "invoice",
      invoice_number: inv.invoice_number.replace(/^Q-/, "INV-"),
      issue_date: new Date().toISOString().slice(0, 10),
      currency: inv.currency,
      tax_percent: inv.tax_percent,
      discount: inv.discount,
      subtotal: inv.subtotal,
      tax_amount: inv.tax_amount,
      total: inv.total,
      notes: inv.notes,
      status: "draft",
      converted_from_id: inv.id,
    }).select().single();
    if (error || !data) return toast({ title: "Convert failed", description: error?.message, variant: "destructive" });
    if (items.length) {
      await supabase.from("invoice_items").insert(items.map((it, idx) => ({
        invoice_id: data.id, description: it.description, quantity: it.quantity, unit_price: it.unit_price, amount: it.amount, position: idx,
      })));
    }
    toast({ title: "Converted to invoice" });
    nav(`/admin/invoices/${data.id}`);
  };

  if (!inv || !client || !settings) return <div className="p-8">Loading…</div>;

  const isQuote = inv.document_type === "quote";
  const templateId = isQuote ? settings.quote_template : settings.invoice_template;

  return (
    <div className="max-w-4xl space-y-4">
      <div className="flex justify-between items-center print:hidden flex-wrap gap-2">
        <Link to={isQuote ? "/admin/invoices?tab=quotes" : "/admin/invoices"} className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Link>
        <div className="flex gap-2 flex-wrap">
          {inv.status !== "sent" && <Button size="sm" variant="outline" onClick={() => setStatus("sent")}>Mark sent</Button>}
          {!isQuote && inv.status !== "paid" && <Button size="sm" variant="outline" onClick={() => setStatus("paid")}>Mark paid</Button>}
          {isQuote && inv.status !== "paid" && <Button size="sm" variant="outline" onClick={() => setStatus("paid")}>Mark accepted</Button>}
          {isQuote && <Button size="sm" variant="outline" onClick={convertToInvoice}><FileCheck className="w-4 h-4 mr-1" /> Convert to invoice</Button>}
          <Button size="sm" variant="outline" onClick={() => setEmailOpen(true)}><Mail className="w-4 h-4 mr-1" /> Email</Button>
          <Button size="sm" variant="outline" onClick={() => window.print()}><Printer className="w-4 h-4 mr-1" /> Print</Button>
          <Button size="sm" onClick={() => nav(`/admin/invoices/${id}/edit`)}><Pencil className="w-4 h-4 mr-1" /> Edit</Button>
        </div>
      </div>

      <div className="print:hidden"><StatusBadge status={inv.status} /></div>

      <div ref={printRef}>
        <DocumentTemplate
          template={templateId as any}
          settings={settings}
          logoUrl={logoUrl}
          invoice={inv}
          items={items}
          client={client}
        />
      </div>

      <EmailDocumentDialog
        open={emailOpen}
        onOpenChange={setEmailOpen}
        invoice={inv}
        client={client}
        settings={settings}
        printRef={printRef}
        onSent={() => { setEmailOpen(false); load(); }}
      />
    </div>
  );
};

export default InvoiceDetail;
