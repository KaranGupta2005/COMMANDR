"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit,
  AlertOctagon,
  Clock,
  Users,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";

// Define what the simulation output looks like
export interface SimulationResult {
  impact: {
    delayMinutes: number;
    isolatedPeople: number;
    riskLevel: "moderate" | "high" | "critical";
  };
  solution: {
    reroutePath: string;
    resourceAction: string;
    estimatedSuccessRate: number;
  };
  // Mock data for the chart showing survival probability over time
  projectionGraph: { time: string; survivalRate: number }[];
}

interface AIIntelligencePanelProps {
  results: SimulationResult | null;
  onApplyPlan: () => void;
  onDiscard: () => void;
}

const AIIntelligencePanel: React.FC<AIIntelligencePanelProps> = ({
  results,
  onApplyPlan,
  onDiscard,
}) => {
  if (!results) return null;

  const riskColors = {
    moderate: "text-amber-400",
    high: "text-orange-500",
    critical: "text-red-500",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ duration: 0.6, type: "spring", damping: 20 }}
        className="absolute bottom-0 left-0 right-0 z-40 p-4"
      >
        {/* Main Glass Panel */}
        <div className="w-full max-w-7xl mx-auto bg-slate-950/90 backdrop-blur-2xl border border-slate-800 rounded-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Header Strip */}
          <div className="bg-slate-900/50 border-b border-slate-800 px-6 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-cyan-400 animate-pulse" />
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">
                AI Analysis Complete // Output Generated
              </h3>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Model: RESQ-NET-v4.2 | Latency: 1.2s
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 p-4 lg:p-6">
            {/* Column 1: The PROBLEM (Impact Analysis) */}
            <div className="lg:col-span-3 lg:border-r border-slate-800 lg:pr-6 pb-4 lg:pb-0 border-b lg:border-b-0">
              <h4 className="text-slate-400 text-xs uppercase font-semibold mb-4 flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-red-500" /> Detected
                Impact
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="bg-red-500/20 p-2 rounded-lg text-red-400 mt-1">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-100">
                      +{results.impact.delayMinutes} min
                    </div>
                    <div className="text-sm text-slate-400">ETA Delay</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-red-500/20 p-2 rounded-lg text-red-400 mt-1">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-100">
                      {results.impact.isolatedPeople}
                    </div>
                    <div className="text-sm text-slate-400">
                      Victims Isolated
                    </div>
                  </div>
                </li>
                <li className="text-sm font-mono mt-2">
                  Risk Level:{" "}
                  <span
                    className={cn(
                      "font-bold uppercase",
                      riskColors[results.impact.riskLevel]
                    )}
                  >
                    {results.impact.riskLevel}
                  </span>
                </li>
              </ul>
            </div>

            {/* Column 2: The SOLUTION (AI Recommendation) */}
            <div className="lg:col-span-5 lg:pl-2">
              <h4 className="text-slate-400 text-xs uppercase font-semibold mb-4 flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-cyan-500" /> Recommended
                Actions
              </h4>

              <div className="space-y-3 font-mono text-sm">
                <div className="bg-cyan-950/30 border border-cyan-900/50 p-3 rounded-lg flex items-center gap-3">
                  <ArrowRight className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-100">
                    {results.solution.reroutePath}
                  </span>
                </div>
                <div className="bg-cyan-950/30 border border-cyan-900/50 p-3 rounded-lg flex items-center gap-3">
                  <ArrowRight className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-100">
                    {results.solution.resourceAction}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={onApplyPlan}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all"
                >
                  <CheckCircle2 className="w-5 h-5" /> Apply New Plan
                </button>
                <button
                  onClick={onDiscard}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <XCircle className="w-5 h-5" /> Discard
                </button>
              </div>
            </div>

            {/* Column 3: The OUTCOME (Projections) */}
            <div className="lg:col-span-4 bg-slate-900/50 rounded-xl border border-slate-800 p-4 flex flex-col">
              <h4 className="text-slate-400 text-xs uppercase font-semibold mb-2">
                Projected Survival Rate
              </h4>

              {/* Big Success Number */}
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-black text-green-400">
                  {results.solution.estimatedSuccessRate}%
                </span>
                <span className="text-sm text-green-600 font-bold uppercase">
                  Probability
                </span>
              </div>

              {/* Tiny Chart */}
              <div className="flex-grow w-full h-24 min-h-[100px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={results.projectionGraph}>
                    <defs>
                      <linearGradient
                        id="colorRate"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#22c55e"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#22c55e"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <YAxis hide domain={[0, 100]} />
                    <Area
                      type="monotone"
                      dataKey="survivalRate"
                      stroke="#22c55e"
                      fillOpacity={1}
                      fill="url(#colorRate)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center text-xs text-slate-500 mt-2">
                T+0h to T+4h Projection with new plan
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIIntelligencePanel;
