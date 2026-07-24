import type { CompanySettings } from "@/lib/companySettings";

interface Props {
  template: "classic" | "modern" | "minimal";
  settings: CompanySettings;
  logoUrl: string | null;
  invoice: any;
  items: any[];
  client: any;
}

const money = (n: any) => Number(n || 0).toFixed(2);

export function DocumentTemplate({ template, settings, logoUrl, invoice, items, client }: Props) {
  const isQuote = invoice.document_type === "quote";
  const docLabel = isQuote ? "QUOTATION" : "INVOICE";
  const primary = settings.primary_color || "#1E5FAD";

  const CompanyBlock = (
    <div>
      <div className="font-display font-bold text-lg">{settings.company_name}</div>
      {settings.address && <div className="text-xs text-muted-foreground whitespace-pre-line">{settings.address}</div>}
      {(settings.city || settings.country) && <div className="text-xs text-muted-foreground">{[settings.city, settings.country].filter(Boolean).join(", ")}</div>}
      {settings.phone && <div className="text-xs text-muted-foreground">{settings.phone}</div>}
      {settings.email && <div className="text-xs text-muted-foreground">{settings.email}</div>}
      {settings.website && <div className="text-xs text-muted-foreground">{settings.website}</div>}
      {settings.tax_id && <div className="text-xs text-muted-foreground mt-1">Tax ID: {settings.tax_id}</div>}
    </div>
  );

  const ClientBlock = (
    <div className="text-sm">
      <div className="text-xs uppercase text-muted-foreground mb-1">Bill to</div>
      <div className="font-semibold">{client.business_name}</div>
      {client.full_name && <div>{client.full_name}</div>}
      {client.address && <div className="text-muted-foreground whitespace-pre-line">{client.address}</div>}
      {client.country && <div className="text-muted-foreground">{client.country}</div>}
      {client.email && <div className="text-muted-foreground">{client.email}</div>}
      {client.phone && <div className="text-muted-foreground">{client.phone}</div>}
    </div>
  );

  const ItemsTable = (
    <table className="w-full text-sm mb-6">
      <thead>
        <tr style={template === "modern" ? { background: primary, color: "white" } : {}} className={template !== "modern" ? "border-b" : ""}>
          <th className="text-left py-2 px-3">Description</th>
          <th className="text-right py-2 px-3 w-20">Qty</th>
          <th className="text-right py-2 px-3 w-28">Unit price</th>
          <th className="text-right py-2 px-3 w-28">Amount</th>
        </tr>
      </thead>
      <tbody>
        {items.map((it) => (
          <tr key={it.id} className="border-b">
            <td className="py-3 px-3">{it.description}</td>
            <td className="text-right px-3">{Number(it.quantity)}</td>
            <td className="text-right font-mono px-3">{money(it.unit_price)}</td>
            <td className="text-right font-mono px-3">{money(it.amount)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const Totals = (
    <div className="ml-auto max-w-xs text-sm space-y-1">
      <div className="flex justify-between"><span>Subtotal</span><span className="font-mono">{money(invoice.subtotal)}</span></div>
      {Number(invoice.tax_amount) > 0 && <div className="flex justify-between"><span>Tax ({invoice.tax_percent}%)</span><span className="font-mono">{money(invoice.tax_amount)}</span></div>}
      {Number(invoice.discount) > 0 && <div className="flex justify-between"><span>Discount</span><span className="font-mono">-{money(invoice.discount)}</span></div>}
      <div
        className={`flex justify-between font-bold text-base pt-2 ${template === "modern" ? "px-3 py-2 rounded text-white mt-2" : "border-t"}`}
        style={template === "modern" ? { background: primary } : {}}
      >
        <span>Total</span><span className="font-mono">{invoice.currency} {money(invoice.total)}</span>
      </div>
    </div>
  );

  const Footer = (invoice.notes || settings.bank_details || settings.footer_notes) && (
    <div className="mt-8 pt-4 border-t text-sm space-y-3">
      {invoice.notes && <div><div className="text-xs uppercase text-muted-foreground mb-1">Notes</div><div className="whitespace-pre-wrap">{invoice.notes}</div></div>}
      {!isQuote && settings.bank_details && <div><div className="text-xs uppercase text-muted-foreground mb-1">Payment details</div><div className="whitespace-pre-wrap text-xs">{settings.bank_details}</div></div>}
      {settings.footer_notes && <div className="text-xs text-muted-foreground whitespace-pre-wrap pt-2 border-t">{settings.footer_notes}</div>}
    </div>
  );

  if (template === "minimal") {
    return (
      <div className="bg-white text-black p-10 rounded border print:border-none print:shadow-none" style={{ fontFamily: "Georgia, serif" }}>
        <div className="flex justify-between items-start mb-10 pb-4 border-b border-black">
          <div>
            {logoUrl && <img src={logoUrl} alt="Logo" crossOrigin="anonymous" className="h-10 w-auto mb-3" />}
            <div className="text-xs tracking-widest">{settings.company_name}</div>
          </div>
          <div className="text-right">
            <div className="text-4xl tracking-widest">{docLabel}</div>
            <div className="text-xs mt-1">№ {invoice.invoice_number}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-8 text-sm">
          {ClientBlock}
          <div className="text-right text-xs">
            <div>Issued: {invoice.issue_date}</div>
            {isQuote ? invoice.valid_until && <div>Valid until: {invoice.valid_until}</div> : invoice.due_date && <div>Due: {invoice.due_date}</div>}
          </div>
        </div>
        {ItemsTable}
        {Totals}
        {Footer}
      </div>
    );
  }

  if (template === "modern") {
    return (
      <div className="bg-white text-black rounded overflow-hidden border print:border-none print:shadow-none">
        <div className="p-8 text-white" style={{ background: primary }}>
          <div className="flex justify-between items-start">
            <div>
              <div className="text-3xl font-display font-bold">{docLabel}</div>
              <div className="text-sm opacity-90 mt-1">#{invoice.invoice_number}</div>
            </div>
            <div className="text-right">
              {logoUrl && <img src={logoUrl} alt="Logo" crossOrigin="anonymous" className="h-12 w-auto ml-auto mb-2 bg-white p-1 rounded" />}
              <div className="font-bold">{settings.company_name}</div>
            </div>
          </div>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-2 gap-6 mb-8">
            {ClientBlock}
            <div className="text-right text-sm">
              <div><span className="text-muted-foreground">Issued: </span>{invoice.issue_date}</div>
              {isQuote ? invoice.valid_until && <div><span className="text-muted-foreground">Valid until: </span>{invoice.valid_until}</div> : invoice.due_date && <div><span className="text-muted-foreground">Due: </span>{invoice.due_date}</div>}
              <div className="mt-3 text-xs whitespace-pre-line">{[settings.address, settings.city, settings.country].filter(Boolean).join("\n")}</div>
            </div>
          </div>
          {ItemsTable}
          {Totals}
          {Footer}
        </div>
      </div>
    );
  }

  // classic
  return (
    <div className="bg-white text-black p-8 rounded border print:border-none print:shadow-none">
      <div className="flex justify-between items-start mb-8">
        <div>
          {logoUrl && <img src={logoUrl} alt="Logo" crossOrigin="anonymous" className="h-12 w-auto mb-3" />}
          <h1 className="text-3xl font-display font-bold" style={{ color: primary }}>{docLabel}</h1>
          <p className="text-sm text-muted-foreground mt-1">#{invoice.invoice_number}</p>
        </div>
        <div className="text-right">{CompanyBlock}</div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
        {ClientBlock}
        <div className="text-right">
          <div><span className="text-muted-foreground">Issue: </span>{invoice.issue_date}</div>
          {isQuote ? invoice.valid_until && <div><span className="text-muted-foreground">Valid until: </span>{invoice.valid_until}</div> : invoice.due_date && <div><span className="text-muted-foreground">Due: </span>{invoice.due_date}</div>}
        </div>
      </div>
      {ItemsTable}
      {Totals}
      {Footer}
    </div>
  );
}
