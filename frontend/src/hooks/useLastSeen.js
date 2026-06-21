import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { formatLastSeen } from "../lib/utils";

/**
 * Returns a live-updated "last seen …" string for a given userId.
 * Re-computes every 30 seconds so relative labels stay accurate.
 * Reads lastActive from the userPresence map (updated via socket)
 * rather than the stale value on the user object.
 */
export function useLastSeen(userId) {
  const { onlineUsers, userPresence } = useAuthStore();

  const isOnline = onlineUsers.includes(userId);
  // Prefer the presence map (updated on disconnect) over the stale user object
  const lastActive = userPresence[userId]?.lastActive ?? null;

  const compute = () => formatLastSeen(lastActive, isOnline);

  const [text, setText] = useState(compute);

  // Re-run whenever online status or lastActive changes
  useEffect(() => {
    setText(compute());
  }, [isOnline, lastActive]);

  // Tick every 30 s so "1 min ago", "5 min ago" etc. stay current
  useEffect(() => {
    const id = setInterval(() => setText(compute()), 30_000);
    return () => clearInterval(id);
  }, [isOnline, lastActive]);

  return { text, isOnline };
}