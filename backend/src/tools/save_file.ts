import fs from "fs";
import path from "path";
import * as z from "zod";
import { tool } from "langchain";

/**
 * LangChain Tool：保存 JSON 内容到文件系统
 */
export const saveJsonFile = tool(
  async ({ filePath, json }) => {
    try {
      // 自动创建目录
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // JSON 格式化（如果可能）
      let contentToWrite = json;
      try {
        const parsed = JSON.parse(json);
        contentToWrite = JSON.stringify(parsed, null, 2); // 自动格式化
      } catch {
        // 如果不是合法 JSON，也直接写入原文
      }

      fs.writeFileSync(filePath, contentToWrite, "utf8");

      return JSON.stringify({
        success: true,
        path: filePath,
        message: "文件已成功写入。",
      });
    } catch (err) {
      return JSON.stringify({
        success: false,
        path: filePath,
        error: (err as Error).message,
      });
    }
  },
  {
    name: "save_json_file",
    description: "将 JSON 内容保存到指定路径的文件系统中。",
    schema: z.object({
      filePath: z.string().describe("要保存的文件路径，例如 './UBML/button.json'"),
      json: z.string().describe("要写入的 JSON 字符串"),
    }),
  }
);
