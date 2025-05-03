import FormData from "form-data";
import fetch from "node-fetch";

class OCRService {
  constructor() {
    this.apiKey = process.env.OCR_SPACE_API_KEY;
    this.apiUrl = "https://api.ocr.space/parse/image";
  }

  async extractTextFromImage(imageData, language = "eng") {
    try {
      const formData = new FormData();
      formData.append("apikey", this.apiKey);
      formData.append("language", language);
      formData.append("isOverlayRequired", "false");

      // Handle both URL and file uploads
      if (typeof imageData === "string") {
        formData.append("url", imageData);
      } else {
        formData.append("file", imageData, { filename: "image.jpg" });
      }

      const response = await fetch(this.apiUrl, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!result.ParsedResults || result.ParsedResults.length === 0) {
        throw new Error("No text found in image");
      }

      return {
        text: result.ParsedResults[0].ParsedText,
        exitCode: result.OCRExitCode,
        processingTimeInMs: result.ProcessingTimeInMilliseconds,
      };
    } catch (error) {
      console.error("OCR Service Error:", error);
      throw new Error(`OCR processing failed: ${error.message}`);
    }
  }
}
export default new OCRService();
