import mongoose from "mongoose";

const seenBySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    seenAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Direct message recipient (null when groupId is set)
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Group reference (null for direct messages)
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null,
    },

    text: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    // 🎤 Voice Message
    audio: {
      type: String,
      default: "",
    },

    // Read receipts
    delivered: {
      type: Boolean,
      default: false,
    },

    seen: {
      type: Boolean,
      default: false,
    },

    // Group messages track who has seen them
    seenBy: [seenBySchema],
  },
  { timestamps: true }
);

messageSchema.index({ senderId: 1, receiverId: 1 });
messageSchema.index({ groupId: 1, createdAt: 1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
