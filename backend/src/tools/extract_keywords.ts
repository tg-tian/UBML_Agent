import * as z from "zod";
import { tool } from "langchain";
import { toolModel } from "../config/modelConfig.js";

// 提取关键词的工具
export const extractKeywords = tool(
  async ({ text }) => {
    // 创建一个模型实例（也可以复用 agent 的 model）
    const model = toolModel;

    // 调用模型提取关键词
    const prompt = `
      从以下用户输入中提取 1~8 个最重要的关键词。
      要求输出为 JSON 数组，例如：["关键词1", "关键词2", ...]
      ---
      用户输入：
      ${text}
    `;
    return await model.invoke(prompt);
     
  },
  {
    name: "extract_keywords",
    description: "extract key terms from user input text.",
    schema: z.object({
      text: z.string().describe("User input or sentence to analyze for keywords."),
    }),
  }
);
