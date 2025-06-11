import asyncHandler from "express-async-handler";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";

const API_URL = "https://mediapipe-yolo-railway-app-production.up.railway.app";

export const predictHandImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  const filePath = req.file.path;

  try {
    // Prepare the file for the external API
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));

    // Send the request to the external API
    const response = await axios.post(`${API_URL}/predict`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    // Return the response from the external API
    res.status(200).json({
      message: "Prediction successful",
      data: response.data,
    });
  } catch (error) {
    console.error("Error predicting hand image:", error.message);
    res.status(500).json({
      message: "Failed to predict hand image",
      error: error.message,
    });
  } finally {
    // Clean up the uploaded file
    fs.unlinkSync(filePath);
  }
});