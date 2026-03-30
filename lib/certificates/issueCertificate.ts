import { certificateReviewQueue, certifications } from '@/lib/admin/data-store';
import { sendEmail } from '@/lib/email/send';

function addDays(base: Date, days: number): Date {
  const next = new Date(base);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function generateCertNumber(): string {
  return `ADAWCAG-${new Date().getUTCFullYear()}-${Math.random().toString().slice(2, 7)}`;
}

export async function maybeIssueCertificate({ tenantId, siteId, scanId, score }: { tenantId: string; siteId: string; scanId: string; score: number }) {
  const existing = certifications.find((cert) => cert.domain === siteId && cert.status === 'active');
  if (existing) return existing;

  const issuedAt = new Date();
  const expiresAt = addDays(issuedAt, 365);
  const certNumber = generateCertNumber();

  const cert = {
    id: certNumber,
    tenantName: tenantId,
    domain: siteId,
    status: 'conditional' as const,
    issuedAt: issuedAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    lighthouseScore: score,
    scanDate: issuedAt.toISOString(),
  };

  certifications.push(cert);
  certificateReviewQueue.push({
    id: `review-${scanId}`,
    certId: cert.id,
    tenantName: tenantId,
    siteUrl: siteId,
    score,
    scanDate: issuedAt.toISOString(),
    status: 'pending',
  });

  await sendEmail({
    to: `${tenantId}@example.com`,
    subject: 'Your ADAWCAG Compliance Certificate has been issued',
    html: `<p>Certificate Number: ${certNumber}</p><p>Status: Conditional (pending human auditor review)</p>`,
  });

  return cert;
}
