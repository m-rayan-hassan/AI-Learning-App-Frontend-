"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Layers,
  Trophy,
  ArrowRight,
  Upload,
  Star,
  Headphones,
  Video,
  CheckCircle2,
  Percent,
  GraduationCap,
  Clock,
  ExternalLink,
  TrendingUp,
  BookOpen,
  Zap,
  BarChart2,
  LibraryBig,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import progressService from "@/services/progressServices";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────
   Interactive SVG Donut Chart
───────────────────────────────────────── */
function DonutChart({
  segments,
}: {
  segments: { value: number; color: string; label: string }[];
}) {
  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const R = 60;
  const r = 38;
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const [hovered, setHovered] = useState<number | null>(null);

  let angle = -Math.PI / 2;
  const arcs = segments.map((seg) => {
    const sweep = (seg.value / total) * 2 * Math.PI;
    const x1 = cx + R * Math.cos(angle);
    const y1 = cy + R * Math.sin(angle);
    angle += sweep;
    const x2 = cx + R * Math.cos(angle);
    const y2 = cy + R * Math.sin(angle);
    const x3 = cx + r * Math.cos(angle);
    const y3 = cy + r * Math.sin(angle);
    const x4 = cx + r * Math.cos(angle - sweep);
    const y4 = cy + r * Math.sin(angle - sweep);
    const large = sweep > Math.PI ? 1 : 0;
    const d = `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${r} ${r} 0 ${large} 0 ${x4} ${y4} Z`;
    return { ...seg, d, sweep };
  });

  const activeLabel = hovered !== null ? segments[hovered].label : null;
  const activeVal = hovered !== null ? segments[hovered].value : total;

  return (
    <div className="flex items-center gap-8">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="shrink-0"
      >
        {arcs.map((arc, i) => (
          <path
            key={i}
            d={arc.d}
            fill={arc.color}
            style={{
              opacity: hovered === null ? 1 : hovered === i ? 1 : 0.25,
              transform: hovered === i ? `scale(1.05)` : "scale(1)",
              transformOrigin: `${cx}px ${cy}px`,
              transition: "transform 150ms ease, opacity 150ms ease",
              cursor: "pointer",
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setHovered(hovered === i ? null : i)}
          />
        ))}
        {/* Centre label */}
        <text
          x={cx}
          y={cy - 7}
          textAnchor="middle"
          fontSize="22"
          fontWeight="600"
          fill="currentColor"
          className="text-foreground"
        >
          {activeVal}
        </text>
        <text
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          fontSize="9"
          fontWeight="500"
          letterSpacing="0.08em"
          className="fill-muted-foreground"
          style={{ opacity: 0.65 }}
        >
          {activeLabel?.toUpperCase() ?? "TOTAL"}
        </text>
      </svg>

      {/* Legend */}
      <div className="space-y-3 flex-1">
        {segments.map((seg, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 cursor-pointer"
            style={{
              opacity: hovered !== null && hovered !== i ? 0.35 : 1,
              transition: "opacity 150ms ease",
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setHovered(hovered === i ? null : i)}
          >
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ background: seg.color }}
            />
            <span className="text-sm text-muted-foreground flex-1 leading-none">
              {seg.label}
            </span>
            <span className="text-sm font-semibold text-foreground tabular-nums">
              {seg.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Dashboard Page
───────────────────────────────────────── */
export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    progressService
      .getDashboardData()
      .then(setData)
      .catch((e: any) => setError(e.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;
  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <p className="text-sm text-destructive">{error}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );

  const fmt = (d: any) => {
    if (!isMounted || !d) return "recently";
    try {
      const dt = new Date(d);
      return isNaN(dt.getTime())
        ? "recently"
        : formatDistanceToNow(dt, { addSuffix: true });
    } catch {
      return "recently";
    }
  };

  const ov = data?.overview ?? {};
  const completionRate = ov.totalQuizzes
    ? Math.round(((ov.completedQuizzes || 0) / ov.totalQuizzes) * 100)
    : 0;
  const reviewRate = ov.totalFlashcards
    ? Math.round(((ov.reviewedFlashcards || 0) / ov.totalFlashcards) * 100)
    : 0;

  // Intentionally restrained palette — foreground, primary, muted tones only
  const donutSegments = [
    {
      label: "Quizzes",
      value: ov.totalQuizzes || 0,
      color: "hsl(var(--foreground))",
    },
    {
      label: "Flashcard Sets",
      value: ov.totalFlashcardsSets || 0,
      color: "hsl(var(--primary))",
    },
    {
      label: "Voice/Podcast",
      value: ov.totalVoiceAndPodcastOverviews || 0,
      color: "hsl(var(--muted-foreground))",
    },
    {
      label: "Video",
      value: ov.totalVideoOverviews || 0,
      color: "hsl(217 30% 72%)",
    },
  ];

  return (
    <div className="space-y-7 pb-16 max-w-6xl mx-auto">
      {/* ── Educational Workspace Hero (Resized Top Section) ── */}
      <header className="relative rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
        {/* Subtle dot grid background for educational feel */}
        <div className="absolute inset-0 bg-[radial-gradient(hsl(var(--muted-foreground)/0.12)_1px,transparent_1px)] [background-size:12px_12px] opacity-40 pointer-events-none" />

        <div className="relative z-10 p-5 sm:px-6 sm:py-5 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
              <LibraryBig className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-0.5 leading-none">
                Workspace
              </p>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground leading-tight">
                Learning Command Center
              </h1>
              <p className="text-[13px] sm:text-sm text-muted-foreground mt-0.5 max-w-lg">
                Track your academic progress, review study materials, and manage
                assets.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto mt-2 md:mt-0">
            <Link href="/documents" className="flex-1 md:flex-none">
              <Button
                variant="outline"
                className="w-full h-9 px-4 text-sm font-medium gap-2 border-border bg-background hover:bg-muted/50"
              >
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                Browse Files
              </Button>
            </Link>
            <Link href="/documents" className="flex-1 md:flex-none">
              <Button className="w-full h-9 px-4 text-sm font-medium gap-2 shadow-sm">
                <Upload className="h-3.5 w-3.5" />
                Upload Material
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Documents", value: ov.totalDocuments || 0, icon: FileText },
          {
            label: "Voice/Podcast",
            value: ov.totalVoiceAndPodcastOverviews || 0,
            icon: Headphones,
          },
          { label: "Video", value: ov.totalVideoOverviews || 0, icon: Video },
          {
            label: "Flashcard Sets",
            value: ov.totalFlashcardsSets || 0,
            icon: Layers,
          },
          { label: "Quizzes", value: ov.totalQuizzes || 0, icon: Trophy },
          {
            label: "Avg. Score",
            value: `${ov.averageScore || 0}%`,
            icon: TrendingUp,
          },
        ].map((s) => (
          <KpiTile key={s.label} {...s} />
        ))}
      </div>

      {/* ── Primary Grid: Chart + Performance ── */}
      <div className="grid gap-5 lg:grid-cols-5">
        {/* Donut Chart */}
        <Panel
          className="lg:col-span-2"
          icon={BarChart2}
          title="Asset Breakdown"
          sub="Distribution of generated content"
        >
          <DonutChart segments={donutSegments} />
        </Panel>

        {/* Performance */}
        <Panel
          className="lg:col-span-3"
          icon={TrendingUp}
          title="Performance"
          sub="Quiz completion and scoring"
        >
          <div className="grid grid-cols-3 divide-x divide-border/50 mb-5">
            <BigStat
              value={`${completionRate}%`}
              label="Completion"
              sub={`${ov.completedQuizzes || 0} / ${ov.totalQuizzes || 0}`}
              className="pr-4"
            />
            <BigStat
              value={`${ov.averageScore || 0}%`}
              label="Avg. Score"
              sub="all quizzes"
              className="px-4"
            />
            <BigStat
              value={ov.reviewedFlashcards || 0}
              label="Reviewed"
              sub={`${ov.starredFlashcards || 0} starred`}
              className="pl-4"
            />
          </div>

          <div className="space-y-3">
            <ProgressRow
              label="Average score"
              value={`${ov.averageScore || 0}%`}
              pct={ov.averageScore || 0}
              barClass="bg-foreground"
            />
            <ProgressRow
              label="Quiz completion"
              value={`${completionRate}%`}
              pct={completionRate}
              barClass="bg-primary"
            />
            <ProgressRow
              label="Card review rate"
              value={`${reviewRate}%`}
              pct={reviewRate}
              barClass="bg-muted-foreground"
            />
          </div>
        </Panel>
      </div>

      {/* ── Flashcards + Quizzes detail ── */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Flashcards */}
        <Panel icon={Layers} title="Flashcards" sub="Study card progress">
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              {
                label: "Sets",
                value: ov.totalFlashcardsSets || 0,
                icon: Layers,
              },
              {
                label: "Cards",
                value: ov.totalFlashcards || 0,
                icon: CheckCircle2,
              },
              {
                label: "Reviewed",
                value: ov.reviewedFlashcards || 0,
                icon: Clock,
              },
              {
                label: "Starred",
                value: ov.starredFlashcards || 0,
                icon: Star,
              },
            ].map((s) => (
              <MiniTile key={s.label} {...s} />
            ))}
          </div>
          <ProgressRow
            label="Review progress"
            value={`${reviewRate}%`}
            pct={reviewRate}
            barClass="bg-primary"
          />
          <Link href="/flashcards" className="block mt-4">
            <Button
              variant="outline"
              className="w-full h-9 text-sm gap-2 border-border/60 justify-between group bg-card hover:bg-muted/40"
            >
              <span className="flex items-center gap-2">
                <Layers className="h-3.5 w-3.5" />
                Study flashcards
              </span>
              <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </Link>
        </Panel>

        {/* Quizzes */}
        <Panel icon={Trophy} title="Quizzes" sub="Assessment performance">
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: "Total", value: ov.totalQuizzes || 0, icon: Trophy },
              {
                label: "Completed",
                value: ov.completedQuizzes || 0,
                icon: GraduationCap,
              },
              {
                label: "Avg Score",
                value: `${ov.averageScore || 0}%`,
                icon: Percent,
              },
            ].map((s) => (
              <MiniTile key={s.label} {...s} />
            ))}
          </div>
          <div className="space-y-3 mb-4">
            <ProgressRow
              label="Completed"
              value={`${ov.completedQuizzes || 0} / ${ov.totalQuizzes || 0}`}
              pct={completionRate}
              barClass="bg-foreground"
            />
          </div>
          <Link href="/documents">
            <Button className="w-full h-9 text-sm gap-2 justify-between group">
              <span className="flex items-center gap-2">
                <Zap className="h-3.5 w-3.5" />
                Start a quiz
              </span>
              <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </Link>
        </Panel>
      </div>

      {/* ── Recent Activity ── */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel
          icon={Clock}
          title="Recent Documents"
          sub="Last accessed materials"
        >
          <div className="space-y-0.5 mt-1">
            {data?.recentActivity?.documents?.length > 0 ? (
              data.recentActivity.documents.map((doc: any) => (
                <ActivityRow
                  key={doc._id}
                  icon={FileText}
                  title={doc.title}
                  meta={`Accessed ${fmt(doc.lastAccessed)}`}
                  href={`/documents/${doc._id}`}
                />
              ))
            ) : (
              <p className="text-sm text-muted-foreground py-3">
                No recent documents.
              </p>
            )}
          </div>
        </Panel>

        <Panel
          icon={Trophy}
          title="Recent Quizzes"
          sub="Latest assessment attempts"
        >
          <div className="space-y-0.5 mt-1">
            {data?.recentActivity?.quizzes?.length > 0 ? (
              data.recentActivity.quizzes.map((quiz: any) => (
                <ActivityRow
                  key={quiz._id}
                  icon={Trophy}
                  title={quiz.title || quiz.documentId?.title || "Quiz"}
                  meta={`Score: ${quiz.score}/${quiz.totalQuestions} · ${fmt(quiz.completedAt)}`}
                  href={
                    quiz.documentId?._id
                      ? `/documents/${quiz.documentId._id}/quiz`
                      : undefined
                  }
                />
              ))
            ) : (
              <p className="text-sm text-muted-foreground py-3">
                No recent quizzes.
              </p>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Reusable pieces
───────────────────────────────────────── */

function Panel({
  children,
  className,
  title,
  sub,
  icon: Icon,
}: {
  children: React.ReactNode;
  className?: string;
  title: string;
  sub: string;
  icon: any;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-card p-5",
        className,
      )}
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <p className="text-[0.9rem] font-semibold text-foreground leading-tight">
            {title}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-tight">
            {sub}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}

function KpiTile({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: any;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 hover:border-border hover:bg-muted/20 transition-all duration-200 group">
      <Icon className="h-4 w-4 text-muted-foreground mb-3" />
      <p className="text-[1.65rem] font-semibold tracking-tight text-foreground tabular-nums leading-none">
        {value}
      </p>
      <p className="text-xs text-muted-foreground mt-1.5">{label}</p>
    </div>
  );
}

function BigStat({
  value,
  label,
  sub,
  className,
}: {
  value: string | number;
  label: string;
  sub: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-0.5", className)}>
      <p className="text-2xl font-semibold tracking-tight text-foreground tabular-nums leading-none">
        {value}
      </p>
      <p className="text-xs font-medium text-foreground/80 mt-1.5">{label}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

function MiniTile({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: any;
}) {
  return (
    <div className="rounded-xl bg-muted/40 border border-border/40 px-3 py-3">
      <Icon className="h-3.5 w-3.5 text-muted-foreground mb-2" />
      <p className="text-lg font-semibold text-foreground tabular-nums leading-none">
        {value}
      </p>
      <p className="text-xs text-muted-foreground mt-1 leading-tight">
        {label}
      </p>
    </div>
  );
}

function ProgressRow({
  label,
  value,
  pct,
  barClass,
}: {
  label: string;
  value: string;
  pct: number;
  barClass: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-semibold text-foreground tabular-nums">
          {value}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            barClass,
          )}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}

function ActivityRow({
  icon: Icon,
  title,
  meta,
  href,
}: {
  icon: any;
  title: string;
  meta: string;
  href?: string;
}) {
  return (
    <div className="group flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-muted/40 transition-colors duration-150">
      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0 overflow-hidden">
        <p className="text-sm font-medium text-foreground truncate leading-snug">
          {title}
        </p>
        <p className="text-xs text-muted-foreground leading-snug">{meta}</p>
      </div>
      {href && (
        <Link
          href={href}
          className="shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
        >
          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
        </Link>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-7 pb-16 max-w-6xl mx-auto">
      {/* Resized Skeleton Header */}
      <div className="rounded-2xl border border-border/60 bg-card p-5 sm:px-6 sm:py-5 mb-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-3.5">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-56" />
              <Skeleton className="h-3.5 w-72" />
            </div>
          </div>
          <div className="flex gap-2.5 mt-2 md:mt-0">
            <Skeleton className="h-9 w-32 rounded-md" />
            <Skeleton className="h-9 w-36 rounded-md" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-5">
        <Skeleton className="lg:col-span-2 h-56 rounded-2xl" />
        <Skeleton className="lg:col-span-3 h-56 rounded-2xl" />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Skeleton className="h-60 rounded-2xl" />
        <Skeleton className="h-60 rounded-2xl" />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Skeleton className="h-52 rounded-2xl" />
        <Skeleton className="h-52 rounded-2xl" />
      </div>
    </div>
  );
}
