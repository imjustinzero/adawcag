import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const installRateLimits = new Map<string, number[]>();
const ALLOWED_SOURCES = new Set(["npm", "github-action", "ci", "api"]);

function getIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() ?? "0.0.0.0";
}

function hashIp(ip: string) {
  return crypto.createHash("sha256").update(ip).digest("hex");
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  const existing = installRateLimits.get(ip) ?? [];
  const active = existing.filter((timestamp) => timestamp >= cutoff);

  if (active.length >= RATE_LIMIT_MAX) {
    installRateLimits.set(ip, active);
    return true;
  }

  active.push(now);
  installRateLimits.set(ip, active);
  return false;
}

export async function POST(request: NextRequest) {
  const ip = getIp(request);

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const source = body?.source;
  const version = body?.version;

  if (!source || typeof source !== "string" || !ALLOWED_SOURCES.has(source)) {
    return NextResponse.json({ error: "Invalid source" }, { status: 400 });
  }

  await prisma.installEvent.create({
    data: {
      source,
      version: typeof version === "string" ? version : null,
      userAgent: request.headers.get("user-agent"),
      ipHash: hashIp(ip),
    },
  });

  return NextResponse.json({ ok: true });
}
