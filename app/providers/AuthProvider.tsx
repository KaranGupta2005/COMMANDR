"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
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

  /* ================= RESTORE SESSION ================= */
  useEffect(() => {
    authApi
      .me()
      .then((res) => {
        setUser(res.user);
        socket.connect(); // ✅ CONNECT SOCKET AFTER AUTH RESTORE
      })
      .catch(() => {
        setUser(null);
        socket.disconnect(); // safety
      })
      .finally(() => setLoading(false));
  }, []);

  /* ================= LOGIN ================= */
  const login = async (credentials: LoginCredentials) => {
    const res = await authApi.login(credentials);
    setUser(res.user);

    socket.connect(); // ✅ CONNECT SOCKET ON LOGIN
    router.replace(`/${res.user.role}/dashboard`);
  };

  /* ================= SIGNUP ================= */
  const signup = async (data: SignupData) => {
    const res = await authApi.signup(data);
    setUser(res.user);

    socket.connect(); // ✅ CONNECT SOCKET ON SIGNUP
    router.replace(`/${res.user.role}/dashboard`);
  };

  /* ================= LOGOUT ================= */
  const logout = async () => {
    await authApi.logout();
    setUser(null);

    socket.disconnect(); // ✅ DISCONNECT SOCKET ONLY HERE
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
