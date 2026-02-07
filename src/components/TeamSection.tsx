import { MapPin, Globe2, Calendar } from "lucide-react";
import SpiderWebBackground from "@/components/SpiderWebBackground";

// Import team images
import officeInauguration from "@/assets/team/office-inauguration.jpeg";
import officeStaff from "@/assets/team/office-staff.jpeg";
import officeCake from "@/assets/team/office-cake.jpeg";
import office from "@/assets/team/office.jpeg";
import team from "@/assets/team/team.jpeg";
import retreat1 from "@/assets/team/retreat-1.jpg";
import retreat2 from "@/assets/team/retreat-2.jpg";
import retreat3 from "@/assets/team/retreat-3.jpg";
import retreat4 from "@/assets/team/retreat-4.jpg";
import retreat5 from "@/assets/team/retreat-5.jpg";
const teamImages = [{
  src: office,
  alt: "Webfluid office space"
}, {
  src: officeStaff,
  alt: "Team working at office"
}, {
  src: officeInauguration,
  alt: "Office inauguration ceremony"
}, {
  src: officeCake,
  alt: "Team celebration"
}, {
  src: team,
  alt: "Webfluid team photo"
}, {
  src: retreat1,
  alt: "Team retreat activities"
}, {
  src: retreat2,
  alt: "Team bonding outdoors"
}, {
  src: retreat3,
  alt: "Team retreat nature"
}, {
  src: retreat4,
  alt: "Team adventures"
}, {
  src: retreat5,
  alt: "Team outing"
}];
const TeamSection = () => {
  return <section id="team" className="py-20 md:py-32 bg-muted/30 overflow-hidden relative">
      <SpiderWebBackground variant="corners" color="hsl(var(--brand-blue))" opacity={0.22} webSize={460} />
      <div className="container px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Meet the <span className="gradient-text">People</span> Behind Webfluid
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            A remote-first company with a global team, united by passion for exceptional web experiences.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            <div className="flex items-center gap-3 px-4 py-2 rounded-full glass">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="font-semibold">Since 2017</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-full glass">
              <MapPin className="w-5 h-5 text-secondary" />
              <span className="font-semibold">Calicut, Kerala</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-full glass">
              <Globe2 className="w-5 h-5 text-accent" />
              <span className="font-semibold">Remote Team Worldwide</span>
            </div>
          </div>
        </div>

        {/* Auto-scrolling carousel */}
        <div className="relative">
          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-muted/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-muted/80 to-transparent z-10 pointer-events-none" />

          {/* Scrolling container */}
          <div className="flex animate-scroll">
            {/* First set of images */}
            {teamImages.map((image, index) => <div key={`first-${index}`} className="flex-shrink-0 w-64 md:w-80 h-48 md:h-56 mx-2 rounded-xl overflow-hidden group">
                <img src={image.src} alt={image.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>)}
            {/* Duplicate set for seamless loop */}
            {teamImages.map((image, index) => <div key={`second-${index}`} className="flex-shrink-0 w-64 md:w-80 h-48 md:h-56 mx-2 rounded-xl overflow-hidden group">
                <img src={image.src} alt={image.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>)}
          </div>
        </div>

        {/* Description */}
        <div className="mt-12 text-center max-w-2xl mx-auto">
          <p className="text-muted-foreground">
            Our physical office is located in Kerala, India, but our team spans across the globe. 
            We believe in flexibility, creativity, and delivering exceptional results—no matter where we work from. 
            From team retreats to milestone celebrations, we stay connected and committed to our craft.
          </p>
        </div>
      </div>
    </section>;
};
export default TeamSection;