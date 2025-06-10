import asyncHandler from "express-async-handler";
import fakeDB from "../models/normalUserFakeDB.js"; // Separate fake DB for normal users
import { v4 as uuidv4 } from "uuid";

export const createNormalUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide all fields");
  }

  const newNormalUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };

  fakeDB.push(newNormalUser);

  res
    .status(201)
    .json({ message: "Normal user created successfully", data: newNormalUser });
});

export const getAllNormalUsers = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json({ message: "Normal users fetched successfully", data: fakeDB });
});

export const getNormalUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = fakeDB.find((user) => user.id === id);

  if (!user) {
    res.status(404);
    throw new Error("Normal user not found");
  }

  res
    .status(200)
    .json({ message: "Normal user fetched successfully", data: user });
});

export const updateNormalUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  const userIndex = fakeDB.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    res.status(404);
    throw new Error("Normal user not found");
  }

  const updatedUser = { ...fakeDB[userIndex], name, email, password };
  fakeDB[userIndex] = updatedUser;

  res
    .status(200)
    .json({ message: "Normal user updated successfully", data: updatedUser });
});

export const deleteNormalUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userIndex = fakeDB.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    res.status(404);
    throw new Error("Normal user not found");
  }

  fakeDB.splice(userIndex, 1);

  res.status(200).json({ message: "Normal user deleted successfully" });
});
