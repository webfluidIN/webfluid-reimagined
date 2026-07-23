import { Checkbox } from "@/components/ui/checkbox";
import { StepProps } from "../OnboardingWizard";
import { SERVICE_OPTIONS, ADDON_OPTIONS } from "../types";
import { Link } from "react-router-dom";

const Row = ({ label, value }: { label: string; value?: string | null }) => {
  if (!value) return null;
  return (
    <div className="grid grid-cols-3 gap-3 py-1.5 text-sm border-b border-border/50 last:border-0">
      <div className="text-muted-foreground">{label}</div>
      <div className="col-span-2 break-words whitespace-pre-wrap">{value}</div>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h4 className="font-semibold text-primary mb-2">{title}</h4>
    <div className="rounded-lg border p-3 bg-muted/20">{children}</div>
  </div>
);

const Step8Review = ({ data, update }: StepProps) => {
  const serviceLabels = data.services
    .map((s) => SERVICE_OPTIONS.find((o) => o.key === s)?.label)
    .filter(Boolean)
    .join(", ");
  const addonLabels = data.addons
    .map((k) => ADDON_OPTIONS.find((o) => o.key === k)?.label)
    .filter(Boolean)
    .join("\n");
  const socials = Object.entries(data.socials)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  const colors = data.brandColors.filter(Boolean).join(", ");
  const needsWeb = data.services.includes("business_website") || data.services.includes("ecommerce_website");
  const needsMk = data.services.some((s) => ["seo", "google_ads", "google_merchant_center", "gmb", "meta_ads"].includes(s));

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-display font-bold mb-1">Review & submit</h3>
        <p className="text-sm text-muted-foreground">Double-check your details, then send them our way.</p>
      </div>

      <Section title="About You">
        <Row label="Name" value={data.fullName} />
        <Row label="Business" value={data.businessName} />
        <Row label="Email" value={data.email} />
        <Row label="Phone" value={data.phone} />
        <Row label="WhatsApp" value={data.whatsapp} />
        <Row label="Location" value={[data.city, data.country].filter(Boolean).join(", ")} />
        <Row label="Preferred contact time" value={data.preferredContactTime} />
      </Section>

      <Section title="Services">
        <Row label="Selected" value={serviceLabels} />
      </Section>

      <Section title="Business Profile">
        <Row label="About" value={data.aboutBusiness} />
        <Row label="Industry" value={data.industry} />
        <Row label="Existing website" value={data.existingWebsite} />
        <Row label="Target audience" value={data.targetAudience} />
        <Row label="Socials" value={socials} />
        <Row label="Brand colors" value={colors} />
        <Row label="Palette notes" value={data.brandColorsNote} />
        <Row label="Design references" value={data.designReferences} />
        <Row label="Logo uploaded" value={data.logoFileName} />
      </Section>

      {needsWeb && (
        <Section title="Website">
          <Row label="Platform" value={data.platform} />
          <Row label="Page scope" value={data.pageScope} />
          <Row label="Extra pages" value={data.extraPagesList} />
          <Row label="Domain" value={data.domainName} />
          <Row label="Domain status" value={data.domainStatus} />
          <Row label="Registrar" value={data.domainRegistrar} />
          <Row label="Hosting" value={data.hosting} />
          <Row label="Content" value={data.contentReadiness} />
          <Row label="Launch date" value={data.launchDate} />
          <Row label="Multilingual" value={data.multilingual === "yes" ? data.languages || "yes" : data.multilingual} />
          {data.services.includes("ecommerce_website") && (
            <>
              <Row label="Product count" value={data.ecomProductCount} />
              <Row label="Import help" value={data.ecomImportHelp} />
              <Row label="Payments" value={data.ecomPaymentGateways.join(", ")} />
              <Row label="Shipping regions" value={data.ecomShippingRegions} />
            </>
          )}
        </Section>
      )}

      {needsMk && (
        <Section title="Marketing">
          <Row label="Goals" value={data.marketingGoals.join(", ")} />
          <Row label="Target customer" value={data.targetCustomerBrief} />
          <Row label="Keywords" value={data.keywords} />
          <Row label="Target locations" value={data.targetLocations} />
          <Row label="Competitors" value={data.competitors} />
          <Row label="Google Ads budget" value={data.googleAdsBudget} />
          <Row label="Meta Ads budget" value={data.metaAdsBudget} />
          <Row label="Google Ads ID" value={data.googleAdsAccountId} />
          <Row label="Meta BM ID" value={data.metaBusinessId} />
          <Row label="Already set up" value={data.existingTracking.join(", ")} />
          <Row label="GMB URL" value={data.gmbUrl} />
        </Section>
      )}

      {needsWeb && (data.addons.length > 0 || data.addonsNote) && (
        <Section title="Add-ons">
          <Row label="Selected" value={addonLabels} />
          <Row label="Notes" value={data.addonsNote} />
        </Section>
      )}

      <Section title="Budget & Timeline">
        <Row label="Overall budget" value={data.overallBudget} />
        <Row label="Timeline" value={data.timelineUrgency} />
        <Row label="Heard about us" value={data.referralSource} />
        <Row label="Notes" value={data.additionalNotes} />
      </Section>

      <label className="flex items-start gap-2 p-3 border rounded-lg cursor-pointer">
        <Checkbox checked={data.consent} onCheckedChange={(v) => update({ consent: Boolean(v) })} className="mt-0.5" />
        <span className="text-sm">
          I agree to be contacted by Webfluid about my project. See our{" "}
          <Link to="/privacy-policy" className="text-primary underline">Privacy Policy</Link>.
        </span>
      </label>
    </div>
  );
};

export default Step8Review;
