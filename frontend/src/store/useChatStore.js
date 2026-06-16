import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,

  searchQuery: "",

  isUsersLoading: false,
  isMessagesLoading: false,

  // ================= SEARCH =================
  setSearchQuery: (query) => set({ searchQuery: query }),

  getFilteredUsers: () => {
    const { users, searchQuery } = get();

    if (!searchQuery?.trim()) return users;

    return users.filter((user) => {
      const name = (user.fullName || "").toLowerCase();
      const email = (user.email || "").toLowerCase();
      const q = searchQuery.toLowerCase();

      return name.includes(q) || email.includes(q);
    });
  },

  // ================= USERS =================
  getUsers: async () => {
    set({ isUsersLoading: true });

    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data || [] });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // ================= MESSAGES =================
  getMessages: async (userId) => {
    if (!userId) return;

    set({ isMessagesLoading: true });

    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data || [] });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // ================= SEND MESSAGE =================
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();

    if (!selectedUser?._id) return;

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      set({
        messages: [...messages, res.data],
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send message");
    }
  },

  // ================= SOCKET: SUBSCRIBE =================
  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    const { selectedUser } = get();

    if (!socket || !selectedUser?._id) return;

    socket.off("newMessage");

    socket.on("newMessage", (newMessage) => {
      const currentSelected = get().selectedUser;

      if (!currentSelected) return;

      const isFromCurrentChat =
        newMessage.senderId === currentSelected._id ||
        newMessage.receiverId === currentSelected._id;

      if (!isFromCurrentChat) return;

      set((state) => ({
        messages: [...state.messages, newMessage],
      }));
    });
  },

  // ================= SOCKET: UNSUBSCRIBE =================
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;

    if (!socket) return;

    socket.off("newMessage");
  },

  // ================= SELECT USER =================
  setSelectedUser: (selectedUser) =>
    set({
      selectedUser,
      messages: [],
    }),
}));