import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useToast } from "@/hooks/use-toast";
import { Plus, RefreshCw } from "lucide-react";

const emptyForm = {
  client_id: "", type: "domain", label: "", vendor: "", cost: "", currency: "INR",
  renews_on: "", reminder_days_before: 30, status: "active", notes: "",
};

const Renewals = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>(emptyForm);

  const load = async () => {
    const { data } = await supabase.from("renewals").select("*, clients(business_name)").order("renews_on");
    setRows(data ?? []);
  };

  useEffect(() => {
    load();
    supabase.from("clients").select("id, business_name").order("business_name").then(({ data }) => setClients(data ?? []));
  }, []);

  const create = async () => {
    if (!form.client_id || !form.label || !form.renews_on) return toast({ title: "Fill required fields", variant: "destructive" });
    const { error } = await supabase.from("renewals").insert({
      ...form,
      cost: form.cost ? Number(form.cost) : null,
      reminder_days_before: Number(form.reminder_days_before),
    });
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: "Renewal added" });
    setOpen(false);
    setForm(emptyForm);
    load();
  };

  const markRenewed = async (r: any) => {
    const next = new Date(r.renews_on);
    next.setFullYear(next.getFullYear() + 1);
    await supabase.from("renewals").update({ renews_on: next.toISOString().slice(0, 10), last_reminded_on: null }).eq("id", r.id);
    toast({ title: "Advanced by 1 year" });
    load();
  };

  const daysUntil = (d: string) => Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);

  return (
    <div className="max-w-6xl space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold">Renewals</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" /> Add renewal</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>New renewal</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Client *</Label>
                <Select value={form.client_id} onValueChange={(v) => setForm({ ...form, client_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                  <SelectContent>{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.business_name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Type</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["domain", "hosting", "plugin", "ad_retainer", "ssl", "email", "other"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Label *</Label><Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} /></div>
                <div><Label>Vendor</Label><Input value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} /></div>
                <div><Label>Cost</Label><Input type="number" step="0.01" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} /></div>
                <div><Label>Currency</Label><Input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} /></div>
                <div><Label>Renews on *</Label><Input type="date" value={form.renews_on} onChange={(e) => setForm({ ...form, renews_on: e.target.value })} /></div>
                <div><Label>Reminder (days before)</Label><Input type="number" value={form.reminder_days_before} onChange={(e) => setForm({ ...form, reminder_days_before: e.target.value })} /></div>
              </div>
              <div><Label>Notes</Label><Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
              <Button onClick={create} className="w-full">Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-4">
        {rows.length === 0 ? <p className="text-sm text-muted-foreground text-center py-6">No renewals tracked.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-muted-foreground border-b">
                <tr>
                  <th className="text-left py-2 px-2">Client</th>
                  <th className="text-left py-2 px-2">Item</th>
                  <th className="text-left py-2 px-2">Type</th>
                  <th className="text-left py-2 px-2">Renews on</th>
                  <th className="text-left py-2 px-2">In</th>
                  <th className="text-left py-2 px-2">Cost</th>
                  <th className="text-left py-2 px-2">Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const d = daysUntil(r.renews_on);
                  return (
                    <tr key={r.id} className="border-b hover:bg-muted/30">
                      <td className="py-3 px-2">{r.clients?.business_name}</td>
                      <td className="py-3 px-2">{r.label}<div className="text-xs text-muted-foreground">{r.vendor}</div></td>
                      <td className="py-3 px-2 text-xs">{r.type}</td>
                      <td className="py-3 px-2">{r.renews_on}</td>
                      <td className={`py-3 px-2 text-xs font-semibold ${d < 0 ? "text-red-600" : d <= 30 ? "text-orange-600" : "text-muted-foreground"}`}>{d < 0 ? `${-d}d overdue` : `${d}d`}</td>
                      <td className="py-3 px-2 text-xs">{r.cost ? `${r.currency} ${Number(r.cost).toLocaleString()}` : "—"}</td>
                      <td className="py-3 px-2"><StatusBadge status={r.status} /></td>
                      <td className="py-3 px-2 text-right"><Button size="sm" variant="ghost" onClick={() => markRenewed(r)}><RefreshCw className="w-4 h-4 mr-1" />Renewed</Button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Renewals;
