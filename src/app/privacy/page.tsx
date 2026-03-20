import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Cognivio AI collects, uses, and protects your personal data. Read our full Privacy Policy.",
};

export default function PrivacyPolicyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: March 20, 2026
            </p>
          </div>

          {/* Content */}
          <article className="max-w-3xl mx-auto space-y-12 text-[15px] leading-relaxed text-muted-foreground">
            <Section title="1. Introduction">
              <p>
                We are committed to protecting your privacy. This Privacy
                Policy explains how we collect, use, disclose, and safeguard
                your information when you use{" "}
                <Strong>Cognivio AI</Strong> (the &ldquo;Service&rdquo;).
              </p>
              <p className="mt-3">
                By using the Service, you consent to the practices described in
                this policy. If you do not agree, please discontinue use of the
                Service.
              </p>
            </Section>

            <Section title="2. Information We Collect">
              <h3 className="text-foreground font-medium mt-4 mb-2">
                2.1 Information You Provide
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <Strong>Account information</Strong> — name, email address,
                  and profile picture (provided directly or via Google
                  Sign-In).
                </li>
                <li>
                  <Strong>Uploaded content</Strong> — documents, PDFs, and
                  other study materials you upload for processing.
                </li>
                <li>
                  <Strong>Communications</Strong> — messages you send to us
                  via the contact form or email.
                </li>
              </ul>

              <h3 className="text-foreground font-medium mt-6 mb-2">
                2.2 Information Collected Automatically
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <Strong>Usage data</Strong> — pages viewed, features used,
                  timestamps, and interaction patterns.
                </li>
                <li>
                  <Strong>Device information</Strong> — browser type, operating
                  system, screen resolution, and IP address.
                </li>
              </ul>
            </Section>

            <Section title="3. How We Use Your Information">
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Provide, operate, and improve the Service.</li>
                <li>
                  Process your uploaded documents using AI to generate
                  summaries, flashcards, quizzes, audio, and video content.
                </li>
                <li>Manage your account and subscription.</li>
                <li>Send transactional emails (e.g., password reset, billing notifications).</li>
                <li>Detect and prevent fraud, abuse, and security incidents.</li>
                <li>Comply with legal obligations.</li>
              </ul>
              <p className="mt-4">
                We do <Strong>not</Strong> sell your personal information to
                third parties. We do <Strong>not</Strong> use your uploaded
                documents to train our AI models.
              </p>
            </Section>

            <Section title="4. Third-Party Services">
              <p>
                We work with trusted third-party providers to deliver the
                Service. These providers have access only to the information
                necessary to perform their specific functions:
              </p>
              <div className="mt-4 space-y-3">
                <ThirdParty
                  name="Paddle"
                  purpose="Payment processing, tax collection, and invoicing as our Merchant of Record"
                  url="https://www.paddle.com/legal/privacy"
                />
                <ThirdParty
                  name="Google OAuth"
                  purpose="Account authentication via Google Sign-In"
                  url="https://policies.google.com/privacy"
                />
                <ThirdParty
                  name="Google Gemini"
                  purpose="AI-powered content generation (summaries, flashcards, quizzes, explanations)"
                  url="https://ai.google.dev/terms"
                />
                <ThirdParty
                  name="Cloudinary"
                  purpose="Cloud storage for generated media files (audio overviews, podcast audio, video content, and profile images)"
                  url="https://cloudinary.com/privacy"
                />
                <ThirdParty
                  name="ElevenLabs"
                  purpose="AI text-to-speech for voice overviews, podcast narration, and video explanations"
                  url="https://elevenlabs.io/privacy-policy"
                />
                <ThirdParty
                  name="Gamma"
                  purpose="Slide rendering and visual presentation generation for AI video overviews"
                  url="https://gamma.app/privacy"
                />
                <ThirdParty
                  name="Vapi"
                  purpose="Real-time voice interaction and viva-mode speech processing"
                  url="https://vapi.ai/privacy"
                />
                <ThirdParty
                  name="MongoDB Atlas"
                  purpose="Cloud database for storing user accounts, documents, and generated content metadata"
                  url="https://www.mongodb.com/legal/privacy-policy"
                />
              </div>
              <p className="mt-4">
                We encourage you to review the privacy policies of these
                providers.
              </p>
            </Section>

            <Section title="5. Generated Content & Public URLs">
              <p>
                Certain content generated by the Service — including voice
                overviews, podcast audio, and video explanations — is stored on{" "}
                <Strong>Cloudinary</Strong>, a third-party cloud storage
                provider. Each piece of generated content is assigned a unique,
                cryptographically secure URL (a &ldquo;secure_url&rdquo;) that
                cannot be guessed by anyone.
              </p>
              <p className="mt-3">
                However, these URLs are <Strong>publicly accessible</Strong>,
                meaning that anyone who has the URL can view or listen to the
                content without logging in. If you copy and share a content
                URL, the recipient will be able to access it.
              </p>
              <p className="mt-3">
                We are not responsible for content that is shared by you
                through these URLs. If you wish to remove generated content,
                you can delete it from within the Service, and the
                corresponding Cloudinary URL will also be removed.
              </p>
            </Section>

            <Section title="6. Data Retention">
              <p>
                We retain your personal information and uploaded content for as
                long as your account is active or as needed to provide you with
                the Service. If you delete your account, we will delete or
                anonymize your data within 30 days, unless retention is
                required by law.
              </p>
              <p className="mt-3">
                AI-generated outputs (summaries, flashcards, audio, video,
                etc.) are stored alongside your account and are deleted when
                the associated document or account is deleted.
              </p>
            </Section>

            <Section title="7. Data Security">
              <p>
                We implement industry-standard security measures to protect
                your information, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>HTTPS encryption for all data in transit.</li>
                <li>Encrypted storage for sensitive data at rest.</li>
                <li>Secure password hashing (bcrypt).</li>
                <li>JWT-based authentication with no cookie storage.</li>
                <li>Rate limiting and HTTP parameter pollution prevention.</li>
              </ul>
              <p className="mt-3">
                While we take reasonable precautions, no method of electronic
                storage or transmission is 100% secure. We cannot guarantee
                absolute security.
              </p>
            </Section>

            <Section title="8. Your Rights">
              <p>
                Depending on your jurisdiction, you may have the following
                rights regarding your personal data:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  <Strong>Access</Strong> — request a copy of the personal data
                  we hold about you.
                </li>
                <li>
                  <Strong>Correction</Strong> — request corrections to
                  inaccurate or incomplete data.
                </li>
                <li>
                  <Strong>Deletion</Strong> — request that we delete your
                  personal data and uploaded content.
                </li>
                <li>
                  <Strong>Data portability</Strong> — request your data in a
                  structured, machine-readable format.
                </li>
                <li>
                  <Strong>Objection</Strong> — object to certain types of
                  processing.
                </li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, contact us at{" "}
                <a
                  href="mailto:cognivioai.app@gmail.com" target="_blank" rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  cognivioai.app@gmail.com
                </a>
                . We will respond within 30 days.
              </p>
            </Section>

            <Section title="9. Cookies">
              <p>
                Cognivio AI does <Strong>not</Strong> use cookies. We use
                token-based authentication (JWT) stored in your browser&apos;s
                local storage to maintain your session. No tracking cookies or
                third-party advertising cookies are placed on your device.
              </p>
            </Section>

            <Section title="10. Changes to This Policy">
              <p>
                We may update this Privacy Policy periodically. When we make
                material changes, we will notify you by updating the
                &ldquo;Last updated&rdquo; date at the top of this page and,
                where appropriate, by providing additional notice (such as an
                email or in-app notification).
              </p>
            </Section>

            <Section title="11. Contact Us">
              <p>
                If you have questions about this Privacy Policy or how we
                handle your data, please contact us:
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

function ThirdParty({
  name,
  purpose,
  url,
}: {
  name: string;
  purpose: string;
  url: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-card/60 border border-border/50">
      <p className="text-foreground font-medium">{name}</p>
      <p className="text-sm mt-1">{purpose}</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline text-sm mt-1 inline-block"
      >
        View their privacy policy →
      </a>
    </div>
  );
}
