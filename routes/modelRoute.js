import express from "express";
import multer from "multer";
import { predictHandImage } from "../controllers/modelController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Temporary folder for uploaded files

router.post("/predict", upload.single("file"), predictHandImage);

export default router;