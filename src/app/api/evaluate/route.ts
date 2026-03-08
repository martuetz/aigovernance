import { NextRequest, NextResponse } from "next/server";
import { evaluateAction } from "@/lib/governance/evaluator";
import { evaluationRequestSchema } from "@/lib/governance/types";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = evaluationRequestSchema.parse(body);
    const result = await evaluateAction(validated);
    return NextResponse.json(result);
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
