import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Mail, Phone } from "lucide-react";
import QuoteDialog from "@/components/QuoteDialog";

const CTASection = () => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-bg opacity-95" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-6">
            Ready to Launch Your Online Store?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-4">
            Get started today with our all-inclusive packages
          </p>
          
          {/* Pricing reminder */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <div className="px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
              <span className="text-primary-foreground font-semibold">
                eCommerce from <span className="text-2xl">$299</span>
              </span>
            </div>
            <div className="px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
              <span className="text-primary-foreground font-semibold">
                Business sites from <span className="text-2xl">$199</span>
              </span>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <QuoteDialog>
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg font-semibold group"
              >
                Start Your Project
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </QuoteDialog>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Chat on WhatsApp
            </Button>
          </div>

          {/* Contact options */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-primary-foreground/80">
            <a href="mailto:hello@webfluid.in" className="flex items-center gap-2 hover:text-primary-foreground transition-colors">
              <Mail className="w-5 h-5" />
              hello@webfluid.in
            </a>
            <a href="tel:+917012508851" className="flex items-center gap-2 hover:text-primary-foreground transition-colors">
              <Phone className="w-5 h-5" />
              +91 7012508851
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
