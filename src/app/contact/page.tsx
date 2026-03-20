import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Cognivio AI for support, billing, and general inquiries.",
};

export default function ContactPage() {
  const email = "cognivioai.app@gmail.com";

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      <main className="flex-1">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto max-w-3xl pt-24 md:pt-32 pb-24">
          
          <div className="mb-6 flex items-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground hover:underline mr-2">Home</Link>
            <span className="mr-2">/</span>
            <span className="text-foreground">Contact</span>
          </div>

          <div className="border border-border/60 rounded-lg bg-card/50 p-8 shadow-sm">
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Contact Us
            </h1>
            
            <p className="text-base text-muted-foreground mb-8">
              If you have any questions, require technical support, or need assistance with your billing, our team is available to help. We aim to respond to all inquiries within 1 to 2 business days.
            </p>

            <div className="mb-8">
              <h2 className="text-base font-semibold text-foreground mb-2">Direct Support Email</h2>
              <div className="p-4 bg-muted/30 border border-border/50 rounded-md">
                <a 
                  href={`mailto:${email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-primary font-medium hover:underline"
                >
                  {email}
                </a>
              </div>
            </div>

            <div className="border-t border-border/60 pt-8">
              <h2 className="text-base font-semibold text-foreground mb-4">Inquiry Guidelines</h2>
              <p className="text-sm text-muted-foreground mb-4">
                To help us assist you efficiently, please include the relevant information based on your request:
              </p>
              
              <ul className="list-disc list-outside ml-5 space-y-3 text-sm text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">General Questions:</span> Describe the platform feature or subscription plan you are inquiring about.
                </li>
                <li>
                  <span className="font-medium text-foreground">Technical Support & Bug Reports:</span> Provide the name of the browser you are using, your operating system, and a brief description of how to reproduce the error.
                </li>
                <li>
                  <span className="font-medium text-foreground">Billing & Refunds:</span> Please ensure you are contacting us from the email address registered to your Cognivio AI account to expedite verification.
                </li>
              </ul>
            </div>
            
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
