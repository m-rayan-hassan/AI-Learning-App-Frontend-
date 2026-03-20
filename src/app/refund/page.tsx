import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "Understand our refund and cancellation policies for Cognivio AI subscriptions. Learn about eligibility, timelines, and how to request a refund.",
};

export default function RefundPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      <main className="flex-1 relative">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] h-[400px] bg-blue-500/5 blur-[120px] rounded-full mix-blend-screen opacity-50" />
        </div>

        <div className="container px-4 mx-auto pt-24 md:pt-36 pb-20">
          {/* Header */}
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
              Refund Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: March 20, 2026
            </p>
          </div>

          {/* Content */}
          <article className="max-w-3xl mx-auto space-y-12 text-[15px] leading-relaxed text-muted-foreground">
            <Section title="1. Overview">
              <p>
                We want you to be completely satisfied with your subscription.
                This Refund Policy outlines the circumstances under which you
                may be eligible for a refund for paid subscriptions to{" "}
                <Strong>Cognivio AI</Strong>.
              </p>
              <p className="mt-3">
                All payments are processed by <Strong>Paddle</Strong>, our
                Merchant of Record. Refunds are issued through Paddle to the
                original payment method.
              </p>
            </Section>

            <Section title="2. Subscription Cancellation">
              <p>
                You may cancel your subscription at any time from the{" "}
                <Link href="/pricing" className="text-primary hover:underline">
                  Pricing
                </Link>{" "}
                page within your account. When you cancel:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  Your subscription will remain active until the end of the
                  current billing period.
                </li>
                <li>
                  You will not be charged for subsequent billing cycles.
                </li>
                <li>
                  After the billing period ends, your account will revert to
                  the Free plan.
                </li>
              </ul>
              <p className="mt-3">
                Cancellation alone does not entitle you to a refund for the
                current billing period.
              </p>
            </Section>

            <Section title="3. Refund Eligibility">
              <p>
                You may request a full refund if you meet <Strong>all</Strong>{" "}
                of the following criteria:
              </p>
              <div className="mt-4 p-5 rounded-xl bg-card/60 border border-border/50 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-green-500 text-xs font-bold">✓</span>
                  </div>
                  <p>
                    <Strong>Within 7 days</Strong> — The refund request is
                    made within 7 days of the initial subscription purchase or
                    the most recent renewal.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-green-500 text-xs font-bold">✓</span>
                  </div>
                  <p>
                    <Strong>Technical issues</Strong> — You experienced a
                    significant technical issue that prevented you from using
                    the Service, and our support team was unable to resolve
                    it.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-green-500 text-xs font-bold">✓</span>
                  </div>
                  <p>
                    <Strong>Duplicate charge</Strong> — You were charged
                    multiple times for the same subscription period in error.
                  </p>
                </div>
              </div>
            </Section>

            <Section title="4. Premium Feature Usage — No Refund">
              <p>
                If you have used any of the following premium features during
                your current billing period, you are <Strong>not eligible</Strong>{" "}
                for a refund, regardless of the refund window:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  <Strong>Voice Overview / Podcast Generation</Strong> — AI-generated
                  audio content using text-to-speech technology.
                </li>
                <li>
                  <Strong>Video Overview Generation</Strong> — AI-generated
                  video explanations with visual slides and narration.
                </li>
                <li>
                  <Strong>Viva Mode (Voice Chat)</Strong> — Real-time voice
                  interaction with the AI tutor.
                </li>
              </ul>
              <p className="mt-3">
                These features consume significant third-party resources
                (ElevenLabs, Gamma, Vapi, Cloudinary) upon use, and the costs
                incurred cannot be reversed. By using these features, you
                acknowledge that your subscription payment for that billing
                cycle is non-refundable.
              </p>
            </Section>

            <Section title="5. Prorated Credits for Upgrades">
              <p>
                When you upgrade from one paid plan to a higher-tier plan
                mid-cycle, the remaining value of your current plan is applied
                as a prorated credit toward the new plan. This credit is
                calculated and applied automatically by Paddle at the time of
                the upgrade.
              </p>
              <p className="mt-3">
                Prorated credits are non-refundable and cannot be converted to
                cash.
              </p>
            </Section>

            <Section title="6. Non-Refundable Items">
              <p>The following are not eligible for refunds:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  Subscriptions where premium features (Voice, Video, Viva
                  Mode) have been used during the billing period.
                </li>
                <li>
                  Subscriptions canceled after the 7-day refund window.
                </li>
                <li>
                  Partial or unused portions of a billing period (unless a
                  qualifying technical issue occurred).
                </li>
                <li>
                  Free plan accounts (no payment was made).
                </li>
                <li>
                  Dissatisfaction with AI-generated content quality, as outputs
                  may vary based on the source material provided.
                </li>
              </ul>
            </Section>

            <Section title="7. How to Request a Refund">
              <p>To request a refund, please follow these steps:</p>
              <ol className="list-decimal pl-6 space-y-3 mt-3">
                <li>
                  Send an email to{" "}
                  <a
                    href="mailto:cognivioai.app@gmail.com" target="_blank" rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    cognivioai.app@gmail.com
                  </a>{" "}
                  with the subject line &ldquo;Refund Request.&rdquo;
                </li>
                <li>
                  Include your registered email address and a brief
                  explanation of why you are requesting a refund.
                </li>
                <li>
                  Our team will review your request and respond within{" "}
                  <Strong>3 business days</Strong>.
                </li>
              </ol>
            </Section>

            <Section title="8. Processing Timeline">
              <p>
                Once a refund is approved, it will be processed by Paddle.
                Depending on your payment method and financial institution,
                refunds typically appear within:
              </p>
              <div className="mt-4 border border-border/50 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/30 text-foreground">
                      <th className="text-left px-4 py-3 font-semibold">
                        Payment Method
                      </th>
                      <th className="text-left px-4 py-3 font-semibold">
                        Estimated Timeline
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    <tr>
                      <td className="px-4 py-3">Credit / Debit Card</td>
                      <td className="px-4 py-3">5–10 business days</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">PayPal</td>
                      <td className="px-4 py-3">3–5 business days</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Other methods</td>
                      <td className="px-4 py-3">Up to 14 business days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Section>

            <Section title="9. Contact Us">
              <p>
                If you have questions about this Refund Policy, please contact
                us:
              </p>
              <div className="mt-4 p-5 rounded-xl bg-card/60 border border-border/50">
                <p className="text-foreground font-medium">Cognivio AI</p>
                <p className="mt-2">
                  Email:{" "}
                  <a
                    href="mailto:cognivioai.app@gmail.com" target="_blank" rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    cognivioai.app@gmail.com
                  </a>
                </p>
              </div>
            </Section>

            {/* Related links */}
            <div className="pt-8 border-t border-border/40 flex flex-wrap gap-4 text-sm">
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              <Link href="/pricing" className="text-primary hover:underline">
                Pricing
              </Link>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* ── Helpers ────────────────────────────────────────────── */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-bold text-foreground mb-4 tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Strong({ children }: { children: React.ReactNode }) {
  return <span className="text-foreground font-medium">{children}</span>;
}
