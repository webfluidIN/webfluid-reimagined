import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { defaultData, OnboardingData } from "./types";
import Step1About from "./steps/Step1About";
import Step2Services from "./steps/Step2Services";
import Step3Business from "./steps/Step3Business";
import Step4Website from "./steps/Step4Website";
import Step5Marketing from "./steps/Step5Marketing";
import Step6Addons from "./steps/Step6Addons";
import Step7Budget from "./steps/Step7Budget";
import Step8Review from "./steps/Step8Review";

const STORAGE_KEY = "webfluid_onboarding_draft_v1";

interface StepDef {
  id: string;
  label: string;
  render: (props: StepProps) => JSX.Element;
  validate: (d: OnboardingData) => string | null;
  showIf?: (d: OnboardingData) => boolean;
}

export interface StepProps {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
}

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const needsWebsite = (d: OnboardingData) =>
  d.services.includes("business_website") || d.services.includes("ecommerce_website");
const needsMarketing = (d: OnboardingData) =>
  d.services.some((s) => ["seo", "google_ads", "google_merchant_center", "gmb", "meta_ads"].includes(s));

const STEPS: StepDef[] = [
  {
    id: "about",
    label: "About You",
    render: (p) => <Step1About {...p} />,
    validate: (d) => {
      if (!d.fullName.trim()) return "Please enter your name";
      if (!d.businessName.trim()) return "Please enter your business name";
      if (!emailRe.test(d.email.trim())) return "Please enter a valid email";
      if (!d.phone.trim()) return "Please enter your phone number";
      return null;
    },
  },
  {
    id: "services",
    label: "Services",
    render: (p) => <Step2Services {...p} />,
    validate: (d) => (d.services.length === 0 ? "Please select at least one service" : null),
  },
  {
    id: "business",
    label: "Business Profile",
    render: (p) => <Step3Business {...p} />,
    validate: (d) => (!d.aboutBusiness.trim() ? "Please tell us briefly about your business" : null),
  },
  {
    id: "website",
    label: "Website",
    render: (p) => <Step4Website {...p} />,
    validate: (d) => {
      if (!d.platform) return "Select a platform preference";
      const isShopify = d.platform === "shopify";
      const isWoo = d.platform === "woocommerce";
      if (!isShopify && !isWoo && !d.pageScope) return "Select a page scope";
      if (!d.domainStatus) return "Let us know about your domain";
      if (!isShopify && !d.hosting) return "Select a hosting preference";
      return null;
    },
    showIf: needsWebsite,
  },
  {
    id: "marketing",
    label: "Marketing",
    render: (p) => <Step5Marketing {...p} />,
    validate: (d) => {
      if (d.marketingGoals.length === 0) return "Select at least one marketing goal";
      if (!d.targetCustomerBrief.trim()) return "Briefly describe your target customer";
      return null;
    },
    showIf: needsMarketing,
  },
  {
    id: "addons",
    label: "Add-ons",
    render: (p) => <Step6Addons {...p} />,
    validate: () => null,
    showIf: needsWebsite,
  },
  {
    id: "budget",
    label: "Budget & Timeline",
    render: (p) => <Step7Budget {...p} />,
    validate: (d) => (!d.timelineUrgency ? "Please select a timeline" : null),
  },
  {
    id: "review",
    label: "Review",
    render: (p) => <Step8Review {...p} />,
    validate: (d) => (!d.consent ? "Please agree before submitting" : null),
  },
];

const OnboardingWizard = () => {
  const { toast } = useToast();
  const [data, setData] = useState<OnboardingData>(defaultData);
  const [stepIndex, setStepIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // Load draft
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData({ ...defaultData, ...JSON.parse(raw) });
    } catch { /* ignore */ }
  }, []);

  // Save draft
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch { /* ignore */ }
  }, [data]);

  const visibleSteps = useMemo(
    () => STEPS.filter((s) => (s.showIf ? s.showIf(data) : true)),
    [data],
  );

  const safeIndex = Math.min(stepIndex, visibleSteps.length - 1);
  const current = visibleSteps[safeIndex];
  const progress = ((safeIndex + 1) / visibleSteps.length) * 100;

  const update = (patch: Partial<OnboardingData>) => setData((d) => ({ ...d, ...patch }));

  const goNext = () => {
    const err = current.validate(data);
    if (err) {
      toast({ title: err, variant: "destructive" });
      return;
    }
    if (safeIndex < visibleSteps.length - 1) {
      setStepIndex(safeIndex + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goPrev = () => {
    if (safeIndex > 0) {
      setStepIndex(safeIndex - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const submit = async () => {
    const err = current.validate(data);
    if (err) {
      toast({ title: err, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-onboarding-request", {
        body: { data },
      });
      if (error) throw error;
      localStorage.removeItem(STORAGE_KEY);
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      console.error(e);
      toast({
        title: "Submission failed",
        description: "Please try again or contact us directly at hello@webfluid.in",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <Card className="max-w-2xl mx-auto p-8 md:p-12 text-center">
        <CheckCircle2 className="w-16 h-16 text-secondary mx-auto mb-4" />
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">You're all set!</h2>
        <p className="text-muted-foreground mb-6">
          Thanks for the details. Our team will review your requirements and reach out within 1 business day with a tailored proposal.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://wa.me/917012508851?text=Hi!%20I%20just%20submitted%20the%20onboarding%20form."
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-[#25D366] hover:bg-[#20BD5A] text-white">
              <MessageCircle className="w-4 h-4 mr-2" /> Chat on WhatsApp
            </Button>
          </a>
          <a href="/">
            <Button variant="outline">Back to home</Button>
          </a>
        </div>
      </Card>
    );
  }

  const isLast = safeIndex === visibleSteps.length - 1;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Step {safeIndex + 1} of {visibleSteps.length}
          </span>
          <span className="text-sm font-semibold text-primary">{current.label}</span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="hidden md:flex justify-between mt-3 px-1">
          {visibleSteps.map((s, i) => (
            <button
              key={s.id}
              onClick={() => i < safeIndex && setStepIndex(i)}
              className={`text-xs transition-colors ${
                i === safeIndex
                  ? "text-primary font-semibold"
                  : i < safeIndex
                  ? "text-secondary hover:underline cursor-pointer"
                  : "text-muted-foreground"
              }`}
              disabled={i > safeIndex}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <Card className="p-6 md:p-8">
        <div className="min-h-[300px]">{current.render({ data, update })}</div>

        <div className="flex items-center justify-between mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={goPrev}
            disabled={safeIndex === 0 || submitting}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          {isLast ? (
            <Button
              className="gradient-bg text-primary-foreground font-semibold"
              onClick={submit}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...
                </>
              ) : (
                <>Submit Request <ArrowRight className="w-4 h-4 ml-2" /></>
              )}
            </Button>
          ) : (
            <Button
              className="gradient-bg text-primary-foreground font-semibold"
              onClick={goNext}
            >
              Continue <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </Card>

      <p className="text-center text-xs text-muted-foreground mt-4">
        Your progress is auto-saved on this device.
      </p>
    </div>
  );
};

export default OnboardingWizard;
