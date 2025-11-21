import { NextRequest, NextResponse } from "next/server";
import { getLogs } from "@/lib/fileDb";

export const runtime = "nodejs";

// GET /api/logs?page=&limit=
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "10");

  const logs = await getLogs();
  const total = logs.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const data = logs
    .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
    .slice(start, start + limit);

  return NextResponse.json({ data, page, limit, total, totalPages });
}
