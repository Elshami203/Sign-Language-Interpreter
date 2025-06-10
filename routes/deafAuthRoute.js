import express from "express";
import { registerDeafUser, loginDeafUser } from "../controllers/deafAuthController.js";

const router = express.Router();

router.post("/register", registerDeafUser);
router.post("/login", loginDeafUser);

export default router;