"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Star,
  Trash2,
  AlertCircle,
  ArrowLeft,
  Play,
  Layers,
  Calendar,
  BookOpen,
  Clock,
} from "lucide-react";
import { aiServices } from "@/services/aiServices";
import flashcardsServices from "@/services/flashcardsServices";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";

interface Flashcard {
  _id: string;
  question: string;
  answer: string;
  reviewCount: number;
  lastReviewed: string | null;
  isStarted: boolean;
  inStarted?: boolean; // Handling backend typo workaround
  difficulty?: "easy" | "medium" | "hard";
}

interface FlashcardSet {
  _id: string;
  title: string;
  cards: Flashcard[];
  createdAt: string;
}

export function FlashcardsTab({ documentId }: { documentId: string }) {
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [selectedSet, setSelectedSet] = useState<FlashcardSet | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [count, setCount] = useState(5);
  const [reviewingCardId, setReviewingCardId] = useState<string | null>(null);

  const loadFlashcards = async () => {
    try {
      setError("");
      const res = await flashcardsServices.getFlashCardsforDocument(documentId);
      setFlashcardSets(res?.flashcards || res || []);
    } catch (err: any) {
      console.error(err);
      const errorMsg =
        err?.error || err?.message || "Failed to load flashcards";
      setError(errorMsg);
    }
  };

  useEffect(() => {
    loadFlashcards();
  }, [documentId]);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await aiServices.generateFlashCards(documentId, { count });
      if (res) {
        await loadFlashcards();
      }
    } catch (err: any) {
      console.error(err);
      const errorMsg =
        err?.error || err?.message || "Failed to generate flashcards";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSet = (set: FlashcardSet) => {
    setSelectedSet(set);
    setCurrentIndex(0);
    setIsFlipped(false);
    setError("");
  };

  const handleBackToList = () => {
    setSelectedSet(null);
    setCurrentIndex(0);
    setIsFlipped(false);
    setError("");
    setReviewingCardId(null);
  };

  const handleToggleStar = async (cardId: string) => {
    if (!selectedSet) return;

    const card = selectedSet.cards[currentIndex];
    setReviewingCardId(cardId);

    // Workaround for backend field typo: check both 'isStarted' and 'inStarted'
    const currentState = card.isStarted || card.inStarted || false;
    const newState = !currentState;

    // Optimistically update both fields
    const prevSelected = selectedSet;
    const optimisticCards = selectedSet.cards.map((c) =>
      c._id === cardId ? { ...c, isStarted: newState, inStarted: newState } : c,
    );
    setSelectedSet({ ...selectedSet, cards: optimisticCards });

    try {
      const updatedSet = await flashcardsServices.toggleStar(cardId);
      // Replace the set in the top-level list so reopening reflects server state
      if (updatedSet && updatedSet._id) {
        setFlashcardSets((prev) =>
          prev.map((s) => (s._id === updatedSet._id ? updatedSet : s)),
        );
        setSelectedSet(updatedSet);
        // keep the same currentIndex if possible
        const idx = updatedSet.cards.findIndex((c: any) => c._id === cardId);
        if (idx >= 0) setCurrentIndex(idx);
      }
    } catch (err: any) {
      console.error("Toggle star failed", err);
      const errorMsg = err?.error || err?.message || "Failed to toggle star";
      setError(errorMsg);
      // Revert optimistic change
      setSelectedSet(prevSelected);
    } finally {
      setReviewingCardId(null);
    }
  };

  const handleReviewCard = async () => {
    if (!selectedSet || !selectedSet.cards[currentIndex]) return;

    const card = selectedSet.cards[currentIndex];

    // Optimistic update for review count
    const updatedCards = selectedSet.cards.map((c) =>
      c._id === card._id
        ? {
            ...c,
            reviewCount: c.reviewCount + 1,
            lastReviewed: new Date().toISOString(),
          }
        : c,
    );
    const prevSelected = selectedSet;
    setSelectedSet({ ...selectedSet, cards: updatedCards });

    try {
      const updatedSet = await flashcardsServices.reviewFlashCard(
        card._id,
        currentIndex,
      );
      // Sync returned data with local state
      if (updatedSet && updatedSet._id) {
        setSelectedSet(updatedSet);
        setFlashcardSets((prev) =>
          prev.map((s) => (s._id === updatedSet._id ? updatedSet : s)),
        );
      }
      return updatedSet;
    } catch (err: any) {
      console.error("Review failed", err);
      const errorMsg =
        err?.error || err?.message || "Failed to review flashcard";
      setError(errorMsg);
      // Revert optimistic change
      setSelectedSet(prevSelected);
      return null;
    }
  };

  const handleNextCard = async () => {
    if (currentIndex < (selectedSet?.cards?.length || 0) - 1) {
      await handleReviewCard();
      setIsFlipped(false);
      // Snappy transition
      setTimeout(() => setCurrentIndex(currentIndex + 1), 100);
    }
  };

  const handlePreviousCard = async () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(currentIndex - 1), 100);
    }
  };

  const handleDeleteSet = async (setId: string) => {
    if (!confirm("Are you sure you want to delete this flashcard set?")) return;

    setDeleting(true);
    setError("");
    try {
      await flashcardsServices.deleteFlashCardSet(setId);
      await loadFlashcards();
      setSelectedSet(null);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (err: any) {
      console.error(err);
      const errorMsg = err?.error || err?.message || "Failed to delete set";
      setError(errorMsg);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown date";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // --- Render: Review View ---
  if (selectedSet && selectedSet.cards.length > 0) {
    const currentCard = selectedSet.cards[currentIndex];
    const isStarred = currentCard.isStarted || currentCard.inStarted; // Workaround typo

    const questionText = currentCard.question || "No question provided";
    const answerText = currentCard.answer || "No answer provided";

    return (
      <div className="flex flex-col h-[calc(100vh-200px)] min-h-[500px] max-w-5xl mx-auto w-full">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={handleBackToList}
            className="group pl-0 hover:pl-2 transition-all hover:bg-transparent"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium text-muted-foreground group-hover:text-foreground">
              Back to Sets
            </span>
          </Button>

          <div className="text-center hidden sm:block">
            <h3 className="font-bold text-lg">{selectedSet.title}</h3>
            <p className="text-xs text-muted-foreground">
              {currentIndex + 1} of {selectedSet.cards.length} cards
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteSet(selectedSet._id)}
            disabled={deleting}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 p-3 mb-4 rounded-lg text-sm flex items-center gap-2"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Card Container */}
        <div className="flex-1 flex flex-col items-center justify-center relative perspective-1000">
          <div className="w-full max-w-3xl aspect-[16/9] md:aspect-[2/1] relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full relative cursor-pointer group"
                onClick={() => setIsFlipped(!isFlipped)}
                style={{ perspective: "1000px" }}
              >
                <motion.div
                  className="w-full h-full relative preserve-3d"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 400, // Very snappy
                    damping: 30, // Minimal wobble
                    mass: 0.8,
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* FRONT */}
                  <div className="absolute inset-0 backface-hidden">
                    <Card className="w-full h-full flex flex-col items-center justify-center p-8 md:p-12 text-center bg-gradient-to-br from-background to-secondary/20 border-2 hover:border-primary/20 transition-colors shadow-lg hover:shadow-xl rounded-3xl">
                      <div className="absolute top-6 left-6 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        Question
                      </div>
                      <div className="overflow-y-auto max-h-full w-full scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
                        <h2 className="text-xl md:text-3xl font-bold leading-relaxed text-foreground">
                          {questionText}
                        </h2>
                      </div>
                      <div className="absolute bottom-6 text-xs text-muted-foreground font-medium flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                        <RefreshCw className="h-3 w-3" /> Click to flip
                      </div>
                    </Card>
                  </div>

                  {/* BACK */}
                  <div
                    className="absolute inset-0 backface-hidden"
                    style={{ transform: "rotateY(180deg)" }}
                  >
                    <Card className="w-full h-full flex flex-col items-center justify-center p-8 md:p-12 text-center bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 shadow-lg rounded-3xl">
                      <div className="absolute top-6 left-6 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        Answer
                      </div>
                      <div className="overflow-y-auto max-h-full w-full scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
                        <p className="text-lg md:text-2xl font-medium leading-relaxed text-foreground/90">
                          {answerText}
                        </p>
                      </div>
                    </Card>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Progress & Controls */}
        <div className="mt-8 space-y-6">
          <div className="w-full max-w-2xl mx-auto space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground font-medium px-1">
              <span>Progress</span>
              <span>
                {currentIndex + 1} / {selectedSet.cards.length}
              </span>
            </div>
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{
                  width: `${((currentIndex + 1) / selectedSet.cards.length) * 100}%`,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-6">
            <Button
              variant="outline"
              size="lg"
              onClick={handlePreviousCard}
              disabled={currentIndex === 0}
              className="w-28 rounded-xl shadow-sm border-2"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Prev
            </Button>

            <Button
              variant={isStarred ? "default" : "outline"}
              size="icon"
              onClick={() => handleToggleStar(currentCard._id)}
              disabled={reviewingCardId === currentCard._id}
              className={cn(
                "h-14 w-14 rounded-2xl shadow-md transition-all duration-200 border-2",
                isStarred
                  ? "bg-yellow-400 hover:bg-yellow-500 border-yellow-400 text-white"
                  : "text-muted-foreground hover:text-yellow-500 border-border bg-background",
              )}
              title={isStarred ? "Unstar card" : "Star card"}
            >
              <Star
                className={cn(
                  "h-6 w-6 transition-all duration-300",
                  isStarred && "fill-current scale-110",
                  !isStarred && "scale-100",
                )}
              />
            </Button>

            <Button
              size="lg"
              onClick={handleNextCard}
              disabled={currentIndex === selectedSet.cards.length - 1}
              className="w-28 rounded-xl shadow-md bg-primary hover:bg-primary/90 font-bold"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --- Render: Sets List View ---
  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card/50 p-6 rounded-3xl border border-border/40 backdrop-blur-xl shadow-sm">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-foreground">
            Flashcards
          </h2>
          <p className="text-muted-foreground font-medium mt-1">
            Revisit concepts and master your material.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/50 dark:bg-black/20 p-2 rounded-2xl border">
          <div className="flex items-center gap-3 px-3">
            <Label
              htmlFor="fc_count"
              className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
            >
              Count
            </Label>
            <Input
              id="fc_count"
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 5)}
              className="w-16 h-9 text-sm font-bold border-none bg-secondary/50 text-center rounded-lg focus-visible:ring-0"
            />
          </div>
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="h-10 px-5 rounded-xl font-bold shadow-md"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                New Set
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-300 p-4 rounded-xl text-sm flex items-start gap-3"
        >
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Sets Grid */}
      <div className="flex-1 overflow-y-auto px-1 pb-10 custom-scrollbar">
        {flashcardSets.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-12 border-2 border-dashed rounded-3xl bg-secondary/10 border-muted/20">
            <div className="bg-background p-6 rounded-full shadow-lg mb-6 ring-4 ring-secondary/20">
              <Layers className="h-10 w-10 text-primary" />
            </div>
            <h3 className="font-extrabold text-2xl text-foreground mb-3">
              Your Library is Empty
            </h3>
            <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
              Generate a custom flashcard set from your document to start your
              learning journey.
            </p>
            <Button
              onClick={handleGenerate}
              disabled={loading}
              size="lg"
              className="rounded-xl px-8 font-bold text-base shadow-xl hover:translate-y-[-2px] transition-all"
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Play className="mr-2 h-5 w-5 fill-current" />
              )}
              Generate First Set
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {flashcardSets.map((set, i) => {
              const reviewedCount =
                set.cards?.filter((c) => c.reviewCount > 0).length || 0;
              const progressPercent = set.cards?.length
                ? Math.round((reviewedCount / set.cards.length) * 100)
                : 0;

              return (
                <motion.div
                  key={set._id || i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card
                    className="group relative cursor-pointer overflow-visible hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1.5 border-border/50 bg-background/50 hover:border-primary/30 rounded-3xl"
                    onClick={() => handleSelectSet(set)}
                  >
                    <CardContent className="p-6">
                      {/* Header: Icon, Date */}
                      <div className="flex justify-between items-start mb-6">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center text-primary shadow-sm border border-primary/10 group-hover:scale-110 transition-transform duration-300">
                          <BookOpen className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 bg-secondary/50 px-2 py-1 rounded-full">
                            <Calendar className="h-3 w-3" />
                            {formatDate(set.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Title Area */}
                      <div className="mb-6">
                        <h3 className="font-bold text-xl leading-tight mb-2 line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                          {set.title || "Untitled Flashcard Set"}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                          <Layers className="h-4 w-4" />
                          {set.cards?.length || 0} Cards
                        </div>
                      </div>

                      {/* Footer / Action */}
                      <div className="flex items-center justify-between mt-2 pt-4 border-t border-border/40">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-500",
                                progressPercent === 100
                                  ? "bg-green-500"
                                  : "bg-primary",
                              )}
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-muted-foreground">
                            {progressPercent}%
                          </span>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSet(set._id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Play Overlay Icon (Subtle) */}
                      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-10 scale-90 group-hover:scale-100 transition-all duration-300">
                        <Play className="h-16 w-16 text-primary/5 fill-current" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
