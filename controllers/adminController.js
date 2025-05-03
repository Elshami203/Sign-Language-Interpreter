import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import fakeDB from "../models/userFakeDB.js";
import { v4 as uuidv4 } from "uuid";

const generateAdminToken = (id) => {
  return jwt.sign({ id, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const adminRegister = asyncHandler(async (req, res) => {
  const { name, email, password, adminCode } = req.body;

  if (!name || !email || !password || !adminCode) {
    res.status(400);
    throw new Error("Please provide all fields");
  }

  // Verify admin registration code
  if (adminCode !== process.env.ADMIN_CODE) {
    res.status(401);
    throw new Error("Invalid admin registration code");
  }

  const adminExists = fakeDB.find((user) => user.email === email);
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

  const token = generateAdminToken(newAdmin.id);

  res.status(201).json({
    message: "Admin registered successfully",
    data: {
      id: newAdmin.id,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
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

  const token = generateAdminToken(admin.id);

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
