import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import { useEffect } from "react";

const Onboarding = () => {
  useEffect(() => {
    document.title = "Client Onboarding | Webfluid";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", "Tell us about your project — our step-by-step onboarding form for web development, SEO, Google Ads and Meta Ads clients.");
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 md:pt-28 pb-16">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Let's build something <span className="bg-clip-text text-transparent gradient-bg">amazing together</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Share your requirements in a few quick steps. It takes about 5 minutes and helps us prepare a tailored proposal.
            </p>
          </div>
          <OnboardingWizard />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Onboarding;
