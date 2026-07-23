import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StepProps } from "../OnboardingWizard";

const GOALS = ["Leads", "Sales", "Traffic", "Brand awareness", "App installs", "Store visits"];
const BUDGETS = ["< $250", "$250–$500", "$500–$1,000", "$1,000–$2,500", "$2,500–$5,000", "$5,000+"];
const TRACKING = [
  { k: "ga4", l: "Google Analytics 4" },
  { k: "gsc", l: "Google Search Console" },
  { k: "gmc", l: "Google Merchant Center" },
  { k: "meta_pixel", l: "Meta Pixel" },
];

const Step5Marketing = ({ data, update }: StepProps) => {
  const toggleArr = (field: "marketingGoals" | "existingTracking", v: string) => {
    const has = data[field].includes(v);
    update({ [field]: has ? data[field].filter((x) => x !== v) : [...data[field], v] } as any);
  };

  const showGoogleBudget = data.services.includes("google_ads") || data.services.includes("google_merchant_center");
  const showMetaBudget = data.services.includes("meta_ads");
  const showGmb = data.services.includes("gmb");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-display font-bold mb-1">Marketing requirements</h3>
        <p className="text-sm text-muted-foreground">Help us plan the right campaigns for you.</p>
      </div>

      <div>
        <Label>Primary marketing goals *</Label>
        <div className="grid sm:grid-cols-3 gap-2 mt-2">
          {GOALS.map((g) => (
            <label key={g} className="flex items-center gap-2 text-sm p-2 border rounded-lg cursor-pointer">
              <Checkbox checked={data.marketingGoals.includes(g)} onCheckedChange={() => toggleArr("marketingGoals", g)} />
              {g}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Target customer brief *</Label>
        <Textarea rows={3} maxLength={800} value={data.targetCustomerBrief} onChange={(e) => update({ targetCustomerBrief: e.target.value })} placeholder="Age, gender, interests, buying behaviour..." />
      </div>

      <div className="space-y-1.5">
        <Label>Keywords / search terms</Label>
        <Textarea rows={3} maxLength={800} value={data.keywords} onChange={(e) => update({ keywords: e.target.value })} placeholder="One per line or comma-separated" />
      </div>

      <div className="space-y-1.5">
        <Label>Target locations / countries</Label>
        <Textarea rows={2} maxLength={400} value={data.targetLocations} onChange={(e) => update({ targetLocations: e.target.value })} placeholder="e.g. Kerala, UAE, USA (California)" />
      </div>

      <div className="space-y-1.5">
        <Label>Competitors (optional)</Label>
        <Textarea rows={2} maxLength={500} value={data.competitors} onChange={(e) => update({ competitors: e.target.value })} placeholder="Competitor website URLs" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {showGoogleBudget && (
          <div className="space-y-1.5">
            <Label>Google Ads monthly budget</Label>
            <Select value={data.googleAdsBudget} onValueChange={(v) => update({ googleAdsBudget: v })}>
              <SelectTrigger><SelectValue placeholder="Select budget" /></SelectTrigger>
              <SelectContent>{BUDGETS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        )}
        {showMetaBudget && (
          <div className="space-y-1.5">
            <Label>Meta Ads monthly budget</Label>
            <Select value={data.metaAdsBudget} onValueChange={(v) => update({ metaAdsBudget: v })}>
              <SelectTrigger><SelectValue placeholder="Select budget" /></SelectTrigger>
              <SelectContent>{BUDGETS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        )}
        {showGoogleBudget && (
          <div className="space-y-1.5">
            <Label>Existing Google Ads account ID (optional)</Label>
            <Input value={data.googleAdsAccountId} onChange={(e) => update({ googleAdsAccountId: e.target.value })} maxLength={50} />
          </div>
        )}
        {showMetaBudget && (
          <div className="space-y-1.5">
            <Label>Meta Business Manager ID (optional)</Label>
            <Input value={data.metaBusinessId} onChange={(e) => update({ metaBusinessId: e.target.value })} maxLength={50} />
          </div>
        )}
      </div>

      <div>
        <Label>Which of these are already set up?</Label>
        <div className="grid sm:grid-cols-2 gap-2 mt-2">
          {TRACKING.map((t) => (
            <label key={t.k} className="flex items-center gap-2 text-sm p-2 border rounded-lg cursor-pointer">
              <Checkbox checked={data.existingTracking.includes(t.k)} onCheckedChange={() => toggleArr("existingTracking", t.k)} />
              {t.l}
            </label>
          ))}
        </div>
      </div>

      {showGmb && (
        <div className="space-y-1.5">
          <Label>Existing Google Business Profile URL (if any)</Label>
          <Input value={data.gmbUrl} onChange={(e) => update({ gmbUrl: e.target.value })} maxLength={255} placeholder="https://" />
        </div>
      )}
    </div>
  );
};

export default Step5Marketing;
