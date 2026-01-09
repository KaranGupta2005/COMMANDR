"use client";

import { motion } from "motion/react";
import ReviewForm from "@/components/ReviewForm";

const features = [
  {
    title: "Real-Time Awareness",
    description:
      "Live situation updates from citizens, responders, and sensors ensure no critical signal is missed during emergencies.",
    accent: "text-[#38bdf8]",
  },
  {
    title: "Priority-Based Response",
    description:
      "Incidents are classified by urgency so rescue teams act where lives are most at risk — without guesswork.",
    accent: "text-[#f59e0b]",
  },
  {
    title: "Adaptive Coordination",
    description:
      "Routes, resources, and decisions update dynamically as conditions change on the ground.",
    accent: "text-[#22c55e]",
  },
];

const FeatureCard = ({ title, description, index, accent }) => (
  <motion.div
    className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 flex-1 min-w-[280px]
               shadow-xl border border-white/10 hover:scale-[1.03] transition-transform duration-300"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
  >
    <h3 className={`text-xl font-bold mb-3 ${accent}`}>
      {title}
    </h3>
    <p className="text-[#9ca3af] text-sm md:text-base leading-relaxed">
      {description}
    </p>
  </motion.div>
);

export default function About() {
  return (
    <section
      className="relative w-full bg-[#0b0f14] text-[#e5e7eb] py-24 px-4 overflow-hidden"
      aria-labelledby="about-heading"
    >
      {/* Ambient background glow */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_60%)]
                   blur-3xl pointer-events-none"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto text-center">
        {/* Heading */}
        <motion.h2
          id="about-heading"
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-wide mb-6 text-[#e5e7eb]"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          Built for <span className="text-[#38bdf8]">Critical Moments</span>
        </motion.h2>

        {/* Description */}
        <motion.p
          className="text-lg md:text-xl font-medium text-[#9ca3af] leading-relaxed
                     max-w-3xl mx-auto mb-14"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          COMMANDR is a real-time disaster response intelligence platform designed
          to help citizens, rescue teams, and command centers act together —
          faster, smarter, and with complete situational clarity.
        </motion.p>

        {/* Feature Cards */}
        <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 mb-16">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              accent={feature.accent}
              index={index}
            />
          ))}
        </div>

        {/* Closing Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p className="text-[#9ca3af] text-lg md:text-xl max-w-2xl mx-auto mb-14">
            When every second matters, clarity saves lives.
            COMMANDR ensures the right information reaches the right hands —
            exactly when it’s needed most.
          </p>
        </motion.div>

        {/* Feedback / Review */}
        <ReviewForm />
      </div>
    </section>
  );
}
