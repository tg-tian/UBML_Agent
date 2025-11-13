import fs from "fs";
import * as z from "zod";
import { tool } from "langchain";

/**
 * LangChain Tool：读取多个指定文件的内容
 */
export const loadFiles = tool(
  async ({ files }) => {
    const results: Array<{ path: string; content?: string; error?: string }> = [];

    for (const file of files) {
      try {
        const content = fs.readFileSync(file, "utf8");
        results.push({ path: file, content });
      } catch (err) {
        results.push({ path: file, error: `读取失败: ${(err as Error).message}` });
      }
    }

    return JSON.stringify(results);
  },
  {
    name: "load_files",
    description: "读取多个指定文件的内容并返回文本内容。",
    schema: z.object({
      files: z.array(z.string()).describe("要读取的文件路径数组，例如 ['./a.json', './b.txt']"),
    }),
  }
);
