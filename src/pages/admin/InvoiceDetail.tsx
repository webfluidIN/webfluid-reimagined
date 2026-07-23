import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ArrowLeft, Pencil, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const InvoiceDetail = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { toast } = useToast();
  const [inv, setInv] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [client, setClient] = useState<any>(null);

  const load = async () => {
    const { data: i } = await supabase.from("invoices").select("*").eq("id", id).single();
    if (!i) return;
    setInv(i);
    const [it, c] = await Promise.all([
      supabase.from("invoice_items").select("*").eq("invoice_id", id).order("position"),
      supabase.from("clients").select("*").eq("id", i.client_id).single(),
    ]);
    setItems(it.data ?? []);
    setClient(c.data);
  };
  useEffect(() => { load(); }, [id]);

  const setStatus = async (s: string) => {
    const patch: any = { status: s };
    if (s === "paid") patch.paid_at = new Date().toISOString();
    const { error } = await supabase.from("invoices").update(patch).eq("id", id!);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    load();
  };

  if (!inv || !client) return <div className="p-8">Loading…</div>;

  return (
    <div className="max-w-4xl space-y-4">
      <div className="flex justify-between items-center print:hidden">
        <Link to="/admin/invoices" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Link>
        <div className="flex gap-2">
          {inv.status !== "sent" && <Button size="sm" variant="outline" onClick={() => setStatus("sent")}>Mark sent</Button>}
          {inv.status !== "paid" && <Button size="sm" variant="outline" onClick={() => setStatus("paid")}>Mark paid</Button>}
          <Button size="sm" variant="outline" onClick={() => window.print()}><Printer className="w-4 h-4 mr-1" /> Print</Button>
          <Button size="sm" onClick={() => nav(`/admin/invoices/${id}/edit`)}><Pencil className="w-4 h-4 mr-1" /> Edit</Button>
        </div>
      </div>

      <Card className="p-8 print:shadow-none print:border-none">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-primary">INVOICE</h1>
            <p className="text-sm text-muted-foreground mt-1">#{inv.invoice_number}</p>
            <div className="mt-2"><StatusBadge status={inv.status} /></div>
          </div>
          <div className="text-right">
            <div className="text-xl font-display font-bold">Webfluid</div>
            <div className="text-xs text-muted-foreground">hello@webfluid.in<br />webfluid.in</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
          <div>
            <div className="text-xs uppercase text-muted-foreground mb-1">Bill to</div>
            <div className="font-semibold">{client.business_name}</div>
            <div>{client.full_name}</div>
            <div className="text-muted-foreground">{client.email}</div>
            <div className="text-muted-foreground">{client.phone}</div>
          </div>
          <div className="text-right">
            <div><span className="text-muted-foreground">Issue: </span>{inv.issue_date}</div>
            {inv.due_date && <div><span className="text-muted-foreground">Due: </span>{inv.due_date}</div>}
          </div>
        </div>

        <table className="w-full text-sm mb-6">
          <thead className="border-b">
            <tr>
              <th className="text-left py-2">Description</th>
              <th className="text-right py-2 w-20">Qty</th>
              <th className="text-right py-2 w-28">Unit price</th>
              <th className="text-right py-2 w-28">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-b">
                <td className="py-3">{it.description}</td>
                <td className="text-right">{Number(it.quantity)}</td>
                <td className="text-right font-mono">{Number(it.unit_price).toFixed(2)}</td>
                <td className="text-right font-mono">{Number(it.amount).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="ml-auto max-w-xs text-sm space-y-1">
          <div className="flex justify-between"><span>Subtotal</span><span className="font-mono">{Number(inv.subtotal).toFixed(2)}</span></div>
          {Number(inv.tax_amount) > 0 && <div className="flex justify-between"><span>Tax ({inv.tax_percent}%)</span><span className="font-mono">{Number(inv.tax_amount).toFixed(2)}</span></div>}
          {Number(inv.discount) > 0 && <div className="flex justify-between"><span>Discount</span><span className="font-mono">-{Number(inv.discount).toFixed(2)}</span></div>}
          <div className="flex justify-between font-bold text-base pt-2 border-t"><span>Total</span><span className="font-mono">{inv.currency} {Number(inv.total).toFixed(2)}</span></div>
        </div>

        {inv.notes && <div className="mt-8 pt-4 border-t text-sm"><div className="text-xs uppercase text-muted-foreground mb-1">Notes</div><div className="whitespace-pre-wrap">{inv.notes}</div></div>}
      </Card>
    </div>
  );
};

export default InvoiceDetail;
