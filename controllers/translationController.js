import fs from "fs";
import path from "path";
import axios from "axios";
import Translation from "../models/translationModel.js";

const MODEL_API_URL = "https://mediapipe-yolo-railway-app-production.up.railway.app";

class TranslationController {
  constructor(io) {
    this.io = io;
    this.uploadDir = path.join(process.cwd(), "uploads");

    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  handleConnection(socket) {
    console.log("Translation client connected:", socket.id);

    // Handle gesture-to-text for normal users
    socket.on("translate-gesture", async (data) => {
      try {
        let imagePath;

        if (data.filePath) {
          // Use the provided file path
          imagePath = path.join(this.uploadDir, data.filePath);
        } else if (data.image) {
          // Save buffer to a temporary file
          imagePath = path.join(this.uploadDir, `image-${Date.now()}.jpg`);
          fs.writeFileSync(imagePath, data.image);
        } else {
          throw new Error("No image data provided");
        }

        // Send the image to the external model API
        const formData = new FormData();
        formData.append("file", fs.createReadStream(imagePath));

        const response = await axios.post(`${MODEL_API_URL}/predict`, formData, {
          headers: {
            ...formData.getHeaders(),
          },
        });

        // Emit the result back to the client
        socket.emit("gesture-translation", {
          success: true,
          text: response.data.text, // Assuming the API returns a `text` field
          timestamp: new Date(),
        });

        // Clean up the temporary file
        if (data.image) {
          fs.unlinkSync(imagePath);
        }
      } catch (error) {
        console.error("Error translating gesture:", error.message);
        socket.emit("gesture-translation", {
          success: false,
          error: error.message,
        });
      }
    });
  }
}

// Create a new translation
export const createTranslation = async (req, res) => {
  try {
    const { type, input, output } = req.body;
    const translation = new Translation(type, input, output);
    const result = await translation.save();
    res.status(201).json({ message: "Translation created successfully", data: result });
  } catch (error) {
    res.status(500).json({ message: "Error creating translation", error: error.message });
  }
};

// Get all translations
export const getAllTranslations = async (req, res) => {
  try {
    const translations = await Translation.getAllTranslations();
    res.status(200).json({ data: translations });
  } catch (error) {
    res.status(500).json({ message: "Error fetching translations", error: error.message });
  }
};

// Get translation by ID
export const getTranslationById = async (req, res) => {
  try {
    const { id } = req.params;
    const translation = await Translation.findById(id);
    if (!translation) {
      return res.status(404).json({ message: "Translation not found" });
    }
    res.status(200).json({ data: translation });
  } catch (error) {
    res.status(500).json({ message: "Error fetching translation", error: error.message });
  }
};

// Update translation
export const updateTranslation = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const result = await Translation.updateTranslation(id, updateData);
    res.status(200).json({ message: "Translation updated successfully", data: result });
  } catch (error) {
    res.status(500).json({ message: "Error updating translation", error: error.message });
  }
};

// Delete translation
export const deleteTranslation = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Translation.deleteTranslation(id);
    res.status(200).json({ message: "Translation deleted successfully", data: result });
  } catch (error) {
    res.status(500).json({ message: "Error deleting translation", error: error.message });
  }
}

export default TranslationController;
