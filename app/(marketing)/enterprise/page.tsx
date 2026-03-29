import { VerticalLandingLayout } from '@/components/VerticalLandingLayout';
export default function Page() {
  return <VerticalLandingLayout headline="One Commit Broke Your Accessibility. You Won’t Know Until You’re Sued." stat="Average enterprise ships 3 accessibility regressions per week without CI/CD gates." riskStats={['High legal urgency','Common violations: keyboard and contrast','Typical remediation window: 30-90 days']} cta="Run Enterprise Risk Audit" />;
}
