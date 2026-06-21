import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

/**
 * Backend API URL
 *
 * Set this to wherever your backend is hosted.
 * This can be Railway, Render, AWS, DigitalOcean, local server, etc.
 *
 * Examples:
 * VITE_API_URL=http://localhost:5000
 * VITE_API_URL=https://your-backend-domain.com
 */

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";
export const useAuthStore = create((set, get) => ({
  authUser: null,
  onlineUsers: [],
  userPresence: {}, // userId -> { isOnline, lastActive }

  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isUpdatingDetails: false,
  isUpdatingPreferences: false,
  isUpdatingPrivacy: false,
  isCheckingAuth: true,

  socket: null,

  // ================= AUTH CHECK =================
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // ================= SIGNUP =================
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Welcome! Account created", { duration: 1500 });
      get().connectSocket();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  // ================= LOGIN =================
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Welcome back", { duration: 1500 });
      get().connectSocket();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // ================= LOGOUT =================
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null, onlineUsers: [], userPresence: {} });
      toast.success("Logged out successfully", { duration: 1500 });
      get().disconnectSocket();
    } catch (error) {
      console.log("Error in logout", error);
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  },

  // ================= UPDATE PROFILE PIC =================
  updateProfile: async (formData) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", formData);
      set({ authUser: res.data });
      toast.success("Profile updated successfully", { duration: 1500 });
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // ================= UPDATE DETAILS (name, bio, status) =================
  updateDetails: async (data) => {
    set({ isUpdatingDetails: true });
    try {
      const res = await axiosInstance.put("/auth/update-details", data);
      set({ authUser: res.data });
      toast.success("Profile updated", { duration: 1500 });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update");
    } finally {
      set({ isUpdatingDetails: false });
    }
  },

  // ================= UPDATE PREFERENCES =================
  updatePreferences: async (data) => {
    set({ isUpdatingPreferences: true });
    try {
      const res = await axiosInstance.put("/auth/preferences", data);
      set({ authUser: res.data, isUpdatingPreferences: false });
      return res.data;
    } catch (error) {
      set({ isUpdatingPreferences: false });
      toast.error(error?.response?.data?.message || "Failed to update preferences");
    }
  },

  // ================= UPDATE PRIVACY =================
  updatePrivacy: async (data) => {
    set({ isUpdatingPrivacy: true });
    try {
      const res = await axiosInstance.put("/auth/privacy", data);
      set({ authUser: res.data, isUpdatingPrivacy: false });
      toast.success("Privacy settings updated", { duration: 1500 });
      return res.data;
    } catch (error) {
      set({ isUpdatingPrivacy: false });
      toast.error(error?.response?.data?.message || "Failed to update privacy");
    }
  },

  // ================= UPDATE THEME (sync to server) =================
  syncThemeToServer: async (theme) => {
    try {
      await axiosInstance.put("/auth/theme", { theme });
    } catch (e) {
      // non-critical
    }
  },

  // ================= SOCKET CONNECT =================
  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser) return;
    if (socket?.connected) return;
    if (socket) socket.disconnect();

    const newSocket = io(BASE_URL, {
      transports: ["websocket"],
      query: { userId: authUser._id },
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("getOnlineUsers", (users) => {
      const { authUser } = get();
      set({
        onlineUsers: users.filter((id) => id !== authUser?._id),
      });
    });

    newSocket.on("presence", ({ userId, isOnline, lastActive }) => {
      set((state) => ({
        userPresence: {
          ...state.userPresence,
          [userId]: { isOnline, lastActive: lastActive || state.userPresence[userId]?.lastActive },
        },
      }));
    });

    set({ socket: newSocket });
  },

  // ================= SOCKET DISCONNECT =================
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null, onlineUsers: [], userPresence: {} });
    }
  },

  // ================= PRESENCE HELPERS =================
  isUserOnline: (userId) => {
    const { onlineUsers, userPresence } = get();
    if (onlineUsers.includes(userId)) return true;
    return userPresence[userId]?.isOnline ?? false;
  },

  getUserLastActive: (userId) => {
    return get().userPresence[userId]?.lastActive ?? null;
  },
}));