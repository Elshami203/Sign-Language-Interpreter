import asyncHandler from "express-async-handler";
import {
  createDeafUser,
  getAllDeafUsers,
  getDeafUserById,
  updateDeafUser,
  deleteDeafUser,
} from "../models/deafUserModel.js"; // Import the deafUserModel

export const createDeafUserController = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide all fields");
  }

  const newDeafUser = { name, email, password };
  const result = await createDeafUser(newDeafUser);

  res.status(201).json({
    message: "Deaf user created successfully",
    data: { id: result.insertedId, ...newDeafUser },
  });
});

export const getAllDeafUsersController = asyncHandler(async (req, res) => {
  const users = await getAllDeafUsers();
  res.status(200).json({ message: "Deaf users fetched successfully", data: users });
});

export const getDeafUserByIdController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await getDeafUserById(id);

  if (!user) {
    res.status(404);
    throw new Error("Deaf user not found");
  }

  res.status(200).json({ message: "Deaf user fetched successfully", data: user });
});

export const updateDeafUserController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const result = await updateDeafUser(id, updateData);

  if (!result.matchedCount) {
    res.status(404);
    throw new Error("Deaf user not found");
  }

  res.status(200).json({ message: "Deaf user updated successfully", data: updateData });
});

export const deleteDeafUserController = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await deleteDeafUser(id);

  if (!result.deletedCount) {
    res.status(404);
    throw new Error("Deaf user not found");
  }

  res.status(200).json({ message: "Deaf user deleted successfully" });
});
