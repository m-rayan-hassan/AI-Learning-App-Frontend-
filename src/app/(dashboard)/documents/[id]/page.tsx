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
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin" />
      </div>
    );
  if (!document) return <div>Document not found</div>;

  return (
    <div className="h-[calc(100dvh-80px)] md:h-[calc(100vh-100px)] flex flex-col lg:flex-row gap-4 p-1">
      {/* Optional side preview pane (hidden by default) */}
      {showSidePreview && (
        <div className="h-[40vh] lg:h-full lg:flex-1 border rounded-xl overflow-hidden bg-muted shadow-sm transition-all duration-300">
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

      {/* ... (Keep the rest of the AI Features Area exactly as it was) ... */}
      <div
        className={`flex flex-col border rounded-xl bg-background shadow-sm overflow-hidden transition-all duration-300 flex-1 w-full ${
          showSidePreview
            ? "lg:flex-none lg:w-[650px]"
            : "lg:max-w-6xl lg:mx-auto lg:w-full"
        }`}
      >
        {/* ... (existing tabs logic) ... */}
        <div className="border-b p-2 flex items-center gap-2 bg-muted/30">
          {activeTab !== "Preview" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSidePreview((s) => !s)}
              className="shrink-0 h-8 w-8 text-muted-foreground hover:text-primary"
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
          <div className="flex-1 flex flex-wrap gap-1">
            {(showSidePreview ? TABS.filter((t) => t !== "Preview") : TABS).map(
              (tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-lg text-xs whitespace-nowrap px-3 h-8 ${
                    activeTab === tab ? "shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  {tab}
                </Button>
              ),
            )}
          </div>
        </div>

        <div className="flex-1 p-2 overflow-auto h-full">
          {activeTab === "Preview" && document.pdfUrl && (
            <div className="h-full">
              <PDFViewer url={document.pdfUrl} />
            </div>
          )}
          {activeTab === "Preview" && !document.pdfUrl && (
            <div className="flex items-center justify-center h-full text-muted-foreground flex-col gap-2">
              <FileText className="h-10 w-10 opacity-20" />
              <span>PDF not available</span>
            </div>
          )}

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
  );
}
