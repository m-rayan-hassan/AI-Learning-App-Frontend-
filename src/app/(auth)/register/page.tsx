"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useGoogleLogin } from "@react-oauth/google";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Eye, EyeOff, Mail, ArrowLeft, RefreshCw, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

// ─── OTP Input Component ─────────────────────────────────────────────────────
function OtpInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (val: string[]) => void;
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, char: string) => {
    const digit = char.replace(/\D/g, "").slice(-1);
    const next = [...value];
    next[index] = digit;
    onChange(next);
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (value[index]) {
        const next = [...value];
        next[index] = "";
        onChange(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        const next = [...value];
        next[index - 1] = "";
        onChange(next);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = Array(6).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    onChange(next);
    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {Array(6)
        .fill(null)
        .map((_, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[i] || ""}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onFocus={(e) => e.target.select()}
            className={`
              w-11 h-14 text-center text-xl font-bold rounded-lg border-2 outline-none transition-all duration-150
              bg-background text-foreground
              ${value[i]
                ? "border-primary shadow-[0_0_0_3px_hsl(var(--primary)/0.15)]"
                : "border-border hover:border-primary/50 focus:border-primary focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.15)]"
              }
            `}
            aria-label={`OTP digit ${i + 1}`}
          />
        ))}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const router = useRouter();
  const { register, verifyOtp, googleLogin } = useAuth();

  // Step 1 state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 2 state
  const [step, setStep] = useState<1 | 2>(1);
  const [pendingEmail, setPendingEmail] = useState("");
  const [pendingUsername, setPendingUsername] = useState("");
  const [pendingPassword, setPendingPassword] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""));
  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Step 1: send OTP ──────────────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await register(username, email, password); // sends OTP, no token returned
      setPendingEmail(email);
      setPendingUsername(username);
      setPendingPassword(password);
      setStep(2);
      startCooldown();
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Resend cooldown timer ─────────────────────────────────────────────────
  const startCooldown = useCallback(() => {
    setResendCooldown(60);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError("");
    setOtpDigits(Array(6).fill(""));
    try {
      setLoading(true);
      await register(pendingUsername, pendingEmail, pendingPassword);
      startCooldown();
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: verify OTP ────────────────────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = otpDigits.join("");
    if (otp.length < 6) {
      setError("Please enter the 6-digit code.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await verifyOtp(pendingEmail, otp);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Google signup ─────────────────────────────────────────────────────────
  const googleSignup = useGoogleLogin({
    flow: "implicit",
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        const tokenToSend =
          (tokenResponse as any).credential ||
          (tokenResponse as any).access_token;
        await googleLogin(tokenToSend);
        router.push("/dashboard");
      } catch (err: any) {
        setError(err.message || "Google signup failed");
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError("Google signup failed"),
  });

  // ─── Step 2 — OTP Verification UI ─────────────────────────────────────────
  if (step === 2) {
    return (
      <Card className="overflow-hidden border-border/50 shadow-2xl">
        <div className="flex justify-center pt-8">
          <div className="relative h-16 w-16 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 overflow-hidden shadow-lg shadow-primary/5">
            <Image
              src="/app_logo.png"
              alt="Cognivio AI Logo"
              width={35}
              height={35}
              className="object-contain"
            />
          </div>
        </div>

        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Verify your email
          </CardTitle>
          <CardDescription>
            We&apos;ve sent a 6-digit code to
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6">
          {/* Email badge */}
          <div className="flex items-center justify-center gap-2 bg-primary/5 border border-primary/15 rounded-xl px-4 py-3">
            <Mail className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm font-semibold text-foreground truncate max-w-[220px]">
              {pendingEmail}
            </span>
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-6">
            {/* OTP digit inputs */}
            <OtpInput value={otpDigits} onChange={setOtpDigits} />

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-2 h-4 w-4" />
              )}
              Verify & Create Account
            </Button>
          </form>

          {/* Resend + back */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0 || loading}
                className="text-primary font-medium hover:underline disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend"}
              </button>
            </p>
            <button
              type="button"
              onClick={() => { setStep(1); setError(""); setOtpDigits(Array(6).fill("")); }}
              className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="h-3 w-3" /> Back to sign up
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ─── Step 1 — Registration Form ───────────────────────────────────────────
  return (
    <Card className="overflow-hidden border-border/50 shadow-2xl">
      <div className="flex justify-center pt-8">
        <div className="relative h-16 w-16 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 overflow-hidden shadow-lg shadow-primary/5">
          <Image
            src="/app_logo.png"
            alt="Cognivio AI Logo"
            width={35}
            height={35}
            className="object-contain"
          />
        </div>
      </div>
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-bold tracking-tight">
          Create an account
        </CardTitle>
        <CardDescription>
          Enter your details below to get started
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 gap-6">
          <Button
            variant="outline"
            onClick={() => googleSignup()}
            disabled={loading}
          >
            <svg
              className="mr-2 h-4 w-4"
              aria-hidden="true"
              focusable="false"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              ></path>
            </svg>
            Sign up with Google
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">or with email</span>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="johndoe"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
              />
              <button
                type="button"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
              />
              <button
                type="button"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button className="w-full" type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Sending verification code…" : "Create account"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-4 justify-center">
        <div className="text-xs text-center text-muted-foreground">
          By signing up, you agree to the{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms &amp; Conditions
          </Link>{" "}
          and the{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>{" "}
          of Cognivio AI.
        </div>
        <div className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary underline-offset-4 hover:underline"
          >
            Login
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
