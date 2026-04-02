export type Severity = 'Critical' | 'Serious' | 'Moderate' | 'Minor';

export type ViolationRecord = {
  id?: string;
  rule_id?: string;
  issue_name?: string;
  impact?: string;
  description?: string;
  help?: string;
  wcag_criterion?: string;
  criterion_name?: string;
};

const severityWeight: Record<Severity, number> = {
  Critical: 0,
  Serious: 1,
  Moderate: 2,
  Minor: 3,
};

const fixTimeByRule: Array<{ pattern: RegExp; hours: number; wcag: string; title: string; criterionName: string }> = [
  { pattern: /(image-alt|missing alt|alt text)/i, hours: 0.5, wcag: '1.1.1', title: 'Missing alt text', criterionName: 'Non-text Content' },
  { pattern: /(color-contrast|contrast)/i, hours: 1, wcag: '1.4.3', title: 'Color contrast', criterionName: 'Contrast (Minimum)' },
  { pattern: /(label|form label)/i, hours: 0.5, wcag: '3.3.2', title: 'Missing form label', criterionName: 'Labels or Instructions' },
  { pattern: /(keyboard trap|focus trap)/i, hours: 3, wcag: '2.1.2', title: 'Keyboard trap', criterionName: 'No Keyboard Trap' },
  { pattern: /(aria role|missing aria role|aria)/i, hours: 1, wcag: '4.1.2', title: 'Missing ARIA role', criterionName: 'Name, Role, Value' },
];

export function mapSeverity(impact?: string): Severity {
  switch ((impact ?? '').toLowerCase()) {
    case 'critical':
      return 'Critical';
    case 'serious':
      return 'Serious';
    case 'moderate':
      return 'Moderate';
    default:
      return 'Minor';
  }
}

export function inferFixDetails(issueName: string): { estimatedHours: number; wcagCriterion: string; normalizedIssueName: string; criterionName: string } {
  const match = fixTimeByRule.find((item) => item.pattern.test(issueName));
  if (match) {
    return {
      estimatedHours: match.hours,
      wcagCriterion: match.wcag,
      normalizedIssueName: match.title,
      criterionName: match.criterionName,
    };
  }

  return {
    estimatedHours: 2,
    wcagCriterion: '2.4.3',
    normalizedIssueName: issueName || 'Unknown issue',
    criterionName: 'Focus Order',
  };
}

export function sortByPriority<T extends { severity: Severity; estimated_hours: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    if (severityWeight[a.severity] !== severityWeight[b.severity]) {
      return severityWeight[a.severity] - severityWeight[b.severity];
    }
    return a.estimated_hours - b.estimated_hours;
  });
}
