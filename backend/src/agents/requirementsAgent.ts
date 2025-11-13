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
  const result = await agent.invoke(state);
  return result;
};




