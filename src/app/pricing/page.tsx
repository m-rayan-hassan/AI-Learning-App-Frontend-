"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Sparkles,
  Zap,
  ShieldCheck,
  Star,
  XCircle,
  X,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import paymentServices from "@/services/paymentServices";
import authServices from "@/services/authServices";
import { PLAN_MAPPING } from "@/lib/ls";

// ─── Types ──────────────────────────────────────────────────────────

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  profileImage: string;
  planType: "free" | "plus" | "pro" | "premium";
  subscriptionStatus?: string;
  renewsAt?: string;
  customerPortalUrl?: string;
}

// ─── Constants ──────────────────────────────────────────────────────

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const PLAN_FEATURES: Record<string, string[]> = {
  free: [
    "5 Documents",
    "15 Flashcard Sets",
    "15 Quizzes",
    "1 Video Overview",
    "AI Chat",
    "Voice Chat",
    "Document Summaries",
  ],
  plus: [
    "10 Documents",
    "30 Flashcard Sets",
    "30 Quizzes",
    "3 Video Overviews",
    "2 Voice/Podcast Overviews",
    "AI Chat",
    "Voice Chat",
    "Document Summaries",
  ],
  pro: [
    "15 Documents",
    "45 Flashcard Sets",
    "45 Quizzes",
    "5 Video Overviews",
    "5 Voice/Podcast Overviews",
    "AI Chat",
    "Voice Chat",
    "Document Summaries",
  ],
  premium: [
    "20 Documents",
    "60 Flashcard Sets",
    "60 Quizzes",
    "10 Video Overviews",
    "10 Voice/Podcast Overviews",
    "AI Chat",
    "Voice Chat",
    "Document Summaries",
  ],
};

// ─── Pricing Card ───────────────────────────────────────────────────

function PricingCard({
  plan,
  price,
  description,
  features,
  isCurrent,
  isProcessing,
  isDowngrade,
  isCanceled,
  expirationDate,
  handleCheckout,
  onCancel,
  showCancel = false,
  highlight = false,
}: {
  plan: string;
  price: string;
  description: string;
  features: string[];
  isCurrent: boolean;
  isProcessing: boolean;
  isDowngrade: boolean;
  isCanceled?: boolean;
  expirationDate?: string;
  handleCheckout: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
  highlight?: boolean;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 ${
        highlight
          ? "bg-blue-600/10 border-blue-500 shadow-[0_0_40px_-15px_rgba(59,130,246,0.3)] ring-1 ring-blue-500/50"
          : "bg-card/40 border-border/50 hover:border-primary/30"
      }`}
    >
      {highlight && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
          Most Popular
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-xl font-bold text-foreground capitalize flex items-center gap-2">
          {plan === "free" ? (
            <ShieldCheck className="w-5 h-5 text-slate-400" />
          ) : plan === "plus" ? (
            <Star className="w-5 h-5 text-blue-400" />
          ) : plan === "pro" ? (
            <Zap className="w-5 h-5 text-cyan-400" />
          ) : (
            <Sparkles className="w-5 h-5 text-purple-400" />
          )}
          {plan}
        </h3>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mb-8">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold tracking-tight text-foreground">
            ${price}
          </span>
          <span className="text-sm text-muted-foreground">/mo</span>
        </div>
      </div>

      <div className="flex-1 mb-8">
        <ul className="space-y-4">
          {features.map((f, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm text-muted-foreground"
            >
              <Check
                className={`w-4 h-4 mt-0.5 shrink-0 ${highlight ? "text-blue-500" : "text-primary/60"}`}
              />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <Button
          onClick={handleCheckout}
          disabled={isCurrent || isProcessing || isDowngrade || plan === "free"}
          className={`w-full h-12 rounded-xl font-semibold transition-all duration-300 ${
            isCurrent || isDowngrade
              ? "bg-muted text-muted-foreground border border-border cursor-not-allowed hover:bg-muted opacity-80"
              : highlight
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
                : "bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
          }`}
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </span>
          ) : isCurrent ? (
            "Current Plan"
          ) : plan === "free" ? (
            "Free Forever"
          ) : isDowngrade ? (
            "Downgrade Unavailable"
          ) : (
            `Upgrade to ${plan}`
          )}
        </Button>

        {isCurrent && plan !== "free" && expirationDate && (
          <div className="w-full text-center py-2 text-sm text-muted-foreground bg-secondary/50 rounded-lg mt-2 font-medium">
            {isCanceled ? "Expires on" : "Renews on"}{" "}
            {new Date(expirationDate).toLocaleDateString()}
          </div>
        )}

        {showCancel &&
          isCurrent &&
          plan !== "free" &&
          onCancel &&
          !isCanceled && (
            <Button
              onClick={onCancel}
              variant="ghost"
              className="w-full h-10 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Cancel Subscription
            </Button>
          )}
      </div>
    </motion.div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────

export default function PricingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // ── Init ──
  useEffect(() => {
    (async () => {
      try {
        // Load profile only if authenticated
        if (isAuthenticated) {
          try {
            const profileData = await authServices.getProfile();
            setUser(profileData);
          } catch (err: any) {
            console.error("Profile load error:", err);
            // Not authorized — continue as public visitor
          }
        }
      } catch (err: any) {
        console.error("Init error:", err);
      } finally {
        setLoadingUser(false);
      }
    })();
  }, [router, isAuthenticated]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || successMsg) {
      const t = setTimeout(() => {
        setError(null);
        setSuccessMsg(null);
      }, 5000);
      return () => clearTimeout(t);
    }
  }, [error, successMsg]);

  // ── Cancel ──
  const handleCancel = async () => {
    if (!user) return;
    if (
      !window.confirm(
        "Are you sure? You'll keep access until the end of your billing period.",
      )
    )
      return;

    setError(null);
    setSuccessMsg(null);

    window.location.href = user.customerPortalUrl!;
  };

  type PlanType = "plus" | "pro" | "premium";

  const handleCheckout = async (targetPlan: PlanType) => {
    try {
      const variantId = PLAN_MAPPING[targetPlan];

      const response = await paymentServices.checkout(variantId);
      window.location.href = response.checkoutUrl;
    } catch (error: any) {
      console.error("Cancel error:", error);
      setError(error?.message || "Failed to checkout");
    }
  };

  // ── Loading ──
  if (loadingUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <motion.div
          animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center border border-primary/20 overflow-hidden shadow-xl shadow-primary/5">
            <Image
              src="/app_logo.png"
              alt="Logo"
              width={35}
              height={35}
              className="object-contain"
            />
          </div>
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Loading...
          </p>
        </motion.div>
      </div>
    );
  }
  // If not logged in, still show the page (public pricing)

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      <main className="flex-1 relative pb-24">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] h-[600px] bg-blue-500/5 blur-[120px] rounded-full mix-blend-screen opacity-50" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.2)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>

        <div className="container px-4 mx-auto pt-24 md:pt-36">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3 h-3" />
              <span>Investment in Knowledge</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
              Upgrade your <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                learning speed.
              </span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {user ? (
                <>
                  Hello, {user.username}. You are on the{" "}
                  <span className="font-bold text-foreground uppercase">
                    {user.planType}
                  </span>{" "}
                  plan.
                </>
              ) : (
                <>Choose the plan that fits your learning goals.</>
              )}
            </p>

            {/* Messages */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" /> {error}
                </motion.div>
              )}
              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" /> {successMsg}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
          >
            {(() => {
              const planRanks: Record<string, number> = {
                free: 0,
                plus: 1,
                pro: 2,
                premium: 3,
              };
              const currentRank = planRanks[user?.planType ?? ""] ?? -1;
              const isCanceled =
                user?.subscriptionStatus === "canceled" ||
                user?.subscriptionStatus === "cancelled";

              const expirationDate = user?.renewsAt;

              return (
                <>
                  <PricingCard
                    plan="free"
                    price="0"
                    description="Ideal for students starting their AI-enhanced learning journey."
                    features={PLAN_FEATURES.free}
                    isCurrent={user?.planType === "free"}
                    isProcessing={false}
                    isDowngrade={planRanks["free"] < currentRank}
                    handleCheckout={() =>
                      !user ? router.push("/login") : undefined
                    }
                  />

                  <PricingCard
                    plan="plus"
                    price="5"
                    description="Unlock more documents and essential AI study tools."
                    features={PLAN_FEATURES.plus}
                    isCurrent={user?.planType === "plus"}
                    isProcessing={processingPlan === "plus"}
                    isDowngrade={planRanks["plus"] < currentRank}
                    isCanceled={isCanceled}
                    expirationDate={expirationDate}
                    handleCheckout={() =>
                      user ? handleCheckout("plus") : router.push("/login")
                    }
                    onCancel={handleCancel}
                    showCancel={true}
                  />

                  <PricingCard
                    plan="pro"
                    price="10"
                    description="The complete experience with Voice Chat and Video Analysis."
                    features={PLAN_FEATURES.pro}
                    isCurrent={user?.planType === "pro"}
                    isProcessing={processingPlan === "pro"}
                    isDowngrade={planRanks["pro"] < currentRank}
                    isCanceled={isCanceled}
                    expirationDate={expirationDate}
                    handleCheckout={() =>
                      user ? handleCheckout("pro") : router.push("/login")
                    }
                    onCancel={handleCancel}
                    showCancel={true}
                    highlight={true}
                  />

                  <PricingCard
                    plan="premium"
                    price="20"
                    description="Power-user features for research and deep technical mastery."
                    features={PLAN_FEATURES.premium}
                    isCurrent={user?.planType === "premium"}
                    isProcessing={processingPlan === "premium"}
                    isDowngrade={planRanks["premium"] < currentRank}
                    isCanceled={isCanceled}
                    expirationDate={expirationDate}
                    handleCheckout={() =>
                      user ? handleCheckout("premium") : router.push("/login")
                    }
                    onCancel={handleCancel}
                    showCancel={true}
                  />
                </>
              );
            })()}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-32 text-center max-w-2xl mx-auto"
          >
            <div className="flex justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <ShieldCheck className="w-5 h-5" /> Secure Checkout
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Star className="w-5 h-5 fill-current" /> 4.9/5 Rating
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
