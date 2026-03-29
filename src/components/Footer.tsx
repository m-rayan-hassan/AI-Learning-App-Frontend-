import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-5 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-primary/5 p-1 rounded-lg border border-primary/10 overflow-hidden">
                <Image
                  src="/app_logo.png"
                  alt="Logo"
                  width={35}
                  height={35}
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-xl tracking-tight">
                Cognivio<span className="text-primary">AI</span>
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              Elevate your learning journey with an all-in-one AI workspace.
              Instantly transform complex documents, videos, and lectures into
              interactive flashcards, personalized quizzes, and engaging study
              guides to master any subject in record time.
            </p>
          </div>

          {/* Links 1 */}
          <div className="col-span-1 md:col-span-2 md:col-start-7 space-y-4">
            <h4 className="font-semibold text-foreground tracking-tight">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/#features"
                  className="hover:text-primary transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-primary transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Links 2 */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <h4 className="font-semibold text-foreground tracking-tight">
              Support
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Links 3 */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <h4 className="font-semibold text-foreground tracking-tight">
              Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-primary transition-colors"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-primary transition-colors"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="/refund"
                  className="hover:text-primary transition-colors"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Cognivio AI. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-muted-foreground font-medium">
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
