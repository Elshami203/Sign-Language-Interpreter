import express from "express";
import {
  createNormalUserController,
  getAllNormalUsersController,
  getNormalUserByIdController,
  updateNormalUserController,
  deleteNormalUserController,
} from "../controllers/normalUserController.js";

const router = express.Router();

router.post("/", createNormalUserController);
router.get("/", getAllNormalUsersController);
router.get("/:id", getNormalUserByIdController);
router.put("/:id", updateNormalUserController);
router.delete("/:id", deleteNormalUserController);

export default router;
