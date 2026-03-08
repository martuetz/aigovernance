import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { escalations } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { escalationResolveSchema } from "@/lib/governance/types";
import { ZodError } from "zod";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = escalationResolveSchema.parse(body);

    const existing = await db.query.escalations.findFirst({
      where: eq(escalations.id, id),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Escalation not found" },
        { status: 404 }
      );
    }

    if (existing.status !== "pending") {
      return NextResponse.json(
        { error: "Escalation already resolved" },
        { status: 400 }
      );
    }

    await db.update(escalations)
      .set({
        status: validated.resolution,
        resolutionNotes: validated.notes,
        assignedTo: validated.resolvedBy,
        resolvedAt: sql`(datetime('now'))`,
      })
      .where(eq(escalations.id, id));

    const updated = await db.query.escalations.findFirst({
      where: eq(escalations.id, id),
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
