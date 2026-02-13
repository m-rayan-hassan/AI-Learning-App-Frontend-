"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Brain, GraduationCap, ArrowRight, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import progressService from "@/services/progressServices";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
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

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-80" />
        </div>

        {/* Stat cards skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-border/50 bg-card p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-12 w-12 rounded-xl" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom sections skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4 rounded-xl border border-border/50 bg-card p-6 space-y-4">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-4 w-64" />
            <div className="space-y-3 mt-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          </div>
          <div className="col-span-3 rounded-xl border border-border/50 bg-card p-6 space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-10 w-full rounded-lg mt-4" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Documents",
      value: data?.overview?.totalDocuments || 0,
      icon: FileText,
      gradient: "from-blue-500 to-blue-600",
      shadow: "shadow-blue-500/20",
    },
    {
      label: "Flashcards Reviewed",
      value: data?.overview?.reviewedFlashcards || 0,
      icon: GraduationCap,
      gradient: "from-purple-500 to-purple-600",
      shadow: "shadow-purple-500/20",
    },
    {
      label: "Quizzes Taken",
      value: data?.overview?.totalQuizzes || 0,
      icon: Brain,
      gradient: "from-emerald-500 to-emerald-600",
      shadow: "shadow-emerald-500/20",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your learning progress.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.label} className="group border border-border/50 hover:border-primary/30 bg-card hover:shadow-lg transition-all duration-300 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-6 flex items-center justify-between relative">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <div className="text-3xl font-bold">{stat.value}</div>
              </div>
              <div className={`h-12 w-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg ${stat.shadow} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border border-border/50 bg-card">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest interactions with the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
             {/* Placeholder for activity list or chart */}
             <p className="text-sm text-muted-foreground">No recent activity.</p>
          </CardContent>
        </Card>
        <Card className="col-span-3 border border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Start learning immediately.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
             <Link href="/documents">
                <Button className="w-full group">
                  <FileText className="mr-2 h-4 w-4" />
                  Upload Document
                  <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
             </Link>
             <Link href="/flashcards">
                <Button variant="outline" className="w-full group border-border/50 hover:border-primary/30">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Study Flashcards
                  <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
             </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
