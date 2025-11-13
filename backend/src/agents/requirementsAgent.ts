import { DeepSeek } from "../config/modelConfig.js";
import { MessagesAnnotation } from "@langchain/langgraph";
import { createAgent } from "langchain";
import { extractKeywords } from "../tools/extract_keywords.js";
import { searchRelevantInfo } from "../tools/search_relevant_info.js";
import systemPrompt from "../prompt/requirementsPrompt.js";

const agent = createAgent({
  model: DeepSeek,
  tools: [searchRelevantInfo],
  systemPrompt,
});

export const requirementsAgent = async (state: typeof MessagesAnnotation.State) => {

  const recentMessages = (state.messages ?? []).slice(-3);
  const tempState = {
    ...state,
    messages: recentMessages,
  };
  const result = await agent.invoke(tempState);
  const lastMessage = result?.messages?.[result.messages.length - 1];
  const requirementsText = lastMessage?.content?.toString?.() ?? "";
  return {
    ...state,
    messages: [...(state.messages ?? []), lastMessage],
    requirements: requirementsText,
  };

};




