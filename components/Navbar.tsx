"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import authApi from "../app/(api)/authApi/page";

export default function DisasterNavbar() {
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  /* ================= AUTH CHECK ================= */
  const checkAuth = async () => {
    try {
      const res = await authApi.get("/me");
      setIsAuthenticated(true);
      setUser(res.data.user);
    } catch {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener("authChange", checkAuth);
    return () => window.removeEventListener("authChange", checkAuth);
  }, []);

  /* ================= SCROLL EFFECT ================= */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ================= DASHBOARD ================= */
  const handleDashboardClick = () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    const role = user?.role;
    if (role === "victim") router.push("/victim/dashboard");
    else if (role === "rescue") router.push("/rescue/dashboard");
    else if (role === "logistics") router.push("/logistics/dashboard");
    else router.push("/dashboard");
  };

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    try {
      await authApi.post("/logout");
    } catch {}
    setIsAuthenticated(false);
    setUser(null);
    window.dispatchEvent(new Event("authChange"));
    router.push("/auth/login");
  };

  /* ================= STYLES ================= */
  const baseLink =
    "px-4 py-2 text-gray-300 hover:text-white transition-all duration-200 text-lg";

  const criticalLink =
    "px-4 py-2 text-red-400 hover:text-red-300 font-semibold transition-all duration-200 text-lg";

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "bg-[#0b0f14]/70 backdrop-blur-2xl border-b border-white/10 shadow-xl"
          : "bg-[#0b0f14]/95 backdrop-blur-xl border-b border-white/12"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-24 flex justify-between items-center">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-4">
          <div className="h-14 w-14 border-4 border-cyan-400 rounded-full overflow-hidden bg-white/10 shadow-lg shadow-cyan-500/30">
            <Image
              src="/logo.png"
              alt="COMMANDR Logo"
              width={56}
              height={56}
              priority
              className="w-full h-full object-cover"
            />
          </div>
          <span className="hidden sm:block text-2xl lg:text-4xl font-extrabold text-white tracking-wide">
            COMMANDR
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/" className={baseLink}>Home</Link>
          <Link href="/about" className={baseLink}>About</Link>

          <button onClick={handleDashboardClick} className={criticalLink}>
            Dashboard
          </button>

          {/* MORE DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition"
            >
              More
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-[#0b0f14]/95 backdrop-blur-xl rounded-xl border border-white/12 shadow-2xl overflow-hidden">
                <Link
                  href="/emergency"
                  onClick={() => setDropdownOpen(false)}
                  className="block px-6 py-3 text-red-400 hover:bg-red-500/10"
                >
                  🚨 Emergency Contacts
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setDropdownOpen(false)}
                  className="block px-6 py-3 text-gray-300 hover:bg-white/6"
                >
                  📧 Contact Us
                </Link>
              </div>
            )}
          </div>

          {/* AUTH BUTTON */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="ml-3 px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-semibold shadow-lg shadow-red-600/30"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/auth/login"
              className="ml-3 px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-[#0b0f14] rounded-xl font-semibold shadow-lg shadow-cyan-500/40"
            >
              Login
            </Link>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white p-2 rounded-lg hover:bg-white/10"
        >
          {mobileOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0b0f14]/95 backdrop-blur-xl border-t border-white/12 px-6 py-4 space-y-3">
          <Link href="/" onClick={() => setMobileOpen(false)} className={baseLink}>
            Home
          </Link>
          <Link href="/about" onClick={() => setMobileOpen(false)} className={baseLink}>
            About
          </Link>

          <button
            onClick={() => {
              setMobileOpen(false);
              handleDashboardClick();
            }}
            className="block text-left text-red-400 font-semibold text-lg"
          >
            Dashboard
          </button>

          <div className="border-t border-white/10 my-2" />

          {isAuthenticated ? (
            <button
              onClick={() => {
                setMobileOpen(false);
                handleLogout();
              }}
              className="w-full px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-semibold"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/auth/login"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center px-4 py-3 bg-cyan-500 hover:bg-cyan-400 text-[#0b0f14] rounded-xl font-semibold"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
