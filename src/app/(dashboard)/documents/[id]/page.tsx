"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, FileText, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import documentServices from "@/services/documentServices";
import { ChatTab } from "@/components/feature-tabs/ChatTab";
import { SummaryTab } from "@/components/feature-tabs/SummaryTab";
import { FlashcardsTab } from "@/components/feature-tabs/FlashcardsTab";
import { QuizTab } from "@/components/feature-tabs/QuizTab";
import { UIActionsTab } from "@/components/feature-tabs/UIActionsTab";
import { Button } from "@/components/ui/button";
import { PDFViewer } from "@/components/PDFViewer"; // <--- IMPORT THIS
import VoiceChat from "@/components/feature-tabs/VoiceChat";
import VideoOverviewTab from "@/components/feature-tabs/VideoOverviewTab";

// Simple Tabs usage
const TABS = ["Preview", "Summary", "Chat", "Flashcards", "Quiz", "AI Actions", "Voice Chat", "Video Overview"];

export default function DocumentViewPage() {
  // ... (keep all your existing state and useEffects the same) ...
  const params = useParams();
  const id = params.id as string;
  const [document, setDocument] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("Summary");
  const [loading, setLoading] = useState(true);
  // showSidePreview controls whether a separate left-side preview pane is visible
  const [showSidePreview, setShowSidePreview] = useState(false);

  // If side preview is opened while `Preview` tab is active, switch away
  useEffect(() => {
    if (showSidePreview && activeTab === "Preview") {
      setActiveTab("Summary");
    }
  }, [showSidePreview, activeTab]);

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

  // ... (keep your loading/error returns) ...
  if (loading)
    return (
      <div className="flex justify-center p-10 h-full items-center">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  if (!document) return <div>Document not found</div>;

  return (
    <div className="min-h-[calc(100dvh-70px)] md:min-h-[calc(100vh-80px)] flex flex-col lg:flex-row gap-4 p-2 lg:p-4">
      {/* Optional side preview pane (hidden by default) */}
      {showSidePreview && (
        <div className="hidden lg:block lg:flex-1 h-[calc(100vh-100px)] border rounded-xl overflow-hidden bg-muted shadow-sm transition-all duration-300">
          {document.pdfUrl ? (
            <PDFViewer url={document.pdfUrl} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground flex-col gap-2">
              <FileText className="h-10 w-10 opacity-20" />
              <span>PDF not available</span>
            </div>
          )}
        </div>
      )}

      {/* --- AI Features Area --- */}
      <div
        className={`flex flex-col border rounded-xl bg-background/50 backdrop-blur-sm shadow-sm overflow-hidden transition-all duration-300 flex-1 w-full min-h-0 ${
          showSidePreview
            ? "lg:flex-none lg:w-[500px] xl:w-[700px]"
            : "lg:max-w-6xl lg:mx-auto lg:w-full"
        }`}
      >
        {/* Header with Title and Tabs */}
        <div className="border-b bg-muted/30 flex flex-col shrink-0 z-10">
           {/* Title Bar */}
           <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 bg-background/50 backdrop-blur-sm">
              <h2 className="font-semibold truncate flex-1 flex items-center gap-2 text-sm md:text-base" title={document.title}>
                 <span className="bg-primary/10 text-primary p-1 rounded-md shrink-0">
                    <FileText className="h-4 w-4" />
                 </span>
                 <span className="truncate">{document.title}</span>
              </h2>
           </div>

           {/* Toolbar */}
           <div className="p-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {activeTab !== "Preview" && (
                <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSidePreview((s) => !s)}
                className="hidden lg:flex shrink-0 h-8 w-8 text-muted-foreground hover:text-primary"
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
            )}
            <div className="flex flex-nowrap gap-1">
                {(showSidePreview ? TABS.filter((t) => t !== "Preview") : TABS).map(
                (tab) => (
                    <Button
                    key={tab}
                    variant={activeTab === tab ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-full text-xs whitespace-nowrap px-4 h-8 transition-all duration-200 ${
                        activeTab === tab 
                        ? "shadow-sm bg-primary text-primary-foreground font-medium" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                    >
                    {tab}
                    </Button>
                ),
                )}
            </div>
          </div>
        </div>

        {/* Content Area - Changed to allow scrolling for ALL tabs to prevent cutoff on mobile */}
        <div className="flex-1 min-h-0 p-0 md:p-2 overflow-y-auto overflow-x-hidden relative bg-card/30">
          {activeTab === "Preview" && document.pdfUrl && (
            <div className="h-full w-full">
              <PDFViewer url={document.pdfUrl} />
            </div>
          )}
          {activeTab === "Preview" && !document.pdfUrl && (
            <div className="flex items-center justify-center h-full text-muted-foreground flex-col gap-2">
              <FileText className="h-10 w-10 opacity-20" />
              <span>PDF not available</span>
            </div>
          )}

          <div className="h-full w-full max-w-full">
            {activeTab === "Summary" && <SummaryTab documentId={id} />}
            {activeTab === "Chat" && <ChatTab documentId={id} />}
            {activeTab === "Flashcards" && <FlashcardsTab documentId={id} />}
            {activeTab === "Quiz" && <QuizTab documentId={id} />}
            {activeTab === "AI Actions" && <UIActionsTab documentId={id} />}
            {activeTab === "Voice Chat" && <VoiceChat documentId={id} />}
            {activeTab === "Video Overview" && <VideoOverviewTab documentId={id}/>}
          </div>
        </div>
      </div>
    </div>
  );
}
