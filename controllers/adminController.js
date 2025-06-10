import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import fakeDB from "../models/adminFakeDB.js"; // Separate fake DB for admins
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

  const adminExists = fakeDB.find((admin) => admin.email === email);
  if (adminExists) {
    res.status(400);
    throw new Error("Admin already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newAdmin = {
    id: uuidv4(),
    name,
    email,
    password: hashedPassword,
    role: "admin",
  };

  fakeDB.push(newAdmin);

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

  const admin = fakeDB.find(
    (user) => user.email === email && user.role === "admin"
  );

  if (!admin) {
    res.status(401);
    throw new Error("Invalid admin credentials");
  }

  const isPasswordMatch = await bcrypt.compare(password, admin.password);
  if (!isPasswordMatch) {
    res.status(401);
    throw new Error("Invalid admin credentials");
  }

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
