"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import authServices from "@/services/authServices";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await authServices.resetPassword(password, token);
      setSuccess(true);
      setTimeout(() => {
          router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please try again or request a new link.");
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
        <CardTitle className="text-3xl font-bold tracking-tight">Reset Password</CardTitle>
        <CardDescription>
          Enter your new password below
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {success ? (
             <div className="text-sm text-green-600">
            Password reset successfully! Redirecting to login...
          </div>
        ) : (
             <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="password">New Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
           <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" required />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button className="w-full" type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reset Password
          </Button>
        </form>
        )}
       
      </CardContent>
    </Card>
  );
}
