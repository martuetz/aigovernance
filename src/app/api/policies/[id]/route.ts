import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { policies } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { policyUpdateSchema } from "@/lib/governance/types";
import { ZodError } from "zod";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const policy = await db.query.policies.findFirst({
    where: eq(policies.id, id),
  });

  if (!policy) {
    return NextResponse.json({ error: "Policy not found" }, { status: 404 });
  }

  return NextResponse.json(policy);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = policyUpdateSchema.parse(body);

    const existing = await db.query.policies.findFirst({
      where: eq(policies.id, id),
    });
    if (!existing) {
      return NextResponse.json({ error: "Policy not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {
      updatedAt: sql`(datetime('now'))`,
    };
    if (validated.name !== undefined) updateData.name = validated.name;
    if (validated.description !== undefined)
      updateData.description = validated.description;
    if (validated.category !== undefined)
      updateData.category = validated.category;
    if (validated.ruleDefinition !== undefined)
      updateData.ruleDefinition = validated.ruleDefinition;
    if (validated.riskThreshold !== undefined)
      updateData.riskThreshold = validated.riskThreshold;
    if (validated.escalationRule !== undefined)
      updateData.escalationRule = validated.escalationRule;

    db.update(policies).set(updateData).where(eq(policies.id, id)).run();

    const updated = await db.query.policies.findFirst({
      where: eq(policies.id, id),
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const existing = await db.query.policies.findFirst({
    where: eq(policies.id, id),
  });

  if (!existing) {
    return NextResponse.json({ error: "Policy not found" }, { status: 404 });
  }

  db.update(policies)
    .set({ isActive: false, updatedAt: sql`(datetime('now'))` })
    .where(eq(policies.id, id))
    .run();

  return NextResponse.json({ success: true });
}
