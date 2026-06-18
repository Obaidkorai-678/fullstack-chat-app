
import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

// ================= GET USERS =================
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user?._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error);

    res.status(500).json({
      success: false,
      error: error?.message || error,
    });
  }
};

// ================= GET MESSAGES =================
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user?._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages controller:", error);

    res.status(500).json({
      success: false,
      error: error?.message || error,
    });
  }
};

// ================= SEND MESSAGE (TEXT + IMAGE + AUDIO) =================
// ================= SEND MESSAGE (TEXT + IMAGE + AUDIO) =================
export const sendMessage = async (req, res) => {
  try {
    console.log("========== SEND MESSAGE ==========");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("PARAMS:", req.params);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
    }

    const { text } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // ================= VALIDATION =================
    const hasText = text && text.trim() !== "";
    const hasImage = !!req.body.image;
    const hasAudio = !!req.file;

    if (!hasText && !hasImage && !hasAudio) {
      return res.status(400).json({
        success: false,
        error: "Message content required",
      });
    }

    let imageUrl = "";
    let audioUrl = "";

    // ================= IMAGE UPLOAD =================
    if (req.body.image) {
      console.log("Uploading image...");

      const uploadResponse = await cloudinary.uploader.upload(
        req.body.image
      );

      imageUrl = uploadResponse.secure_url;
    }

    // ================= AUDIO UPLOAD =================
    if (req.file) {
      console.log("Uploading audio...");

      const uploadResponse = await cloudinary.uploader.upload(
        req.file.path,
        {
          resource_type: "video",
        }
      );

      audioUrl = uploadResponse.secure_url;
    }

    // ================= SAVE MESSAGE =================
    const newMessage = new Message({
      senderId,
      receiverId,
      text: hasText ? text : "",
      image: imageUrl,
      audio: audioUrl,
    });

    await newMessage.save();

    console.log("Message saved:", newMessage);

    // ================= SOCKET EMIT =================
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("========== SEND MESSAGE ERROR ==========");
    console.error(error);

    res.status(500).json({
      success: false,
      error: error?.message || "Internal Server Error",
    });
  }
};



