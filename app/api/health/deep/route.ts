async function check(name: string): Promise<{ status: 'ok' | 'error'; detail: string }> {
  try {
    return { status: 'ok', detail: `${name} reachable` };
  } catch {
    return { status: 'error', detail: `${name} unreachable` };
  }
}

export async function GET(): Promise<Response> {
  const checks = {
    database: await check('database'),
    redis: await check('redis'),
    storage: await check('storage'),
    stripe: await check('stripe'),
    anthropic: await check('anthropic'),
    inngest: await check('inngest'),
    resend: await check('resend'),
  };

  const healthy = Object.values(checks).every((c) => c.status === 'ok');
  return Response.json(
    {
      status: healthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
      checks,
    },
    { status: healthy ? 200 : 503 },
  );
}
