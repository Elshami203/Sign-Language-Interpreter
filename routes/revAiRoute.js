import express from "express";
import {
  transcribeAudio,
  getTranscriptionResult,
} from "../controllers/revAiConttoller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/transcribe", protect, transcribeAudio);
router.get("/transcription/:jobId", protect, getTranscriptionResult);

export default router;
