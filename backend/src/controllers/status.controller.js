

import Status from "../models/status.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketIds, io } from "../lib/socket.js";

const HOURS_24 = 24 * 60 * 60 * 1000;

// ================= DTO =================
const toStatusDTO = (status, viewerId, includeViewers = false) => {
  const views = status.views || [];

  const hasViewed = views.some((v) => {
    const id = v.userId?._id ? v.userId._id : v.userId;
    return id.toString() === viewerId.toString();
  });

  return {
    _id: status._id,
    userId: status.userId,
    type: status.type,
    content: status.content,
    caption: status.caption,
    background: status.background,
    expiresAt: status.expiresAt,
    createdAt: status.createdAt,
    hasViewed,
    viewCount: views.length,

    // ✅ FIXED: always consistent viewer structure
    viewers: includeViewers
      ? views.map((v) => ({
          _id: v.userId?._id || v.userId,
          fullName: v.userId?.fullName || "User",
          profilePic: v.userId?.profilePic || "/avatar.png",
          viewedAt: v.viewedAt,
        }))
      : [],
  };
};

// ================= CREATE STATUS =================
export const createStatus = async (req, res) => {
  try {
    const { type, content, caption, background } = req.body;
    const userId = req.user._id;

    if (!type || !["image", "text"].includes(type)) {
      return res.status(400).json({ message: "Invalid status type" });
    }

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    let finalContent = content;

    if (type === "image" && content.startsWith("data:")) {
      const upload = await cloudinary.uploader.upload(content, {
        folder: "chat-app-status",
      });
      finalContent = upload.secure_url;
    }

    const status = await Status.create({
      userId,
      type,
      content: finalContent,
      caption: caption || "",
      background: background || "",
      expiresAt: new Date(Date.now() + HOURS_24),
    });

    await status.populate("userId", "fullName profilePic");

    io.emit("status:new", { userId: userId.toString() });

    res.status(201).json(toStatusDTO(status, userId, true));
  } catch (error) {
    console.error("Error in createStatus:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ================= GET STATUSES =================
export const getStatuses = async (req, res) => {
  try {
    const userId = req.user._id;
    const since = new Date(Date.now() - HOURS_24);

    const statuses = await Status.find({
      expiresAt: { $gt: new Date() },
      createdAt: { $gte: since },
    })
      .populate("userId", "fullName profilePic")
      .populate("views.userId", "fullName profilePic")
      .sort({ createdAt: -1 });

    const own = [];
    const others = [];

    statuses.forEach((s) => {
      const isOwner = s.userId._id.toString() === userId.toString();
      const dto = toStatusDTO(s, userId, isOwner);

      if (isOwner) own.push(dto);
      else others.push(dto);
    });

    const othersMap = new Map();

    others.forEach((s) => {
      const uid = s.userId._id.toString();

      if (!othersMap.has(uid)) {
        othersMap.set(uid, {
          userId: s.userId,
          statuses: [],
        });
      }

      othersMap.get(uid).statuses.push(s);
    });

    res.status(200).json({
      own,
      others: Array.from(othersMap.values()),
    });
  } catch (error) {
    console.error("Error in getStatuses:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ================= VIEW STATUS =================
export const viewStatus = async (req, res) => {
  try {
    const status = await Status.findById(req.params.id);

    if (!status) {
      return res.status(404).json({ message: "Status not found" });
    }

    const alreadyViewed = status.views.some(
      (v) => v.userId.toString() === req.user._id.toString()
    );

    if (!alreadyViewed && status.userId.toString() !== req.user._id.toString()) {
      status.views.push({ userId: req.user._id });
      await status.save();

      const viewer = await (await import("../models/user.model.js")).default
        .findById(req.user._id)
        .select("fullName profilePic");

      const socketIds = getReceiverSocketIds([status.userId]);

      socketIds.forEach((sid) =>
        io.to(sid).emit("status:viewed", {
          statusId: status._id.toString(),
          viewer: {
            _id: viewer?._id,
            fullName: viewer?.fullName,
            profilePic: viewer?.profilePic,
            viewedAt: new Date(),
          },
        })
      );
    }

    res.status(200).json({ message: "Viewed" });
  } catch (error) {
    console.error("Error in viewStatus:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ================= DELETE STATUS =================
export const deleteStatus = async (req, res) => {
  try {
    const status = await Status.findById(req.params.id);

    if (!status) {
      return res.status(404).json({ message: "Status not found" });
    }

    if (status.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Status.findByIdAndDelete(status._id);

    res.status(200).json({ message: "Status deleted" });
  } catch (error) {
    console.error("Error in deleteStatus:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
