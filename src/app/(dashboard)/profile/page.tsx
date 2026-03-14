"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, User, Crown, Calendar, Settings, ShieldCheck, Zap, Sparkles, Star, ArrowRight, Activity, Bell } from "lucide-react";
import authServices from "@/services/authServices";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";

// Constants matching backend plan limits
const PLAN_LIMITS = {
  free: { docs: 5, flashcards: 15, quizzes: 15, voice: 0, video: 1 },
  plus: { docs: 10, flashcards: 30, quizzes: 30, voice: 1, video: 2 },
  pro: { docs: 15, flashcards: 45, quizzes: 45, voice: 2, video: 3 },
  premium: { docs: 20, flashcards: 60, quizzes: 60, voice: 5, video: 5 },
};

const PLAN_ICONS = {
  free: ShieldCheck,
  plus: Star,
  pro: Zap,
  premium: Sparkles,
};

const PLAN_COLORS = {
  free: "text-slate-600 bg-slate-100 border-slate-200 dark:text-slate-400 dark:bg-slate-800 dark:border-slate-700",
  plus: "text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-950 dark:border-blue-800",
  pro: "text-indigo-600 bg-indigo-50 border-indigo-200 dark:text-indigo-400 dark:bg-indigo-950 dark:border-indigo-800",
  premium: "text-slate-800 bg-slate-100 border-slate-300 dark:text-slate-200 dark:bg-slate-800 dark:border-slate-600",
};

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authServices.getProfile();
        setProfile(data);
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdateLoading(true);
    setSuccess("");
    setError("");

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;

    try {
      const updated = await authServices.updateProfile({ username });
      setProfile({ ...profile, ...updated });
      setSuccess("Profile updated successfully!");
    } catch (err: any) {
       setError(err.message || "Failed to update profile");
    } finally {
      setUpdateLoading(false);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  if (loading) {
      return (
          <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
      )
  }

  const planType = profile?.planType || "free";
  const limits = PLAN_LIMITS[planType as keyof typeof PLAN_LIMITS];
  const quotas = profile?.quotas || {};
  const PlanIcon = PLAN_ICONS[planType as keyof typeof PLAN_ICONS] || ShieldCheck;
  const planColorClass = PLAN_COLORS[planType as keyof typeof PLAN_COLORS] || PLAN_COLORS.free;

  // Calculate percentages and ensure they don't exceed 100%
  const getPercentage = (count: number, limit: number) => {
    if (limit === 0) return 100; // Special case for zero limit (e.g. Free plan voice)
    return Math.min(Math.round((count / limit) * 100), 100);
  };

  const usageStats = [
    { name: "Documents", count: quotas.document?.count || 0, limit: limits.docs },
    { name: "Flashcards", count: quotas.flashcard?.count || 0, limit: limits.flashcards },
    { name: "Quizzes", count: quotas.quiz?.count || 0, limit: limits.quizzes },
    { name: "Voice Overviews", count: quotas.voiceOverview?.count || 0, limit: limits.voice },
    { name: "Videos", count: quotas.video?.count || 0, limit: limits.video },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Profile Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your account settings and view your current plan details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: User Card & Plan Card */}
        <div className="md:col-span-1 space-y-6">
          {/* User Profile Card */}
          <Card className="border-border/50 shadow-sm overflow-hidden relative">
            <div className="h-24 bg-gradient-to-r from-primary/10 to-primary/30 w-full absolute top-0 left-0" />
            <CardContent className="pt-12 relative z-10 flex flex-col items-center text-center pb-8 border-b border-border/10">
              <div className="h-24 w-24 rounded-full border-4 border-background bg-muted flex items-center justify-center overflow-hidden mb-4 shadow-md">
                {profile?.profileImage ? (
                  <img src={profile.profileImage} alt={profile.username} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <h2 className="text-xl font-bold text-foreground">{profile?.username}</h2>
              <p className="text-sm text-muted-foreground mb-4">{profile?.email}</p>
              
              <div className={`px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${planColorClass}`}>
                <PlanIcon className="w-3.5 h-3.5" />
                {planType} Plan
              </div>
            </CardContent>
            {profile?.createdAt && (
              <div className="bg-muted/30 px-6 py-4 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Member since</span>
                <span className="font-medium">{new Date(profile.createdAt).toLocaleDateString()}</span>
              </div>
            )}
          </Card>

          {/* Subscription Card */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Crown className="w-5 h-5 text-primary" />
                Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="font-medium flex items-center gap-2 capitalize">
                  <div className={`w-2 h-2 rounded-full ${profile?.subscriptionStatus === 'active' ? 'bg-green-500' : profile?.subscriptionStatus === 'canceled' ? 'bg-amber-500' : 'bg-slate-400'}`} />
                  {profile?.subscriptionStatus || 'None'}
                </div>
              </div>

              {profile?.subscriptionEndDate && (
                <div className="space-y-1 pt-2 border-t border-border/50">
                  <div className="text-sm text-muted-foreground">Period Ends</div>
                  <div className="font-medium text-sm text-foreground">
                    {new Date(profile.subscriptionEndDate).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-0 pb-6 px-6">
              <Button onClick={() => router.push('/pricing')} variant={planType === 'free' ? 'default' : 'outline'} className="w-full">
                {planType === 'free' ? 'Upgrade Plan' : 'Manage Subscription'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column: Quotas & Settings */}
        <div className="md:col-span-2 space-y-6">
          {/* Usage Quotas */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Monthly Usage
              </CardTitle>
              <CardDescription>Your plan limits reset every month.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {usageStats.map((stat) => {
                const percentage = getPercentage(stat.count, stat.limit);
                const isLimitReached = stat.count >= stat.limit;
                
                return (
                  <div key={stat.name} className="space-y-2">
                    <div className="flex justify-between items-end text-sm">
                      <span className="font-medium text-foreground">{stat.name}</span>
                      <span className="text-muted-foreground">
                        <span className={isLimitReached && stat.limit > 0 ? "text-destructive font-bold" : ""}>{stat.count}</span> / {stat.limit}
                      </span>
                    </div>
                    <Progress 
                      value={percentage} 
                      className={`h-2 ${isLimitReached && stat.limit > 0 ? "[&>div]:bg-destructive" : ""}`} 
                    />
                    {stat.limit === 0 && (
                      <p className="text-[10px] text-amber-500 font-medium">Not available on {planType} plan</p>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
               <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Account Settings
              </CardTitle>
               <CardDescription>Update your personal details here.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleUpdate} className="space-y-5">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={profile?.email || ""} disabled readOnly className="bg-muted/50 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Email cannot be changed for security reasons.
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" name="username" defaultValue={profile?.username} required className="focus-visible:ring-primary/50" />
                    </div>
                     {error && <p className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">{error}</p>}
                     {success && <p className="text-sm text-green-600 bg-green-500/10 p-2 rounded-md">{success}</p>}
                    <div className="flex justify-end pt-2">
                        <Button type="submit" disabled={updateLoading} className="min-w-[140px]">
                            {updateLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
