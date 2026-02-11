"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, MessageSquare, Zap, FileText, Mic, ArrowRight, 
  PlayCircle, Layers, LayoutDashboard, User, Bot, 
  BookOpen, Wand2, BrainCircuit, LogOut, Podcast, 
  CheckCircle2, Search, BarChart3
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

// --- Components for the Interactive Mockup ---

const Sidebar = () => (
  <div className="w-64 border-r border-white/5 hidden md:flex flex-col bg-[#0f1629] p-4 gap-2">
    <div className="flex items-center gap-2 mb-8 px-2">
      <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-500">
        <BrainCircuit className="w-5 h-5" />
      </div>
      <span className="font-bold text-white tracking-tight">Cognivio AI</span>
    </div>
    
    <div className="space-y-1">
      <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" />
      <SidebarItem active icon={<FileText size={18} />} label="Documents" />
      <SidebarItem icon={<Layers size={18} />} label="Flashcards" />
      <SidebarItem icon={<User size={18} />} label="Profile" />
    </div>

    <div className="mt-auto pt-4 border-t border-white/5 flex items-center gap-3 px-2">
      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white font-medium">
        JD
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="text-sm text-white truncate">John Doe</div>
        <div className="text-xs text-slate-500 truncate">Free Plan</div>
      </div>
      <div className="p-1.5 rounded-md hover:bg-white/5 cursor-pointer text-slate-500 hover:text-white transition-colors">
         <LogOut size={16} />
      </div>
    </div>
  </div>
);

const SidebarItem = ({ active, label, icon }: { active?: boolean, label: string, icon: any }) => (
  <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-all ${active ? 'bg-blue-600/10 text-blue-400 font-medium' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}>
    {icon}
    <span>{label}</span>
  </div>
);

// --- Mockup Views ---
const SummaryView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full">
    <div className="w-1/2 border-r border-white/5 p-6 hidden lg:block bg-[#0B1220]">
       <div className="bg-white h-full w-full rounded-sm shadow-sm p-8 opacity-90 scale-95 origin-top">
          <div className="h-4 bg-gray-200 w-3/4 mb-8" />
          <div className="space-y-3">
             <div className="h-2 bg-gray-100 w-full" />
             <div className="h-2 bg-gray-100 w-full" />
             <div className="h-2 bg-gray-100 w-5/6" />
             <div className="h-20 bg-blue-50/50 w-full rounded border border-blue-100 my-4" />
             <div className="h-2 bg-gray-100 w-full" />
          </div>
       </div>
    </div>
    <div className="flex-1 p-6 overflow-y-auto">
       <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-semibold">Document Summary</h3>
          <Button size="sm" variant="ghost" className="h-7 text-xs text-blue-400 bg-blue-500/10 hover:bg-blue-500/20"><Wand2 className="w-3 h-3 mr-1"/> Regenerate</Button>
       </div>
       <div className="space-y-6 text-sm text-slate-300">
          <div className="p-4 rounded-xl bg-[#131b2e] border border-white/5">
             <h4 className="text-blue-400 font-medium mb-2">Executive Summary</h4>
             <p className="leading-relaxed text-slate-400">Risk management is a continuous, iterative process designed to proactively identify, analyze, and mitigate uncertainties affecting software projects.</p>
          </div>
          <div>
             <h4 className="text-white font-medium mb-2">Key Concepts</h4>
             <ul className="space-y-3">
                <li className="flex gap-2"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" /><span className="text-slate-400"><strong className="text-slate-200">Iterative Risk Process:</strong> Functions as a feedback loop consisting of Identification, Analysis, Planning, and Monitoring.</span></li>
             </ul>
          </div>
       </div>
    </div>
  </motion.div>
);

const QuizView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8 max-w-3xl mx-auto h-full flex flex-col justify-center">
    <div className="flex justify-between text-sm text-slate-400 mb-2">
       <span>Question 1 of 5</span>
       <span>0/5 Answered</span>
    </div>
    <div className="h-1.5 w-full bg-slate-800 rounded-full mb-8 overflow-hidden">
       <div className="h-full w-1/5 bg-blue-600 rounded-full" />
    </div>
    <h3 className="text-xl text-white font-medium mb-6 leading-relaxed">
       Your team realizes the database currently in use cannot support the required transaction volume. Which action demonstrates the most appropriate proactive risk management strategy?
    </h3>
    <div className="space-y-3">
       {["Reduce project scope to lower requirements.", "Request an immediate extension.", "Investigate acquisition of a higher-performance database.", "Allocate more staff to optimize code."].map((opt, i) => (
          <div key={i} className={`p-4 rounded-xl border ${i === 2 ? 'border-blue-500/50 bg-blue-500/10' : 'border-white/5 bg-[#131b2e] hover:bg-[#1a243a]'} cursor-pointer transition-colors flex items-center gap-3 group`}>
             <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${i === 2 ? 'border-blue-500' : 'border-slate-600 group-hover:border-slate-400'}`}>
                {i === 2 && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
             </div>
             <span className={i === 2 ? 'text-white' : 'text-slate-400'}>{opt}</span>
          </div>
       ))}
    </div>
  </motion.div>
);

const FlashcardView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center p-6">
     <div className="w-full max-w-2xl aspect-[16/9] bg-[#0f1629] border border-white/5 rounded-2xl flex flex-col items-center justify-center p-12 text-center relative cursor-pointer hover:border-blue-500/30 transition-colors shadow-2xl">
        <div className="absolute top-6 left-6 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold tracking-wider">QUESTION</div>
        <h3 className="text-2xl md:text-3xl text-white font-semibold">Target of "Project Risks" vs "Product Risks"</h3>
        <div className="absolute bottom-6 text-slate-500 text-xs flex items-center gap-2">
           <span className="animate-pulse">⟳</span> Tap to flip
        </div>
     </div>
     <div className="mt-8 flex items-center gap-6">
        <Button variant="outline" className="border-white/10 text-slate-400 hover:text-white hover:bg-white/5">Previous</Button>
        <Button className="bg-blue-600 text-white hover:bg-blue-500">Next Card</Button>
     </div>
  </motion.div>
);

const VoiceView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 h-full flex flex-col">
     <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-white text-lg font-semibold flex items-center gap-2">
              <Mic className="w-5 h-5 text-blue-500" /> Voice Assistant
           </h2>
           <p className="text-xs text-blue-400 font-mono mt-1">• INTERACTIVE LEARNING</p>
        </div>
        <div className="bg-[#1a2333] rounded-lg p-1 flex gap-1 border border-white/5">
           <div className="px-3 py-1.5 rounded-md text-xs text-slate-400 cursor-pointer hover:text-white">Discuss</div>
           <div className="px-3 py-1.5 rounded-md bg-[#252f42] text-xs text-white shadow-sm border border-white/5 flex items-center gap-1.5">
              <BookOpen className="w-3 h-3" /> Viva Mode
           </div>
        </div>
     </div>
     <div className="flex-1 grid grid-cols-2 gap-4 mb-4">
        <div className="bg-[#0f1629] border border-white/5 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group">
           <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
           <div className="w-24 h-24 rounded-full border-2 border-blue-500/30 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full animate-pulse" />
              <Bot className="w-10 h-10 text-blue-400" />
           </div>
           <div className="mt-4 text-center">
              <div className="text-white font-medium">Cognivio AI</div>
              <div className="text-xs text-blue-400/80 mt-1 bg-blue-500/10 px-2 py-0.5 rounded-full inline-block border border-blue-500/20">LISTENING...</div>
           </div>
        </div>
        <div className="bg-[#0f1629] border border-white/5 rounded-2xl flex flex-col items-center justify-center relative">
           <div className="w-24 h-24 rounded-full border-2 border-slate-700 bg-slate-800/50 flex items-center justify-center">
              <span className="text-slate-400 text-sm">User</span>
           </div>
           <div className="mt-4 text-center">
              <div className="text-slate-300 font-medium">You</div>
              <div className="text-xs text-slate-600 mt-1">MICROPHONE OFF</div>
           </div>
        </div>
     </div>
     <div className="h-24 bg-[#0f1629] border border-white/5 rounded-2xl p-4 flex gap-4 items-center">
        <div className="h-full aspect-square bg-blue-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20 group">
           <Mic className="text-white w-6 h-6 group-hover:scale-110 transition-transform" />
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

export default function Home() {
  const [activeTab, setActiveTab] = useState("Summary");

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
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-12">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                <Sparkles className="w-3 h-3" />
                <span>AI Learning Assistant V2.0</span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
                Turn study materials <br/>
                into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">interactive mastery.</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                Cognivio isn't just a chatbot. It's a complete study workspace that generates 
                <span className="text-foreground font-medium"> summaries, flashcards, quizzes,</span> and 
                <span className="text-foreground font-medium"> voice simulations</span> from your documents.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex gap-4 justify-center">
                <Link href="/register">
                    <Button size="lg" className="rounded-full px-8 h-12 shadow-lg shadow-primary/20">Get Started Free <ArrowRight className="ml-2 w-4 h-4"/></Button>
                </Link>
              </motion.div>
            </div>

            {/* --- INTERACTIVE DASHBOARD MOCKUP --- */}
            <motion.div 
              initial={{ opacity: 0, y: 50, rotateX: 5 }} 
              animate={{ opacity: 1, y: 0, rotateX: 0 }} 
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-12 relative mx-auto max-w-6xl"
            >
              <div className="bg-[#0B1220] rounded-xl border border-white/10 shadow-2xl ring-1 ring-white/5 overflow-hidden font-sans flex flex-col h-[600px] md:h-[700px]">
                 <div className="h-14 border-b border-white/5 flex items-center px-4 md:px-6 bg-[#0B1220] shrink-0">
                    <div className="hidden md:flex items-center gap-2 text-sm text-slate-400 mr-8 border-r border-white/5 pr-6 h-8">
                       <FileText className="w-4 h-4" />
                       <span className="truncate max-w-[150px]">Software_Eng_Lecture_4.pdf</span>
                    </div>
                    <div className="flex items-center gap-1 md:gap-2 overflow-x-auto no-scrollbar w-full">
                       {['Summary', 'Chat', 'Flashcards', 'Quiz', 'Voice', 'Video'].map((tab) => (
                          <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                               activeTab === tab 
                               ? 'bg-blue-600 text-white shadow-sm' 
                               : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                            }`}
                          >
                             {tab === 'Voice' && <span className="mr-1.5 inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
                             {tab}
                          </button>
                       ))}
                    </div>
                 </div>

                 <div className="flex flex-1 overflow-hidden">
                    <Sidebar />
                    <div className="flex-1 bg-[#0B1220] relative overflow-hidden">
                       <AnimatePresence mode="wait">
                          {activeTab === 'Summary' && <SummaryView key="summary" />}
                          {activeTab === 'Chat' && (
                             <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex items-center justify-center text-slate-500">
                                <div className="text-center">
                                   <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                   <p>Chat interface placeholder</p>
                                </div>
                             </motion.div>
                          )}
                          {activeTab === 'Flashcards' && <FlashcardView key="flashcards" />}
                          {activeTab === 'Quiz' && <QuizView key="quiz" />}
                          {activeTab === 'Voice' && <VoiceView key="voice" />}
                          {activeTab === 'Video' && (
                             <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex items-center justify-center">
                                 <PlayCircle className="w-16 h-16 text-white opacity-50" />
                             </motion.div>
                          )}
                       </AnimatePresence>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ================= BENTO GRID FEATURES ================= */}
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
              className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]"
            >
              
              {/* 1. Chat (Blue/Primary) */}
              <BentoCard 
                colSpan="md:col-span-3 lg:col-span-2"
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

              {/* 2. Voice/Viva (Indigo/Blue-Violet) */}
              <BentoCard 
                colSpan="md:col-span-3 lg:col-span-2"
                title="Voice Chat & Viva Mode"
                description="Real-time voice interaction. Switch to 'Viva Mode' for rigorous oral exam simulation."
                icon={<Mic className="text-indigo-500" />}
                className="overflow-hidden flex flex-col justify-between"
              >
                 <div className="absolute top-4 right-4 flex gap-1">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-muted text-muted-foreground border border-border">Discuss</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-primary/10 text-primary border border-primary/20 font-medium">Viva Mode</span>
                 </div>
                 
                 {/* Fixed: Moved animation to bottom flow to avoid overlap */}
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

              {/* 3. Summary (Cyan) */}
              <BentoCard 
                colSpan="md:col-span-2 lg:col-span-1"
                title="Smart Summaries"
                description="Condense 50 pages into 1 page of actionable insights."
                icon={<FileText className="text-cyan-600" />}
              >
                  <div className="mt-4 space-y-2 opacity-30">
                     <div className="h-2 w-full bg-foreground rounded-full"/>
                     <div className="h-2 w-5/6 bg-foreground rounded-full"/>
                     <div className="h-2 w-4/6 bg-foreground rounded-full"/>
                  </div>
              </BentoCard>

              {/* 4. Quiz (Sky Blue) */}
              <BentoCard 
                colSpan="md:col-span-2 lg:col-span-1"
                title="Instant Quizzes"
                description="Test knowledge immediately with AI-generated MCQs."
                icon={<Zap className="text-sky-500" />}
              >
                 <div className="absolute bottom-4 right-4 opacity-10">
                    <CheckCircle2 className="w-16 h-16" />
                 </div>
              </BentoCard>

              {/* 5. AI Actions (Teal) */}
              <BentoCard 
                colSpan="md:col-span-2 lg:col-span-1"
                title="AI Actions"
                description="'Explain Like I'm 5', 'Find Contradictions', 'Extract Dates'."
                icon={<Sparkles className="text-teal-500" />}
              >
                 <div className="flex flex-wrap gap-2 mt-4">
                    <span className="text-[10px] px-2 py-1 rounded bg-muted border border-border">Simplify</span>
                    <span className="text-[10px] px-2 py-1 rounded bg-muted border border-border">Analyze</span>
                 </div>
              </BentoCard>

              {/* 6. Video Overview (Violet/Purple - Cool Tone) */}
              <BentoCard 
                colSpan="md:col-span-3 lg:col-span-1"
                rowSpan="md:row-span-2"
                title="Video Overview"
                description="Upload MP4s. Get transcripts, key moments, and searchable clips."
                icon={<PlayCircle className="text-violet-500" />}
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

              {/* 7. Podcast Mode (Slate) */}
              <BentoCard 
                colSpan="md:col-span-3 lg:col-span-2"
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

              {/* 8. Flashcards (Emerald - Cool Green) */}
              <BentoCard 
                colSpan="md:col-span-3 lg:col-span-1"
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

        {/* ================= CTA SECTION ================= */}
        <section className="py-32 relative overflow-hidden bg-background border-t border-border/50">
           {/* Subtle Radial Glow matching Primary */}
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.1),transparent_50%)]" />
           
           <div className="container px-4 mx-auto relative z-10 text-center">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 text-foreground">
                 Master your material today.
              </h2>
              <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
                 Join thousands of students using Cognivio to spend less time organizing and more time understanding.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                 <Link href="/register">
                    <Button size="lg" className="h-14 px-10 rounded-full text-lg shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-105 transition-all font-semibold">
                       Start Learning Free
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

// --- Reusable Bento Card ---

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