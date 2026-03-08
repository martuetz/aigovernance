import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { agents } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { agentCreateSchema } from "@/lib/governance/types";
import { ZodError } from "zod";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const activeFilter = searchParams.get("active");

  let results;
  if (activeFilter === "true") {
    results = await db.query.agents.findMany({
      where: eq(agents.isActive, true),
    });
  } else if (activeFilter === "false") {
    results = await db.query.agents.findMany({
      where: eq(agents.isActive, false),
    });
  } else {
    results = await db.query.agents.findMany();
  }

  const parsed = results.map((a) => ({
    ...a,
    approvedScope: JSON.parse(a.approvedScope),
  }));

  return NextResponse.json(parsed);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = agentCreateSchema.parse(body);

    const id = crypto.randomUUID();
    db.insert(agents)
      .values({
        id,
        name: validated.name,
        type: validated.type,
        representedOrg: validated.representedOrg,
        authorityLevel: validated.authorityLevel,
        approvedScope: JSON.stringify(validated.approvedScope),
        description: validated.description ?? null,
      })
      .run();

    const created = await db.query.agents.findFirst({
      where: eq(agents.id, id),
    });

    return NextResponse.json(
      { ...created, approvedScope: JSON.parse(created!.approvedScope) },
      { status: 201 }
    );
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
