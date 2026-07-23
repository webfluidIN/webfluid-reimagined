import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StepProps } from "../OnboardingWizard";

const BUDGETS = ["Under $500", "$500–$1,500", "$1,500–$3,000", "$3,000–$7,500", "$7,500+", "Not sure yet"];
const TIMELINE = [
  { v: "asap", l: "ASAP" },
  { v: "2_4_weeks", l: "2–4 weeks" },
  { v: "1_2_months", l: "1–2 months" },
  { v: "flexible", l: "Flexible" },
];
const REFERRALS = ["Google search", "Instagram", "Facebook", "LinkedIn", "Referral / word of mouth", "Existing client", "Other"];

const Step7Budget = ({ data, update }: StepProps) => (
  <div className="space-y-5">
    <div>
      <h3 className="text-xl font-display font-bold mb-1">Budget & timeline</h3>
      <p className="text-sm text-muted-foreground">Almost there — a few final details.</p>
    </div>

    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <Label>Overall project budget</Label>
        <Select value={data.overallBudget} onValueChange={(v) => update({ overallBudget: v })}>
          <SelectTrigger><SelectValue placeholder="Select budget" /></SelectTrigger>
          <SelectContent>{BUDGETS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label>Timeline urgency *</Label>
        <Select value={data.timelineUrgency} onValueChange={(v) => update({ timelineUrgency: v })}>
          <SelectTrigger><SelectValue placeholder="Select timeline" /></SelectTrigger>
          <SelectContent>{TIMELINE.map((t) => <SelectItem key={t.v} value={t.v}>{t.l}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5 md:col-span-2">
        <Label>How did you hear about us?</Label>
        <Select value={data.referralSource} onValueChange={(v) => update({ referralSource: v })}>
          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>{REFERRALS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
        </Select>
      </div>
    </div>

    <div className="space-y-1.5">
      <Label htmlFor="additionalNotes">Anything else you'd like us to know?</Label>
      <Textarea id="additionalNotes" rows={4} maxLength={1500} value={data.additionalNotes} onChange={(e) => update({ additionalNotes: e.target.value })} />
    </div>
  </div>
);

export default Step7Budget;
