"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, FileText, Sparkles } from "lucide-react";
import { aiServices } from "@/services/aiServices";
import documentServices from "@/services/documentServices";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
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
    <div className="space-y-6 h-full flex flex-col pt-2 bg-transparent text-foreground">
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground tracking-wide">Document Summary</h3>
        </div>
        <Button 
          onClick={handleGenerate} 
          disabled={loading} 
          size="sm"
          className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 shadow-sm transition-all rounded-md px-4 py-1.5 h-auto text-sm"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4 text-primary" />
          )}
          {summary ? "Regenerate" : "Generate"}
        </Button>
      </div>
      
      <div className="flex-1 px-2 rounded-md overflow-y-auto custom-scrollbar pb-6">
        {summary ? (
          <div className="prose max-w-none w-full markdown-summary text-foreground/90">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                // Bold text
                strong: ({ node, ...props }: any) => (
                  <span className="font-bold text-foreground" {...props} />
                ),
                // Unordered lists (bullets)
                ul: ({ node, ordered, index, ...props }: any) => (
                  <ul className="list-none space-y-3 my-4 ml-0" {...props} />
                ),
                // Ordered lists
                ol: ({ node, ordered, index, ...props }: any) => (
                  <ol className="list-decimal pl-5 space-y-3 my-4 text-foreground/90" {...props} />
                ),
                // List items
                li: ({ node, ordered, index, ...props }: any) => (
                  <li className="flex gap-3 text-foreground/90 leading-relaxed text-[15px] items-start" {...props}>
                    <span className="text-primary mt-1 flex-shrink-0 text-[10px] leading-relaxed">●</span>
                    <div>{props.children}</div>
                  </li>
                ),
                // Paragraphs
                p: ({ node, ...props }: any) => {
                  return <p className="mb-4 text-foreground/90 leading-relaxed text-[15px]" {...props} />;
                },
                // Headers
                h1: ({ node, ...props }: any) => (
                  <h1 className="text-xl font-bold text-foreground tracking-wide my-6 uppercase" {...props} />
                ),
                h2: ({ node, ...props }: any) => {
                  const title = String(props.children).toUpperCase();
                  if (title.includes("EXECUTIVE SUMMARY")) {
                    return (
                      <h2 className="text-sm font-bold text-primary tracking-widest my-4 uppercase mt-2">
                        {props.children}
                      </h2>
                    );
                  }
                  return (
                    <h2 className="text-xs font-bold text-foreground/80 tracking-widest my-5 uppercase mt-8 pt-2">
                      {props.children}
                    </h2>
                  );
                },
                h3: ({ node, ...props }: any) => (
                  <h3 className="text-base font-semibold text-foreground/90 my-4" {...props} />
                ),
                // Tables
                table: ({ node, ordered, index, ...props }: any) => (
                  <div className="w-full overflow-x-auto my-6 rounded-lg border border-border">
                    <table className="w-full text-sm text-left text-foreground/90 bg-transparent" {...props} />
                  </div>
                ),
                thead: ({ node, ordered, index, ...props }: any) => (
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50" {...props} />
                ),
                th: ({ node, isHeader, ordered, index, ...props }: any) => (
                  <th className="px-6 py-4 font-bold text-foreground border-b border-border" {...props} />
                ),
                td: ({ node, isHeader, ordered, index, ...props }: any) => (
                  <td className="px-6 py-4 border-t border-border" {...props} />
                ),
                // Blockquotes
                blockquote: ({ node, ordered, index, ...props }: any) => (
                  <blockquote
                    className="border-l-4 border-primary/50 bg-primary/5 pl-6 py-3 my-6 italic text-foreground/80 rounded-r-lg"
                    {...props}
                  />
                ),
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

