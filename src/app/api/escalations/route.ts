import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { escalations } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  let results;
  if (status) {
    results = await db.query.escalations.findMany({
      where: eq(escalations.status, status),
      orderBy: [desc(escalations.createdAt)],
    });
  } else {
    results = await db.query.escalations.findMany({
      orderBy: [desc(escalations.createdAt)],
    });
  }

  return NextResponse.json(results);
}
