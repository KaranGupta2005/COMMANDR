"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Camera,
  Droplets,
  Flame,
  MapPin,
  Minus,
  PersonStanding,
  Plus,
  Stethoscope,
} from "lucide-react";

import Sidebar from "@/components/Sidebar";
import apiClient from "@/lib/api/client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup } from "@radix-ui/react-toggle-group";
import { ToggleGroupItem } from "@/components/ui/toggle-group";
import Link from "next/link";

/* ---------- TYPES (UI ONLY) ---------- */
type EmergencyType = "flood" | "fire" | "trapped" | "medical" | "other";
type Severity = "critical" | "high" | "medium";

interface ReportFormData {
  emergencyType: EmergencyType | null;
  description: string;
  location: { lat: number; lng: number } | null;
  peopleCount: number; // UI only
  severity: Severity;
  photos: File[]; // UI only
}

const emergencyTypes = [
  { id: "flood", label: "Flood", icon: Droplets, color: "text-blue-400" },
  { id: "fire", label: "Fire", icon: Flame, color: "text-orange-400" },
  { id: "trapped", label: "Trapped", icon: PersonStanding, color: "text-yellow-400" },
  { id: "medical", label: "Medical", icon: Stethoscope, color: "text-red-400" },
  { id: "other", label: "Other", icon: AlertTriangle, color: "text-gray-300" },
];

export default function VictimReportPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<ReportFormData>({
    emergencyType: null,
    description: "",
    location: null,
    peopleCount: 1,
    severity: "high",
    photos: [],
  });

  const [step, setStep] = useState(1);
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------- LOCATION ---------- */
  const detectLocation = () => {
    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          location: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
        }));
        setIsLocating(false);
      },
      () => {
        setError("Failed to get location. Please enable location services.");
        setIsLocating(false);
      },
      { timeout: 8000 }
    );
  };

  /* ---------- SUBMIT (BACKEND SYNCED) ---------- */
  const handleSubmit = async () => {
    setError(null);

    if (!formData.emergencyType || !formData.location) {
      setError("Emergency type and location are required.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        type: formData.emergencyType,
        severity: formData.severity,
        location: formData.location,
        description: formData.description || undefined,
        media: [],
      };

      await apiClient.post("/emergencies", payload);

      router.push("/victim/status");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      <Sidebar role="victim" />

      <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-red-400 flex items-center justify-center gap-3">
            <AlertTriangle className="w-8 h-8" />
            Report Emergency
          </h1>
          <p className="text-gray-300 text-lg mt-2">Step {step} of 3</p>
        </div>

        <Progress value={(step / 3) * 100} className="mb-10 h-3 bg-white/20" />

        {/* ---------------- STEP 1 ---------------- */}
        {step === 1 && (
          <Card className="bg-white/10 border border-white/20 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white">
                Select Emergency Type
              </CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {emergencyTypes.map((type) => {
                const Icon = type.icon;
                const active = formData.emergencyType === type.id;

                return (
                  <button
                    key={type.id}
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        emergencyType: type.id as EmergencyType,
                      }))
                    }
                    className={`p-6 rounded-2xl border transition-all ${
                      active
                        ? "border-red-500 bg-red-500/20 scale-105"
                        : "border-white/20 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <Icon className={`w-10 h-10 mx-auto ${type.color}`} />
                    <p className="mt-3 text-lg font-semibold text-white">
                      {type.label}
                    </p>
                  </button>
                );
              })}
            </CardContent>

            <CardFooter className="flex justify-between">
              <Link href="/victim/dashboard">
                <Button variant="ghost" className="text-gray-300">
                  <ArrowLeft /> Back
                </Button>
              </Link>

              <Button
                disabled={!formData.emergencyType}
                onClick={() => setStep(2)}
                className="bg-red-500 hover:bg-red-600 text-white px-8 text-lg"
              >
                Next <ArrowRight />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* ---------------- STEP 2 ---------------- */}
        {step === 2 && (
          <div className="space-y-8">
            <Button variant="ghost" onClick={() => setStep(1)}>
              <ArrowLeft /> Back
            </Button>

            {/* Location */}
            <Card className="bg-white/10 border border-white/20 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <MapPin /> Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                {formData.location ? (
                  <Alert className="bg-green-500/20 border-green-400">
                    <AlertDescription className="text-green-200">
                      {formData.location.lat.toFixed(4)},{" "}
                      {formData.location.lng.toFixed(4)}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Button
                    onClick={detectLocation}
                    disabled={isLocating}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 py-6"
                  >
                    {isLocating ? "Detecting..." : "Detect My Location"}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="bg-white/10 border border-white/20 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  Situation Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  rows={5}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, description: e.target.value }))
                  }
                  className="text-white"
                />
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                disabled={!formData.location}
                onClick={() => setStep(3)}
                className="bg-red-500 hover:bg-red-600 px-8 text-lg"
              >
                Next <ArrowRight />
              </Button>
            </div>
          </div>
        )}

        {/* ---------------- STEP 3 ---------------- */}
        {step === 3 && (
          <div className="space-y-8">
            <Button variant="ghost" onClick={() => setStep(2)}>
              <ArrowLeft /> Back
            </Button>

            {/* Urgency */}
            <Card className="bg-white/10 border border-white/20 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  Urgency Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ToggleGroup
                  type="single"
                  value={formData.severity}
                  onValueChange={(v) =>
                    v &&
                    setFormData((p) => ({
                      ...p,
                      severity: v as Severity,
                    }))
                  }
                  className="grid grid-cols-3 gap-4"
                >
                  <ToggleGroupItem value="critical">Critical</ToggleGroupItem>
                  <ToggleGroupItem value="high">High</ToggleGroupItem>
                  <ToggleGroupItem value="medium">Medium</ToggleGroupItem>
                </ToggleGroup>
              </CardContent>
            </Card>

            {error && (
              <Alert className="bg-red-500/20 border-red-400">
                <AlertDescription className="text-red-200">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 px-10 text-lg"
              >
                {isSubmitting ? "Submitting..." : "Submit Emergency Report"}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
