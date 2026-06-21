

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Eye, Trash2 } from "lucide-react";
import { useStatusStore } from "../store/useStatusStore";
import { useAuthStore } from "../store/useAuthStore";

const DURATION = 5000;

const PALETTES = [
  "linear-gradient(135deg,#0f172a,#1e40af)",
  "linear-gradient(135deg,#1f2937,#7c3aed)",
  "linear-gradient(135deg,#0f2e1e,#16a34a)",
  "linear-gradient(135deg,#2d1b1b,#dc2626)",
  "linear-gradient(135deg,#1b1b2d,#2563eb)",
];

const StatusViewer = () => {
  const {
    viewingUser,
    viewingIndex,
    ownStatuses,
    othersStatuses,
    closeViewer,
    nextStatus,
    prevStatus,
    viewStatus,
    deleteStatus,
  } = useStatusStore();

  const { authUser } = useAuthStore();

  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showViewers, setShowViewers] = useState(false);

  const progressRef = useRef(0);
  const pausedRef = useRef(false);
  const timerRef = useRef(null);
  const lastTickRef = useRef(null);

  const isOwn = viewingUser === "own";

  const list = isOwn
    ? ownStatuses
    : othersStatuses.find((o) => o.userId === viewingUser)?.statuses || [];

  const active = list[viewingIndex];

  // 👇 FIXED viewer mapping
 const viewerDetails = isOwn
  ? active?.viewers || []
  : [];

  // mark seen
  useEffect(() => {
    if (!active || isOwn || active.hasViewed) return;
    viewStatus(active._id);
  }, [active?._id, isOwn]);

  // timer
  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);

    progressRef.current = 0;
    setProgress(0);
    lastTickRef.current = Date.now();

    timerRef.current = setInterval(() => {
      if (pausedRef.current) return;

      const now = Date.now();
      const delta = now - lastTickRef.current;
      lastTickRef.current = now;

      const next = Math.min(
        100,
        progressRef.current + (delta / DURATION) * 100
      );

      progressRef.current = next;
      setProgress(next);

      if (next >= 100) {
        clearInterval(timerRef.current);

        const {
          viewingIndex: idx,
          ownStatuses,
          othersStatuses,
          viewingUser: vu,
        } = useStatusStore.getState();

        const currentList =
          vu === "own"
            ? ownStatuses
            : othersStatuses.find((o) => o.userId === vu)?.statuses || [];

        if (idx < currentList.length - 1) {
          useStatusStore.getState().nextStatus();
        } else {
          useStatusStore.getState().closeViewer();
        }
      }
    }, 50);
  }, []);

  useEffect(() => {
    if (!active) return;
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [active?._id, viewingIndex]);

  // pause/resume
  const pause = () => {
    if (showViewers) return;
    pausedRef.current = true;
    setPaused(true);
  };

  const resume = () => {
    pausedRef.current = false;
    lastTickRef.current = Date.now();
    setPaused(false);
  };

  if (!viewingUser || !active) return null;

  const bg =
    active.type === "text" && active.background
      ? PALETTES[parseInt(active.background, 10) % PALETTES.length]
      : "";

  return (
    <AnimatePresence>
      <motion.div
        key="status-viewer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black select-none"
        onPointerDown={pause}
        onPointerUp={resume}
        onPointerLeave={resume}
      >
        {/* PROGRESS */}
        <div className="absolute top-0 left-0 right-0 flex gap-1 p-3 pointer-events-none">
          {list.map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 bg-white/30 overflow-hidden rounded-full"
            >
              <div
                className="h-full bg-white"
                style={{
                  width:
                    i < viewingIndex
                      ? "100%"
                      : i === viewingIndex
                      ? `${progress}%`
                      : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* HEADER */}
        <div className="absolute top-6 left-0 right-0 flex justify-between px-4 z-10 pointer-events-none">
          <div className="flex items-center gap-3">
            <img
              src={
                isOwn
                  ? authUser?.profilePic || "/avatar.png"
                  : active.userId?.profilePic || "/avatar.png"
              }
              className="size-9 rounded-full object-cover"
            />
            <div>
              <p className="text-white text-sm font-semibold">
                {isOwn ? "You" : active.userId?.fullName}
              </p>
            </div>
          </div>

          <div className="pointer-events-auto flex gap-2">
            {/* 👁 BUTTON FIXED */}
            {isOwn && (
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onPointerUp={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowViewers((v) => {
                    const next = !v;
                    pausedRef.current = next;
                    return next;
                  });
                }}
                className="px-3 py-1 rounded-full bg-white/15 text-white text-xs flex items-center gap-1"
              >
                <Eye className="size-3" />
                {active.viewCount || 0}
              </button>
            )}

            {isOwn && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteStatus(active._id);
                }}
                className="text-white"
              >
                <Trash2 />
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                closeViewer();
              }}
              className="text-white"
            >
              <X />
            </button>
          </div>
        </div>

        {/* VIEWERS */}
        <AnimatePresence>
          {isOwn && showViewers && (
            <motion.div className="absolute bottom-0 left-0 right-0 bg-black/80 p-5 rounded-t-3xl">
              <p className="text-white mb-3 text-sm">
                Viewed by {active.viewCount || 0}
              </p>

              {viewerDetails.length === 0 ? (
                <p className="text-white/40 text-sm">No views yet</p>
              ) : (
                viewerDetails.map((v, i) => (
                  <div key={i} className="flex items-center gap-3 mb-2">
                    <img
                      src={v.profilePic || "/avatar.png"}
                      className="size-8 rounded-full"
                    />
                    <p className="text-white text-sm">
                      {v.fullName || "User"}
                    </p>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CONTENT */}
        {active.type === "image" ? (
          <img
            src={active.content}
            className="max-h-full max-w-full"
            draggable={false}
          />
        ) : (
          <div
            className="flex items-center justify-center h-full w-full text-white text-2xl"
            style={{ background: bg }}
          >
            {active.content}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default StatusViewer;