import mongoose from "mongoose";

const preferencesSchema = new mongoose.Schema(
  {
    soundEnabled: { type: Boolean, default: true },
    enterToSend: { type: Boolean, default: true },
    showTypingIndicators: { type: Boolean, default: true },
    messageAnimations: { type: Boolean, default: true },
    showOnlineStatus: { type: Boolean, default: true },
  },
  { _id: false }
);

const privacySchema = new mongoose.Schema(
  {
    lastSeenVisibility: {
      type: String,
      enum: ["everyone", "contacts", "nobody"],
      default: "everyone",
    },
    onlineStatusVisibility: {
      type: String,
      enum: ["everyone", "contacts", "nobody"],
      default: "everyone",
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    profilePic: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
      maxlength: 160,
    },
    statusMessage: {
      type: String,
      default: "Available",
      maxlength: 80,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    preferences: {
      type: preferencesSchema,
      default: () => ({}),
    },
    privacy: {
      type: privacySchema,
      default: () => ({}),
    },
    theme: {
      type: String,
      default: "coffee",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
