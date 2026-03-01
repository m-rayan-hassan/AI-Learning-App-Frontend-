"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Mic, Headphones, Lightbulb, PlayCircle, FileAudio, Send } from "lucide-react";
import { aiServices } from "@/services/aiServices";
import { toast } from "react-hot-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { cn } from "@/lib/utils"; 
import documentServices from "@/services/documentServices";

export function UIActionsTab({ documentId }: { documentId: string }) {
  const [activeTab, setActiveTab] = useState<"voice" | "podcast" | "concept">("voice");

  // State
  const [voiceState, setVoiceState] = useState<{ loading: boolean; url: string | null }>({ loading: false, url: null });
  const [podcastState, setPodcastState] = useState<{ loading: boolean; url: string | null }>({ loading: false, url: null });
  const [conceptState, setConceptState] = useState<{ loading: boolean; text: string | null; input: string }>({ loading: false, text: null, input: "" });

  // --- 1. Load Data on Mount (LocalStorage -> DB) ---
  useEffect(() => {
    const loadAudioData = async () => {
      const localVoice = localStorage.getItem(`voice_${documentId}`);
      const localPodcast = localStorage.getItem(`podcast_${documentId}`);

      if (localVoice) setVoiceState(prev => ({ ...prev, url: localVoice }));
      if (localPodcast) setPodcastState(prev => ({ ...prev, url: localPodcast }));

      if (!localVoice || !localPodcast) {
        try {
          const voiceUrl = await aiServices.getVoiceOverviewUrl(documentId);
          
          const dbVoiceUrl = voiceUrl
          if (!localVoice && dbVoiceUrl) {
             setVoiceState(prev => ({ ...prev, url: dbVoiceUrl }));
             localStorage.setItem(`voice_${documentId}`, dbVoiceUrl);
          }
          
          const podcastUrl = await aiServices.getPodcastOverviewUrl(documentId);
          const dbPodcastUrl = podcastUrl
          if (!localPodcast && dbPodcastUrl) {
             setPodcastState(prev => ({ ...prev, url: dbPodcastUrl }));
             localStorage.setItem(`podcast_${documentId}`, dbPodcastUrl);
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

  const handleConcept = async (e?: React.FormEvent) => {
    if (e) e.preventDefault(); 
    if (!conceptState.input) return;

    setConceptState((prev) => ({ ...prev, loading: true }));
    const toastId = toast.loading("Explaining concept...");

    try {
      const res = await aiServices.explainConcept(documentId, conceptState.input);
      setConceptState((prev) => ({ 
          ...prev, 
          loading: false, 
          text: res.explaination || res.explanation 
      }));
      toast.success("Explanation generated!", { id: toastId });
    } catch (err: any) {
      console.error(err);
      setConceptState((prev) => ({ ...prev, loading: false }));
      toast.error(err.message || "Failed to explain concept", { id: toastId });
    }
  };

  return (
    <div className="h-full w-full flex flex-col gap-4 sm:gap-6">
      
      {/* --- CUSTOM TAB LIST --- */}
      <div className="shrink-0 bg-muted/50 p-1.5 rounded-xl border border-border/50">
        <div className="grid w-full grid-cols-3 gap-1">
            {[
                { id: "voice", icon: Mic, label: "Overview" },
                { id: "podcast", icon: Headphones, label: "Podcast" },
                { id: "concept", icon: Lightbulb, label: "Concept" }
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                        "flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 ease-out select-none focus:outline-none focus:ring-2 focus:ring-primary/20",
                        activeTab === tab.id
                        ? "bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/10" 
                        : "text-muted-foreground hover:bg-background/80 hover:text-foreground"
                    )}
                >
                    <tab.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>{tab.label}</span>
                </button>
            ))}
        </div>
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


      {/* --- Tab Content: Concept --- */}
      {activeTab === "concept" && (
        <Card className="flex-1 flex flex-col min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-300 border-none shadow-none bg-transparent">
           <CardHeader className="px-1 pt-0 pb-4">
               <CardTitle className="text-lg font-bold flex items-center gap-2">
                   <Lightbulb className="w-5 h-5 text-primary" />
                   Explain Concept
               </CardTitle>
               <CardDescription>Ask the AI to explain specific topics found in the document.</CardDescription>
           </CardHeader>

          <CardContent className="flex-1 px-1 flex flex-col gap-4 overflow-y-auto">
            {/* Input Form */}
            <form onSubmit={handleConcept} className="flex gap-2 items-center p-1 shrink-0">
              <Input 
                placeholder="E.g., What is the main conclusion?" 
                value={conceptState.input} 
                onChange={(e) => setConceptState(prev => ({ ...prev, input: e.target.value }))}
                className="flex-1 min-w-0 shadow-sm focus-visible:ring-offset-1"
              />
              <Button type="submit" disabled={conceptState.loading || !conceptState.input} size="icon" className="shrink-0 shadow-sm">
                {conceptState.loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Lightbulb className="h-4 w-4" />}
              </Button>
            </form>

            {/* Results Area - FIX APPLIED HERE */}
            {conceptState.text ? (
              <Card className="bg-muted/30 border border-border/60 shadow-sm animate-in zoom-in-95 duration-200">
                <CardContent className="p-4 sm:p-5">
                   {/* 
                      Classes added for full text visibility:
                      1. prose / prose-sm: Formats markdown elements properly.
                      2. break-words: Forces long words to wrap.
                      3. w-full: Ensures it takes full width.
                   */}
                  <div className="prose prose-sm dark:prose-invert max-w-none w-full break-words">
                      <MarkdownRenderer content={conceptState.text} />
                  </div>
                </CardContent>
              </Card>
            ) : (
                 // Empty State
                 <div className="flex flex-col items-center justify-center flex-1 text-center opacity-40 mt-4 sm:mt-0 min-h-[120px] sm:min-h-[200px]">
                    <Lightbulb className="h-12 w-12 mb-3 text-muted-foreground" />
                    <p className="text-sm font-medium">Ask a question above</p>
                    <p className="text-xs text-muted-foreground mt-1">Get instant clarifications on any topic.</p>
                 </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}