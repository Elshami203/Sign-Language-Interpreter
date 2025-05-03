import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import morgan from "morgan";
import { createServer } from "http";
import { Server } from "socket.io";
import userRoutes from "./routes/userRoute.js";
import authRoutes from "./routes/authRoute.js";
import adminRoutes from "./routes/adminRoute.js";
import videoCallRoutes from "./routes/videoCallRoute.js";
import speechToTextRoutes from "./routes/revAiRoute.js";
import revAiService from "./service/revAiService.js";
import ocrRoutes from "./routes/ocrRoute.js";
import TranslationController from "./controllers/translationController.js";

import { Socket } from "dgram";
// import mongoose from 'mongoose';
// intialize express
const app = express();
const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);

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
    origin: process.env.CLIENT_URL || "http://localhost:3000",
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
app.use("/api", userRoutes);
app.use("/api", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", videoCallRoutes);
app.use("/api", speechToTextRoutes);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
