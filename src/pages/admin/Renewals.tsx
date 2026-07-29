import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useToast } from "@/hooks/use-toast";
import { brandedEmail, loadBrand, para, renewalTable } from "@/lib/brandEmail";
import { renderTemplate } from "@/lib/companySettings";
import { Plus, RefreshCw, Pencil, Trash2, Mail, Loader2, X, BadgeCheck } from "lucide-react";


const RENEWAL_TYPES = ["domain", "hosting", "plugin", "ad_retainer", "google_workspace", "email", "other"];

type Item = { type: string; label: string; vendor: string; cost: string; renews_on: string };

const emptyItem = (renews_on = ""): Item => ({ type: "domain", label: "", vendor: "", cost: "", renews_on });

const emptyForm = {
  client_id: "", currency: "INR", renews_on: "", status: "active", notes: "",
};

const Renewals = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [items, setItems] = useState<Item[]>([emptyItem()]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [emailOpen, setEmailOpen] = useState(false);
  const [emailMode, setEmailMode] = useState<"reminder" | "thankyou">("reminder");
  const [emailCandidates, setEmailCandidates] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailIntro, setEmailIntro] = useState("");
  const [emailOutro, setEmailOutro] = useState("");
  const [sending, setSending] = useState(false);
  const [brand, setBrand] = useState<{ settings: any; logoUrl: string | null }>({ settings: {}, logoUrl: null });

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
    supabase.from("clients").select("id, business_name, email").order("business_name").then(({ data }) => setClients(data ?? []));
    loadBrand().then(setBrand);
  }, []);


  const openNew = () => { setEditingId(null); setForm(emptyForm); setItems([emptyItem()]); setOpen(true); };
  const openEdit = (r: any) => {
    setEditingId(r.id);
    setForm({
      client_id: r.client_id, currency: r.currency ?? "INR", renews_on: r.renews_on,
      status: r.status, notes: r.notes ?? "",
    });
    setItems([{ type: r.type, label: r.label, vendor: r.vendor ?? "", cost: r.cost ?? "", renews_on: r.renews_on }]);
    setOpen(true);
  };

  const updateItem = (i: number, patch: Partial<Item>) =>
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const save = async () => {
    if (!form.client_id) return toast({ title: "Select a client", variant: "destructive" });
    const prepared = items.map((it) => ({
      client_id: form.client_id,
      type: it.type,
      label: it.label.trim(),
      vendor: it.vendor || null,
      cost: it.cost ? Number(it.cost) : null,
      currency: form.currency,
      renews_on: it.renews_on || form.renews_on,
      status: form.status,
      notes: form.notes || null,
    }));
    if (prepared.some((p) => !p.label || !p.renews_on))
      return toast({ title: "Each item needs a label and renewal date", variant: "destructive" });

    const { error } = editingId
      ? await supabase.from("renewals").update(prepared[0] as any).eq("id", editingId)
      : await supabase.from("renewals").insert(prepared as any);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: editingId ? "Renewal updated" : `${prepared.length} renewal${prepared.length > 1 ? "s" : ""} added` });
    setOpen(false); setEditingId(null); setForm(emptyForm); setItems([emptyItem()]);
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

  const daysUntil = (d: string) => Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);

  const openEmail = (r: any, mode: "reminder" | "thankyou" = "reminder") => {
    const clientRows = rows.filter((x) => x.client_id === r.client_id && x.status === "active");
    const clientName = r.clients?.business_name || "there";
    setEmailMode(mode);
    setEmailCandidates(clientRows);
    setSelectedIds([r.id]);
    setEmailTo(r.clients?.email ?? "");
    if (mode === "thankyou") {
      const s = brand.settings ?? {};
      setEmailSubject(
        renderTemplate(s.renewal_thankyou_subject || "Thank you — your renewal is confirmed", {
          client: clientName,
          company: s.company_name || "Webfluid",
        }),
      );
      setEmailIntro(
        renderTemplate(
          s.renewal_thankyou_body ||
            "Hi {{client}},\n\nThank you! We have successfully renewed the following service(s) for you. Your next renewal date is shown below.\n\nWe appreciate your continued trust in us.",
          { client: clientName, company: s.company_name || "Webfluid" },
        ),
      );
      setEmailOutro(`If you have any questions, just reply to this email — we're happy to help.\n\nThanks,\n${brand.settings?.company_name || "Webfluid"} Team`);
    } else {
      setEmailSubject(`Upcoming renewals for ${r.clients?.business_name ?? "your account"}`);
      setEmailIntro(`Hi ${clientName},\n\nThis is a friendly reminder about the following upcoming service renewals:`);
      setEmailOutro(`Please let us know if you'd like us to proceed with the renewals, or reply to this email with any questions.\n\nThanks,\n${brand.settings?.company_name || "Webfluid"} Team`);
    }
    setEmailOpen(true);
  };

  const toggleSelected = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const sendEmail = async () => {
    if (!emailTo) return toast({ title: "Recipient required", variant: "destructive" });
    const chosen = emailCandidates.filter((r) => selectedIds.includes(r.id));
    if (chosen.length === 0) return toast({ title: "Select at least one item", variant: "destructive" });
    setSending(true);
    try {
      const isThanks = emailMode === "thankyou";
      const primary = brand.settings?.primary_color || "#1E5FAD";
      const contentHtml = `
        ${para(emailIntro)}
        ${renewalTable(chosen, { brand: primary, dateHeading: isThanks ? "Next renewal" : "Renews on", showDue: !isThanks })}
        ${para(emailOutro)}`;

      const htmlBody = brandedEmail({
        settings: brand.settings,
        logoUrl: brand.logoUrl,
        contentHtml,
        preheader: isThanks ? "Your renewal is confirmed" : "Upcoming service renewals",
      });

      const { data, error } = await supabase.functions.invoke("send-document-email", {
        body: { to: emailTo, subject: emailSubject, htmlBody },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      if (!isThanks) {
        await supabase.from("renewals")
          .update({ last_reminded_on: new Date().toISOString().slice(0, 10) })
          .in("id", chosen.map((r) => r.id));
      }
      toast({ title: isThanks ? `Confirmation sent for ${chosen.length} item(s)` : `Reminder sent for ${chosen.length} item(s)` });
      setEmailOpen(false);
      load();
    } catch (e: any) {
      toast({ title: "Send failed", description: e.message ?? String(e), variant: "destructive" });
    } finally {
      setSending(false);
    }
  };


  return (
    <div className="max-w-6xl space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-display font-bold">Renewals</h2>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select value={sortDirection} onValueChange={(v) => setSortDirection(v === "desc" ? "desc" : "asc")}>
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

      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setEditingId(null); setForm(emptyForm); setItems([emptyItem()]); } }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingId ? "Edit renewal" : "New renewals"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="sm:col-span-2"><Label>Client *</Label>
                <Select value={form.client_id} onValueChange={(v) => setForm({ ...form, client_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                  <SelectContent>{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.business_name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Currency</Label><Input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} /></div>
              {!editingId && (
                <div className="sm:col-span-2">
                  <Label>Default renewal date</Label>
                  <Input type="date" value={form.renews_on} onChange={(e) => {
                    const v = e.target.value;
                    setForm({ ...form, renews_on: v });
                    setItems((prev) => prev.map((it) => (it.renews_on ? it : { ...it, renews_on: v })));
                  }} />
                </div>
              )}
              <div><Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["active", "paused", "cancelled"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label>{editingId ? "Item" : "Items"}</Label>
              {items.map((it, i) => (
                <div key={i} className="rounded-md border p-3 grid gap-3 sm:grid-cols-2 relative">
                  {!editingId && items.length > 1 && (
                    <button type="button" onClick={() => setItems(items.filter((_, idx) => idx !== i))}
                      className="absolute right-2 top-2 text-muted-foreground hover:text-destructive">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <div><Label className="text-xs">Type</Label>
                    <Select value={it.type} onValueChange={(v) => updateItem(i, { type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {RENEWAL_TYPES.map((t) => <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label className="text-xs">Label *</Label><Input value={it.label} onChange={(e) => updateItem(i, { label: e.target.value })} /></div>
                  <div><Label className="text-xs">Vendor</Label><Input value={it.vendor} onChange={(e) => updateItem(i, { vendor: e.target.value })} /></div>
                  <div><Label className="text-xs">Cost</Label><Input type="number" step="0.01" value={it.cost} onChange={(e) => updateItem(i, { cost: e.target.value })} /></div>
                  <div className="sm:col-span-2"><Label className="text-xs">Renews on *</Label>
                    <Input type="date" value={it.renews_on} onChange={(e) => updateItem(i, { renews_on: e.target.value })} />
                  </div>
                </div>
              ))}
              {!editingId && (
                <Button type="button" variant="outline" size="sm" onClick={() => setItems([...items, emptyItem(form.renews_on)])}>
                  <Plus className="w-4 h-4 mr-2" /> Add another item
                </Button>
              )}
            </div>

            <div><Label>Notes</Label><Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
            <Button onClick={save} className="w-full">{editingId ? "Save changes" : `Create ${items.length} renewal${items.length > 1 ? "s" : ""}`}</Button>
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
                        <Button size="sm" variant="ghost" onClick={() => openEmail(r, "reminder")} title="Email renewal reminder"><Mail className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => openEmail(r, "thankyou")} title="Send thank-you / renewal confirmation"><BadgeCheck className="w-4 h-4 text-primary" /></Button>

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

      <Dialog open={emailOpen} onOpenChange={(o) => !o && setEmailOpen(false)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{emailMode === "thankyou" ? "Send renewal confirmation" : "Email renewal reminder"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>To</Label><Input value={emailTo} onChange={(e) => setEmailTo(e.target.value)} /></div>
            <div><Label>Subject</Label><Input value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} /></div>
            <div>
              <Label>Include renewals</Label>
              <div className="mt-2 space-y-2 rounded-md border p-3">
                {emailCandidates.map((r) => {
                  const d = daysUntil(r.renews_on);
                  return (
                    <label key={r.id} className="flex items-center gap-3 text-sm cursor-pointer">
                      <Checkbox checked={selectedIds.includes(r.id)} onCheckedChange={() => toggleSelected(r.id)} />
                      <span className="flex-1">
                        {r.label} <span className="text-xs text-muted-foreground">({r.type.replace(/_/g, " ")})</span>
                      </span>
                      <span className={`text-xs ${d <= 30 ? "text-destructive" : "text-muted-foreground"}`}>
                        {r.renews_on} · {d < 0 ? `${-d}d overdue` : `${d}d`}
                      </span>
                      <span className="text-xs w-24 text-right">{r.cost ? `${r.currency} ${Number(r.cost).toLocaleString()}` : "—"}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            <div><Label>Intro message</Label><Textarea rows={4} value={emailIntro} onChange={(e) => setEmailIntro(e.target.value)} /></div>
            <div><Label>Closing message</Label><Textarea rows={4} value={emailOutro} onChange={(e) => setEmailOutro(e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailOpen(false)} disabled={sending}>Cancel</Button>
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
