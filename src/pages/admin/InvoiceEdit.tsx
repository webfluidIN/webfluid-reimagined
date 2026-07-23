import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

interface Item { id?: string; description: string; quantity: number; unit_price: number; }

const genNumber = () => {
  const d = new Date();
  return `INV-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${Math.floor(Math.random() * 9000 + 1000)}`;
};

const InvoiceEdit = () => {
  const { id } = useParams();
  const isNew = id === "new";
  const nav = useNavigate();
  const { toast } = useToast();
  const [sp] = useSearchParams();
  const [clients, setClients] = useState<any[]>([]);
  const [inv, setInv] = useState<any>({
    client_id: sp.get("client") || "",
    invoice_number: genNumber(),
    issue_date: new Date().toISOString().slice(0, 10),
    due_date: "",
    currency: "INR",
    tax_percent: 0,
    discount: 0,
    status: "draft",
    notes: "",
  });
  const [items, setItems] = useState<Item[]>([{ description: "", quantity: 1, unit_price: 0 }]);

  useEffect(() => {
    supabase.from("clients").select("id, business_name").order("business_name").then(({ data }) => setClients(data ?? []));
    if (!isNew && id) {
      (async () => {
        const [i, it] = await Promise.all([
          supabase.from("invoices").select("*").eq("id", id).single(),
          supabase.from("invoice_items").select("*").eq("invoice_id", id).order("position"),
        ]);
        if (i.data) setInv(i.data);
        if (it.data && it.data.length) setItems(it.data.map((x: any) => ({ id: x.id, description: x.description, quantity: Number(x.quantity), unit_price: Number(x.unit_price) })));
      })();
    }
  }, [id, isNew]);

  const subtotal = useMemo(() => items.reduce((a, it) => a + it.quantity * it.unit_price, 0), [items]);
  const taxAmount = subtotal * (Number(inv.tax_percent) || 0) / 100;
  const total = subtotal + taxAmount - (Number(inv.discount) || 0);

  const save = async () => {
    if (!inv.client_id) return toast({ title: "Select a client", variant: "destructive" });
    const payload: any = {
      ...inv,
      due_date: inv.due_date || null,
      issue_date: inv.issue_date || new Date().toISOString().slice(0, 10),
      tax_percent: Number(inv.tax_percent) || 0,
      discount: Number(inv.discount) || 0,
      subtotal,
      tax_amount: taxAmount,
      total,
    };
    let invoiceId = id!;
    if (isNew) {
      const { data, error } = await supabase.from("invoices").insert(payload).select().single();
      if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
      invoiceId = data.id;
    } else {
      const { error } = await supabase.from("invoices").update(payload).eq("id", id!);
      if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
      await supabase.from("invoice_items").delete().eq("invoice_id", id!);
    }
    if (items.length) {
      await supabase.from("invoice_items").insert(
        items.map((it, idx) => ({
          invoice_id: invoiceId,
          description: it.description,
          quantity: it.quantity,
          unit_price: it.unit_price,
          amount: it.quantity * it.unit_price,
          position: idx,
        })),
      );
    }
    toast({ title: "Saved" });
    nav(`/admin/invoices/${invoiceId}`);
  };

  return (
    <div className="max-w-4xl space-y-4">
      <Link to="/admin/invoices" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </Link>
      <h2 className="text-2xl font-display font-bold">{isNew ? "New Invoice" : "Edit Invoice"}</h2>

      <Card className="p-5 space-y-4">
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <Label>Client *</Label>
            <Select value={inv.client_id} onValueChange={(v) => setInv({ ...inv, client_id: v })}>
              <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
              <SelectContent>
                {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.business_name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div><Label>Invoice #</Label><Input value={inv.invoice_number} onChange={(e) => setInv({ ...inv, invoice_number: e.target.value })} /></div>
          <div><Label>Issue date</Label><Input type="date" value={inv.issue_date} onChange={(e) => setInv({ ...inv, issue_date: e.target.value })} /></div>
          <div><Label>Due date</Label><Input type="date" value={inv.due_date || ""} onChange={(e) => setInv({ ...inv, due_date: e.target.value })} /></div>
          <div><Label>Currency</Label><Input value={inv.currency} onChange={(e) => setInv({ ...inv, currency: e.target.value })} /></div>
          <div>
            <Label>Status</Label>
            <Select value={inv.status} onValueChange={(v) => setInv({ ...inv, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="void">Void</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold mb-3">Line items</h3>
        <div className="space-y-2">
          {items.map((it, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-6"><Label className="text-xs">Description</Label><Input value={it.description} onChange={(e) => { const n = [...items]; n[i].description = e.target.value; setItems(n); }} /></div>
              <div className="col-span-2"><Label className="text-xs">Qty</Label><Input type="number" step="0.01" value={it.quantity} onChange={(e) => { const n = [...items]; n[i].quantity = Number(e.target.value); setItems(n); }} /></div>
              <div className="col-span-2"><Label className="text-xs">Unit price</Label><Input type="number" step="0.01" value={it.unit_price} onChange={(e) => { const n = [...items]; n[i].unit_price = Number(e.target.value); setItems(n); }} /></div>
              <div className="col-span-1 text-right text-sm font-mono">{(it.quantity * it.unit_price).toFixed(2)}</div>
              <div className="col-span-1"><Button variant="ghost" size="icon" onClick={() => setItems(items.filter((_, idx) => idx !== i))}><Trash2 className="w-4 h-4" /></Button></div>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => setItems([...items, { description: "", quantity: 1, unit_price: 0 }])}>
            <Plus className="w-4 h-4 mr-1" /> Add line
          </Button>
        </div>

        <div className="mt-6 border-t pt-4 space-y-2 max-w-sm ml-auto text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span className="font-mono">{subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between items-center gap-2">
            <span>Tax %</span>
            <Input className="w-24 h-8" type="number" step="0.01" value={inv.tax_percent} onChange={(e) => setInv({ ...inv, tax_percent: Number(e.target.value) })} />
            <span className="font-mono">{taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center gap-2">
            <span>Discount</span>
            <Input className="w-24 h-8" type="number" step="0.01" value={inv.discount} onChange={(e) => setInv({ ...inv, discount: Number(e.target.value) })} />
          </div>
          <div className="flex justify-between font-bold text-base pt-2 border-t"><span>Total</span><span className="font-mono">{inv.currency} {total.toFixed(2)}</span></div>
        </div>
      </Card>

      <Card className="p-5">
        <Label>Notes</Label>
        <Textarea rows={3} value={inv.notes || ""} onChange={(e) => setInv({ ...inv, notes: e.target.value })} />
      </Card>

      <Button onClick={save} size="lg" className="gradient-bg">Save invoice</Button>
    </div>
  );
};

export default InvoiceEdit;
