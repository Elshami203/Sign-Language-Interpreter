import axios from "axios";
import fs from "fs";

export const sendImageToFastAPI = async (imagePath) => {
  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(imagePath));

    const response = await axios.post("http://localhost:8000/detect/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data; // بيانات الاستجابة من FastAPI
  } catch (error) {
    console.error("Error communicating with FastAPI:", error.message);
    throw error;
  }
};