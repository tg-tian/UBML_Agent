import * as z from "zod";
import { tool } from "@langchain/core/tools";
import { toolModel } from "../config/modelConfig.js";

const validateSchemaInput = z.object({
  json: z.any().describe("要验证的 UBML JSON 配置对象"),
  schema: z.any().describe("用于验证的 JSON Schema 对象"),
});

export const validate_schema = tool(
  async ({ json, schema }) => {

    // 构造提示词
    const prompt = `
你是一名 UBML 模型验证专家。现在你需要判断以下 UBML JSON 是否符合指定的 UBML Schema。

请根据以下规则评估：
1. 如果 JSON 结构与 Schema 完全匹配，输出 "pass"。
2. 如果仅有少量非关键字段差异（例如字段名略不同、类型轻微不符），输出 "pass_with_warnings" 并指出差异。
3. 如果 JSON 结构与 Schema 明显不符（例如缺少主要字段、层级错误），输出 "fail" 并说明原因。

---
【UBML JSON】
${JSON.stringify(json, null, 2)}

【UBML Schema】
${JSON.stringify(schema, null, 2)}

`;
  return (await toolModel.invoke([{ role: "user", content: prompt }])).content;
  },
  {
    name: "validate_schema",
    description:
      "使用大语言模型对比 UBML JSON 与 UBML Schema 的语义一致性，判断其结构是否基本匹配。",
    schema: validateSchemaInput,
  }
);
