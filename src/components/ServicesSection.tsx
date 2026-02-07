import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ShoppingCart, Globe, Zap, HeadphonesIcon, CreditCard, Package } from "lucide-react";
import QuoteDialog from "@/components/QuoteDialog";
import SpiderWebBackground from "@/components/SpiderWebBackground";

const ServicesSection = () => {
  const ecommerceFeatures = [
    "Complete Shopify or WooCommerce store setup",
    "Professional theme customization",
    "Payment gateway integration",
    "Product listing & catalog setup",
    "Order management system",
    "1 month FREE support included",
  ];

  const businessFeatures = [
    "Custom WordPress website design",
    "Elementor page builder setup",
    "Mobile responsive design",
    "SEO optimization basics",
    "Contact forms & integrations",
    "Social media integration",
  ];

  return (
    <section id="services" className="py-20 md:py-32 bg-muted/30 relative overflow-hidden">
      <SpiderWebBackground variant="corners" color="hsl(var(--secondary))" opacity={0.1} webSize={320} />
      <div className="container px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            All-Inclusive <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            No hidden fees. Everything you need to launch your online presence, included from day one.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* eCommerce Package */}
          <Card className="relative overflow-hidden border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 group">
            <div className="absolute top-0 right-0 gradient-bg text-primary-foreground px-4 py-1 text-sm font-semibold rounded-bl-lg">
              Most Popular
            </div>
            <CardHeader className="pb-4">
              <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShoppingCart className="w-7 h-7 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl font-display">eCommerce Website</CardTitle>
              <CardDescription className="text-base">
                Shopify & WordPress (WooCommerce + Elementor)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-5xl font-bold gradient-text">$299</span>
                <span className="text-muted-foreground ml-2">starting price</span>
              </div>

              <ul className="space-y-3 mb-8">
                {ecommerceFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full gradient-bg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <HeadphonesIcon className="w-5 h-5 text-secondary" />
                  <span className="font-semibold text-secondary">1 Month Free Support</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Product listing, order management & fulfillment assistance included
                </p>
              </div>

              <QuoteDialog>
                <Button className="w-full gradient-bg text-primary-foreground py-6 text-lg font-semibold hover:opacity-90">
                  Start Your Store
                </Button>
              </QuoteDialog>
            </CardContent>
          </Card>

          {/* Business Website Package */}
          <Card className="relative overflow-hidden border-2 border-accent/20 hover:border-accent/50 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10 group">
            <CardHeader className="pb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-accent to-brand-orange flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7 text-accent-foreground" />
              </div>
              <CardTitle className="text-2xl font-display">Business Website</CardTitle>
              <CardDescription className="text-base">
                Custom WordPress websites with Elementor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-5xl font-bold bg-gradient-to-r from-accent to-brand-orange bg-clip-text text-transparent">$199</span>
                <span className="text-muted-foreground ml-2">starting price</span>
              </div>

              <ul className="space-y-3 mb-8">
                {businessFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-accent to-brand-orange flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-accent-foreground" />
                    </div>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-accent" />
                  <span className="font-semibold text-accent">Quick Turnaround</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Get your professional website live in just 7-14 days
                </p>
              </div>

              <QuoteDialog>
                <Button className="w-full bg-gradient-to-r from-accent to-brand-orange text-accent-foreground py-6 text-lg font-semibold hover:opacity-90">
                  Get Started
                </Button>
              </QuoteDialog>
            </CardContent>
          </Card>
        </div>

        {/* Additional features */}
        <div className="mt-16 grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-4 p-4 rounded-xl glass">
            <CreditCard className="w-10 h-10 text-primary" />
            <div>
              <h4 className="font-semibold">Payment Setup</h4>
              <p className="text-sm text-muted-foreground">All gateways included</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl glass">
            <Package className="w-10 h-10 text-secondary" />
            <div>
              <h4 className="font-semibold">Complete Package</h4>
              <p className="text-sm text-muted-foreground">No hidden costs</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl glass">
            <HeadphonesIcon className="w-10 h-10 text-accent" />
            <div>
              <h4 className="font-semibold">Ongoing Support</h4>
              <p className="text-sm text-muted-foreground">We're here to help</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
