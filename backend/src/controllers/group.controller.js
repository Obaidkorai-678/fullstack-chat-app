import Group from "../models/group.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketIds, io } from "../lib/socket.js";

const sanitizeMember = (m) => ({
  userId: m.userId,
  role: m.role,
  joinedAt: m.joinedAt,
});

const toGroupDTO = (group) => ({
  _id: group._id,
  name: group.name,
  avatar: group.avatar,
  description: group.description,
  createdBy: group.createdBy,
  members: group.members.map(sanitizeMember),
  createdAt: group.createdAt,
  updatedAt: group.updatedAt,
});

// ================= CREATE GROUP =================
export const createGroup = async (req, res) => {
  try {
    const { name, description, memberIds, avatar } = req.body;
    const creatorId = req.user._id;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Group name is required" });
    }

    if (!memberIds || memberIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Select at least one member" });
    }

    let avatarUrl = "";
    if (avatar) {
      const upload = await cloudinary.uploader.upload(avatar, {
        folder: "chat-app-groups",
      });
      avatarUrl = upload.secure_url;
    }

    const memberSet = Array.from(new Set([creatorId.toString(), ...memberIds]));

    const members = memberSet.map((id) => ({
      userId: id,
      role: id === creatorId.toString() ? "admin" : "member",
    }));

    const group = await Group.create({
      name: name.trim(),
      description: description || "",
      avatar: avatarUrl,
      members,
      createdBy: creatorId,
    });

    await group.populate("members.userId", "fullName email profilePic lastActive");
    await group.populate("createdBy", "fullName email profilePic");

    const dto = toGroupDTO(group);

    const socketIds = getReceiverSocketIds(memberSet);
    [...new Set(socketIds)].forEach((sid) => {
      io.to(sid).emit("group:new", dto);
    });

    res.status(201).json(dto);
  } catch (error) {
    console.error("Error in createGroup:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ================= GET USER GROUPS =================
export const getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      "members.userId": req.user._id,
    })
      .populate("members.userId", "fullName email profilePic lastActive")
      .populate("createdBy", "fullName email profilePic")
      .sort({ updatedAt: -1 });

    res.status(200).json(groups.map(toGroupDTO));
  } catch (error) {
    console.error("Error in getMyGroups:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ================= GET ALL USERS (for group member selection) =================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select("fullName email profilePic lastActive")
      .sort({ fullName: 1 });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getAllUsers:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ================= GET SINGLE GROUP =================
export const getGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("members.userId", "fullName email profilePic lastActive")
      .populate("createdBy", "fullName email profilePic");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!group.isMember(req.user._id)) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }

    res.status(200).json(toGroupDTO(group));
  } catch (error) {
    console.error("Error in getGroup:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ================= ADD MEMBER =================
export const addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!group.isAdmin(req.user._id)) {
      return res.status(403).json({ message: "Only admins can add members" });
    }

    if (group.isMember(userId)) {
      return res.status(400).json({ message: "User is already a member" });
    }

    group.members.push({ userId, role: "member" });
    await group.save();

    await group.populate("members.userId", "fullName email profilePic lastActive");
    await group.populate("createdBy", "fullName email profilePic");

    const dto = toGroupDTO(group);

  const socketIds = getReceiverSocketIds([userId]);

[...new Set(socketIds)].forEach((sid) => {
  io.to(sid).emit("group:new", dto);
});

    res.status(200).json(dto);
  } catch (error) {
    console.error("Error in addMember:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ================= REMOVE MEMBER =================
export const removeMember = async (req, res) => {
  try {
    const { userId } = req.params;
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isSelf = userId === req.user._id.toString();

    if (!isSelf && !group.isAdmin(req.user._id)) {
      return res.status(403).json({ message: "Only admins can remove members" });
    }

    group.members = group.members.filter(
      (m) => m.userId.toString() !== userId.toString()
    );

    await group.save();

    await group.populate("members.userId", "fullName email profilePic lastActive");
    await group.populate("createdBy", "fullName email profilePic");

    const dto = toGroupDTO(group);

 const socketIds = getReceiverSocketIds([userId]);

[...new Set(socketIds)].forEach((sid) => {
  io.to(sid).emit("group:removed", { groupId: group._id });
});

    res.status(200).json(dto);
  } catch (error) {
    console.error("Error in removeMember:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ================= LEAVE GROUP =================
export const leaveGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    group.members = group.members.filter(
      (m) => m.userId.toString() !== req.user._id.toString()
    );

    if (group.members.length === 0) {
      await Group.findByIdAndDelete(group._id);
    } else {
      // Ensure at least one admin remains
      const hasAdmin = group.members.some((m) => m.role === "admin");
      if (!hasAdmin) {
        group.members[0].role = "admin";
      }
      await group.save();
    }

    res.status(200).json({ message: "Left group successfully" });
  } catch (error) {
    console.error("Error in leaveGroup:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ================= UPDATE GROUP =================
export const updateGroup = async (req, res) => {
  try {
    const { name, description, avatar } = req.body;
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!group.isAdmin(req.user._id)) {
      return res.status(403).json({ message: "Only admins can update the group" });
    }

    if (name !== undefined) group.name = name.trim();
    if (description !== undefined) group.description = description;

    if (avatar && avatar.startsWith("data:")) {
      const upload = await cloudinary.uploader.upload(avatar, {
        folder: "chat-app-groups",
      });
      group.avatar = upload.secure_url;
    }

    await group.save();

    await group.populate("members.userId", "fullName email profilePic lastActive");
    await group.populate("createdBy", "fullName email profilePic");

    const dto = toGroupDTO(group);

 const allUserIds = dto.members.map((m) => m.userId.toString());

const socketIds = getReceiverSocketIds(allUserIds);

[...new Set(socketIds)].forEach((sid) => {
  io.to(sid).emit("group:updated", dto);
});

    res.status(200).json(dto);
  } catch (error) {
    console.error("Error in updateGroup:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};