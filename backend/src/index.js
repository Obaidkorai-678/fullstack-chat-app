
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./lib/db.js";
import { server, app } from "./lib/socket.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import groupRoutes from "./routes/group.route.js";
import statusRoutes from "./routes/status.route.js";
import path from "path";

dotenv.config();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();


// middleware
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://fullstack-chat-app-five-wheat.vercel.app",
    ],
    credentials: true,
  })
);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/statuses", statusRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// START SERVER (IMPORTANT FIX)
const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log("🚀 Server running on PORT:", PORT);
    });
  } catch (err) {
    console.log("DB connection failed:", err);
  }
};

startServer();