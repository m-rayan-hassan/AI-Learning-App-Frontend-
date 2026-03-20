import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the Terms of Service for Cognivio AI. Understand your rights, obligations, and the rules governing your use of our AI-powered learning platform.",
};

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      <main className="flex-1 relative">
        {/* Background effect */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] h-[400px] bg-blue-500/5 blur-[120px] rounded-full mix-blend-screen opacity-50" />
        </div>

        <div className="container px-4 mx-auto pt-24 md:pt-36 pb-20">
          {/* Header */}
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
              Terms of Service
            </h1>
            <p className="text-muted-foreground">
              Last updated: March 20, 2026
            </p>
          </div>

          {/* Content */}
          <article className="max-w-3xl mx-auto space-y-12 text-[15px] leading-relaxed text-muted-foreground">
            {/* 1 */}
            <Section title="1. Acceptance of Terms">
              <p>
                By accessing or using <Strong>Cognivio AI</Strong> (the
                &ldquo;Service&rdquo;), you agree to be bound by these Terms of
                Service (&ldquo;Terms&rdquo;). If you do not agree, you may not
                use the Service.
              </p>
              <p className="mt-3">
                We may update these Terms from time to time. Continued use of
                the Service after any changes constitutes acceptance of the new
                Terms. We will notify registered users of material changes via
                email or an in-app notice.
              </p>
            </Section>

            {/* 2 */}
            <Section title="2. Account Registration">
              <p>
                To access most features, you must create an account using a
                valid email address or a supported third-party provider (e.g.,
                Google Sign-In). You are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Maintaining the confidentiality of your login credentials.</li>
                <li>All activity that occurs under your account.</li>
                <li>
                  Notifying us immediately at{" "}
                  <a
                    href="mailto:cognivioai.app@gmail.com" target="_blank" rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    cognivioai.app@gmail.com
                  </a>{" "}
                  if you suspect unauthorized access.
                </li>
              </ul>
            </Section>

            {/* 3 */}
            <Section title="3. Description of the Service">
              <p>
                Cognivio AI is an AI-powered learning platform that helps users
                transform study materials into interactive learning experiences.
                Features include, but are not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>AI-generated summaries, flashcards, and quizzes</li>
                <li>Contextual document chat</li>
                <li>Voice-based learning and viva-mode simulation</li>
                <li>Podcast-style audio overviews</li>
                <li>AI-generated video explanations</li>
                <li>Concept explanation tools</li>
              </ul>
              <p className="mt-3">
                Features may vary by subscription plan and may be modified,
                added, or removed at our discretion.
              </p>
            </Section>

            {/* 4 */}
            <Section title="4. Subscription Plans & Billing">
              <p>
                Cognivio AI offers the following subscription tiers:
              </p>
              <div className="mt-4 border border-border/50 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/30 text-foreground">
                      <th className="text-left px-4 py-3 font-semibold">Plan</th>
                      <th className="text-left px-4 py-3 font-semibold">Price</th>
                      <th className="text-left px-4 py-3 font-semibold">Billing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    <tr><td className="px-4 py-3">Free</td><td className="px-4 py-3">$0</td><td className="px-4 py-3">—</td></tr>
                    <tr><td className="px-4 py-3">Plus</td><td className="px-4 py-3">$5/month</td><td className="px-4 py-3">Monthly</td></tr>
                    <tr><td className="px-4 py-3">Pro</td><td className="px-4 py-3">$10/month</td><td className="px-4 py-3">Monthly</td></tr>
                    <tr><td className="px-4 py-3">Premium</td><td className="px-4 py-3">$20/month</td><td className="px-4 py-3">Monthly</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4">
                All paid subscriptions are processed through{" "}
                <Strong>Paddle</Strong>, our Merchant of Record. By
                subscribing, you also agree to{" "}
                <a
                  href="https://www.paddle.com/legal/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Paddle&apos;s Terms of Service
                </a>
                . Paddle handles all payment processing, tax collection,
                invoicing, and compliance as the seller of record.
              </p>
              <p className="mt-3">
                Subscriptions renew automatically at the end of each billing
                period unless canceled. You may cancel at any time from your
                account settings; your access continues until the end of the
                current billing cycle. For refund details, see our{" "}
                <Link href="/refund" className="text-primary hover:underline">
                  Refund Policy
                </Link>
                .
              </p>
            </Section>

            {/* 5 */}
            <Section title="5. Intellectual Property">
              <p>
                All content, branding, software, and materials provided through
                the Service (excluding user-uploaded content) are our exclusive
                property and are protected by intellectual property laws. You
                may not copy, modify, distribute, or reverse-engineer any part
                of the Service without prior written consent.
              </p>
              <p className="mt-3">
                You retain ownership of any materials you upload. By uploading
                content, you grant us a limited, non-exclusive license to
                process and analyze it solely for the purpose of providing the
                Service to you.
              </p>
            </Section>

            {/* 6 */}
            <Section title="6. Acceptable Use">
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Use the Service for any unlawful purpose.</li>
                <li>Upload content that infringes on third-party intellectual property rights.</li>
                <li>Attempt to gain unauthorized access to any part of the Service or its infrastructure.</li>
                <li>Use automated scripts or bots to scrape, overload, or interfere with the Service.</li>
                <li>Share your account credentials with others or allow multiple users to access a single account.</li>
                <li>Upload malicious files or content that could harm the Service or other users.</li>
              </ul>
              <p className="mt-3">
                Violation of these rules may result in immediate suspension or
                termination of your account.
              </p>
            </Section>

            {/* 7 */}
            <Section title="7. AI-Generated Content Disclaimer">
              <p>
                Cognivio AI uses artificial intelligence to generate summaries,
                flashcards, quizzes, explanations, and other outputs. While we
                strive for accuracy, AI-generated content may contain errors or
                inaccuracies. The Service is intended as a supplementary study
                tool and should not be relied upon as the sole source of
                information for academic, professional, or critical decisions.
              </p>
            </Section>

            {/* 8 */}
            <Section title="8. Generated Content & Public URLs">
              <p>
                Certain content generated by the Service — including voice
                overviews, podcast audio, and video explanations — is stored on
                third-party cloud infrastructure (Cloudinary). The URLs for
                this content are unique, cryptographically secure links that
                cannot be guessed. However, anyone who has the URL can access
                the content.
              </p>
              <p className="mt-3">
                By using these features, you acknowledge that if you copy and
                share a generated content URL, the recipient will be able to
                view or listen to that content without authentication. We are
                not responsible for content shared by you through these URLs.
              </p>
            </Section>

            {/* 9 */}
            <Section title="9. Limitation of Liability">
              <p>
                To the maximum extent permitted by applicable law, we shall not
                be liable for any indirect, incidental, special, consequential,
                or punitive damages, including but not limited to loss of data,
                profits, or goodwill, arising out of or in connection with your
                use of the Service.
              </p>
              <p className="mt-3">
                Our total aggregate liability for any claims arising from or
                relating to the Service shall not exceed the amount you paid us
                in the twelve (12) months preceding the claim.
              </p>
            </Section>

            {/* 10 */}
            <Section title="10. Disclaimers">
              <p>
                THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
                AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS
                OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
                MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
                NON-INFRINGEMENT. We do not guarantee that the Service will be
                uninterrupted, error-free, or secure at all times.
              </p>
            </Section>

            {/* 11 */}
            <Section title="11. Termination">
              <p>
                We reserve the right to suspend or terminate your account at
                any time, with or without notice, for conduct that we determine
                violates these Terms or is harmful to the Service, other users,
                or third parties. You may delete your account at any time by
                contacting us at{" "}
                <a
                  href="mailto:cognivioai.app@gmail.com" target="_blank" rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  cognivioai.app@gmail.com
                </a>
                .
              </p>
              <p className="mt-3">
                Upon termination, your right to access the Service ceases
                immediately. We may, at our discretion, delete your data
                following termination.
              </p>
            </Section>

            {/* 12 */}
            <Section title="12. Governing Law">
              <p>
                These Terms shall be governed by and construed in accordance
                with applicable laws. Any disputes shall be resolved through
                binding arbitration or in the courts of the applicable
                jurisdiction.
              </p>
            </Section>

            {/* 13 */}
            <Section title="13. Contact Us">
              <p>
                If you have questions or concerns about these Terms, please
                contact us:
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
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              <Link href="/refund" className="text-primary hover:underline">
                Refund Policy
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
