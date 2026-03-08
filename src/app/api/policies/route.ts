import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { policies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { policyCreateSchema } from "@/lib/governance/types";
import { ZodError } from "zod";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const activeFilter = searchParams.get("active");
  const categoryFilter = searchParams.get("category");

  let results = await db.query.policies.findMany();

  if (activeFilter === "true") {
    results = results.filter((p) => p.isActive);
  } else if (activeFilter === "false") {
    results = results.filter((p) => !p.isActive);
  }

  if (categoryFilter) {
    results = results.filter((p) => p.category === categoryFilter);
  }

  return NextResponse.json(results);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = policyCreateSchema.parse(body);

    const id = crypto.randomUUID();
    db.insert(policies)
      .values({
        id,
        ...validated,
        escalationRule: validated.escalationRule ?? null,
      })
      .run();

    const created = await db.query.policies.findFirst({
      where: eq(policies.id, id),
    });

    return NextResponse.json(created, { status: 201 });
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
