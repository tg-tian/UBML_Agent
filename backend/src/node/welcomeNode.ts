import { MessagesAnnotation } from "@langchain/langgraph";
import { AIMessage } from "@langchain/core/messages";

// ✅ 1. 定义欢迎节点
export const welcomeNode = async (state: typeof MessagesAnnotation.State) => {
  const welcomeMessage = new AIMessage({
    content: `
👋 你好！欢迎使用 **UBML 多智能体协同软件构造系统** 🎯  

本系统包含：

- 🤖 **需求分析智能体**：与您沟通、提炼并完善软件需求。
- 🧩 **UBML 智能体**：根据需求生成 UBML 模型（JSON / 图示）。
- 🧠 **代码验证智能体**：检查 UBML 模型的完整性与一致性，并反馈问题。

通过三者协作，我们确保生成的 UBML 模型高质量、可实现、且符合您的需求。
很高兴为您服务😀
    `,
  });

  // 把欢迎语加入 state
  return {
    ...state,
    messages: [...(state.messages ?? []), welcomeMessage],
  };
};
