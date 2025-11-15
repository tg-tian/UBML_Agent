import * as z from "zod";
import { tool } from "langchain";
import { toolModel } from "../config/modelConfig.js";

// 提取关键词的工具
export const summarize = tool(
  async ({ text }) => {
    // 创建一个模型实例（也可以复用 agent 的 model）
    const model = toolModel;

    // 调用模型提取关键词
    const prompt = `
      总结提炼用户的输入
      ---
      用户输入：
      ${text}
    `;
    return await model.invoke(prompt);
     
  },
  {
    name: "summarize",
    description: "summarize user input text.",
    schema: z.object({
      text: z.string().describe("User input or sentence to summarize."),
    }),
  }
);
