"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import ChaosControl from "@/components/simulator/ChaosControl";
import Sidebar from "@/components/Sidebar";
import AIIntelligencePanel, {
  SimulationResult,
} from "@/components/simulator/AIreccomendation";

// Dynamically import the map to avoid SSR issues with Leaflet
const SimulationMap = dynamic(
  () => import("@/components/simulator/SimulationMap"),
  { ssr: false }
);

// Mock data generator for the simulation result
const getMockSimulationResult = (params: any): SimulationResult => {
  // In a real app, 'params' would influence the output.
  // Here we just return a static dramatic result.
  return {
    impact: {
      delayMinutes: params.bridgeCollapse ? 45 : 15,
      isolatedPeople: params.gridFailure ? 250 : 120,
      riskLevel: params.weather === "storm" ? "critical" : "high",
    },
    solution: {
      reroutePath: "Reroute convoy via Northern Service Road (Sector 7B).",
      resourceAction:
        "Deploy 3 Drone Units for immediate medical drops to isolated zones.",
      estimatedSuccessRate: 88,
    },
    projectionGraph: [
      { time: "T+0", survivalRate: 60 },
      { time: "T+1", survivalRate: 65 },
      { time: "T+2", survivalRate: 78 },
      { time: "T+3", survivalRate: 85 },
      { time: "T+4", survivalRate: 88 },
    ],
  };
};

export default function SimulatorPage() {
  const [isSimulating, setIsSimulating] = useState(false);
  // State to hold the results of the simulation
  const [simulationResults, setSimulationResults] =
    useState<SimulationResult | null>(null);

  const runSimulation = (params: any) => {
    setIsSimulating(true);
    setSimulationResults(null); // Clear previous results while loading

    console.log("Injecting Chaos:", params);

    // Mock ML API Delay
    setTimeout(() => {
      setIsSimulating(false);
      // Generate mock results based on inputs
      const results = getMockSimulationResult(params);
      setSimulationResults(results);
    }, 2500);
  };

  const handleApplyPlan = () => {
    alert("New Optimized Plan deployed to Rescue Teams.");
    setSimulationResults(null); // Close panel
  };

  const handleDiscard = () => {
    setSimulationResults(null); // Close panel
  };

  return (
    <div className="flex w-full min-h-screen bg-black overflow-hidden">
      {/* Sidebar */}
      <Sidebar role="logistics" />
      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* The Simulation Map */}
        <div className="absolute inset-0 z-0">
          <SimulationMap simulationData={simulationResults} />
        </div>

        {/* Overlay Title (Top Left) */}
        <div className="absolute top-8 left-8 z-10 pointer-events-none">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none">
            WHAT-IF <br />
            <span className="text-cyan-500 text-5xl md:text-6xl">
              SIMULATOR
            </span>
          </h1>
          <div className="flex items-center gap-2 mt-4 pl-1">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-mono text-green-400 uppercase">
              ML Engine Standby
            </span>
          </div>
        </div>

        {/* AI Results Panel (Fixed Bottom - pops up automatically) */}
        <AIIntelligencePanel
          results={simulationResults}
          onApplyPlan={handleApplyPlan}
          onDiscard={handleDiscard}
        />
      </div>

      {/* Chaos Sidebar (Right Side) */}
      <ChaosControl
        onRunSimulation={runSimulation}
        isSimulating={isSimulating}
      />
    </div>
  );
}
