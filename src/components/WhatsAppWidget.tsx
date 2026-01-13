import { MessageCircle } from "lucide-react";

const WhatsAppWidget = () => {
  const phoneNumber = "917012508851";
  const message = encodeURIComponent("Hi! I'm interested in your web development services.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Contact us on WhatsApp"
    >
      {/* Pulse ring */}
      <div className="absolute inset-0 rounded-full bg-[#25D366] animate-pulse-ring" />
      
      {/* Main button */}
      <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/30 flex items-center justify-center animate-float group-hover:scale-110 transition-transform duration-300">
        <MessageCircle className="w-7 h-7 md:w-8 md:h-8 text-white" />
      </div>

      {/* Tooltip */}
      <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
        Chat with us!
        <div className="absolute left-full top-1/2 -translate-y-1/2 border-8 border-transparent border-l-foreground" />
      </div>
    </a>
  );
};

export default WhatsAppWidget;
