"use client";

import { socket } from "@/lib/socket";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import authApi from "@/app/(api)/authApi/page";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await authApi.post("/login", formData);
      const role = res.data.user.role;
      
      if (role === "victim") router.push("/victim/status");
      else if (role === "rescue") router.push("/rescue/dashboard");
      else if (role === "logistics") router.push("/logistics/dashboard");
      else router.push("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0b0f14] px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl"
      >
        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#e5e7eb] mb-1">
            Secure Login
          </h1>
          <p className="text-[#9ca3af] text-sm">
            Access COMMANDR control systems
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: "email", type: "email", placeholder: "Email Address" },
            { name: "password", type: "password", placeholder: "Password" },
          ].map((input) => (
            <input
              key={input.name}
              type={input.type}
              name={input.name}
              placeholder={input.placeholder}
              value={formData[input.name as keyof typeof formData]}
              onChange={handleChange}
              onFocus={() => setFocusedField(input.name)}
              onBlur={() => setFocusedField("")}
              required
              className={`w-full px-4 py-3 rounded-xl bg-[#0b0f14]/80 text-[#e5e7eb] placeholder-[#9ca3af] border transition-all ${
                focusedField === input.name
                  ? "border-[#38bdf8] ring-2 ring-[#38bdf8]/30"
                  : "border-white/10 hover:border-white/20"
              }`}
            />
          ))}

          {/* FORGOT PASSWORD */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => router.push("/auth/forgot-password")}
              className="text-xs text-[#9ca3af] hover:text-[#38bdf8] transition"
            >
              Forgot password?
            </button>
          </div>

          {/* SUBMIT */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold transition-all ${
              loading
                ? "bg-white/10 text-[#9ca3af] cursor-not-allowed"
                : "bg-[#38bdf8] text-[#0b0f14] hover:bg-[#60a5fa] hover:shadow-lg"
            }`}
          >
            {loading ? "Authenticating…" : "Login"}
          </motion.button>

          {/* ERROR */}
          {error && (
            <div className="text-sm text-[#ef4444] text-center bg-[#ef4444]/10 border border-[#ef4444]/30 p-2 rounded-lg">
              {error}
            </div>
          )}
        </form>

        {/* SIGNUP */}
        <div className="text-center mt-6 border-t border-white/10 pt-4">
          <p className="text-[#9ca3af] text-sm mb-1">
            New to COMMANDR?
          </p>
          <button
            onClick={() => router.push("/auth/signup")}
            className="text-[#38bdf8] text-sm font-medium hover:underline"
          >
            Create an account
          </button>
        </div>
      </motion.div>
    </main>
  );
}
