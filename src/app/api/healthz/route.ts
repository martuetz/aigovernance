import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    return NextResponse.json({ status: "error", message: "TURSO_DATABASE_URL not set" }, { status: 500 });
  }

  try {
    // Test Turso HTTP API directly
    const httpsUrl = url.replace(/^libsql:\/\//, "https://");
    const response = await fetch(`${httpsUrl}/v2/pipeline`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        requests: [{ type: "execute", stmt: { sql: "SELECT 1 as ok" } }, { type: "close" }],
      }),
    });
    const data = await response.json();
    return NextResponse.json({ status: "ok", httpStatus: response.status, data });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack?.split("\n").slice(0, 10) : undefined,
        urlPrefix: url.substring(0, 40),
      },
      { status: 500 }
    );
  }
}
