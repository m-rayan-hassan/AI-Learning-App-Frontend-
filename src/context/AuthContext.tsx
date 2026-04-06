"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import authServices from "@/services/authServices";
import { setAccessToken } from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  username: string;
  email: string;
  profileImage?: string;
  planType: 'free' | 'plus' | 'pro' | 'premium';
  subscriptionStatus?: string;
  subscriptionEndDate?: string;
  paddleScheduledChange?: { action: string; effectiveAt?: string };
  quotas?: any;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  googleLogin: (token: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(async () => {
    try {
      await authServices.logout(); // Clears refresh cookie on server
    } catch (err) {
      console.error("Logout error:", err);
    }
    setAccessToken(null); // Clear in-memory access token
    setUser(null);
    router.push("/");
  }, [router]);

  // Listen for session expired events from the axios interceptor
  useEffect(() => {
    const handleSessionExpired = () => {
      setAccessToken(null);
      setUser(null);
      router.push("/login");
    };

    window.addEventListener('auth:sessionExpired', handleSessionExpired);
    return () => {
      window.removeEventListener('auth:sessionExpired', handleSessionExpired);
    };
  }, [router]);

  // On mount: try to refresh the access token using the HttpOnly cookie
  useEffect(() => {
    const initAuth = async () => {
      try {
        // The refresh endpoint reads the HttpOnly cookie automatically
        const data = await authServices.refreshToken();
        if (data.accessToken) {
          setAccessToken(data.accessToken);
          // Fetch full profile with the new access token
          const profile = await authServices.getProfile();
          setUser(profile);
        }
      } catch (error) {
        // No valid refresh token — user is not authenticated
        setAccessToken(null);
        setUser(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: any) => {
    try {
      setLoading(true);
      const data = await authServices.login(credentials);
      if (data.accessToken) {
        setAccessToken(data.accessToken);
        // Fetch full profile to ensure all fields are present
        const profile = await authServices.getProfile();
        setUser(profile);
      }
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (googleToken: string) => {
    try {
      setLoading(true);
      const data = await authServices.googleLogin(googleToken);
      if (data.accessToken) {
        setAccessToken(data.accessToken);
        // Fetch full profile to ensure all fields are present
        const profile = await authServices.getProfile();
        setUser(profile);
      }
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      setLoading(true);
      const data = await authServices.register(username, email, password);
      if (data.accessToken) {
        setAccessToken(data.accessToken);
        // Fetch full profile to ensure all fields are present
        const profile = await authServices.getProfile();
        setUser(profile);
      }
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        googleLogin,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
