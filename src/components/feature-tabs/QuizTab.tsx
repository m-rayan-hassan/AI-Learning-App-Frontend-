"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  RefreshCw,
  CheckCircle,
  XCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Play,
  BarChart3,
  BookOpen,
  Calendar,
} from "lucide-react";
import { aiServices } from "@/services/aiServices";
import quizService from "@/services/quizServices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";
import { toast } from "react-hot-toast";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

interface QuizResult {
  questionIndex: number;
  question: string;
  options: string[];
  correctAnswer: string;
  selectedAnswer: string | null;
  isCorrect: boolean;
  explaination: string;
}

interface QuizData {
  quiz: {
    id: string;
    title: string;
    document: any;
    score: number;
    totalQuestions: number;
    completedAt: string;
  };
  results: QuizResult[];
}

export function QuizTab({ documentId }: { documentId: string }) {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizData | null>(null);
  const [count, setCount] = useState(5);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const loadQuizzes = async () => {
    try {
      // 1. Try LocalStorage first
      const cached = localStorage.getItem(`quizzes_${documentId}`);
      if (cached) {
        setQuizzes(JSON.parse(cached));
      }

      const res = await quizService.getQuizziesForDocument(documentId);
      const data = res?.quizzes || res || [];
      setQuizzes(data);
      localStorage.setItem(`quizzes_${documentId}`, JSON.stringify(data));
    } catch (err: any) {
      console.error(err);
      toast.error(err?.error || err?.message || "Failed to load quizzes");
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, [documentId]);

  const handleGenerate = async () => {
    setLoading(true);
    const toastId = toast.loading("Generating quiz...");
    try {
      const res = await aiServices.generateQuiz(documentId, {
        difficulty: "Medium",
        numQuestions: count,
      });
      if (res) {
        setQuizzes([...quizzes, res]);
        setActiveQuiz(res);
        setCurrentQuestionIndex(0);
      }
      await loadQuizzes();
      toast.success("Quiz generated successfully!", { id: toastId });
    } catch (err: any) {
      console.error(err);
      const errorMsg = err?.error || err?.message || "Failed to generate quiz";
      toast.error(errorMsg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectQuiz = async (quiz: any) => {
    // Check if quiz is already completed
    if (quiz.completedAt) {
      toast.error("This quiz has already been completed. You cannot retake it.");
      return;
    }

    setActiveQuiz(quiz);
    setAnswers({});
    setSubmitted(false);
    setQuizResults(null);
    setCurrentQuestionIndex(0);
  };

  const handleAnswerSelect = (selectedAnswer: string) => {
    const newAnswers = {
      ...answers,
      [currentQuestionIndex.toString()]: selectedAnswer,
    };
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (activeQuiz?.questions?.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const areAllAnswered = () => {
    if (!activeQuiz) return false;
    return Object.keys(answers).length === activeQuiz.questions.length;
  };

  const handleSubmit = async () => {
    if (!activeQuiz || !areAllAnswered()) return;
    setSubmitting(true);
    const toastId = toast.loading("Submitting quiz...");

    try {
      const formattedAnswers = Object.entries(answers).map(
        ([questionIndex, selectedAnswer]) => ({
          questionIndex: parseInt(questionIndex),
          selectedAnswer,
        }),
      );

      await quizService.submitQuiz(activeQuiz._id, formattedAnswers);

      const results = await quizService.getQuizResults(activeQuiz._id);
      setQuizResults(results);
      setSubmitted(true);
      
      // Fetch fresh list and update cache
      const freshQuizzes = await quizService.getQuizziesForDocument(documentId);
      const data = freshQuizzes?.quizzes || freshQuizzes || [];
      setQuizzes(data);
      localStorage.setItem(`quizzes_${documentId}`, JSON.stringify(data));
      
      toast.success("Quiz submitted!", { id: toastId });
    } catch (err: any) {
      console.error(err);
      const errorMsg = err?.error || err?.message || "Failed to submit quiz";
      toast.error(errorMsg, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;

    setDeleting(true);
    const toastId = toast.loading("Deleting quiz...");
    try {
      await quizService.deleteQuiz(quizId);
      
      // Update cache
      setQuizzes((prev) => {
        const newQuizzes = prev.filter(q => q._id !== quizId);
        localStorage.setItem(`quizzes_${documentId}`, JSON.stringify(newQuizzes));
        return newQuizzes;
      });

      setActiveQuiz(null);
      setAnswers({});
      setSubmitted(false);
      setQuizResults(null);
      setCurrentQuestionIndex(0);
      toast.success("Quiz deleted", { id: toastId });
    } catch (err: any) {
      console.error(err);
      const errorMsg = err?.error || err?.message || "Failed to delete quiz";
      toast.error(errorMsg, { id: toastId });
    } finally {
      setDeleting(false);
    }
  };

  const handleBackToList = () => {
    setActiveQuiz(null);
    setAnswers({});
    setSubmitted(false);
    setQuizResults(null);
    setCurrentQuestionIndex(0);
  };

  // Show Results View
  if (submitted && quizResults) {
    return (
      <div className="flex flex-col h-full">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-background z-10">
          <Button variant="ghost" onClick={handleBackToList} size="sm">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to List
          </Button>
          <h3 className="font-bold text-lg">Quiz Results</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteQuiz(activeQuiz._id)}
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

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {/* Score Summary Card */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Trophy className="h-8 w-8 text-primary" />
                  <h2 className="text-4xl font-bold text-foreground">
                    {quizResults.quiz.score}%
                  </h2>
                </div>
                <p className="text-lg font-semibold text-foreground/90">
                  {quizResults.results.filter((r) => r.isCorrect).length} out of{" "}
                  {quizResults.quiz.totalQuestions} Correct
                </p>
                <p className="text-sm text-muted-foreground">
                  Completed on {new Date(quizResults.quiz.completedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Questions Results */}
          {quizResults.results.map((result, idx) => (
            <Card
              key={idx}
              className="overflow-hidden border-l-4"
              style={{
                borderLeftColor: result.isCorrect 
                  ? 'rgb(34, 197, 94)' // green-500
                  : 'hsl(var(--destructive))',
              }}
            >
              <CardContent className="p-0">
                {/* Question Header */}
                <div className="bg-muted/30 p-4 border-b border-border">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-muted-foreground mb-1">
                        Question {idx + 1}
                      </div>
                      <div className="font-semibold text-base leading-snug text-foreground">
                        <MarkdownRenderer content={result.question} />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-muted"
                      onClick={() => {/* Could collapse/expand if needed */}}
                    >
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>

                {/* Options Grid */}
                <div className="p-4 space-y-3">
                  {result.options.map((option, optIdx) => {
                    const isCorrect = result.correctAnswer === option;
                    const isUserAnswer = result.selectedAnswer === option;
                    
                    return (
                      <div
                        key={optIdx}
                        className={cn(
                          "relative p-3 rounded-lg border-2 transition-all",
                          isCorrect && "bg-green-500/10 border-green-500/30",
                          isUserAnswer && !isCorrect && "bg-destructive/10 border-destructive/30",
                          !isCorrect && !isUserAnswer && "bg-muted/30 border-transparent"
                        )}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className={cn(
                            "flex-1 text-sm",
                            isCorrect && "font-medium text-green-700 dark:text-green-400",
                            isUserAnswer && !isCorrect && "font-medium text-foreground",
                            !isCorrect && !isUserAnswer && "text-muted-foreground"
                          )}>
                            <MarkdownRenderer content={option} />
                          </div>
                          
                          {isCorrect && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-700 dark:text-green-400 border border-green-500/30">
                              <CheckCircle className="h-3 w-3" />
                              Correct
                            </span>
                          )}
                          
                          {isUserAnswer && !isCorrect && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-destructive/20 text-destructive dark:text-red-400 border border-destructive/30">
                              <XCircle className="h-3 w-3" />
                              Your Answer
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Section */}
                {result.explaination && (
                  <div className="px-4 pb-4">
                    <div className="bg-muted border border-border rounded-lg p-3">
                      <div className="flex gap-2">
                        <BookOpen className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-foreground mb-1">
                            EXPLANATION
                          </p>
                          <div className="text-sm text-foreground/80 leading-relaxed">
                            <MarkdownRenderer content={result.explaination} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Show Quiz Taking View
  if (activeQuiz && !submitted) {
    const currentQuestion = activeQuiz.questions[currentQuestionIndex];
    const isAnswered = answers[currentQuestionIndex.toString()] !== undefined;

    return (
      <div className="flex flex-col h-full">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-background z-10">
          <Button variant="ghost" onClick={handleBackToList} size="sm">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to List
          </Button>
          <h3 className="font-bold text-lg">{activeQuiz.title || "Quiz"}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteQuiz(activeQuiz._id)}
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

        {/* Progress Bar */}
        <div className="px-4 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Question {currentQuestionIndex + 1} of{" "}
              {activeQuiz.questions.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Object.keys(answers).length} / {activeQuiz.questions.length}{" "}
              answered
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{
                width: `${((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Single Question (Scrollable) */}
        <div className="flex-1 flex flex-col items-center justify-start p-4 overflow-y-auto">
          {currentQuestion && (
            <Card className="w-full max-w-3xl mt-2 animate-in fade-in slide-in-from-bottom-4 duration-300 border-none shadow-md bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <div className="text-lg md:text-xl font-semibold leading-relaxed">
                  <MarkdownRenderer content={currentQuestion.question} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                <div className="grid gap-3">
                  {currentQuestion.options.map(
                    (opt: string, optIdx: number) => (
                      <div
                        key={optIdx}
                        onClick={() => handleAnswerSelect(opt)}
                        className={cn(
                          "flex items-center space-x-3 rounded-xl border p-4 cursor-pointer transition-all duration-200",
                          "hover:bg-muted/60 hover:border-primary/30",
                          answers[currentQuestionIndex.toString()] === opt
                            ? "border-primary bg-primary/10 shadow-sm"
                            : "bg-background/50",
                        )}
                      >
                        <div
                          className={cn(
                            "h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                             answers[currentQuestionIndex.toString()] === opt
                              ? "border-primary bg-primary"
                              : "border-muted-foreground/30"
                          )}
                        >
                          {answers[currentQuestionIndex.toString()] === opt && (
                            <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                          )}
                        </div>
                        <div className="text-sm md:text-base leading-snug"><MarkdownRenderer content={opt} /></div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-2 p-4 border-t bg-background">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex-1"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentQuestionIndex === activeQuiz.questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={!areAllAnswered() || submitting}
              className="flex-1"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Quiz"
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              disabled={!isAnswered}
              className="flex-1"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Show Quiz List View
  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex flex-col gap-4 border-b pb-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Quizzes</h3>
          <Button onClick={handleGenerate} disabled={loading} size="sm">
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Generate Quiz
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="q_count" className="text-xs">
            Questions:
          </Label>
          <Input
            id="q_count"
            type="number"
            min={1}
            max={20}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 5)}
            className="w-20 h-8 text-xs"
          />
        </div>
      </div>

      <div className="overflow-y-auto flex-1">
        {quizzes.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            No quizzes found. Generate one!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
            {quizzes.map((quiz, i) => (
              <Card
                key={i}
                className="relative hover:shadow-lg transition-all duration-200 border-border/50"
              >
                <CardContent className="p-5 flex flex-col gap-4">
                  {/* Score Badge */}
                  <div className="flex items-start justify-between">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium",
                      quiz.completedAt
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                        : "bg-muted text-muted-foreground"
                    )}>
                      <Trophy className="h-4 w-4" />
                      <span>Score: {quiz.score || 0}%</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteQuiz(quiz._id);
                      }}
                      disabled={deleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Quiz Title */}
                  <div className="space-y-1">
                    <h4 className="font-bold text-lg leading-tight">
                      {quiz.title || `Quiz ${i + 1}`}
                    </h4>
                    {quiz.createdAt && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
                          CREATED {new Date(quiz.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          }).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Question Count */}
                  <div className="inline-flex items-center gap-2 bg-muted px-3 py-2 rounded-md w-fit">
                    <span className="font-semibold text-sm">
                      {quiz.questions?.length || 0} Questions
                    </span>
                  </div>

                  {/* Action Button */}
                  {quiz.completedAt ? (
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={async () => {
                        try {
                          const results = await quizService.getQuizResults(quiz._id);
                          setQuizResults(results);
                          setActiveQuiz(quiz);
                          setSubmitted(true);
                        } catch (err: any) {
                          console.error(err);
                          toast.error(err?.error || err?.message || "Failed to load results");
                        }
                      }}
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      View Results
                    </Button>
                  ) : (
                    <Button
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={() => handleSelectQuiz(quiz)}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Start Quiz
                    </Button>
                  )}


                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
