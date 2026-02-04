"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Mic, Headphones, FileText, Lightbulb } from "lucide-react";
import { aiServices } from "@/services/aiServices";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function UIActionsTab({ documentId }: { documentId: string }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [concept, setConcept] = useState("");

  const handleAction = async (action: string) => {
    setLoading(action);
    setResult(null);
    try {
        let res;
        if (action === "voice") {
             res = await aiServices.generateVoiceOverview(documentId);
             setResult({ type: "audio", ...res });
        } else if (action === "podcast") {
             res = await aiServices.generatePodcast(documentId);
             setResult({ type: "audio", ...res });
        } else if (action === "concept") {
             if(!concept) return;
             res = await aiServices.explainConcept(documentId, concept);
             setResult({ type: "text", content: res.explaination || res.explanation });
        }
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(null);
    }
  };

  return (
    <div className="space-y-6 h-full overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => handleAction("voice")} disabled={!!loading}>
              {loading === "voice" ? <Loader2 className="animate-spin" /> : <Mic className="h-6 w-6 text-primary" />}
              <span>Voice Overview</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => handleAction("podcast")} disabled={!!loading}>
              {loading === "podcast" ? <Loader2 className="animate-spin" /> : <Headphones className="h-6 w-6 text-primary" />}
              <span>Podcast</span>
          </Button>
      </div>

       <div className="space-y-2">
           <h3 className="text-sm font-medium">Explain Concept</h3>
           <div className="flex gap-2">
               <Input 
                 placeholder="Enter a concept to explain..." 
                 value={concept} 
                 onChange={(e) => setConcept(e.target.value)} 
               />
               <Button onClick={() => handleAction("concept")} disabled={!!loading || !concept}>
                  {loading === "concept" ? <Loader2 className="animate-spin" /> : <Lightbulb className="h-4 w-4" />}
               </Button>
           </div>
       </div>

      {result && (
          <Card className="bg-muted/30">
              <CardContent className="p-4 space-y-2">
                  <h4 className="font-semibold capitalize">{loading === null ? "Result" : "Processing..."}</h4>
                  {result.type === 'audio' && (
                      <audio controls className="w-full mt-2">
                          <source src={result.voice_url || result.podcast_url} type="audio/mpeg" />
                          Your browser does not support the audio element.
                      </audio>
                  )}
                  {result.type === 'text' && (
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{result.content}</p>
                  )}
              </CardContent>
          </Card>
      )}
    </div>
  );
}
