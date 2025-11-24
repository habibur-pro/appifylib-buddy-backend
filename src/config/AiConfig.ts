import { GoogleGenAI } from "@google/genai";
import config from ".";

const AiClient = new GoogleGenAI({ apiKey: config.ai_api_key });
export default AiClient;
