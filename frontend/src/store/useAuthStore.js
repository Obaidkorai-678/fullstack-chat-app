import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  onlineUsers: [],

  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
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

      toast.success("Welcome! Account created 🎉", {
        duration: 1500,
      });

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

      toast.success("Welcome back 👋", {
        duration: 1500,
      });

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

      set({ authUser: null, onlineUsers: [] });

      toast.success("Logged out successfully 👋", {
        duration: 1500,
      });

      get().disconnectSocket();
    } catch (error) {
      console.log("Error in logout", error);
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  },

  // ================= UPDATE PROFILE =================
  updateProfile: async (formData) => {
    set({ isUpdatingProfile: true });

    try {
      const res = await axiosInstance.put("/auth/update-profile", formData);

      set({ authUser: res.data });

      toast.success("Profile updated successfully ✨", {
        duration: 1500,
      });
    } catch (error) {
      console.log("error in update profile:", error);

      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // ================= SOCKET CONNECT =================
  connectSocket: () => {
    const { authUser, socket } = get();

    if (!authUser) return;
    if (socket?.connected) return;

    if (socket) {
      socket.disconnect();
    }

    const newSocket = io(BASE_URL, {
      transports: ["websocket"],
      query: {
        userId: authUser._id,
      },
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    // ONLINE USERS UPDATE
    newSocket.on("getOnlineUsers", (users) => {
      const { authUser } = get();

      set({
        onlineUsers: users.filter((id) => id !== authUser._id),
      });
    });

    set({ socket: newSocket });
  },

  // ================= SOCKET DISCONNECT =================
  disconnectSocket: () => {
    const socket = get().socket;

    if (socket) {
      socket.disconnect();
      set({ socket: null, onlineUsers: [] });
    }
  },
}));