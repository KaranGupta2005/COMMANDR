"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

export const useRouteUpdates = () => {
  const [route, setRoute] = useState(null);

  useEffect(() => {
    socket.on("route:update", setRoute);
    return () => socket.off("route:update");
  }, []);

  return route;
};
