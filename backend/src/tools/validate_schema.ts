import * as z from "zod";
import { tool } from "@langchain/core/tools";
import pkgAjv from "ajv";
import pkgAddFormats from "ajv-formats";
const Ajv = (pkgAjv as any).default || pkgAjv;
const addFormats = (pkgAddFormats as any).default || pkgAddFormats;

const validateSchemaInput = z.object({
  json: z.any().describe("要验证的 UBML JSON 配置对象"),
  schema: z.any().describe("用于验证的 JSON Schema 对象"),
});

export const validate_schema = tool(
  async ({ json, schema }) => {
    const ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);

    const validate = ajv.compile(schema);
    const valid = validate(json);

    if (valid) {
      return {
        validation_result: "pass",
        message: "✅ 该 JSON 配置符合 UBML Schema 规范。",
      };
    }

    return {
      validation_result: "fail",
      errors: (validate.errors || []).map((err : any) => ({
        path: err.instancePath || "(root)",
        message: err.message || "unknown validation error",
      })),
      suggestion:
        "请根据错误提示修改 UBML 配置，使其符合 JSON Schema 定义。",
    };
  },
  {
    name: "validate_schema",
    description:
      "验证生成的 UBML JSON 配置是否符合指定的 UBML Schema 结构与规则。",
    schema: validateSchemaInput,
  }
);
