import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isAdmin(request: NextRequest) {
  return request.headers.get("x-admin") === "true";
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const now = new Date();
  const from = new Date(now);
  from.setUTCDate(from.getUTCDate() - 30);

  const [countsBySource, trendRows] = await Promise.all([
    prisma.installEvent.groupBy({
      by: ["source"],
      _count: { _all: true },
      orderBy: { source: "asc" },
    }),
    prisma.$queryRaw<Array<{ day: string; count: bigint }>>`
      SELECT DATE("createdAt")::text AS day, COUNT(*)::bigint AS count
      FROM "InstallEvent"
      WHERE "createdAt" >= ${from}
      GROUP BY DATE("createdAt")
      ORDER BY DATE("createdAt") ASC
    `,
  ]);

  return NextResponse.json({
    sources: countsBySource.map((row) => ({ source: row.source, count: row._count._all })),
    trend: trendRows.map((row) => ({ day: row.day, count: Number(row.count) })),
  });
}
