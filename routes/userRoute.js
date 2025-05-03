import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/users", createUser);
router.get("/users", protect, authorize("admin"), getAllUsers);
router.get("/users/:id", protect, getUserById);
router.put("/users/:id", protect, updateUser);
router.delete("/users/:id", protect, authorize("admin"), deleteUser);

export default router;
