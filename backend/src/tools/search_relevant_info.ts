import * as z from "zod";
import { tool } from "langchain";
const SERP_API_KEY = process.env.SERP_API_KEY;
export const searchRelevantInfo = tool(
  async ({ query, max_results }) => {
    const res = await fetch(
      `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&num=${max_results || 5}&api_key=${SERP_API_KEY}`
    );

    const data = await res.json();
    const results = (data.organic_results || []).map((r: any) => ({
      title: r.title,
      url: r.link,
      snippet: r.snippet,
    }));

    return { results };
  },
  {
    name: "search_relevant_info",
    description: "联网搜索获取实时的各种信息",
    schema: z.object({
      query: z.string().describe("要搜索的主题或问题"),
      max_results: z
        .number()
        .int()
        .min(5)
        .max(20)
        .optional()
        .describe("返回的最大条目数（默认 5）"),
    }),
  }
);