import * as z from "zod";
import { tool } from "@langchain/core/tools";
import { similaritySearch } from "../store/milvus.js";
// schema: query 为字符串数组
const ragSchema = z.object({
  queries: z
    .array(z.string())
    .nonempty()
    .describe("用户自然语言描述数组，如['需要一个多选下拉框组件', '单选框']"),
  k: z
    .number()
    .min(5)
    .max(20)
    .default(3)
    .describe("要返回的最相关组件数量"),
});

// RAG 检索工具定义
export const retrieveUBML = tool(
  async ({ queries, k }) => {
    let serializedParts: string[] = [];

    for (const query of queries) {
      const retrievedDocs = await similaritySearch(query, k);

      if (!retrievedDocs.length) {
        serializedParts.push(`查询 "${query}" 未找到相关组件。`);
        continue;
      }

      // 序列化为可读字符串
      const serialized = retrievedDocs
        .map(
          (doc: any, i: number) => `
查询 "${query}" - 组件 ${i + 1}:
名称: ${doc.component_name ?? doc.metadata?.component}
路径: ${doc.path ?? doc.metadata?.path}
描述: ${(doc.description || doc.pageContent)?.slice(0, 300)}...
相似度分数: ${doc.score}
        `
        )
        .join("\n");

      serializedParts.push(serialized);
    }

    const finalSerialized = serializedParts.join("\n\n");
    
    return { finalSerialized };
   
  },
  {
    name: "retrieve_component",
    description:
      "从向量数据库中检索与用户需求最相关的UBML组件，并返回其路径和描述。支持批量查询。具体的组件json需要后续根据文件路径读取",
    schema: ragSchema,
  }
);
