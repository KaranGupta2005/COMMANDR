"use client";

import { useRouter } from "next/navigation";
import {
  AlertCircle,
  MapPin,
  Bell,
  Radio,
  TrendingUp,
  Users,
  Route,
  Truck,
  BarChart3,
  Brain,
  Settings,
  LogOut,
  Shield,
  Activity,
} from "lucide-react";

type Role = "victim" | "rescue" | "logistics";

interface NavLink {
  name: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
}

export default function Sidebar({ role }: { role: Role }) {
  const router = useRouter();

  // Role-specific navigation with icons
  const linksByRole: Record<Role, NavLink[]> = {
    victim: [
      {
        name: "Dashboard",
        path: "/victim/dashboard",
        icon: <Activity size={20} />,
      },
      {
        name: "Report Emergency",
        path: "/victim/report",
        icon: <AlertCircle size={20} />,
      },
      {
        name: "My Requests",
        path: "/victim/status",
        icon: <Bell size={20} />,
        badge: 3,
      },
      {
        name: "Safe Zones",
        path: "/victim/safe-zones",
        icon: <MapPin size={20} />,
      },
      {
        name: "Notifications",
        path: "/victim/notifications",
        icon: <Radio size={20} />,
        badge: 2,
      },
    ],
    rescue: [
      {
        name: "Command Center",
        path: "/rescue/dashboard",
        icon: <Shield size={20} />,
      },
      {
        name: "Live Missions",
        path: "/rescue/missions",
        icon: <TrendingUp size={20} />,
        badge: 5,
      },
      {
        name: "Heatmap View",
        path: "/rescue/heatmap",
        icon: <MapPin size={20} />,
      },
      {
        name: "Team Coordination",
        path: "/rescue/teams",
        icon: <Users size={20} />,
      },
      {
        name: "Route Planning",
        path: "/rescue/mapRoute",
        icon: <Route size={20} />,
      },
    ],
    logistics: [
      {
        name: "Control Center",
        path: "/logistics/dashboard",
        icon: <BarChart3 size={20} />,
      },
      {
        name: "Vehicle Allocation",
        path: "/logistics/vehicleAllocation",
        icon: <Truck size={20} />,
      },
      {
        name: "What-If Simulator",
        path: "/logistics/what-if-simulator",
        icon: <Brain size={20} />,
      },
      {
        name: "Resource Management",
        path: "/logistics/Resource-management",
        icon: <Activity size={20} />,
      },
    ],
  };

  // Role-specific styling
  const roleStyles = {
    victim: {
      gradient: "from-blue-500/10 to-purple-500/10",
      border: "border-blue-500/20",
      accent: "text-blue-400",
      hover: "hover:bg-blue-500/10 hover:border-blue-500/40",
      badge: "bg-blue-500",
    },
    rescue: {
      gradient: "from-cyan-500/10 to-blue-500/10",
      border: "border-cyan-500/20",
      accent: "text-cyan-400",
      hover: "hover:bg-cyan-500/10 hover:border-cyan-500/40",
      badge: "bg-cyan-500",
    },
    logistics: {
      gradient: "from-purple-500/10 to-pink-500/10",
      border: "border-purple-500/20",
      accent: "text-purple-400",
      hover: "hover:bg-purple-500/10 hover:border-purple-500/40",
      badge: "bg-purple-500",
    },
  };

  const roleLabels = {
    victim: "Citizen Portal",
    rescue: "Rescue Operations",
    logistics: "Command Center",
  };

  const handleLogout = async () => {
    try {
      // await api.post("/api/auth/logout");
      router.push("/auth/login");
    } catch {
      router.push("/auth/login");
    }
  };

  const styles = roleStyles[role];

  return (
    <aside
      className={`w-72 min-h-screen bg-gradient-to-b ${styles.gradient} backdrop-blur-xl border-r ${styles.border} p-6 flex flex-col`}
    >
      {/* Logo & Role Badge */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${styles.gradient} ${styles.border} border flex items-center justify-center`}
          >
            <Activity className={styles.accent} size={24} />
          </div>
          <h2 className="text-2xl font-extrabold text-white">COMMANDR</h2>
        </div>
        <div
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${styles.accent} bg-white/5 border ${styles.border}`}
        >
          {roleLabels[role]}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-2 flex-1">
        {linksByRole[role].map((link) => (
          <button
            key={link.name}
            onClick={() => router.push(link.path)}
            className={`w-full group relative flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-300 border border-transparent transition-all ${styles.hover}`}
          >
            <span className={`${styles.accent} transition-colors`}>
              {link.icon}
            </span>
            <span className="font-medium text-sm">{link.name}</span>
            {link.badge !== undefined && (
              <span
                className={`ml-auto ${styles.badge} text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center`}
              >
                {link.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Settings & Logout */}
      <div className="space-y-2 pt-6 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:border-red-500/40 border border-transparent transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <p className="text-xs text-gray-500 text-center">
          © 2026 COMMANDR Platform
        </p>
        <p className="text-xs text-gray-600 text-center mt-1">
          Powered by AI Intelligence
        </p>
      </div>
    </aside>
  );
}
