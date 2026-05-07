"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import {
  MessageSquare,
  FileText,
  Mic,
  ArrowRight,
  PlayCircle,
  Layers,
  LayoutDashboard,
  User,
  Bot,
  BookOpen,
  LogOut,
  Podcast,
  Play,
  Volume2,
  Lightbulb,
  Upload,
  Brain,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Video,
  Eye,
  Sparkles,
  MessageCircle,
  Plus,
  Minus,
  ArrowUpRight,
  Moon,
  Zap,
  Headphones,
  Star,
  Shield,
  CheckCircle2,
  Users,
  GraduationCap,
  Quote,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

// --- Animation Variants ---
const smoothEase: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: smoothEase },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

// Blur + scale for feature cards
const blurScaleIn = {
  hidden: { opacity: 0, scale: 0.92, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: smoothEase },
  },
};

// Slide from left
const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: smoothEase },
  },
};

// Slide from right
const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: smoothEase },
  },
};

// Scale up with spring
const scaleUp = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, damping: 20, stiffness: 100 },
  },
};

// Feature grid stagger
const featureStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

// Testimonial stagger
const testimonialStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

// --- Animated Counter Hook ---
function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * end));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end, duration]);

  return { count, ref };
}

function StatItem({
  value,
  suffix,
  label,
  icon,
}: {
  value: number;
  suffix: string;
  label: string;
  icon: React.ReactNode;
}) {
  const { count, ref } = useCountUp(value);
  return (
    <div className="flex flex-col items-center text-center px-4 py-3 group">
      <div className="mb-2 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span
        ref={ref}
        className="text-2xl md:text-3xl font-bold text-foreground tracking-tight"
      >
        {count.toLocaleString()}
        {suffix}
      </span>
      <span className="text-xs text-muted-foreground mt-1 font-medium">
        {label}
      </span>
    </div>
  );
}

// ==========================================
//    INTERACTIVE DASHBOARD COMPONENTS
//    All colors use theme-aware CSS variables
// ==========================================

const DashboardSidebar = () => (
  <div className="w-56 border-r border-border/70 hidden md:flex flex-col bg-muted/20 p-4 gap-2 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
    <div className="flex items-center gap-3.5 mb-6 px-2 mt-1">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 dark:bg-gradient-to-b dark:from-primary/10 dark:to-primary/5 dark:border dark:border-primary/20 dark:shadow-[0_2px_8px_rgba(0,0,0,0.2),0_1px_0_rgba(255,255,255,0.05)_inset] shrink-0">
        <Image
          src="/app_logo.png"
          alt="Logo"
          width={32}
          height={32}
          className="object-contain z-10"
        />
      </div>
      <span className="font-bold text-[22px] tracking-tight text-foreground drop-shadow-sm whitespace-nowrap">
        Cognivio<span className="text-primary">AI</span>
      </span>
    </div>

    <div className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-muted-foreground/60 mb-1 mt-2 px-3 whitespace-nowrap">
      Main Menu
    </div>

    <div className="space-y-2">
      <SidebarItem
        icon={<LayoutDashboard size={18} strokeWidth={2.2} />}
        label="Dashboard"
      />
      <SidebarItem
        active
        icon={<FileText size={18} strokeWidth={2.2} />}
        label="Documents"
      />
      <SidebarItem
        icon={<Layers size={18} strokeWidth={2.2} />}
        label="Flashcards"
      />
      <SidebarItem
        icon={<User size={18} strokeWidth={2.2} />}
        label="Profile"
      />
    </div>

    <div className="mt-auto space-y-2 pt-5 border-t border-border/60">
      <SidebarItem
        icon={<Moon size={18} strokeWidth={2.2} />}
        label="Dark Mode"
      />
      <SidebarItem
        icon={<LogOut size={18} strokeWidth={2.2} />}
        label="Logout"
      />
    </div>
  </div>
);

const SidebarItem = ({
  active,
  label,
  icon,
}: {
  active?: boolean;
  label: string;
  icon: React.ReactNode;
}) => (
  <div
    className={`flex items-center gap-3.5 px-3.5 h-11 rounded-xl transition-all duration-200 group relative font-medium ${
      active
        ? "bg-primary/10 text-primary dark:bg-gradient-to-b dark:from-card dark:to-card/95 dark:border dark:border-border/80 dark:shadow-[0_2px_10px_rgba(0,0,0,0.2),0_1px_0_rgba(255,255,255,0.06)_inset]"
        : "text-muted-foreground hover:bg-black/5 dark:hover:bg-card/60 hover:text-foreground border border-transparent"
    }`}
  >
    {active && (
      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-primary rounded-r-full shadow-[0_0_8px_hsl(var(--primary)/0.6)]" />
    )}
    <div
      className={
        active
          ? "text-primary scale-100"
          : "text-muted-foreground group-hover:scale-110 transition-transform duration-200"
      }
    >
      {icon}
    </div>
    <span className="text-[14px] leading-none mt-0.5">{label}</span>
  </div>
);

// --- Tab Content Views (all theme-aware) ---

const PreviewView = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="h-full bg-card/30 p-8 flex justify-center overflow-y-auto"
  >
    <div className="bg-card w-full max-w-3xl min-h-[600px] shadow-xl rounded-lg p-12 border border-border">
      <h1 className="text-2xl font-bold mb-6 text-foreground">
        Introduction to Software Engineering
      </h1>
      <div className="space-y-4">
        <div className="h-3.5 bg-muted w-full rounded" />
        <div className="h-3.5 bg-muted w-full rounded" />
        <div className="h-3.5 bg-muted w-5/6 rounded" />
        <div className="h-48 bg-muted/50 w-full rounded-lg border border-border my-8 flex items-center justify-center text-muted-foreground text-sm">
          Figure 1.2 — System Architecture
        </div>
        <div className="h-3.5 bg-muted w-full rounded" />
        <div className="h-3.5 bg-muted w-4/5 rounded" />
      </div>
    </div>
  </motion.div>
);

const NotesView = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="h-full bg-card/30 p-8 flex justify-center overflow-y-auto"
  >
    <div className="bg-card w-full max-w-3xl min-h-[600px] shadow-xl rounded-lg p-12 border border-border">
      <h1 className="text-2xl font-bold mb-6 text-foreground">
        Study Notes: Software Engineering
      </h1>
      <div className="space-y-6">
        <div>
          <div className="h-4 bg-muted w-1/3 rounded mb-3" />
          <div className="space-y-2">
            <div className="h-3 bg-muted/60 w-full rounded" />
            <div className="h-3 bg-muted/60 w-11/12 rounded" />
            <div className="h-3 bg-muted/60 w-4/5 rounded" />
          </div>
        </div>
        <div>
          <div className="h-4 bg-muted w-1/4 rounded mb-3" />
          <div className="space-y-2">
            <div className="h-3 bg-muted/60 w-full rounded" />
            <div className="h-3 bg-muted/60 w-full rounded" />
            <div className="h-3 bg-muted/60 w-5/6 rounded" />
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const SummaryView = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex h-full"
  >
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-foreground font-semibold flex items-center gap-2 text-sm">
          <Sparkles size={16} className="text-primary" /> Document Summary
        </h3>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 text-xs text-primary bg-primary/10 hover:bg-primary/20"
        >
          Regenerate
        </Button>
      </div>
      <div className="space-y-5 text-sm">
        <div className="p-5 rounded-xl bg-muted/50 border border-border">
          <h4 className="text-primary font-medium mb-3 text-xs uppercase tracking-wider">
            Executive Summary
          </h4>
          <p className="leading-relaxed text-muted-foreground">
            Risk management is a continuous, iterative process designed to
            proactively identify, analyze, and mitigate uncertainties affecting
            software projects. By cycling through identification and strategic
            planning, managers minimize the impact of technical, human, and
            organizational disruptions.
          </p>
        </div>
        <div>
          <h4 className="text-foreground font-medium mb-3 text-xs uppercase tracking-wider">
            Key Concepts
          </h4>
          <ul className="space-y-2">
            <li className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <span className="text-muted-foreground">
                <strong className="text-foreground block mb-0.5">
                  Iterative Risk Process
                </strong>
                Functions as a feedback loop: Identification, Analysis,
                Planning, and Monitoring.
              </span>
            </li>
            <li className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <span className="text-muted-foreground">
                <strong className="text-foreground block mb-0.5">
                  Project vs Product Risks
                </strong>
                Project risks affect schedule/resources. Product risks affect
                quality or performance.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </motion.div>
);

const ChatView = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="h-full flex flex-col p-4 md:p-6 overflow-hidden max-w-full"
  >
    <div className="flex-1 space-y-5 overflow-y-auto pr-2">
      <div className="flex gap-3 flex-row-reverse">
        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
          <User size={14} className="text-primary" />
        </div>
        <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-tr-none text-sm max-w-[80%]">
          What is the main difference between project risks and business risks?
        </div>
      </div>
      <div className="flex gap-3">
        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot size={14} className="text-primary" />
        </div>
        <div className="bg-card border border-border text-foreground p-4 rounded-2xl rounded-tl-none text-sm max-w-[90%] space-y-2">
          <p className="text-muted-foreground">
            Based on the document, here is the distinction:
          </p>
          <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
            <li>
              <strong>Project Risks:</strong> Affect the project schedule or
              resources (e.g., loss of experienced staff).
            </li>
            <li>
              <strong>Business Risks:</strong> Affect the organization causing
              the software to be developed.
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div className="mt-4 relative">
      <input
        type="text"
        placeholder="Ask a follow-up question..."
        className="w-full bg-muted/50 border border-border rounded-xl py-3 pl-4 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary rounded-lg text-primary-foreground">
        <ArrowRight size={14} />
      </div>
    </div>
  </motion.div>
);

const FlashcardView = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="h-full flex flex-col items-center justify-center p-6"
  >
    <div className="w-full max-w-2xl aspect-[16/9] bg-card border border-border rounded-2xl flex flex-col items-center justify-center p-12 text-center relative cursor-pointer hover:border-primary/30 transition-colors shadow-xl">
      <div className="absolute top-6 left-6 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider">
        QUESTION
      </div>
      <h3 className="text-xl md:text-2xl text-foreground font-semibold leading-tight">
        What are the 4 stages of the Risk Management Process?
      </h3>
      <div className="absolute bottom-6 text-muted-foreground text-xs flex items-center gap-2">
        Click to reveal answer
      </div>
    </div>
    <div className="mt-8 flex items-center gap-6">
      <Button variant="outline" className="gap-2">
        <ChevronLeft size={16} /> Prev
      </Button>
      <span className="text-muted-foreground font-mono text-sm">1 / 12</span>
      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
        Next <ChevronRight size={16} />
      </Button>
    </div>
  </motion.div>
);

const QuizView = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="p-8 max-w-3xl mx-auto h-full flex flex-col justify-center"
  >
    <div className="flex justify-between text-sm text-muted-foreground mb-2">
      <span>Question 1 of 5</span>
      <span className="text-primary">0/5 Answered</span>
    </div>
    <div className="h-1.5 w-full bg-muted rounded-full mb-8 overflow-hidden">
      <div className="h-full w-1/5 bg-primary rounded-full" />
    </div>
    <h3 className="text-lg text-foreground font-medium mb-8 leading-relaxed">
      Your team realizes the database currently in use cannot support the
      required transaction volume. Which action demonstrates the most
      appropriate proactive risk management strategy?
    </h3>
    <div className="space-y-3">
      {[
        "Reduce project scope to lower requirements.",
        "Request an immediate extension.",
        "Investigate acquisition of a higher-performance database.",
        "Allocate more staff to optimize code.",
      ].map((opt, i) => (
        <div
          key={i}
          className={`p-4 rounded-xl border ${i === 2 ? "border-primary/50 bg-primary/5" : "border-border bg-card hover:bg-muted/50"} cursor-pointer transition-colors flex items-center gap-3 group`}
        >
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center ${i === 2 ? "border-primary" : "border-muted-foreground/30 group-hover:border-muted-foreground/60"}`}
          >
            {i === 2 && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
          </div>
          <span
            className={i === 2 ? "text-foreground" : "text-muted-foreground"}
          >
            {opt}
          </span>
        </div>
      ))}
    </div>
    <div className="mt-8 flex justify-end">
      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6">
        Next Question
      </Button>
    </div>
  </motion.div>
);

const VoiceOverviewView = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="h-full w-full flex flex-col gap-4 sm:gap-6 p-6"
  >
    <div className="flex p-1 bg-muted rounded-xl w-full border border-border">
      <button className="flex-1 flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 bg-background text-foreground shadow-sm scale-[1.01]">
        <Mic className="h-4 w-4" />
        <span>Overview</span>
      </button>
      <button className="flex-1 flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 text-muted-foreground hover:text-foreground">
        <Headphones className="h-4 w-4" />
        <span>Podcast</span>
      </button>
    </div>

    <div className="flex-1 flex flex-col border-none shadow-none bg-transparent">
      <div className="px-1 pt-0 pb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Mic className="w-5 h-5 text-primary" />
          Voice Overview
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Generate a quick audio summary of this document.
        </p>
      </div>

      <div className="flex-1 px-1 overflow-y-auto">
        <div className="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Now Playing
            </span>
            <span className="text-xs text-muted-foreground">Audio Summary</span>
          </div>
          <div className="w-full focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg bg-muted/30 p-3 flex items-center gap-4 border border-border">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors">
              <Play size={14} />
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              0:00 / 2:02
            </span>
            <div className="flex-1 h-1.5 bg-muted rounded-full relative">
              <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-primary/40 rounded-full" />
              <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow-sm" />
            </div>
            <Volume2 size={16} className="text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const VoiceChatView = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="p-6 h-full flex flex-col"
  >
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-foreground text-base font-semibold flex items-center gap-2">
          <Mic className="w-4 h-4 text-primary" /> Voice Assistant
        </h2>
        <p className="text-xs text-primary font-mono mt-1">
          Interactive Learning
        </p>
      </div>
      <div className="bg-card rounded-lg p-1 flex gap-1 border border-border">
        <div className="px-3 py-1.5 rounded-md text-xs text-muted-foreground cursor-pointer hover:text-foreground">
          Discuss
        </div>
        <div className="px-3 py-1.5 rounded-md bg-muted text-xs text-foreground border border-border flex items-center gap-1.5">
          <BookOpen className="w-3 h-3" /> Viva Mode
        </div>
      </div>
    </div>
    <div className="flex-1 grid grid-cols-2 gap-4 mb-4">
      <div className="bg-muted/30 border border-border rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
        <div className="w-20 h-20 rounded-full border-2 border-primary/30 flex items-center justify-center relative">
          <div className="absolute inset-0 bg-primary/5 blur-xl rounded-full" />
          <Bot className="w-8 h-8 text-primary" />
        </div>
        <div className="mt-3 text-center">
          <div className="text-foreground font-medium text-sm">Cognivio AI</div>
          <div className="text-xs text-primary/80 mt-1 bg-primary/10 px-2 py-0.5 rounded-full inline-block border border-primary/20">
            Active
          </div>
        </div>
      </div>
      <div className="bg-muted/30 border border-border rounded-2xl flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-full border-2 border-border bg-muted/50 flex items-center justify-center">
          <User className="w-6 h-6 text-muted-foreground" />
        </div>
        <div className="mt-3 text-center">
          <div className="text-foreground font-medium text-sm">You</div>
          <div className="text-xs text-muted-foreground mt-1">
            Microphone Off
          </div>
        </div>
      </div>
    </div>
    <div className="h-16 bg-muted/30 border border-border rounded-2xl p-3 flex gap-4 items-center">
      <div className="h-full aspect-square bg-primary rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
        <Mic className="text-primary-foreground w-5 h-5" />
      </div>
      <div className="flex-1 h-full flex items-center px-2">
        <div className="flex gap-[3px] items-end h-8 w-full opacity-40">
          {[
            40, 65, 30, 80, 50, 70, 35, 90, 45, 60, 75, 40, 85, 55, 70, 30, 65,
            50, 80, 45, 60, 35, 75, 55, 40, 70, 50, 85, 45, 65,
          ].map((h, i) => (
            <div
              key={i}
              className="w-1 bg-primary rounded-full"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

const VideoOverviewView = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="h-full w-full flex flex-col gap-6 p-6"
  >
    <div className="flex-1 flex flex-col border-none shadow-none bg-transparent">
      <div className="px-0 pt-0 pb-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Video className="w-6 h-6 text-primary" />
              Video Overview
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Experience a dynamic AI-generated visual walkthrough of your
              document.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-0 overflow-visible space-y-6">
        <div className="relative group aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border border-border/50 flex items-center justify-center cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end p-6 z-10">
            <div>
              <h3 className="text-white font-bold text-xl mb-1">
                Navigating Project Risk
              </h3>
              <p className="text-white/70 text-sm">Chapter 22 — Deep Dive</p>
            </div>
          </div>
          <PlayCircle className="w-16 h-16 text-white/60 group-hover:scale-110 transition-transform z-20" />
        </div>
      </div>
    </div>
  </motion.div>
);

const ConceptView = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="h-full flex flex-col p-6"
  >
    <h3 className="text-foreground font-medium flex items-center gap-2 mb-2 text-sm">
      <Lightbulb className="text-primary w-4 h-4" /> Explain Concept
    </h3>
    <p className="text-muted-foreground text-xs mb-6">
      Ask the AI to explain specific topics found in the document.
    </p>
    <div className="relative mb-8">
      <input
        type="text"
        placeholder="E.g., What is the main conclusion?"
        className="w-full bg-muted/50 border border-border rounded-lg py-3 pl-4 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
        readOnly
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary rounded-md text-primary-foreground">
        <Lightbulb size={12} />
      </div>
    </div>
    <div className="flex-1 flex flex-col items-center justify-center opacity-30">
      <Lightbulb size={40} className="text-muted-foreground mb-4" />
      <p className="text-muted-foreground text-sm">Ask a question above</p>
    </div>
  </motion.div>
);

// ==========================================
//    FAQ COMPONENT
// ==========================================

const faqData = [
  {
    q: "What file types does Cognivio AI support?",
    a: "We support PDF, PPTX, DOCX, and plain text files. You can upload documents up to 50MB. Our AI processes the content regardless of format and extracts structured information for all features.",
  },
  {
    q: "How does the AI generate summaries and quizzes?",
    a: "Cognivio uses advanced large language models to analyze your document content. It identifies key concepts, relationships, and important details to generate contextually accurate summaries, quiz questions, flashcards, and audio/video overviews.",
  },
  {
    q: "Is my uploaded data secure?",
    a: "Absolutely. All documents are encrypted in transit and at rest. We do not share your data with third parties. Your documents are only accessible to your account, and you can delete them at any time.",
  },
  {
    q: "What is Voice Chat and Viva Mode?",
    a: "Voice Chat lets you have a real-time voice conversation with an AI tutor about your document. Viva Mode simulates an oral examination, where the AI asks you questions and evaluates your spoken answers — perfect for exam preparation.",
  },
  {
    q: "Can I use Cognivio AI for free?",
    a: "Yes, we offer a free tier with core features including document upload, AI summaries, chat, and flashcard generation. Premium features like Voice Chat, Video Overview, and Podcast generation are available on paid plans.",
  },
  {
    q: "How does the Video Overview feature work?",
    a: "Video Overview uses AI to generate a presentation-style video with dynamic slides and natural voice narration based on your document content. It breaks down complex topics into visual, easy-to-follow explanations.",
  },
];

function FAQItem({
  q,
  a,
  isOpen,
  onToggle,
}: {
  q: string;
  a: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-border rounded-xl overflow-hidden transition-colors hover:border-primary/20">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left gap-4"
      >
        <span className="font-medium text-foreground text-[15px] leading-snug">
          {q}
        </span>
        <div
          className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
        >
          {isOpen ? <Minus size={14} /> : <Plus size={14} />}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed border-t border-border pt-4">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
//    MAIN PAGE COMPONENT
// ==========================================

export default function Home() {
  const [activeTab, setActiveTab] = useState("Summary");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const TABS = [
    { label: "Preview", icon: Eye },
    { label: "Notes", icon: BookOpen },
    { label: "Summary", icon: Sparkles },
    { label: "Chat", icon: MessageCircle },
    { label: "Flashcards", icon: Layers },
    { label: "Quiz", icon: Trophy },
    { label: "Voice/Podcast", icon: Headphones },
    { label: "Concept", icon: Lightbulb },
    { label: "Voice Chat", icon: Mic },
    { label: "Video Overview", icon: Video },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans selection:bg-primary/10 overflow-x-hidden">
      <Navbar />

      <main className="flex-1">
        {/* ================= HERO SECTION ================= */}
        <section
          ref={heroRef}
          className="relative pt-32 pb-8 md:pt-40 md:pb-12 overflow-hidden"
        >
          {/* Professional animated grid background — uses dangerouslySetInnerHTML because Tailwind v4 strips custom class properties and styled-jsx is not supported in Turbopack */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
            .hero-grid-bg {
              position: absolute;
              inset: 0;
              width: 100%;
              height: 100%;
              background-size: 50px 50px;
              background-image:
                linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px);
              -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, #000 30%, transparent 100%);
              mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, #000 30%, transparent 100%);
              animation: grid-move 20s linear infinite;
            }
            .dark .hero-grid-bg {
              background-image:
                linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px);
            }
          `,
            }}
          />
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ zIndex: 0 }}
          >
            <div className="hero-grid-bg" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
          </div>

          {/* Floating decorative elements — LEFT */}
          <div className="absolute left-[2%] xl:left-[5%] top-[22%] hidden lg:flex flex-col gap-4 items-end">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="animate-float"
            >
              <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-3 shadow-lg w-44">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                    <FileText size={12} className="text-primary" />
                  </div>
                  <span className="text-[10px] font-medium text-foreground truncate">
                    Lecture_Notes.pdf
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="h-1.5 bg-muted rounded-full w-full" />
                  <div className="h-1.5 bg-muted rounded-full w-4/5" />
                  <div className="h-1.5 bg-muted rounded-full w-3/5" />
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1, duration: 0.7 }}
              className="animate-float-reverse"
            >
              <div className="bg-primary/10 border border-primary/20 rounded-full px-3 py-1.5 flex items-center gap-2">
                <Upload size={10} className="text-primary" />
                <span className="text-[10px] font-medium text-primary">
                  Auto-analyzed
                </span>
                <CheckCircle2 size={10} className="text-green-500" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3, duration: 0.7 }}
              className="animate-float mt-2"
            >
              <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-full px-3 py-1.5 flex items-center gap-2 shadow-sm">
                <Video size={10} className="text-primary" />
                <span className="text-[10px] font-medium text-foreground">
                  Video Gen
                </span>
                <PlayCircle size={10} className="text-primary/60" />
              </div>
            </motion.div>
          </div>

          {/* Floating decorative elements — RIGHT */}
          <div className="absolute right-[2%] xl:right-[5%] top-[20%] hidden lg:flex flex-col gap-4 items-start">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="animate-float-reverse"
            >
              <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-3 shadow-lg w-40">
                <div className="text-[9px] uppercase tracking-wider text-primary font-semibold mb-1">
                  Flashcard
                </div>
                <div className="text-[11px] text-foreground font-medium">
                  What is entropy?
                </div>
                <div className="mt-2 text-[10px] text-muted-foreground">
                  Tap to reveal →
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.7 }}
              className="animate-float"
            >
              <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2 shadow-lg flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 size={10} className="text-green-500" />
                </div>
                <div>
                  <div className="text-[10px] font-medium text-foreground">
                    Quiz Score
                  </div>
                  <div className="text-[10px] text-primary font-bold">92%</div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4, duration: 0.7 }}
              className="animate-float-slow"
            >
              <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2 shadow-lg flex items-center gap-2">
                <Headphones size={12} className="text-primary" />
                <div className="flex items-end gap-[2px] h-4">
                  {[40, 70, 30, 90, 50, 75, 35, 80, 45].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: [`${h}%`, `${(h + 30) % 100}%`, `${h}%`],
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: i * 0.08,
                      }}
                      className="w-[2px] bg-primary/60 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.6, duration: 0.7 }}
              className="animate-float-reverse mt-2"
            >
              <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2 shadow-lg flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mic size={10} className="text-primary" />
                </div>
                <div>
                  <div className="text-[10px] font-medium text-foreground">
                    Voice Chat
                  </div>
                  <div className="text-[10px] text-primary font-bold animate-pulse">
                    Active
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="container px-4 mx-auto relative z-10">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-6 md:mb-10">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-muted/50 text-muted-foreground text-xs font-medium uppercase tracking-wider mb-6"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                AI-Powered Learning Platform
              </motion.div>

              {/* Heading with professional styling */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-5 leading-[1.15] text-foreground"
              >
                Transform Your Study Materials Into{" "}
                <span className="text-primary">Interactive Mastery.</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
              >
                Supercharge your learning. Convert any document into interactive
                study materials using Video and Podcast Overviews, AI Notes,
                Voice Chat, flashcards, quizzes, and contextual chat.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/register">
                    <Button
                      size="lg"
                      className="rounded-full px-8 h-12 shadow-lg shadow-primary/20 text-sm font-medium group"
                    >
                      Get Started Free
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full px-8 h-12 text-sm font-medium"
                    >
                      See How It Works
                    </Button>
                  </Link>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Shield size={12} className="text-green-500" />
                  No credit card required · Free forever plan
                </p>
              </motion.div>
            </div>

            {/* --- DASHBOARD PREVIEW --- */}
            <div className="mt-2 md:mt-4 flex flex-col w-full max-w-[1200px] mx-auto pb-4 md:pb-16">
              <ContainerScroll titleComponent={null}>
                {/* Glow behind dashboard */}
                <div className="absolute -inset-4 bg-primary/[0.03] blur-3xl rounded-3xl" />

                <div className="relative bg-background rounded-xl border border-border overflow-hidden font-sans flex flex-col h-[500px] md:h-[600px] lg:h-[700px] w-full ring-1 ring-border/50">
                  {/* Top Tab Bar — matches real dashboard */}
                  <div className="border-b border-border flex items-center bg-background shrink-0 gap-2 w-full">
                    {/* Document title */}
                    <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground px-4 py-3 min-w-fit border-r border-border">
                      <span className="bg-primary/10 text-primary p-1 rounded-md">
                        <FileText className="w-3.5 h-3.5" />
                      </span>
                      <span className="font-medium text-foreground text-xs">
                        SE_Lecture_Week4.pdf
                      </span>
                    </div>

                    {/* Tab pills */}
                    <div className="flex flex-nowrap items-center gap-0.5 overflow-x-auto no-scrollbar p-2 flex-1 min-w-0 scroll-smooth">
                      {TABS.map(({ label, icon: Icon }) => (
                        <button
                          key={label}
                          onClick={() => setActiveTab(label)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] lg:text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                            activeTab === label
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 shrink-0" />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-1 overflow-hidden">
                    <DashboardSidebar />

                    {/* Render Active View */}
                    <div className="flex-1 bg-card/30 relative overflow-hidden w-full">
                      <AnimatePresence mode="wait">
                        {activeTab === "Notes" && <NotesView key="notes" />}
                        {activeTab === "Preview" && (
                          <PreviewView key="preview" />
                        )}
                        {activeTab === "Summary" && (
                          <SummaryView key="summary" />
                        )}
                        {activeTab === "Chat" && <ChatView key="chat" />}
                        {activeTab === "Flashcards" && (
                          <FlashcardView key="flashcards" />
                        )}
                        {activeTab === "Quiz" && <QuizView key="quiz" />}
                        {activeTab === "Voice/Podcast" && (
                          <VoiceOverviewView key="voice-overview" />
                        )}
                        {activeTab === "Concept" && (
                          <ConceptView key="concept" />
                        )}
                        {activeTab === "Voice Chat" && (
                          <VoiceChatView key="voice" />
                        )}
                        {activeTab === "Video Overview" && (
                          <VideoOverviewView key="video" />
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </ContainerScroll>
            </div>
          </div>
        </section>

        {/* ================= FEATURES SECTION ================= */}
        <section id="features" className="py-24 md:py-32 relative">
          <div className="section-divider" />
          <div className="container px-4 mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={staggerContainer}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/50 text-muted-foreground text-xs font-medium uppercase tracking-wider mb-4"
              >
                Features
              </motion.div>
              <motion.h2
                variants={fadeInUp}
                className="text-3xl md:text-5xl font-bold mb-5 tracking-tight"
              >
                Everything you need to learn effectively
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-muted-foreground text-lg"
              >
                One platform. Every tool. Upload once, master everything.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={featureStagger}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]"
            >
              <BentoCard
                colSpan="md:col-span-2 lg:col-span-2"
                rowSpan="row-span-2"
                title="Chat with Your Documents"
                description="Ask complex questions and get precise answers cited directly from your lecture notes and study materials."
                icon={<MessageSquare />}
                className="bg-card"
              >
                <div className="absolute bottom-6 right-6 left-6 space-y-3 opacity-90">
                  <div className="p-3 bg-muted rounded-2xl rounded-tl-none text-xs text-muted-foreground w-3/4">
                    Where did the professor mention &apos;entropy&apos;?
                  </div>
                  <div className="p-3 bg-primary/10 border border-primary/20 rounded-2xl rounded-tr-none text-xs text-foreground w-full ml-auto shadow-sm">
                    <span className="font-semibold text-primary block mb-1">
                      Source: Week 2 — Slide 14
                    </span>
                    Entropy was defined as the measure of disorder...
                  </div>
                </div>
              </BentoCard>

              <BentoCard
                colSpan="md:col-span-2 lg:col-span-2"
                title="Voice Chat & Viva Mode"
                description="Real-time voice interaction with an AI tutor. Switch to Viva Mode for oral exam simulation."
                icon={<Mic />}
                className="overflow-hidden flex flex-col justify-between"
              >
                <div className="absolute top-4 right-4 flex gap-1">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-muted text-muted-foreground border border-border">
                    Discuss
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-primary/10 text-primary border border-primary/20 font-medium">
                    Viva Mode
                  </span>
                </div>
                <div className="mt-8 flex items-end justify-center gap-[3px] h-14 w-full">
                  {[
                    40, 65, 30, 80, 50, 70, 35, 90, 45, 60, 75, 40, 85, 55, 70,
                    30, 65, 50, 80, 45,
                  ].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: [`${h}%`, `${(h + 40) % 100}%`, `${h}%`],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.07,
                        ease: "easeInOut",
                      }}
                      className={`w-1 rounded-full ${i % 3 === 0 ? "bg-primary" : "bg-primary/30"}`}
                    />
                  ))}
                </div>
              </BentoCard>

              <BentoCard
                colSpan="md:col-span-1 lg:col-span-1"
                title="AI Summaries"
                description="Condense lengthy documents into structured, actionable insights."
                icon={<FileText />}
              />

              <BentoCard
                colSpan="md:col-span-1 lg:col-span-1"
                title="Instant Quizzes"
                description="Test your knowledge with AI-generated multiple choice questions."
                icon={<Zap />}
              />

              <BentoCard
                colSpan="md:col-span-1 lg:col-span-1"
                title="Voice & Concept Tools"
                description="Audio summaries, podcast generation, and concept explanations."
                icon={<Podcast />}
              >
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-[10px] px-2 py-1 rounded bg-muted border border-border text-muted-foreground">
                    Audio
                  </span>
                  <span className="text-[10px] px-2 py-1 rounded bg-muted border border-border text-muted-foreground">
                    Podcast
                  </span>
                  <span className="text-[10px] px-2 py-1 rounded bg-muted border border-border text-muted-foreground">
                    Concept
                  </span>
                </div>
              </BentoCard>

              <BentoCard
                colSpan="md:col-span-1 lg:col-span-1"
                rowSpan="md:row-span-2"
                title="Video Overview"
                description="AI-generated video explanations with dynamic visuals and natural narration."
                icon={<Video />}
              >
                <div className="relative mt-6 h-32 bg-muted rounded-lg border border-border overflow-hidden group-hover:border-primary/30 transition-colors">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-background/90 flex items-center justify-center shadow-lg border border-border">
                      <PlayCircle className="w-5 h-5 text-foreground" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 h-1 bg-primary/40 w-1/3" />
                </div>
              </BentoCard>

              <BentoCard
                colSpan="md:col-span-2 lg:col-span-2"
                title="Podcast Generation"
                description="Convert your study materials into engaging audio podcasts for learning on the go."
                icon={<Podcast />}
              >
                <div className="flex items-center gap-3 mt-4 p-3 bg-muted/40 rounded-xl border border-border/50">
                  <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center border border-border/60 text-foreground">
                    <Podcast className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="h-1.5 bg-foreground/10 rounded-full w-full mb-1">
                      <div className="h-full bg-primary/40 rounded-full w-1/2" />
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>04:20</span>
                      <span>12:00</span>
                    </div>
                  </div>
                </div>
              </BentoCard>

              <BentoCard
                colSpan="md:col-span-1 lg:col-span-1"
                title="Flashcards"
                description="Auto-generated flashcards for effective revision."
                icon={<Layers />}
              >
                <div className="mt-4 flex gap-1 justify-center opacity-40">
                  <div className="w-8 h-10 border border-border rounded bg-background" />
                  <div className="w-8 h-10 border border-border rounded bg-background -mt-1" />
                  <div className="w-8 h-10 border border-border rounded bg-background" />
                </div>
              </BentoCard>
            </motion.div>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section
          id="how-it-works"
          className="py-24 md:py-32 bg-muted/20 relative"
        >
          <div className="section-divider" />
          <div className="container px-4 mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/50 text-muted-foreground text-xs font-medium uppercase tracking-wider mb-4"
              >
                How It Works
              </motion.div>
              <motion.h2
                variants={fadeInUp}
                className="text-3xl md:text-5xl font-bold mb-5 tracking-tight"
              >
                Three steps to mastery
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-muted-foreground text-lg max-w-xl mx-auto"
              >
                Upload your material, let AI do the heavy lifting, and focus on
                what matters — learning.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-8 lg:gap-12 relative max-w-5xl mx-auto"
            >
              <div className="hidden md:block absolute top-7 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-border to-transparent z-0" />

              <StepCard
                number="01"
                title="Upload"
                desc="Drag and drop your PDFs, PPTX, or DOCX files. Paste text directly if you prefer."
                icon={<Upload className="w-6 h-6" />}
              />
              <StepCard
                number="02"
                title="Analyze"
                desc="Our AI instantly processes and structures your content, identifying key concepts and relationships."
                icon={<Brain className="w-6 h-6" />}
              />
              <StepCard
                number="03"
                title="Master"
                desc="Use AI-generated summaries, quizzes, flashcards, voice tools, and video overviews to achieve mastery."
                icon={<Trophy className="w-6 h-6" />}
              />
            </motion.div>
          </div>
        </section>

        {/* ================= FAQ SECTION ================= */}
        <section id="faq" className="py-24 md:py-32 relative">
          <div className="section-divider" />
          <div className="container px-4 mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={staggerContainer}
              className="max-w-3xl mx-auto"
            >
              <motion.div variants={fadeInUp} className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/50 text-muted-foreground text-xs font-medium uppercase tracking-wider mb-4">
                  FAQ
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-5 tracking-tight">
                  Frequently asked questions
                </h2>
                <p className="text-muted-foreground text-lg">
                  Everything you need to know about Cognivio AI.
                </p>
              </motion.div>

              <motion.div variants={staggerContainer} className="space-y-3">
                {faqData.map((item, i) => (
                  <motion.div key={i} variants={slideInLeft}>
                    <FAQItem
                      q={item.q}
                      a={item.a}
                      isOpen={openFaq === i}
                      onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ================= CTA SECTION ================= */}
        <section className="py-24 md:py-32 relative overflow-hidden">
          <div className="section-divider" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.06),transparent_60%)]" />
          {/* Floating subtle orbs */}
          <div className="absolute top-[20%] left-[10%] w-[200px] h-[200px] bg-primary/[0.03] blur-[80px] rounded-full hero-orb-2" />
          <div className="absolute bottom-[10%] right-[10%] w-[250px] h-[200px] bg-cyan-400/[0.03] blur-[80px] rounded-full hero-orb-3" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="container px-4 mx-auto relative z-10 text-center mt-12"
          >
            <motion.h2
              variants={scaleUp}
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-foreground"
            >
              Ready to upgrade your knowledge infrastructure?
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto"
            >
              Join leading professionals and organizations using our platform to
              master complex concepts faster.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link href="/register">
                <Button
                  size="lg"
                  className="h-13 px-10 rounded-full text-base shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all hover:shadow-2xl hover:shadow-primary/30 group"
                >
                  Start Learning Free
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-13 px-10 rounded-full text-base font-medium"
                >
                  View Pricing
                  <ArrowUpRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
            <motion.p
              variants={fadeInUp}
              className="text-xs text-muted-foreground mt-6 flex items-center justify-center gap-1.5"
            >
              <Shield size={12} className="text-green-500" />
              Free plan available · No credit card required
            </motion.p>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

// --- Helper Components ---

function StepCard({
  number,
  title,
  desc,
  icon,
}: {
  number: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <motion.div variants={fadeInUp} className="text-center relative z-10">
      <div
        className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-primary/20 bg-primary/10 text-primary`}
      >
        {icon}
      </div>
      <div className="text-xs font-semibold text-primary mb-2 tracking-wider uppercase">
        Step {number}
      </div>
      <h3 className="text-xl font-bold mb-3 text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-sm max-w-xs mx-auto">
        {desc}
      </p>
    </motion.div>
  );
}

interface BentoCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  colSpan?: string;
  rowSpan?: string;
  children?: React.ReactNode;
  className?: string;
}

function BentoCard({
  title,
  description,
  icon,
  colSpan = "",
  rowSpan = "",
  children,
  className = "",
}: BentoCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className={`
        group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 shadow-sm hover:shadow-lg hover:border-border transition-all duration-300 flex flex-col hover:-translate-y-1
        ${colSpan} ${rowSpan} ${className}
      `}
    >
      <div className="mb-4 w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-sm text-primary">
        {icon}
      </div>

      <div className="relative z-10 mb-2">
        <h3 className="font-bold text-lg text-foreground tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mt-2">
          {description}
        </p>
      </div>

      {children && (
        <div className="mt-3 flex-1 w-full relative">{children}</div>
      )}
    </motion.div>
  );
}
