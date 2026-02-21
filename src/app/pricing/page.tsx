"use client";

import React, { useEffect, useState } from 'react';
import { initializePaddle, Paddle } from '@paddle/paddle-js';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, Sparkles, Zap, ShieldCheck, Star,
  BrainCircuit, XCircle, ArrowUp, X, AlertTriangle
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import paymentServices from '@/services/paymentServices';
import authServices from '@/services/authServices';

// ─── Types ──────────────────────────────────────────────────────────

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  profileImage: string;
  planType: 'free' | 'plus' | 'pro' | 'premium';
  subscriptionStatus?: string;
  subscriptionEndDate?: string;
}

interface UpgradePreviewData {
  targetPlan: string;
  currentPlan: string;
  currencyCode: string;
  updateSummary: {
    credit: string;
    charge: string;
  } | null;
  immediateTransaction: {
    subtotal: string;
    tax: string;
    total: string;
    credit: string;
    grandTotal: string;
    currencyCode: string;
  } | null;
}

// ─── Constants ──────────────────────────────────────────────────────

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const PLAN_FEATURES: Record<string, string[]> = {
  free: ["Up to 3 documents", "Basic AI Chat", "Basic Summaries", "Standard Support"],
  plus: ["Up to 20 documents", "Advanced AI Reasoning", "Unlimited Flashcards", "Podcast Generation", "Priority Support"],
  pro: ["Unlimited documents", "Viva Mode (Voice Chat)", "Video Analysis", "Instant Quiz Generation", "Premium AI Models", "24/7 Dedicated Support"],
  premium: ["Everything in Pro", "Custom AI Training", "Team Collaboration Tools", "API Access", "Personal Learning Coach", "Beta Feature Access"]
};

// Format Paddle amount (in smallest currency unit, e.g. cents) to display string
const formatAmount = (amount?: string, currencyCode?: string) => {
  if (!amount) return '$0.00';
  const num = parseInt(amount, 10);
  if (isNaN(num)) return amount;
  const symbol = currencyCode === 'EUR' ? '€' : currencyCode === 'GBP' ? '£' : '$';
  return `${symbol}${(num / 100).toFixed(2)}`;
};

// ─── Upgrade Confirmation Modal ─────────────────────────────────────

function UpgradeModal({ 
  preview, onConfirm, onClose, isConfirming 
}: { 
  preview: UpgradePreviewData;
  onConfirm: () => void;
  onClose: () => void;
  isConfirming: boolean;
}) {
  const currency = preview.currencyCode || 'USD';
  const summary = preview.updateSummary;
  const txn = preview.immediateTransaction;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={() => !isConfirming && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={() => !isConfirming && onClose()} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
          <ArrowUp className="w-6 h-6 text-blue-400" />
        </div>

        <h2 className="text-xl font-bold mb-2">
          Upgrade to <span className="capitalize text-blue-400">{preview.targetPlan}</span>
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Switching from <span className="font-semibold capitalize">{preview.currentPlan}</span> to{' '}
          <span className="font-semibold capitalize">{preview.targetPlan}</span>.
          The difference will be charged immediately.
        </p>

        {/* Charge Breakdown */}
        <div className="bg-background/50 border border-border/50 rounded-2xl p-5 mb-6 space-y-3 text-sm">
          {summary && summary.credit !== '0' && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Credit from current plan</span>
              <span className="text-green-400 font-medium">-{formatAmount(summary.credit, currency)}</span>
            </div>
          )}
          {summary && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">New plan charge</span>
              <span className="text-foreground font-medium">{formatAmount(summary.charge, currency)}</span>
            </div>
          )}
          {txn && (
            <>
              <div className="border-t border-border/30 pt-3 flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="text-foreground">{formatAmount(txn.tax, txn.currencyCode)}</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-foreground font-semibold">Total due today</span>
                <span className="text-foreground font-bold">{formatAmount(txn.grandTotal, txn.currencyCode)}</span>
              </div>
            </>
          )}
          {!summary && !txn && (
            <p className="text-muted-foreground text-center py-2">Prorated charge applied automatically</p>
          )}
        </div>

        <div className="flex gap-3">
          <Button onClick={onClose} variant="ghost" disabled={isConfirming}
            className="flex-1 h-11 rounded-xl border border-border/50">
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isConfirming}
            className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold">
            {isConfirming ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Upgrading...
              </span>
            ) : 'Confirm Upgrade'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Pricing Card ───────────────────────────────────────────────────

function PricingCard({ 
  plan, price, description, features, 
  isCurrent, isProcessing, isDowngrade, isCanceled, expirationDate,
  onUpgrade, onCancel, showCancel = false, highlight = false 
}: { 
  plan: string; price: string; description: string; features: string[]; 
  isCurrent: boolean; isProcessing: boolean; isDowngrade: boolean;
  isCanceled?: boolean; expirationDate?: string;
  onUpgrade: () => void; onCancel?: () => void; showCancel?: boolean; highlight?: boolean;
}) {
  return (
    <motion.div 
      variants={fadeInUp}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 ${
        highlight 
          ? 'bg-blue-600/10 border-blue-500 shadow-[0_0_40px_-15px_rgba(59,130,246,0.3)] ring-1 ring-blue-500/50' 
          : 'bg-card/40 border-border/50 hover:border-primary/30'
      }`}
    >
      {highlight && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
          Most Popular
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-xl font-bold text-foreground capitalize flex items-center gap-2">
          {plan === 'free' ? <ShieldCheck className="w-5 h-5 text-slate-400" /> : 
           plan === 'plus' ? <Star className="w-5 h-5 text-blue-400" /> : 
           plan === 'pro' ? <Zap className="w-5 h-5 text-cyan-400" /> : 
           <Sparkles className="w-5 h-5 text-purple-400" />}
          {plan}
        </h3>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{description}</p>
      </div>

      <div className="mb-8">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold tracking-tight text-foreground">${price}</span>
          <span className="text-sm text-muted-foreground">/mo</span>
        </div>
      </div>

      <div className="flex-1 mb-8">
        <ul className="space-y-4">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
              <Check className={`w-4 h-4 mt-0.5 shrink-0 ${highlight ? 'text-blue-500' : 'text-primary/60'}`} />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <Button onClick={onUpgrade} disabled={isCurrent || isProcessing || isDowngrade || plan === 'free'}
          className={`w-full h-12 rounded-xl font-semibold transition-all duration-300 ${
            isCurrent || isDowngrade ? 'bg-muted text-muted-foreground border border-border cursor-not-allowed hover:bg-muted opacity-80' 
            : highlight ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20'
            : 'bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20'
          }`}
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </span>
          ) : isCurrent ? "Current Plan" 
            : plan === 'free' ? "Free Forever" 
            : isDowngrade ? "Downgrade Unavailable"
            : `Upgrade to ${plan}`}
        </Button>

        {showCancel && isCurrent && plan !== 'free' && onCancel && (
          isCanceled ? (
             <div className="w-full text-center py-2 text-sm text-muted-foreground bg-secondary/50 rounded-lg mt-2 font-medium">
               Expires on {expirationDate ? new Date(expirationDate).toLocaleDateString() : 'soon'}
             </div>
          ) : (
            <Button onClick={onCancel} variant="ghost"
              className="w-full h-10 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10">
              <XCircle className="w-4 h-4 mr-2" />
              Cancel Subscription
            </Button>
          )
        )}
      </div>
    </motion.div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────

export default function PricingPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Upgrade modal state
  const [upgradePreview, setUpgradePreview] = useState<UpgradePreviewData | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  // ── Init ──
  useEffect(() => {
    (async () => {
      try {
        const authToken = token || localStorage.getItem("Token");
        if (!authToken) { router.push('/login'); return; }

        const profileData = await authServices.getProfile();
        setUser(profileData);

        const env = (process.env.NEXT_PUBLIC_PADDLE_ENV as 'sandbox' | 'production') || 'sandbox';
        const paddleToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
        if (paddleToken) {
          const inst = await initializePaddle({
            environment: env,
            token: paddleToken,
            eventCallback: (event) => {
              if (event.name === 'checkout.completed') {
                setTimeout(() => router.push('/success'), 1500);
              }
              if (event.name === 'checkout.closed') {
                setProcessingPlan(null);
              }
            }
          });
          if (inst) setPaddle(inst);
        }
      } catch (err: any) {
        console.error("Init error:", err);
        if (err?.message?.includes("Not authorized")) router.push('/login');
      } finally {
        setLoadingUser(false);
      }
    })();
  }, [router, token]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || successMsg) {
      const t = setTimeout(() => { setError(null); setSuccessMsg(null); }, 5000);
      return () => clearTimeout(t);
    }
  }, [error, successMsg]);

  // ── Subscribe / Upgrade click ──
  const handleSubscription = async (targetPlan: string) => {
    if (!user) return;
    setProcessingPlan(targetPlan);
    setError(null);
    setSuccessMsg(null);

    try {
      const data = await paymentServices.subscribe(targetPlan);

      if (data.action === 'checkout' && data.priceId && paddle) {
        // Free user → open Paddle Checkout overlay
        paddle.Checkout.open({
          items: [{ priceId: data.priceId, quantity: 1 }],
          customer: { email: user.email },
          customData: { userId: user._id },
          settings: { displayMode: "overlay", successUrl: `${window.location.origin}/success` },
        });
      } else if (data.action === 'preview_upgrade') {
        // Paid user → fetch preview and show modal
        try {
          const preview = await paymentServices.previewUpgrade(targetPlan);
          setUpgradePreview(preview);
        } catch (previewErr: any) {
          setError(previewErr?.message || "Could not load upgrade preview");
        }
        setProcessingPlan(null);
      } else {
        setProcessingPlan(null);
      }
    } catch (err: any) {
      console.error("Subscribe error:", err);
      setError(err?.message || "Something went wrong");
      setProcessingPlan(null);
    }
  };

  // ── Confirm upgrade ──
  const handleConfirmUpgrade = async () => {
    if (!upgradePreview) return;
    setIsConfirming(true);
    setError(null);

    try {
      const result = await paymentServices.confirmUpgrade(upgradePreview.targetPlan);
      setUser(prev => prev ? { ...prev, planType: upgradePreview.targetPlan as UserProfile['planType'] } : prev);
      setUpgradePreview(null);
      setSuccessMsg(result.message || `Successfully upgraded to ${upgradePreview.targetPlan}!`);
    } catch (err: any) {
      console.error("Confirm error:", err);
      setError(err?.message || "Upgrade failed");
    } finally {
      setIsConfirming(false);
    }
  };

  // ── Cancel ──
  const handleCancel = async () => {
    if (!user) return;
    if (!window.confirm("Are you sure? You'll keep access until the end of your billing period.")) return;

    setError(null);
    setSuccessMsg(null);

    try {
      const result = await paymentServices.cancelSubscription();
      setSuccessMsg(result.message || "Subscription canceled");
      setUser(prev => prev ? { ...prev, subscriptionStatus: 'canceled' } : prev);
    } catch (err: any) {
      console.error("Cancel error:", err);
      setError(err?.message || "Failed to cancel");
    }
  };

  // ── Loading ──
  if (loadingUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <motion.div animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading...</p>
        </motion.div>
      </div>
    );
  }
  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      {/* Upgrade Modal */}
      <AnimatePresence>
        {upgradePreview && (
          <UpgradeModal
            preview={upgradePreview}
            onConfirm={handleConfirmUpgrade}
            onClose={() => !isConfirming && setUpgradePreview(null)}
            isConfirming={isConfirming}
          />
        )}
      </AnimatePresence>
      
      <main className="flex-1 relative pb-24">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] h-[600px] bg-blue-500/5 blur-[120px] rounded-full mix-blend-screen opacity-50" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.2)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>

        <div className="container px-4 mx-auto pt-24 md:pt-36">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3 h-3" /><span>Investment in Knowledge</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
              Upgrade your <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">learning speed.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Hello, {user.username}. You are on the{' '}
              <span className="font-bold text-foreground uppercase">{user.planType}</span> plan.
            </p>

            {/* Messages */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> {error}
                </motion.div>
              )}
              {successMsg && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" /> {successMsg}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            
            {(() => {
              const planRanks: Record<string, number> = { free: 0, plus: 1, pro: 2, premium: 3 };
              const currentRank = planRanks[user.planType] || 0;
              const isCanceled = user.subscriptionStatus === 'canceled';
              const expirationDate = (user as any).subscriptionEndDate; // Will be added to UserProfile interface

              return (
                <>
                  <PricingCard plan="free" price="0"
                    description="Ideal for students starting their AI-enhanced learning journey."
                    features={PLAN_FEATURES.free}
                    isCurrent={user.planType === 'free'} isProcessing={false} 
                    isDowngrade={planRanks['free'] < currentRank}
                    onUpgrade={() => {}} />

                  <PricingCard plan="plus" price="10"
                    description="Unlock more documents and essential AI study tools."
                    features={PLAN_FEATURES.plus}
                    isCurrent={user.planType === 'plus'} isProcessing={processingPlan === 'plus'}
                    isDowngrade={planRanks['plus'] < currentRank}
                    isCanceled={isCanceled} expirationDate={expirationDate}
                    onUpgrade={() => handleSubscription('plus')}
                    onCancel={handleCancel} showCancel={true} />

                  <PricingCard plan="pro" price="20"
                    description="The complete experience with Voice Chat and Video Analysis."
                    features={PLAN_FEATURES.pro}
                    isCurrent={user.planType === 'pro'} isProcessing={processingPlan === 'pro'}
                    isDowngrade={planRanks['pro'] < currentRank}
                    isCanceled={isCanceled} expirationDate={expirationDate}
                    onUpgrade={() => handleSubscription('pro')}
                    onCancel={handleCancel} showCancel={true} highlight={true} />

                  <PricingCard plan="premium" price="50"
                    description="Power-user features for research and deep technical mastery."
                    features={PLAN_FEATURES.premium}
                    isCurrent={user.planType === 'premium'} isProcessing={processingPlan === 'premium'}
                    isDowngrade={planRanks['premium'] < currentRank}
                    isCanceled={isCanceled} expirationDate={expirationDate}
                    onUpgrade={() => handleSubscription('premium')}
                    onCancel={handleCancel} showCancel={true} />
                </>
              );
            })()}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mt-32 text-center max-w-2xl mx-auto">
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