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
  BarChart3,
  Sparkles,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import progressService from "@/services/progressServices";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const fetchData = async () => {
      try {
        const dashboardData = await progressService.getDashboardData();
        setData(dashboardData);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-sm text-destructive">{error}</p>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          Try again
        </Button>
      </div>
    );
  }

  const formatDate = (dateString: any) => {
    if (!isMounted || !dateString) return "recently";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "recently";
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return "recently";
    }
  };

  const ov = data?.overview ?? {};

  const completionRate = ov.totalQuizzes
    ? Math.round(((ov.completedQuizzes || 0) / ov.totalQuizzes) * 100)
    : 0;

  const chartItems = [
    {
      label: "Quizzes",
      value: ov.totalQuizzes || 0,
      color: "bg-amber-500",
      textColor: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Flashcards",
      value: ov.totalFlashcards || 0,
      color: "bg-violet-500",
      textColor: "text-violet-600 dark:text-violet-400",
    },
    {
      label: "Voice & Podcast",
      value: ov.totalVoiceAndPodcastOverviews || 0,
      color: "bg-emerald-500",
      textColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Video",
      value: ov.totalVideoOverviews || 0,
      color: "bg-rose-500",
      textColor: "text-rose-600 dark:text-rose-400",
    },
  ];
  const maxVal = Math.max(...chartItems.map((i) => i.value), 1);

  return (
    <div className="space-y-10 pb-12 max-w-7xl mx-auto animate-in fade-in duration-500">

      {/* ── Hero Header (Centered & Professional) ── */}
      <div className="flex flex-col items-center justify-center text-center pt-8 pb-6 border-b border-border/50">
        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 ring-1 ring-primary/20">
          <BookOpen className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground leading-tight">
          Learning Command Center
        </h1>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto text-sm sm:text-base">
          Track your progress, review study materials, and seamlessly launch new sessions.
        </p>
        
        {/* Core Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-8">
          <Link href="/documents">
            <Button className="h-11 px-6 rounded-full gap-2 shadow-sm font-medium w-full sm:w-auto">
              <Upload className="h-4 w-4" />
              Upload Content
            </Button>
          </Link>
          <Link href="/documents">
            <Button 
              variant="outline" 
              className="h-11 px-6 rounded-full gap-2 bg-background font-medium w-full sm:w-auto hover:bg-muted/50"
            >
              <FileText className="h-4 w-4" />
              Browse Documents
            </Button>
          </Link>
        </div>
      </div>

      {/* ── KPI Strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          {
            label: "Documents",
            value: ov.totalDocuments || 0,
            icon: FileText,
            accent: "text-blue-500",
            bg: "bg-blue-500/8 dark:bg-blue-500/10",
          },
          {
            label: "Voice / Podcast",
            value: ov.totalVoiceAndPodcastOverviews || 0,
            icon: Headphones,
            accent: "text-emerald-500",
            bg: "bg-emerald-500/8 dark:bg-emerald-500/10",
          },
          {
            label: "Video Overviews",
            value: ov.totalVideoOverviews || 0,
            icon: Video,
            accent: "text-rose-500",
            bg: "bg-rose-500/8 dark:bg-rose-500/10",
          },
          {
            label: "Flashcard Sets",
            value: ov.totalFlashcardsSets || 0,
            icon: Layers,
            accent: "text-violet-500",
            bg: "bg-violet-500/8 dark:bg-violet-500/10",
          },
          {
            label: "Quizzes",
            value: ov.totalQuizzes || 0,
            icon: Trophy,
            accent: "text-amber-500",
            bg: "bg-amber-500/8 dark:bg-amber-500/10",
          },
          {
            label: "Avg. Score",
            value: `${ov.averageScore || 0}%`,
            icon: TrendingUp,
            accent: "text-green-500",
            bg: "bg-green-500/8 dark:bg-green-500/10",
          },
        ].map((stat) => (
          <KpiCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* ── Main Grid ── */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Content chart */}
        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-base font-semibold text-foreground flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                Content Distribution
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Learning assets generated across formats
              </p>
            </div>
          </div>
          <div className="space-y-5">
            {chartItems.map((item) => {
              const pct = Math.max(6, Math.round((item.value / maxVal) * 100));
              return (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      {item.label}
                    </span>
                    <span className={cn("text-sm font-semibold tabular-nums", item.textColor)}>
                      {item.value}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-700", item.color)}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance + Quick start */}
        <div className="space-y-4">

          {/* Performance */}
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
            <p className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              Performance
            </p>
            <div className="space-y-3">
              <MetricRow
                label="Quiz completion"
                value={`${completionRate}%`}
                sub={`${ov.completedQuizzes || 0} of ${ov.totalQuizzes || 0}`}
              />
              <Divider />
              <MetricRow
                label="Average score"
                value={`${ov.averageScore || 0}%`}
                sub="across all quizzes"
              />
              <Divider />
              <MetricRow
                label="Cards reviewed"
                value={ov.reviewedFlashcards || 0}
                sub={`${ov.starredFlashcards || 0} starred`}
              />
            </div>
          </div>

          {/* Quick start */}
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
            <p className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              Quick start
            </p>
            <div className="space-y-2">
              <Link href="/documents" className="block">
                <Button className="w-full h-10 text-sm justify-between group" size="sm">
                  <span className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload new document
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
              <Link href="/flashcards" className="block">
                <Button
                  variant="outline"
                  className="w-full h-10 text-sm justify-between group border-border/60 hover:border-primary/40 bg-background"
                  size="sm"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Study flashcards
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* ── Flashcard detail strip ── */}
      <div>
        <SectionHeader icon={Layers} label="Flashcard breakdown" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
          {[
            { label: "Total sets", value: ov.totalFlashcardsSets || 0, icon: Layers, accent: "text-violet-500", bg: "bg-violet-500/8" },
            { label: "Total cards", value: ov.totalFlashcards || 0, icon: CheckCircle2, accent: "text-indigo-500", bg: "bg-indigo-500/8" },
            { label: "Reviewed", value: ov.reviewedFlashcards || 0, icon: Clock, accent: "text-cyan-500", bg: "bg-cyan-500/8" },
            { label: "Starred", value: ov.starredFlashcards || 0, icon: Star, accent: "text-amber-500", bg: "bg-amber-500/8" },
          ].map((s) => (
            <KpiCard key={s.label} {...s} />
          ))}
        </div>
      </div>

      {/* ── Quiz detail strip ── */}
      <div>
        <SectionHeader icon={Trophy} label="Quiz performance" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
          {[
            { label: "Total quizzes", value: ov.totalQuizzes || 0, icon: Trophy, accent: "text-orange-500", bg: "bg-orange-500/8" },
            { label: "Completed", value: ov.completedQuizzes || 0, icon: GraduationCap, accent: "text-purple-500", bg: "bg-purple-500/8" },
            { label: "Average score", value: `${ov.averageScore || 0}%`, icon: Percent, accent: "text-green-500", bg: "bg-green-500/8" },
          ].map((s) => (
            <KpiCard key={s.label} {...s} />
          ))}
        </div>
      </div>

      {/* ── Recent Activity ── */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Recent documents */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <p className="text-base font-semibold text-foreground">Recent documents</p>
          </div>
          <div className="space-y-2">
            {data?.recentActivity?.documents?.length > 0 ? (
              data.recentActivity.documents.map((doc: any) => (
                <ActivityRow
                  key={doc._id}
                  icon={FileText}
                  iconBg="bg-primary/8 dark:bg-primary/12"
                  iconColor="text-primary"
                  title={doc.title}
                  meta={`Accessed ${formatDate(doc.lastAccessed)}`}
                  href={`/documents/${doc._id}`}
                />
              ))
            ) : (
              <p className="text-xs text-muted-foreground py-2">No recent documents.</p>
            )}
          </div>
        </div>

        {/* Recent quizzes */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Trophy className="h-4 w-4 text-muted-foreground" />
            <p className="text-base font-semibold text-foreground">Recent quizzes</p>
          </div>
          <div className="space-y-2">
            {data?.recentActivity?.quizzes?.length > 0 ? (
              data.recentActivity.quizzes.map((quiz: any) => (
                <ActivityRow
                  key={quiz._id}
                  icon={Trophy}
                  iconBg="bg-amber-500/8 dark:bg-amber-500/12"
                  iconColor="text-amber-500"
                  title={quiz.title || quiz.documentId?.title || "Quiz"}
                  meta={`Score: ${quiz.score}/${quiz.totalQuestions} · ${formatDate(quiz.completedAt)}`}
                  href={quiz.documentId?._id ? `/documents/${quiz.documentId._id}/quiz` : undefined}
                />
              ))
            ) : (
              <p className="text-xs text-muted-foreground py-2">No recent quizzes.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── Sub-components ── */

function KpiCard({
  label,
  value,
  icon: Icon,
  accent,
  bg,
}: {
  label: string;
  value: string | number;
  icon: any;
  accent: string;
  bg: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 flex items-center justify-between group hover:border-border hover:shadow-sm transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div>
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className="text-2xl font-semibold text-foreground tabular-nums tracking-tight">{value}</p>
      </div>
      <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center shrink-0", bg)}>
        <Icon className={cn("h-5 w-5", accent)} />
      </div>
    </div>
  );
}

function MetricRow({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
      </div>
      <p className="text-lg font-semibold text-foreground tabular-nums tracking-tight">{value}</p>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-border/50" />;
}

function SectionHeader({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <p className="text-base font-semibold text-foreground">{label}</p>
    </div>
  );
}

function ActivityRow({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  meta,
  href,
}: {
  icon: any;
  iconBg: string;
  iconColor: string;
  title: string;
  meta: string;
  href?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-transparent hover:border-border/60 hover:bg-muted/30 transition-all duration-150 group">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0", iconBg)}>
          <Icon className={cn("h-4 w-4", iconColor)} />
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-medium text-foreground truncate leading-snug">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{meta}</p>
        </div>
      </div>
      {href && (
        <Link href={href} className="shrink-0">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </Link>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-10 pb-12 max-w-7xl mx-auto">
      {/* Centered Hero Skeleton */}
      <div className="flex flex-col items-center justify-center pt-8 pb-6 border-b border-border/50">
        <Skeleton className="h-12 w-12 rounded-xl mb-5" />
        <Skeleton className="h-8 w-64 mb-3" />
        <Skeleton className="h-4 w-96 mb-8" />
        <div className="flex gap-3">
          <Skeleton className="h-11 w-40 rounded-full" />
          <Skeleton className="h-11 w-40 rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="lg:col-span-2 h-64 rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    </div>
  );
}