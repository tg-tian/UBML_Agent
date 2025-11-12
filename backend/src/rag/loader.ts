import fs from "fs";
import path from "path";
import { Document } from "@langchain/core/documents";
import { toolModel } from "../config/modelConfig.js";

/**
 * 加载本地 JSON 组件文件，并调用 LLM 生成自然语言摘要。
 * 返回 Document 数组，每个 Document 含有 pageContent（摘要）和 metadata（组件名+路径）。
 */
export async function loadJsonComponents(
  dirPath: string
): Promise<Document[]> {
  const files = fs.readdirSync(dirPath);
  const docs: Document[] = [];

  const llm = toolModel;

  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    const fullPath = path.join(dirPath, file);
    const content = JSON.parse(fs.readFileSync(fullPath, "utf8"));

    // 把 JSON 内容转为字符串供模型阅读
    const jsonText = JSON.stringify(content, null, 2);

    // 提示词让模型生成简短总结
    const prompt = `
你是一个前端 UI 组件文档专家。
请阅读以下 JSON Schema，生成一段简洁的自然语言描述，说明这个组件的用途、主要属性以及典型场景。
请用简短中文句子描述，不超过 200 字。

JSON Schema:
${jsonText}
    `;

    const response = await llm.invoke(prompt);
    const summary = response?.content as string;
    console.log(content);

    docs.push(
      new Document({
        pageContent: summary,
        metadata: {
          component: content.title || file.replace(".json", ""),
          path: fullPath,
          rawSchema: content,
        },
      })
    );
  }

  return docs;
}

await loadJsonComponents("./UBML");
