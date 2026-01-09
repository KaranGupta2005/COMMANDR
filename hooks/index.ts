// Central hook exports
export { useEmergencies } from "./useEmergencies";
export { useMissions } from "./useMissions";
export { useVehicles } from "./useVehicles";
export { useSafeZones } from "./useSafeZones";


// Re-export auth and socket hooks from contexts
export { useAuth } from "@/app/providers/AuthProvider";
export { useSocket } from "@/contexts/SocketContext";
