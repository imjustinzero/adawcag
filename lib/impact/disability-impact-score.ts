export type Violation = { rule_id: string; page_url: string; impact?: string };

const DISABILITY_PREVALENCE = {
  visual: { prevalenceRate: 0.021, screenReaderUsage: 0.009 },
  mobility: { prevalenceRate: 0.133, keyboardOnlyRate: 0.029 },
  hearing: { prevalenceRate: 0.057 },
  cognitive: { prevalenceRate: 0.108 },
} as const;

const VIOLATION_DISABILITY_MAP: Record<string, Array<keyof typeof DISABILITY_PREVALENCE>> = {
  'image-alt': ['visual'],
  'color-contrast': ['visual', 'cognitive'],
  'link-name': ['visual', 'cognitive'],
  keyboard: ['mobility'],
  'focus-visible': ['mobility', 'cognitive'],
  label: ['visual', 'mobility', 'cognitive'],
  'audio-caption': ['hearing'],
};

const PAGE_CRITICALITY: Record<string, number> = {
  checkout: 1,
  application_form: 1,
  login: 0.9,
  search: 0.7,
  navigation: 0.8,
  content: 0.4,
  homepage: 0.6,
};

function classifyPageType(url: string): string {
  if (/checkout|cart/.test(url)) return 'checkout';
  if (/login|signin/.test(url)) return 'login';
  if (/search/.test(url)) return 'search';
  if (/form|apply/.test(url)) return 'application_form';
  if (/^https?:\/\/[^/]+\/?$/.test(url)) return 'homepage';
  return 'content';
}

function getPageTrafficShare(pageType: string): number {
  if (pageType === 'homepage') return 0.4;
  if (pageType === 'checkout') return 0.12;
  if (pageType === 'search') return 0.1;
  return 0.05;
}

function getIndustryTrafficBenchmark(industry: string): number {
  return ({ restaurant: 15000, government: 45000, healthcare: 38000, ecommerce: 55000 } as Record<string, number>)[industry] ?? 22000;
}

function getIndustrySessionValue(industry: string): number {
  return ({ restaurant: 47, healthcare: 60, ecommerce: 82, government: 0 } as Record<string, number>)[industry] ?? 35;
}

export async function calculateDisabilityImpactScore(params: {
  violations: Violation[];
  siteUrl: string;
  monthlyTraffic?: number;
  avgSessionValue?: number;
  industry: string;
}) {
  const trafficEstimate = params.monthlyTraffic ?? getIndustryTrafficBenchmark(params.industry);
  const impactByType = { visual: 0, mobility: 0, hearing: 0, cognitive: 0 };
  const barriers: Array<{ violation: string; usersBlocked: number; pageUrl: string; disabilityTypes: string[] }> = [];
  let totalImpact = 0;

  const pages = params.violations.reduce<Record<string, Violation[]>>((acc, v) => {
    acc[v.page_url] = acc[v.page_url] ?? [];
    acc[v.page_url].push(v);
    return acc;
  }, {});

  for (const [pageUrl, pageViolations] of Object.entries(pages)) {
    const pageType = classifyPageType(pageUrl);
    const pageTraffic = trafficEstimate * getPageTrafficShare(pageType);
    const criticality = PAGE_CRITICALITY[pageType] ?? 0.5;

    for (const violation of pageViolations) {
      const disabilityTypes = VIOLATION_DISABILITY_MAP[violation.rule_id] ?? [];
      for (const type of disabilityTypes) {
        const prevalence = DISABILITY_PREVALENCE[type];
        const assistiveRate = ('screenReaderUsage' in prevalence ? prevalence.screenReaderUsage : 'keyboardOnlyRate' in prevalence ? prevalence.keyboardOnlyRate : prevalence.prevalenceRate * 0.3);
        const affectedUsers = Math.round(pageTraffic * assistiveRate * criticality);
        impactByType[type] += affectedUsers;
        totalImpact += affectedUsers;
        barriers.push({ violation: violation.rule_id, usersBlocked: affectedUsers, pageUrl, disabilityTypes });
      }
    }
  }

  const adjustedTotal = Math.round(totalImpact * 0.65);
  const sessionValue = params.avgSessionValue ?? getIndustrySessionValue(params.industry);
  const lostRevenueEstimate = sessionValue > 0 ? Math.round(adjustedTotal * sessionValue * 12) : null;
  const impactScore = Math.min(100, Math.round((adjustedTotal / Math.max(1, trafficEstimate)) * 100 * 3));

  return {
    totalUsersImpacted: adjustedTotal,
    impactByDisabilityType: impactByType,
    mostCriticalBarriers: barriers.sort((a, b) => b.usersBlocked - a.usersBlocked).slice(0, 5),
    lostRevenueEstimate,
    impactScore,
    methodology: 'CDC DHDS 2023 × WebAIM 2024 × page-traffic modeling',
    confidence: params.monthlyTraffic ? 'high' : 'medium',
  } as const;
}
