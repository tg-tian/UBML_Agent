import { createAgent } from "langchain";
import { DeepSeek } from "../config/modelConfig.js";
import ubmlSystemPrompt from "../prompt/ubmlPrompt.js";
import { MessagesAnnotation } from "@langchain/langgraph";

const agent = createAgent({
  model: DeepSeek,
  systemPrompt: ubmlSystemPrompt,
});

export const ubmlAgent = async (state: typeof MessagesAnnotation.State) => {
  const result = await agent.invoke(state);
  return result;
};
