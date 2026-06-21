import mongoose from "mongoose";

const statusViewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const statusSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["image", "text"],
      required: true,
    },
    content: {
      type: String,
      required: true, // image URL for image type, text for text type
    },
    caption: {
      type: String,
      default: "",
      maxlength: 160,
    },
    background: {
      // palette id for text statuses
      type: String,
      default: "",
    },
    views: {
      type: [statusViewSchema],
      default: [],
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

statusSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
statusSchema.index({ userId: 1, createdAt: -1 });

const Status = mongoose.model("Status", statusSchema);

export default Status;
