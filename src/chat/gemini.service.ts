import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

export interface ChatTurn {
  role: 'user' | 'model';
  text: string;
}

/**
 * Thin wrapper around the Vertex AI Gemini client. The client is built lazily
 * (not in the constructor) so a missing GOOGLE_CLOUD_PROJECT only fails a chat
 * request, not the whole app's startup — mirrors DatabaseService's `db` getter.
 */
@Injectable()
export class GeminiService {
  private client?: GoogleGenAI;

  private getClient(): GoogleGenAI {
    if (!this.client) {
      const project = process.env.GOOGLE_CLOUD_PROJECT;
      const location = process.env.GOOGLE_CLOUD_LOCATION ?? 'us-central1';
      if (!project) {
        throw new Error('GOOGLE_CLOUD_PROJECT is required for the Vertex AI Gemini client.');
      }
      // Uses Application Default Credentials: GOOGLE_APPLICATION_CREDENTIALS
      // (service account key file) or `gcloud auth application-default login`.
      this.client = new GoogleGenAI({ vertexai: true, project, location });
    }
    return this.client;
  }

  async generateReply(systemInstruction: string, history: ChatTurn[]): Promise<string> {
    const model = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash';
    const response = await this.getClient().models.generateContent({
      model,
      contents: history.map((turn) => ({ role: turn.role, parts: [{ text: turn.text }] })),
      config: { systemInstruction },
    });
    const text = response.text?.trim();
    if (!text) throw new Error('Gemini returned an empty response.');
    return text;
  }
}
