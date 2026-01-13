import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What's included in the $299 eCommerce package?",
    answer: "Our all-inclusive eCommerce package includes complete Shopify or WooCommerce store development, professional theme customization, payment gateway setup (Stripe, PayPal, Razorpay, etc.), product listing assistance, and one month of free support for order management and fulfillment. No hidden fees—everything you need to start selling online.",
  },
  {
    question: "How long does it take to build my store?",
    answer: "Typically, an eCommerce store takes 2-3 weeks to complete, depending on complexity and the number of products. Business websites are usually ready in 7-14 days. We'll provide a detailed timeline during our initial consultation.",
  },
  {
    question: "Should I choose Shopify or WordPress (WooCommerce)?",
    answer: "It depends on your needs! Shopify is perfect for beginners and those who want a hassle-free experience with built-in hosting. WooCommerce is ideal if you want more customization control and lower long-term costs. We'll help you choose the best platform during our discovery call.",
  },
  {
    question: "What payment gateways do you support?",
    answer: "We integrate all major payment gateways including Stripe, PayPal, Razorpay, Square, and more. We'll set up the gateway that works best for your target market and business model.",
  },
  {
    question: "What happens after my website is launched?",
    answer: "For eCommerce clients, we provide one month of free support covering product listing, order management guidance, and fulfillment setup. After that, we offer affordable monthly support packages. For business websites, we offer maintenance packages to keep your site updated and secure.",
  },
  {
    question: "Do you offer ongoing support and maintenance?",
    answer: "Absolutely! We offer various support packages starting from $49/month, covering updates, security, backups, and content changes. Many of our clients continue working with us for years after their initial project.",
  },
  {
    question: "Can you help with marketing and SEO?",
    answer: "Yes! While our packages include basic SEO setup, we also offer advanced digital marketing services including SEO optimization, social media marketing, and paid advertising management as add-on services.",
  },
  {
    question: "What if I need changes after the website is live?",
    answer: "Small changes during the support period are included. For larger modifications or new features, we provide transparent pricing and quick turnaround. We're always here to help your business grow!",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-20 md:py-32 bg-background">
      <div className="container px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Got questions? We've got answers. If you don't find what you're looking for, feel free to reach out!
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-2 border-border rounded-xl px-6 data-[state=open]:border-primary/30 data-[state=open]:bg-primary/5 transition-all"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
