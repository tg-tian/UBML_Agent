import { z } from "zod";
import { toolStrategy } from "langchain";

// UBML 范式的结构化输出 Schema
const UBMLMeta = z.object({
  name: z.string().min(1),
  version: z.string().default("0.1.0"),
  description: z.string().min(1),
});

const Attribute = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  description: z.string().default("")
});

const Entity = z.object({
  name: z.string().min(1),
  description: z.string().default("")
});

const Relationship = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  type: z.enum(["one-to-one", "one-to-many", "many-to-one", "many-to-many"]),
  description: z.string().default("")
});

const Component = z.object({
  name: z.string().min(1),
  purpose: z.string().default("")
});

const Interface = z.object({
  name: z.string().min(1),
  endpoint: z.string().default("")
});

const Constraint = z.object({
  name: z.string().min(1),
  type: z.string().default("")
});

const Mapping = z.object({
  requirementId: z.string().min(1),
  mappedTo: z.array(z.string()).default([]),
  note: z.string().default("")
});

const Diff = z.object({
  added: z.array(z.string()).default([]),
  changed: z.array(z.string()).default([]),
  removed: z.array(z.string()).default([]),
  breakingChanges: z.array(z.string()).default([]),
});

export const UBMLSchema = z.object({
  meta: UBMLMeta,
  entities: z.array(Entity).default([]),
  attributes: z.record(z.array(Attribute)).default({}), // key: entity name
  relationships: z.array(Relationship).default([]),
  components: z.array(Component).default([]),
  interfaces: z.array(Interface).default([]),
  constraints: z.array(Constraint).default([]),
  mappings: z.array(Mapping).default([]),
  diff: Diff,
});

export const ubmlFormat = toolStrategy(UBMLSchema);