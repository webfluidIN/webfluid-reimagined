import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StepProps } from "../OnboardingWizard";

const Field = ({ id, label, children }: { id: string; label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <Label htmlFor={id}>{label}</Label>
    {children}
  </div>
);

const Step1About = ({ data, update }: StepProps) => (
  <div className="space-y-5">
    <div>
      <h3 className="text-xl font-display font-bold mb-1">Tell us about you</h3>
      <p className="text-sm text-muted-foreground">The basics so we can get in touch.</p>
    </div>
    <div className="grid md:grid-cols-2 gap-4">
      <Field id="fullName" label="Full name *">
        <Input id="fullName" value={data.fullName} onChange={(e) => update({ fullName: e.target.value })} maxLength={100} />
      </Field>
      <Field id="businessName" label="Business name *">
        <Input id="businessName" value={data.businessName} onChange={(e) => update({ businessName: e.target.value })} maxLength={150} />
      </Field>
      <Field id="email" label="Email *">
        <Input id="email" type="email" value={data.email} onChange={(e) => update({ email: e.target.value })} maxLength={255} />
      </Field>
      <Field id="phone" label="Phone *">
        <Input id="phone" type="tel" value={data.phone} onChange={(e) => update({ phone: e.target.value })} maxLength={30} />
      </Field>
      <Field id="whatsapp" label="WhatsApp (if different)">
        <Input id="whatsapp" type="tel" value={data.whatsapp} onChange={(e) => update({ whatsapp: e.target.value })} maxLength={30} />
      </Field>
      <Field id="country" label="Country">
        <Input id="country" value={data.country} onChange={(e) => update({ country: e.target.value })} maxLength={80} />
      </Field>
      <Field id="city" label="City">
        <Input id="city" value={data.city} onChange={(e) => update({ city: e.target.value })} maxLength={80} />
      </Field>
      <Field id="preferredContactTime" label="Preferred contact time">
        <Input id="preferredContactTime" placeholder="e.g. Weekdays 10am–6pm IST" value={data.preferredContactTime} onChange={(e) => update({ preferredContactTime: e.target.value })} maxLength={100} />
      </Field>
    </div>
  </div>
);

export default Step1About;
