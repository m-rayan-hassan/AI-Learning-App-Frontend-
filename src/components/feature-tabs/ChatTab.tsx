"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowRight, Bot, User } from "lucide-react";
import { aiServices } from "@/services/aiServices";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "react-hot-toast";

export function ChatTab({ documentId }: { documentId: string }) {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [],
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
          localStorage.setItem(`chat_${documentId}`, JSON.stringify(history.messages));
        }
      } catch (e) {
        console.error("Failed to load history:", e);
      }
    };
    loadHistory();
  }, [documentId]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    // Optimistically add user message
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
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
    } catch (err) {
      toast.error("Failed to get response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent text-foreground">
      <div
        className="flex-1 p-4 pb-6 overflow-y-auto custom-scrollbar"
        ref={scrollRef}
      >
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
                className={`flex gap-3 items-start ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 mt-1">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                
                <div
                  className={`max-w-[85%] rounded-2xl px-6 py-4 text-base leading-loose shadow-sm ${
                    isUser
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-card text-card-foreground border border-border rounded-tl-sm"
                  }`}
                >
                  {m.role !== "user" ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      className="prose max-w-none text-[15px] markdown-chat space-y-4 text-card-foreground"
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
                            <code
                              className="bg-muted rounded px-1.5 py-0.5 text-[14px] font-mono break-words text-primary"
                              {...props}
                            >
                              {children}
                            </code>
                          );
                        },
                        // Tables
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
                      {m.content}
                    </ReactMarkdown>
                  ) : (
                    <div className="whitespace-pre-wrap">{m.content}</div>
                  )}
                </div>

                {isUser && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-secondary-foreground mt-1 border border-border">
                    JD
                  </div>
                )}
              </div>
            );
          })}
          
          {loading && (
            <div className="flex gap-3 justify-start items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 mt-1">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-5 py-3.5 flex items-center shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="ml-2 pl-1 text-sm text-muted-foreground">Thinking...</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 bg-transparent mt-2">
        <form onSubmit={handleSend} className="relative flex items-center">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a follow-up question..."
            disabled={loading}
            className="w-full bg-background border-border text-foreground rounded-full pl-6 pr-14 py-6 focus-visible:ring-1 focus-visible:ring-primary shadow-sm placeholder:text-muted-foreground text-[15px]"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={loading || !input.trim()}
            className="absolute right-2 rounded-full w-9 h-9 bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-md disabled:bg-primary/50 disabled:text-primary-foreground/50"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
