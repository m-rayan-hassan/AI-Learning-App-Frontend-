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
  Play,
  Layers,
  Calendar,
  BookOpen,
} from "lucide-react";
import { aiServices } from "@/services/aiServices";
import flashcardsServices from "@/services/flashcardsServices";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---

interface Flashcard {
  _id: string;
  question: string;
  answer: string;
  reviewCount: number;
  lastReviewed: string | null;
  isStared: boolean; // Matches your Backend Schema exactly
  difficulty?: "easy" | "medium" | "hard";
}

interface FlashcardSet {
  _id: string;
  title: string;
  cards: Flashcard[];
  createdAt: string;
}

// --- Component ---

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

  // --- Data Loading ---

  const loadFlashcards = async () => {
    try {
      setError("");

      // 1. Load from LocalStorage for instant render
      const cached = localStorage.getItem(`flashcards_${documentId}`);
      if (cached) {
        setFlashcardSets(JSON.parse(cached));
      }

      // 2. Fetch fresh data from Backend
      const res = await flashcardsServices.getFlashCardsforDocument(documentId);

      // Handle various response structures (res.data, res.flashcards, or raw array)
      const rawData = res?.data || res?.flashcards || res || [];

      // 3. Normalize Data
      // Ensure 'isStared' is boolean. This fixes issues where DB might return null/undefined
      const normalizedData = rawData.map((set: any) => ({
        ...set,
        cards: set.cards.map((c: any) => ({
          ...c,
          isStared: !!c.isStared, // Force boolean
        })),
      }));

      // 4. Update State & Cache
      setFlashcardSets(normalizedData);
      localStorage.setItem(
        `flashcards_${documentId}`,
        JSON.stringify(normalizedData),
      );
    } catch (err: any) {
      console.error("Load Error:", err);
      // Don't show error if we have cached data to show
      const cached = localStorage.getItem(`flashcards_${documentId}`);
      if (!cached) {
        setError(err?.error || err?.message || "Failed to load flashcards");
      }
    }
  };

  useEffect(() => {
    loadFlashcards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId]);

  // --- Actions ---

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      await aiServices.generateFlashCards(documentId, { count });
      await loadFlashcards(); // Reload to get the new set
    } catch (err: any) {
      console.error(err);
      setError(err?.error || err?.message || "Failed to generate flashcards");
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

  // --- THE FIXED STAR TOGGLE FUNCTION ---
  const handleToggleStar = async (cardId: string) => {
    if (!selectedSet) return;

    // 1. Identify specific card index
    const cardIndex = selectedSet.cards.findIndex((c) => c._id === cardId);
    if (cardIndex === -1) return;

    setReviewingCardId(cardId);

    const card = selectedSet.cards[cardIndex];
    const oldState = card.isStared;
    const newState = !oldState;

    // 2. Prepare Optimistic Updates
    const updatedCard = { ...card, isStared: newState };

    // Create new cards array
    const updatedCards = [...selectedSet.cards];
    updatedCards[cardIndex] = updatedCard;

    // Create new Set object
    const updatedSet = { ...selectedSet, cards: updatedCards };

    // 3. Update UI State Immediately (Optimistic)
    setSelectedSet(updatedSet);

    // 4. Update Global List & Local Storage Immediately
    // This ensures persistence when navigating away or refreshing
    setFlashcardSets((prevSets) => {
      const newSets = prevSets.map((s) =>
        s._id === selectedSet._id ? updatedSet : s,
      );
      localStorage.setItem(`flashcards_${documentId}`, JSON.stringify(newSets));
      return newSets;
    });

    try {
      // 5. Send Request to Backend
      // We do NOT wait for the response to update UI to avoid flickering
      await flashcardsServices.toggleStar(cardId);
    } catch (err: any) {
      console.error("Toggle star failed", err);
      setError("Failed to save star status. Reverting.");

      // 6. Revert on Error Only
      const revertedCard = { ...card, isStared: oldState };
      updatedCards[cardIndex] = revertedCard;
      const revertedSet = { ...selectedSet, cards: updatedCards };

      setSelectedSet(revertedSet);
      setFlashcardSets((prev) => {
        const newSets = prev.map((s) =>
          s._id === selectedSet._id ? revertedSet : s,
        );
        localStorage.setItem(
          `flashcards_${documentId}`,
          JSON.stringify(newSets),
        );
        return newSets;
      });
    } finally {
      setReviewingCardId(null);
    }
  };

  const handleReviewCard = async () => {
    if (!selectedSet || !selectedSet.cards[currentIndex]) return;

    const card = selectedSet.cards[currentIndex];

    // Optimistic Update for Review Count
    const updatedCards = selectedSet.cards.map((c) =>
      c._id === card._id
        ? {
            ...c,
            reviewCount: c.reviewCount + 1,
            lastReviewed: new Date().toISOString(),
          }
        : c,
    );

    const updatedSet = { ...selectedSet, cards: updatedCards };

    // Apply Optimistic Update
    setSelectedSet(updatedSet);
    setFlashcardSets((prev) => {
      const newSets = prev.map((s) =>
        s._id === updatedSet._id ? updatedSet : s,
      );
      localStorage.setItem(`flashcards_${documentId}`, JSON.stringify(newSets));
      return newSets;
    });

    try {
      // Send request
      await flashcardsServices.reviewFlashCard(card._id, currentIndex);
    } catch (err: any) {
      console.error("Review failed", err);
      // We generally don't revert review counts aggressively as it's less visible
    }
  };

  const handleFlipCard = async () => {
    const newFlipState = !isFlipped;
    setIsFlipped(newFlipState);

    // Only review when flipping TO the answer (back) side
    if (newFlipState === true && selectedSet?.cards[currentIndex]) {
      await handleReviewCard();
    }
  };

  const handleNextCard = () => {
    if (selectedSet && currentIndex < selectedSet.cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((prev) => prev + 1), 150);
    }
  };

  const handlePreviousCard = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((prev) => prev - 1), 150);
    }
  };

  const handleDeleteSet = async (setId: string) => {
    if (!confirm("Are you sure you want to delete this flashcard set?")) return;

    setDeleting(true);
    setError("");
    try {
      await flashcardsServices.deleteFlashCardSet(setId);

      setFlashcardSets((prev) => {
        const newSets = prev.filter((s) => s._id !== setId);
        localStorage.setItem(
          `flashcards_${documentId}`,
          JSON.stringify(newSets),
        );
        return newSets;
      });

      setSelectedSet(null);
    } catch (err: any) {
      console.error(err);
      setError(err?.error || err?.message || "Failed to delete set");
    } finally {
      setDeleting(false);
    }
  };

  // --- Render: Review View ---
  if (selectedSet && selectedSet.cards.length > 0) {
    const currentCard = selectedSet.cards[currentIndex];
    const isStarred = currentCard.isStared; // Using the fixed backend field

    return (
      <div className="flex flex-col h-full max-w-5xl mx-auto w-full">
        {/* Navigation Header */}
        <div className="flex items-center justify-between p-4 border-b mb-6">
          <Button variant="ghost" onClick={handleBackToList} size="sm">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to List
          </Button>

          <div className="text-center">
            <h3 className="font-bold text-lg">
              {selectedSet.title || "Flashcards"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {currentIndex + 1} of {selectedSet.cards.length} cards
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteSet(selectedSet._id)}
            disabled={deleting}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 mb-4 rounded-md text-sm flex items-center gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Card Area */}
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
                onClick={handleFlipCard}
              >
                <motion.div
                  className="w-full h-full relative preserve-3d"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                    mass: 0.8,
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* FRONT */}
                  <div className="absolute inset-0 backface-hidden">
                    <Card className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-background to-secondary/20 border-2 hover:border-primary/20 transition-colors shadow-lg hover:shadow-xl rounded-3xl">
                      <div className="absolute top-6 left-6 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        Question
                      </div>
                      <div className="overflow-y-auto max-h-full w-full scrollbar-thin">
                        <h2 className="text-xl md:text-3xl font-bold leading-relaxed text-foreground">
                          {currentCard.question}
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
                    <Card className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 shadow-lg rounded-3xl">
                      <div className="absolute top-6 left-6 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        Answer
                      </div>
                      <div className="overflow-y-auto max-h-full w-full scrollbar-thin">
                        <p className="text-lg md:text-2xl font-medium leading-relaxed text-foreground/90">
                          {currentCard.answer}
                        </p>
                      </div>
                    </Card>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-8 space-y-6">
          {/* Progress Bar */}
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

          {/* Action Buttons */}
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
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex flex-col gap-4 border-b pb-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Flashcards</h3>
          <Button onClick={handleGenerate} disabled={loading} size="sm">
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Generate Flashcards
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="fc_count" className="text-xs">
            Cards:
          </Label>
          <Input
            id="fc_count"
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 5)}
            className="w-20 h-8 text-xs"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm flex items-start gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="overflow-y-auto flex-1">
        {flashcardSets.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            No flashcard sets found. Generate one!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
            {flashcardSets.map((set) => (
              <Card
                key={set._id}
                className="relative hover:shadow-lg transition-all duration-200 border-border/50 cursor-pointer group"
                onClick={() => handleSelectSet(set)}
              >
                <CardContent className="p-5 flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSet(set._id);
                        }}
                        disabled={deleting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {set.createdAt && (
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(set.createdAt)
                              .toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                              .toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-lg leading-tight">
                      Flashcard Set
                    </h4>
                  </div>

                  <div className="inline-flex items-center gap-2 bg-muted px-3 py-2 rounded-md w-fit">
                    <Layers className="h-4 w-4" />
                    <span className="font-semibold text-sm">
                      {set.cards?.length || 0} Cards
                    </span>
                  </div>

                  {set.title && (
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {set.title}
                    </div>
                  )}

                  <Button className="w-full bg-primary hover:bg-primary/90 mt-2">
                    <Play className="mr-2 h-4 w-4" />
                    Review Cards
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
