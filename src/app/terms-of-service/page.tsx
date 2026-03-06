import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AnimatedBrand } from "@/components/landing/AnimatedBrand";

export default function TermsOfService() {
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
          <h1 className="text-3xl md:text-5xl font-black italic tracking-tight mb-4">Terms of Service</h1>
          <p className="text-muted-foreground text-lg mb-8">Last updated: March 2024</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-black italic mb-4">1. Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                By accessing and using Feedback.ai ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black italic mb-4">2. Use License</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Permission is granted to temporarily download one copy of the materials (information or software) on Feedback.ai for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Modifying or copying the materials</li>
                <li>Using the materials for any commercial purpose or for any public display</li>
                <li>Attempting to decompile or reverse engineer any software contained on Feedback.ai</li>
                <li>Removing any copyright or other proprietary notations from the materials</li>
                <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black italic mb-4">3. Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The materials on Feedback.ai are provided on an 'as is' basis. Feedback.ai makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black italic mb-4">4. Limitations</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                In no event shall Feedback.ai or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Feedback.ai, even if Feedback.ai or a Feedback.ai authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black italic mb-4">5. Accuracy of Materials</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The materials appearing on Feedback.ai could include technical, typographical, or photographic errors. Feedback.ai does not warrant that any of the materials on Feedback.ai are accurate, complete, or current. Feedback.ai may make changes to the materials contained on Feedback.ai at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black italic mb-4">6. Links</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Feedback.ai has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Feedback.ai of the site. Use of any such linked website is at the user's own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black italic mb-4">7. Modifications</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Feedback.ai may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black italic mb-4">8. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These terms and conditions are governed by and construed in accordance with the laws of the United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black italic mb-4">9. User Accounts</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you create an account on Feedback.ai, you are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account. You must immediately notify Feedback.ai of any unauthorized uses of your account. Feedback.ai will not be liable for any acts or omissions by you, including any damages of any kind incurred as a result of such acts or omissions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black italic mb-4">10. Subscriptions and Billing</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Users may choose to subscribe to a paid plan to access premium features. By subscribing, you authorize Feedback.ai to charge your payment method on a recurring basis according to the plan you selected. Subscriptions will continue automatically until cancelled by you. You may cancel your subscription at any time through your account settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black italic mb-4">11. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at support@feedback.ai.
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
