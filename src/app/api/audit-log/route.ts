import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auditLogs } from "@/lib/db/schema";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const decision = searchParams.get("decision");
  const agentId = searchParams.get("agentId");
  const riskLevel = searchParams.get("riskLevel");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const limit = parseInt(searchParams.get("limit") || "50", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  const conditions = [];

  if (decision) {
    conditions.push(eq(auditLogs.decision, decision));
  }
  if (agentId) {
    conditions.push(eq(auditLogs.agentId, agentId));
  }
  if (riskLevel) {
    conditions.push(eq(auditLogs.riskLevel, riskLevel));
  }
  if (from) {
    conditions.push(gte(auditLogs.timestamp, from));
  }
  if (to) {
    conditions.push(lte(auditLogs.timestamp, to));
  }

  const whereClause =
    conditions.length > 0 ? and(...conditions) : undefined;

  const results = await db
    .select()
    .from(auditLogs)
    .where(whereClause)
    .orderBy(desc(auditLogs.timestamp))
    .limit(limit)
    .offset(offset);

  const [countResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(auditLogs)
    .where(whereClause);

  const parsed = results.map((entry) => ({
    ...entry,
    riskCategories: entry.riskCategories
      ? JSON.parse(entry.riskCategories)
      : [],
    policiesEvaluated: entry.policiesEvaluated
      ? JSON.parse(entry.policiesEvaluated)
      : [],
  }));

  return NextResponse.json({
    data: parsed,
    total: countResult?.count ?? 0,
    limit,
    offset,
  });
}
