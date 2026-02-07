import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ShoppingCart, Globe } from "lucide-react";
import QuoteDialog from "@/components/QuoteDialog";
import SpiderWebBackground from "@/components/SpiderWebBackground";
import shopifyLogo from "@/assets/logos/shopify.svg";
import wordpressLogo from "@/assets/logos/wordpress.svg";
import woocommerceLogo from "@/assets/logos/woocommerce.svg";
import elementorLogo from "@/assets/logos/elementor.svg";
const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted">
      {/* Spider web effect */}
      <SpiderWebBackground variant="sides" opacity={0.1} webSize={400} />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="container relative z-10 px-4 py-20 md:py-32">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Trusted by 100+ Businesses Worldwide
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Launch Your{" "}
            <span className="gradient-text">eCommerce Store</span>
            <br />
            with Webfluid
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Expert Shopify & WordPress development. Complete store setup, payment gateway integration, and ongoing support—all at unbeatable prices.
          </p>

          {/* Pricing badges */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="group relative">
              <div className="absolute inset-0 gradient-bg rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative flex items-center gap-3 px-6 py-4 rounded-2xl glass border-2 border-primary/30 hover:border-primary/60 transition-colors">
                <ShoppingCart className="w-6 h-6 text-primary" />
                <div className="text-left">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">eCommerce Websites</p>
                  <p className="text-2xl font-bold">
                    Starting at <span className="gradient-text">$299</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-brand-orange rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative flex items-center gap-3 px-6 py-4 rounded-2xl glass border-2 border-accent/30 hover:border-accent/60 transition-colors">
                <Globe className="w-6 h-6 text-accent" />
                <div className="text-left">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Business Websites</p>
                  <p className="text-2xl font-bold">
                    Starting at <span className="bg-gradient-to-r from-accent to-brand-orange bg-clip-text text-transparent">$199</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <QuoteDialog>
              <Button size="lg" className="gradient-bg text-primary-foreground px-8 py-6 text-lg font-semibold hover:opacity-90 transition-opacity group">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </QuoteDialog>
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg font-semibold border-2 hover:bg-muted">
              View Our Work
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 pt-10 border-t border-border/50 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <p className="text-sm text-muted-foreground mb-6">Powered by industry-leading platforms</p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-70">
              <div className="flex items-center gap-2">
                <img src={shopifyLogo} alt="Shopify" className="h-7 w-auto" />
                <span className="font-semibold">Shopify</span>
              </div>
              <div className="flex items-center gap-2">
                <img src={wordpressLogo} alt="WordPress" className="h-7 w-auto" />
                <span className="font-semibold">WordPress</span>
              </div>
              <div className="flex items-center gap-2">
                <img src={woocommerceLogo} alt="WooCommerce" className="h-7 w-auto" />
                <span className="font-semibold">WooCommerce</span>
              </div>
              <div className="flex items-center gap-2">
                <img src={elementorLogo} alt="Elementor" className="h-6 w-auto" />
                <span className="font-semibold">Elementor</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-muted-foreground/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
