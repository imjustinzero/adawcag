import { VerticalLandingLayout } from '@/components/VerticalLandingLayout';
export default function Page() {
  return <VerticalLandingLayout headline="Patients Can’t Book Appointments on a Website They Can’t Use." stat="Inaccessible patient portals are a fast-growing ADA complaint category." riskStats={['High legal urgency','Common violations: keyboard and contrast','Typical remediation window: 30-90 days']} cta="Run Healthcare Risk Audit" />;
}
