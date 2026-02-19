import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import SpiderWebBackground from "@/components/SpiderWebBackground";
import jessyKennedy from "@/assets/testimonials/jessy-kennedy.png";
import marinaIrvin from "@/assets/testimonials/marina-irvin.png";
import sarahAhmed from "@/assets/testimonials/sarah-ahmed.png";
import rashidAli from "@/assets/testimonials/rashid-ali.png";

const testimonials = [
  {
    name: "Jessy Kennedy",
    company: "Engel Lane",
    image: jessyKennedy,
    rating: 5,
    text: "Webfluid transformed our vision into a stunning online store. The team's attention to detail and understanding of our brand was exceptional. Sales have increased by 200% since launch!",
  },
  {
    name: "Marina Irvin",
    company: "Hatchgal",
    image: marinaIrvin,
    rating: 5,
    text: "Professional, responsive, and incredibly talented. They delivered our Shopify store ahead of schedule and the ongoing support has been invaluable for our business growth.",
  },
  {
    name: "Sarah Ahmed",
    company: "Lyra Modest",
    image: sarahAhmed,
    rating: 5,
    text: "The best decision we made for our online presence. The eCommerce site they built is beautiful, fast, and converts like crazy. Highly recommend their services!",
  },
  {
    name: "Rashid Ali",
    company: "Al Naseem Group",
    image: rashidAli,
    rating: 5,
    text: "Excellent work on our corporate website. The team understood our requirements perfectly and delivered a modern, professional site that represents our brand well.",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-20 md:py-32 bg-muted/30 relative overflow-hidden">
      <SpiderWebBackground variant="scattered" color="hsl(var(--brand-purple))" opacity={0.22} webSize={420} />
      <div className="container px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            What Our <span className="gradient-text">Clients</span> Say
          </h2>
          <p className="text-lg text-muted-foreground">
            Don't just take our word for it—hear from the businesses we've helped succeed online.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-2 border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl"
            >
              <CardContent className="p-6">
                {/* Quote icon */}
                <Quote className="w-10 h-10 text-primary/20 absolute top-4 right-4 group-hover:text-primary/40 transition-colors" />

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-brand-orange text-brand-orange" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-muted-foreground mb-6 relative z-10">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full border-2 border-primary/20"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
