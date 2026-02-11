"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { aiServices } from "@/services/aiServices";
import documentServices from "@/services/documentServices";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "react-hot-toast";

export function SummaryTab({ documentId }: { documentId: string }) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch document on mount to check if summary exists
  useEffect(() => {
    const loadSummary = async () => {
      try {
        setLoading(true);

        // 1. Try LocalStorage first
        const cached = localStorage.getItem(`summary_${documentId}`);
        if (cached) {
          setSummary(cached);
          setLoading(false);
          return;
        }

        // 2. Fetch from DB
        const doc = await documentServices.getDocumentById(documentId);
        if (doc.summary) {
          setSummary(doc.summary);
          localStorage.setItem(`summary_${documentId}`, doc.summary);
        }
      } catch (err: any) {
        console.error("Error loading summary:", err);
        toast.error(err.message || "Failed to load summary");
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, [documentId]);

  const handleGenerate = async () => {
    setLoading(true);
    const toastId = toast.loading("Generating summary...");
    try {
      const res = await aiServices.generateSummary(documentId);
      setSummary(res.summary);
      localStorage.setItem(`summary_${documentId}`, res.summary);
      toast.success("Summary generated!", { id: toastId });
    } catch (err: any) {
      console.error("Error generating summary:", err);
      toast.error(err.message || "Failed to generate summary", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Document Summary</h3>
        <Button onClick={handleGenerate} disabled={loading} size="sm">
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          {summary ? "Regenerate" : "Generate"} Summary
        </Button>
      </div>
      
      <div className="flex-1 p-4 border rounded-md bg-muted/20 overflow-y-auto">
        {summary ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Bold text
              strong: ({ node, ...props }: any) => (
                <span className="font-bold" {...props} />
              ),
              // Unordered lists (bullets)
              ul: ({ node, ordered, ...props }: any) => (
                <ul className="list-disc pl-4 my-2" {...props} />
              ),
              // Ordered lists (1. 2. 3.)
              ol: ({ node, ordered, ...props }: any) => (
                <ol className="list-decimal pl-4 my-2" {...props} />
              ),
              // List items - Destructure to remove invalid props (ordered, etc.)
              li: ({
                node,
                ordered,
                checked,
                index,
                siblingCount,
                ...props
              }: any) => <li className="mb-1" {...props} />,
              // Paragraphs
              p: ({ node, ...props }: any) => (
                <p className="mb-2 last:mb-0 leading-relaxed" {...props} />
              ),
              // Headers
              h1: ({ node, ...props }: any) => (
                <h1 className="text-xl font-bold my-2" {...props} />
              ),
              h2: ({ node, ...props }: any) => (
                <h2 className="text-lg font-bold my-2" {...props} />
              ),
              h3: ({ node, ...props }: any) => (
                <h3 className="font-bold my-2" {...props} />
              ),
              // Code blocks
              code: ({ node, inline, className, children, ...props }: any) => (
                <code
                  className="bg-black/10 dark:bg-white/10 rounded px-1 py-0.5 text-sm font-mono break-words"
                  {...props}
                >
                  {children}
                </code>
              ),
              // Blockquotes
              blockquote: ({ node, ...props }: any) => (
                <blockquote
                  className="border-l-4 border-primary/50 pl-4 italic my-2"
                  {...props}
                />
              ),
              // Links
              a: ({ node, ...props }: any) => (
                <a
                  className="text-primary underline underline-offset-4 hover:text-primary/80"
                  target="_blank"
                  rel="noreferrer"
                  {...props}
                />
              ),
            }}
          >
            {summary}
          </ReactMarkdown>
        ) : loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="flex justify-center items-center h-full text-muted-foreground">
            No summary yet. Click generate to create one.
          </div>
        )}
      </div>
    </div>
  );
}
