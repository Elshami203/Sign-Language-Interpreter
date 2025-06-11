import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import adminDB from "../models/admin.js"; // Import the new admin.js database
import { v4 as uuidv4 } from "uuid";

const generateAdminToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export const adminRegister = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide all fields");
  }

  // Check if admin already exists
  const adminExists = await adminDB.find((admin) => admin.email === email);
  if (adminExists) {
    res.status(400);
    throw new Error("Admin already exists");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new admin
  const newAdmin = {
    id: uuidv4(),
    name,
    email,
    password: hashedPassword,
    role: "admin",
  };

  await adminDB.create(newAdmin); // Save the new admin to the database

  // Generate a token
  const token = generateAdminToken(newAdmin.id, newAdmin.role);

  res.status(201).json({
    message: "Admin registered successfully",
    data: {
      id: newAdmin.id,
      name: newAdmin.name,
      email: newAdmin.email,
      token,
    },
  });
});

export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  // Find the admin by email
  const admin = await adminDB.find((user) => user.email === email && user.role === "admin");

  if (!admin) {
    res.status(401);
    throw new Error("Invalid admin credentials");
  }

  // Check if the password matches
  const isPasswordMatch = await bcrypt.compare(password, admin.password);
  if (!isPasswordMatch) {
    res.status(401);
    throw new Error("Invalid admin credentials");
  }

  // Generate a token
  const token = generateAdminToken(admin.id, admin.role);

  res.status(200).json({
    message: "Admin login successful",
    data: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token,
    },
  });
});
