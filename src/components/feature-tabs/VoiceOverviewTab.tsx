"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Mic,
  Headphones,
  Lightbulb,
  PlayCircle,
  FileAudio,
  Send,
  Lock,
} from "lucide-react";
import { aiServices } from "@/services/aiServices";
import { toast } from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export function VoiceOverviewTab({ documentId }: { documentId: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"voice" | "podcast" | "concept">(
    "voice",
  );

  // State
  const [voiceState, setVoiceState] = useState<{
    loading: boolean;
    url: string | null;
    isGenerating?: boolean;
  }>({ loading: false, url: null, isGenerating: false });
  const [podcastState, setPodcastState] = useState<{
    loading: boolean;
    url: string | null;
    isGenerating?: boolean;
  }>({ loading: false, url: null, isGenerating: false });
  const [voiceFailed, setVoiceFailed] = useState(false);
  const [podcastFailed, setPodcastFailed] = useState(false);

  // --- 1. Load Data on Mount/Poll (LocalStorage -> DB) ---
  const loadAudioData = async (isPollingCall = false) => {
    try {
      const dbData = await aiServices.getVoiceOverviewUrl(documentId);

      if (dbData && Array.isArray(dbData)) {
        let vState = { ...voiceState };
        let pState = { ...podcastState };

        dbData.forEach((item: any) => {
          // Handle failed generation
          if (item.generationStatus === "failed") {
            if (isPollingCall) {
              if (item.type === "podcast") {
                toast.error("Podcast generation failed. Please try again.");
                setPodcastFailed(true);
              } else {
                toast.error("Voice overview generation failed. Please try again.");
                setVoiceFailed(true);
              }
            }
            // Delete the failed record silently
            aiServices.deleteVoiceOverview(item._id).catch(() => {});
            return;
          }

          if (item.type === "podcast") {
            pState.url = item.secureUrl || null;
            pState.isGenerating = item.generationStatus === "pending";
            if (item.secureUrl)
              localStorage.setItem(`podcast_${documentId}`, item.secureUrl);
          } else {
            vState.url = item.secureUrl || null;
            vState.isGenerating = item.generationStatus === "pending";
            if (item.secureUrl)
              localStorage.setItem(`voice_${documentId}`, item.secureUrl);
          }
        });

        setVoiceState((prev) => ({ ...prev, ...vState }));
        setPodcastState((prev) => ({ ...prev, ...pState }));
      } else if (dbData && !Array.isArray(dbData)) {
        const item: any = dbData;

        // Handle failed generation
        if (item.generationStatus === "failed") {
          if (isPollingCall) {
            if (item.type === "podcast") {
              toast.error("Podcast generation failed. Please try again.");
              setPodcastFailed(true);
            } else {
              toast.error("Voice overview generation failed. Please try again.");
              setVoiceFailed(true);
            }
          }
          aiServices.deleteVoiceOverview(item._id).catch(() => {});
          return;
        }

        if (item.type === "podcast") {
          setPodcastState((prev) => ({
            ...prev,
            url: item.secureUrl || null,
            isGenerating: item.generationStatus === "pending",
          }));
          if (item.secureUrl)
            localStorage.setItem(`podcast_${documentId}`, item.secureUrl);
        } else {
          setVoiceState((prev) => ({
            ...prev,
            url: item.secureUrl || null,
            isGenerating: item.generationStatus === "pending",
          }));
          if (item.secureUrl)
            localStorage.setItem(`voice_${documentId}`, item.secureUrl);
        }
      }
    } catch (error) {
      console.error("Error fetching document details:", error);
      // Fallback to local storage if API fails
      const localVoice = localStorage.getItem(`voice_${documentId}`);
      const localPodcast = localStorage.getItem(`podcast_${documentId}`);
      if (localVoice && !voiceState.url)
        setVoiceState((prev) => ({ ...prev, url: localVoice }));
      if (localPodcast && !podcastState.url)
        setPodcastState((prev) => ({ ...prev, url: localPodcast }));
    }
  };

  useEffect(() => {
    if (documentId) loadAudioData();
  }, [documentId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (voiceState.isGenerating || podcastState.isGenerating) {
      interval = setInterval(() => {
        loadAudioData(true);
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [voiceState.isGenerating, podcastState.isGenerating, documentId]);

  // --- 2. Handlers ---
  const handleVoice = async (regenerate = false) => {
    if ((voiceState.url || voiceState.isGenerating) && !regenerate) return;
    setVoiceState((prev) => ({ ...prev, loading: true }));
    setVoiceFailed(false);
    const toastId = toast.loading("Generating voice overview...");

    try {
      await aiServices.generateVoiceOverview(documentId);
      await loadAudioData();
      toast("Voice overview is generating...", {
        id: toastId,
        icon: "ℹ️",
        style: {
          background: "#eff6ff",
          color: "#2563eb",
          border: "1px solid #bfdbfe",
        },
      });
    } catch (err: any) {
      console.error(err);
      setVoiceState((prev) => ({ ...prev, loading: false }));
      toast.error(err.message || "Failed to generate voice overview", {
        id: toastId,
      });
    }
  };

  const handlePodcast = async (regenerate = false) => {
    if ((podcastState.url || podcastState.isGenerating) && !regenerate) return;
    setPodcastState((prev) => ({ ...prev, loading: true }));
    setPodcastFailed(false);
    const toastId = toast.loading("Generating podcast...");

    try {
      await aiServices.generatePodcast(documentId);
      await loadAudioData();
      toast("Podcast is generating...", {
        id: toastId,
        icon: "ℹ️",
        style: {
          background: "#eff6ff",
          color: "#2563eb",
          border: "1px solid #bfdbfe",
        },
      });
    } catch (err: any) {
      console.error(err);
      setPodcastState((prev) => ({ ...prev, loading: false }));
      toast.error(err.message || "Failed to generate podcast", { id: toastId });
    }
  };

  // --- 3. Ensure active tab matches generated content ---
  // Removed useEffect to fix react-hooks/set-state-in-effect warning. Tab state should generally be managed via user interaction.

  return (
    <div className="h-full w-full flex flex-col gap-4 sm:gap-6">
      {/* --- Chat Type Toggles Style --- */}
      <div className="flex p-1 bg-muted rounded-xl w-full border border-border">
        {[
          { id: "voice", icon: Mic, label: "Overview" },
          { id: "podcast", icon: Headphones, label: "Podcast" },
        ].map((tab) => {
          const hasVoice = !!voiceState.url;
          const hasPodcast = !!podcastState.url;
          const isTabDisabled =
            (tab.id === "podcast" && hasVoice && !hasPodcast) ||
            (tab.id === "voice" && hasPodcast && !hasVoice);

          const isLoading = voiceState.loading || podcastState.loading;
          const isDisabled = isLoading || isTabDisabled;

          return (
            <button
              key={tab.id}
              title={
                isTabDisabled
                  ? "Create another document to generate this audio type"
                  : ""
              }
              onClick={() => !isDisabled && setActiveTab(tab.id as any)}
              disabled={isDisabled}
              className={`flex-1 flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm scale-[1.01]"
                  : "text-muted-foreground hover:text-foreground"
              } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* --- Tab Content: Voice --- */}
      {activeTab === "voice" && (
        <Card className="flex-1 flex flex-col min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-300 border-none shadow-none bg-transparent">
          <CardHeader className="px-1 pt-0 pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Mic className="w-5 h-5 text-primary" />
              Voice Overview
            </CardTitle>
            <CardDescription>
              Generate a quick audio summary of this document.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 px-1 overflow-y-auto">
            {!voiceState.url ? (
              <div className="flex flex-col items-center justify-center h-48 sm:h-64 border-2 border-dashed border-muted-foreground/20 rounded-xl bg-muted/10 p-6 text-center space-y-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <FileAudio className="h-8 w-8 text-primary/60" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    No audio generated yet
                  </p>
                  <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">
                    Create a concise voice summary of your document instantly.
                  </p>
                </div>
                {user?.planType === "free" ? (
                  <Button
                    onClick={() => router.push("/pricing")}
                    variant="outline"
                    className="w-full sm:w-auto min-w-[140px] border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <Lock className="mr-2 h-4 w-4 text-slate-500" />
                    Upgrade to Unlock
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleVoice(false)}
                    disabled={voiceState.loading || voiceState.isGenerating}
                    className="w-full sm:w-auto min-w-[140px]"
                  >
                    {voiceState.loading || voiceState.isGenerating ? (
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    ) : (
                      <PlayCircle className="mr-2 h-4 w-4" />
                    )}
                    {voiceState.isGenerating ? "Generating..." : voiceFailed ? "Retry" : "Generate"}
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                      Now Playing
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Audio Summary
                    </span>
                  </div>
                  <audio
                    controls
                    className="w-full focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg"
                  >
                    <source src={voiceState.url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* --- Tab Content: Podcast --- */}
      {activeTab === "podcast" && (
        <Card className="flex-1 flex flex-col min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-300 border-none shadow-none bg-transparent">
          <CardHeader className="px-1 pt-0 pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Headphones className="w-5 h-5 text-primary" />
              Audio Podcast
            </CardTitle>
            <CardDescription>
              Turn this document into an engaging deep-dive podcast.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 px-1 overflow-y-auto">
            {!podcastState.url ? (
              <div className="flex flex-col items-center justify-center h-48 sm:h-64 border-2 border-dashed border-muted-foreground/20 rounded-xl bg-muted/10 p-6 text-center space-y-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Headphones className="h-8 w-8 text-primary/60" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    No podcast available
                  </p>
                  <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">
                    Generate a conversation-style podcast to listen on the go.
                  </p>
                </div>
                {user?.planType === "free" ? (
                  <Button
                    onClick={() => router.push("/pricing")}
                    variant="outline"
                    className="w-full sm:w-auto min-w-[140px] border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <Lock className="mr-2 h-4 w-4 text-slate-500" />
                    Upgrade to Unlock
                  </Button>
                ) : (
                  <Button
                    onClick={() => handlePodcast(false)}
                    disabled={podcastState.loading || podcastState.isGenerating}
                    className="w-full sm:w-auto min-w-[140px]"
                  >
                    {podcastState.loading || podcastState.isGenerating ? (
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    ) : (
                      <PlayCircle className="mr-2 h-4 w-4" />
                    )}
                    {podcastState.isGenerating ? "Generating..." : podcastFailed ? "Retry" : "Generate"}
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                      Podcast Mode
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Deep Dive
                    </span>
                  </div>
                  <audio
                    controls
                    className="w-full focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg"
                  >
                    <source src={podcastState.url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
