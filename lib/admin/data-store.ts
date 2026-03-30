export type CertificationStatus = 'active' | 'conditional' | 'suspended' | 'expired';

export type AdminCertification = {
  id: string;
  tenantName: string;
  domain: string;
  status: CertificationStatus;
  issuedAt: string;
  expiresAt: string;
  lighthouseScore: number;
  scanDate?: string;
};

export type CertificateReviewTask = {
  id: string;
  certId: string;
  tenantName: string;
  siteUrl: string;
  score: number;
  scanDate: string;
  status: 'pending' | 'flagged' | 'activated';
};

export type MarketplaceStatus = 'pending' | 'active' | 'rejected';

export type MarketplaceDeveloper = {
  id: string;
  name: string;
  email: string;
  company: string;
  submittedDate: string;
  skills: string[];
  hourlyRate: number;
  status: MarketplaceStatus;
  verified: boolean;
  apiKey: string | null;
  verifiedAt: string | null;
  verifiedByEmail: string | null;
};

export type TenantOverride = {
  id: string;
  tenantId: string;
  tenantName: string;
  pageLimit: number | null;
  sitesAllowed: number | null;
  scanFrequency: 'daily' | 'weekly' | 'monthly' | null;
  expiresAt: string | null;
  reason: string;
  createdBy: string;
  createdAt: string;
};

export type AdminADACase = {
  id: string;
  caseNumber: string;
  caseName: string;
  court: string;
  plaintiff: string;
  defendant: string;
  industryType: string;
  outcome: string;
  settlement: string;
  summary: string;
  legalSignificance: string;
  violations: string[];
  wcagCriteria: string[];
  filedDate: string;
  isActive: boolean;
};

export type RfpStatus = 'new' | 'reviewing' | 'pursuing' | 'submitted' | 'won' | 'lost' | 'no_bid';

export type AdminRfp = {
  id: string;
  tenantId: string;
  tenantName: string;
  title: string;
  agency: string;
  status: RfpStatus;
  matchScore: number;
  dueDate: string;
  value: string;
};

const today = Date.now();
const dayMs = 24 * 60 * 60 * 1000;

export const PLATFORM_TENANT_ID = 'cmm41rr5d0000fnd0u24anl73';

export const certifications: AdminCertification[] = [
  { id: 'cert-1', tenantName: 'Northstar Health', domain: 'northstarhealth.com', status: 'active', issuedAt: '2025-10-01', expiresAt: new Date(today + 3 * dayMs).toISOString(), lighthouseScore: 94, scanDate: '2026-03-25' },
  { id: 'cert-2', tenantName: 'River Commerce', domain: 'rivercommerce.com', status: 'conditional', issuedAt: '2025-09-15', expiresAt: new Date(today + 20 * dayMs).toISOString(), lighthouseScore: 79, scanDate: '2026-03-27' },
  { id: 'cert-3', tenantName: 'Summit Legal', domain: 'summitlegal.io', status: 'suspended', issuedAt: '2025-08-10', expiresAt: new Date(today + 45 * dayMs).toISOString(), lighthouseScore: 68, scanDate: '2026-03-20' },
  { id: 'cert-4', tenantName: 'Cedar Schools', domain: 'cedarschools.edu', status: 'expired', issuedAt: '2024-05-10', expiresAt: '2025-05-09T00:00:00.000Z', lighthouseScore: 71, scanDate: '2025-04-30' }
];

export const certificateReviewQueue: CertificateReviewTask[] = [
  { id: 'review-1', certId: 'cert-2', tenantName: 'River Commerce', siteUrl: 'https://rivercommerce.com', score: 88, scanDate: '2026-03-27', status: 'pending' },
];

export const marketplaceDevelopers: MarketplaceDeveloper[] = [
  { id: 'dev-1', name: 'Ari Thompson', email: 'ari@example.com', company: 'Ari Accessibility LLC', submittedDate: '2026-03-20', skills: ['React', 'ARIA', 'Screen Reader QA'], hourlyRate: 95, status: 'pending', verified: false, apiKey: null, verifiedAt: null, verifiedByEmail: null },
  { id: 'dev-2', name: 'Sam Patel', email: 'sam@example.com', company: 'Inclusive Code Studio', submittedDate: '2026-03-12', skills: ['Vue', 'WCAG 2.2', 'Keyboard nav'], hourlyRate: 105, status: 'active', verified: true, apiKey: 'mk_live_demo_123', verifiedAt: '2026-03-01T10:00:00.000Z', verifiedByEmail: 'admin@adawcag.org' }
];

export const tenantOverrides: TenantOverride[] = [];

export const adaCases: AdminADACase[] = [
  {
    id: 'ada-1',
    caseNumber: '1:23-cv-00101',
    caseName: 'Lopez v. Horizon Retail',
    court: 'S.D.N.Y.',
    plaintiff: 'M. Lopez',
    defendant: 'Horizon Retail LLC',
    industryType: 'E-commerce',
    outcome: 'settled',
    settlement: '$45,000',
    summary: 'Plaintiff alleged inaccessible checkout and form labels.',
    legalSignificance: 'Reinforced keyboard focus visibility in checkout flows.',
    violations: ['Missing labels', 'Focus trap'],
    wcagCriteria: ['1.3.1', '2.4.7', '3.3.2'],
    filedDate: '2023-11-08',
    isActive: true
  }
];

export const rfps: AdminRfp[] = [
  { id: 'rfp-1', tenantId: PLATFORM_TENANT_ID, tenantName: 'ADAWCAG Platform', title: 'State Portal Accessibility Remediation', agency: 'CA Department of Technology', status: 'new', matchScore: 88, dueDate: '2026-04-20', value: '$250,000 - $400,000' },
  { id: 'rfp-2', tenantId: 'tenant-7', tenantName: 'Northstar Health', title: 'Hospital Web Accessibility Audit', agency: 'City of Denver', status: 'reviewing', matchScore: 76, dueDate: '2026-04-02', value: '$80,000 - $120,000' }
];
