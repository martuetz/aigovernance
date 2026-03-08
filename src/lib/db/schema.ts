import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const agents = sqliteTable("agents", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'autonomous' | 'semi-autonomous' | 'supervised'
  representedOrg: text("represented_org").notNull(),
  authorityLevel: text("authority_level").notNull(), // 'low' | 'medium' | 'high' | 'critical'
  approvedScope: text("approved_scope").notNull(), // JSON string array
  description: text("description"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const policies = sqliteTable("policies", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // 'financial' | 'legal' | 'operational' | 'privacy' | 'security' | 'reputational'
  ruleDefinition: text("rule_definition").notNull(),
  riskThreshold: text("risk_threshold").notNull(), // 'low' | 'medium' | 'high' | 'critical'
  escalationRule: text("escalation_rule"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const auditLogs = sqliteTable("audit_logs", {
  id: text("id").primaryKey(),
  agentId: text("agent_id").notNull(),
  agentName: text("agent_name").notNull(),
  representedParty: text("represented_party").notNull(),
  actionType: text("action_type").notNull(),
  actionDescription: text("action_description").notNull(),
  targetParty: text("target_party"),
  dataInvolved: text("data_involved"),
  contextSummary: text("context_summary"),
  decision: text("decision").notNull(), // 'APPROVE' | 'APPROVE_WITH_CONDITIONS' | 'ESCALATE' | 'BLOCK'
  conditions: text("conditions"),
  reasoning: text("reasoning").notNull(),
  riskLevel: text("risk_level").notNull(), // 'low' | 'medium' | 'high' | 'critical'
  riskCategories: text("risk_categories"), // JSON array
  policiesEvaluated: text("policies_evaluated"), // JSON array
  escalationId: text("escalation_id"),
  timestamp: text("timestamp")
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const escalations = sqliteTable("escalations", {
  id: text("id").primaryKey(),
  auditLogId: text("audit_log_id").notNull(),
  agentId: text("agent_id").notNull(),
  actionType: text("action_type").notNull(),
  actionDescription: text("action_description").notNull(),
  reasoning: text("reasoning").notNull(),
  riskLevel: text("risk_level").notNull(),
  status: text("status").notNull().default("pending"), // 'pending' | 'approved' | 'denied'
  assignedTo: text("assigned_to"),
  resolutionNotes: text("resolution_notes"),
  resolvedAt: text("resolved_at"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});
