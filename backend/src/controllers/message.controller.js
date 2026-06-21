import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, getReceiverSocketIds, io } from "../lib/socket.js";

// ================= USERS (sidebar) =================
export const getUsersForSidebar = async (req, res) => {
  try {
    // Return all other users. Last active used for "last seen" display.
    const users = await User.find({
      _id: { $ne: req.user._id },
    })
      .select("-password")
      .sort({ fullName: 1 });

    // Attach last message preview + unread count per user
    const meId = req.user._id;
    const usersWithMeta = await Promise.all(
      users.map(async (u) => {
        const lastMsg = await Message.findOne({
          $or: [
            { senderId: meId, receiverId: u._id },
            { senderId: u._id, receiverId: meId },
          ],
        })
          .sort({ createdAt: -1 })
          .select("text image audio createdAt");

        const unreadCount = await Message.countDocuments({
          senderId: u._id,
          receiverId: meId,
          seen: false,
        });

        return {
          ...u.toObject(),
          lastMessage: lastMsg
            ? {
                text: lastMsg.text,
                image: lastMsg.image,
                audio: lastMsg.audio,
                createdAt: lastMsg.createdAt,
              }
            : null,
          unreadCount,
        };
      })
    );

    const sorted = usersWithMeta.sort((a, b) => {
      const at = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
      const bt = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
      return bt - at;
    });

    res.status(200).json(sorted);
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ================= GET MESSAGES =================
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    // Mark incoming messages as seen on open
    await Message.updateMany(
      { senderId: userToChatId, receiverId: myId, seen: false },
      { seen: true, delivered: true }
    );

    // Notify the sender that their messages were seen
    const senderSid = getReceiverSocketId(userToChatId);
    if (senderSid) {
      io.to(senderSid).emit("messages:seen", {
        chatId: userToChatId,
        seenBy: myId,
      });
    }

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ================= GET GROUP MESSAGES =================
export const getGroupMessages = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({ groupId })
      .sort({ createdAt: 1 })
      .populate("senderId", "fullName profilePic");

    // Mark messages from others as seen by me
    await Message.updateMany(
      {
        groupId,
        senderId: { $ne: myId },
        "seenBy.userId": { $ne: myId },
      },
      { $push: { seenBy: { userId: myId } }, delivered: true }
    );

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getGroupMessages:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ================= SEND MESSAGE (direct + group) =================
export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;
    const isGroup = req.body.isGroup === true || req.body.isGroup === "true";

    const hasText = text && text.trim();

    if (!hasText && !req.file) {
      return res.status(400).json({ error: "Message required" });
    }

    let imageUrl = "";
    let audioUrl = "";

    if (req.file) {
      const isAudio = req.file.mimetype.startsWith("audio");

      const upload = await cloudinary.uploader.upload(req.file.path, {
        resource_type: isAudio ? "video" : "image",
        folder: isAudio ? "chat-app-voice" : "chat-app-images",
      });

      if (isAudio) audioUrl = upload.secure_url;
      else imageUrl = upload.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId: isGroup ? null : receiverId,
      groupId: isGroup ? receiverId : null,
      text: hasText ? text : "",
      image: imageUrl,
      audio: audioUrl,
      delivered: true,
      seen: false,
    });

    await newMessage.populate("senderId", "fullName profilePic");

    if (isGroup) {
      // Broadcast to the group room (everyone except sender)
      io.to(`group:${receiverId}`).emit("groupMessage", newMessage);
      // Also deliver a sidebar "group:newMessage" to all members
      io.to(`group:${receiverId}`).emit("group:newMessage", {
        groupId: receiverId,
        message: newMessage,
      });
    } else {
      // Mark delivered if recipient online handled by socket; here just emit
      const receiverSid = getReceiverSocketId(receiverId);
      if (receiverSid) {
        io.to(receiverSid).emit("newMessage", newMessage);
        io.to(receiverSid).emit("messageDelivered", newMessage._id);
        io.to(receiverSid).emit("chat:update", {
          chatId: senderId,
          preview: newMessage,
        });
      }
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ================= MARK MESSAGES SEEN =================
export const markSeen = async (req, res) => {
  try {
    const { id: chatUserId } = req.params;
    const myId = req.user._id;

    await Message.updateMany(
      { senderId: chatUserId, receiverId: myId, seen: false },
      { seen: true, delivered: true }
    );

    const senderSid = getReceiverSocketId(chatUserId);
    if (senderSid) {
      io.to(senderSid).emit("messages:seen", {
        chatId: myId,
        seenBy: myId,
      });
    }

    res.status(200).json({ message: "Marked seen" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
