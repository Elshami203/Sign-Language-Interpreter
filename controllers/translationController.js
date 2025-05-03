import RevAIService from "../service/revAiService.js";
import OCRService from "../service/OCRService.js";
import fs from "fs";
import path from "path";

class TranslationController {
  constructor(io) {
    this.io = io;
    this.revAiService = RevAIService;
    this.ocrService = OCRService;
    this.uploadDir = path.join(process.cwd(), "uploads");

    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  handleConnection(socket) {
    console.log("Translation client connected:", socket.id);

    // Handle audio-to-text for deaf users
    socket.on("translate-audio", async (data) => {
      try {
        let audioStream;

        if (data.filePath) {
          // Create read stream from file path
          const filePath = path.join(this.uploadDir, data.filePath);
          audioStream = fs.createReadStream(filePath);
        } else if (data.audio) {
          // Save buffer to temporary file and create read stream
          const tempFile = path.join(this.uploadDir, `audio-${Date.now()}.wav`);
          fs.writeFileSync(tempFile, data.audio);
          audioStream = fs.createReadStream(tempFile);
        } else {
          throw new Error("No audio data provided");
        }

        const result = await this.revAiService.transcribeAudio(audioStream);

        socket.emit("audio-translation", {
          success: true,
          text: result.text,
          timestamp: new Date(),
        });

        // Clean up temporary file
        if (data.audio) {
          fs.unlinkSync(tempFile);
        }
      } catch (error) {
        socket.emit("audio-translation", {
          success: false,
          error: error.message,
        });
      }
    });

    // Handle gesture-to-text for normal users
    socket.on("translate-gesture", async (data) => {
      try {
        let imageStream;

        if (data.filePath) {
          // Create read stream from file path
          const filePath = path.join(this.uploadDir, data.filePath);
          imageStream = fs.createReadStream(filePath);
        } else if (data.image) {
          // Save buffer to temporary file and create read stream
          const tempFile = path.join(this.uploadDir, `image-${Date.now()}.jpg`);
          fs.writeFileSync(tempFile, data.image);
          imageStream = fs.createReadStream(tempFile);
        } else {
          throw new Error("No image data provided");
        }

        const result = await this.ocrService.extractTextFromImage(imageStream);

        socket.emit("gesture-translation", {
          success: true,
          text: result.text,
          timestamp: new Date(),
        });

        // Clean up temporary file
        if (data.image) {
          fs.unlinkSync(tempFile);
        }
      } catch (error) {
        socket.emit("gesture-translation", {
          success: false,
          error: error.message,
        });
      }
    });
  }
}

export default TranslationController;
