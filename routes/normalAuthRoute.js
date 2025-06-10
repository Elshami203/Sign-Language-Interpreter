import express from "express";
import { registerNormalUser, loginNormalUser } from "../controllers/normalAuthController.js";

const router = express.Router();

router.post("/register", registerNormalUser);
router.post("/login", loginNormalUser);

export default router;