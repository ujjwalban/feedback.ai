import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AnimatedBrand } from "@/components/landing/AnimatedBrand";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-20 items-center justify-between px-6">
          <Link href="/">
            <AnimatedBrand iconSize={24} textSize="text-xl md:text-2xl" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto max-w-4xl px-6 py-16 md:py-24">
        <Link href="/">
          <Button variant="ghost" className="mb-8 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Button>
        </Link>

        <div className="prose prose-invert max-w-none">
          <h1 className="text-3xl md:text-5xl font-black italic tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground text-lg mb-8">Last updated: March 2024</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-black italic mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Feedback.ai ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and otherwise process information in connection with our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black italic mb-4">2. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We collect information you provide directly, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Account information (name, email, password)</li>
                <li>Profile information (username, company name, avatar)</li>
                <li>Payment information (processed through Stripe)</li>
                <li>Testimonial content and metadata</li>
                <li>Communications with us</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black italic mb-4">3. Automatically Collected Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When you access Feedback.ai, we automatically collect:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Device information (browser type, operating system)</li>
                <li>Usage analytics (pages visited, time spent, interactions)</li>
                <li>IP address and general location</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black italic mb-4">4. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Provide, maintain, and improve the Service</li>
                <li>Process transactions and send related information</li>
                <li>Send promotional communications (with your consent)</li>
                <li>Respond to your inquiries and support requests</li>
                <li>Analyze usage patterns and improve user experience</li>
                <li>Comply with legal obligations</li>
                <li>Prevent fraudulent activity and enforce our terms</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black italic mb-4">5. Sharing Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may share your information with:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Service providers who assist in operating our Service</li>
                <li>Payment processors (Stripe) for payment handling</li>
                <li>Law enforcement when required by law</li>
                <li>Professional advisors (lawyers, accountants)</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We do not sell or rent your personal information to third parties for their marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black italic mb-4">6. Data Storage and Security</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Your information is stored securely using industry-standard encryption and security measures. Supabase manages our database infrastructure with encryption at rest and in transit. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black italic mb-4">7. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Depending on your location, you may have certain rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Right to access your information</li>
                <li>Right to correct inaccurate data</li>
                <li>Right to delete your information</li>
                <li>Right to object to processing</li>
                <li>Right to data portability</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                To exercise these rights, please contact us at privacy@feedback.ai.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black italic mb-4">8. Testimonials and Public Content</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Testimonials you submit may be publicly displayed on your public profile page and shared via widgets on client websites. You retain control over this content and can modify or delete it at any time through your dashboard.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black italic mb-4">9. Cookies</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use cookies and similar technologies to enhance your experience. You can control cookie preferences through your browser settings. Note that disabling cookies may affect the functionality of our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black italic mb-4">10. Third-Party Links</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Feedback.ai may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black italic mb-4">11. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Feedback.ai is not intended for users under 13 years of age. We do not knowingly collect personal information from children. If we become aware of such collection, we will take steps to delete such data promptly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black italic mb-4">12. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We retain your information for as long as necessary to provide the Service and fulfill the purposes outlined in this policy. You can request deletion of your account and associated data at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black italic mb-4">13. Policy Changes</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may update this Privacy Policy occasionally. We will notify you of significant changes via email or by posting the updated policy on our website. Your continued use of the Service after changes indicates your acceptance of the updated Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black italic mb-4">14. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about this Privacy Policy or our privacy practices, please contact us at privacy@feedback.ai.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 border-t bg-muted/20 mt-24">
        <div className="container mx-auto px-6 text-center">
          <p className="text-[10px] uppercase font-black tracking-[0.3em] text-muted-foreground/40">© {new Date().getFullYear()} Feedback.ai. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
