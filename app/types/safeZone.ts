export type SafeZoneStatus = "available" | "near-capacity" | "full";
export type DisasterType = "flood" | "fire" | "earthquake" | "cyclone";

export interface SafeZone {
  id: string;
  name: string;
  type: string;
  position: [number, number];
  status: SafeZoneStatus;
  distance: number;
  eta: number;
  occupancy: {
    current: number;
    capacity: number;
    percentage: number;
  };
  facilities: string[];
  safetyRating: number;
  lastVerified: string;
  address: string;
  isRecommended?: boolean;
}
