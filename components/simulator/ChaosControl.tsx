import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Play,
  RotateCcw,
  Truck,
  Zap,
} from "lucide-react";
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
      className="w-80 lg:w-96 shrink-0 h-screen bg-slate-950/90 backdrop-blur-xl border-l border-slate-800 p-6 flex flex-col gap-6 text-slate-100 shadow-2xl z-20 overflow-y-auto"
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

        <div
          onClick={() =>
            setParams({ ...params, gridFailure: !params.gridFailure })
          }
          className={cn(
            "cursor-pointer p-4 rounded-lg border transition-all duration-300 flex items-center justify-between group",
            params.gridFailure
              ? "bg-amber-500/10 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
              : "bg-slate-900 border-slate-800 hover:border-slate-600"
          )}
        >
          <div className="flex items-center gap-3">
            <Zap
              className={cn(
                "w-5 h-5",
                params.gridFailure ? "text-amber-500" : "text-slate-500"
              )}
            />
            <span
              className={
                params.gridFailure
                  ? "text-amber-400 font-medium"
                  : "text-slate-300"
              }
            >
              Comm. Tower Failure
            </span>
          </div>
          <div
            className={cn(
              "w-3 h-3 rounded-full",
              params.gridFailure ? "bg-amber-500 animate-pulse" : "bg-slate-700"
            )}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-400 uppercase">
          Fleet Availability
        </h3>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="flex items-center gap-2 text-slate-300 text-sm">
              <Truck className="w-4 h-4" /> Ambulances
            </span>
            <span className="text-cyan-400 font-mono">
              {params.fleetCapacity}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={params.fleetCapacity}
            onChange={(e) =>
              setParams((p) => ({
                ...p,
                fleetCapacity: parseInt(e.target.value),
              }))
            }
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-400 uppercase">
          Weather Intensity
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {["clear", "rain", "storm"].map((type) => (
            <button
              key={type}
              onClick={() => setParams((p) => ({ ...p, weather: type as any }))}
              className={cn(
                "py-2 rounded-md text-sm border transition-all capitalize",
                params.weather === type
                  ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-grow"></div>

      {/* Action Buttons */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={handleReset}
          className="col-span-1 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={handleRun}
          disabled={isSimulating}
          className={cn(
            "col-span-3 flex items-center justify-center gap-2 font-bold uppercase tracking-wider rounded-lg transition-all duration-300 h-12",
            isSimulating
              ? "bg-slate-700 text-slate-400 cursor-not-allowed"
              : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          )}
        >
          {isSimulating ? (
            <>Calculating ML Model...</>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" /> Run Simulation
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
export default ChaosControl;
