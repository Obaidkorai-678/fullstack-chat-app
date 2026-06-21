import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  typingUsers: {}, // chatId -> Set(userId)

  searchQuery: "",
  showOnlineOnly: false,

  isUsersLoading: false,
  isMessagesLoading: false,

  // ================= SEARCH / FILTER =================
  setSearchQuery: (query) => set({ searchQuery: query }),
  toggleOnlineOnly: () => set((s) => ({ showOnlineOnly: !s.showOnlineOnly })),

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

set({
  messages: res.data || [],
});    
 // clear unread for this chat
      set((state) => ({
        users: state.users.map((u) =>
          u._id === userId ? { ...u, unreadCount: 0 } : u
        ),
      }));
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
set((state) => ({
  messages: state.messages.some(
    (m) => m._id === res.data._id
  )
    ? state.messages
    : [...state.messages, res.data],
}));
      // update sidebar preview + sorting
      set((state) => {
        const updated = state.users.map((u) =>
          u._id === selectedUser._id
            ? { ...u, lastMessage: { ...res.data, createdAt: res.data.createdAt }, unreadCount: 0 }
            : u
        );
        const sorted = [...updated].sort((a, b) => {
          const at = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
          const bt = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
          return bt - at;
        });
        return { users: sorted };
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send message");
    }
  },

  // ================= MARK SEEN =================
  markMessagesSeen: async (userId) => {
    try {
      await axiosInstance.put(`/messages/seen/${userId}`);
    } catch (e) {
      // silent
    }
  },

  // ================= SOCKET: SUBSCRIBE =================
  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");
    socket.on("newMessage", (newMessage) => {
      const { selectedUser } = get();

      // increment unread if not in active chat
      if (!selectedUser || selectedUser._id !== newMessage.senderId) {
        set((state) => ({
          users: state.users.map((u) =>
            u._id === newMessage.senderId
              ? { ...u, unreadCount: (u.unreadCount || 0) + 1, lastMessage: newMessage }
              : u
          ),
        }));
        // resort
        set((state) => {
          const sorted = [...state.users].sort((a, b) => {
            const at = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
            const bt = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
            return bt - at;
          });
          return { users: sorted };
        });
        return;
      }

set((state) => ({
  messages: state.messages.some(
    (m) => m._id === newMessage._id
  )
    ? state.messages
    : [...state.messages, newMessage],
}));      get().markMessagesSeen(newMessage.senderId);
    });

    // delivered tick
    socket.off("messageDelivered");
    socket.on("messageDelivered", (messageId) => {
      set((state) => ({
        messages: state.messages.map((m) =>
          m._id === messageId ? { ...m, delivered: true } : m
        ),
      }));
    });

    // seen batch
    socket.off("messages:seen");
    socket.on("messages:seen", ({ chatId }) => {
      set((state) => ({
        messages: state.messages.map((m) =>
          m.receiverId && m.receiverId.toString?.() === chatId?.toString?.()
            ? { ...m, seen: true, delivered: true }
            : m
        ),
      }));
    });

    // sidebar live preview update
    socket.off("chat:update");
    socket.on("chat:update", ({ chatId, preview }) => {
      set((state) => {
        const updated = state.users.map((u) =>
          u._id === chatId ? { ...u, lastMessage: preview } : u
        );
        const sorted = [...updated].sort((a, b) => {
          const at = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
          const bt = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
          return bt - at;
        });
        return { users: sorted };
      });
    });

    // typing indicators (direct)
    socket.off("typing");
    socket.on("typing", ({ senderId, chatId, isGroup }) => {
      if (isGroup) return;
      set((state) => {
        const current = state.typingUsers[chatId] || new Set();
        const next = new Set(current);
        next.add(senderId);
        return { typingUsers: { ...state.typingUsers, [chatId]: next } };
      });
    });

    socket.off("stopTyping");
    socket.on("stopTyping", ({ senderId, chatId, isGroup }) => {
      if (isGroup) return;
      set((state) => {
        const current = state.typingUsers[chatId] || new Set();
        const next = new Set(current);
        next.delete(senderId);
        return { typingUsers: { ...state.typingUsers, [chatId]: next } };
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
    socket.off("messageDelivered");
    socket.off("messages:seen");
    socket.off("chat:update");
    socket.off("typing");
    socket.off("stopTyping");
  },

  // ================= SELECT USER =================
  setSelectedUser: (selectedUser) =>
    set({
      selectedUser,
      messages: [],
      typingUsers: {},
    }),

  clearTyping: (chatId) =>
    set((state) => {
      const next = { ...state.typingUsers };
      delete next[chatId];
      return { typingUsers: next };
    }),

  // ================= EMIT TYPING =================
  emitTyping: (chatId, isGroup = false) => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.emit("typing", { receiverId: chatId, isGroup });
  },
  emitStopTyping: (chatId, isGroup = false) => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.emit("stopTyping", { receiverId: chatId, isGroup });
  },
}));