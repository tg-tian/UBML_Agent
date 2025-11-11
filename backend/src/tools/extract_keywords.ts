import * as z from "zod";
import { tool } from "langchain";
import { DeepSeek } from "../config/modelConfig.js";

// 提取关键词的工具
export const extractKeywords = tool(
  async ({ text }) => {
    // 创建一个模型实例（也可以复用 agent 的 model）
    const model = DeepSeek;

    // 调用模型提取关键词
    const prompt = `
      从以下用户输入中提取 3~8 个最重要的关键词。
      要求输出为 JSON 数组，例如：["关键词1", "关键词2", ...]
      ---
      用户输入：
      ${text}
    `;

    const response = await model.invoke(prompt);

    // 简单清洗一下输出，确保是个数组格式
    try {
      const keywords = JSON.parse(response.content.toString().trim());
      return keywords;
    } catch {
      return response.content;
    }
  },
  {
    name: "extract_keywords",
    description: "extract key terms from user input text.",
    schema: z.object({
      text: z.string().describe("User input or sentence to analyze for keywords."),
    }),
  }
);
