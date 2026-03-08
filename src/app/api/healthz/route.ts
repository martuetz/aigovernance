import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.TURSO_DATABASE_URL ?? "";
  const authToken = process.env.TURSO_AUTH_TOKEN;

  // Debug: show exact URL chars
  const resolvedUrl = url.replace(/^libsql:\/\//, "https://");
  const charCodes = [...resolvedUrl].map((c) => c.charCodeAt(0));

  // Test new URL directly
  let urlTest: string;
  try {
    new URL(resolvedUrl);
    urlTest = "ok";
  } catch (e) {
    urlTest = e instanceof Error ? e.message : String(e);
  }

  // Test fetch directly
  let fetchTest: unknown;
  try {
    const res = await fetch(`${resolvedUrl}/v2/pipeline`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({ requests: [{ type: "execute", stmt: { sql: "SELECT 1" } }, { type: "close" }] }),
    });
    fetchTest = { status: res.status, ok: res.ok };
  } catch (e) {
    fetchTest = { error: e instanceof Error ? e.message : String(e) };
  }

  return NextResponse.json({
    resolvedUrl,
    charCodes: charCodes.slice(0, 10),
    urlLength: resolvedUrl.length,
    urlTest,
    fetchTest,
    nodeVersion: process.version,
  });
}
