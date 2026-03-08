import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { agents } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { agentUpdateSchema } from "@/lib/governance/types";
import { ZodError } from "zod";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const agent = await db.query.agents.findFirst({
    where: eq(agents.id, id),
  });

  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...agent,
    approvedScope: JSON.parse(agent.approvedScope),
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = agentUpdateSchema.parse(body);

    const existing = await db.query.agents.findFirst({
      where: eq(agents.id, id),
    });
    if (!existing) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {
      updatedAt: sql`(datetime('now'))`,
    };
    if (validated.name !== undefined) updateData.name = validated.name;
    if (validated.type !== undefined) updateData.type = validated.type;
    if (validated.representedOrg !== undefined)
      updateData.representedOrg = validated.representedOrg;
    if (validated.authorityLevel !== undefined)
      updateData.authorityLevel = validated.authorityLevel;
    if (validated.approvedScope !== undefined)
      updateData.approvedScope = JSON.stringify(validated.approvedScope);
    if (validated.description !== undefined)
      updateData.description = validated.description;

    db.update(agents).set(updateData).where(eq(agents.id, id)).run();

    const updated = await db.query.agents.findFirst({
      where: eq(agents.id, id),
    });

    return NextResponse.json({
      ...updated,
      approvedScope: JSON.parse(updated!.approvedScope),
    });
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
  const existing = await db.query.agents.findFirst({
    where: eq(agents.id, id),
  });

  if (!existing) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  db.update(agents)
    .set({ isActive: false, updatedAt: sql`(datetime('now'))` })
    .where(eq(agents.id, id))
    .run();

  return NextResponse.json({ success: true });
}
