import { createAgent } from "langchain";
import { DeepSeek } from "../config/modelConfig.js";
import { MessagesAnnotation } from "@langchain/langgraph";
import { retrieveUBML } from "../tools/retrieve_UBML.js";
import { loadFiles } from "../tools/load_files.js";
import { validate_schema } from "../tools/validate_schema.js";
import { saveUbmlToVectorDB } from "../tools/ubml_to_vector.js";
import { saveJsonFile } from "../tools/save_file.js";
import  validateSystemPrompt from "../prompt/codeValidatorPrompt.js";
import { UBMLState } from "../state/ubmlState.js";
import * as z from "zod";

const agent = createAgent({
  model: DeepSeek,
  tools: [retrieveUBML,loadFiles,validate_schema, saveUbmlToVectorDB, saveJsonFile],
  systemPrompt: validateSystemPrompt,
});

export const codeValidatorAgent = async (state: z.infer<typeof UBMLState>) => {
  if((state.messages?.length ?? 0) >=4){
    state = {
      ...state,
      messages: state.messages?.slice(-2),
    };
  }
  const result = await agent.invoke(state);
  const newMessage = result.messages[result.messages.length - 1];
  return {
    ...state,
    messages: state.messages.concat([newMessage]),
    suggestions: newMessage.content
  };
};
