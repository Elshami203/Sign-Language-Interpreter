import express from "express";
import {
  createTranslation,
  getAllTranslations,
  getTranslationById,
  updateTranslation,
  deleteTranslation,
} from "../controllers/translationController.js";

const router = express.Router();

router.post("/", createTranslation); // Create a new translation
router.get("/", getAllTranslations); // Get all translations
router.get("/:id", getTranslationById); // Get a translation by ID
router.put("/:id", updateTranslation); // Update a translation
router.delete("/:id", deleteTranslation); // Delete a translation

export default router;