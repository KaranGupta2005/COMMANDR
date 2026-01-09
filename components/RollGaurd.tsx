"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserRole } from "@/lib/types";

export default function RoleGaurd({
  allowedRole,
  children,
}: {
  allowedRole: UserRole;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("userRole");

    if (role === allowedRole) {
      setIsAuthorized(true);
    } else {
      router.replace("/");
    }
    setIsLoading(false);
  }, [allowedRole, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
