import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SpiderWebBackground from "@/components/SpiderWebBackground";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Smartphone,
  Globe,
  Rocket,
  FileSearch,
  ShoppingCart,
  Newspaper,
  Sparkles,
  Target,
  Search,
  ShoppingBag,
  BarChart3,
  MessageCircle,
  Mail,
  ChevronRight,
} from "lucide-react";

const categories = [
  {
    id: "ai",
    title: "AI-Powered Web & App Development",
    icon: Brain,
    color: "primary",
    services: [
      {
        icon: Smartphone,
        title: "AI-Native Mobile Applications",
        description:
          "Custom Android and iOS development featuring integrated AI agents. This includes apps for image recognition, voice processing, or automated task management.",
      },
      {
        icon: Globe,
        title: "Intelligent Web Applications",
        description:
          "Building complex web-based tools and Micro-SaaS products. We utilize advanced models like Claude to rapidly prototype and deploy functional business software tailored to your workflow.",
      },
      {
        icon: Rocket,
        title: "AI Landing Pages & Rapid Deployment",
        description:
          "Fast-tracked landing page creation using AI-assisted design and wireframing. These pages are built for speed and high conversion, featuring AI-generated copy and layout optimization.",
      },
      {
        icon: FileSearch,
        title: "Custom RAG Portals (Internal AI)",
        description:
          'Development of private web portals that allow your team to "chat" with your company\'s internal documents, spreadsheets, and PDFs to find information instantly.',
      },
    ],
  },
  {
    id: "ecommerce",
    title: "Ecommerce & CMS Excellence",
    icon: ShoppingCart,
    color: "secondary",
    services: [
      {
        icon: ShoppingCart,
        title: "Shopify Development",
        description:
          "End-to-end ecommerce solutions, from store setup and theme customization to complex app integrations and checkout optimization.",
      },
      {
        icon: Newspaper,
        title: "WordPress Development",
        description:
          "Custom business websites, blogs, and portals built on WordPress with a focus on scalability, security, and high performance.",
      },
      {
        icon: Sparkles,
        title: "AI Store Enhancement",
        description:
          "Integration of AI-driven product recommendations, semantic search (searching by intent), and automated product description generation.",
      },
    ],
  },
  {
    id: "marketing",
    title: "Strategic Digital Marketing",
    icon: Target,
    color: "accent",
    services: [
      {
        icon: Target,
        title: "Google Ads Management",
        description:
          "Expert setup and management of Search, Display, and Video campaigns. We use AI-driven split testing for headlines and creatives to ensure the highest possible Return on Ad Spend (ROAS).",
      },
      {
        icon: Search,
        title: "Advanced SEO Services",
        description:
          "Comprehensive Search Engine Optimization including technical audits, keyword strategy, and backlink building. We leverage AI for bulk metadata optimization and content gap analysis to rank you higher, faster.",
      },
      {
        icon: ShoppingBag,
        title: "Google Merchant Center (GMC) Setup",
        description:
          'Optimization of product feeds for Shopify and WordPress stores to ensure your products appear accurately in Google Shopping and across "Free Listings."',
      },
      {
        icon: BarChart3,
        title: "Google Analytics 4 (GA4) & Tracking",
        description:
          "Full implementation of GA4 to track user behavior. We set up custom conversion events and data dashboards so you can make decisions based on real-time business intelligence.",
      },
    ],
  },
  {
    id: "automation",
    title: "Conversational AI & Automation",
    icon: MessageCircle,
    color: "primary",
    services: [
      {
        icon: MessageCircle,
        title: "AI Sales & Support Agents",
        description:
          "Implementation of intelligent chatbots on Shopify and WordPress that handle customer inquiries, track orders, and assist in the sales process 24/7.",
      },
      {
        icon: Mail,
        title: "Marketing Automation",
        description:
          "Using AI tools to automate email sequences, lead nurturing, and social media posting schedules to keep your brand active with minimal manual effort.",
      },
    ],
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  primary: {
    bg: "gradient-bg",
    text: "text-primary",
    border: "border-primary/20 hover:border-primary/50",
    glow: "hover:shadow-primary/10",
  },
  secondary: {
    bg: "bg-gradient-to-r from-secondary to-emerald-500",
    text: "text-secondary",
    border: "border-secondary/20 hover:border-secondary/50",
    glow: "hover:shadow-secondary/10",
  },
  accent: {
    bg: "bg-gradient-to-r from-accent to-brand-orange",
    text: "text-accent",
    border: "border-accent/20 hover:border-accent/50",
    glow: "hover:shadow-accent/10",
  },
};

const OtherServicesSection = () => {
  const [activeCategory, setActiveCategory] = useState("ai");

  const active = categories.find((c) => c.id === activeCategory)!;
  const colors = colorMap[active.color];

  return (
    <section id="other-services" className="py-20 md:py-32 bg-muted/30 relative overflow-hidden">
      <SpiderWebBackground variant="sides" color="hsl(var(--primary))" opacity={0.15} webSize={420} />
      <div className="container px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            What Other Services Do We <span className="gradient-text">Offer?</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Beyond eCommerce and business websites, we deliver cutting-edge AI solutions, digital marketing, and automation to fuel your growth.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            const CatIcon = cat.icon;
            return (
              <Button
                key={cat.id}
                variant={isActive ? "default" : "outline"}
                className={`gap-2 rounded-full px-5 py-2.5 transition-all duration-300 ${
                  isActive
                    ? "gradient-bg text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                    : "hover:scale-105"
                }`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <CatIcon className="w-4 h-4" />
                <span className="hidden sm:inline">{cat.title}</span>
                <span className="sm:hidden">{cat.title.split(" ")[0]}</span>
              </Button>
            );
          })}
        </div>

        {/* Services Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto"
          >
            {active.services.map((service, index) => {
              const ServiceIcon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.08 }}
                >
                  <Card
                    className={`h-full border-2 ${colors.border} ${colors.glow} transition-all duration-300 hover:shadow-2xl group`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-2xl ${colors.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                        >
                          <ServiceIcon className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-display font-semibold mb-2 flex items-center gap-2">
                            {service.title}
                            <ChevronRight className={`w-4 h-4 ${colors.text} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all`} />
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default OtherServicesSection;
