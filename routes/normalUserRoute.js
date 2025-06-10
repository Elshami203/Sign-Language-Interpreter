import express from "express";
import {
  createNormalUser,
  getAllNormalUsers,
  getNormalUserById,
  updateNormalUser,
  deleteNormalUser,
} from "../controllers/normalUserController.js";

const router = express.Router();

router.post("/", createNormalUser);
router.get("/", getAllNormalUsers);
router.get("/:id", getNormalUserById);
router.put("/:id", updateNormalUser);
router.delete("/:id", deleteNormalUser);

export default router;
