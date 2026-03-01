"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Layers, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import flashcardsServices from "@/services/flashcardsServices";
import Link from "next/link";

export default function FlashcardsPage() {
  const [flashcardSets, setFlashcardSets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const data = await flashcardsServices.getAllFlashCardSets();
        setFlashcardSets(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFlashcards();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-5 w-72" />
        </div>

        {/* Card grid skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-border/50 bg-card p-5 space-y-4"
            >
              <div className="flex justify-between items-start">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3.5 w-1/2" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-7 w-20 rounded-md" />
                <Skeleton className="h-7 w-24 rounded-md" />
              </div>
              <Skeleton className="h-1.5 w-full rounded-full" />
              <div className="border-t pt-4 mt-2">
                <Skeleton className="h-9 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Flashcards</h1>
        <p className="text-muted-foreground">
          Review and study your generated flashcards.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {flashcardSets.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed rounded-xl p-8 text-center animate-in fade-in-50">
            <div className="bg-primary/10 p-4 rounded-2xl mb-4">
              <Layers className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">No flashcards yet</h3>
              <p className="text-muted-foreground text-sm max-w-sm">
                Go to a document and generate some flashcards to start studying!
              </p>
            </div>
            <Link href="/documents" className="mt-6">
              <Button>Go to Documents</Button>
            </Link>
          </div>
        ) : (
          flashcardSets.map((set: any, i) => (
            <Card
              key={set._id || i}
              className="group flex flex-col justify-between hover:shadow-xl transition-all duration-300 border border-border/50 hover:border-primary/30 relative overflow-hidden bg-card"
            >
              <div className="absolute inset-0 bg-primary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="pb-2 relative">
                <div className="flex justify-between items-start mb-2">
                  <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <Layers className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(set.createdAt || Date.now()).toLocaleDateString()}
                  </div>
                </div>
                <CardTitle
                  className="truncate text-base"
                  title={set.title || "Untitled Set"}
                >
                  {set.documentId?.title || "Flashcard Set"}
                </CardTitle>
                <CardDescription className="text-xs">
                  Created{" "}
                  {new Date(set.createdAt || Date.now()).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2 relative">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="px-2.5 py-1 bg-muted text-muted-foreground text-xs rounded-full font-medium flex items-center gap-1.5 border border-border/50">
                    <Layers className="h-3 w-3" />
                    {set.cards?.length || 0} Cards
                  </div>
                  <div className="px-2.5 py-1 bg-muted text-muted-foreground text-xs rounded-full font-medium flex items-center gap-1.5 border border-border/50">
                    0% Mastered
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-muted/60 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-primary h-full w-0 rounded-full transition-all duration-500" />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>Progress</span>
                  <span>0/{set.cards?.length || 0} reviewed</span>
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t border-border/50 mt-2 relative">
                <Link
                  href={`/documents/${set.documentId?._id || set.documentId}`}
                  className="w-full"
                >
                  <Button className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-sm hover:shadow-md transition-all duration-300">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Study Now
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
