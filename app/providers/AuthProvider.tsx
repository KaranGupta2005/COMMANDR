"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import authApi from "@/lib/api/authApi";
import { socket } from "@/lib/socket";
import { User, LoginCredentials, SignupData } from "@/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /* ========== RESTORE SESSION ========== */
  useEffect(() => {
    let mounted = true;

    authApi
      .me()
      .then((res) => {
        if (!mounted) return;
        setUser(res.user);
        socket.connect();
      })
      .catch(() => {
        // Not logged in — that's fine, no redirect needed
        if (!mounted) return;
        setUser(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  /* ========== LOGIN ========== */
  const login = async (credentials: LoginCredentials) => {
    const res = await authApi.login(credentials);
    setUser(res.user);
    socket.connect();
    router.replace(`/${res.user.role}/dashboard`);
  };

  /* ========== SIGNUP ========== */
  const signup = async (data: SignupData) => {
    const res = await authApi.signup(data);
    setUser(res.user);
    socket.connect();
    router.replace(`/${res.user.role}/dashboard`);
  };

  /* ========== LOGOUT ========== */
  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Logout may fail if token already expired — still clear local state
    }
    setUser(null);
    socket.disconnect();
    router.replace("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
