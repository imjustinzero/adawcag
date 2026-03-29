export interface PredictionFeatures {
  techStack: string;
  cmsType: string;
  jsFramework: string;
  currentScore: number;
  currentViolationProfile: Record<string, number>;
  deployFrequency: number;
  avgRegressionRate: number;
  lastMajorThemeUpdate: Date | null;
  lastFrameworkMajorVersion: string;
  teamSize: number;
  hasDeployGate: boolean;
  hasWeeklyScans: boolean;
  avgFixTime: number;
  industry: string;
  contentUpdateFrequency: number;
}

export interface ViolationPrediction {
  violationType: string;
  probability: number;
  expectedTimeToOccurrence: number;
  triggerConditions: string[];
  preventionSteps: string[];
  similarOrgs: number;
  confidence: 'high' | 'medium' | 'low';
}

export function collectPredictionFeatures(features: PredictionFeatures) {
  return { ...features, collectedAt: new Date().toISOString(), modelReady: false };
}

export function predictLikelyRegressions(features: PredictionFeatures): ViolationPrediction[] {
  const base = features.hasDeployGate ? 0.38 : 0.73;
  return [
    {
      violationType: 'color-contrast',
      probability: base,
      expectedTimeToOccurrence: 30,
      triggerConditions: ['Theme update', 'New design tokens added'],
      preventionSteps: ['Run contrast checks in CI', 'Lock accessible color palette'],
      similarOrgs: 234,
      confidence: 'high',
    },
    {
      violationType: 'image-alt',
      probability: Math.max(0.2, base - 0.12),
      expectedTimeToOccurrence: 60,
      triggerConditions: ['Content volume growth'],
      preventionSteps: ['Require alt text in CMS workflow'],
      similarOrgs: 156,
      confidence: 'medium',
    },
  ];
}
