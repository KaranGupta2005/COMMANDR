"use client";

import RoleGuard from "@/components/RollGaurd";

export default function CommandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRole="logistics">
      <div className="relative min-h-screen bg-white">
        <div
          className="absolute inset-0 h-full w-full 
        bg-[radial-gradient(#d1d5db_1px,transparent_1px)] 
        [background-size:20px_20px]"
        />
        <div className="relative z-10">{children}</div>
      </div>
    </RoleGuard>
  );
}
