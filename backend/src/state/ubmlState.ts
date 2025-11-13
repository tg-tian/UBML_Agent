import { MessagesAnnotation } from "@langchain/langgraph";

export interface UBMLState {
  messages: any[]; // LangGraph 的标准消息结构
  requirements?: string;           // 需求分析结果
  ubmlJson?: Record<string, any>;  // UBML JSON 数据
}