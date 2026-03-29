import { WelcomeEmail } from '@/lib/email/templates/welcome';
import { ScanCompleteEmail } from '@/lib/email/templates/scan-complete';
import { CriticalViolationEmail } from '@/lib/email/templates/critical-violation';
import { RegressionAlertEmail } from '@/lib/email/templates/regression-alert';
import { LegalRiskReadyEmail } from '@/lib/email/templates/legal-risk-ready';
import { CertificationIssuedEmail } from '@/lib/email/templates/certification-issued';
import { CertificationExpiringEmail } from '@/lib/email/templates/certification-expiring';
import { DemandLetterResponseEmail } from '@/lib/email/templates/demand-letter-response';
import { FreeAuditReportEmail } from '@/lib/email/templates/free-audit-report';
import { InviteTeammateEmail } from '@/lib/email/templates/invite-teammate';
import { WeeklyDigestEmail } from '@/lib/email/templates/weekly-digest';
import { RfpAlertEmail } from '@/lib/email/templates/rfp-alert';
import { MarketplaceJobPostedEmail } from '@/lib/email/templates/marketplace-job-posted';
import { MarketplaceCompleteEmail } from '@/lib/email/templates/marketplace-complete';
import { PaymentReceiptEmail } from '@/lib/email/templates/payment-receipt';

const templates=[WelcomeEmail,ScanCompleteEmail,CriticalViolationEmail,RegressionAlertEmail,LegalRiskReadyEmail,CertificationIssuedEmail,CertificationExpiringEmail,DemandLetterResponseEmail,FreeAuditReportEmail,InviteTeammateEmail,WeeklyDigestEmail,RfpAlertEmail,MarketplaceJobPostedEmail,MarketplaceCompleteEmail,PaymentReceiptEmail];
export default function EmailPreview(){return <main className="container" style={{padding:'2rem 0'}}>{templates.map((T,i)=><section key={i} className="card" style={{marginBottom:'1rem'}}><T /></section>)}</main>;}
