"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { cn } from "@/utils/cn";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  Layers,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
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

  return (
    <div className="flex bg-background h-screen flex-col border-r w-64 p-4 space-y-6">
      <Link
        href="/dashboard"
        className="flex items-center space-x-2.5 px-2 mt-2 group w-fit"
      >
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-all duration-300 border border-primary/10 overflow-hidden">
          <Image
            src="/app_logo.png"
            alt="Cognivio AI Logo"
            width={35}
            height={35}
            className="object-contain z-10"
          />
          <div className="absolute inset-0 bg-primary/20 blur-[15px] opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <span className="font-bold text-xl tracking-tight text-foreground">
          Cognivio<span className="text-primary">AI</span>
        </span>
      </Link>

      <nav className="flex-1 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  isActive ? "text-primary-foreground" : "",
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t space-y-2">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all font-medium text-sm"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-all font-medium text-sm text-left"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
