"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, MessageSquare, Zap, FileText, Mic, ArrowRight, 
  PlayCircle, Layers, LayoutDashboard, User, Bot, 
  BookOpen, Wand2, BrainCircuit, LogOut, Podcast, 
  CheckCircle2, Sun, Play, MoreVertical, Volume2, 
  Lightbulb, Upload, Brain, Trophy, ChevronLeft, ChevronRight,
  Video, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// ==========================================
//    INTERACTIVE DASHBOARD COMPONENTS
// ==========================================

const Sidebar = () => (
  <div className="w-64 border-r border-slate-200 dark:border-white/5 hidden md:flex flex-col bg-slate-100 dark:bg-[#0f1629] p-4 gap-2 text-slate-700 dark:text-slate-300">
    <div className="flex items-center gap-2 mb-8 px-2">
      <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-500">
        <BrainCircuit className="w-5 h-5" />
      </div>
      <span className="font-bold text-slate-900 dark:text-white tracking-tight">Cognivio AI</span>
    </div>
    
    <div className="space-y-1">
      <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" />
      <SidebarItem active icon={<FileText size={18} />} label="Documents" />
      <SidebarItem icon={<Layers size={18} />} label="Flashcards" />
      <SidebarItem icon={<User size={18} />} label="Profile" />
    </div>

    {/* Bottom Actions */}
    <div className="mt-auto space-y-1 pt-4 border-t border-slate-200 dark:border-white/5">
        <SidebarItem icon={<Sun size={18} />} label="Light Mode" />
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5 hover:text-slate-900 dark:text-white transition-colors">
            <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] text-slate-900 dark:text-white font-medium">
                JD
            </div>
            <span>Logout</span>
        </div>
    </div>
  </div>
);

const SidebarItem = ({ active, label, icon }: { active?: boolean, label: string, icon: any }) => (
  <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-all ${active ? 'bg-blue-600 text-slate-900 dark:text-white shadow-lg shadow-blue-900/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5 hover:text-slate-200'}`}>
    {icon}
    <span>{label}</span>
  </div>
);

// --- 1. Preview View ---
const PreviewView = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full bg-white dark:bg-[#1a2333] p-8 flex justify-center overflow-y-auto">
        <div className="bg-white w-full max-w-3xl min-h-[800px] shadow-xl rounded-sm p-12 text-slate-800">
            <h1 className="text-3xl font-bold mb-6">Introduction to Software Engineering</h1>
            <div className="space-y-4">
                <div className="h-4 bg-slate-200 w-full rounded" />
                <div className="h-4 bg-slate-200 w-full rounded" />
                <div className="h-4 bg-slate-200 w-5/6 rounded" />
                <div className="h-64 bg-slate-100 w-full rounded border-2 border-dashed border-slate-300 my-8 flex items-center justify-center text-slate-600 dark:text-slate-400">Diagram Placeholder</div>
                <div className="h-4 bg-slate-200 w-full rounded" />
                <div className="h-4 bg-slate-200 w-4/5 rounded" />
            </div>
        </div>
    </motion.div>
);

// --- 2. Summary View ---
const SummaryView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full">
    <div className="flex-1 p-6 overflow-y-auto">
       <div className="flex justify-between items-center mb-6">
          <h3 className="text-slate-900 dark:text-white font-semibold flex items-center gap-2"><FileText size={18} className="text-blue-500"/> Document Summary</h3>
          <Button size="sm" variant="ghost" className="h-7 text-xs text-blue-400 bg-blue-500/10 hover:bg-blue-500/20"><Wand2 className="w-3 h-3 mr-1"/> Regenerate</Button>
       </div>
       <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300">
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-white/5">
             <h4 className="text-blue-400 font-medium mb-3 text-xs uppercase tracking-wider">Executive Summary</h4>
             <p className="leading-relaxed text-slate-700 dark:text-slate-300">Risk management is a continuous, iterative process designed to proactively identify, analyze, and mitigate uncertainties affecting software projects. By cycling through identification and strategic planning, managers minimize the impact of technical, human, and organizational disruptions.</p>
          </div>
          <div>
             <h4 className="text-slate-900 dark:text-white font-medium mb-3 text-xs uppercase tracking-wider">Key Concepts</h4>
             <ul className="space-y-3">
                <li className="flex gap-3 p-3 rounded-lg hover:bg-slate-200 dark:hover:bg-white/5 transition-colors"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" /><span className="text-slate-600 dark:text-slate-400"><strong className="text-slate-200 block mb-1">Iterative Risk Process</strong>Functions as a feedback loop consisting of four stages: Identification, Analysis, Planning, and Monitoring.</span></li>
                <li className="flex gap-3 p-3 rounded-lg hover:bg-slate-200 dark:hover:bg-white/5 transition-colors"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" /><span className="text-slate-600 dark:text-slate-400"><strong className="text-slate-200 block mb-1">Project vs Product Risks</strong>Project risks affect schedule/resources, while Product risks affect the quality or performance of the software itself.</span></li>
             </ul>
          </div>
       </div>
    </div>
  </motion.div>
);

// --- 3. Chat View ---
const ChatView = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col p-4 md:p-6 overflow-hidden max-w-full">
        <div className="flex-1 space-y-6 overflow-y-auto pr-2">
            <div className="flex gap-4 flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs text-slate-900 dark:text-white">JD</div>
                <div className="bg-blue-600 text-slate-900 dark:text-white p-3 rounded-2xl rounded-tr-none text-sm max-w-[80%]">
                    What is the main difference between project risks and business risks?
                </div>
            </div>
            <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center"><Bot size={16}/></div>
                <div className="bg-white dark:bg-[#1a2333] border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 p-4 rounded-2xl rounded-tl-none text-sm max-w-[90%] space-y-2">
                    <p>Based on the document, here is the distinction:</p>
                    <ul className="list-disc pl-4 space-y-1">
                        <li><strong>Project Risks:</strong> Affect the project schedule or resources (e.g., loss of experienced staff).</li>
                        <li><strong>Business Risks:</strong> Affect the organization causing the software to be developed (e.g., a competitor introduces a better product).</li>
                    </ul>
                </div>
            </div>
        </div>
        <div className="mt-4 relative">
            <input type="text" placeholder="Ask a follow-up question..." className="w-full bg-slate-50 dark:bg-[#131b2e] border border-slate-300 dark:border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500/50" />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 rounded-lg text-slate-900 dark:text-white"><ArrowRight size={14}/></div>
        </div>
    </motion.div>
);

// --- 4. Flashcards View ---
const FlashcardView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center p-6">
     <div className="w-full max-w-2xl aspect-[16/9] bg-white dark:bg-[#1a2333] border border-slate-200 dark:border-white/5 rounded-2xl flex flex-col items-center justify-center p-12 text-center relative cursor-pointer hover:border-blue-500/30 transition-colors shadow-2xl group perspective-1000">
        <div className="absolute top-6 left-6 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold tracking-wider">QUESTION</div>
        <h3 className="text-xl md:text-3xl text-slate-900 dark:text-white font-semibold leading-tight">What are the 4 stages of the Risk Management Process?</h3>
        <div className="absolute bottom-6 text-slate-500 dark:text-slate-400 text-xs flex items-center gap-2 group-hover:text-blue-400 transition-colors">
           <span className="animate-pulse">⟳</span> Click to flip card
        </div>
     </div>
     <div className="mt-8 flex items-center gap-6">
        <Button variant="outline" className="border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/5 gap-2"><ChevronLeft size={16}/> Prev</Button>
        <span className="text-slate-500 dark:text-slate-400 font-mono text-sm">Card 1 / 12</span>
        <Button className="bg-blue-600 text-slate-900 dark:text-white hover:bg-blue-500 gap-2">Next <ChevronRight size={16}/></Button>
     </div>
  </motion.div>
);

// --- 5. Quiz View ---
const QuizView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8 max-w-3xl mx-auto h-full flex flex-col justify-center">
    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
       <span>Question 1 of 5</span>
       <span className="text-blue-400">0/5 Answered</span>
    </div>
    <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full mb-8 overflow-hidden">
       <div className="h-full w-1/5 bg-blue-600 rounded-full" />
    </div>
    <h3 className="text-xl text-slate-900 dark:text-white font-medium mb-8 leading-relaxed">
       Your team realizes the database currently in use cannot support the required transaction volume. Which action demonstrates the most appropriate proactive risk management strategy?
    </h3>
    <div className="space-y-3">
       {["Reduce project scope to lower requirements.", "Request an immediate extension.", "Investigate acquisition of a higher-performance database.", "Allocate more staff to optimize code."].map((opt, i) => (
          <div key={i} className={`p-4 rounded-xl border ${i === 2 ? 'border-blue-500/50 bg-blue-500/10' : 'border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#131b2e] hover:bg-[#1a243a]'} cursor-pointer transition-colors flex items-center gap-3 group`}>
             <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${i === 2 ? 'border-blue-500' : 'border-slate-600 group-hover:border-slate-400'}`}>
                {i === 2 && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
             </div>
             <span className={i === 2 ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}>{opt}</span>
          </div>
       ))}
    </div>
    <div className="mt-8 flex justify-end">
        <Button className="bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white px-6">Next Question</Button>
    </div>
  </motion.div>
);

// --- 6. AI Actions View (Specific Requirement) ---
const AiActionsView = () => {
    const [subTab, setSubTab] = useState<'overview' | 'podcast' | 'concept'>('overview');

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6">
            {/* Sub-Tabs */}
            <div className="flex justify-center mb-8">
                <div className="bg-white dark:bg-[#1a2333] p-1 rounded-xl inline-flex border border-slate-200 dark:border-white/5">
                    {[
                        { id: 'overview', label: 'Overview', icon: <Mic size={14}/> },
                        { id: 'podcast', label: 'Podcast', icon: <Podcast size={14}/> },
                        { id: 'concept', label: 'Concept', icon: <Lightbulb size={14}/> }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setSubTab(item.id as any)}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                                subTab === item.id 
                                ? 'bg-blue-600 text-slate-900 dark:text-white shadow-md' 
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/5'
                            }`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-white/5 rounded-2xl p-6 relative overflow-hidden">
                <AnimatePresence mode="wait">
                    {/* Overview: Audio Player */}
                    {subTab === 'overview' && (
                        <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full flex flex-col">
                            <h3 className="text-slate-900 dark:text-white font-medium flex items-center gap-2 mb-2"><Mic className="text-blue-500 w-4 h-4" /> Voice Overview</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-xs mb-8">Generate a quick audio summary of this document.</p>
                            <div className="bg-slate-200 dark:bg-[#0b1220] border border-slate-200 dark:border-white/5 rounded-xl p-4 mt-4">
                                <div className="flex justify-between items-center text-xs text-blue-400 mb-2 font-medium">
                                    <span>NOW PLAYING</span><span>Audio Summary</span>
                                </div>
                                <div className="bg-white dark:bg-[#1a2333] rounded-lg p-3 flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-900 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"><Play size={14} fill="currentColor" /></div>
                                    <span className="text-xs text-slate-700 dark:text-slate-300 font-mono">0:00 / 2:02</span>
                                    <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full relative"><div className="absolute left-0 top-0 bottom-0 w-1/3 bg-slate-300 rounded-full" /><div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-sm" /></div>
                                    <Volume2 size={16} className="text-slate-600 dark:text-slate-400" /><MoreVertical size={16} className="text-slate-600 dark:text-slate-400" />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Podcast: Empty State */}
                    {subTab === 'podcast' && (
                        <motion.div key="podcast" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full flex flex-col">
                            <h3 className="text-slate-900 dark:text-white font-medium flex items-center gap-2 mb-2"><Podcast className="text-blue-500 w-4 h-4" /> Audio Podcast</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-xs mb-8">Turn this document into an engaging deep-dive podcast.</p>
                            <div className="flex-1 border border-dashed border-slate-300 dark:border-white/10 rounded-xl flex flex-col items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-white dark:bg-[#1a2333] flex items-center justify-center mb-4 text-blue-500"><Podcast size={24} /></div>
                                <h4 className="text-slate-900 dark:text-white font-medium mb-1">No podcast available</h4>
                                <p className="text-slate-500 dark:text-slate-400 text-xs mb-6 max-w-xs text-center">Generate a conversation-style podcast to listen on the go.</p>
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white gap-2"><PlayCircle size={14} /> Generate</Button>
                            </div>
                        </motion.div>
                    )}

                    {/* Concept: Input */}
                    {subTab === 'concept' && (
                        <motion.div key="concept" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full flex flex-col">
                            <h3 className="text-slate-900 dark:text-white font-medium flex items-center gap-2 mb-2"><Lightbulb className="text-blue-500 w-4 h-4" /> Explain Concept</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-xs mb-6">Ask the AI to explain specific topics found in the document.</p>
                            <div className="relative mb-8">
                                <input type="text" placeholder="E.g., What is the main conclusion?" className="w-full bg-slate-200 dark:bg-[#0b1220] border border-slate-300 dark:border-white/10 rounded-lg py-3 pl-4 pr-10 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500/50" readOnly />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 rounded-md text-slate-900 dark:text-white"><Lightbulb size={12} /></div>
                            </div>
                            <div className="flex-1 flex flex-col items-center justify-center opacity-40">
                                <Lightbulb size={48} className="text-slate-600 mb-4" />
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Ask a question above</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

// --- 7. Voice Chat View (Viva Mode) ---
const VoiceChatView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 h-full flex flex-col">
     <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-slate-900 dark:text-white text-lg font-semibold flex items-center gap-2">
              <Mic className="w-5 h-5 text-blue-500" /> Voice Assistant
           </h2>
           <p className="text-xs text-blue-400 font-mono mt-1">• INTERACTIVE LEARNING</p>
        </div>
        <div className="bg-white dark:bg-[#1a2333] rounded-lg p-1 flex gap-1 border border-slate-200 dark:border-white/5">
           <div className="px-3 py-1.5 rounded-md text-xs text-slate-600 dark:text-slate-400 cursor-pointer hover:text-slate-900 dark:text-white">Discuss</div>
           <div className="px-3 py-1.5 rounded-md bg-slate-200 dark:bg-[#252f42] text-xs text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-white/5 flex items-center gap-1.5">
              <BookOpen className="w-3 h-3" /> Viva Mode
           </div>
        </div>
     </div>
     <div className="flex-1 grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-white/5 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group">
           <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
           <div className="w-24 h-24 rounded-full border-2 border-blue-500/30 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full animate-pulse" />
              <Bot className="w-10 h-10 text-blue-400" />
           </div>
           <div className="mt-4 text-center">
              <div className="text-slate-900 dark:text-white font-medium">Cognivio AI</div>
              <div className="text-xs text-blue-400/80 mt-1 bg-blue-500/10 px-2 py-0.5 rounded-full inline-block border border-blue-500/20">LISTENING...</div>
           </div>
        </div>
        <div className="bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-white/5 rounded-2xl flex flex-col items-center justify-center relative">
           <div className="w-24 h-24 rounded-full border-2 border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center">
              <span className="text-slate-600 dark:text-slate-400 text-sm">User</span>
           </div>
           <div className="mt-4 text-center">
              <div className="text-slate-700 dark:text-slate-300 font-medium">You</div>
              <div className="text-xs text-slate-600 mt-1">MICROPHONE OFF</div>
           </div>
        </div>
     </div>
     <div className="h-20 bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-white/5 rounded-2xl p-4 flex gap-4 items-center">
        <div className="h-full aspect-square bg-blue-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20 group">
           <Mic className="text-slate-900 dark:text-white w-5 h-5 group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex-1 h-full flex items-center px-4">
           <div className="flex gap-1 items-end h-8 w-full opacity-50">
              {[...Array(30)].map((_, i) => (
                  <div key={i} className="w-1 bg-blue-500 rounded-full" style={{ height: `${Math.random() * 100}%`}} />
              ))}
           </div>
        </div>
     </div>
  </motion.div>
);

// --- 8. Video Overview View ---
const VideoOverviewView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col p-6">
      <div className="w-full aspect-video bg-black rounded-xl border border-slate-300 dark:border-white/10 flex items-center justify-center relative group cursor-pointer overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8 z-10">
              <div>
                  <h3 className="text-slate-900 dark:text-white font-bold text-2xl mb-1">Navigating Project Risk</h3>
                  <p className="text-slate-700 dark:text-slate-300 text-sm">Chapter 22 • Deep Dive</p>
              </div>
          </div>
          <PlayCircle className="w-20 h-20 text-slate-900 dark:text-white opacity-80 group-hover:scale-110 transition-transform z-20" />
      </div>
      <div className="mt-6 flex gap-6">
          <div className="w-64 hidden lg:block space-y-2">
              <h4 className="text-slate-900 dark:text-white font-medium mb-3">Timestamps</h4>
              <div className="text-sm p-2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 cursor-pointer">0:00 Intro to Risk</div>
              <div className="text-sm p-2 rounded hover:bg-slate-200 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 cursor-pointer">2:15 Risk Identification</div>
              <div className="text-sm p-2 rounded hover:bg-slate-200 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 cursor-pointer">5:40 Mitigation Strategies</div>
          </div>
          <div className="flex-1">
              <h4 className="text-slate-900 dark:text-white font-medium mb-3">Transcript Segment</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  "...so when we talk about <span className="text-slate-900 dark:text-white bg-blue-500/20">project risk</span>, we are really discussing the uncertainties that threaten the schedule. Now, contrast that with product risk..."
              </p>
          </div>
      </div>
  </motion.div>
);

// ==========================================
//    MAIN PAGE COMPONENT
// ==========================================

export default function Home() {
  const [activeTab, setActiveTab] = useState("AI Actions");

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans selection:bg-primary/10 overflow-x-hidden">
      <Navbar />
      
      <main className="flex-1">
        
        {/* ================= HERO SECTION ================= */}
        <section className="relative pt-24 pb-20 md:pt-36 md:pb-32 overflow-hidden border-b border-border/40">
          
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-blue-500/10 blur-[120px] rounded-full mix-blend-screen opacity-50" />
             <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.2)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          </div>

          <div className="container px-4 mx-auto relative z-10">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
                <Sparkles className="w-3 h-3" />
                <span>AI Learning Assistant</span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tighter mb-6">
                Turn study materials <br/>
                into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">interactive mastery.</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                Cognivio isn't just a chatbot. It's a complete study workspace that generates 
                <span className="text-foreground font-medium"> summaries, flashcards, quizzes, voice simulations</span> and 
                <span className="text-foreground font-medium"> video overviews</span> from your uploaded material.
              </motion.p>

              <div className="flex gap-4 justify-center">
                <Link href="/register">
                    <Button size="lg" className="rounded-full px-8 h-12 shadow-lg shadow-blue-500/20">Get Started<ArrowRight className="ml-2 w-4 h-4"/></Button>
                </Link>
              </div>
            </div>

            {/* --- DASHBOARD MOCKUP --- */}
            <motion.div 
              initial={{ opacity: 0, y: 50, rotateX: 5 }} 
              animate={{ opacity: 1, y: 0, rotateX: 0 }} 
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 relative mx-auto max-w-6xl"
            >
              <div className="bg-slate-50 dark:bg-[#0B1220] rounded-xl border border-slate-300 dark:border-white/10 shadow-2xl ring-1 ring-slate-200 dark:ring-white/5 overflow-hidden font-sans flex flex-col h-[500px] md:h-[600px] lg:h-[700px] w-full">
                 
                 {/* Top Navigation */}
                 <div className="h-14 border-b border-slate-200 dark:border-white/5 flex items-center px-2 md:px-6 bg-slate-50 dark:bg-[#0B1220] shrink-0 gap-2 md:gap-6 w-full">
                    <div className="hidden md:flex items-center gap-2 text-sm text-slate-400 min-w-fit">
                       <FileText className="w-4 h-4" />
                       <span className="font-medium">SE_Lecture_Week4.pdf</span>
                    </div>
                    <div className="h-4 w-px bg-white/10 hidden md:block" />
                    
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar mask-gradient-x w-full">
                       {['Preview', 'Summary', 'Chat', 'Flashcards', 'Quiz', 'AI Actions', 'Voice Chat', 'Video Overview'].map((tab) => (
                          <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                               activeTab === tab 
                               ? 'bg-blue-600 text-white shadow-sm' 
                               : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                            }`}
                          >
                             {tab}
                          </button>
                       ))}
                    </div>
                 </div>

                 <div className="flex flex-1 overflow-hidden">
                    <Sidebar />
                    
                    {/* Render Active View */}
                    <div className="flex-1 bg-slate-50 dark:bg-[#0B1220] relative overflow-hidden w-full">
                       <AnimatePresence mode="wait">
                          {activeTab === 'Preview' && <PreviewView key="preview" />}
                          {activeTab === 'Summary' && <SummaryView key="summary" />}
                          {activeTab === 'Chat' && <ChatView key="chat" />}
                          {activeTab === 'Flashcards' && <FlashcardView key="flashcards" />}
                          {activeTab === 'Quiz' && <QuizView key="quiz" />}
                          {activeTab === 'AI Actions' && <AiActionsView key="actions" />}
                          {activeTab === 'Voice Chat' && <VoiceChatView key="voice" />}
                          {activeTab === 'Video Overview' && <VideoOverviewView key="video" />}
                       </AnimatePresence>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ================= FEATURES SECTION ================= */}
        <section id="features" className="py-24 bg-muted/20 relative">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">The complete learning engine</h2>
              <p className="text-muted-foreground text-lg">
                Everything you need to go from "confused" to "confident" in one platform.
              </p>
            </div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]"
            >
              
              <BentoCard 
                colSpan="md:col-span-2 lg:col-span-2"
                rowSpan="row-span-2"
                title="Chat with Context"
                description="Stop searching. Ask complex questions and get answers cited directly from your lecture notes."
                icon={<MessageSquare className="text-primary" />}
                className="bg-gradient-to-br from-card to-background"
              >
                 <div className="absolute bottom-6 right-6 left-6 space-y-3 opacity-90">
                   <div className="p-3 bg-muted rounded-2xl rounded-tl-none text-xs text-muted-foreground w-3/4">
                      Where did the professor mention 'entropy'?
                   </div>
                   <div className="p-3 bg-primary/10 border border-primary/20 rounded-2xl rounded-tr-none text-xs text-foreground w-full ml-auto shadow-sm">
                      <span className="font-semibold text-primary block mb-1">Source: Week 2 - Slide 14</span>
                      Entropy was defined as the measure of disorder...
                   </div>
                </div>
              </BentoCard>

              <BentoCard 
                colSpan="md:col-span-2 lg:col-span-2"
                title="Voice Chat & Viva Mode"
                description="Real-time voice interaction. Switch to 'Viva Mode' for rigorous oral exam simulation."
                icon={<Mic className="text-indigo-500" />}
                className="overflow-hidden flex flex-col justify-between"
              >
                 <div className="absolute top-4 right-4 flex gap-1">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-muted text-muted-foreground border border-border">Discuss</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-primary/10 text-primary border border-primary/20 font-medium">Viva Mode</span>
                 </div>
                 <div className="mt-6 flex items-end justify-center gap-1 h-12 w-full opacity-70">
                    {[...Array(20)].map((_, i) => (
                       <motion.div
                          key={i}
                          animate={{ height: ["20%", "80%", "20%"] }}
                          transition={{ 
                             duration: 1.2, 
                             repeat: Infinity, 
                             delay: i * 0.05,
                             ease: "easeInOut" 
                          }}
                          className="w-1.5 bg-indigo-500 rounded-full"
                       />
                    ))}
                 </div>
              </BentoCard>

              <BentoCard 
                colSpan="md:col-span-1 lg:col-span-1"
                title="Smart Summaries"
                description="Condense 50 pages into 1 page of actionable insights."
                icon={<FileText className="text-cyan-600" />}
              />

              <BentoCard 
                colSpan="md:col-span-1 lg:col-span-1"
                title="Instant Quizzes"
                description="Test knowledge immediately with AI-generated MCQs."
                icon={<Zap className="text-sky-500" />}
              >
                 <div className="absolute bottom-4 right-4 opacity-10">
                    <CheckCircle2 className="w-16 h-16" />
                 </div>
              </BentoCard>

              <BentoCard 
                colSpan="md:col-span-1 lg:col-span-1"
                title="AI Actions"
                description="Overview, Podcast, and Concept Explainer tools."
                icon={<Sparkles className="text-teal-500" />}
              >
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="text-[10px] px-2 py-1 rounded bg-muted border border-border">Podcast</span>
                    <span className="text-[10px] px-2 py-1 rounded bg-muted border border-border">Concept</span>
                 </div>
              </BentoCard>

              <BentoCard 
                colSpan="md:col-span-1 lg:col-span-1"
                rowSpan="md:row-span-2"
                title="Video Overview"
                description="Instantly generate AI-powered video explanations with dynamic visuals and natural voice narration."
                icon={<Video className="text-violet-500" />}
              >
                 <div className="absolute inset-x-4 bottom-4 h-32 bg-muted rounded-lg border border-border overflow-hidden group-hover:border-violet-500/30 transition-colors">
                   <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                      <div className="w-10 h-10 rounded-full bg-background/90 flex items-center justify-center shadow-lg">
                         <PlayCircle className="w-6 h-6 text-foreground fill-foreground/20" />
                      </div>
                   </div>
                   <div className="absolute bottom-0 left-0 h-1 bg-violet-500 w-1/3" />
                </div>
              </BentoCard>

              <BentoCard 
                colSpan="md:col-span-2 lg:col-span-2"
                title="Podcast Overview"
                description="Turn your notes into an audio podcast. Listen while you commute."
                icon={<Podcast className="text-slate-500" />}
              >
                  <div className="flex items-center gap-3 mt-4 p-3 bg-muted/40 rounded-xl border border-border/50">
                     <div className="w-8 h-8 rounded-full bg-slate-500 flex items-center justify-center text-white text-xs">
                        <Podcast className="w-4 h-4" />
                     </div>
                     <div className="flex-1">
                        <div className="h-1.5 bg-foreground/10 rounded-full w-full mb-1">
                           <div className="h-full bg-slate-500 rounded-full w-1/2" />
                        </div>
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                           <span>04:20</span>
                           <span>12:00</span>
                        </div>
                     </div>
                  </div>
              </BentoCard>

              <BentoCard 
                colSpan="md:col-span-1 lg:col-span-1"
                title="Flashcards"
                description="Spaced repetition made automatic."
                icon={<Layers className="text-emerald-600" />}
              >
                 <div className="mt-4 flex gap-1 justify-center opacity-50">
                    <div className="w-8 h-10 border border-current rounded bg-background" />
                    <div className="w-8 h-10 border border-current rounded bg-background -mt-2" />
                    <div className="w-8 h-10 border border-current rounded bg-background" />
                 </div>
              </BentoCard>

            </motion.div>
          </div>
        </section>

        {/* ================= HOW IT WORKS (Moved Below Features) ================= */}
        <section id="how-it-works" className="py-24 bg-background relative border-t border-border/40">
           <div className="container px-4 mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">From Chaos to Clarity</h2>
                    <p className="text-muted-foreground text-lg">Your journey to mastery in three simple steps.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-12 relative max-w-5xl mx-auto">
                    <div className="hidden md:block absolute top-[2.5rem] left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-border to-transparent z-0" />

                    <StepCard 
                        number="01"
                        title="Upload"
                        desc="Drag & drop your material (PDFs, PPTs, DOCs etc) or paste text directly."
                        icon={<Upload className="w-5 h-5 text-white" />}
                        gradient="bg-gradient-to-br from-blue-500 to-blue-600"
                    />
                     <StepCard 
                        number="02"
                        title="Analyze"
                        desc="Our AI instantly structures your content, finding key concepts and creating links."
                        icon={<Brain className="w-5 h-5 text-white" />}
                        gradient="bg-gradient-to-br from-indigo-500 to-indigo-600"
                    />
                     <StepCard 
                        number="03"
                        title="Master"
                        desc="Transform your material into mastery with AI-generated summaries, quizzes, flashcards, voice explanations, video overviews, and live tutor chat with viva mode."
                        icon={<Trophy className="w-5 h-5 text-white" />}
                        gradient="bg-gradient-to-br from-cyan-500 to-cyan-600"
                    />
                </div>
           </div>
        </section>

        {/* ================= CTA SECTION ================= */}
        <section className="py-16 md:py-32 relative overflow-hidden bg-background border-t border-border/50">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.1),transparent_50%)]" />
           
           <div className="container px-4 mx-auto relative z-10 text-center">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 text-foreground">
                 Master your material today.
              </h2>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                 <Link href="/register">
                    <Button size="lg" className="h-14 px-10 rounded-full text-lg shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-105 transition-all font-semibold">
                       Start Learning 
                    </Button>
                 </Link>
              </div>
           </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

// --- Helper Components ---

function StepCard({ number, title, desc, icon, gradient }: { number: string, title: string, desc: string, icon: any, gradient: string }) {
    return (
        <motion.div 
            variants={fadeInUp}
            className="text-center relative z-10"
        >
            <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-6 shadow-xl ${gradient} ring-4 ring-background`}>
                {icon}
            </div>
            <div className="text-xs font-bold text-primary mb-2 tracking-wider">STEP {number}</div>
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-muted-foreground leading-relaxed text-sm max-w-xs mx-auto">{desc}</p>
        </motion.div>
    )
}

interface BentoCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  colSpan?: string;
  rowSpan?: string;
  children?: React.ReactNode;
  className?: string;
}

function BentoCard({ title, description, icon, colSpan = "", rowSpan = "", children, className = "" }: BentoCardProps) {
  return (
    <motion.div 
      variants={fadeInUp}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`
        group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 shadow-sm hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 flex flex-col
        ${colSpan} ${rowSpan} ${className}
      `}
    >
      <div className="mb-4 w-10 h-10 rounded-xl bg-background border border-border/60 flex items-center justify-center shadow-sm text-foreground">
        {icon}
      </div>
      
      <div className="relative z-10 mb-2">
        <h3 className="font-bold text-lg text-foreground tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mt-2">{description}</p>
      </div>

      {children && (
        <div className="mt-4 flex-1 w-full relative">
          {children}
        </div>
      )}
    </motion.div>
  );
}