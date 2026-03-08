import { GoogleGenerativeAI } from "@google/generative-ai";

let _client: GoogleGenerativeAI | null = null;

export function getGoogleClient(): GoogleGenerativeAI {
  if (!_client) {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY environment variable is required");
    }
    _client = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  }
  return _client;
}
