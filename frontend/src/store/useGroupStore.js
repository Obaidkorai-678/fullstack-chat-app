import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useGroupStore = create((set, get) => ({
  groups: [],
  allUsers: [],
  selectedGroup: null,
  groupMessages: [],
  typingUsers: {}, // groupId -> Set(userId)

  isLoadingGroups: false,
  isLoadingUsers: false,
  isCreatingGroup: false,
  isSendingGroupMessage: false,

  // ================= FETCH GROUPS =================
  fetchGroups: async () => {
    set({ isLoadingGroups: true });
    try {
      const res = await axiosInstance.get("/groups");
set({ groups: Array.isArray(res.data) ? res.data : [] });

} catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch groups");
    } finally {
      set({ isLoadingGroups: false });
    }
  },

  // ================= FETCH ALL USERS (for member selection) =================
  fetchAllUsers: async () => {
    set({ isLoadingUsers: true });
    try {
      const res = await axiosInstance.get("/groups/users");
      set({ allUsers: res.data || [] });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isLoadingUsers: false });
    }
  },

  // ================= CREATE GROUP =================
  createGroup: async ({ name, description, memberIds, avatar }) => {
    set({ isCreatingGroup: true });
    try {
      const res = await axiosInstance.post("/groups", {
        name,
        description,
        memberIds,
        avatar,
      });
      set((state) => ({ groups: [res.data, ...state.groups] }));
      toast.success("Group created", { duration: 1500 });
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create group");
    } finally {
      set({ isCreatingGroup: false });
    }
  },

  // ================= GET GROUP =================
  fetchGroup: async (groupId) => {
    try {
      const res = await axiosInstance.get(`/groups/${groupId}`);
      set({ selectedGroup: res.data });
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load group");
    }
  },

  // ================= ADD MEMBER =================
  addMember: async (groupId, userId) => {
    try {
      const res = await axiosInstance.post(`/groups/${groupId}/members`, { userId });
      set((state) => ({
        groups: state.groups.map((g) => (g._id === groupId ? res.data : g)),
        selectedGroup: res.data,
      }));
      toast.success("Member added", { duration: 1500 });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add member");
    }
  },

  // ================= REMOVE MEMBER =================
  removeMember: async (groupId, userId) => {
    try {
      const res = await axiosInstance.delete(`/groups/${groupId}/members/${userId}`);
      set((state) => ({
        groups: state.groups.map((g) => (g._id === groupId ? res.data : g)),
        selectedGroup: res.data,
      }));
      toast.success("Member removed", { duration: 1500 });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to remove member");
    }
  },

  // ================= LEAVE GROUP =================
  leaveGroup: async (groupId) => {
    try {
      await axiosInstance.post(`/groups/${groupId}/leave`);
      set((state) => ({
        groups: state.groups.filter((g) => g._id !== groupId),
        selectedGroup: null,
        groupMessages: [],
      }));
      toast.success("Left group", { duration: 1500 });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to leave group");
    }
  },

  // ================= UPDATE GROUP =================
  updateGroup: async (groupId, data) => {
    try {
      const res = await axiosInstance.put(`/groups/${groupId}`, data);
      set((state) => ({
        groups: state.groups.map((g) => (g._id === groupId ? res.data : g)),
        selectedGroup: res.data,
      }));
      toast.success("Group updated", { duration: 1500 });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update group");
    }
  },

  // ================= SEND GROUP MESSAGE =================
sendGroupMessage: async (groupId, messageData) => {
  set({ isSendingGroupMessage: true });
  try {
    const res = await axiosInstance.post(
      `/messages/send/${groupId}`,
      messageData
    );

    set((state) => {
      const exists = state.groupMessages.some(
        (m) => m._id === res.data._id
      );

      return {
        groupMessages: exists
          ? state.groupMessages
          : [...state.groupMessages, res.data],
      };
    });

  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to send message");
  } finally {
    set({ isSendingGroupMessage: false });
  }
},

  // ================= FETCH GROUP MESSAGES =================
  fetchGroupMessages: async (groupId) => {
    try {
      const res = await axiosInstance.get(`/messages/group/${groupId}`);
      set({ groupMessages: res.data || [] });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load messages");
    }
  },

  // ================= SOCKET: JOIN GROUP =================
  joinGroupRoom: (groupId) => {
    const socket = useAuthStore.getState().socket;
    if (!socket || !groupId) return;
    socket.emit("group:join", groupId);
  },

  leaveGroupRoom: (groupId) => {
    const socket = useAuthStore.getState().socket;
    if (!socket || !groupId) return;
    socket.emit("group:leave", groupId);
  },

  // ================= SOCKET: SUBSCRIBE =================
  subscribeToGroupMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("groupMessage");
   socket.on("groupMessage", (message) => {
  const { selectedGroup } = get();

  if (selectedGroup?._id === message.groupId) {
    set((state) => {
      const exists = state.groupMessages.some(
        (m) => m._id === message._id
      );

      return {
        groupMessages: exists
          ? state.groupMessages
          : [...state.groupMessages, message],
      };
    });
  }
});

    socket.off("group:new");
   socket.on("group:new", (group) => {
  set((state) => {
    const exists = state.groups.some(
      (g) => g._id === group._id
    );

    if (exists) return state;

    return {
      groups: [group, ...state.groups],
    };
  });
});

    socket.off("group:updated");
    socket.on("group:updated", (group) => {
      set((state) => ({
        groups: state.groups.map((g) => (g._id === group._id ? group : g)),
        selectedGroup: state.selectedGroup?._id === group._id ? group : state.selectedGroup,
      }));
    });

    socket.off("group:removed");
    socket.on("group:removed", ({ groupId }) => {
      set((state) => ({
        groups: state.groups.filter((g) => g._id !== groupId),
        selectedGroup: state.selectedGroup?._id === groupId ? null : state.selectedGroup,
      }));
    });

    socket.off("typing");
    socket.on("typing", ({ senderId, chatId, isGroup }) => {
      if (!isGroup) return;
      set((state) => {
        const current = state.typingUsers[chatId] || new Set();
        const next = new Set(current);
        next.add(senderId);
        return { typingUsers: { ...state.typingUsers, [chatId]: next } };
      });
    });

    socket.off("stopTyping");
    socket.on("stopTyping", ({ senderId, chatId, isGroup }) => {
      if (!isGroup) return;
      set((state) => {
        const current = state.typingUsers[chatId] || new Set();
        const next = new Set(current);
        next.delete(senderId);
        return { typingUsers: { ...state.typingUsers, [chatId]: next } };
      });
    });

    socket.off("group:newMessage");
    socket.on("group:newMessage", ({ groupId, message }) => {
      const { selectedGroup, groupMessages } = get();
      if (selectedGroup?._id === groupId) {
        // already handled by groupMessage event
        return;
      }
      // bump group to top
      set((state) => ({
        groups: state.groups.map((g) =>
          g._id === groupId ? { ...g, updatedAt: new Date() } : g
        ),
      }));
    });
  },

  unsubscribeFromGroupMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("groupMessage");
    socket.off("group:new");
    socket.off("group:updated");
    socket.off("group:removed");
    socket.off("group:newMessage");
  },

  // ================= SETTERS =================
setSelectedGroup: (group) =>
  set((state) => ({
    selectedGroup: group,
    groupMessages: [],
    typingUsers: {},
    groups: state.groups.filter(
      (g) => g._id !== group?._id
    ),
  })),

  clearTyping: (chatId) =>
    set((state) => {
      const next = { ...state.typingUsers };
      delete next[chatId];
      return { typingUsers: next };
    }),
}));