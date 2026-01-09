// ============= USER TYPES =============
export type UserRole = "victim" | "rescue" | "logistics";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  lastKnownLocation?: {
    lat: number;
    lng: number;
    updatedAt?: Date;
  };
  createdAt?: string;
  updatedAt?: string;
}

// ============= AUTH TYPES =============
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  message: string;
  user: User;
}

// ============= LOCATION TYPES =============
export interface Location {
  lat: number;
  lng: number;
}

// ============= EMERGENCY TYPES =============
export type EmergencyType = "flood" | "fire" | "trapped" | "medical" | "other";
export type EmergencySeverity = "medium" | "high" | "critical";
export type EmergencyStatus = "pending" | "assigned" | "resolved";

export interface Emergency {
  _id: string;
  reportedBy: string | User;
  type: EmergencyType;
  severity: EmergencySeverity;
  location: Location;
  description?: string;
  media?: string[];
  status: EmergencyStatus;
  assignedMissionId?: string;
  verificationScore?: number;
  verifiedBy?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmergencyData {
  type: EmergencyType;
  severity: EmergencySeverity;
  location: Location;
  description?: string;
  media?: string[];
}

// ============= MISSION TYPES =============
export type MissionStatus =
  | "pending"
  | "enroute"
  | "active"
  | "completed"
  | "cancelled";

export interface Mission {
  _id: string;
  emergencyId: string | Emergency;
  rescueTeamId: string;
  vehiclesAssigned: string[];
  route?: any;
  status: MissionStatus;
  eta?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMissionData {
  emergencyId: string;
  rescueTeamId: string;
  vehiclesAssigned?: string[];
  route?: any;
  eta?: string;
}

// ============= VEHICLE TYPES =============
export type VehicleType = "ambulance" | "boat" | "helicopter" | "truck";
export type VehicleStatus = "available" | "in-use" | "down";

export interface Vehicle {
  _id: string;
  type: VehicleType;
  identifier: string;
  location: Location;
  capacity?: number;
  status: VehicleStatus;
  assignedMissionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVehicleData {
  type: VehicleType;
  identifier: string;
  location: Location;
  capacity?: number;
}

export interface UpdateVehicleData {
  location?: Location;
  status?: VehicleStatus;
  assignedMissionId?: string | null;
}

// ============= SAFE ZONE TYPES =============
export type SafeZoneStatus = "safe" | "warning" | "unsafe";

export interface SafeZone {
  _id: string;
  name: string;
  location: Location;
  capacity: number;
  currentOccupancy: number;
  facilities?: string[];
  status: SafeZoneStatus;
  lastUpdatedBy?: string | User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSafeZoneData {
  name: string;
  location: Location;
  capacity: number;
  facilities?: string[];
}

export interface UpdateSafeZoneData {
  name?: string;
  location?: Location;
  capacity?: number;
  currentOccupancy?: number;
  facilities?: string[];
  status?: SafeZoneStatus;
}

// ============= NOTIFICATION TYPES =============
export interface PushSubscription {
  endpoint: string;
  keys: {
    auth: string;
    p256dh: string;
  };
}

export interface SendNotificationData {
  title: string;
  message: string;
}

// ============= SOCKET EVENT TYPES =============
export interface LocationUpdateData {
  lat: number;
  lng: number;
  role: UserRole;
}

export interface SocketNotification {
  eventType: string;
  payload: {
    title?: string;
    message?: string;
    emergencyId?: string;
    missionId?: string;
    vehicleId?: string;
    safeZoneId?: string;
    location?: Location;
    severity?: EmergencySeverity;
    status?: string;
    [key: string]: any;
  };
}

export interface RescueMessage {
  senderId: string;
  message: string;
  timestamp: string | Date;
}

// ============= API RESPONSE TYPES =============
export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
  count?: number;
}

export interface ApiError {
  message: string;
  status?: number;
  details?: any;
}

// ============= ROUTE TYPES =============
export interface RoutePoint {
  lat: number;
  lng: number;
}

export interface OptimizedRoute {
  coordinates: RoutePoint[];
  distance: number;
  duration: number;
  warnings?: string[];
}

export interface OptimizeRouteData {
  start: Location;
  end: Location;
  context?: any;
}

export interface RescueUser {
  _id: string;
  name: string;
  role: "rescue";
  email?: string;
}
