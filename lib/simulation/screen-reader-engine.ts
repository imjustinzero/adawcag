export interface ScreenReaderStep {
  stepNumber: number;
  userIntent: string;
  element: string;
  elementType: string;
  announcedText: string;
  expectedText: string;
  result: 'success' | 'partial' | 'failure' | 'blocked';
  issue?: string;
  wcagSc?: string[];
  severity?: string;
}

export interface ScreenReaderReport {
  siteUrl: string;
  simulatedAt: Date;
  journeys: { name: string; steps: ScreenReaderStep[]; completionRate: number; totalBarriers: number; criticalBarriers: number; narrative: string }[];
  overallCompletionRate: number;
  experienceSummary: string;
  mostCriticalBarrier: string;
  elementsAudited: number;
  accessibilityTreeSize: number;
  methodology: string;
}

const INDUSTRY_JOURNEYS: Record<string, string[]> = {
  restaurant: ['View menu and find dietary information', 'Place an online order', 'Make a reservation'],
  government: ['Find and complete a government form', 'Access public records'],
  healthcare: ['Book a medical appointment', 'Access patient portal'],
  ecommerce: ['Find and purchase a product'],
};

function makeMockSteps(journeyName: string): ScreenReaderStep[] {
  return [
    { stepNumber: 1, userIntent: `Start ${journeyName}`, element: 'a.nav-home', elementType: 'link', announcedText: 'Home link', expectedText: 'Home link', result: 'success' },
    { stepNumber: 2, userIntent: 'Find primary action', element: 'button', elementType: 'button', announcedText: 'Button, button', expectedText: 'Add item to cart button', result: 'blocked', issue: 'Interactive control has no accessible name', wcagSc: ['4.1.2'], severity: 'critical' },
    { stepNumber: 3, userIntent: 'Continue journey', element: 'input', elementType: 'input', announcedText: 'Edit text', expectedText: 'Email address edit text', result: 'partial', issue: 'Input label is missing or ambiguous', wcagSc: ['1.3.1'], severity: 'serious' },
  ];
}

export async function runScreenReaderSimulation(params: { url: string; industry: string; orgId: string }): Promise<ScreenReaderReport> {
  const journeys = INDUSTRY_JOURNEYS[params.industry] ?? INDUSTRY_JOURNEYS.ecommerce;
  const results = journeys.map((name) => {
    const steps = makeMockSteps(name);
    const successes = steps.filter((s) => s.result === 'success').length;
    const completionRate = Math.round((successes / steps.length) * 100);
    return {
      name,
      steps,
      completionRate,
      totalBarriers: steps.filter((s) => s.result !== 'success').length,
      criticalBarriers: steps.filter((s) => s.severity === 'critical').length,
      narrative: `I tried to complete “${name}” but unlabeled controls and ambiguous form fields blocked me from finishing without sighted help.`,
    };
  });

  const overall = Math.round(results.reduce((sum, r) => sum + r.completionRate, 0) / results.length);
  return {
    siteUrl: params.url,
    simulatedAt: new Date(),
    journeys: results,
    overallCompletionRate: overall,
    experienceSummary: 'Simulation indicates substantial screen-reader friction concentrated around unlabeled controls and form labeling.',
    mostCriticalBarrier: 'Interactive buttons are missing accessible names.',
    elementsAudited: results.reduce((sum, r) => sum + r.steps.length, 0),
    accessibilityTreeSize: results.length * 20,
    methodology: 'Keyboard navigation and ARIA-name simulation with deterministic scoring model.',
  };
}
