"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <div className={className}>
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
          // List items
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
        {content}
      </ReactMarkdown>
    </div>
  );
}
