import "dotenv/config";
import { ChatDeepSeek } from "@langchain/deepseek";
import { OpenAIEmbeddings } from "@langchain/openai";

const apiKey = process.env.DEEPSEEK_API_KEY;

const temperature = process.env.DEEPSEEK_TEMPERATURE
  ? Number(process.env.DEEPSEEK_TEMPERATURE)
  : 0;

const streaming = process.env.DEEPSEEK_STREAMING
  ? process.env.DEEPSEEK_STREAMING === "true"
  : true;

export const toolModel = new ChatDeepSeek({
  model: "deepseek-chat",
  temperature,
  apiKey,
  streaming
});

export const DeepSeek = new ChatDeepSeek({
  model: "deepseek-reasoner",
  temperature,
  apiKey,
  streaming
});

export const embeddings = new OpenAIEmbeddings(
  {
    model: "text-embedding-3-small",
    apiKey: process.env.OPENAI_API_KEY,
    configuration: {
      baseURL: process.env.OPENAI_BASE_URL,
    }
  }
);