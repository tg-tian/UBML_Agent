import { createAgent } from "langchain";
import { DeepSeek } from "../config/modelConfig.js";
import ubmlSystemPrompt from "../prompt/ubmlPrompt.js";
import { retrieveUBML } from "../tools/retrieve_UBML.js";
import { loadFiles } from "../tools/load_files.js";
import { searchRelevantInfo } from "../tools/search_relevant_info.js";
import { UBMLState } from "../state/ubmlState.js";
import * as z from "zod";

const agent = createAgent({
  model: DeepSeek,
  tools: [retrieveUBML,loadFiles,searchRelevantInfo],
  systemPrompt: ubmlSystemPrompt,
});

export const ubmlAgent = async (state: z.infer<typeof UBMLState>) => {
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
    ubmlJson: newMessage.content
  };
};
