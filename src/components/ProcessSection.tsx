import { useState } from "react";
import { MessageSquare, Palette, Code2, Rocket, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SpiderWebBackground from "@/components/SpiderWebBackground";

const steps = [
  {
    icon: MessageSquare,
    title: "Discovery",
    subtitle: "Understanding Your Vision",
    description: "We start by understanding your business, goals, and target audience to create a tailored strategy.",
    details: [
      "In-depth consultation to understand your brand",
      "Market research and competitor analysis",
      "Define project scope and timeline",
      "Identify key features and functionality"
    ],
    color: "primary",
  },
  {
    icon: Palette,
    title: "Design",
    subtitle: "Crafting Your Identity",
    description: "Our designers craft stunning visuals and intuitive layouts that reflect your brand identity.",
    details: [
      "Wireframes and user flow mapping",
      "Custom UI/UX design concepts",
      "Brand-aligned visual elements",
      "Interactive prototypes for review"
    ],
    color: "secondary",
  },
  {
    icon: Code2,
    title: "Development",
    subtitle: "Building With Precision",
    description: "We build your store with clean code, optimized performance, and seamless functionality.",
    details: [
      "Modern, scalable codebase",
      "Mobile-first responsive design",
      "Performance optimization",
      "Third-party integrations"
    ],
    color: "accent",
  },
  {
    icon: Rocket,
    title: "Launch & Support",
    subtitle: "Your Success, Our Mission",
    description: "Go live with confidence! We provide ongoing support to ensure your success.",
    details: [
      "Thorough testing and QA",
      "Smooth deployment process",
      "Training and documentation",
      "Ongoing maintenance & support"
    ],
    color: "brand-orange",
  },
];

const getColorStyles = (index: number, isActive: boolean) => {
  const colors = [
    { bg: "hsl(var(--primary))", bgLight: "hsl(var(--primary) / 0.1)", border: "hsl(var(--primary) / 0.3)" },
    { bg: "hsl(var(--secondary))", bgLight: "hsl(var(--secondary) / 0.1)", border: "hsl(var(--secondary) / 0.3)" },
    { bg: "hsl(var(--accent))", bgLight: "hsl(var(--accent) / 0.1)", border: "hsl(var(--accent) / 0.3)" },
    { bg: "hsl(var(--brand-orange))", bgLight: "hsl(var(--brand-orange) / 0.1)", border: "hsl(var(--brand-orange) / 0.3)" },
  ];
  return colors[index];
};

const ProcessSection = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="process" className="py-20 md:py-32 bg-background overflow-hidden relative">
      <SpiderWebBackground variant="scattered" color="hsl(var(--accent))" opacity={0.2} webSize={450} />
      <div className="container px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            How We <span className="gradient-text">Work</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A streamlined process designed to take you from idea to launch smoothly.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
            {steps.map((step, index) => {
              const colors = getColorStyles(index, activeStep === index);
              const isActive = activeStep === index;
              
              return (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`relative flex items-center gap-2 md:gap-3 px-4 md:px-6 py-3 md:py-4 rounded-xl transition-all duration-300 group ${
                    isActive 
                      ? "text-primary-foreground shadow-lg scale-105" 
                      : "bg-muted/50 hover:bg-muted text-foreground hover:scale-102"
                  }`}
                  style={{
                    backgroundColor: isActive ? colors.bg : undefined,
                  }}
                >
                  {/* Step number */}
                  <span 
                    className={`hidden md:flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors ${
                      isActive 
                        ? "bg-white/20 text-primary-foreground" 
                        : "bg-background text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </span>
                  
                  <step.icon className={`w-5 h-5 ${isActive ? "text-primary-foreground" : ""}`} />
                  <span className="font-semibold text-sm md:text-base">{step.title}</span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-xl -z-10"
                      style={{ backgroundColor: colors.bg }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="relative min-h-[400px] md:min-h-[350px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
              >
                {/* Left: Icon & Visual */}
                <div className="flex justify-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="relative"
                  >
                    {/* Background glow */}
                    <div 
                      className="absolute inset-0 blur-3xl opacity-30 rounded-full"
                      style={{ backgroundColor: getColorStyles(activeStep, true).bg }}
                    />
                    
                    {/* Icon container */}
                    <div 
                      className="relative w-40 h-40 md:w-56 md:h-56 rounded-3xl flex items-center justify-center border-2"
                      style={{
                        backgroundColor: getColorStyles(activeStep, true).bgLight,
                        borderColor: getColorStyles(activeStep, true).border,
                      }}
                    >
                      {(() => {
                        const StepIcon = steps[activeStep].icon;
                        return (
                          <StepIcon 
                            className="w-16 h-16 md:w-24 md:h-24" 
                            style={{ color: getColorStyles(activeStep, true).bg }}
                          />
                        );
                      })()}
                      
                      {/* Step number badge */}
                      <div 
                        className="absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-primary-foreground shadow-lg"
                        style={{ backgroundColor: getColorStyles(activeStep, true).bg }}
                      >
                        {activeStep + 1}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Right: Content */}
                <div className="text-center md:text-left">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    <span 
                      className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4"
                      style={{
                        backgroundColor: getColorStyles(activeStep, true).bgLight,
                        color: getColorStyles(activeStep, true).bg,
                      }}
                    >
                      Step {activeStep + 1}
                    </span>
                    
                    <h3 className="text-2xl md:text-4xl font-display font-bold mb-2">
                      {steps[activeStep].title}
                    </h3>
                    
                    <p 
                      className="text-lg font-medium mb-4"
                      style={{ color: getColorStyles(activeStep, true).bg }}
                    >
                      {steps[activeStep].subtitle}
                    </p>
                    
                    <p className="text-muted-foreground mb-6 text-base md:text-lg">
                      {steps[activeStep].description}
                    </p>

                    {/* Details list */}
                    <ul className="space-y-3">
                      {steps[activeStep].details.map((detail, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + idx * 0.1, duration: 0.3 }}
                          className="flex items-center gap-3 text-foreground"
                        >
                          <ChevronRight 
                            className="w-5 h-5 flex-shrink-0" 
                            style={{ color: getColorStyles(activeStep, true).bg }}
                          />
                          <span>{detail}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation dots (mobile) */}
          <div className="flex justify-center gap-2 mt-8 md:hidden">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  activeStep === index ? "w-8" : "bg-muted-foreground/30"
                }`}
                style={{
                  backgroundColor: activeStep === index ? getColorStyles(index, true).bg : undefined,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
