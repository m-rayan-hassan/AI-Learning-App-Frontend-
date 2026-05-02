import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";
import { aiServices } from "@/services/aiServices";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import React from "react";

// Memoize the markdown component so it doesn't re-render on every keystroke
const MemoizedMarkdown = React.memo(({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      className="prose max-w-none text-[15px] markdown-chat space-y-4 text-card-foreground leading-relaxed"
      components={{
        strong: ({ node, ...props }: any) => (
          <span className="font-bold text-foreground" {...props} />
        ),
        ul: ({ node, ordered, index, ...props }: any) => (
          <ul className="list-disc pl-5 my-4 space-y-2 text-foreground/90" {...props} />
        ),
        ol: ({ node, ordered, index, ...props }: any) => (
          <ol className="list-decimal pl-5 my-4 space-y-2 text-foreground/90" {...props} />
        ),
        li: ({ node, ordered, index, ...props }: any) => (
          <li className="mb-2 leading-relaxed" {...props} />
        ),
        p: ({ node, ...props }: any) => (
          <p className="mb-4 last:mb-0 leading-loose text-foreground/90" {...props} />
        ),
        code: ({ node, inline, className, children, ...props }: any) => {
          return (
            <code className="bg-muted rounded px-1.5 py-0.5 text-[14px] font-mono break-words text-primary" {...props}>
              {children}
            </code>
          );
        },
        table: ({ node, ordered, index, ...props }: any) => (
          <div className="w-full overflow-x-auto my-6 rounded-lg border border-border">
            <table className="w-full text-[15px] text-left text-foreground/90 bg-transparent" {...props} />
          </div>
        ),
        thead: ({ node, ordered, index, ...props }: any) => (
          <thead className="text-[13px] text-muted-foreground uppercase bg-muted/50" {...props} />
        ),
        th: ({ node, isHeader, ordered, index, ...props }: any) => (
          <th className="px-6 py-4 font-bold text-foreground border-b border-border" {...props} />
        ),
        td: ({ node, isHeader, ordered, index, ...props }: any) => (
          <td className="px-6 py-4 border-t border-border" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
});

MemoizedMarkdown.displayName = "MemoizedMarkdown";

export function ChatTab({ documentId }: { documentId: string }) {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [],
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load history
  useEffect(() => {
    const loadHistory = async () => {
      try {
        // 1. Try LocalStorage first
        const cached = localStorage.getItem(`chat_${documentId}`);
        if (cached) {
          setMessages(JSON.parse(cached));
        }

        const history = await aiServices.getChatHistory(documentId);
        if (history?.messages) {
          setMessages(history.messages);
          localStorage.setItem(
            `chat_${documentId}`,
            JSON.stringify(history.messages),
          );
        }
      } catch (e) {
        console.error("Failed to load history:", e);
      }
    };
    loadHistory();
  }, [documentId]);

  // Auto-scroll logic (scroll window to bottom)
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth"
    });
    if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Robust auto-scroll observer for the inner content wrapper
  useEffect(() => {
    if (!scrollRef.current) return;
    const contentNode = scrollRef.current.firstElementChild;
    if (!contentNode) return;

    let timeoutId: NodeJS.Timeout;
    const observer = new ResizeObserver(() => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(scrollToBottom, 50);
    });

    observer.observe(contentNode);
    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e as unknown as React.FormEvent);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    // Optimistically add user message
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setLoading(true);

    try {
      const response = await aiServices.chat(documentId, userMessage);

      const aiContent =
        response?.answer ||
        response?.message ||
        response?.response ||
        "No response.";

      setMessages((prev) => {
        const newMessages = [...prev, { role: "ai", content: aiContent }];
        localStorage.setItem(`chat_${documentId}`, JSON.stringify(newMessages));
        return newMessages;
      });
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to get response. Please try again.";
      toast.error(errorMsg);
      // Remove the optimistically added user message if the request failed
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full text-foreground relative pb-2" ref={scrollRef}>
      <div className="flex-1 p-4 pb-16">
        {messages.length === 0 && (
          <div className="flex justify-center items-center h-full text-muted-foreground">
            Ask a question about your document!
          </div>
        )}
        
        <div className="space-y-6">
          {messages.map((m, i) => {
            const isUser = m.role === "user";
            return (
              <div
                key={i}
                className={`flex gap-3 items-start min-w-0 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`min-w-0 max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm overflow-hidden wrap-break-word ${
                    isUser
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-card text-card-foreground border border-border rounded-tl-sm"
                  }`}
                >
                  {m.role !== "user" ? (
                    <MemoizedMarkdown content={m.content} />
                  ) : (
                    <div className="whitespace-pre-wrap">{m.content}</div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 justify-start items-start">
              <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-5 py-3.5 flex items-center shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="ml-2 pl-1 text-sm text-muted-foreground">
                  Thinking...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Input Area with Gradient Fade */}
      <div className="sticky bottom-0 w-full z-10 pt-8 pb-4 md:pb-6 px-4 bg-gradient-to-t from-background via-background to-transparent mt-auto">
        <div className="max-w-3xl mx-auto relative">
          <form
            onSubmit={handleSend}
            className="flex items-end gap-2 rounded-2xl border border-border/80 bg-card shadow-sm hover:shadow-md px-3 py-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/60 transition-all duration-200"
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask a follow-up question..."
              disabled={loading}
              rows={1}
              className="flex-1 border-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:outline-none placeholder:text-muted-foreground text-[15px] py-2 px-2 resize-none min-h-[40px] max-h-[150px] scrollbar-thin overflow-y-auto"
            />
            <Button
              type="submit"
              size="icon"
              disabled={loading || !input.trim()}
              className="shrink-0 rounded-xl w-10 h-10 bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-sm disabled:opacity-40 mb-0.5"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
          <div className="text-center mt-2 hidden sm:block">
            <span className="text-[11px] text-muted-foreground font-medium opacity-70">
              Cognivio AI can make mistakes. Verify important information.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
