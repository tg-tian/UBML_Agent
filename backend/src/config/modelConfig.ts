import "dotenv/config";
import { ChatDeepSeek } from "@langchain/deepseek";

const apiKey = process.env.DEEPSEEK_API_KEY;
if (!apiKey) {
  throw new Error("Missing DEEPSEEK_API_KEY in environment");
}

const modelName = process.env.DEEPSEEK_MODEL || "deepseek-reasoner";

const temperature = process.env.DEEPSEEK_TEMPERATURE
  ? Number(process.env.DEEPSEEK_TEMPERATURE)
  : 0;

const streaming = process.env.DEEPSEEK_STREAMING
  ? process.env.DEEPSEEK_STREAMING === "true"
  : true;

export const DeepSeek = new ChatDeepSeek({
  model: modelName,
  temperature,
  apiKey,
  streaming
});