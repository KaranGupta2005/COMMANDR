"use client"; // 🔥 MUST BE FIRST LINE

import { AuthProvider } from "./AuthProvider";
import { SocketProvider } from "@/contexts/SocketContext";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SocketProvider>
        {children}
      </SocketProvider>
    </AuthProvider>
  );
}
