import { Check } from "lucide-react";
import { StepProps } from "../OnboardingWizard";
import { SERVICE_OPTIONS, ServiceKey } from "../types";

const Step2Services = ({ data, update }: StepProps) => {
  const toggle = (key: ServiceKey) => {
    const has = data.services.includes(key);
    update({ services: has ? data.services.filter((s) => s !== key) : [...data.services, key] });
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-display font-bold mb-1">What do you need help with?</h3>
        <p className="text-sm text-muted-foreground">Pick everything that applies — we'll only ask relevant questions after this.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {SERVICE_OPTIONS.map((opt) => {
          const active = data.services.includes(opt.key);
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => toggle(opt.key)}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                active
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold">{opt.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{opt.description}</div>
                </div>
                {active && (
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Step2Services;
