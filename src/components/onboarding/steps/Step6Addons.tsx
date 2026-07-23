import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StepProps } from "../OnboardingWizard";
import { ADDON_OPTIONS } from "../types";

const Step6Addons = ({ data, update }: StepProps) => {
  const toggle = (v: string) => {
    const has = data.addons.includes(v);
    update({ addons: has ? data.addons.filter((x) => x !== v) : [...data.addons, v] });
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-display font-bold mb-1">Optional add-ons</h3>
        <p className="text-sm text-muted-foreground">Pick anything you'd like to include. We'll price them in the proposal.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-2">
        {ADDON_OPTIONS.map((a) => {
          const active = data.addons.includes(a.key);
          return (
            <label
              key={a.key}
              className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                active ? "border-primary bg-primary/5" : "hover:bg-muted/50"
              }`}
            >
              <Checkbox checked={active} onCheckedChange={() => toggle(a.key)} className="mt-0.5" />
              <span className="text-sm">{a.label}</span>
            </label>
          );
        })}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="addonsNote">Anything else you'd like as an add-on?</Label>
        <Textarea id="addonsNote" rows={3} maxLength={500} value={data.addonsNote} onChange={(e) => update({ addonsNote: e.target.value })} />
      </div>
    </div>
  );
};

export default Step6Addons;
