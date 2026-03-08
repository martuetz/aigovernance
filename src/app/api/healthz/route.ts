import { NextResponse } from "next/server";
import { createClient } from "@libsql/client";

export async function GET() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    return NextResponse.json({ status: "error", message: "TURSO_DATABASE_URL not set" }, { status: 500 });
  }

  try {
    const resolvedUrl = url.replace(/^libsql:\/\//, "https://");
    const client = createClient({ url: resolvedUrl, authToken });
    const result = await client.execute("SELECT 1 as ok");
    return NextResponse.json({ status: "ok", urlPrefix: resolvedUrl.substring(0, 30), rows: result.rows });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : String(error),
        urlPrefix: url.substring(0, 30),
      },
      { status: 500 }
    );
  }
}
