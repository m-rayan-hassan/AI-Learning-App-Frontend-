"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import authServices from "@/services/authServices";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    try {
      await authServices.forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
        <CardTitle className="text-3xl font-bold tracking-tight">Forgot Password</CardTitle>
        <CardDescription>
          Enter your email address to receive a password reset link
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {success ? (
          <div className="text-sm text-green-600">
            Reset link sent! Please check your email inbox.
          </div>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button className="w-full" type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Reset Link
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="justify-center">
        <div className="text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link href="/login" className="text-primary underline-offset-4 hover:underline">
            Login
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
