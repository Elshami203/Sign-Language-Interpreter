import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  createNormalUser,
  getNormalUserByEmail,
} from "../models/normalUserModel.js"; // Import the normalUserModel

export const registerNormalUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide all fields");
  }

  // Check if the user already exists
  const userExists = await getNormalUserByEmail(email);
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  const newUser = {
    name,
    email,
    password: hashedPassword,
    role: "normal",
  };

  const result = await createNormalUser(newUser);

  // Generate a token
  const token = jwt.sign(
    { id: result.insertedId, role: newUser.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.status(201).json({
    message: "Normal user registered successfully",
    data: {
      id: result.insertedId,
      name: newUser.name,
      email: newUser.email,
      token,
    },
  });
});

export const loginNormalUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  // Find the user by email
  const user = await getNormalUserByEmail(email);
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Check if the password matches
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Generate a token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.status(200).json({
    message: "Login successful",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      token,
    },
  });
});