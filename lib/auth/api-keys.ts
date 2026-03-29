import crypto from 'crypto';

export const API_SCOPES = ['scan:read', 'scan:write', 'report:read', 'report:write', 'deploy:gate', 'webhook:manage', 'admin'] as const;

export function generateApiKey(mode: 'live' | 'test'): { key: string; hash: string; prefix: string } {
  const random = crypto.randomBytes(32).toString('hex');
  const key = `ak_${mode}_${random}`;
  const hash = crypto.createHash('sha256').update(key).digest('hex');
  const prefix = key.substring(0, 12);
  return { key, hash, prefix };
}
