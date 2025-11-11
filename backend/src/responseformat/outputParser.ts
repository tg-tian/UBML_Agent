import { z } from "zod";
import {toolStrategy } from "langchain";

const softwareRequirementsSchema = z.object({
  ProjectOverview: z.object({
    Name: z.string().describe("Project name"),
    Description: z.string().describe("Project background and goals"),
    Scope: z.object({
      InScope: z.array(z.string()),
      OutOfScope: z.array(z.string()),
    }),
  }),

  FunctionalRequirements: z.array(
    z.object({
      ID: z.string(),
      Title: z.string(),
      Description: z.string(),
      Priority: z.enum(["High", "Medium", "Low"]),
      Preconditions: z.string().optional(),
      Trigger: z.string().optional(),
      MainFlow: z.array(z.string()).optional(),
      AlternateFlows: z.array(z.string()).optional(),
      Postconditions: z.string().optional(),
      Dependencies: z.array(z.string()).optional(),
    })
  ),

  NonFunctionalRequirements: z
    .array(
      z.object({
        ID: z.string(),
        Category: z.enum([
          "Performance",
          "Security",
          "Usability",
          "Reliability",
          "Maintainability",
          "Scalability",
          "Portability",
        ]),
        Description: z.string(),
        Metric: z.string().optional(),
        Priority: z.enum(["High", "Medium", "Low"]),
      })
    )
    .optional(),
});

export const softwareRequirementsFormat = toolStrategy(softwareRequirementsSchema);

