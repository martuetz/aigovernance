export type Decision =
  | "APPROVE"
  | "APPROVE_WITH_CONDITIONS"
  | "ESCALATE"
  | "BLOCK";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export type RiskCategory =
  | "legal"
  | "financial"
  | "operational"
  | "reputational"
  | "privacy"
  | "security";

export type AgentType = "autonomous" | "semi-autonomous" | "supervised";

export type PolicyCategory =
  | "financial"
  | "legal"
  | "operational"
  | "privacy"
  | "security"
  | "reputational";

export type EscalationStatus = "pending" | "approved" | "denied";

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  representedOrg: string;
  authorityLevel: RiskLevel;
  approvedScope: string[];
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Policy {
  id: string;
  name: string;
  description: string;
  category: PolicyCategory;
  ruleDefinition: string;
  riskThreshold: RiskLevel;
  escalationRule?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  agentId: string;
  agentName: string;
  representedParty: string;
  actionType: string;
  actionDescription: string;
  targetParty?: string | null;
  dataInvolved?: string | null;
  contextSummary?: string | null;
  decision: Decision;
  conditions?: string | null;
  reasoning: string;
  riskLevel: RiskLevel;
  riskCategories: RiskCategory[];
  policiesEvaluated: string[];
  escalationId?: string | null;
  timestamp: string;
}

export interface Escalation {
  id: string;
  auditLogId: string;
  agentId: string;
  actionType: string;
  actionDescription: string;
  reasoning: string;
  riskLevel: RiskLevel;
  status: EscalationStatus;
  assignedTo?: string | null;
  resolutionNotes?: string | null;
  resolvedAt?: string | null;
  createdAt: string;
}
