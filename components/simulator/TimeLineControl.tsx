import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SimulationParams {
  bridgeCollapse: boolean;
  gridFailure: boolean;
  fleetCapacity: number;
  weather: "clear" | "rainy" | "stormy";
}

interface ChaosControlProps {
  onRunSimulation: (params: SimulationParams) => void;
  isSimulating: boolean;
}
const ChaosControl = ({ onRunSimulation, isSimulating }: ChaosControlProps) => {
  //Local state for the form
  const [params, setParams] = useState<SimulationParams>({
    bridgeCollapse: false,
    gridFailure: false,
    fleetCapacity: 100,
    weather: "clear",
  });

  const handleRun = () => {
    onRunSimulation(params);
  };

  const handleReset = () => {
    setParams({
      bridgeCollapse: false,
      gridFailure: false,
      fleetCapacity: 100,
      weather: "clear",
    });
  };

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="w-full max-w-sm h-[calc(100vh-4rem)] bg-slate-950/80 backdrop-blur-xl border-l border-slate-800 p-6 flex flex-col gap-6 text-slate-100 shadow-2xl z-50 fixed right-0 top-16"
    >
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 ">
        <h2 className="text-xl font-bold flex items-center gap-2 text-cyan-400 uppercase tracking-wider">
          <Activity /> Chaos Injection
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Modify variables to test system resilience
        </p>
      </div>
      {/* 
      Infrastructure Failures */}

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-400 uppercase">
          Infrastructure
        </h3>
        <div
          onClick={() =>
            setParams((p) => ({ ...p, bridgeCollapse: !p.bridgeCollapse }))
          }
          className={cn(
            "cursor-pointer p-4 rounded-lg border transition-all duration-300 flex items-center justify-between group",
            params.bridgeCollapse
              ? "border-red-500 bg-red-900/50"
              : "border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-700/50"
          )}
        >
          <div className="flex items-center gap-3">
            <AlertTriangle
              className={cn(
                "w-5 h-5",
                params.bridgeCollapse ? "text-red-500" : "text-slate-500"
              )}
            />
            <span
              className={
                params.bridgeCollapse
                  ? "text-red-400 font-medium"
                  : "text-slate-300"
              }
            >
              Main Bridge Collapse
            </span>
          </div>
          <div
            className={cn(
              "w-3 h-3 rounded-full",
              params.bridgeCollapse
                ? "bg-red-500 animate-pulse"
                : "bg-slate-700"
            )}
          />
        </div>
      </div>
    </motion.div>
  );
};
