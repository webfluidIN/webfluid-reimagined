import { useEffect, useState, RefObject } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { renderTemplate, type CompanySettings } from "@/lib/companySettings";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  invoice: any;
  client: any;
  settings: CompanySettings;
  printRef: RefObject<HTMLDivElement>;
  onSent: () => void;
}

export function EmailDocumentDialog({ open, onOpenChange, invoice, client, settings, printRef, onSent }: Props) {
  const { toast } = useToast();
  const isQuote = invoice.document_type === "quote";
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!open) return;
    const vars = {
      client: client.business_name || client.full_name || "",
      company: settings.company_name,
      number: invoice.invoice_number,
      total: `${invoice.currency} ${Number(invoice.total).toFixed(2)}`,
      valid_until: invoice.valid_until ?? "",
    };
    setTo(client.email ?? "");
    setCc("");
    setSubject(renderTemplate(isQuote ? settings.quote_email_subject : settings.invoice_email_subject, vars));
    setBody(renderTemplate(isQuote ? settings.quote_email_body : settings.invoice_email_body, vars));
  }, [open, invoice, client, settings, isQuote]);

  const send = async () => {
    if (!to) return toast({ title: "Recipient required", variant: "destructive" });
    if (!printRef.current) return toast({ title: "Document not ready", variant: "destructive" });
    setSending(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default as any;
      const pdfBlob: Blob = await html2pdf().set({
        margin: 10,
        filename: `${invoice.invoice_number}.pdf`,
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true, allowTaint: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      }).from(printRef.current).outputPdf("blob");

      const base64 = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onloadend = () => resolve((r.result as string).split(",")[1]);
        r.onerror = reject;
        r.readAsDataURL(pdfBlob);
      });

      const htmlBody = body.split("\n").map((l) => `<p style="margin:0 0 10px 0">${l.replace(/</g, "&lt;")}</p>`).join("");

      const { data, error } = await supabase.functions.invoke("send-document-email", {
        body: {
          to,
          cc: cc || undefined,
          subject,
          htmlBody,
          pdfBase64: base64,
          pdfFilename: `${invoice.invoice_number}.pdf`,
          replyTo: settings.reply_to_email || undefined,
          fromName: settings.email_from_name,
          invoiceId: invoice.id,
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      toast({ title: "Email sent" });
      onSent();
    } catch (e: any) {
      toast({ title: "Send failed", description: e.message ?? String(e), variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>Email {isQuote ? "quotation" : "invoice"} {invoice.invoice_number}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>To</Label><Input value={to} onChange={(e) => setTo(e.target.value)} /></div>
          <div><Label>Cc (optional)</Label><Input value={cc} onChange={(e) => setCc(e.target.value)} /></div>
          <div><Label>Subject</Label><Input value={subject} onChange={(e) => setSubject(e.target.value)} /></div>
          <div><Label>Message</Label><Textarea rows={8} value={body} onChange={(e) => setBody(e.target.value)} /></div>
          <p className="text-xs text-muted-foreground">A PDF of this {isQuote ? "quotation" : "invoice"} will be attached automatically.</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={sending}>Cancel</Button>
          <Button onClick={send} disabled={sending} className="gradient-bg">
            {sending && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}Send email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
