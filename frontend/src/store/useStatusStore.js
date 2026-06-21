import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useStatusStore = create((set, get) => ({
  ownStatuses: [],
  othersStatuses: [], // [{ userId, statuses: [...] }]
  viewingUser: null,
  viewingIndex: 0,
  isUploading: false,
  isLoading: false,

  // ================= FETCH =================
  fetchStatuses: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/statuses");
      set({
        ownStatuses: res.data.own || [],
        othersStatuses: res.data.others || [],
      });
    } catch (error) {
      // silent — status is non-critical
    } finally {
      set({ isLoading: false });
    }
  },

  // ================= CREATE =================
  createStatus: async ({ type, content, caption, background }) => {
    set({ isUploading: true });
    try {
      const res = await axiosInstance.post("/statuses", { type, content, caption, background });
      set((state) => ({ ownStatuses: [res.data, ...state.ownStatuses] }));
      toast.success("Status posted", { duration: 1500 });
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to post status");
    } finally {
      set({ isUploading: false });
    }
  },

  // ================= VIEW (called when a non-owner watches a status) =================
  viewStatus: async (statusId) => {
    try {
      await axiosInstance.post(`/statuses/${statusId}/view`);
      set((state) => ({
        othersStatuses: state.othersStatuses.map((o) => ({
          ...o,
          statuses: (o.statuses || []).map((s) =>
            s._id === statusId
              ? { ...s, hasViewed: true, viewCount: (s.viewCount || 0) + 1 }
              : s
          ),
        })),
      }));
    } catch (_) {
      // silent
    }
  },

  // ================= DELETE =================
  deleteStatus: async (statusId) => {
    try {
      await axiosInstance.delete(`/statuses/${statusId}`);
      set((state) => ({ ownStatuses: state.ownStatuses.filter((s) => s._id !== statusId) }));
      toast.success("Status deleted", { duration: 1500 });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete status");
    }
  },

  // ================= VIEWER NAVIGATION =================
  openViewer: (userId) => set({ viewingUser: userId, viewingIndex: 0 }),
  closeViewer: () => set({ viewingUser: null, viewingIndex: 0 }),
  nextStatus: () => set((s) => ({ viewingIndex: s.viewingIndex + 1 })),
  prevStatus: () => set((s) => ({ viewingIndex: Math.max(0, s.viewingIndex - 1) })),

  // ================= SOCKET SUBSCRIPTIONS =================
  subscribeToStatusUpdates: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("status:new");
    socket.on("status:new", () => {
      get().fetchStatuses();
    });

    // `viewer` is a populated object { _id, fullName, profilePic, viewedAt }
    // Only the owner receives this event (sent by backend only to owner's socket)
    socket.off("status:viewed");
    socket.on("status:viewed", ({ statusId, viewer }) => {
      set((state) => ({
        ownStatuses: state.ownStatuses.map((s) => {
          if (s._id !== statusId) return s;
          const already = (s.viewers || []).some(
            (v) => v._id?.toString() === viewer?._id?.toString()
          );
          return {
            ...s,
            viewCount: already ? s.viewCount : (s.viewCount || 0) + 1,
            viewers: already ? s.viewers : [...(s.viewers || []), viewer],
          };
        }),
      }));
    });
  },

  unsubscribeFromStatusUpdates: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("status:new");
    socket.off("status:viewed");
  },
}));