
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

    let imageUrl = "";
    let audioUrl = "";

    // ================= IMAGE (base64) =================
    if (req.body.image) {
      console.log("Uploading image...");

      const uploadResponse = await cloudinary.uploader.upload(
        req.body.image
      );

      imageUrl = uploadResponse.secure_url;
    }

    // ================= AUDIO (voice note file) =================
if (req.file) {
  console.log("Uploading audio...");

  const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
    resource_type: "video",
  });

  audioUrl = uploadResponse.secure_url;
}

    // ================= SAVE MESSAGE ================= 
    console.log("AUDIO URL:", audioUrl);
    const newMessage = new Message({
      senderId,
      receiverId,
      text: text || "",
      image: imageUrl || "",
      audio: audioUrl || "",
    });

    await newMessage.save();

    console.log("Message saved:", newMessage);

    // ================= SOCKET =================
    const receiverSocketId = getReceiverSocketId(receiverId);

    console.log("Receiver Socket:", receiverSocketId);

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



