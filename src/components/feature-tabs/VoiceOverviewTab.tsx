"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Mic, Headphones, Lightbulb, PlayCircle, FileAudio, Send } from "lucide-react";
import { aiServices } from "@/services/aiServices";
import { toast } from "react-hot-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


export function VoiceOverviewTab({ documentId }: { documentId: string }) {
  const [activeTab, setActiveTab] = useState<"voice" | "podcast" | "concept">("voice");

  // State
  const [voiceState, setVoiceState] = useState<{ loading: boolean; url: string | null }>({ loading: false, url: null });
  const [podcastState, setPodcastState] = useState<{ loading: boolean; url: string | null }>({ loading: false, url: null });

  // --- 1. Load Data on Mount (LocalStorage -> DB) ---
  useEffect(() => {
    const loadAudioData = async () => {
      const localVoice = localStorage.getItem(`voice_${documentId}`);
      const localPodcast = localStorage.getItem(`podcast_${documentId}`);

      if (localVoice) setVoiceState((prev) => ({ ...prev, url: localVoice }));
      if (localPodcast) setPodcastState((prev) => ({ ...prev, url: localPodcast }));

      if (!localVoice && !localPodcast) {
        try {
          // The backend now stores ONLY ONE URL and its type (voice or podcast)
          const dbData = await aiServices.getVoiceOverviewUrl(documentId);
          
          if (dbData) {
            // Check if backend returned an object with URL and Type, or just a raw string URL fallback
            const url = dbData.secureUrl;
            const type = dbData.type;
            
            if (url) {
                if (type === "podcast") {
                   setPodcastState((prev) => ({ ...prev, url: url }));
                   localStorage.setItem(`podcast_${documentId}`, url);
                } else {
                   setVoiceState((prev) => ({ ...prev, url: url }));
                   localStorage.setItem(`voice_${documentId}`, url);
                }
            }
          }
        } catch (error) {
          console.error("Error fetching document details:", error);
        }
      }
    };

    if (documentId) loadAudioData();
  }, [documentId]);

  // --- 2. Handlers ---
  const handleVoice = async (regenerate = false) => {
    if (voiceState.url && !regenerate) return;
    setVoiceState((prev) => ({ ...prev, loading: true }));
    const toastId = toast.loading("Generating voice overview...");
    
    try {
      const res = await aiServices.generateVoiceOverview(documentId);
      const url = res.voice_url || res.voiceOveviewUrl || res.voiceOverviewUrl;
      setVoiceState({ loading: false, url: url });
      localStorage.setItem(`voice_${documentId}`, url);
      toast.success("Voice overview ready!", { id: toastId });
    } catch (err: any) {
      console.error(err);
      setVoiceState((prev) => ({ ...prev, loading: false }));
      toast.error(err.message || "Failed to generate voice overview", { id: toastId });
    }
  };

  const handlePodcast = async (regenerate = false) => {
    if (podcastState.url && !regenerate) return;
    setPodcastState((prev) => ({ ...prev, loading: true }));
    const toastId = toast.loading("Generating podcast...");

    try {
      const res = await aiServices.generatePodcast(documentId);
      const url = res.podcast_url || res.podcastUrl;
      setPodcastState({ loading: false, url: url });
      localStorage.setItem(`podcast_${documentId}`, url);
      toast.success("Podcast generated!", { id: toastId });
    } catch (err: any) {
      console.error(err);
      setPodcastState((prev) => ({ ...prev, loading: false }));
      toast.error(err.message || "Failed to generate podcast", { id: toastId });
    }
  };


  // --- 3. Ensure active tab matches generated content ---
  useEffect(() => {
    if (voiceState.url && !podcastState.url && activeTab === "podcast") {
      setActiveTab("voice");
    } else if (podcastState.url && !voiceState.url && activeTab === "voice") {
      setActiveTab("podcast");
    }
  }, [voiceState.url, podcastState.url, activeTab]);

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
                (tab.id === 'podcast' && hasVoice && !hasPodcast) || 
                (tab.id === 'voice' && hasPodcast && !hasVoice);

            const isLoading = voiceState.loading || podcastState.loading;
            const isDisabled = isLoading || isTabDisabled;

            return (
                <button
                    key={tab.id}
                    title={isTabDisabled ? "Create another document to generate this audio type" : ""}
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
            )
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
            <CardDescription>Generate a quick audio summary of this document.</CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 px-1 overflow-y-auto">
            {!voiceState.url ? (
               <div className="flex flex-col items-center justify-center h-48 sm:h-64 border-2 border-dashed border-muted-foreground/20 rounded-xl bg-muted/10 p-6 text-center space-y-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                     <FileAudio className="h-8 w-8 text-primary/60" />
                  </div>
                  <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">No audio generated yet</p>
                      <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">Create a concise voice summary of your document instantly.</p>
                  </div>
                  <Button onClick={() => handleVoice(false)} disabled={voiceState.loading} className="w-full sm:w-auto min-w-[140px]">
                    {voiceState.loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <PlayCircle className="mr-2 h-4 w-4" />}
                    Generate
                  </Button>
              </div>
            ) : (
              <div className="space-y-4">
                  <div className="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-semibold text-primary uppercase tracking-wider">Now Playing</span>
                          <span className="text-xs text-muted-foreground">Audio Summary</span>
                      </div>
                      <audio controls className="w-full focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg">
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
            <CardDescription>Turn this document into an engaging deep-dive podcast.</CardDescription>
          </CardHeader>

          <CardContent className="flex-1 px-1 overflow-y-auto">
            {!podcastState.url ? (
               <div className="flex flex-col items-center justify-center h-48 sm:h-64 border-2 border-dashed border-muted-foreground/20 rounded-xl bg-muted/10 p-6 text-center space-y-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                     <Headphones className="h-8 w-8 text-primary/60" />
                  </div>
                  <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">No podcast available</p>
                      <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">Generate a conversation-style podcast to listen on the go.</p>
                  </div>
                  <Button onClick={() => handlePodcast(false)} disabled={podcastState.loading} className="w-full sm:w-auto min-w-[140px]">
                    {podcastState.loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <PlayCircle className="mr-2 h-4 w-4" />}
                    Generate
                  </Button>
              </div>
            ) : (
                <div className="space-y-4">
                    <div className="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Podcast Mode</span>
                             <span className="text-xs text-muted-foreground">Deep Dive</span>
                        </div>
                        <audio controls className="w-full focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg">
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