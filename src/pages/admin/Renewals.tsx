import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useToast } from "@/hooks/use-toast";
import { Plus, RefreshCw, Pencil, Trash2, Mail, Loader2 } from "lucide-react";

const RENEWAL_TYPES = ["domain", "hosting", "plugin", "ad_retainer", "google_workspace", "email", "other"];

const emptyForm = {
  client_id: "", type: "domain", label: "", vendor: "", cost: "", currency: "INR",
  renews_on: "", reminder_days_before: 30, status: "active", notes: "",
};

const Renewals = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [emailFor, setEmailFor] = useState<any | null>(null);
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("renewals")
      .select("*, clients(business_name, email)")
      .order("renews_on", { ascending: sortDirection === "asc" });
    setRows(data ?? []);
  }, [sortDirection]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    supabase.from("clients").select("id, business_name").order("business_name").then(({ data }) => setClients(data ?? []));
  }, []);

  const openNew = () => { setEditingId(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (r: any) => {
    setEditingId(r.id);
    setForm({
      client_id: r.client_id, type: r.type, label: r.label, vendor: r.vendor ?? "",
      cost: r.cost ?? "", currency: r.currency ?? "INR", renews_on: r.renews_on,
      reminder_days_before: r.reminder_days_before ?? 30, status: r.status, notes: r.notes ?? "",
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.client_id || !form.label || !form.renews_on) return toast({ title: "Fill required fields", variant: "destructive" });
    const payload = {
      ...form,
      cost: form.cost ? Number(form.cost) : null,
      reminder_days_before: Number(form.reminder_days_before),
    };
    const { error } = editingId
      ? await supabase.from("renewals").update(payload).eq("id", editingId)
      : await supabase.from("renewals").insert(payload);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: editingId ? "Renewal updated" : "Renewal added" });
    setOpen(false); setEditingId(null); setForm(emptyForm);
    load();
  };

  const remove = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("renewals").delete().eq("id", deleteId);
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" });
    else toast({ title: "Renewal deleted" });
    setDeleteId(null);
    load();
  };

  const markRenewed = async (r: any) => {
    const next = new Date(r.renews_on);
    next.setFullYear(next.getFullYear() + 1);
    await supabase.from("renewals").update({ renews_on: next.toISOString().slice(0, 10), last_reminded_on: null }).eq("id", r.id);
    toast({ title: "Advanced by 1 year" });
    load();
  };

  const openEmail = (r: any) => {
    const days = Math.ceil((new Date(r.renews_on).getTime() - Date.now()) / 86400000);
    const client = r.clients?.business_name || "there";
    const label = r.label;
    const dueTxt = days < 0 ? `${-days} day(s) overdue` : `in ${days} day(s) (${r.renews_on})`;
    const cost = r.cost ? `${r.currency} ${Number(r.cost).toLocaleString()}` : "";
    setEmailFor(r);
    setEmailTo(r.clients?.email ?? "");
    setEmailSubject(`Renewal reminder: ${label} due ${dueTxt}`);
    setEmailBody(
`Hi ${client},

This is a friendly reminder that your ${label}${r.vendor ? ` (${r.vendor})` : ""} is due for renewal ${dueTxt}.${cost ? `\n\nRenewal amount: ${cost}` : ""}

Please let us know if you'd like us to proceed with the renewal, or reply to this email with any questions.

Thanks,
Webfluid Team`
    );
  };

  const sendEmail = async () => {
    if (!emailTo) return toast({ title: "Recipient required", variant: "destructive" });
    setSending(true);
    try {
      const htmlBody = emailBody.split("\n").map((l) =>
        `<p style="margin:0 0 10px 0">${l.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]!))}</p>`
      ).join("");
      const { data, error } = await supabase.functions.invoke("send-document-email", {
        body: { to: emailTo, subject: emailSubject, htmlBody },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      await supabase.from("renewals").update({ last_reminded_on: new Date().toISOString().slice(0, 10) }).eq("id", emailFor.id);
      toast({ title: "Reminder sent" });
      setEmailFor(null);
      load();
    } catch (e: any) {
      toast({ title: "Send failed", description: e.message ?? String(e), variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const daysUntil = (d: string) => Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);

  return (
    <div className="max-w-6xl space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-display font-bold">Renewals</h2>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select value={sortDirection} onValueChange={(v: "asc" | "desc") => setSortDirection(v)}>
            <SelectTrigger className="w-full sm:w-52">
              <SelectValue placeholder="Sort by renewal date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Renewal date: Soonest first</SelectItem>
              <SelectItem value="desc">Renewal date: Latest first</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={openNew}><Plus className="w-4 h-4 mr-2" /> Add renewal</Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setEditingId(null); setForm(emptyForm); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editingId ? "Edit renewal" : "New renewal"}</DialogTitle></DialogHeader>
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
                    {RENEWAL_TYPES.map((t) => <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Label *</Label><Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} /></div>
              <div><Label>Vendor</Label><Input value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} /></div>
              <div><Label>Cost</Label><Input type="number" step="0.01" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} /></div>
              <div><Label>Currency</Label><Input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} /></div>
              <div><Label>Renews on *</Label><Input type="date" value={form.renews_on} onChange={(e) => setForm({ ...form, renews_on: e.target.value })} /></div>
              <div><Label>Reminder (days before)</Label><Input type="number" value={form.reminder_days_before} onChange={(e) => setForm({ ...form, reminder_days_before: e.target.value })} /></div>
              <div><Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["active", "paused", "cancelled"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Notes</Label><Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
            <Button onClick={save} className="w-full">{editingId ? "Save changes" : "Create"}</Button>
          </div>
        </DialogContent>
      </Dialog>

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
                    <tr key={r.id} className={`border-b ${d <= 30 ? "bg-destructive/10 hover:bg-destructive/15" : "hover:bg-muted/30"}`}>
                      <td className="py-3 px-2">{r.clients?.business_name}</td>
                      <td className="py-3 px-2">{r.label}<div className="text-xs text-muted-foreground">{r.vendor}</div></td>
                      <td className="py-3 px-2 text-xs">{r.type.replace(/_/g, " ")}</td>
                      <td className="py-3 px-2">{r.renews_on}</td>
                      <td className={`py-3 px-2 text-xs font-semibold ${d <= 30 ? "text-destructive" : "text-muted-foreground"}`}>{d < 0 ? `${-d}d overdue` : `${d}d`}</td>
                      <td className="py-3 px-2 text-xs">{r.cost ? `${r.currency} ${Number(r.cost).toLocaleString()}` : "—"}</td>
                      <td className="py-3 px-2"><StatusBadge status={r.status} /></td>
                      <td className="py-3 px-2 text-right whitespace-nowrap">
                        <Button size="sm" variant="ghost" onClick={() => openEmail(r)} title="Email client"><Mail className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => markRenewed(r)} title="Mark renewed"><RefreshCw className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => openEdit(r)} title="Edit"><Pencil className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => setDeleteId(r.id)} title="Delete"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete renewal?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={remove} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!emailFor} onOpenChange={(o) => !o && setEmailFor(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Email renewal reminder</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>To</Label><Input value={emailTo} onChange={(e) => setEmailTo(e.target.value)} /></div>
            <div><Label>Subject</Label><Input value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} /></div>
            <div><Label>Message</Label><Textarea rows={10} value={emailBody} onChange={(e) => setEmailBody(e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailFor(null)} disabled={sending}>Cancel</Button>
            <Button onClick={sendEmail} disabled={sending} className="gradient-bg">
              {sending && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}Send reminder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Renewals;
