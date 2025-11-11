import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { END, START } from "@langchain/langgraph";
import { requirementsAgent } from "../agents/requirementsAgent.js";
import { ubmlAgent } from "../agents/ubmlAgent.js";

export const graph = new StateGraph(MessagesAnnotation)
  .addNode("requirementsAgent", requirementsAgent)
  .addNode("ubmlAgent", ubmlAgent)
  .addEdge(START, "requirementsAgent")
  .addEdge("requirementsAgent", "ubmlAgent")
  .addEdge("ubmlAgent", END)
  .compile();