import express from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
  updateProfile,
  updateDetails,
  updatePreferences,
  updatePrivacy,
  updateTheme,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", protectRoute, logout);

router.put("/update-profile", protectRoute, updateProfile);
router.put("/update-details", protectRoute, updateDetails);
router.put("/preferences", protectRoute, updatePreferences);
router.put("/privacy", protectRoute, updatePrivacy);
router.put("/theme", protectRoute, updateTheme);

router.get("/check", protectRoute, checkAuth);

export default router;
