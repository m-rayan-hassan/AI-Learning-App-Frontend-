"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send } from "lucide-react";
import { aiServices } from "@/services/aiServices";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "react-hot-toast";

export function ChatTab({ documentId }: { documentId: string }) {
  // Allow flexible roles (e.g., 'assistant', 'model', 'ai')
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
      // Optional: keep the user message but remove the loading state is handled in finally
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex-1 p-4 bg-muted/20"
        ref={scrollRef}
        style={{ overflowY: "auto" }}
      >
        {messages.length === 0 && (
          <div className="flex justify-center items-center h-full text-muted-foreground">
            Ask a question about your document!
          </div>
        )}
        <div className="space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {/* 
                   FIX 2: Changed condition from (m.role === 'ai') to (m.role !== 'user') 
                   This catches 'assistant', 'model', or 'ai' roles from the database.
                */}
                {m.role !== "user" ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // Bold text
                      strong: ({ node, ...props }: any) => (
                        <span className="font-bold" {...props} />
                      ),

                      // Unordered lists
                      ul: ({ node, ...props }: any) => (
                        <ul className="list-disc pl-4 my-2" />
                      ),

                      // Ordered lists
                      ol: ({ node, ...props }: any) => (
                        <ol className="list-decimal pl-4 my-2" />
                      ),

                      // FIX 1: List items - Removed 'ordered', 'index', etc. to fix console error
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
                        <p
                          className="mb-2 last:mb-0 leading-relaxed"
                          {...props}
                        />
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
                      code: ({
                        node,
                        inline,
                        className,
                        children,
                        ...props
                      }: any) => {
                        return (
                          <code
                            className="bg-black/10 dark:bg-white/10 rounded px-1 py-0.5 text-sm font-mono break-words"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },

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
                    {m.content}
                  </ReactMarkdown>
                ) : (
                  <div className="whitespace-pre-wrap">{m.content}</div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="p-4 border-t">
        <form onSubmit={handleSend} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
          />
          <Button type="submit" size="icon" disabled={loading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
