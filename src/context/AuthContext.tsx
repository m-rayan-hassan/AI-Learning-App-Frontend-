"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import authServices from "@/services/authServices";
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
  token: string | null;
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
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("Token");
    setToken(null);
    setUser(null);
    router.push("/");
  };

  // Load user from token on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("Token");
      if (storedToken) {
        setToken(storedToken);
        try {
          const profile = await authServices.getProfile();
          setUser(profile);
        } catch (error) {
          console.error("Failed to fetch profile with stored token", error);
          logout(); // Invalid token
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: any) => {
    try {
      setLoading(true);
      const data = await authServices.login(credentials);
      if (data.token) {
        localStorage.setItem("Token", data.token);
        setToken(data.token);
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
      if (data.token) {
        localStorage.setItem("Token", data.token);
        setToken(data.token);
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
      if (data.token) {
        localStorage.setItem("Token", data.token);
        setToken(data.token);
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
        token,
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
