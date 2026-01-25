import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

interface PortfolioItem {
  name: string;
  url: string;
  description: string;
  category: string;
}

const portfolioItems: PortfolioItem[] = [
  {
    name: "Zimal by Junaida",
    url: "zimalbyjunaida.com",
    description: "Luxury fashion boutique",
    category: "WooCommerce",
  },
  {
    name: "Lyra Modest",
    url: "lyramodest.com",
    description: "Modest fashion wear",
    category: "Shopify",
  },
  {
    name: "The Blossoms Boutique",
    url: "theblossomsboutique.com",
    description: "Women's fashion",
    category: "Shopify",
  },
  {
    name: "Leisure COK",
    url: "leisurecok.com",
    description: "Travel agency",
    category: "WordPress",
  },
  {
    name: "By Irfa",
    url: "byirfa.com",
    description: "Fashion & accessories",
    category: "WooCommerce",
  },
  {
    name: "Zahraa The Label",
    url: "zahraathelabel.com",
    description: "Contemporary fashion",
    category: "Shopify",
  },
  {
    name: "Tanya Taylor",
    url: "tanyataylor.com",
    description: "Designer fashion brand",
    category: "Shopify",
  },
  {
    name: "Al Naseem Group",
    url: "alnaseemgroup.com",
    description: "Corporate business website",
    category: "WordPress",
  },
  {
    name: "Almas Group",
    url: "almasgroup.co",
    description: "Cargo company",
    category: "PHP",
  },
  {
    name: "Oma & Mimi",
    url: "omamimini.com",
    description: "Children's fashion brand",
    category: "Shopify",
  },
  {
    name: "Fleurelize",
    url: "fleurelize.com",
    description: "Clothing brand",
    category: "Shopify",
  },
  {
    name: "Generation IX",
    url: "www.generationix.com",
    description: "Managed IT services",
    category: "WordPress",
  },
  {
    name: "British School Salalah",
    url: "www.britishschoolsalalah.com",
    description: "Educational institution",
    category: "WordPress",
  },
];

const PortfolioSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const itemsPerView = 3;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % portfolioItems.length);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + portfolioItems.length) % portfolioItems.length);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const getVisibleItems = () => {
    const items = [];
    for (let i = 0; i < itemsPerView; i++) {
      const index = (currentIndex + i) % portfolioItems.length;
      items.push({ ...portfolioItems[index], originalIndex: index });
    }
    return items;
  };

  return (
    <section id="portfolio" className="py-20 md:py-32 bg-background">
      <div className="container px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Our <span className="gradient-text">Success Stories</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Real stores, real results. See how we've helped businesses thrive online.
          </p>
        </div>

        {/* Carousel */}
        <div
          className="relative max-w-6xl mx-auto"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Navigation buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-card shadow-lg border-2 hover:border-primary hidden md:flex"
            onClick={prevSlide}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-card shadow-lg border-2 hover:border-primary hidden md:flex"
            onClick={nextSlide}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          {/* Cards container */}
          <div className="overflow-hidden px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {getVisibleItems().map((item, idx) => (
                <div
                  key={`${item.url}-${idx}`}
                  className="group relative rounded-2xl overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-500 bg-card hover:shadow-2xl hover:shadow-primary/10"
                >
                  {/* Browser mockup */}
                  <div className="bg-muted p-2 border-b border-border">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-destructive/60" />
                        <div className="w-3 h-3 rounded-full bg-brand-orange/60" />
                        <div className="w-3 h-3 rounded-full bg-secondary/60" />
                      </div>
                      <div className="flex-1 bg-background rounded px-3 py-1 text-xs text-muted-foreground truncate">
                        {item.url}
                      </div>
                    </div>
                  </div>

                  {/* Screenshot area */}
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                    <img
                      src={`https://image.thum.io/get/width/600/crop/800/https://${item.url}`}
                      alt={`${item.name} website screenshot`}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-display font-semibold text-lg">{item.name}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {portfolioItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? "w-8 gradient-bg"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="flex justify-center gap-4 mt-6 md:hidden">
          <Button variant="outline" size="icon" onClick={prevSlide}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextSlide}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
