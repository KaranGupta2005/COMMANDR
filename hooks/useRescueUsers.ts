"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api/client"; 
import { RescueUser } from "@/types";

export function useRescueUsers() {
  const [rescueUsers, setRescueUsers] = useState<RescueUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRescueUsers = async () => {
      try {
        const res = await api.get("/users", {
          params: { role: "rescue" }, 
        });

        setRescueUsers(res.data?.data ?? []);
      } catch (err: any) {
        console.error(
          "❌ Failed to fetch rescue teams:",
          err.response?.status,
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRescueUsers();
  }, []);

  return { rescueUsers, loading };
}
