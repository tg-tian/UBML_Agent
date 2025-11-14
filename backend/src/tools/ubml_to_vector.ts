import * as z from "zod";
import { tool } from "langchain";
import { embeddings } from "../config/modelConfig.js";   // 你自己的 embedding 配置
import { milvus } from "../store/milvus.js";           // Milvus 客户端
import { toolModel } from "../config/modelConfig.js";   // LLM

export const saveUbmlToVectorDB = tool(
  async ({ json, componentName }) => {
    try {
      // --- 1. 让 LLM 总结这个 UBML JSON ---
      const summaryPrompt = `
你是一个 UBML 内容总结助手。

请根据下面的 UBML JSON，生成一个简短的组件描述（用于插入向量数据库）。
规则：
1. 10~50 字
2. 不要重复 JSON 内容
3. 总结组件用途、交互、属性

------------------------------------
${json}
------------------------------------

请给出组件的总结描述：
`;

      const summary = (await toolModel.invoke(summaryPrompt)).content as string;
      const vector = await embeddings.embedQuery(summary);
      const path = `./UBML/${componentName}.json`;
      const insertData = [
        {
          vector,
          component_name: componentName,
          description: summary.slice(0, 1000),
          path,
        },
      ];

      const insertResult = await milvus.insert({
        collection_name: "UBML_Components",
        fields_data: insertData,
      });
      return JSON.stringify({
        success: true,
        component: componentName,
        path,
        summary,
        milvus: insertResult,
      });

    } catch (err) {
      return JSON.stringify({
        success: false,
        error: (err as Error).message,
      });
    }
  },
  {
    name: "save_ubml_to_vector_db",
    description: "将一个 UBML JSON 进行总结、Embedding、并插入 Milvus 向量数据库。",
    schema: z.object({
      json: z.string().describe("UBML JSON 字符串"),
      componentName: z
        .string()
        .describe("组件名，用于保存路径和向量数据库字段"),
    }),
  }
);
