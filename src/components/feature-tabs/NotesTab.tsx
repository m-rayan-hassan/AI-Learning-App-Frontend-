"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, FileText, NotebookText, Sparkles } from "lucide-react";
import documentServices from "@/services/documentServices";
import { aiServices } from "@/services/aiServices";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { toast } from "react-hot-toast";
import mermaid from "mermaid";
import { useRef } from "react";

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  suppressErrorRendering: true,
});

const Mermaid = ({ chart }: { chart: string }) => {
  const [svg, setSvg] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    const renderChart = async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg: renderedSvg } = await mermaid.render(id, chart);
        if (isMounted) setSvg(renderedSvg);
      } catch (err) {
        if (isMounted) setSvg(`<div class="text-destructive p-4 border border-destructive/50 rounded-lg bg-destructive/10 text-sm font-mono whitespace-pre-wrap overflow-x-auto">Failed to render diagram. Raw code:\n\n${chart.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>`);
      }
    };
    if (chart) {
      renderChart();
    }
    return () => { isMounted = false; };
  }, [chart]);

  return (
    <div 
      className="mermaid-container w-full overflow-x-auto flex justify-center my-8 p-6 bg-card border border-border rounded-xl shadow-sm"
      dangerouslySetInnerHTML={{ __html: svg }} 
      ref={containerRef}
    />
  );
};

export function NotesTab({ documentId }: { documentId: string }) {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch document on mount to check if notes exists
  useEffect(() => {
    const loadNotes = async () => {
      try {
        setLoading(true);

        // 1. Try LocalStorage first
        const cached = localStorage.getItem(`notes_${documentId}`);
        if (cached) {
          setNotes(cached);
          setLoading(false);
          return;
        }

        // 2. Fetch from DB
        const doc = await documentServices.getDocumentById(documentId);
        if (doc.notes) {
          setNotes(doc.notes);
          localStorage.setItem(`notes_${documentId}`, doc.notes);
        }
      } catch (err: any) {
        console.error("Error loading notes:", err);
        toast.error(err.message || "Failed to load notes");
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, [documentId]);

  const handleAction = async () => {
    setLoading(true);
    try {
      if (notes) {
        // Refresh from DB
        const doc = await documentServices.getDocumentById(documentId);
        if (doc.notes) {
          setNotes(doc.notes);
          localStorage.setItem(`notes_${documentId}`, doc.notes);
          toast.success("Notes refreshed successfully");
        }
      } else {
        // Generate via API
        const toastId = toast.loading("Generating notes...");
        try {
          const generatedNotes = await aiServices.generateNotes(documentId);
          setNotes(generatedNotes);
          localStorage.setItem(`notes_${documentId}`, generatedNotes);
          toast.success("Notes generated!", { id: toastId });
        } catch (genErr: any) {
          toast.error(genErr.message || "Failed to generate notes", { id: toastId });
          throw genErr;
        }
      }
    } catch (err: any) {
      console.error("Error performing action on notes:", err);
      // Only show error if we didn't just throw from generate
      if (!err.message?.includes("Failed to generate")) {
        toast.error(err.message || "Failed to load notes");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 flex flex-col pt-2 bg-transparent text-foreground">
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-3">
          <NotebookText className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground tracking-wide">Document Notes</h3>
        </div>
        <Button 
          onClick={handleAction} 
          disabled={loading} 
          size="sm"
          className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 shadow-sm transition-all rounded-md px-4 py-1.5 h-auto text-sm"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : notes ? (
            <RefreshCw className="mr-2 h-4 w-4 text-primary" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4 text-primary" />
          )}
          {notes ? "Refresh" : "Generate"}
        </Button>
      </div>
      
      <div className="flex-1 px-2 pb-6">
        {notes ? (
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
                  <h1 className="text-2xl font-bold text-foreground tracking-tight mt-8 mb-6 border-b border-border/50 pb-3" {...props} />
                ),
                h2: ({ node, ...props }: any) => (
                  <h2 className="text-xl font-bold text-primary tracking-tight mt-8 mb-4 flex items-center gap-2" {...props} />
                ),
                h3: ({ node, ...props }: any) => (
                  <h3 className="text-lg font-semibold text-foreground/90 mt-6 mb-3" {...props} />
                ),
                h4: ({ node, ...props }: any) => (
                  <h4 className="text-base font-medium text-foreground/80 mt-4 mb-2" {...props} />
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
                // Code blocks (e.g. mermaid placeholder or other)
                code: ({ node, inline, className, children, ...props }: any) => {
                  const match = /language-(\w+)/.exec(className || "");
                  if (!inline && match && match[1] === "mermaid") {
                    return <Mermaid chart={String(children).replace(/\n$/, "")} />;
                  }
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
              {notes}
            </ReactMarkdown>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
           <div className="flex justify-center items-center h-[50vh] text-muted-foreground border border-dashed border-border rounded-xl m-2 bg-muted/20">
            No notes yet. Click generate to create some.
          </div>
        )}
      </div>
    </div>
  );
}
