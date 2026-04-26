"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { cn } from "@/utils/cn"; // or "@/lib/utils"
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  Layers,
  User,
  LogOut,
  Moon,
  Sun,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import Image from "next/image";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FileText, label: "Documents", href: "/documents" },
  { icon: Layers, label: "Flashcards", href: "/flashcards" },
  { icon: User, label: "Profile", href: "/profile" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();

  // Prevent Next.js hydration mismatch on theme toggle
  const [mounted, setMounted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    // Added a subtle drop shadow to the entire sidebar so it pops off the page background
    <aside
      className={cn(
        "relative flex flex-col h-screen w-full transition-all duration-300 border-r border-border/70 bg-muted/20 py-6 shrink-0 selection:bg-primary/10 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10",
        isCollapsed ? "md:w-[88px] px-3" : "md:w-[260px] px-4",
      )}
    >
      {/* ── Header: Logo + Collapse Button ── */}
      <div
        className={cn(
          "flex items-center mb-8 w-full",
          isCollapsed
            ? "flex-col gap-4 mt-2"
            : "justify-between pl-2 pr-1 mt-1",
        )}
      >
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center group relative z-20 cursor-pointer overflow-hidden",
            isCollapsed ? "justify-center w-full" : "gap-3.5",
          )}
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-b from-primary/10 to-primary/5 border border-primary/20 shadow-[0_2px_8px_rgba(0,0,0,0.04),0_1px_0_rgba(255,255,255,0.6)_inset] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2),0_1px_0_rgba(255,255,255,0.05)_inset] group-hover:scale-[1.02] transition-transform duration-300 shrink-0">
            <Image
              src="/app_logo.png"
              alt="Cognivio AI Logo"
              width={32}
              height={32}
              className="object-contain z-10"
              priority
            />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-[22px] tracking-tight text-foreground drop-shadow-sm whitespace-nowrap">
              Cognivio<span className="text-primary">AI</span>
            </span>
          )}
        </Link>

        {/* ── Collapse Toggle Button ── */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex h-8 w-8 bg-background border border-border/80 rounded-xl items-center justify-center text-muted-foreground hover:text-foreground hover:shadow-sm transition-all z-50 shadow-[0_2px_8px_rgba(0,0,0,0.04)] shrink-0"
        >
          {isCollapsed ? (
            <PanelLeftOpen size={16} />
          ) : (
            <PanelLeftClose size={16} />
          )}
        </button>
      </div>

      {/* ── Main Navigation ── */}
      <nav className="flex-1 space-y-2 overflow-x-hidden">
        {!isCollapsed ? (
          <div className="px-3 text-[10px] font-extrabold uppercase tracking-[0.15em] text-muted-foreground/60 mb-3 mt-4 whitespace-nowrap">
            Main Menu
          </div>
        ) : (
          <div className="h-6 mb-3 mt-4" />
        )}

        {sidebarItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                "flex items-center h-11 rounded-xl transition-all duration-200 group relative",
                isCollapsed ? "justify-center px-0 w-full" : "gap-3.5 px-3.5",
                isActive
                  ? // 3D Active State: Gradient background + Border + Drop Shadow + White Top Inner Bevel
                    "bg-gradient-to-b from-card to-card/95 border border-border/80 text-primary font-semibold shadow-[0_2px_10px_rgba(0,0,0,0.04),0_1px_0_rgba(255,255,255,0.7)_inset] dark:shadow-[0_2px_10px_rgba(0,0,0,0.2),0_1px_0_rgba(255,255,255,0.06)_inset]"
                  : // 3D Hover State
                    "text-muted-foreground hover:bg-card/60 hover:border-border/50 hover:shadow-[0_2px_8px_rgba(0,0,0,0.02),0_1px_0_rgba(255,255,255,0.4)_inset] dark:hover:shadow-[0_2px_8px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,0.03)_inset] hover:text-foreground font-medium border border-transparent",
              )}
            >
              {/* Glowing Active Indicator Pill */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-primary rounded-r-full shadow-[0_0_8px_hsl(var(--primary)/0.6)]" />
              )}

              <item.icon
                size={18}
                strokeWidth={2.2}
                className={cn(
                  "shrink-0 transition-transform duration-200",
                  isActive
                    ? "text-primary scale-100"
                    : "text-muted-foreground group-hover:scale-110 group-hover:text-foreground",
                )}
              />
              {!isCollapsed && (
                <span className="text-[14px] leading-none mt-0.5 whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom Actions ── */}
      <div className="mt-auto pt-5 border-t border-border/60 space-y-2 overflow-x-hidden">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title={isCollapsed ? "Toggle Theme" : undefined}
          className={cn(
            "flex items-center h-11 rounded-xl text-muted-foreground hover:bg-gradient-to-b hover:from-card hover:to-card/95 hover:border-border/60 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04),0_1px_0_rgba(255,255,255,0.5)_inset] dark:hover:shadow-[0_2px_8px_rgba(0,0,0,0.2),0_1px_0_rgba(255,255,255,0.04)_inset] hover:text-foreground transition-all duration-200 border border-transparent font-medium group",
            isCollapsed
              ? "justify-center px-0 w-full"
              : "gap-3.5 px-3.5 w-full",
          )}
        >
          <div className="relative flex items-center justify-center shrink-0">
            {mounted ? (
              theme === "dark" ? (
                <Sun
                  size={18}
                  strokeWidth={2.2}
                  className="group-hover:text-amber-500 group-hover:scale-110 transition-transform duration-200 drop-shadow-sm"
                />
              ) : (
                <Moon
                  size={18}
                  strokeWidth={2.2}
                  className="group-hover:text-indigo-500 group-hover:scale-110 transition-transform duration-200 drop-shadow-sm"
                />
              )
            ) : (
              <div style={{ width: 18, height: 18 }} /> // Placeholder
            )}
          </div>
          {!isCollapsed && (
            <span className="text-[14px] leading-none mt-0.5 whitespace-nowrap">
              {mounted
                ? theme === "dark"
                  ? "Light Mode"
                  : "Dark Mode"
                : "Theme"}
            </span>
          )}
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          title={isCollapsed ? "Logout" : undefined}
          className={cn(
            "flex items-center h-11 rounded-xl text-muted-foreground hover:bg-gradient-to-b hover:from-destructive/10 hover:to-destructive/5 hover:border-destructive/30 hover:shadow-[0_2px_8px_rgba(220,38,38,0.08),0_1px_0_rgba(255,255,255,0.3)_inset] dark:hover:shadow-[0_2px_8px_rgba(220,38,38,0.15),0_1px_0_rgba(255,255,255,0.02)_inset] hover:text-destructive transition-all duration-200 border border-transparent font-medium text-left group",
            isCollapsed
              ? "justify-center px-0 w-full"
              : "gap-3.5 px-3.5 w-full",
          )}
        >
          <LogOut
            size={18}
            strokeWidth={2.2}
            className="shrink-0 group-hover:text-destructive group-hover:scale-110 transition-transform duration-200"
          />
          {!isCollapsed && (
            <span className="text-[14px] leading-none mt-0.5 whitespace-nowrap">
              Logout
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
