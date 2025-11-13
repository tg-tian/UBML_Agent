import { createAgent } from "langchain";
import { DeepSeek } from "../config/modelConfig.js";
import ubmlSystemPrompt from "../prompt/ubmlPrompt.js";
import { MessagesAnnotation } from "@langchain/langgraph";
import { retrieveUBML } from "../tools/retrieve_UBML.js";
import { loadFiles } from "../tools/load_files.js";
import { searchRelevantInfo } from "../tools/search_relevant_info.js";

const agent = createAgent({
  model: DeepSeek,
  tools: [retrieveUBML,loadFiles,searchRelevantInfo],
  systemPrompt: ubmlSystemPrompt,
});

export const ubmlAgent = async (state: typeof MessagesAnnotation.State) => {
  console.log("ubmlAgent state:", state);
  const recentMessages = (state.messages ?? []).slice(-3);
  const tempState = {
    ...state,
    messages: recentMessages,
  };
  const result = await agent.invoke(tempState);
  const lastMessage = result?.messages?.[result.messages.length - 1];
  const ubmljson = lastMessage?.content?.toString?.() ?? "";
  return {
    ...state,
    messages: [...(state.messages ?? []), lastMessage],
    ubmljson,
  };
};
