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
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 p-4 lg:p-8 animate-in fade-in duration-700">
      
      {/* Glassy Header Card */}
      <div className="relative group overflow-hidden bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-white/10 p-6 rounded-[2.5rem] shadow-2xl transition-all duration-500 hover:shadow-blue-500/10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-50" />
        
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg transform group-hover:rotate-6 transition-transform duration-300">
                <Mic size={28} />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                Voice Assistant
              </h2>
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-1">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                Interative Learning
              </div>
            </div>
          </div>

          {/* Premium Chat Type Toggles */}
          <div className="flex p-1.5 bg-slate-200/40 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl w-full md:w-auto border border-white/10">
            <button
              onClick={() => !callActive && setVoiceChatType("simple-chat")}
              disabled={callActive}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                voiceChatType === "simple-chat"
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xl scale-[1.02]"
                  : "text-slate-500 hover:bg-white/30 dark:hover:bg-slate-700/30"
              } ${callActive ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              <MessageCircle size={16} />
              Discuss
            </button>
            <button
              onClick={() => !callActive && setVoiceChatType("interview-chat")}
              disabled={callActive}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                voiceChatType === "interview-chat"
                  ? "bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-xl scale-[1.02]"
                  : "text-slate-500 hover:bg-white/30 dark:hover:bg-slate-700/30"
              } ${callActive ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              <GraduationCap size={18} />
              Viva Mode
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {typeof errorMsg === "string" && errorMsg.length > 0 && (
        <div className="bg-red-500/10 backdrop-blur-md border border-red-500/20 text-red-600 dark:text-red-400 px-6 py-4 rounded-3xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertCircle size={18} />
          </div>
          <span className="font-medium">{errorMsg}</span>
        </div>
      )}

      {/* Main Experience Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Assistant Perspective */}
        <div className="relative aspect-square md:aspect-auto md:h-[450px] group flex flex-col items-center justify-center p-12 bg-white/20 dark:bg-slate-900/20 backdrop-blur-xl border border-white/20 dark:border-slate-800 rounded-[3rem] shadow-xl transition-all duration-500">
          <div className={`absolute inset-0 bg-gradient-to-t from-blue-500/10 via-transparent to-transparent transition-opacity duration-1000 ${isSpeaking ? "opacity-100" : "opacity-0"}`} />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative mb-8">
              {isSpeaking && (
                <div className="absolute -inset-8 bg-blue-500/30 rounded-full blur-3xl animate-pulse scale-150" />
              )}
              <div className={`
                relative w-40 h-40 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 p-2 shadow-2xl transition-all duration-700 transform
                ${isSpeaking ? "scale-110 rotate-3" : "scale-100"}
              `}>
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center border-4 border-white/10 overflow-hidden">
                   <Bot size={72} className={`text-white transition-all duration-500 ${isSpeaking ? "scale-110 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]" : "opacity-80"}`} />
                </div>
              </div>
              
              {/* Orbital Rings */}
              {callActive && (
                <div className="absolute -inset-4 border-2 border-blue-500/20 rounded-full animate-[spin_10s_linear_infinite]" />
              )}
               {callActive && (
                <div className="absolute -inset-8 border border-white/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
              )}
            </div>

            <div className="text-center">
              <h3 className="text-3xl font-black text-slate-800 dark:text-white">Genius AI</h3>
              <div className={`
                mt-4 inline-flex items-center gap-3 px-6 py-2 rounded-2xl text-sm font-bold transition-all duration-300
                ${isSpeaking 
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30" 
                  : "bg-slate-200/50 dark:bg-slate-800 text-slate-500"}
              `}>
                {isSpeaking ? (
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-4 bg-white/50 animate-[voice_1s_ease-in-out_infinite]" />
                    <span className="w-1.5 h-6 bg-white/50 animate-[voice_1s_ease-in-out_0.2s_infinite]" />
                    <span className="w-1.5 h-3 bg-white/50 animate-[voice_1s_ease-in-out_0.1s_infinite]" />
                    <span className="ml-2 uppercase tracking-tighter">Speaking</span>
                  </span>
                ) : (
                  <span className="uppercase tracking-widest">{callActive ? "Active" : "Ready"}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* User Perspective */}
        <div className="relative aspect-square md:aspect-auto md:h-[450px] flex flex-col items-center justify-center p-12 bg-white/50 dark:bg-slate-800/10 backdrop-blur-md border border-white/20 dark:border-slate-800/30 rounded-[3rem] shadow-xl">
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative group mb-8">
              <div className="absolute -inset-2 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full opacity-30 blur group-hover:opacity-50 transition duration-500" />
              <div className="relative w-40 h-40 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-700 shadow-2xl overflow-hidden flex items-center justify-center">
                {userProfileImage ? (
                  <img src={userProfileImage} alt="User" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <User size={80} className="text-slate-400" />
                )}
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-3xl font-black text-slate-800 dark:text-white">
                {username || "Scholar"}
              </h3>
              <div className="mt-4 px-6 py-2 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-white/5 text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest shadow-sm">
                Reading Mode
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Strip & Transcript Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Call Toggle Button - 4 columns */}
        <div className="lg:col-span-4 h-full flex items-stretch">
          <button
            onClick={toggleCall}
            disabled={loadingData || connecting || !documentContent}
            className={`
              relative w-full overflow-hidden min-h-[140px] rounded-[2.5rem] flex flex-col items-center justify-center gap-3 font-black text-xl shadow-2xl transition-all duration-500 group
              ${callActive 
                ? "bg-red-500 hover:bg-red-600 ring-4 ring-red-500/20" 
                : "bg-gradient-to-br from-indigo-600 to-blue-600 hover:scale-[1.02] ring-4 ring-blue-500/20"}
              ${loadingData || connecting || !documentContent ? "opacity-50 grayscale cursor-not-allowed" : ""}
            `}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {connecting ? (
              <Loader2 className="animate-spin text-white/50" size={32} />
            ) : callActive ? (
              <Square fill="currentColor" size={28} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
            ) : (
              <Mic size={32} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] animate-bounce" />
            )}
            
            <span className="text-white tracking-widest uppercase text-sm">
              {connecting ? "Connecting..." : callActive ? "End Session" : "Start Learning"}
            </span>
          </button>
        </div>

        {/* Live Transcript - 8 columns */}
        <div className="lg:col-span-8 bg-white/10 dark:bg-slate-900/40 backdrop-blur-3xl border border-white/20 dark:border-slate-800 p-6 rounded-[2.5rem] shadow-xl">
          <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Live Transcript</span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 animate-pulse delay-75" />
            </div>
          </div>
          
          <div 
            ref={scrollRef}
            className="h-[100px] overflow-y-auto px-2 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 hover:scrollbar-thumb-blue-500 transition-colors"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-30 text-slate-500 italic text-sm">
                <p>Waiting for speech...</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`
                    max-w-[80%] px-5 py-2.5 rounded-2xl text-sm font-medium leading-relaxed
                    ${msg.role === "user" 
                      ? "bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-500/10" 
                      : "bg-white/60 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-white/20 dark:border-slate-700 rounded-tl-none shadow-sm"}
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
          50% { transform: scaleY(2); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default VoiceChat;
