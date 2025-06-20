import express from "express";
import dotenv from "dotenv";
import { connectDB, client } from "./models/connection.js";
dotenv.config();
import cors from "cors";
import morgan from "morgan";
import { createServer } from "http";
import { Server } from "socket.io";
import adminRoutes from "./routes/adminRoute.js";
import videoCallRoutes from "./routes/videoCallRoute.js";
import deafUserRoutes from "./routes/deafUserRoute.js";
import normalUserRoutes from "./routes/normalUserRoute.js";
import deafAuthRoutes from "./routes/deafAuthRoute.js";
import normalAuthRoutes from "./routes/normalAuthRoute.js";
import TranslationController from "./controllers/translationController.js";
import multer from "multer";
import { sendImageToFastAPI } from "./utils/fastapiClient.js";
import modelRoutes from "./routes/modelRoute.js";

import { Socket } from "dgram";
// import mongoose from 'mongoose';
// intialize express
const app = express();
const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);
const upload = multer({ dest: "uploads/" }); // فولدر لحفظ الصور المرفوعة

// Initialize Socket.IO with CORS config
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// important middlewares
app.use(express.json());
app.use(express.static("public"));
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3001",
    credentials: true,
  })
);

// Initialize translation controller
const translationController = new TranslationController(io);

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);

  // Handle translations
  translationController.handleConnection(socket);
  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
  });
});

// My Routes
app.use("/api", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", videoCallRoutes);
app.use("/api/deaf-users", deafUserRoutes);
app.use("/api/normal-users", normalUserRoutes);
app.use("/api/deaf-auth", deafAuthRoutes);
app.use("/api/normal-auth", normalAuthRoutes);
app.use("/api", modelRoutes);

app.post("/api/detect", upload.single("image"), async (req, res) => {
  try {
    const imagePath = req.file.path; // مسار الصورة المرفوعة
    const fastAPIResponse = await sendImageToFastAPI(imagePath);

    res.status(200).json({
      message: "Detection successful",
      data: fastAPIResponse,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error detecting object",
      error: error.message,
    });
  }
});

(async () => {
  try {
    console.log("Connecting to the database...");
    await connectDB();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
})();

process.on("SIGINT", async () => {
  await client.close();
  console.log("MongoDB connection closed"); // close the MongoDB connection
  process.exit(0);
});
