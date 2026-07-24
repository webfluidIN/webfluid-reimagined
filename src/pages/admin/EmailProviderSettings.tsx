import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Loader2, Mail } from "lucide-react";

const PROVIDERS = [
  { id: "brevo", name: "Brevo (Sendinblue)", hint: "Get your API key at Brevo → SMTP & API → API Keys." },
  { id: "sendgrid", name: "SendGrid", hint: "API key from SendGrid → Settings → API Keys (Full Access or Mail Send)." },
  { id: "resend", name: "Resend", hint: "API key from Resend → API Keys. Sender domain must be verified in Resend." },
];

function mask(key: string | null | undefined): string {
  if (!key) return "";
  if (key.length <= 8) return "••••";
  return `${key.slice(0, 4)}${"•".repeat(Math.min(20, key.length - 8))}${key.slice(-4)}`;
}

const EmailProviderSettings = () => {
  const { toast } = useToast();
  const [s, setS] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [editingKey, setEditingKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testTo, setTestTo] = useState("");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("email_provider_settings")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    setS(data ?? {
      provider: "brevo",
      sender_email: "hello@webfluid.in",
      sender_name: "Webfluid",
      reply_to_email: "",
      api_base_url: "",
      notes: "",
      api_key: null,
    });
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const set = (k: string, v: any) => setS({ ...s, [k]: v });

  const save = async () => {
    setSaving(true);
    const patch: any = {
      provider: s.provider,
      sender_email: s.sender_email,
      sender_name: s.sender_name,
      reply_to_email: s.reply_to_email || null,
      api_base_url: s.api_base_url || null,
      notes: s.notes || null,
    };
    if (editingKey) patch.api_key = newKey ? newKey : null;

    const q = s.id
      ? await supabase.from("email_provider_settings").update(patch).eq("id", s.id)
      : await supabase.from("email_provider_settings").insert(patch);

    setSaving(false);
    if (q.error) return toast({ title: "Save failed", description: q.error.message, variant: "destructive" });
    toast({ title: "Email settings saved" });
    setEditingKey(false);
    setNewKey("");
    load();
  };

  const sendTest = async () => {
    if (!testTo) return toast({ title: "Recipient required", variant: "destructive" });
    setTesting(true);
    try {
      const pdfBase64 = "JVBERi0xLjQKJcOkw7zDtsOgCjIgMCBvYmoKPDwKL0xlbmd0aCAzIDAgUgo+PgpzdHJlYW0KQlQKL0YxIDE4IFRmCjEwMCA3MDAgVGQKKFRlc3QpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKMyAwIG9iagoyOAplbmRvYmoK";
      const { data, error } = await supabase.functions.invoke("send-document-email", {
        body: {
          to: testTo,
          subject: `Test email from ${s.sender_name}`,
          htmlBody: `<p>This is a test email sent via <b>${s.provider}</b>.</p><p>If you received this, your email provider configuration is working.</p>`,
          pdfBase64,
          pdfFilename: "test.pdf",
          fromName: s.sender_name,
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      toast({ title: "Test sent", description: `Delivered via ${(data as any)?.provider ?? s.provider}` });
    } catch (e: any) {
      toast({ title: "Test failed", description: e.message ?? String(e), variant: "destructive" });
    } finally {
      setTesting(false);
    }
  };

  if (loading || !s) return <div className="p-6">Loading…</div>;

  const providerMeta = PROVIDERS.find((p) => p.id === s.provider);
  const hasStoredKey = !!s.api_key;

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center gap-2">
        <Mail className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-display font-bold">Email Provider</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Universal outbound email configuration. Used for invoice/quotation emails and any other transactional email sent from the dashboard.
      </p>

      <Card className="p-5 space-y-4">
        <div>
          <Label>Provider</Label>
          <Select value={s.provider} onValueChange={(v) => set("provider", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {PROVIDERS.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
          {providerMeta && <p className="text-xs text-muted-foreground mt-1">{providerMeta.hint}</p>}
        </div>

        <div>
          <Label>API key</Label>
          {!editingKey ? (
            <div className="flex items-center gap-2 mt-1">
              <Input
                readOnly
                value={hasStoredKey ? (showKey ? s.api_key : mask(s.api_key)) : "Using BREVO_API_KEY secret (fallback)"}
                className="font-mono text-sm"
              />
              {hasStoredKey && (
                <Button variant="outline" size="icon" type="button" onClick={() => setShowKey((v) => !v)}>
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              )}
              <Button variant="outline" onClick={() => { setEditingKey(true); setNewKey(""); }}>
                {hasStoredKey ? "Replace" : "Set key"}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 mt-1">
              <Input
                type="password"
                placeholder="Paste new API key"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                className="font-mono text-sm"
              />
              <Button variant="outline" onClick={() => { setEditingKey(false); setNewKey(""); }}>Cancel</Button>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Stored securely in the database. Leave empty to fall back to the environment secret.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <Label>Sender email (From)</Label>
            <Input value={s.sender_email ?? ""} onChange={(e) => set("sender_email", e.target.value)} placeholder="hello@webfluid.in" />
            <p className="text-xs text-muted-foreground mt-1">Must be verified in your provider account.</p>
          </div>
          <div>
            <Label>Sender name</Label>
            <Input value={s.sender_name ?? ""} onChange={(e) => set("sender_name", e.target.value)} placeholder="Webfluid" />
          </div>
          <div>
            <Label>Reply-to email (optional)</Label>
            <Input value={s.reply_to_email ?? ""} onChange={(e) => set("reply_to_email", e.target.value)} placeholder="support@webfluid.in" />
          </div>
          <div>
            <Label>Custom API endpoint (optional)</Label>
            <Input value={s.api_base_url ?? ""} onChange={(e) => set("api_base_url", e.target.value)} placeholder="Leave empty for default" />
          </div>
        </div>

        <div>
          <Label>Notes</Label>
          <Textarea rows={2} value={s.notes ?? ""} onChange={(e) => set("notes", e.target.value)} placeholder="Internal notes about this configuration" />
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={save} disabled={saving} className="gradient-bg">
            {saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}Save settings
          </Button>
        </div>
      </Card>

      <Card className="p-5 space-y-3">
        <div className="font-semibold">Send test email</div>
        <p className="text-xs text-muted-foreground">Sends a small test through the currently saved provider to verify credentials.</p>
        <div className="flex gap-2">
          <Input type="email" placeholder="you@example.com" value={testTo} onChange={(e) => setTestTo(e.target.value)} />
          <Button variant="outline" onClick={sendTest} disabled={testing}>
            {testing && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}Send test
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EmailProviderSettings;
