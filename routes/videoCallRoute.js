import express from "express";
import { createRoom, joinRoom } from "../controllers/videoCallController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/rooms", protect, createRoom);
router.get("/rooms/:roomId", protect, joinRoom);

export default router;
