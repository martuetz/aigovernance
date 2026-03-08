import { getGoogleClient } from "@/lib/google";
import { db } from "@/lib/db";
import { agents, policies, auditLogs, escalations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { GOVERNANCE_SYSTEM_PROMPT } from "./system-prompt";
import type { EvaluationRequest } from "./types";
import type { Decision, RiskLevel, RiskCategory } from "@/types";

interface EvaluationResult {
  decision: Decision;
  conditions: string | null;
  reasoning: string;
  riskLevel: RiskLevel;
  riskCategories: RiskCategory[];
  policiesEvaluated: string[];
  auditLogId: string;
  escalationId?: string;
}

export async function evaluateAction(
  request: EvaluationRequest
): Promise<EvaluationResult> {
  // 1. Look up the agent
  const agent = await db.query.agents.findFirst({
    where: eq(agents.id, request.agentId),
  });

  if (!agent || !agent.isActive) {
    throw new Error(`Agent ${request.agentId} not found or inactive`);
  }

  // 2. Check if action is within approved scope
  const approvedScope: string[] = JSON.parse(agent.approvedScope);
  if (!approvedScope.includes(request.actionType) && !approvedScope.includes("*")) {
    const auditLogId = crypto.randomUUID();
    const reasoning = `Action "${request.actionType}" is outside the agent's approved scope. Approved actions: ${approvedScope.join(", ")}. This action was automatically blocked without LLM evaluation.`;

    await db.insert(auditLogs).values({
      id: auditLogId,
      agentId: agent.id,
      agentName: agent.name,
      representedParty: agent.representedOrg,
      actionType: request.actionType,
      actionDescription: request.actionDescription,
      targetParty: request.targetParty ?? null,
      dataInvolved: request.dataInvolved ?? null,
      contextSummary: request.context ?? null,
      decision: "BLOCK",
      conditions: null,
      reasoning,
      riskLevel: "high",
      riskCategories: JSON.stringify(["security"]),
      policiesEvaluated: JSON.stringify([]),
      escalationId: null,
    });

    return {
      decision: "BLOCK",
      conditions: null,
      reasoning,
      riskLevel: "high",
      riskCategories: ["security"],
      policiesEvaluated: [],
      auditLogId,
    };
  }

  // 3. Load all active policies
  const activePolicies = await db.query.policies.findMany({
    where: eq(policies.isActive, true),
  });

  // 4. Build the evaluation prompt
  const userMessage = buildEvaluationPrompt(agent, request, activePolicies);

  // 5. Call Gemini
  const model = getGoogleClient().getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: GOVERNANCE_SYSTEM_PROMPT,
  });

  const result = await model.generateContent(userMessage);
  const responseText = result.response.text();

  // 6. Parse the structured response
  let parsed: {
    decision: Decision;
    conditions: string | null;
    reasoning: string;
    riskLevel: RiskLevel;
    riskCategories: RiskCategory[];
    policiesEvaluated: string[];
  };

  try {
    parsed = JSON.parse(responseText);
  } catch {
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[1].trim());
    } else {
      throw new Error(`Failed to parse governance evaluation response: ${responseText.substring(0, 200)}`);
    }
  }

  // 7. Create escalation if needed
  const auditLogId = crypto.randomUUID();
  let escalationId: string | undefined;

  if (parsed.decision === "ESCALATE") {
    escalationId = crypto.randomUUID();
    await db.insert(escalations).values({
      id: escalationId,
      auditLogId,
      agentId: agent.id,
      actionType: request.actionType,
      actionDescription: request.actionDescription,
      reasoning: parsed.reasoning,
      riskLevel: parsed.riskLevel,
      status: "pending",
    });
  }

  // 8. Create audit log entry
  await db.insert(auditLogs).values({
    id: auditLogId,
    agentId: agent.id,
    agentName: agent.name,
    representedParty: agent.representedOrg,
    actionType: request.actionType,
    actionDescription: request.actionDescription,
    targetParty: request.targetParty ?? null,
    dataInvolved: request.dataInvolved ?? null,
    contextSummary: request.context ?? null,
    decision: parsed.decision,
    conditions: parsed.conditions ?? null,
    reasoning: parsed.reasoning,
    riskLevel: parsed.riskLevel,
    riskCategories: JSON.stringify(parsed.riskCategories),
    policiesEvaluated: JSON.stringify(parsed.policiesEvaluated),
    escalationId: escalationId ?? null,
  });

  return {
    ...parsed,
    auditLogId,
    escalationId,
  };
}

function buildEvaluationPrompt(
  agent: typeof agents.$inferSelect,
  request: EvaluationRequest,
  activePolicies: (typeof policies.$inferSelect)[]
): string {
  const policyBlock =
    activePolicies.length > 0
      ? activePolicies
          .map(
            (p) =>
              `- [${p.category.toUpperCase()}] ${p.name}: ${p.ruleDefinition} (Risk threshold: ${p.riskThreshold}${p.escalationRule ? `, Escalation: ${p.escalationRule}` : ""})`
          )
          .join("\n")
      : "No policies currently configured.";

  return `## ACTION EVALUATION REQUEST

### AGENT IDENTITY
- Agent ID: ${agent.id}
- Agent Name: ${agent.name}
- Agent Type: ${agent.type}
- Represented Organization: ${agent.representedOrg}
- Authority Level: ${agent.authorityLevel}
- Approved Scope: ${agent.approvedScope}

### PROPOSED ACTION
- Action Type: ${request.actionType}
- Description: ${request.actionDescription}
- Target Party: ${request.targetParty || "Not specified"}
- Data Involved: ${request.dataInvolved || "Not specified"}
- Context: ${request.context || "No additional context provided"}

### APPLICABLE GOVERNANCE POLICIES
${policyBlock}

Evaluate this action against all governance principles and applicable policies. Return your structured JSON decision.`;
}
