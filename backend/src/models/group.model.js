import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    avatar: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
      maxlength: 200,
    },
    members: {
      type: [memberSchema],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

groupSchema.methods.isAdmin = function (userId) {
  return this.members.some(
    (m) => m.userId.toString() === userId.toString() && m.role === "admin"
  );
};

groupSchema.methods.isMember = function (userId) {
  return this.members.some((m) => m.userId.toString() === userId.toString());
};

const Group = mongoose.model("Group", groupSchema);

export default Group;
