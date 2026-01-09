"use client";

import { DisasterType } from "@/types/safeZone";

interface EmergencyInstructionsProps {
  disasterType: DisasterType;
}

const INSTRUCTIONS: Record<DisasterType, string[]> = {
  flood: [
    "Move to higher floors immediately",
    "Avoid electric poles and wires",
    "Do not drive through flooded areas",
    "Keep phone charged and dry",
  ],
  fire: [
    "Cover nose and mouth with wet cloth",
    "Stay low to avoid smoke inhalation",
    "Move against wind direction",
    "Do not use elevators",
  ],
  earthquake: [
    "Stay away from glass and windows",
    "Drop, cover, and hold on",
    "Do not use stairs or elevators",
    "Stand in doorway if no table available",
  ],
  cyclone: [
    "Stay indoors away from windows",
    "Listen to radio for updates",
    "Store drinking water",
    "Keep emergency supplies ready",
  ],
};

export default function EmergencyInstructions({
  disasterType,
}: EmergencyInstructionsProps) {
  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">
        {disasterType.charAt(0).toUpperCase() + disasterType.slice(1)} Safety
        Instructions
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {INSTRUCTIONS[disasterType].map((instruction, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 bg-white/5 rounded-lg p-3 border border-red-500/20"
          >
            <span className="text-red-400 font-bold">{idx + 1}.</span>
            <p className="text-gray-200 text-sm">{instruction}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
