"use client";
import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  Sphere,
  Box,
  Torus,
  Cone,
  Cylinder
} from "@react-three/drei";
import {
  MapPin,
  Radio,
  Shield,
  Zap,
  Users,
  Smartphone,
  Activity,
  Navigation,
  AlertCircle,
  ChevronRight
} from "lucide-react";

function Icon3D({ type, color }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  const Geometry =
    {
      sphere: Sphere,
      box: Box,
      torus: Torus,
      cone: Cone,
      cylinder: Cylinder
    }[type] || Sphere;

  const args =
    {
      sphere: [1, 32, 32],
      box: [1.5, 1.5, 1.5],
      torus: [1, 0.4, 16, 100],
      cone: [1, 1.8, 32],
      cylinder: [0.8, 0.8, 1.5, 32]
    }[type] || [1, 32, 32];

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group
        scale={hovered ? 1.2 : 1}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <Geometry ref={meshRef} args={args}>
          <MeshDistortMaterial
            color={color}
            distort={0.4}
            speed={2}
            roughness={0.2}
            metalness={0.8}
          />
        </Geometry>
      </group>
    </Float>
  );
}

// COMMANDR Features Data
const commandrFeatures = [
  {
    icon: <Smartphone className="w-6 h-6" />,
    icon3D: "box",
    title: "Quick Help Requests",
    description:
      "Citizens report emergencies with photo, text, and location. Simple mobile-first interface — no technical knowledge needed.",
    color: "#ef4444",
    gradient: "from-red-400 to-rose-500"
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    icon3D: "cone",
    title: "Live Disaster Heatmap",
    description:
      "Rescue teams see real-time emergency locations, verified alerts, and crowd-sourced incident data on interactive maps.",
    color: "#f59e0b",
    gradient: "from-amber-400 to-orange-600"
  },
  {
    icon: <Navigation className="w-6 h-6" />,
    icon3D: "cylinder",
    title: "Optimal Route Planning",
    description: "AI-powered routing finds fastest paths to victims, avoiding blocked roads and optimizing multi-stop rescues.",
    color: "#22c55e",
    gradient: "from-green-400 to-emerald-500"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    icon3D: "sphere",
    title: "Safe Zone Identification",
    description:
      "Citizens see nearby shelters and evacuation points. System updates zones dynamically based on disaster spread.",
    color: "#38bdf8",
    gradient: "from-blue-400 to-cyan-500"
  },
  {
    icon: <Radio className="w-6 h-6" />,
    icon3D: "torus",
    title: "Team Coordination",
    description:
      "NDRF, fire brigade, and medical teams coordinate in real-time. Prevent duplicate rescues and optimize resource allocation.",
    color: "#f59e0b",
    gradient: "from-orange-400 to-amber-500"
  },
  {
    icon: <Activity className="w-6 h-6" />,
    icon3D: "sphere",
    title: "Resource Tracking",
    description:
      "Command centers monitor ambulances, boats, helicopters. Track fuel, capacity, response times, and availability.",
    color: "#38bdf8",
    gradient: "from-cyan-400 to-blue-500"
  },
  {
    icon: <Zap className="w-6 h-6" />,
    icon3D: "box",
    title: "What-If Simulations",
    description:
      "Logistics teams simulate bridge collapses, vehicle losses, or new disasters. Prepare contingency plans before chaos hits.",
    color: "#a855f7",
    gradient: "from-purple-400 to-violet-500"
  },
  {
    icon: <Users className="w-6 h-6" />,
    icon3D: "cylinder",
    title: "Multi-Level Access",
    description:
      "Three intelligence layers — victims report, rescuers act, command centers optimize. All connected in real-time.",
    color: "#ef4444",
    gradient: "from-rose-400 to-red-600"
  }
];

// Feature Card
function FeatureCard({ feature, index }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        animation: `fadeInUp 0.8s ease-out ${index * 0.1}s both`,
        opacity: 0
      }}
    >
      <div className="relative h-full p-8 rounded-3xl transition-all duration-500 hover:scale-105 cursor-pointer bg-gradient-to-br from-[#0b0f14]/90 to-[#1a1a1a]/90 hover:from-[#0b0f14] hover:to-[#1a1a1a] backdrop-blur-xl border border-white/12 hover:border-white/30 shadow-xl hover:shadow-2xl overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 transition-all duration-700 blur-3xl`}
        />
        <div className="relative z-10 flex flex-col items-center text-center h-full">
          <div className="w-32 h-32 mb-6 relative">
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <pointLight
                position={[-10, -10, -5]}
                intensity={0.5}
                color={feature.color}
              />
              <Icon3D type={feature.icon3D} color={feature.color} />
            </Canvas>
            <div
              className={`absolute bottom-2 right-2 p-2 rounded-xl bg-gradient-to-r ${feature.gradient} text-white shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12`}
            >
              {feature.icon}
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-3 text-[#e5e7eb] group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
            {feature.title}
          </h3>
          <p className="text-[#9ca3af] leading-relaxed mb-6 flex-1">
            {feature.description}
          </p>
          <div className="flex items-center justify-center gap-2 text-white/60 group-hover:text-white transition-all duration-300 font-semibold">
            <AlertCircle className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span>Critical Feature</span>
            <ChevronRight className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-2" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Features Section
export default function FeaturesSection() {
  return (
    <section className="relative px-6 py-24 bg-gradient-to-br from-[#0b0f14] via-[#1a1a1a] to-[#0b0f14] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10 text-center mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ef4444]/10 border border-[#ef4444]/30 mb-6">
          <AlertCircle className="w-4 h-4 text-[#ef4444]" />
          <span className="text-[#ef4444] font-semibold text-sm tracking-wide">
            MISSION-CRITICAL FEATURES
          </span>
        </div>
        <h2 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-[#e5e7eb]">
          Discover the Power of{" "}
          <span className="bg-gradient-to-r from-[#ef4444] via-[#f59e0b] to-[#38bdf8] bg-clip-text text-transparent animate-gradient">
            COMMANDR
          </span>
        </h2>
        <p className="text-xl text-[#9ca3af] max-w-3xl mx-auto leading-relaxed">
          Real-time disaster coordination — victims, rescuers, and logistics command centers all connected in one intelligent platform.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {commandrFeatures.map((feature, index) => (
          <FeatureCard key={index} feature={feature} index={index} />
        ))}
      </div>

      <div className="mt-20 text-center">
        <a href="/dashboard">
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#ef4444] to-[#f59e0b] hover:from-[#dc2626] hover:to-[#ea580c] text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group">
            <span>Access Emergency Dashboard</span>
            <AlertCircle className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          </div>
        </a>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
}