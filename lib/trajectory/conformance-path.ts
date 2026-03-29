import type { Violation } from '@/lib/impact/disability-impact-score';

export interface ConformancePath {
  name: string;
  description: string;
  fixesPerWeek: number;
  hoursPerWeek: number;
  projectedScoreAtDeadline: number;
  projectedScoreAt30Days: number;
  projectedScoreAt90Days: number;
  complianceStatus: 'compliant' | 'at_risk' | 'non_compliant';
  certificationEligible: boolean;
  legalRiskLevel: 'critical' | 'high' | 'medium' | 'low';
  estimatedCostDiy: number;
  estimatedCostMarketplace: number;
  lawsuitProbability30Days: number;
  lawsuitProbability90Days: number;
  recommendedPath: boolean;
  weeklyMilestones: { week: number; score: number; violations: number; milestone?: string }[];
}

export async function calculateConformanceTrajectory(params: {
  currentScore: number;
  violations: Violation[];
  deadline: Date;
  devCapacityHoursPerWeek?: number;
  industry: string;
  orgId: string;
}) {
  const daysUntilDeadline = Math.ceil((params.deadline.getTime() - Date.now()) / 86400000);
  const weeksUntilDeadline = Math.max(1, Math.ceil(daysUntilDeadline / 7));
  const baseLawsuitProb = ({ restaurant: 0.12, government: 0.04, healthcare: 0.08, law_firm: 0.06, casino: 0.09, enterprise: 0.07, ecommerce: 0.11 } as Record<string, number>)[params.industry] ?? 0.07;

  function calculatePath(fixesPerWeek: number, name: string, description: string): ConformancePath {
    const avgHoursPerFix = 3.5;
    const weeklyMilestones: ConformancePath['weeklyMilestones'] = [];
    let currentScore = params.currentScore;
    let remainingViolations = params.violations.length;
    for (let week = 1; week <= weeksUntilDeadline + 4; week += 1) {
      const fixes = Math.min(remainingViolations, fixesPerWeek);
      currentScore = Math.min(100, currentScore + fixes * 3);
      remainingViolations = Math.max(0, remainingViolations - fixes);
      const milestone = currentScore >= 85 && !weeklyMilestones.some((m) => m.milestone?.includes('Certification'))
        ? '🏆 Certification eligible'
        : week === weeksUntilDeadline ? '📅 Federal deadline' : undefined;
      weeklyMilestones.push({ week, score: Math.round(currentScore), violations: remainingViolations, milestone });
    }

    const scoreAtDeadline = weeklyMilestones[weeksUntilDeadline - 1]?.score ?? currentScore;
    const compliant = scoreAtDeadline >= 85;
    const scoreModifier = (100 - scoreAtDeadline) / 100;
    const lawsuit30 = Math.round(baseLawsuitProb * scoreModifier * (compliant ? 0.1 : 1) * 100);
    return {
      name,
      description,
      fixesPerWeek,
      hoursPerWeek: Number((fixesPerWeek * avgHoursPerFix).toFixed(1)),
      projectedScoreAtDeadline: scoreAtDeadline,
      projectedScoreAt30Days: weeklyMilestones[3]?.score ?? currentScore,
      projectedScoreAt90Days: weeklyMilestones[11]?.score ?? currentScore,
      complianceStatus: compliant ? 'compliant' : scoreAtDeadline >= 70 ? 'at_risk' : 'non_compliant',
      certificationEligible: compliant,
      legalRiskLevel: scoreAtDeadline >= 85 ? 'low' : scoreAtDeadline >= 70 ? 'medium' : scoreAtDeadline >= 50 ? 'high' : 'critical',
      estimatedCostDiy: Math.round(fixesPerWeek * weeksUntilDeadline * avgHoursPerFix * 150),
      estimatedCostMarketplace: Math.round(fixesPerWeek * weeksUntilDeadline * avgHoursPerFix * 80),
      lawsuitProbability30Days: lawsuit30,
      lawsuitProbability90Days: Math.min(95, Math.round(lawsuit30 * 2.5)),
      recommendedPath: false,
      weeklyMilestones,
    };
  }

  const total = params.violations.length;
  const pathA = calculatePath(Math.ceil(total / weeksUntilDeadline) + 2, 'Emergency Sprint', 'Fix everything before the deadline.');
  const pathB = calculatePath(Math.max(1, Math.ceil(total / (weeksUntilDeadline * 1.5))), 'Standard Pace', `${params.devCapacityHoursPerWeek ?? 20} hours/week plan.`);
  const pathC = calculatePath(3, 'Minimal Effort', 'Slow progress with elevated legal risk.');
  const pathD = calculatePath(0, 'Do Nothing', 'No remediation effort.');
  pathA.recommendedPath = pathA.certificationEligible;
  if (!pathA.recommendedPath) pathB.recommendedPath = pathB.complianceStatus !== 'non_compliant';

  return {
    pathA,
    pathB,
    pathC,
    pathD,
    recommendation: pathA.certificationEligible ? 'Emergency Sprint is recommended to meet certification before deadline.' : 'Standard Pace is viable but may require additional sprints.',
    urgencyLevel: daysUntilDeadline <= 14 ? 'critical' : daysUntilDeadline <= 30 ? 'high' : daysUntilDeadline <= 60 ? 'medium' : 'low',
  } as const;
}
