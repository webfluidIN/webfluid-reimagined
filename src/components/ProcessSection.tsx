import { MessageSquare, Palette, Code2, Rocket } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    title: "Discovery",
    description: "We start by understanding your business, goals, and target audience to create a tailored strategy.",
    color: "primary",
  },
  {
    icon: Palette,
    title: "Design",
    description: "Our designers craft stunning visuals and intuitive layouts that reflect your brand identity.",
    color: "secondary",
  },
  {
    icon: Code2,
    title: "Development",
    description: "We build your store with clean code, optimized performance, and seamless functionality.",
    color: "accent",
  },
  {
    icon: Rocket,
    title: "Launch & Support",
    description: "Go live with confidence! We provide ongoing support to ensure your success.",
    color: "brand-orange",
  },
];

const ProcessSection = () => {
  return (
    <section id="process" className="py-20 md:py-32 bg-background">
      <div className="container px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            How We <span className="gradient-text">Work</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A streamlined process designed to take you from idea to launch smoothly.
          </p>
        </div>

        {/* Process steps */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary via-secondary via-accent to-brand-orange" />

            {steps.map((step, index) => (
              <div key={index} className="relative group">
                {/* Step number badge */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full gradient-bg text-primary-foreground text-sm font-bold flex items-center justify-center z-10">
                  {index + 1}
                </div>

                {/* Icon container */}
                <div className={`relative mx-auto w-24 h-24 rounded-2xl bg-${step.color}/10 border-2 border-${step.color}/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-${step.color} transition-all duration-300`}
                  style={{
                    backgroundColor: index === 0 ? "hsl(var(--primary) / 0.1)" :
                                     index === 1 ? "hsl(var(--secondary) / 0.1)" :
                                     index === 2 ? "hsl(var(--accent) / 0.1)" :
                                     "hsl(var(--brand-orange) / 0.1)",
                    borderColor: index === 0 ? "hsl(var(--primary) / 0.3)" :
                                 index === 1 ? "hsl(var(--secondary) / 0.3)" :
                                 index === 2 ? "hsl(var(--accent) / 0.3)" :
                                 "hsl(var(--brand-orange) / 0.3)",
                  }}
                >
                  <step.icon className="w-10 h-10" style={{
                    color: index === 0 ? "hsl(var(--primary))" :
                           index === 1 ? "hsl(var(--secondary))" :
                           index === 2 ? "hsl(var(--accent))" :
                           "hsl(var(--brand-orange))",
                  }} />
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-xl font-display font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>

                {/* Arrow for mobile */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center my-4">
                    <svg className="w-6 h-6 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
