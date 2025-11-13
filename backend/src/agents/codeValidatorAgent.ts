import { createAgent } from "langchain";
import { DeepSeek } from "../config/modelConfig.js";
import { MessagesAnnotation } from "@langchain/langgraph";
import { retrieveUBML } from "../tools/retrieve_UBML.js";
import { loadFiles } from "../tools/load_files.js";
import { validate_schema } from "../tools/validate_schema.js";
import  validateSystemPrompt from "../prompt/codeValidatorPrompt.js";

const agent = createAgent({
  model: DeepSeek,
  tools: [retrieveUBML,loadFiles,validate_schema],
  systemPrompt: validateSystemPrompt,
});

export const codeValidatorAgent = async (state: typeof MessagesAnnotation.State) => {
  const result = await agent.invoke(state);
  return result;
};
