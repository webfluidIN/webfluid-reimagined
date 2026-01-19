import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-8">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 19, 2026</p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using Webfluid's website and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                Webfluid provides web development services including but not limited to Shopify development, WordPress development, WooCommerce setup, payment gateway integration, and ongoing website maintenance. The specific scope of services will be outlined in individual project agreements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Client Responsibilities</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                As a client, you agree to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Provide accurate and complete information required for project completion</li>
                <li>Respond to communications and requests in a timely manner</li>
                <li>Provide necessary content, images, and materials as agreed</li>
                <li>Make payments according to the agreed-upon schedule</li>
                <li>Review and provide feedback on deliverables within specified timeframes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Payment Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Payment terms will be specified in individual project proposals or agreements. Generally:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>A deposit may be required before work begins</li>
                <li>Payment milestones may be established for larger projects</li>
                <li>Final payment is due upon project completion and before final handover</li>
                <li>Late payments may incur additional fees</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                Upon full payment, clients receive ownership rights to the custom work created specifically for their project. Webfluid retains the right to use general techniques, code libraries, and non-proprietary elements in other projects. We may showcase completed projects in our portfolio unless otherwise agreed.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Warranties and Disclaimers</h2>
              <p className="text-muted-foreground leading-relaxed">
                We strive to deliver high-quality work and provide a reasonable warranty period for bug fixes on completed projects. However, we do not guarantee specific business outcomes, search engine rankings, or sales performance. Third-party platforms (Shopify, WordPress, etc.) are subject to their own terms and availability.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                Webfluid's liability is limited to the amount paid for the specific services in question. We are not liable for indirect, incidental, or consequential damages, including lost profits, data loss, or business interruption.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Project Modifications and Cancellations</h2>
              <p className="text-muted-foreground leading-relaxed">
                Changes to project scope may result in adjusted timelines and costs. Cancellation terms will be specified in individual agreements. Work completed prior to cancellation will be billed accordingly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Confidentiality</h2>
              <p className="text-muted-foreground leading-relaxed">
                Both parties agree to keep confidential any proprietary or sensitive information shared during the course of the project. This obligation continues after project completion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms of Service are governed by the laws of India. Any disputes arising from these terms or our services will be resolved in the courts of Kerala, India.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms of Service at any time. Changes will be effective upon posting to our website. Continued use of our services constitutes acceptance of modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-muted-foreground mt-2">
                <strong>Email:</strong> hello@webfluid.in<br />
                <strong>Phone:</strong> +91 7012508851
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
