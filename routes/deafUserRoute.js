import express from "express";
import {
  createDeafUser,
  getAllDeafUsers,
  getDeafUserById,
  updateDeafUser,
  deleteDeafUser,
} from "../controllers/deafUserController.js";

const router = express.Router();

router.post("/", createDeafUser);
router.get("/", getAllDeafUsers);
router.get("/:id", getDeafUserById);
router.put("/:id", updateDeafUser);
router.delete("/:id", deleteDeafUser);

export default router;
