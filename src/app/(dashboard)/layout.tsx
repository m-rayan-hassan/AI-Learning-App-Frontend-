"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "@/components/Sidebar";
import { Brain } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-brand-pulse">
                    <div className="h-14 w-14 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25">
                        <Brain className="h-7 w-7 text-primary-foreground" />
                    </div>
                </div>
                <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="h-2 w-2 rounded-full bg-primary/60"
                            style={{
                                animation: `bounce-dot 1.4s ease-in-out ${i * 0.16}s infinite both`,
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden border-b p-4 flex items-center justify-between bg-background">
            <div className="font-bold text-lg text-primary">Cognivio AI</div>
            <Sheet>
                <SheetTrigger>
                    <Menu className="h-6 w-6" />
                </SheetTrigger>
                <SheetContent side="left" className="p-0 border-r w-[280px]">
                    <div className="sr-only">
                        <SheetTitle>Navigation Menu</SheetTitle>
                    </div>
                    <Sidebar />
                </SheetContent>
            </Sheet>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
