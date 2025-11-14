import { BaseMessage } from "@langchain/core/messages";
import { MessagesZodMeta } from "@langchain/langgraph";
import { registry } from "@langchain/langgraph/zod";
import * as z from "zod";

export const UBMLState = z.object({
  messages: z
    .array(z.custom<BaseMessage>())
    .register(registry, MessagesZodMeta as any),
  requirements: z.string().optional(),
  ubmlJson: z.string().optional(),
  suggestions: z.string().optional()
});
