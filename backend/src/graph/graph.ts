import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { END, START } from "@langchain/langgraph";
import { requirementsAgent } from "../agents/requirementsAgent.js";
import { ubmlAgent } from "../agents/ubmlAgent.js";
import { codeValidatorAgent } from "../agents/codeValidatorAgent.js";
import { UBMLState } from "../state/ubmlState.js";


export const graph = new StateGraph(UBMLState)
  .addNode("requirementsAgent", requirementsAgent)
  .addNode("ubmlAgent", ubmlAgent)
  .addNode("codeValidatorAgent", codeValidatorAgent)
  .addEdge(START, "requirementsAgent")
  .addEdge("ubmlAgent", "codeValidatorAgent")
  .addEdge("codeValidatorAgent", END)
  .addConditionalEdges(
    "codeValidatorAgent",
    (state) => {
      const lastMessage = state?.messages?.[state.messages.length - 1];
      const content = lastMessage?.content?.toString() || "";
      if (content.includes("[NEXT: END]")) return "END";
      if (content.includes("[NEXT: UBML]")) return "ubmlAgent";
      if (content.includes("[NEXT: REQUIREMENTS]")) return "requirementsAgent";
      return "END";
    },
    {
      requirementsAgent: "requirementsAgent",
      ubmlAgent: "ubmlAgent",
      END: END,
    }
  )
  .addConditionalEdges(
    "requirementsAgent",
    (state) => {
      const lastMessage = state?.messages?.[state.messages.length - 1];
      const content = lastMessage?.content?.toString() || "";
      if (content.includes("[NEXT: END]")) return "END";
      return "ubmlAgent";
    },
    {
      ubmlAgent: "ubmlAgent",
      END: END,
    }
  )
  .compile();