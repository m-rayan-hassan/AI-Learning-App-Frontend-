"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, FileText, Sparkles } from "lucide-react";
import documentServices from "@/services/documentServices";
import { aiServices } from "@/services/aiServices";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
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

  const handleAction = async () => {
    setLoading(true);
    try {
      if (summary) {
        // Refresh from DB
        const doc = await documentServices.getDocumentById(documentId);
        if (doc.summary) {
          setSummary(doc.summary);
          localStorage.setItem(`summary_${documentId}`, doc.summary);
          toast.success("Summary refreshed successfully");
        }
      } else {
        // Generate via API
        const toastId = toast.loading("Generating summary...");
        try {
          const generatedSummary = await aiServices.generateSummary(documentId);
          setSummary(generatedSummary.summary);
          localStorage.setItem(`summary_${documentId}`, generatedSummary.summary);
          toast.success("Summary generated!", { id: toastId });
        } catch (genErr: any) {
          toast.error(genErr.message || "Failed to generate summary", { id: toastId });
          throw genErr;
        }
      }
    } catch (err: any) {
      console.error("Error performing action on summary:", err);
      if (!err.message?.includes("Failed to generate")) {
        toast.error(err.message || "Failed to load summary");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 flex flex-col pt-2 bg-transparent text-foreground">
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground tracking-wide">Document Summary</h3>
        </div>
        <Button 
          onClick={handleAction} 
          disabled={loading} 
          size="sm"
          className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 shadow-sm transition-all rounded-md px-4 py-1.5 h-auto text-sm"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : summary ? (
            <RefreshCw className="mr-2 h-4 w-4 text-primary" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4 text-primary" />
          )}
          {summary ? "Refresh" : "Generate"}
        </Button>
      </div>
      
      <div className="flex-1 px-2 pb-6">
        {summary ? (
          <div className="prose max-w-none w-full markdown-summary text-foreground/90">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                // Bold text
                strong: ({ node, ...props }: any) => (
                  <strong className="font-semibold text-foreground" {...props} />
                ),
                // Unordered lists (bullets)
                ul: ({ node, ordered, index, ...props }: any) => (
                  <ul className="list-disc pl-6 space-y-2 my-6 text-foreground/80 marker:text-primary/70" {...props} />
                ),
                // Ordered lists
                ol: ({ node, ordered, index, ...props }: any) => (
                  <ol className="list-decimal pl-6 space-y-2 my-6 text-foreground/80 marker:text-primary/70" {...props} />
                ),
                // List items
                li: ({ node, ordered, index, ...props }: any) => (
                  <li className="leading-relaxed text-[15px]" {...props} />
                ),
                // Paragraphs
                p: ({ node, ...props }: any) => {
                  return <p className="mb-6 text-foreground/80 leading-relaxed text-[15px]" {...props} />;
                },
                // Headers
                h1: ({ node, ...props }: any) => (
                  <h1 className="text-xl font-bold text-foreground tracking-tight mt-6 mb-4 border-b border-border/50 pb-2 uppercase" {...props} />
                ),
                h2: ({ node, ...props }: any) => {
                  const title = String(props.children).toUpperCase();
                  if (title.includes("EXECUTIVE SUMMARY")) {
                    return (
                      <h2 className="text-lg font-bold text-primary tracking-tight mt-6 mb-3 uppercase">
                        {props.children}
                      </h2>
                    );
                  }
                  return (
                    <h2 className="text-lg font-bold text-primary tracking-tight mt-6 mb-3 flex items-center gap-2 uppercase">
                      {props.children}
                    </h2>
                  );
                },
                h3: ({ node, ...props }: any) => (
                  <h3 className="text-base font-semibold text-foreground/90 mt-5 mb-2" {...props} />
                ),
                h4: ({ node, ...props }: any) => (
                  <h4 className="text-sm font-medium text-foreground/80 mt-4 mb-2 uppercase" {...props} />
                ),
                // Tables
                table: ({ node, ordered, index, ...props }: any) => (
                  <div className="w-full overflow-hidden my-8 rounded-xl border border-border shadow-sm">
                    <table className="w-full text-sm text-left text-foreground/90 bg-card" {...props} />
                  </div>
                ),
                thead: ({ node, ordered, index, ...props }: any) => (
                  <thead className="text-sm text-muted-foreground uppercase bg-muted/50 font-semibold border-b border-border" {...props} />
                ),
                th: ({ node, isHeader, ordered, index, ...props }: any) => (
                  <th className="px-6 py-4 font-bold text-foreground" {...props} />
                ),
                td: ({ node, isHeader, ordered, index, ...props }: any) => (
                  <td className="px-6 py-4 border-t border-border/50" {...props} />
                ),
                // Blockquotes
                blockquote: ({ node, ordered, index, ...props }: any) => (
                  <blockquote
                    className="border-l-4 border-primary bg-primary/5 px-6 py-4 my-6 italic text-foreground/90 rounded-r-xl shadow-sm"
                    {...props}
                  />
                ),
                // Code blocks
                code: ({ node, inline, className, children, ...props }: any) => {
                  return inline ? (
                    <code className="bg-muted px-1.5 py-0.5 rounded-md text-primary font-mono text-sm" {...props}>
                      {children}
                    </code>
                  ) : (
                    <div className="my-6 rounded-xl overflow-hidden border border-border bg-muted/30">
                      <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed"><code className={className} {...props}>{children}</code></pre>
                    </div>
                  );
                },
              }}
            >
              {summary}
            </ReactMarkdown>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
           <div className="flex justify-center items-center h-[50vh] text-muted-foreground border border-dashed border-border rounded-xl m-2 bg-muted/20">
            No summary yet. Click generate to create one.
          </div>
        )}
      </div>
    </div>
  );
}

