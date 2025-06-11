import express from "express";
import {
  createDeafUserController,
  getAllDeafUsersController,
  getDeafUserByIdController,
  updateDeafUserController,
  deleteDeafUserController,
} from "../controllers/deafUserController.js";

const router = express.Router();

router.post("/", createDeafUserController);
router.get("/", getAllDeafUsersController);
router.get("/:id", getDeafUserByIdController);
router.put("/:id", updateDeafUserController);
router.delete("/:id", deleteDeafUserController);

export default router;
