"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { BrainCircuit, Sparkles, Menu } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 max-w-screen-2xl items-center mx-auto px-4 justify-between">
        
        {/* Logo Area */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors border border-primary/20">
               <BrainCircuit className="h-5 w-5 text-primary" />
               <div className="absolute inset-0 bg-primary/20 blur-[10px] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground">
              Cognivio<span className="text-primary">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="/#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              Methodology
            </Link>
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            
            {isAuthenticated ? (
              <>
                 <span className="text-sm text-muted-foreground">
                   Hi, {user?.username}
                 </span>
                 <Link href="/dashboard">
                    <Button size="sm" className="rounded-full px-5 font-medium shadow-lg shadow-primary/20">
                      Dashboard
                    </Button>
                 </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    Sign in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="rounded-full px-5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg shadow-primary/25 transition-all hover:scale-105">
                    Get Started <Sparkles className="w-3 h-3 ml-2 opacity-70" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
}