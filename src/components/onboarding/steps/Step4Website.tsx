import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StepProps } from "../OnboardingWizard";

const Step4Website = ({ data, update }: StepProps) => {
  const isEcom = data.services.includes("ecommerce_website");
  const togglePay = (v: string) => {
    const has = data.ecomPaymentGateways.includes(v);
    update({ ecomPaymentGateways: has ? data.ecomPaymentGateways.filter((x) => x !== v) : [...data.ecomPaymentGateways, v] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-display font-bold mb-1">Website requirements</h3>
        <p className="text-sm text-muted-foreground">Details about the site you want us to build.</p>
      </div>

      <div className="space-y-2">
        <Label>Platform preference *</Label>
        <RadioGroup value={data.platform} onValueChange={(v) => update({ platform: v })} className="grid sm:grid-cols-2 gap-2">
          {[
            { v: "wordpress", l: "WordPress" },
            { v: "shopify", l: "Shopify" },
            { v: "woocommerce", l: "WooCommerce" },
            { v: "no_preference", l: "No preference — recommend one" },
          ].map((o) => (
            <label key={o.v} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
              <RadioGroupItem value={o.v} id={`plat-${o.v}`} />
              <span className="text-sm">{o.l}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>Page scope *</Label>
        <RadioGroup value={data.pageScope} onValueChange={(v) => update({ pageScope: v })} className="space-y-2">
          {[
            { v: "single", l: "Single page website" },
            { v: "basic5", l: "Basic 5-page (About, Contact, Services, Privacy, Terms)" },
            { v: "more", l: "5+ pages (extra product/service or custom pages)" },
          ].map((o) => (
            <label key={o.v} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
              <RadioGroupItem value={o.v} id={`sc-${o.v}`} />
              <span className="text-sm">{o.l}</span>
            </label>
          ))}
        </RadioGroup>
        {data.pageScope === "more" && (
          <div className="grid md:grid-cols-2 gap-3 pt-2">
            <Input placeholder="Approx total page count" value={data.extraPagesCount} onChange={(e) => update({ extraPagesCount: e.target.value })} maxLength={20} />
            <Input placeholder="Extra pages (e.g. Blog, Careers)" value={data.extraPagesList} onChange={(e) => update({ extraPagesList: e.target.value })} maxLength={300} />
          </div>
        )}
      </div>

      {isEcom && (
        <div className="p-4 border rounded-xl space-y-4 bg-muted/30">
          <div className="font-semibold">E-Commerce specifics</div>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Approx product count</Label>
              <Input value={data.ecomProductCount} onChange={(e) => update({ ecomProductCount: e.target.value })} maxLength={20} placeholder="e.g. 50" />
            </div>
            <div className="space-y-1.5">
              <Label>Need product import help?</Label>
              <Select value={data.ecomImportHelp} onValueChange={(v) => update({ ecomImportHelp: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes — we need help</SelectItem>
                  <SelectItem value="no">No — we'll upload ourselves</SelectItem>
                  <SelectItem value="csv">We have a CSV/feed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Payment gateways</Label>
            <div className="grid sm:grid-cols-2 gap-2 mt-2">
              {["Stripe", "Razorpay", "PayPal", "Cash on Delivery", "Bank transfer", "Other"].map((p) => (
                <label key={p} className="flex items-center gap-2 text-sm">
                  <Checkbox checked={data.ecomPaymentGateways.includes(p)} onCheckedChange={() => togglePay(p)} />
                  {p}
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Shipping regions</Label>
            <Input value={data.ecomShippingRegions} onChange={(e) => update({ ecomShippingRegions: e.target.value })} maxLength={200} placeholder="e.g. India, UAE, Worldwide" />
          </div>
        </div>
      )}

      <div className="p-4 border rounded-xl space-y-3">
        <div className="font-semibold">Domain</div>
        <div className="space-y-1.5">
          <Label>Suggested / desired domain name</Label>
          <Input placeholder="yourbrand.com" value={data.domainName} onChange={(e) => update({ domainName: e.target.value })} maxLength={100} />
        </div>
        <RadioGroup value={data.domainStatus} onValueChange={(v) => update({ domainStatus: v })} className="space-y-2">
          <label className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer">
            <RadioGroupItem value="purchased" /> <span className="text-sm">I already purchased this domain</span>
          </label>
          <label className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer">
            <RadioGroupItem value="need_help" /> <span className="text-sm">Please help me register one</span>
          </label>
        </RadioGroup>
        {data.domainStatus === "purchased" && (
          <Input placeholder="Registrar (e.g. GoDaddy, Namecheap)" value={data.domainRegistrar} onChange={(e) => update({ domainRegistrar: e.target.value })} maxLength={100} />
        )}
      </div>

      <div className="space-y-2">
        <Label>Hosting preference *</Label>
        <RadioGroup value={data.hosting} onValueChange={(v) => update({ hosting: v })} className="space-y-2">
          {[
            { v: "standard", l: "Standard hosting — free for 1 year with our development package" },
            { v: "premium_cloudways", l: "Premium (Cloudways) — extra cost, better performance" },
            { v: "own", l: "I already have my own hosting" },
          ].map((o) => (
            <label key={o.v} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
              <RadioGroupItem value={o.v} />
              <span className="text-sm">{o.l}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Content readiness</Label>
          <Select value={data.contentReadiness} onValueChange={(v) => update({ contentReadiness: v })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="provide">I'll provide all content</SelectItem>
              <SelectItem value="need_help">I need copywriting help</SelectItem>
              <SelectItem value="mix">Mix — partial content ready</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Target launch date</Label>
          <Input type="date" value={data.launchDate} onChange={(e) => update({ launchDate: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>Multilingual?</Label>
          <Select value={data.multilingual} onValueChange={(v) => update({ multilingual: v })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="no">No — single language</SelectItem>
              <SelectItem value="yes">Yes — multiple languages</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {data.multilingual === "yes" && (
          <div className="space-y-1.5">
            <Label>Languages</Label>
            <Input value={data.languages} onChange={(e) => update({ languages: e.target.value })} maxLength={200} placeholder="e.g. English, Arabic, Hindi" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Step4Website;
