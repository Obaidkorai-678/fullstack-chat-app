import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import multer from "multer";

import {
  getUsersForSidebar,
  getMessages,
  getGroupMessages,
  sendMessage,
  markSeen,
} from "../controllers/message.controller.js";

const router = express.Router();

// ================= MULTER CONFIG =================
const upload = multer({
  dest: "uploads/",
});

// ================= ROUTES =================

// Get all users for sidebar (with last message preview + unread count)
router.get("/users", protectRoute, getUsersForSidebar);

// Get group chat messages (must be before /:id)
router.get("/group/:id", protectRoute, getGroupMessages);

// Mark messages as seen
router.put("/seen/:id", protectRoute, markSeen);

// Get chat messages
router.get("/:id", protectRoute, getMessages);

// ================= SEND MESSAGE (TEXT + IMAGE + AUDIO) + GROUP =================
router.post(
  "/send/:id",
  protectRoute,
  upload.single("file"),
  sendMessage
);

export default router;
