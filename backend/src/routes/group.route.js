import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createGroup,
  getMyGroups,
  getAllUsers,
  getGroup,
  addMember,
  removeMember,
  leaveGroup,
  updateGroup,
} from "../controllers/group.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getAllUsers);
router.get("/", protectRoute, getMyGroups);
router.post("/", protectRoute, createGroup);
router.get("/:id", protectRoute, getGroup);
router.put("/:id", protectRoute, updateGroup);
router.post("/:id/members", protectRoute, addMember);
router.delete("/:id/members/:userId", protectRoute, removeMember);
router.post("/:id/leave", protectRoute, leaveGroup);

export default router;
