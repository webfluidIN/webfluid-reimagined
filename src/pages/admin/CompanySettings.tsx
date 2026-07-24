import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2 } from "lucide-react";

const TEMPLATES = [
  { id: "classic", name: "Classic", desc: "Clean, professional, blue accents" },
  { id: "modern", name: "Modern", desc: "Bold header, colored total banner" },
  { id: "minimal", name: "Minimal", desc: "Monochrome, elegant, minimalist" },
];

const CompanySettings = () => {
  const { toast } = useToast();
  const [s, setS] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const { data } = await supabase.from("company_settings").select("*").limit(1).maybeSingle();
    setS(data ?? {});
    if (data?.logo_url) {
      const { data: signed } = await supabase.storage.from("company-assets").createSignedUrl(data.logo_url, 3600);
      setLogoUrl(signed?.signedUrl ?? null);
    }
  };
  useEffect(() => { load(); }, []);

  const set = (k: string, v: any) => setS({ ...s, [k]: v });

  const save = async () => {
    setSaving(true);
    const { id, created_at, updated_at, ...patch } = s;
    const q = id
      ? await supabase.from("company_settings").update(patch).eq("id", id)
      : await supabase.from("company_settings").insert(patch);
    setSaving(false);
    if (q.error) return toast({ title: "Save failed", description: q.error.message, variant: "destructive" });
    toast({ title: "Settings saved" });
    load();
  };

  const uploadLogo = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop() ?? "png";
    const path = `logo-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("company-assets").upload(path, file, { upsert: true });
    setUploading(false);
    if (error) return toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    set("logo_url", path);
    const { data: signed } = await supabase.storage.from("company-assets").createSignedUrl(path, 3600);
    setLogoUrl(signed?.signedUrl ?? null);
    toast({ title: "Logo uploaded — click Save to persist" });
  };

  if (!s) return <div className="p-6">Loading…</div>;

  return (
    <div className="max-w-4xl space-y-4">
      <h2 className="text-2xl font-display font-bold">Invoice & Quotation Settings</h2>

      <Tabs defaultValue="company">
        <TabsList>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card className="p-5 space-y-4">
            <div className="grid md:grid-cols-2 gap-3">
              <div><Label>Company name</Label><Input value={s.company_name ?? ""} onChange={(e) => set("company_name", e.target.value)} /></div>
              <div><Label>Tax ID / GSTIN</Label><Input value={s.tax_id ?? ""} onChange={(e) => set("tax_id", e.target.value)} /></div>
              <div className="md:col-span-2"><Label>Address</Label><Textarea rows={2} value={s.address ?? ""} onChange={(e) => set("address", e.target.value)} /></div>
              <div><Label>City</Label><Input value={s.city ?? ""} onChange={(e) => set("city", e.target.value)} /></div>
              <div><Label>Country</Label><Input value={s.country ?? ""} onChange={(e) => set("country", e.target.value)} /></div>
              <div><Label>Phone</Label><Input value={s.phone ?? ""} onChange={(e) => set("phone", e.target.value)} /></div>
              <div><Label>Email</Label><Input value={s.email ?? ""} onChange={(e) => set("email", e.target.value)} /></div>
              <div className="md:col-span-2"><Label>Website</Label><Input value={s.website ?? ""} onChange={(e) => set("website", e.target.value)} /></div>
            </div>

            <div>
              <Label>Logo</Label>
              <div className="flex items-center gap-4 mt-1">
                {logoUrl ? <img src={logoUrl} alt="Logo" className="h-16 w-auto border rounded bg-white p-2" /> : <div className="h-16 w-32 border rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">No logo</div>}
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && uploadLogo(e.target.files[0])} />
                <Button variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
                  {uploading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Upload className="w-4 h-4 mr-1" />}
                  Upload logo
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div><Label>Primary color (hex)</Label><Input value={s.primary_color ?? "#1E5FAD"} onChange={(e) => set("primary_color", e.target.value)} /></div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div className="md:col-span-2"><Label>Bank details (shown on invoices)</Label><Textarea rows={3} value={s.bank_details ?? ""} onChange={(e) => set("bank_details", e.target.value)} /></div>
              <div className="md:col-span-2"><Label>Footer notes</Label><Textarea rows={2} value={s.footer_notes ?? ""} onChange={(e) => set("footer_notes", e.target.value)} /></div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card className="p-5 space-y-6">
            {(["invoice_template", "quote_template"] as const).map((field) => (
              <div key={field}>
                <Label className="capitalize">{field.replace("_", " ")}</Label>
                <div className="grid md:grid-cols-3 gap-3 mt-2">
                  {TEMPLATES.map((t) => {
                    const active = s[field] === t.id;
                    return (
                      <button key={t.id} type="button" onClick={() => set(field, t.id)} className={`text-left p-4 rounded-lg border-2 transition ${active ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                        <div className="font-semibold">{t.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{t.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card className="p-5 space-y-4">
            <div className="grid md:grid-cols-2 gap-3">
              <div><Label>From name</Label><Input value={s.email_from_name ?? ""} onChange={(e) => set("email_from_name", e.target.value)} /></div>
              <div><Label>Reply-to email</Label><Input placeholder="hello@webfluid.in" value={s.reply_to_email ?? ""} onChange={(e) => set("reply_to_email", e.target.value)} /></div>
            </div>
            <p className="text-xs text-muted-foreground">Sender is fixed to <b>hello@webfluid.in</b> (verified in Brevo). Set a different Reply-to if you want responses to go elsewhere.</p>

            <div className="border-t pt-4 space-y-3">
              <div className="font-semibold">Invoice email template</div>
              <div><Label className="text-xs">Subject</Label><Input value={s.invoice_email_subject ?? ""} onChange={(e) => set("invoice_email_subject", e.target.value)} /></div>
              <div><Label className="text-xs">Body</Label><Textarea rows={6} value={s.invoice_email_body ?? ""} onChange={(e) => set("invoice_email_body", e.target.value)} /></div>
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="font-semibold">Quotation email template</div>
              <div><Label className="text-xs">Subject</Label><Input value={s.quote_email_subject ?? ""} onChange={(e) => set("quote_email_subject", e.target.value)} /></div>
              <div><Label className="text-xs">Body</Label><Textarea rows={6} value={s.quote_email_body ?? ""} onChange={(e) => set("quote_email_body", e.target.value)} /></div>
            </div>

            <p className="text-xs text-muted-foreground">Available variables: <code>{`{{client}}`}</code>, <code>{`{{company}}`}</code>, <code>{`{{number}}`}</code>, <code>{`{{total}}`}</code>, <code>{`{{valid_until}}`}</code></p>
          </Card>
        </TabsContent>
      </Tabs>

      <Button size="lg" onClick={save} disabled={saving} className="gradient-bg">{saving ? "Saving…" : "Save settings"}</Button>
    </div>
  );
};

export default CompanySettings;
