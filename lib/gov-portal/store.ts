import { createHmac, randomUUID, timingSafeEqual } from 'crypto';

export type GovPortalRole = 'Agency_Admin' | 'Dept_Manager' | 'Viewer';

export type GovAgency = {
  id: string;
  agencySlug: string;
  name: string;
  tenantId: string;
  logoUrl: string | null;
  sealUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  portalTitle: string;
  createdAt: string;
};

export type GovPortalMember = {
  id: string;
  agencyId: string;
  email: string;
  role: GovPortalRole;
  department: string | null;
  inviteToken: string | null;
  joinedAt: string | null;
  createdAt: string;
};

export type GovPortalAuditLog = {
  id: string;
  agencyId: string;
  memberEmail: string;
  action: string;
  detail: string;
  createdAt: string;
};

export type GovPropertyIssue = { code: string; severity: 'low' | 'medium' | 'high'; description: string; count: number };
export type GovPropertyScan = { scannedAt: string; score: number; totalViolations: number; issues: GovPropertyIssue[] };
export type GovProperty = {
  id: string;
  agencyId: string;
  tenantId: string;
  url: string;
  department: string;
  complianceStatus: 'compliant' | 'non-compliant';
  scans: GovPropertyScan[];
  remediationProgress: number;
  slaStatus: 'On Track' | 'At Risk' | 'Overdue';
};

const now = new Date().toISOString();

export const govAgencies: GovAgency[] = [
  {
    id: 'gov-1',
    agencySlug: 'ca-digital-services',
    name: 'California Department of Digital Services',
    tenantId: 'tenant-gov-1',
    logoUrl: null,
    sealUrl: null,
    primaryColor: '#003262',
    secondaryColor: '#FDB515',
    portalTitle: 'CA DDS Accessibility Portal',
    createdAt: now,
  },
];

export const govMembers: GovPortalMember[] = [
  {
    id: 'member-1',
    agencyId: 'gov-1',
    email: 'admin@ca.gov',
    role: 'Agency_Admin',
    department: null,
    inviteToken: null,
    joinedAt: now,
    createdAt: now,
  },
];

export const govAuditLogs: GovPortalAuditLog[] = [];

export const govProperties: GovProperty[] = [
  {
    id: 'site-1',
    agencyId: 'gov-1',
    tenantId: 'tenant-gov-1',
    url: 'https://benefits.ca.gov',
    department: 'Benefits',
    complianceStatus: 'non-compliant',
    remediationProgress: 58,
    slaStatus: 'At Risk',
    scans: [
      { scannedAt: '2026-03-01T00:00:00.000Z', score: 66, totalViolations: 28, issues: [{ code: '1.1.1', severity: 'high', description: 'Missing alt text', count: 9 }] },
      { scannedAt: '2026-03-18T00:00:00.000Z', score: 72, totalViolations: 21, issues: [{ code: '1.4.3', severity: 'medium', description: 'Color contrast', count: 7 }] },
      { scannedAt: '2026-03-29T00:00:00.000Z', score: 78, totalViolations: 16, issues: [{ code: '2.1.1', severity: 'high', description: 'Keyboard traps', count: 4 }] },
    ],
  },
  {
    id: 'site-2',
    agencyId: 'gov-1',
    tenantId: 'tenant-gov-1',
    url: 'https://jobs.ca.gov',
    department: 'Labor',
    complianceStatus: 'compliant',
    remediationProgress: 94,
    slaStatus: 'On Track',
    scans: [
      { scannedAt: '2026-03-08T00:00:00.000Z', score: 89, totalViolations: 6, issues: [{ code: '3.3.2', severity: 'low', description: 'Form labels', count: 2 }] },
      { scannedAt: '2026-03-27T00:00:00.000Z', score: 92, totalViolations: 3, issues: [{ code: '2.4.7', severity: 'low', description: 'Focus visible', count: 1 }] },
    ],
  },
];

const sessionSecret = process.env.GOV_PORTAL_SESSION_SECRET ?? 'gov-portal-dev-secret';

export function getAgencyBySlug(agencySlug: string): GovAgency | undefined {
  return govAgencies.find((agency) => agency.agencySlug === agencySlug);
}

export function createGovMemberInvite(params: { agencyId: string; email: string; role: GovPortalRole; department?: string | null }): GovPortalMember {
  const existing = govMembers.find((member) => member.agencyId === params.agencyId && member.email.toLowerCase() === params.email.toLowerCase());
  const inviteToken = randomUUID();
  if (existing) {
    existing.inviteToken = inviteToken;
    existing.role = params.role;
    existing.department = params.department ?? null;
    return existing;
  }

  const member: GovPortalMember = {
    id: randomUUID(),
    agencyId: params.agencyId,
    email: params.email.toLowerCase(),
    role: params.role,
    department: params.department ?? null,
    inviteToken,
    joinedAt: null,
    createdAt: new Date().toISOString(),
  };

  govMembers.push(member);
  return member;
}

export function findMemberByInviteToken(agencyId: string, inviteToken: string): GovPortalMember | undefined {
  return govMembers.find((member) => member.agencyId === agencyId && member.inviteToken === inviteToken);
}

export function addGovAuditLog(agencyId: string, memberEmail: string, action: string, detail: string): void {
  govAuditLogs.unshift({ id: randomUUID(), agencyId, memberEmail, action, detail, createdAt: new Date().toISOString() });
}

export function signGovPortalSession(payload: { agencyId: string; agencySlug: string; memberEmail: string; role: GovPortalRole; department?: string | null }): string {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = createHmac('sha256', sessionSecret).update(body).digest('base64url');
  return `${body}.${sig}`;
}

export function verifyGovPortalSession(token: string | undefined): null | { agencyId: string; agencySlug: string; memberEmail: string; role: GovPortalRole; department?: string | null } {
  if (!token) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;

  const expected = createHmac('sha256', sessionSecret).update(body).digest('base64url');
  const sigBuffer = Buffer.from(sig);
  const expectedBuffer = Buffer.from(expected);
  if (sigBuffer.length !== expectedBuffer.length) return null;
  if (!timingSafeEqual(sigBuffer, expectedBuffer)) return null;

  try {
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

export function getAgencyStats(agencyId: string, department?: string | null) {
  const properties = govProperties.filter((property) => property.agencyId === agencyId && (!department || property.department === department));
  const latestScans = properties.map((property) => property.scans[property.scans.length - 1]).filter(Boolean);
  const avgScore = latestScans.length ? Math.round(latestScans.reduce((sum, scan) => sum + scan.score, 0) / latestScans.length) : 0;
  const totalViolations = latestScans.reduce((sum, scan) => sum + scan.totalViolations, 0);
  const compliantCount = properties.filter((property) => property.complianceStatus === 'compliant').length;
  const nonCompliantCount = properties.length - compliantCount;
  const sla = {
    onTrack: properties.filter((property) => property.slaStatus === 'On Track').length,
    atRisk: properties.filter((property) => property.slaStatus === 'At Risk').length,
    overdue: properties.filter((property) => property.slaStatus === 'Overdue').length,
  };

  return { avgScore, totalViolations, compliantCount, nonCompliantCount, sla, properties };
}
