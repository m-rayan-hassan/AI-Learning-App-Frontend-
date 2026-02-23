"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import authServices from "@/services/authServices";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  username: string;
  email: string;
  profileImage?: string;
  // Add other user fields as needed
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
      const data = await authServices.login(credentials);
      if (data.token) {
        localStorage.setItem("Token", data.token);
        setToken(data.token);
        setUser(data); // Assuming login response includes user info
      }
    } catch (error) {
      throw error;
    }
  };

  const googleLogin = async (googleToken: string) => {
    try {
      const data = await authServices.googleLogin(googleToken);
      if (data.token) {
        localStorage.setItem("Token", data.token);
        setToken(data.token);
        setUser(data); // Assuming login response includes user info
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const data = await authServices.register(username, email, password);
      if (data.token) {
        localStorage.setItem("Token", data.token);
        setToken(data.token);
        setUser(data);
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("Token");
    setToken(null);
    setUser(null);
    router.push("/"); // Optional: redirect to login
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
