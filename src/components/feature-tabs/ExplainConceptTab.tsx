"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Mic, Headphones, Lightbulb, PlayCircle, FileAudio, Send } from "lucide-react";
import { aiServices } from "@/services/aiServices";
import { toast } from "react-hot-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";


function ExplainConceptTab({ documentId }: { documentId: string }) {

  const [conceptState, setConceptState] = useState<{ loading: boolean; text: string | null; input: string }>({ loading: false, text: null, input: "" });

  const handleConcept = async (e?: React.FormEvent) => {
    if (e) e.preventDefault(); 
    if (!conceptState.input) return;

    setConceptState((prev) => ({ ...prev, loading: true }));
    const toastId = toast.loading("Explaining concept...");

    try {
      const res = await aiServices.explainConcept(documentId, conceptState.input);
      setConceptState((prev) => ({ 
          ...prev, 
          loading: false, 
          text: res.explaination || res.explanation 
      }));
      toast.success("Explanation generated!", { id: toastId });
    } catch (err: any) {
      console.error(err);
      setConceptState((prev) => ({ ...prev, loading: false }));
      toast.error(err.message || "Failed to explain concept", { id: toastId });
    }
  };

  return (
    <Card className="flex-1 flex flex-col min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-300 border-none shadow-none bg-transparent">
           <CardHeader className="px-1 pt-0 pb-4">
               <CardTitle className="text-lg font-bold flex items-center gap-2">
                   <Lightbulb className="w-5 h-5 text-primary" />
                   Explain Concept
               </CardTitle>
               <CardDescription>Ask the AI to explain specific topics found in the document.</CardDescription>
           </CardHeader>

          <CardContent className="flex-1 px-1 flex flex-col gap-4 overflow-y-auto">
            {/* Input Form */}
            <form onSubmit={handleConcept} className="flex gap-2 items-center p-1 shrink-0">
              <Input 
                placeholder="E.g., What is the main conclusion?" 
                value={conceptState.input} 
                onChange={(e) => setConceptState(prev => ({ ...prev, input: e.target.value }))}
                className="flex-1 min-w-0 shadow-sm focus-visible:ring-offset-1"
              />
              <Button type="submit" disabled={conceptState.loading || !conceptState.input} size="icon" className="shrink-0 shadow-sm">
                {conceptState.loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Lightbulb className="h-4 w-4" />}
              </Button>
            </form>

            {/* Results Area - FIX APPLIED HERE */}
            {conceptState.text ? (
              <Card className="bg-muted/30 border border-border/60 shadow-sm animate-in zoom-in-95 duration-200">
                <CardContent className="p-4 sm:p-5">
                   {/* 
                      Classes added for full text visibility:
                      1. prose / prose-sm: Formats markdown elements properly.
                      2. break-words: Forces long words to wrap.
                      3. w-full: Ensures it takes full width.
                   */}
                  <div className="prose prose-sm dark:prose-invert max-w-none w-full break-words">
                      <MarkdownRenderer content={conceptState.text} />
                  </div>
                </CardContent>
              </Card>
            ) : (
                 // Empty State
                 <div className="flex flex-col items-center justify-center flex-1 text-center opacity-40 mt-4 sm:mt-0 min-h-[120px] sm:min-h-[200px]">
                    <Lightbulb className="h-12 w-12 mb-3 text-muted-foreground" />
                    <p className="text-sm font-medium">Ask a question above</p>
                    <p className="text-xs text-muted-foreground mt-1">Get instant clarifications on any topic.</p>
                 </div>
            )}
          </CardContent>
        </Card>
  )
}

export default ExplainConceptTab;