"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Users, Brain, CheckCircle, Radio, AlertTriangle } from "lucide-react";
import FeaturesSection from "@/components/FeatureSection";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";

export enum UserRole {
  Victim = "victim",
  Rescuer = "rescuer",
  Commander = "commander",
}

interface User {
  role: UserRole;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  const words = ["Coordinate", "Optimize", "Save"];
  const [currentWord, setCurrentWord] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getDashboardRoute = () => {
    if (user?.role === UserRole.Victim) return "/victim/dashboard";
    if (user?.role === UserRole.Rescuer) return "/rescue/dashboard";
    if (user?.role === UserRole.Commander) return "/logistics/dashboard";
    return "/dashboard";
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-screen w-screen bg-[#0b0f14] overflow-hidden flex items-center justify-center">
        <BackgroundRippleEffect rows={10} cols={30} cellSize={64} />
        {/* Animated Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

        {/* Radial Gradient Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ef444410,transparent_70%)]"></div>

        {/* Hero Content */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center px-4">
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ef4444]/10 border border-[#ef4444]/30 mb-8"
          >
            <AlertTriangle className="w-4 h-4 text-[#ef4444]" />
            <span className="text-[#ef4444] font-semibold text-sm tracking-wide">
              REAL-TIME DISASTER RESPONSE
            </span>
          </motion.div>

          {/* Hero Title with Flip Words */}
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-[#e5e7eb] tracking-tight mb-6"
          >
            <span className="inline-block min-w-[280px] md:min-w-[400px] text-transparent bg-clip-text bg-gradient-to-r from-[#ef4444] to-[#f59e0b]">
              {words[currentWord]}
            </span>
          </motion.div>

          {/* Hero Subtitle */}
          <motion.p
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#e5e7eb] mb-4"
          >
            Disaster Response in Real Time
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-lg md:text-xl text-[#9ca3af] max-w-3xl mb-12"
          >
            One intelligence platform, three access layers — victims report,
            rescuers act, logistics optimizes
          </motion.p>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            <motion.a
              href={getDashboardRoute()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 rounded-xl bg-gradient-to-r from-[#ef4444] to-[#f59e0b] text-white font-bold text-lg shadow-2xl hover:shadow-[#ef4444]/50 transition-all duration-300"
            >
              Access Dashboard
            </motion.a>
            <motion.a
              href="/about"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 rounded-xl bg-white/6 border border-white/12 text-[#e5e7eb] font-semibold text-lg backdrop-blur-xl hover:bg-white/12 transition-all duration-300"
            >
              Learn More
            </motion.a>
          </div>
        </div>
      </div>

      {/* Three User Levels Section */}
      <ThreeLevelsSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* How It Works Section */}
      <HowItWorksSection />
    </>
  );
}

function ThreeLevelsSection() {
  const levels = [
    {
      title: "Victim / Citizen Level",
      subtitle: "📡 Data Provider + Beneficiary",
      description:
        "Report emergencies with photo, location, and type. See nearby safe zones and get evacuation instructions. Victims become live sensors — information reaches authorities directly.",
      color: "#ef4444",
      icon: <Users size={40} />,
      features: [
        "Report help requests instantly",
        "Mark emergency type (flood, fire, trapped)",
        "See nearby safe zones & help status",
        "Get evacuation instructions",
      ],
    },
    {
      title: "Rescue Groups Level",
      subtitle: "🚑 Execution & Coordination",
      description:
        "View live disaster heatmap, verified alerts, and optimal routes. Accept assignments and coordinate with teams. Removes guesswork, prevents duplicate rescues.",
      color: "#f59e0b",
      icon: <Radio size={40} />,
      features: [
        "Live disaster heatmap",
        "Verified crowd alerts",
        "Best routes to reach victims",
        "Coordinate with other teams",
      ],
    },
    {
      title: "Logistics Level",
      subtitle: "🧠 Strategy, Planning & Optimization",
      description:
        "Control ambulances, optimize routes, simulate scenarios, and coordinate cross-region disaster response. System-wide performance monitoring and what-if simulations.",
      color: "#38bdf8",
      icon: <Brain size={40} />,
      features: [
        "Manage ambulances, boats, helicopters",
        "Route optimization & simulations",
        "Resource utilization tracking",
        "Cross-region coordination",
      ],
    },
  ];

  return (
    <section className="relative w-full bg-gradient-to-br from-[#0b0f14] via-[#1a1a1a] to-[#0b0f14] text-[#e5e7eb] py-24 px-4">
      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-wide mb-6 text-[#e5e7eb]">
            One System,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ef4444] to-[#f59e0b]">
              Three User Levels
            </span>
          </h2>
          <p className="text-lg md:text-xl text-[#9ca3af] leading-relaxed max-w-3xl mx-auto">
            Same intelligence underneath, different views on top. Victims become
            sensors, rescuers execute, and logistics optimizes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {levels.map((level, index) => (
            <motion.div
              key={index}
              className="bg-white/6 backdrop-blur-xl rounded-3xl p-8 hover:scale-105 transition-all duration-300 shadow-xl border border-white/12 hover:border-white/30"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <div
                style={{ backgroundColor: level.color }}
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-white mb-6 mx-auto shadow-lg"
              >
                {level.icon}
              </div>
              <h3 className="text-2xl font-bold text-[#e5e7eb] mb-2 text-center">
                {level.title}
              </h3>
              <p
                className="text-sm font-semibold text-center mb-4"
                style={{ color: level.color }}
              >
                {level.subtitle}
              </p>
              <p className="text-[#9ca3af] text-base leading-relaxed mb-6 text-center">
                {level.description}
              </p>
              <ul className="space-y-2">
                {level.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-[#9ca3af]"
                  >
                    <CheckCircle
                      size={16}
                      className="mt-0.5 flex-shrink-0"
                      style={{ color: level.color }}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-[#9ca3af] text-lg md:text-xl max-w-4xl mx-auto italic text-center border-t border-white/12 pt-8"
        >
          "It's a single intelligence platform with three access layers —
          victims report, rescuers act, and logistics optimizes."
        </motion.p>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      icon: <Users size={32} />,
      label: "Report Emergency",
      description: "Citizens report help requests instantly",
      color: "#ef4444",
    },
    {
      icon: <Brain size={32} />,
      label: "AI Analysis",
      description: "System analyzes and prioritizes alerts",
      color: "#f59e0b",
    },
    {
      icon: <Radio size={32} />,
      label: "Dispatch Teams",
      description: "Rescue groups receive assignments",
      color: "#22c55e",
    },
    {
      icon: <CheckCircle size={32} />,
      label: "Optimize Routes",
      description: "Logistics coordinates resources efficiently",
      color: "#38bdf8",
    },
    {
      icon: <AlertTriangle size={32} />,
      label: "Save Lives",
      description: "Real-time coordination saves precious time",
      color: "#ef4444",
    },
  ];

  return (
    <section className="py-24 bg-[#0b0f14]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-[#e5e7eb]">
            How{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ef4444] to-[#f59e0b]">
              COMMANDR
            </span>{" "}
            Works
          </h2>
          <p className="text-xl text-[#9ca3af] max-w-3xl mx-auto">
            From emergency report to rescue coordination — we handle everything
            in real time
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="flex flex-col items-center text-center relative z-10"
            >
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[50%] w-full h-0.5 bg-gradient-to-r from-[#ef4444]/50 to-transparent" />
              )}

              <motion.div
                whileHover={{ scale: 1.15 }}
                style={{ backgroundColor: step.color }}
                className="w-24 h-24 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg transition-transform duration-300"
              >
                {step.icon}
              </motion.div>
              <h3 className="text-lg font-bold text-[#e5e7eb] mb-2">
                {step.label}
              </h3>
              <p className="text-sm text-[#9ca3af] max-w-[160px]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
