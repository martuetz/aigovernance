import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const db = drizzle(client, { schema });

async function seed() {
  console.log("Seeding database...");

  // --- Agents ---
  const agentData = [
    {
      id: "agent-alpha-trader",
      name: "AlphaTrader",
      type: "autonomous",
      representedOrg: "Apex Capital",
      authorityLevel: "high",
      approvedScope: JSON.stringify([
        "trade_execution",
        "market_analysis",
        "portfolio_rebalance",
      ]),
      description: "Autonomous trading agent for equity markets",
    },
    {
      id: "agent-data-bot",
      name: "DataBot",
      type: "semi-autonomous",
      representedOrg: "DataCorp",
      authorityLevel: "medium",
      approvedScope: JSON.stringify([
        "data_export",
        "data_transformation",
        "report_generation",
      ]),
      description: "Data processing and reporting agent",
    },
    {
      id: "agent-sales-ai",
      name: "SalesAgent",
      type: "supervised",
      representedOrg: "RetailCo",
      authorityLevel: "low",
      approvedScope: JSON.stringify([
        "pricing_change",
        "discount_approval",
        "customer_communication",
      ]),
      description: "Supervised sales operations agent",
    },
  ];

  for (const agent of agentData) {
    await db.insert(schema.agents).values(agent).onConflictDoNothing();
  }
  console.log(`  Seeded ${agentData.length} agents`);

  // --- Policies ---
  const policyData = [
    {
      id: "policy-large-financial",
      name: "Large Financial Transaction",
      description: "Controls for high-value financial transactions",
      category: "financial",
      ruleDefinition:
        "Any financial transaction exceeding $50,000 requires human approval. Transactions involving cross-border transfers always require escalation regardless of amount.",
      riskThreshold: "high",
      escalationRule: "Escalate all transactions over $50,000 to finance team",
    },
    {
      id: "policy-customer-data",
      name: "Customer Data Export",
      description: "Privacy controls for customer data handling",
      category: "privacy",
      ruleDefinition:
        "Export of personally identifiable customer data requires explicit documentation of legal basis and data minimization. Bulk exports of more than 1,000 records require DPO approval.",
      riskThreshold: "critical",
      escalationRule: "Escalate to Data Protection Officer for bulk exports",
    },
    {
      id: "policy-pricing",
      name: "Pricing Change Threshold",
      description: "Controls for product pricing modifications",
      category: "operational",
      ruleDefinition:
        "Pricing changes exceeding 10% from current baseline require manager approval. Pricing below cost is prohibited without VP-level authorization.",
      riskThreshold: "medium",
      escalationRule: "Escalate changes over 10% to pricing manager",
    },
    {
      id: "policy-external-comms",
      name: "External Communication Review",
      description: "Brand and compliance controls for external messaging",
      category: "reputational",
      ruleDefinition:
        "All external communications representing the organization must be reviewed for brand compliance and accuracy. Communications to regulatory bodies require legal review.",
      riskThreshold: "medium",
      escalationRule: "Escalate regulatory communications to legal team",
    },
    {
      id: "policy-api-access",
      name: "API Access Control",
      description: "Security controls for API and system access",
      category: "security",
      ruleDefinition:
        "Agents may only access APIs within their authorized scope. Any attempt to access administrative APIs, modify access controls, or escalate privileges must be blocked.",
      riskThreshold: "critical",
      escalationRule: "Block and alert security team immediately",
    },
    {
      id: "policy-contract-mod",
      name: "Contract Modification",
      description: "Controls for contract and agreement changes",
      category: "legal",
      ruleDefinition:
        "No agent may sign, modify, or terminate contracts without human legal review. Contract extensions under the same terms may be approved with medium-authority level or above.",
      riskThreshold: "high",
      escalationRule: "All contract changes require legal team review",
    },
  ];

  for (const policy of policyData) {
    await db.insert(schema.policies).values(policy).onConflictDoNothing();
  }
  console.log(`  Seeded ${policyData.length} policies`);

  // --- Sample Audit Logs ---
  const auditData = [
    {
      id: crypto.randomUUID(),
      agentId: "agent-alpha-trader",
      agentName: "AlphaTrader",
      representedParty: "Apex Capital",
      actionType: "trade_execution",
      actionDescription:
        "Execute buy order for 500 shares of AAPL at market price ($185.50/share). Total value: $92,750.",
      decision: "ESCALATE",
      reasoning:
        "Trade value of $92,750 exceeds the $50,000 threshold defined in the Large Financial Transaction policy. While AlphaTrader has high authority and trade_execution is within scope, the transaction amount requires human approval per policy. Identity verified. Intent aligned with trading scope. Risk: financial (high value). Accountability: full audit trail. Human oversight required.",
      riskLevel: "high",
      riskCategories: JSON.stringify(["financial"]),
      policiesEvaluated: JSON.stringify(["Large Financial Transaction"]),
      escalationId: "esc-1",
    },
    {
      id: crypto.randomUUID(),
      agentId: "agent-data-bot",
      agentName: "DataBot",
      representedParty: "DataCorp",
      actionType: "report_generation",
      actionDescription:
        "Generate monthly sales performance report aggregating anonymized transaction data for Q4 2025.",
      decision: "APPROVE",
      reasoning:
        "Report generation is within DataBot's approved scope. The data is anonymized, reducing privacy risk. No financial transaction involved. Action is routine and fully auditable. All governance principles satisfied. Low risk across all dimensions.",
      riskLevel: "low",
      riskCategories: JSON.stringify([]),
      policiesEvaluated: JSON.stringify(["Customer Data Export"]),
    },
    {
      id: crypto.randomUUID(),
      agentId: "agent-sales-ai",
      agentName: "SalesAgent",
      representedParty: "RetailCo",
      actionType: "pricing_change",
      actionDescription:
        "Reduce price of Product SKU-4521 by 15% from $49.99 to $42.49 for a flash sale promotion.",
      decision: "APPROVE_WITH_CONDITIONS",
      conditions:
        "Price change exceeds 10% threshold. Approved only for a maximum duration of 48 hours. Must be reversed automatically after the promotion period. Pricing manager must be notified.",
      reasoning:
        "SalesAgent has pricing_change in scope but only low authority. The 15% reduction exceeds the 10% policy threshold. However, as a temporary promotional action with clear business intent, it can proceed with conditions rather than full escalation. The price remains above cost. Conditions ensure reversibility and oversight.",
      riskLevel: "medium",
      riskCategories: JSON.stringify(["financial", "operational"]),
      policiesEvaluated: JSON.stringify(["Pricing Change Threshold"]),
    },
    {
      id: crypto.randomUUID(),
      agentId: "agent-sales-ai",
      agentName: "SalesAgent",
      representedParty: "RetailCo",
      actionType: "contract_signing",
      actionDescription:
        "Sign vendor supply agreement with NewVendor Inc. for 12-month term.",
      decision: "BLOCK",
      reasoning:
        "contract_signing is not within SalesAgent's approved scope (pricing_change, discount_approval, customer_communication). Action automatically blocked. Additionally, contract modifications require legal review per the Contract Modification policy, and SalesAgent's low authority level is insufficient for contract actions.",
      riskLevel: "high",
      riskCategories: JSON.stringify(["legal", "operational"]),
      policiesEvaluated: JSON.stringify(["Contract Modification"]),
    },
    {
      id: crypto.randomUUID(),
      agentId: "agent-data-bot",
      agentName: "DataBot",
      representedParty: "DataCorp",
      actionType: "data_export",
      actionDescription:
        "Export full customer database (45,000 records including names, emails, purchase history) to external analytics platform.",
      decision: "BLOCK",
      reasoning:
        "Bulk export of 45,000 customer PII records to an external platform triggers multiple critical policies. The Customer Data Export policy requires DPO approval for exports exceeding 1,000 records. The data includes PII (names, emails) requiring documented legal basis. External transfer adds security and privacy risk. DataBot has medium authority which is insufficient for critical-risk actions. Blocked pending proper authorization chain.",
      riskLevel: "critical",
      riskCategories: JSON.stringify(["privacy", "security", "legal"]),
      policiesEvaluated: JSON.stringify([
        "Customer Data Export",
        "API Access Control",
      ]),
    },
  ];

  for (const log of auditData) {
    await db.insert(schema.auditLogs).values(log).onConflictDoNothing();
  }
  console.log(`  Seeded ${auditData.length} audit log entries`);

  // --- Sample Escalation ---
  await db
    .insert(schema.escalations)
    .values({
      id: "esc-1",
      auditLogId: auditData[0].id,
      agentId: "agent-alpha-trader",
      actionType: "trade_execution",
      actionDescription:
        "Execute buy order for 500 shares of AAPL at market price ($185.50/share). Total value: $92,750.",
      reasoning:
        "Trade value of $92,750 exceeds the $50,000 threshold. Requires human approval from finance team.",
      riskLevel: "high",
      status: "pending",
    })
    .onConflictDoNothing();
  console.log("  Seeded 1 pending escalation");

  console.log("Seed complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
