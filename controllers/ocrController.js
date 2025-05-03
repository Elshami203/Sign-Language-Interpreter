import asyncHandler from "express-async-handler";
import ocrService from "../service/OCRService.js";

export const extractText = asyncHandler(async (req, res) => {
  const { imageUrl, language } = req.body;

  if (!imageUrl) {
    res.status(400);
    throw new Error("Image URL is required");
  }

  try {
    const result = await ocrService.extractTextFromImage(imageUrl, language);

    res.status(200).json({
      success: true,
      message: "Text extracted successfully",
      data: result,
    });
  } catch (error) {
    res.status(500);
    throw new Error(`OCR failed: ${error.message}`);
  }
});

export const extractTextFromFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Image file is required");
  }

  try {
    const result = await ocrService.extractTextFromImage(req.file.buffer);

    res.status(200).json({
      success: true,
      message: "Text extracted successfully",
      data: result,
    });
  } catch (error) {
    res.status(500);
    throw new Error(`OCR failed: ${error.message}`);
  }
});
