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
  AlertCircle,
} from "lucide-react";
import { aiServices } from "@/services/aiServices";
import quizService from "@/services/quizServices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";

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
  const [error, setError] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const loadQuizzes = async () => {
    try {
      setError("");
      const res = await quizService.getQuizziesForDocument(documentId);
      setQuizzes(res?.quizzes || res || []);
    } catch (err: any) {
      console.error(err);
      const errorMsg = err?.error || err?.message || "Failed to load quizzes";
      setError(errorMsg);
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, [documentId]);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await aiServices.generateQuiz(documentId, {
        difficulty: "Medium",
        count,
      });
      if (res) {
        setQuizzes([...quizzes, res]);
        setActiveQuiz(res);
        setCurrentQuestionIndex(0);
      }
      await loadQuizzes();
    } catch (err: any) {
      console.error(err);
      const errorMsg = err?.error || err?.message || "Failed to generate quiz";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectQuiz = async (quiz: any) => {
    // Check if quiz is already completed
    if (quiz.completedAt) {
      setError("This quiz has already been completed. You cannot retake it.");
      return;
    }

    setActiveQuiz(quiz);
    setAnswers({});
    setSubmitted(false);
    setQuizResults(null);
    setError("");
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
    setError("");

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
      await loadQuizzes();
    } catch (err: any) {
      console.error(err);
      const errorMsg = err?.error || err?.message || "Failed to submit quiz";
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;

    setDeleting(true);
    setError("");
    try {
      await quizService.deleteQuiz(quizId);
      await loadQuizzes();
      setActiveQuiz(null);
      setAnswers({});
      setSubmitted(false);
      setQuizResults(null);
      setCurrentQuestionIndex(0);
    } catch (err: any) {
      console.error(err);
      const errorMsg = err?.error || err?.message || "Failed to delete quiz";
      setError(errorMsg);
    } finally {
      setDeleting(false);
    }
  };

  const handleBackToList = () => {
    setActiveQuiz(null);
    setAnswers({});
    setSubmitted(false);
    setQuizResults(null);
    setError("");
    setCurrentQuestionIndex(0);
  };

  // Show Results View
  if (submitted && quizResults) {
    return (
      <div className="flex flex-col h-[600px]">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-background z-10">
          <Button variant="ghost" onClick={handleBackToList} size="sm">
            Back to List
          </Button>
          <h3 className="font-bold text-lg">Quiz Results</h3>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteQuiz(activeQuiz._id)}
            disabled={deleting}
          >
            {deleting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Delete
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-4 space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-6 rounded-lg sticky top-0">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">
                {quizResults.quiz.score}%
              </h2>
              <p className="text-lg font-semibold">
                {quizResults.results.filter((r) => r.isCorrect).length} /{" "}
                {quizResults.quiz.totalQuestions} Correct
              </p>
            </div>
          </div>

          {quizResults.results.map((result, idx) => (
            <Card
              key={idx}
              className={cn(
                result.isCorrect
                  ? "border-green-200 bg-green-50 dark:bg-green-950"
                  : "border-red-200 bg-red-50 dark:bg-red-950",
              )}
            >
              <CardHeader>
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <span>
                    {idx + 1}. {result.question}
                  </span>
                  {result.isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-2">Your Answer:</p>
                  <div
                    className={cn(
                      "p-2 rounded border",
                      result.isCorrect
                        ? "border-green-300 bg-white"
                        : "border-red-300 bg-white",
                    )}
                  >
                    {result.selectedAnswer || "Not answered"}
                  </div>
                </div>

                {!result.isCorrect && (
                  <div>
                    <p className="text-sm font-medium mb-2">Correct Answer:</p>
                    <div className="p-2 rounded border border-green-300 bg-white">
                      {result.correctAnswer}
                    </div>
                  </div>
                )}

                {result.explaination && (
                  <div>
                    <p className="text-sm font-medium mb-2">Explanation:</p>
                    <p className="text-sm text-muted-foreground bg-white p-2 rounded border">
                      {result.explaination}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {result.options.map((option, optIdx) => (
                    <div
                      key={optIdx}
                      className={cn(
                        "p-2 rounded border",
                        result.correctAnswer === option
                          ? "border-green-500 bg-green-100"
                          : result.selectedAnswer === option
                            ? "border-red-500 bg-red-100"
                            : "border-gray-200",
                      )}
                    >
                      {option}
                    </div>
                  ))}
                </div>
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
      <div className="flex flex-col h-[600px]">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-background z-10">
          <Button variant="ghost" onClick={handleBackToList} size="sm">
            Back to List
          </Button>
          <h3 className="font-bold text-lg">{activeQuiz.title || "Quiz"}</h3>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteQuiz(activeQuiz._id)}
            disabled={deleting}
          >
            {deleting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Delete
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 m-4 rounded-md text-sm flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

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

        {/* Single Question (No Scroll) */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
          {currentQuestion && (
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-lg">
                  {currentQuestion.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3">
                  {currentQuestion.options.map(
                    (opt: string, optIdx: number) => (
                      <div
                        key={optIdx}
                        onClick={() => handleAnswerSelect(opt)}
                        className={cn(
                          "flex items-center space-x-2 rounded-md border p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                          answers[currentQuestionIndex.toString()] === opt
                            ? "border-primary bg-primary/5 border-2"
                            : "",
                        )}
                      >
                        <div
                          className={cn(
                            "h-5 w-5 rounded-full border-2 border-primary flex items-center justify-center flex-shrink-0",
                            answers[currentQuestionIndex.toString()] === opt
                              ? "bg-primary"
                              : "",
                          )}
                        >
                          {answers[currentQuestionIndex.toString()] === opt && (
                            <div className="h-2 w-2 rounded-full bg-white" />
                          )}
                        </div>
                        <span className="text-base">{opt}</span>
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
    <div className="space-y-4 h-[600px] flex flex-col">
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

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm flex items-start gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-2 overflow-y-auto flex-1">
        {quizzes.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            No quizzes found. Generate one!
          </div>
        ) : (
          quizzes.map((quiz, i) => (
            <Card
              key={i}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <CardContent className="p-4 flex justify-between items-center">
                <div className="flex-1" onClick={() => handleSelectQuiz(quiz)}>
                  <div className="font-medium">
                    {quiz.title || `Quiz ${i + 1}`}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {quiz.questions?.length} Questions
                    {quiz.completedAt && (
                      <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        ✓ Completed • Score: {quiz.score}%
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteQuiz(quiz._id)}
                  disabled={deleting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
