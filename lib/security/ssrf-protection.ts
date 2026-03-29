import dns from 'dns/promises';

const BLOCKED_RANGES = [
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[01])\./,
  /^192\.168\./,
  /^127\./,
  /^0\./,
  /^169\.254\./,
  /^100\.(6[4-9]|[7-9][0-9]|1[01][0-9]|12[0-7])\./,
  /^::1$/,
  /^fc00:/i,
  /^fe80:/i,
  /^fd/i,
];

const BLOCKED_HOSTNAMES = ['localhost', 'metadata.google.internal', '169.254.169.254', 'instance-data'];

export async function validateScanTarget(url: string): Promise<{ safe: boolean; reason?: string }> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { safe: false, reason: 'Invalid URL format' };
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return { safe: false, reason: 'Only HTTP/HTTPS allowed' };
  }

  if (BLOCKED_HOSTNAMES.includes(parsed.hostname.toLowerCase())) {
    return { safe: false, reason: 'Blocked hostname' };
  }

  try {
    const addresses = await dns.resolve4(parsed.hostname);
    for (const addr of addresses) {
      if (BLOCKED_RANGES.some((range) => range.test(addr))) {
        return { safe: false, reason: 'Resolves to private IP range' };
      }
    }
  } catch {
    return { safe: false, reason: 'Hostname does not resolve' };
  }

  return { safe: true };
}
