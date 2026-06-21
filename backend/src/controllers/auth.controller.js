import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

const sanitizeUser = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  profilePic: user.profilePic,
  bio: user.bio,
  statusMessage: user.statusMessage,
  lastActive: user.lastActive,
  preferences: user.preferences,
  privacy: user.privacy,
  theme: user.theme,
  createdAt: user.createdAt,
});

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (!newUser) {
      return res.status(400).json({
        message: "Invalid user data",
      });
    }

    generateToken(newUser._id, res);

    newUser.lastActive = new Date();
    await newUser.save();

    res.status(201).json(sanitizeUser(newUser));
  } catch (error) {
    console.log("Error in signup controller:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    generateToken(user._id, res);

    user.lastActive = new Date();
    await user.save();

    res.status(200).json(sanitizeUser(user));
  } catch (error) {
    console.log("Error in login controller:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    if (req.user?._id) {
      await User.findByIdAndUpdate(req.user._id, { lastActive: new Date() });
    }

    res.cookie("jwt", "", {
      maxAge: 0,
    });

    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log("Error in logout controller:", error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({
        message: "Profile picture is required",
      });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      folder: "chat-app-profiles",
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true }
    ).select("-password");

    res.status(200).json(sanitizeUser(updatedUser));
  } catch (error) {
    console.log("Error in update profile:", error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateDetails = async (req, res) => {
  try {
    const { fullName, bio, statusMessage } = req.body;
    const userId = req.user._id;

    const update = {};
    if (fullName !== undefined) {
      if (!fullName.trim()) return res.status(400).json({ message: "Name cannot be empty" });
      update.fullName = fullName.trim();
    }
    if (bio !== undefined) update.bio = bio.slice(0, 160);
    if (statusMessage !== undefined) update.statusMessage = statusMessage.slice(0, 80);

    const updatedUser = await User.findByIdAndUpdate(userId, update, {
      new: true,
    }).select("-password");

    res.status(200).json(sanitizeUser(updatedUser));
  } catch (error) {
    console.log("Error in updateDetails:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updatePreferences = async (req, res) => {
  try {
    const userId = req.user._id;
    const allowed = [
      "soundEnabled",
      "enterToSend",
      "showTypingIndicators",
      "messageAnimations",
      "showOnlineStatus",
    ];

    const update = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) {
        update[`preferences.${key}`] = req.body[key];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(userId, update, {
      new: true,
    }).select("-password");

    res.status(200).json(sanitizeUser(updatedUser));
  } catch (error) {
    console.log("Error in updatePreferences:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updatePrivacy = async (req, res) => {
  try {
    const userId = req.user._id;
    const update = {};
    if (req.body.lastSeenVisibility) {
      update["privacy.lastSeenVisibility"] = req.body.lastSeenVisibility;
    }
    if (req.body.onlineStatusVisibility) {
      update["privacy.onlineStatusVisibility"] = req.body.onlineStatusVisibility;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, update, {
      new: true,
    }).select("-password");

    res.status(200).json(sanitizeUser(updatedUser));
  } catch (error) {
    console.log("Error in updatePrivacy:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateTheme = async (req, res) => {
  try {
    const { theme } = req.body;
    if (!theme) return res.status(400).json({ message: "Theme is required" });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { theme },
      { new: true }
    ).select("-password");

    res.status(200).json(sanitizeUser(updatedUser));
  } catch (error) {
    console.log("Error in updateTheme:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(sanitizeUser(req.user));
  } catch (error) {
    console.log("Error in checkAuth controller:", error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
