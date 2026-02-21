"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Mic,
  Square,
  User,
  Bot,
  Loader2,
  MessageCircle,
  GraduationCap,
  AlertCircle,
} from "lucide-react";
import { vapi } from "@/lib/vapi";
import documentServices from "@/services/documentServices";
import authServices from "@/services/authServices";

// --- Types ---
interface Message {
  content: string;
  role: string;
}

interface VapiMessage {
  type: string;
  transcriptType?: string;
  transcript?: string;
  role?: string;
}

export function VoiceChat({ documentId }: { documentId: string }) {
  // --- State ---
  const [documentContent, setDocumentContent] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [userProfileImage, setUserProfileImage] = useState<string>("");
  const [voiceChatType, setVoiceChatType] = useState<string>("simple-chat");

  // Vapi & Call State
  const [callActive, setCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // --- 1. Fetch Data with Strict Validation ---
  useEffect(() => {
    let isMounted = true;
    const initData = async () => {
      setLoadingData(true);
      try {
        // Fetch Document Text
        const docRes = await documentServices.getDocumentById(documentId);
        const text =
          typeof docRes?.extractedText === "string" ? docRes.extractedText : "";

        // Fetch User Profile
        const userRes = await authServices.getProfile();
        const safeUsername =
          typeof userRes?.username === "string" ? userRes.username : "User";
        const safeImage =
          typeof userRes?.profileImage === "string" ? userRes.profileImage : "";

        if (isMounted) {
          setDocumentContent(text);
          setUsername(safeUsername);
          setUserProfileImage(safeImage);
        }
      } catch (error) {
        console.error("Error initializing voice chat data", error);
      } finally {
        if (isMounted) setLoadingData(false);
      }
    };

    if (documentId) initData();

    return () => {
      isMounted = false;
    };
  }, [documentId]);

  // --- 2. Auto-scroll Transcript ---
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // --- 3. Vapi Event Handlers - SIMPLIFIED LIKE YOUR WORKING PROJECT ---
  useEffect(() => {
    // SOLUTION to get rid of "Meeting has ended" error - Copy from working project
    const originalError = console.error;
    // override console.error to ignore "Meeting has ended" errors
    console.error = function (msg, ...args) {
      if (
        msg &&
        (msg.includes("Meeting has ended") ||
          (args[0] && args[0].toString().includes("Meeting has ended")))
      ) {
        console.log("Ignoring known error: Meeting has ended");
        return; // don't pass to original handler
      }

      // pass all other errors to the original handler
      return originalError.call(console, msg, ...args);
    };

    const handleCallStart = () => {
      console.log("Call started");
      setConnecting(false);
      setCallActive(true);
      setErrorMsg(null);
    };

    const handleCallEnd = () => {
      console.log("Call ended");
      setCallActive(false);
      setConnecting(false);
      setIsSpeaking(false);
    };

    const handleSpeechStart = () => setIsSpeaking(true);
    const handleSpeechEnd = () => setIsSpeaking(false);

    const handleMessage = (message: VapiMessage) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        setMessages((prev) => [
          ...prev,
          {
            content:
              typeof message.transcript === "string" ? message.transcript : "",
            role: typeof message.role === "string" ? message.role : "unknown",
          },
        ]);
      }
    };

    const handleError = (error: unknown) => {
      console.log("Vapi Error", error);
      setConnecting(false);
      setCallActive(false);

      // Only show error if it's meaningful (not empty object)
      if (error && typeof error === "object" && Object.keys(error).length > 0) {
        if (typeof (error as any)?.message === "string") {
          setErrorMsg((error as any).message);
        } else {
          setErrorMsg("An error occurred during the call");
        }
      }
    };

    vapi
      .on("call-start", handleCallStart)
      .on("call-end", handleCallEnd)
      .on("speech-start", handleSpeechStart)
      .on("speech-end", handleSpeechEnd)
      .on("message", handleMessage)
      .on("error", handleError);

    // cleanup event listeners on unmount
    return () => {
      vapi
        .off("call-start", handleCallStart)
        .off("call-end", handleCallEnd)
        .off("speech-start", handleSpeechStart)
        .off("speech-end", handleSpeechEnd)
        .off("message", handleMessage)
        .off("error", handleError);

      // restore original console.error
      console.error = originalError;
    };
  }, []);

  // --- 4. Call Logic - SEND FULL DOCUMENT TEXT ---
  const toggleCall = async () => {
    if (callActive) {
      vapi.stop();
    } else {
      try {
        setConnecting(true);
        setMessages([]);
        setErrorMsg(null);

        const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;
        if (!workflowId) {
          throw new Error(
            "Vapi Workflow ID is missing in environment variables.",
          );
        }

        // Prepare payload - SENDING ENTIRE DOCUMENT TEXT
        const safeText = documentContent || "No content available.";
        const safeName = username || "User";
        const safeType = voiceChatType || "simple-chat";

        console.log("Starting call with:", {
          workflowId,
          documentLength: safeText.length,
          username: safeName,
          chatType: safeType,
        });

        // For debugging: Show document size
        if (safeText.length > 10000) {
          console.warn(
            `Sending large document (${safeText.length} characters). Consider truncating if Vapi has size limits.`,
          );
        }

        // USE THE SAME PATTERN AS YOUR WORKING PROJECT
        await vapi.start(
          undefined, // assistantId (null/undefined)
          undefined, // assistantOverrides (null/undefined)
          undefined, // squadId (null/undefined)
          workflowId, // workflowId (this is the key!)
          {
            variableValues: {
              document_content: safeText, // Full document text
              user_name: safeName,
              chat_type: safeType,
            },
          }, // This goes as the 5th parameter
        );
      } catch (error: any) {
        console.log("Failed to start call", error);
        setConnecting(false);

        let failMsg = "Failed to start conversation.";
        if (typeof error?.message === "string") {
          failMsg = error.message;

          // Check if it's a size-related error
          if (
            error.message.includes("size") ||
            error.message.includes("too large") ||
            error.message.includes("limit")
          ) {
            failMsg +=
              " The document might be too large. Try with a smaller document.";
          }
        } else if (typeof error === "string") {
          failMsg = error;
        }

        setErrorMsg(failMsg);
      }
    }
  };



  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 p-4 lg:p-6 animate-in fade-in duration-500">
      
      {/* Header Card */}
      <div className="relative group overflow-hidden bg-card border border-border p-5 rounded-2xl shadow-sm transition-all duration-300">
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="relative w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                <Mic size={24} />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Voice Assistant
              </h2>
              <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Interactive Learning
              </div>
            </div>
          </div>

          {/* Chat Type Toggles */}
          <div className="flex p-1 bg-muted rounded-xl w-full md:w-auto border border-border">
            <button
              onClick={() => !callActive && setVoiceChatType("simple-chat")}
              disabled={callActive}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                voiceChatType === "simple-chat"
                  ? "bg-background text-foreground shadow-sm scale-[1.01]"
                  : "text-muted-foreground hover:text-foreground"
              } ${callActive ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <MessageCircle size={15} />
              Discuss
            </button>
            <button
              onClick={() => !callActive && setVoiceChatType("interview-chat")}
              disabled={callActive}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                voiceChatType === "interview-chat"
                  ? "bg-background text-foreground shadow-sm scale-[1.01]"
                  : "text-muted-foreground hover:text-foreground"
              } ${callActive ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <GraduationCap size={16} />
              Viva Mode
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {typeof errorMsg === "string" && errorMsg.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-5 py-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={18} />
          <span className="text-sm font-medium">{errorMsg}</span>
        </div>
      )}

      {/* Main Experience Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Assistant Perspective */}
        <div className="relative min-h-[200px] sm:min-h-[280px] lg:h-[350px] flex flex-col items-center justify-center p-6 sm:p-8 bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className={`absolute inset-0 bg-primary/5 transition-opacity duration-1000 ${isSpeaking ? "opacity-100" : "opacity-0"}`} />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative mb-6">
              {isSpeaking && (
                <div className="absolute -inset-6 bg-primary/20 rounded-full blur-2xl animate-pulse" />
              )}
              <div className={`
                relative w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full bg-primary p-1 shadow-lg transition-all duration-500
                ${isSpeaking ? "scale-105" : "scale-100"}
              `}>
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center border-2 border-primary/20 overflow-hidden">
                   <Bot size={40} className={`text-primary transition-all duration-500 sm:[&]:!w-14 sm:[&]:!h-14 ${isSpeaking ? "scale-110 drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]" : "opacity-90"}`} />
                </div>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-lg sm:text-2xl font-bold text-foreground">Genius AI</h3>
              <div className={`
                mt-3 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300
                ${isSpeaking 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "bg-muted text-muted-foreground"}
              `}>
                {isSpeaking ? (
                  <span className="flex items-center gap-1">
                    <span className="w-1 h-3 bg-current/50 animate-[voice_1s_ease-in-out_infinite]" />
                    <span className="w-1 h-5 bg-current/50 animate-[voice_1s_ease-in-out_0.2s_infinite]" />
                    <span className="w-1 h-2.5 bg-current/50 animate-[voice_1s_ease-in-out_0.1s_infinite]" />
                    <span className="ml-1.5">Speaking</span>
                  </span>
                ) : (
                  <span>{callActive ? "Active" : "Ready"}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* User Perspective */}
        <div className="relative min-h-[200px] sm:min-h-[280px] lg:h-[350px] flex flex-col items-center justify-center p-6 sm:p-8 bg-muted/30 border border-border rounded-2xl">
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative group mb-6">
              <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-purple-500 rounded-full opacity-20 blur-sm" />
              <div className="relative w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full bg-background border-2 border-border shadow-md overflow-hidden flex items-center justify-center">
                {userProfileImage ? (
                  <img src={userProfileImage} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <User size={64} className="text-muted-foreground/40" />
                )}
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-lg sm:text-2xl font-bold text-foreground">
                {username || "Scholar"}
              </h3>
              <div className="mt-3 px-4 py-1.5 rounded-full bg-background border border-border text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Learning Mode
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Strip & Transcript Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Call Toggle Button */}
        <div className="lg:col-span-4">
          <button
            onClick={toggleCall}
            disabled={loadingData || connecting || !documentContent}
            className={`
              relative w-full h-full min-h-[70px] sm:min-h-[100px] rounded-2xl flex flex-col items-center justify-center gap-2 font-bold transition-all duration-300 shadow-sm
              ${callActive 
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" 
                : "bg-primary text-primary-foreground hover:bg-primary/90"}
              ${loadingData || connecting || !documentContent ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.01]"}
            `}
          >
            {connecting ? (
              <Loader2 className="animate-spin" size={28} />
            ) : callActive ? (
              <Square fill="currentColor" size={24} />
            ) : (
              <Mic size={28} />
            )}
            
            <span className="uppercase tracking-widest text-xs">
              {connecting ? "Connecting..." : callActive ? "End Session" : "Start Learning"}
            </span>
          </button>
        </div>

        {/* Live Transcript */}
        <div className="lg:col-span-8 bg-card border border-border p-5 rounded-2xl shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Live Transcript</span>
            {callActive && (
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse delay-75" />
              </div>
            )}
          </div>
          
          <div 
            ref={scrollRef}
            className="h-[80px] sm:h-[100px] overflow-y-auto px-1 space-y-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border hover:scrollbar-thumb-muted-foreground/20 transition-colors"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground/50 text-xs italic">
                <p>{callActive ? "Listening for speech..." : "Voice transcript will appear here"}</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`
                    max-w-[85%] px-4 py-2 rounded-xl text-sm leading-relaxed
                    ${msg.role === "user" 
                      ? "bg-primary text-primary-foreground rounded-tr-none shadow-sm" 
                      : "bg-muted text-foreground rounded-tl-none"}
                  `}>
                    {msg.content}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes voice {
          0%, 100% { transform: scaleY(1); opacity: 0.5; }
          50% { transform: scaleY(1.8); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default VoiceChat;
