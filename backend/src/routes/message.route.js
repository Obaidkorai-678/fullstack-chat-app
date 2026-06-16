import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import multer from "multer";

import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

// ================= MULTER CONFIG =================
const upload = multer({
  dest: "uploads/",
});

// ================= ROUTES =================

// Get all users for sidebar
router.get("/users", protectRoute, getUsersForSidebar);

// Get chat messages
router.get("/:id", protectRoute, getMessages);

// ================= SEND MESSAGE (TEXT + IMAGE + AUDIO) =================
router.post(
  "/send/:id",
  protectRoute,
  upload.single("audio"), // 🔥 REQUIRED FOR VOICE NOTES
  sendMessage
);

export default router;