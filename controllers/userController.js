// import Database here
import asyncHandler from "express-async-handler";
import fakeDB from "../models/userFakeDB.js";
import {v4 as uuidv4} from 'uuid';
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if(!name || !email || !password){
    res.status(400);
    throw new Error("Please provide all fields");
  }

  const newUser = {
    id: uuidv4(),
    name,
    email, 
    password
  }

  fakeDB.push(newUser);
  // Add database login here

  res.status(201).json({ message: "User created successfully" , data: newUser});
});

export const getAllUsers = asyncHandler(async (req, res) => {
  // Add database logic here
  res.status(200).json({ message: "User fetched successfully", data: [] });
});

export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // Add database logic here

  res.status(200).json({ message: "User fetched successfully", data: {} });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

    // Add database logic here

    res.status(200).json({message: "User updated successfully", data: {}});
});

export const deleteUser = asyncHandler(async (req,res)=>{
    const {id} = req.params;
    // Add database logic here
    res.status(200).json({message: "User deleted successfully", data: {}});
})

