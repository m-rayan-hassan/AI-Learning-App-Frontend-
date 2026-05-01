"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2, User, Crown, Calendar, Settings,
  ShieldCheck, Zap, Sparkles, Star, ArrowRight,
  Activity, Camera, X, AlertTriangle, CheckCircle2,
} from "lucide-react";
import authServices from "@/services/authServices";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

/* ─── Plan config ─────────────────────────────── */
const PLAN_LIMITS = {
  free:    { docs: 5,  flashcards: 15, quizzes: 15, voice: 0, video: 1 },
  plus:    { docs: 10, flashcards: 30, quizzes: 30, voice: 1, video: 2 },
  pro:     { docs: 15, flashcards: 45, quizzes: 45, voice: 2, video: 3 },
  premium: { docs: 20, flashcards: 60, quizzes: 60, voice: 5, video: 5 },
};

const PLAN_META: Record<string, { icon: any; label: string; badge: string }> = {
  free:    { icon: ShieldCheck, label: "Free",    badge: "bg-muted text-muted-foreground border-border/60" },
  plus:    { icon: Star,        label: "Plus",    badge: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800 dark:text-blue-400" },
  pro:     { icon: Zap,         label: "Pro",     badge: "bg-primary/10 text-primary border-primary/20" },
  premium: { icon: Sparkles,    label: "Premium", badge: "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800 dark:text-amber-400" },
};

/* ─── Helpers ─────────────────────────────────── */
function getPct(count: number, limit: number) {
  if (limit === 0) return 100;
  return Math.min(Math.round((count / limit) * 100), 100);
}

/* ═══════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════ */
export default function ProfilePage() {
  const router = useRouter();
  const { updateUser, deleteAccount } = useAuth();

  const [loading, setLoading]           = useState(true);
  const [profile, setProfile]           = useState<any>(null);
  const [error, setError]               = useState("");
  const [success, setSuccess]           = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [imageLoading, setImageLoading]   = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl]     = useState<string | null>(null);

  useEffect(() => {
    authServices.getProfile()
      .then(setProfile)
      .catch((e: any) => setError(e.message || "Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const flash = (msg: string, type: "success" | "error") => {
    type === "success" ? setSuccess(msg) : setError(msg);
    setTimeout(() => { setSuccess(""); setError(""); }, 3500);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdateLoading(true);
    const username = (new FormData(e.currentTarget)).get("username") as string;
    try {
      const updated = await authServices.updateProfile({ username });
      setProfile((p: any) => ({ ...p, ...updated }));
      updateUser({ username: updated.username });
      flash("Profile updated successfully.", "success");
    } catch (err: any) {
      flash(err.message || "Failed to update profile.", "error");
    } finally { setUpdateLoading(false); }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleImageConfirm = async () => {
    if (!selectedFile) return;
    setImageLoading(true);
    try {
      const fd = new FormData();
      fd.append("profileImage", selectedFile);
      await authServices.updateProfileImage(fd);
      const updated = await authServices.getProfile();
      setProfile(updated);
      updateUser({ profileImage: updated.profileImage });
      setSelectedFile(null);
      setPreviewUrl(null);
      flash("Profile image updated.", "success");
    } catch (err: any) {
      flash(err.message || "Failed to update image.", "error");
    } finally { setImageLoading(false); }
  };

  const handleImageCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try { await deleteAccount(); }
    catch (err: any) { flash(err.message || "Failed to delete account.", "error"); setDeleteLoading(false); }
  };

  /* ── Loading ── */
  if (loading) return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/50" />
    </div>
  );

  /* ── Derived data ── */
  const planType   = profile?.planType || "free";
  const limits     = PLAN_LIMITS[planType as keyof typeof PLAN_LIMITS] ?? PLAN_LIMITS.free;
  const quotas     = profile?.quotas ?? {};
  const planMeta   = PLAN_META[planType] ?? PLAN_META.free;
  const PlanIcon   = planMeta.icon;

  const usageStats = [
    { name: "Documents",     count: quotas.document?.count      || 0, limit: limits.docs       },
    { name: "Flashcards",    count: quotas.flashcard?.count     || 0, limit: limits.flashcards },
    { name: "Quizzes",       count: quotas.quiz?.count          || 0, limit: limits.quizzes    },
    { name: "Voice/Podcast", count: quotas.voiceOverview?.count || 0, limit: limits.voice      },
    { name: "Videos",        count: quotas.video?.count         || 0, limit: limits.video      },
  ];

  const avatarSrc = previewUrl || profile?.profileImage || null;

  return (
    <div className="max-w-[1000px] mx-auto pb-16 space-y-6 animate-in fade-in duration-500">

      {/* ━━━━━ Premium Workspace Header ━━━━━ */}
      <header className="relative rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(hsl(var(--muted-foreground)/0.12)_1px,transparent_1px)] [background-size:12px_12px] opacity-40 pointer-events-none" />
        
        <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-0.5 leading-none">
                Account
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground leading-tight">
                Profile Settings
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your account identity, security, and subscription.
              </p>
            </div>
          </div>
          
          <Button
            variant={planType === "free" ? "default" : "outline"}
            className="h-10 px-5 text-sm font-medium gap-2 shrink-0 shadow-sm"
            onClick={() => router.push("/pricing")}
          >
            <Crown className="h-4 w-4" />
            {planType === "free" ? "Upgrade Plan" : "Manage Subscription"}
          </Button>
        </div>
      </header>

      {/* ━━━━━ Global feedback ━━━━━ */}
      {(error || success) && (
        <div className={cn(
          "flex items-center gap-3 px-5 py-3.5 rounded-xl border text-sm font-medium animate-in slide-in-from-top-2",
          error
            ? "bg-destructive/10 border-destructive/20 text-destructive"
            : "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
        )}>
          {error
            ? <AlertTriangle className="h-4 w-4 shrink-0" />
            : <CheckCircle2 className="h-4 w-4 shrink-0" />
          }
          {error || success}
        </div>
      )}

      {/* ━━━━━ Main grid ━━━━━ */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* ── Left column ── */}
        <div className="space-y-6">

          {/* Identity card */}
          <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
            {/* Cover band (Premium subtle gradient) */}
            <div className="h-24 bg-gradient-to-r from-primary/10 via-primary/5 to-muted border-b border-border/40 relative" />

            {/* Avatar + info */}
            <div className="px-6 pb-6 relative">
              {/* Avatar — overlaps the cover band seamlessly */}
              <div className="relative -mt-12 mb-4 w-fit">
                <div
                  className="h-24 w-24 rounded-2xl ring-4 ring-card bg-muted overflow-hidden cursor-pointer group relative shadow-sm"
                  onClick={() => !imageLoading && fileInputRef.current?.click()}
                >
                  {avatarSrc ? (
                    <img src={avatarSrc} alt={profile?.username} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-muted/80">
                      <User className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                  {imageLoading && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={imageLoading}
                />
              </div>

              {/* Image action buttons */}
              {selectedFile && (
                <div className="flex gap-2 mb-4 animate-in fade-in zoom-in-95">
                  <Button size="sm" className="h-8 text-xs font-medium gap-1.5" onClick={handleImageConfirm} disabled={imageLoading}>
                    {imageLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    Save Photo
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 text-xs font-medium gap-1.5" onClick={handleImageCancel} disabled={imageLoading}>
                    <X className="h-3.5 w-3.5" /> Cancel
                  </Button>
                </div>
              )}

              <h2 className="text-xl font-bold text-foreground leading-tight tracking-tight">
                {profile?.username}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">{profile?.email}</p>

              {/* Plan badge */}
              <div className={cn(
                "inline-flex items-center gap-1.5 mt-4 px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-sm",
                planMeta.badge
              )}>
                <PlanIcon className="h-3.5 w-3.5" />
                {planMeta.label} Plan
              </div>
            </div>

            {/* Member since footer */}
            {profile?.createdAt && (
              <div className="px-6 py-4 border-t border-border/50 bg-muted/10 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  Member Since
                </span>
                <span className="text-xs font-semibold text-foreground">
                  {new Date(profile.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                </span>
              </div>
            )}
          </div>

          {/* Subscription card */}
          <Panel icon={Crown} title="Subscription" sub="Billing & plan details">
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <span className="text-sm font-medium text-muted-foreground">Status</span>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "h-2 w-2 rounded-full shadow-[0_0_8px_currentColor]",
                    profile?.subscriptionStatus === "active"   ? "bg-emerald-500 text-emerald-500"  :
                    profile?.subscriptionStatus === "canceled" ? "bg-amber-500 text-amber-500"  : "bg-muted-foreground/40 text-muted-foreground/40"
                  )} />
                  <span className="text-sm font-bold text-foreground capitalize">
                    {profile?.subscriptionStatus || "None"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-sm font-medium text-muted-foreground">Current Plan</span>
                <span className="text-sm font-bold text-foreground capitalize">{planMeta.label}</span>
              </div>

              {profile?.subscriptionEndDate && (
                <div className="flex items-center justify-between py-3 border-t border-border/50">
                  <span className="text-sm font-medium text-muted-foreground">Renews On</span>
                  <span className="text-sm font-bold text-foreground">
                    {new Date(profile.subscriptionEndDate).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                  </span>
                </div>
              )}
            </div>

            <Button
              variant={planType === "free" ? "default" : "outline"}
              className="w-full h-10 text-sm font-medium gap-2 justify-between group"
              onClick={() => router.push("/pricing")}
            >
              <span>{planType === "free" ? "Upgrade Plan" : "Manage Subscription"}</span>
              <ArrowRight className="h-4 w-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Button>
          </Panel>
        </div>

        {/* ── Right column ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Monthly usage */}
          <Panel icon={Activity} title="Monthly Usage" sub="Resets at the start of each month">
            <div className="space-y-5">
              {usageStats.map((stat) => {
                const pct        = getPct(stat.count, stat.limit);
                const isMaxed    = stat.count >= stat.limit && stat.limit > 0;
                const unavailable = stat.limit === 0;

                return (
                  <div key={stat.name} className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">{stat.name}</span>
                      <div className="flex items-center gap-2">
                        {unavailable ? (
                          <span className="text-xs font-medium text-muted-foreground/60 italic px-2 py-0.5 bg-muted rounded-md">
                            Not on {planMeta.label}
                          </span>
                        ) : (
                          <span className={cn(
                            "text-sm font-bold tabular-nums",
                            isMaxed ? "text-destructive" : "text-foreground"
                          )}>
                            {stat.count}
                            <span className="text-muted-foreground font-medium"> / {stat.limit}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-1000 ease-out",
                          unavailable ? "bg-muted-foreground/20" :
                          isMaxed     ? "bg-destructive"          : "bg-primary"
                        )}
                        style={{ width: unavailable ? "100%" : `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>

          {/* Account settings */}
          <Panel icon={Settings} title="Account Settings" sub="Update your personal details">
            <form onSubmit={handleUpdate} className="space-y-5">
              
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                  Email Address
                </Label>
                <Input
                  id="email"
                  value={profile?.email || ""}
                  disabled
                  readOnly
                  className="h-11 text-sm bg-muted/50 text-muted-foreground border-border/50 cursor-not-allowed opacity-70"
                />
                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mt-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  Secured. Email cannot be changed directly.
                </p>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-semibold text-foreground">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  defaultValue={profile?.username}
                  required
                  className="h-11 text-sm border-border/60 focus-visible:ring-primary/40 bg-background"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={updateLoading}
                  className="h-10 px-6 text-sm font-medium gap-2 min-w-[140px] shadow-sm"
                >
                  {updateLoading
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                    : "Save Changes"
                  }
                </Button>
              </div>
            </form>
          </Panel>

          {/* Danger zone */}
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 shadow-sm">
            <div className="flex items-center gap-3.5 mb-5 border-b border-destructive/20 pb-4">
              <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0 border border-destructive/20">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-base font-bold tracking-tight text-foreground leading-tight">Danger Zone</p>
                <p className="text-sm text-muted-foreground mt-0.5">Permanent and irreversible actions</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mt-2">
              <div>
                <p className="text-sm font-bold text-foreground">Delete Account</p>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  Permanently deletes your account, purges all uploaded documents, and cancels active subscriptions immediately.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    disabled={deleteLoading}
                    className="h-10 px-5 text-sm font-semibold shrink-0 shadow-sm"
                  >
                    {deleteLoading
                      ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</>
                      : "Delete Account"
                    }
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Account?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete your account, purge all uploaded documents, and cancel active subscriptions immediately. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      variant="destructive"
                    >
                      Delete Permanently
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Reusable Sub-components
───────────────────────────────────────── */
function Panel({
  children, title, sub, icon: Icon,
}: {
  children: React.ReactNode;
  title: string;
  sub: string;
  icon: any;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3.5 mb-6 border-b border-border/50 pb-4">
        <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center shrink-0 border border-border/50">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-base font-bold tracking-tight text-foreground leading-tight">{title}</p>
          <p className="text-sm text-muted-foreground mt-0.5">{sub}</p>
        </div>
      </div>
      {children}
    </div>
  );
}