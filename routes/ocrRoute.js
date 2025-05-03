import express from "express";
import multer from "multer";
import {
  extractText,
  extractTextFromFile,
} from "../controllers/ocrController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// OCR from URL
router.post("/extract-text", protect, extractText);

// OCR from file upload
router.post(
  "/extract-text/upload",
  protect,
  upload.single("image"),
  extractTextFromFile
);

export default router;
