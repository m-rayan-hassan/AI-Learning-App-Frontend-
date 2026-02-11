"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { cn } from "@/utils/cn";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, FileText, Brain, GraduationCap, User, Settings, LogOut, Moon, Sun } from "lucide-react";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FileText, label: "Documents", href: "/documents" },
  { icon: GraduationCap, label: "Flashcards", href: "/flashcards" },
  { icon: User, label: "Profile", href: "/profile" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();

  return (
    <div className="flex bg-background h-screen flex-col border-r w-64 p-4 space-y-6">
      <div className="flex items-center gap-2 px-2 mt-2">
         <div className="bg-primary/10 p-2 rounded-lg">
            <Brain className="h-6 w-6 text-primary" />
         </div>
         <span className="font-bold text-xl tracking-tight">Cognivio AI</span>
      </div>

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
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "")} />
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
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
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
