import { z } from "zod";
import { tool } from "langchain";
import { DeepSeek } from "../config/modelConfig.js";
import { UBMLSchema } from "../responseformat/ubmlOutputParser.js";

// 根据需求与既有 UBML 模板生成新的 UBML 范式
export const generate_ubml = tool({
  name: "generate_ubml",
  description:
    "根据结构化/文本需求与已有 UBML 模板，生成新的 UBML 范式（返回 JSON 符合 UBMLSchema）",
  schema: z.object({
    requirements: z.union([z.string(), z.record(z.any())]),
    ubmlCatalog: z
      .array(
        z.object({
          name: z.string(),
          version: z.string().optional(),
          content: z.string().describe("UBML 范式的文本或 JSON 片段"),
        })
      )
      .default([]),
    notes: z.string().optional(),
  }),
  func: async ({ requirements, ubmlCatalog, notes }) => {
    const reqStr =
      typeof requirements === "string"
        ? requirements
        : JSON.stringify(requirements, null, 2);
    const catalogStr = ubmlCatalog
      .map((c) => `- ${c.name} ${c.version ?? ""}\n${c.content}`)
      .join("\n\n");

    const prompt = `任务：生成新的 UBML 范式。\n\n` +
      `输入需求：\n${reqStr}\n\n` +
      `既有 UBML 模板：\n${catalogStr || "(无)"}\n\n` +
      `注意事项：${notes ?? "无"}\n\n` +
      `要求：\n` +
      `1) 对齐既有 UBML 的通用结构与约定；指出复用与差异。\n` +
      `2) 输出严格为 JSON，符合以下 Schema（字段名与层级必须匹配）：\n` +
      `${JSON.stringify(UBMLSchema.shape, null, 2)}\n` +
      `3) 所有内容使用中文短句描述，可验证且可落地。\n`;

    const res = await DeepSeek.invoke(prompt);
    const text = (Array.isArray(res.content)
      ? res.content.map((c: any) => (c?.type === "text" ? c.text : "")).join("")
      : (res as any)?.content?.toString?.()) ?? "";

    try {
      const parsed = JSON.parse(text.trim());
      // 运行时校验，确保返回符合 UBMLSchema
      UBMLSchema.parse(parsed);
      return parsed;
    } catch (e) {
      // 如果模型未严格返回 JSON，降级返回原文本，供上层处理
      return { raw: text, error: "Failed to parse UBML JSON", detail: String(e) };
    }
  },
});