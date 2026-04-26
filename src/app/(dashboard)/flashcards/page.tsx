"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Layers,
  Calendar,
  Filter,
  X,
  Check,
  Search,
  ArrowRight,
  Library,
} from "lucide-react";
import flashcardsServices from "@/services/flashcardsServices";
import documentServices from "@/services/documentServices";
import { cn } from "@/lib/utils";

export default function FlashcardsPage() {
  const [flashcardSets, setFlashcardSets] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [flashcardData, docData] = await Promise.all([
          flashcardsServices.getAllFlashCardSets(),
          documentServices.getDocuments(),
        ]);
        setFlashcardSets(Array.isArray(flashcardData) ? flashcardData : []);
        setDocuments(Array.isArray(docData) ? docData : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredSets = useMemo(() => {
    if (selectedDocIds.length === 0) return flashcardSets;
    return flashcardSets.filter((set) => {
      const docId = set.documentId?._id || set.documentId;
      return selectedDocIds.includes(docId);
    });
  }, [flashcardSets, selectedDocIds]);

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [documents, searchQuery]);

  const toggleDoc = (docId: string) => {
    setSelectedDocIds((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId],
    );
  };

  const clearFilters = () => {
    setSelectedDocIds([]);
    setSearchQuery("");
  };

  if (loading) return <FlashcardsSkeleton />;

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* ── Premium Header Section ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pt-2 pb-6 border-b border-border/50">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 ring-1 ring-primary/20">
            <Library className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground leading-tight">
              Flashcard Library
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Review, filter, and master your generated study materials.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 relative">
          <div className="relative">
            <Button
              variant="outline"
              className={cn(
                "h-10 px-4 gap-2 transition-all bg-background border-border/60 hover:bg-muted/50",
                selectedDocIds.length > 0 &&
                  "border-primary/40 bg-primary/5 text-primary",
              )}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filter Library</span>
              {selectedDocIds.length > 0 && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {selectedDocIds.length}
                </span>
              )}
            </Button>

            {/* Custom Filter Dropdown */}
            {isFilterOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsFilterOpen(false)}
                />
                <Card className="absolute left-0 sm:left-auto sm:right-0 top-[calc(100%+8px)] w-[300px] sm:w-[320px] z-20 shadow-xl border-border/60 animate-in fade-in zoom-in-95 duration-200">
                  <CardHeader className="p-4 pb-3 border-b border-border/50">
                    <CardTitle className="text-sm font-semibold flex items-center justify-between">
                      Filter by Document
                      {selectedDocIds.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearFilters}
                          className="h-auto p-0 text-xs text-muted-foreground hover:text-destructive transition-colors"
                        >
                          Clear All
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-9 text-sm bg-muted/30 border-border/50 focus-visible:ring-1 focus-visible:ring-primary/30"
                      />
                    </div>

                    <div className="max-h-[240px] overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                      {filteredDocs.length === 0 ? (
                        <div className="text-center py-8 text-sm text-muted-foreground">
                          No documents found.
                        </div>
                      ) : (
                        filteredDocs.map((doc) => (
                          <div
                            key={doc._id}
                            className={cn(
                              "flex items-center space-x-3 p-2.5 rounded-lg transition-colors cursor-pointer hover:bg-muted/50 border border-transparent",
                              selectedDocIds.includes(doc._id) &&
                                "bg-primary/5 border-primary/10",
                            )}
                            onClick={() => toggleDoc(doc._id)}
                          >
                            <Checkbox
                              id={`filter-${doc._id}`}
                              checked={selectedDocIds.includes(doc._id)}
                              onCheckedChange={() => toggleDoc(doc._id)}
                              onClick={(e) => e.stopPropagation()}
                              className="h-4 w-4 rounded-[4px]"
                            />
                            <label
                              htmlFor={`filter-${doc._id}`}
                              className="text-sm font-medium leading-none cursor-pointer flex-1 line-clamp-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {doc.title}
                            </label>
                            {selectedDocIds.includes(doc._id) && (
                              <Check className="h-4 w-4 text-primary shrink-0" />
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-3 border-t border-border/50 bg-muted/10 flex justify-end">
                    <Button
                      size="sm"
                      className="h-8 px-5 text-xs font-medium"
                      onClick={() => setIsFilterOpen(false)}
                    >
                      Done
                    </Button>
                  </CardFooter>
                </Card>
              </>
            )}
          </div>

          {selectedDocIds.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearFilters}
              className="h-10 w-10 shrink-0 text-muted-foreground hover:text-foreground bg-muted/30"
              title="Clear all filters"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* ── Active Filters Strip ── */}
      {selectedDocIds.length > 0 && (
        <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
          {selectedDocIds.map((id) => {
            const doc = documents.find((d) => d._id === id);
            if (!doc) return null;
            return (
              <div
                key={id}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border/60 text-foreground rounded-full text-xs font-medium shadow-sm"
              >
                <span className="max-w-[200px] truncate">{doc.title}</span>
                <button
                  onClick={() => toggleDoc(id)}
                  className="hover:bg-muted rounded-full p-0.5 transition-colors text-muted-foreground hover:text-foreground ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Flashcard Grid ── */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredSets.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center min-h-[350px] border border-dashed border-border/60 rounded-2xl p-8 text-center bg-card shadow-sm">
            <div className="h-14 w-14 bg-muted rounded-2xl flex items-center justify-center mb-5 ring-1 ring-border">
              <Layers className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground text-lg mb-1">
              {selectedDocIds.length === 0
                ? "No flashcards available"
                : "No flashcards found"}
            </h3>
            <p className="text-muted-foreground text-sm max-w-sm mb-6">
              {selectedDocIds.length === 0
                ? "Upload a document and generate flashcards to start building your library."
                : "Adjust your active filters to find the study materials you're looking for."}
            </p>
            {selectedDocIds.length > 0 ? (
              <Button variant="outline" onClick={clearFilters}>
                Clear All Filters
              </Button>
            ) : (
              <Link href="/documents">
                <Button>Browse Documents</Button>
              </Link>
            )}
          </div>
        ) : (
          filteredSets.map((set: any, i) => (
            <Card
              key={set._id || i}
              className="group flex flex-col justify-between hover:border-primary/30 transition-all duration-200 border border-border/60 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-md"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-4">
                  {/* Icon */}
                  <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                    <Layers className="h-5 w-5 text-primary" />
                  </div>
                  {/* Date Badge */}
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground bg-muted/50 border border-border/50 px-2 py-1 rounded-md">
                    <Calendar className="h-3 w-3" />
                    {new Date(set.createdAt || Date.now()).toLocaleDateString(
                      undefined,
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </div>
                </div>
                {/* Title & Description */}
                <CardTitle
                  className="truncate text-base leading-snug font-semibold text-foreground"
                  title={set.documentId?.title || "Flashcard Set"}
                >
                  {set.documentId?.title || "Flashcard Set"}
                </CardTitle>
                <CardDescription className="text-xs mt-1.5 truncate">
                  Generated study materials
                </CardDescription>
              </CardHeader>

              <CardContent className="pb-5 flex-1">
                {/* Content Badge */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="px-2.5 py-1.5 bg-secondary text-secondary-foreground text-xs rounded-md font-medium flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 opacity-70" />
                    {set.cards?.length || 0} Cards
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-0 pb-5 px-6 mt-auto">
                {/* Action Button */}
                <Link
                  href={`/documents/${set.documentId?._id || set.documentId}/flashcards`}
                  className="w-full"
                >
                  <Button className="w-full group/btn h-10 shadow-sm font-medium">
                    Study Session
                    <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover/btn:translate-x-1 transition-transform" />
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

/* ── Skeleton Loader ── */
function FlashcardsSkeleton() {
  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2 pb-6 border-b border-border/50">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
        </div>
        <Skeleton className="h-10 w-36 rounded-md" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card
            key={i}
            className="border-border/60 shadow-sm flex flex-col justify-between min-h-[220px]"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-4">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-6 w-24 rounded-md" />
              </div>
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="pb-5">
              <Skeleton className="h-7 w-24 rounded-md" />
            </CardContent>
            <CardFooter className="pt-0 pb-5">
              <Skeleton className="h-10 w-full rounded-md" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
