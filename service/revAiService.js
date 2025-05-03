import { RevAiApiClient } from "revai-node-sdk";

class RevAIService {
  constructor() {
    this.client = new RevAiApiClient(process.env.REV_AI_ACCESS_TOKEN);
  }

  async transcribeAudio(audioData) {
    try {
      // Submit audio for transcription
      const job = await this.client.submitJobLocalFile(audioData);

      // Wait for job completion
      const jobDetails = await this.client.getJobDetails(job.id);

      if (jobDetails.status === "transcribed") {
        const transcript = await this.client.getTranscriptText(job.id);
        return { success: true, text: transcript };
      }

      return { success: false, status: jobDetails.status };
    } catch (error) {
      console.error("RevAI Service Error:", error);
      throw new Error(`Audio transcription failed: ${error.message}`);
    }
  }
}

export default new RevAIService();
