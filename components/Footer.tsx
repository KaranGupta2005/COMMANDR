"use client";

import {Phone, Mail, MapPin, Facebook, Twitter, Instagram } from "lucide-react";
import Image  from "next/image";

export default function DisasterFooter() {
  const socials = [
    {
      name: "Facebook",
      icon: <Facebook size={18} />,
      href: "#",
    },
    {
      name: "Twitter",
      icon: <Twitter size={18} />,
      href: "#",
    },
    {
      name: "Instagram",
      icon: <Instagram size={18} />,
      href: "#",
    },
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert("Subscribed to emergency alerts!");
  };

  return (
    <footer className="relative w-full bg-[#0b0f14]/90 backdrop-blur-2xl border-t border-white/12 text-[#e5e7eb] pt-12 pb-6 z-40">
      {/* LOGO & TAGLINE */}
      <div className="flex flex-col items-center text-center px-6">
        <div className="flex items-center gap-3">
          <div className="h-20 w-20 border-4 border-[#38bdf8] rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                      <Image
                        src="/logo.png"
                        alt="COMMANDR Logo"
                        width={48}
                        height={48}
                        priority
                        className="object-contain hover:scale-110 transition-transform duration-300"
                      />
                    </div>
          <h2 className="text-2xl font-extrabold text-[#e5e7eb] tracking-wide">
            COMMANDR
          </h2>
        </div>
        <p className="text-sm mt-2 text-[#9ca3af] max-w-md">
          Empowering communities with real-time alerts, resources, and emergency response coordination.
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mt-12 px-6">
        {/* QUICK LINKS */}
        <div>
          <h3 className="text-lg font-semibold text-[#e5e7eb] mb-4 border-b border-white/12 pb-2">
            Quick Access
          </h3>
          <ul className="space-y-2 text-sm">
            {[
              { name: "Home", path: "/" },
              { name: "About Us", path: "/about" },
              { name: "Emergency Contacts", path: "/emergency", critical: true },
              { name: "Shelter Map", path: "/shelters", safegaurd: true },
              { name: "DashBoard", path: "/dashboard" },
            ].map((link) => (
              <li key={link.name}>
                <a
                  href={link.path}
                  className={`transition-colors duration-200 ${
                    link.critical
                      ? "text-[#ef4444] hover:text-white font-semibold"
                      : "text-[#9ca3af] hover:text-[#38bdf8]"
                  }`}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* EMERGENCY INFO */}
        <div>
          <h3 className="text-lg font-semibold text-[#e5e7eb] mb-4 border-b border-white/12 pb-2">
            Emergency
          </h3>
          <div className="space-y-3">
            <div className="px-4 py-3 rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/30 backdrop-blur-md">
              <p className="text-xs text-[#9ca3af] mb-1">National Helpline</p>
              <p className="text-[#ef4444] font-bold text-lg">1-800-DISASTER</p>
            </div>
            <div className="px-4 py-3 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]/30 backdrop-blur-md">
              <p className="text-xs text-[#9ca3af] mb-1">Local Emergency</p>
              <p className="text-[#f59e0b] font-bold text-lg">911</p>
            </div>
          </div>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-lg font-semibold text-[#e5e7eb] mb-4 border-b border-white/12 pb-2">
            Contact Us
          </h3>
          <div className="space-y-2 text-sm text-[#9ca3af]">
            <p className="flex items-center gap-2">
              <Phone size={16} className="text-[#38bdf8]" />
              +1 (555) 123-4567
            </p>
            <p className="flex items-center gap-2">
              <Mail size={16} className="text-[#38bdf8]" />
              support@disasterready.org
            </p>
            <p className="flex items-center gap-2 mt-3">
              <MapPin size={16} className="text-[#38bdf8]" />
              Emergency Operations Center
            </p>
          </div>
        </div>

        {/* SOCIALS & UPDATES */}
        <div>
          <h3 className="text-lg font-semibold text-[#e5e7eb] mb-4 border-b border-white/12 pb-2">
            Stay Updated
          </h3>
          <div className="flex flex-col gap-3 mb-4">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/6 hover:bg-white/12 backdrop-blur-md transition border border-white/12"
              >
                {social.icon}
                <span className="text-sm">{social.name}</span>
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <input
              type="email"
              placeholder="Get alert notifications"
              className="px-4 py-2 rounded-lg bg-white/6 text-sm text-[#e5e7eb] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#38bdf8] border border-white/12"
            />
            <button
              onClick={handleSubscribe}
              className="bg-[#38bdf8] hover:bg-[#38bdf8]/80 text-[#0b0f14] text-sm py-2 rounded-lg transition font-semibold"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/12 mt-12 pt-4 text-center text-xs text-[#9ca3af]">
        <p>
          &copy; {new Date().getFullYear()} DisasterReady. All rights reserved.
        </p>
        <p className="mt-1">
          Built to save lives and strengthen communities 🛡️
        </p>
      </div>
    </footer>
  );
}