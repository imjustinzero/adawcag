import { VerticalLandingLayout } from '@/components/VerticalLandingLayout';
export default function Page() {
  return <VerticalLandingLayout headline="You Advise Clients on ADA Compliance. Is Your Own Website Compliant?" stat="47% of law firm websites fail basic WCAG 2.1 AA checks." riskStats={['High legal urgency','Common violations: keyboard and contrast','Typical remediation window: 30-90 days']} cta="Run Law Firms Risk Audit" />;
}
