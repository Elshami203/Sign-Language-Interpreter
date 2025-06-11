import asyncHandler from "express-async-handler";
import {
  createNormalUser,
  getAllNormalUsers,
  getNormalUserById,
  updateNormalUser,
  deleteNormalUser,
} from "../models/normalUserModel.js";

export const createNormalUserController = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide all fields");
  }

  const newUser = { name, email, password };
  const result = await createNormalUser(newUser);

  res.status(201).json({ message: "Normal user created successfully", data: result });
});

export const getAllNormalUsersController = asyncHandler(async (req, res) => {
  const users = await getAllNormalUsers();
  res.status(200).json({ data: users });
});

export const getNormalUserByIdController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await getNormalUserById(id);

  if (!user) {
    res.status(404);
    throw new Error("Normal user not found");
  }

  res.status(200).json({ data: user });
});

export const updateNormalUserController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const result = await updateNormalUser(id, updateData);

  res.status(200).json({ message: "Normal user updated successfully", data: result });
});

export const deleteNormalUserController = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await deleteNormalUser(id);

  res.status(200).json({ message: "Normal user deleted successfully", data: result });
});
