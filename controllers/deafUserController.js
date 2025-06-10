import asyncHandler from "express-async-handler";
import fakeDB from "../models/deafUserFakeDB.js"; // Separate fake DB for deaf users
import { v4 as uuidv4 } from "uuid";

export const createDeafUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide all fields");
  }

  const newDeafUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };

  fakeDB.push(newDeafUser);

  res
    .status(201)
    .json({ message: "Deaf user created successfully", data: newDeafUser });
});

export const getAllDeafUsers = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json({ message: "Deaf users fetched successfully", data: fakeDB });
});

export const getDeafUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = fakeDB.find((user) => user.id === id);

  if (!user) {
    res.status(404);
    throw new Error("Deaf user not found");
  }

  res
    .status(200)
    .json({ message: "Deaf user fetched successfully", data: user });
});

export const updateDeafUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  const userIndex = fakeDB.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    res.status(404);
    throw new Error("Deaf user not found");
  }

  const updatedUser = { ...fakeDB[userIndex], name, email, password };
  fakeDB[userIndex] = updatedUser;

  res
    .status(200)
    .json({ message: "Deaf user updated successfully", data: updatedUser });
});

export const deleteDeafUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userIndex = fakeDB.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    res.status(404);
    throw new Error("Deaf user not found");
  }

  fakeDB.splice(userIndex, 1);

  res.status(200).json({ message: "Deaf user deleted successfully" });
});
