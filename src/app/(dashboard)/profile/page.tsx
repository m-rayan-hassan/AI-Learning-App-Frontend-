"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import authServices from "@/services/authServices";

export default function ProfilePage() {
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
    // Add other fields if backend supports them

    try {
      const updated = await authServices.updateProfile({ username });
      setProfile(updated);
      setSuccess("Profile updated successfully!");
    } catch (err: any) {
       setError(err.message || "Failed to update profile");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
      return (
          <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
      )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings.
        </p>
      </div>

      <Card className="max-w-2xl">
          <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details here.</CardDescription>
          </CardHeader>
          <CardContent>
              <form onSubmit={handleUpdate} className="space-y-4">
                  <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={profile?.email} disabled readOnly className="bg-muted" />
                      <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                  </div>
                  <div className="grid gap-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" name="username" defaultValue={profile?.username} required />
                  </div>
                   {error && <p className="text-sm text-red-500">{error}</p>}
                   {success && <p className="text-sm text-green-600">{success}</p>}
                  <div className="flex justify-end">
                      <Button type="submit" disabled={updateLoading}>
                          {updateLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Save Changes
                      </Button>
                  </div>
              </form>
          </CardContent>
      </Card>
    </div>
  );
}
