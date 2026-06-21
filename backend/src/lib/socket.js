import { Server } from "socket.io";
import http from "http";
import express from "express";
import User from "../models/user.model.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://fullstack-chat-app-five-wheat.vercel.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// userId -> Set(socketId)  (supports multiple tabs)
const userSocketMap = {};

export function getReceiverSocketId(userId) {
  const set = userSocketMap[userId];
  return set && set.size > 0 ? Array.from(set)[0] : undefined;
}

export function getReceiverSocketIds(userIds) {
  const ids = [];

  userIds.forEach((uid) => {
    const set = userSocketMap[uid.toString()];
    if (set) ids.push(...Array.from(set));
  });

  return [...new Set(ids)];
}

export function isUserOnline(userId) {
  const set = userSocketMap[userId.toString()];
  return !!(set && set.size > 0);
}

async function updateUserPresence(userId, online) {
  if (online) {
    await User.findByIdAndUpdate(userId, { lastActive: new Date() });
  } else {
    await User.findByIdAndUpdate(userId, { lastActive: new Date() });
  }
}

async function broadcastPresence(userId, online) {
  const user = await User.findById(userId).select("fullName lastActive");
  if (!user) return;
  io.emit("presence", {
    userId,
    isOnline: online,
    lastActive: user.lastActive,
  });
}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) {
    if (!userSocketMap[userId]) userSocketMap[userId] = new Set();
    userSocketMap[userId].add(socket.id);

    updateUserPresence(userId, true);
    broadcastPresence(userId, true);
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // ================= JOIN GROUP ROOM =================
  socket.on("group:join", (groupId) => {
    if (groupId) socket.join(`group:${groupId}`);
  });

  // ================= LEAVE GROUP ROOM =================
  socket.on("group:leave", (groupId) => {
    if (groupId) socket.leave(`group:${groupId}`);
  });

  // ================= TYPING INDICATOR =================
  socket.on("typing", ({ receiverId, isGroup }) => {
    if (!userId) return;
    if (isGroup) {
      const gid = receiverId;
      socket.to(`group:${gid}`).emit("typing", {
        senderId: userId,
        chatId: gid,
        isGroup: true,
      });
    } else {
      const sids = getReceiverSocketIds([receiverId]);
      sids.forEach((sid) =>
        io.to(sid).emit("typing", {
          senderId: userId,
          chatId: receiverId,
          isGroup: false,
        })
      );
    }
  });

  socket.on("stopTyping", ({ receiverId, isGroup }) => {
    if (!userId) return;
    if (isGroup) {
      socket.to(`group:${receiverId}`).emit("stopTyping", {
        senderId: userId,
        chatId: receiverId,
        isGroup: true,
      });
    } else {
      const sids = getReceiverSocketIds([receiverId]);
      sids.forEach((sid) =>
        io.to(sid).emit("stopTyping", {
          senderId: userId,
          chatId: receiverId,
          isGroup: false,
        })
      );
    }
  });

  // ================= SEEN GROUP =================
  socket.on("group:seen", ({ groupId, userId: seenBy }) => {
    if (!userId) return;
    socket.to(`group:${groupId}`).emit("group:seen", {
      groupId,
      seenBy: seenBy || userId,
    });
  });

  // ================= MARK USER ONLINE (reconnect) =================
  socket.on("user:online", () => {
    if (!userId) return;
    io.emit("presence", { userId, isOnline: true });
  });

  socket.on("disconnect", async () => {
    console.log("A user disconnected:", socket.id);

    if (userId && userSocketMap[userId]) {
      userSocketMap[userId].delete(socket.id);
      if (userSocketMap[userId].size === 0) {
        delete userSocketMap[userId];
        await updateUserPresence(userId, false);
        broadcastPresence(userId, false);
      }
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };