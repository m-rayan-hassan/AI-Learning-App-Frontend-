"use client";

import React, { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  FileText,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronLeft,
  ChevronRight,
  Eye,
  Sparkles,
  MessageCircle,
  Layers,
  Trophy,
  Zap,
  Mic,
  Video,
  Lightbulb,
  NotebookText
} from "lucide-react";
import documentServices from "@/services/documentServices";
import { Button } from "@/components/ui/button";
import { PDFViewer } from "@/components/PDFViewer";
import { DocumentProvider } from "./DocumentContext";

const TABS = [
  { label: "Preview", icon: Eye, path: "preview" },
  { label: "Notes", icon: NotebookText, path: "" }, // Default path
  { label: "Summary", icon: Sparkles, path: "summary" },
  { label: "Chat", icon: MessageCircle, path: "chat" },
  { label: "Flashcards", icon: Layers, path: "flashcards" },
  { label: "Quiz", icon: Trophy, path: "quiz" },
  { label: "Voice Overview", icon: Mic, path: "voice-overview" },
  { label: "Concept", icon: Lightbulb, path: "concept" },
  { label: "Voice Chat", icon: Mic, path: "voice-chat" },
  { label: "Video Overview", icon: Video, path: "video-overview" },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const id = params.id as string;
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // showSidePreview controls whether a separate left-side preview pane is visible
  const [showSidePreview, setShowSidePreview] = useState(false);

  // Resizing logic for side preview
  const [sidebarWidth, setSidebarWidth] = useState(40); // percentage
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate width based on window innerWidth
      const newWidth = (e.clientX / window.innerWidth) * 100;
      // Clamp between 20% and 70%
      if (newWidth > 20 && newWidth < 70) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  // Scrolling logic
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      // use Math.ceil to prevent sub-pixel rounding errors
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 1);
    }
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    // Initial check
    checkScroll();

    // ResizeObserver tracks actual element dimensions rather than window
    const resizeObserver = new ResizeObserver(() => {
      checkScroll();
    });
    
    resizeObserver.observe(el);

    return () => {
      resizeObserver.disconnect();
    };
  }, [document, showSidePreview]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 250;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // If side preview is opened while `preview` tab is active, switch away to notes (default)
  useEffect(() => {
    if (showSidePreview && pathname === `/documents/${id}/preview`) {
      router.push(`/documents/${id}`);
    }
  }, [showSidePreview, pathname, id, router]);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const doc = await documentServices.getDocumentById(id);
        setDocument(doc);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center p-10 h-full items-center">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  if (!document) return <div>Document not found</div>;

  const currentTabLabel = TABS.find((tab) => {
    const tabPath = tab.path === "" ? `/documents/${id}` : `/documents/${id}/${tab.path}`;
    return pathname === tabPath;
  })?.label || "Notes";

  return (
    <DocumentProvider document={document} loading={loading}>
      <div 
        className={`flex flex-col lg:flex-row p-2 sm:p-3 lg:p-4 h-[calc(100vh-4rem)] w-full overflow-hidden ${isResizing ? "select-none" : ""} ${showSidePreview ? "gap-4 lg:gap-0" : ""}`}
      >
        {/* Optional side preview pane (hidden by default) */}
        {showSidePreview && (
          <>
            <div 
              className={`hidden lg:block h-full border rounded-xl overflow-hidden bg-muted shadow-sm shrink-0 ${!isResizing ? "transition-all duration-300" : ""} ${isResizing ? "pointer-events-none" : ""}`}
              style={{ width: `calc(${sidebarWidth}% - 8px)` }}
            >
              {document.pdfUrl ? (
                <PDFViewer url={document.pdfUrl} />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground flex-col gap-2">
                  <FileText className="h-10 w-10 opacity-20" />
                  <span>PDF not available</span>
                </div>
              )}
            </div>

            {/* Resizer Handle */}
            <div
              className="hidden lg:flex w-4 cursor-col-resize justify-center items-center group touch-none shrink-0 z-10"
              onMouseDown={startResizing}
            >
              <div className={`w-1 h-12 rounded-full transition-colors ${isResizing ? "bg-primary" : "bg-border group-hover:bg-primary/50"}`} />
            </div>
          </>
        )}

        {/* --- AI Features Area --- */}
        <div
          className={`flex flex-col border rounded-xl bg-background shadow-sm flex-1 w-full min-w-0 h-full ${
            showSidePreview && !isResizing ? "transition-all duration-300" : ""
          } ${!showSidePreview ? "lg:max-w-6xl lg:mx-auto" : ""} ${isResizing ? "pointer-events-none" : ""}`}
        >
          {/* Header with Title and Tabs */}
          <div className="border-b bg-background flex flex-col shrink-0 z-20 rounded-t-xl transition-all">
            {/* Title Bar */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 bg-background">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground shrink-0"
                  onClick={() => router.push("/documents")}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
                <div className="h-4 w-[1px] bg-border/60 mx-1 hidden sm:block shrink-0" />
                <h2
                  className="font-semibold truncate flex items-center gap-2 text-sm md:text-base"
                  title={document.title}
                >
                  <span className="bg-primary/10 text-primary p-1 rounded-md shrink-0">
                    <FileText className="h-4 w-4" />
                  </span>
                  <span className="truncate">{document.title}</span>
                </h2>
              </div>
            </div>

            {/* Toolbar Container */}
            <div className="flex items-center p-2 gap-2 w-full min-w-0">
              {currentTabLabel !== "Preview" && (
                <div className="shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSidePreview((s) => !s)}
                    className="hidden lg:flex h-8 w-8 text-muted-foreground hover:text-primary"
                    title={
                      showSidePreview ? "Hide side preview" : "Show side preview"
                    }
                  >
                    {showSidePreview ? (
                      <PanelLeftClose className="h-4 w-4" />
                    ) : (
                      <PanelLeftOpen className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              )}

              <div className="flex-1 flex items-center min-w-0 gap-1">
                {canScrollLeft && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-muted-foreground"
                    onClick={() => scroll("left")}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                )}

                <div 
                  ref={scrollContainerRef}
                  onScroll={checkScroll}
                  className="flex flex-nowrap gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none] flex-1 scroll-smooth"
                >
                  {(showSidePreview
                    ? TABS.filter((t) => t.label !== "Preview")
                    : TABS
                  ).map(({ label, icon: Icon, path }) => {
                    const targetPath = path === "" ? `/documents/${id}` : `/documents/${id}/${path}`;
                    const isActive = pathname === targetPath;
                    
                    return (
                      <Link 
                        key={label} 
                        href={targetPath}
                        className={`inline-flex justify-center rounded-full text-xs whitespace-nowrap px-3 h-8 transition-all duration-200 items-center gap-1.5 shrink-0 ${
                          isActive
                            ? "shadow-sm bg-primary text-primary-foreground font-medium"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0" />
                        <span>{label}</span>
                      </Link>
                    );
                  })}
                </div>

                {canScrollRight && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-muted-foreground"
                    onClick={() => scroll("right")}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-3 sm:p-4 md:p-5 relative bg-card/30 flex-1 min-h-0 overflow-y-auto overflow-x-hidden rounded-b-xl">
            <div className="w-full h-full max-w-full min-w-0">
              {children}
            </div>
          </div>
        </div>
      </div>
    </DocumentProvider>
  );
}
