import asyncHandler from "express-async-handler";
import revAIService from "../service/revAiService.js";

export const transcribeAudio = asyncHandler(async (req, res) => {
  const { audioUrl } = req.body;

  if (!audioUrl) {
    res.status(400);
    throw new Error("Audio URL is required");
  }

  try {
    const jobId = await revAIService.submitAudioFile(audioUrl);
    res.status(200).json({
      message: "Transcription job submitted successfully",
      data: { jobId },
    });
  } catch (error) {
    res.status(500);
    throw new Error("Error submitting audio for transcription");
  }
});

export const getTranscriptionResult = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  try {
    const result = await revAIService.getTranscription(jobId);
    res.status(200).json({
      message: "Transcription retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Error getting transcription result");
  }
});
