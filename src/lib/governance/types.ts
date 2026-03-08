import { z } from "zod";

export const evaluationRequestSchema = z.object({
  agentId: z.string().min(1, "Agent ID is required"),
  actionType: z.string().min(1, "Action type is required"),
  actionDescription: z
    .string()
    .min(10, "Action description must be at least 10 characters"),
  targetParty: z.string().optional(),
  dataInvolved: z.string().optional(),
  context: z.string().optional(),
});

export const agentCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["autonomous", "semi-autonomous", "supervised"]),
  representedOrg: z.string().min(1, "Organization is required"),
  authorityLevel: z.enum(["low", "medium", "high", "critical"]),
  approvedScope: z
    .array(z.string())
    .min(1, "At least one scope must be defined"),
  description: z.string().optional(),
});

export const agentUpdateSchema = agentCreateSchema.partial();

export const policyCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.enum([
    "financial",
    "legal",
    "operational",
    "privacy",
    "security",
    "reputational",
  ]),
  ruleDefinition: z.string().min(10, "Rule definition must be detailed"),
  riskThreshold: z.enum(["low", "medium", "high", "critical"]),
  escalationRule: z.string().optional(),
});

export const policyUpdateSchema = policyCreateSchema.partial();

export const escalationResolveSchema = z.object({
  resolution: z.enum(["approved", "denied"]),
  notes: z.string().min(1, "Resolution notes are required"),
  resolvedBy: z.string().min(1, "Reviewer name is required"),
});

export type EvaluationRequest = z.infer<typeof evaluationRequestSchema>;
export type AgentCreateInput = z.infer<typeof agentCreateSchema>;
export type PolicyCreateInput = z.infer<typeof policyCreateSchema>;
export type EscalationResolveInput = z.infer<typeof escalationResolveSchema>;
