import type { Metadata } from "next";
import { Inter } from "next/font/google";
import './globals.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Cognivio AI",
  description: "Your personal AI learning assistant",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
            <AuthProvider>
              {children}
            </AuthProvider>
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'hsl(var(--card))',
                  color: 'hsl(var(--card-foreground))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  fontSize: '14px',
                  fontWeight: '500',
                  boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2), 0 0 0 1px hsl(var(--border))',
                  backdropFilter: 'blur(12px)',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: 'white',
                  },
                  style: {
                    borderLeft: '4px solid #10b981',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: 'white',
                  },
                  style: {
                    borderLeft: '4px solid #ef4444',
                  },
                },
                loading: {
                  iconTheme: {
                    primary: 'hsl(var(--primary))',
                    secondary: 'hsl(var(--muted))',
                  },
                  style: {
                    borderLeft: '4px solid hsl(var(--primary))',
                  },
                },
              }}
            />
          </GoogleOAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}