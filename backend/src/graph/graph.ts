import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { END, START } from "@langchain/langgraph";
import { requirementsAgent } from "../agents/requirementsAgent.js";
import { ubmlAgent } from "../agents/ubmlAgent.js";
import { codeValidatorAgent } from "../agents/codeValidatorAgent.js";

export const graph = new StateGraph(MessagesAnnotation)
  .addNode("requirementsAgent", requirementsAgent)
  .addNode("ubmlAgent", ubmlAgent)
  .addNode("codeValidatorAgent", codeValidatorAgent)
  .addEdge(START, "requirementsAgent")
  .addEdge("requirementsAgent", "ubmlAgent")
  .addEdge("ubmlAgent", "codeValidatorAgent")
  .addConditionalEdges(
    "codeValidatorAgent",
    (state) => {
      const lastMessage = state?.messages?.[state.messages.length - 1];
      const content = lastMessage?.content?.toString() || "";
      if (content.includes("[NEXT: END]")) return "END";
      if (content.includes("[NEXT: UBML]")) return "ubmlAgent";
      if (content.includes("[NEXT: REQUIREMENTS]")) return "requirementsAgent";
      return "requirementsAgent";
    },
    {
      requirementsAgent: "requirementsAgent",
      ubmlAgent: "ubmlAgent",
      END: END,
    }
  )
  .compile();