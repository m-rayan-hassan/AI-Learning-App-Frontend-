"use client";

import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, Brain, MessageSquare, Zap, FileText } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href="#"
                className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
              >
                Follow along on Twitter
              </Link>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 dark:to-blue-400"
            >
              Unlock Your Learning Potential with AI
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8"
            >
              Upload documents, generate quizzes, flashcards, and summaries instantly. Experience the future of learning with Aura Learn AI.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-x-4"
            >
              <Link href="/register">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        <section
          id="features"
          className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24 mx-auto px-4"
        >
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl font-bold">
              Features
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Everything you need to master your study materials.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
             <FeatureCard
              icon={<Brain className="h-10 w-10 text-primary" />}
              title="AI Summaries"
              description="Instantly generate concise summaries of your documents."
              delay={0.1}
            />
            <FeatureCard
              icon={<Zap className="h-10 w-10 text-primary" />}
              title="Instant Quizzes"
              description="Test your knowledge with AI-generated quizzes from your content."
              delay={0.2}
            />
            <FeatureCard
              icon={<GraduationCap className="h-10 w-10 text-primary" />}
              title="Flashcards"
              description="Create study decks automatically to memorize key concepts."
              delay={0.3}
            />
             <FeatureCard
              icon={<MessageSquare className="h-10 w-10 text-primary" />}
              title="Chat with Doc"
              description="Ask questions and get answers directly from your documents."
              delay={0.4}
            />
             <FeatureCard
              icon={<FileText className="h-10 w-10 text-primary" />}
              title="Voice Overview"
              description="Listen to an audio overview of your study materials."
              delay={0.5}
            />
             <FeatureCard
              icon={<Brain className="h-10 w-10 text-primary" />}
              title="Concept Explanation"
              description="Get simple explanations for complex topics."
              delay={0.6}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="relative overflow-hidden rounded-lg border bg-background p-2"
    >
      <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
        {icon}
        <div className="space-y-2">
          <h3 className="font-bold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}
