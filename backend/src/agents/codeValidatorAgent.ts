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
  console.log("codeValidatorAgent state:", state);
  const recentMessages = (state.messages ?? []).slice(-1);
  const tempState = {
    ...state,
    messages: recentMessages,
  };
  console.log("codeValidatorAgent tempState:", tempState);
  const result = await agent.invoke(tempState);
  const lastMessage = result?.messages?.[result.messages.length - 1];
  return {
    ...state,
    messages: [...(state.messages ?? []), lastMessage],
  };
};
