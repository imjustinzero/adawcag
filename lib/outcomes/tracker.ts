export type FixMethod = 'manual' | 'ai_assisted' | 'automated' | 'marketplace';

export type OutcomeRecord = {
  id: string;
  violationId: string;
  scanId: string;
  orgId: string;
  ruleId: string;
  wcagSc: string[];
  impact: string;
  techStack?: string;
  industry: string;
  pageType?: string;
  scoreBefore?: number;
  fixStartedAt?: string;
  fixSubmittedAt?: string;
  fixVerifiedAt?: string;
  fixDurationHours?: number | null;
  fixMethod?: FixMethod;
  aiSuggestionUsed?: boolean;
  aiSuggestionAccuracy?: 'exact' | 'modified' | 'rejected';
  scoreAfter?: number;
  violationsResolvedCount?: number;
  aaronVerified?: boolean;
  aaronNotes?: string;
  aaronDifficultyRating?: number;
  screenReaderTested?: boolean;
  keyboardTested?: boolean;
};

const outcomes = new Map<string, OutcomeRecord>();

export async function trackViolationOutcome(params: Omit<OutcomeRecord, 'id'>): Promise<string> {
  const id = crypto.randomUUID();
  outcomes.set(id, { id, ...params });
  return id;
}

export async function recordFixStarted(outcomeId: string): Promise<void> {
  const existing = outcomes.get(outcomeId);
  if (!existing) return;
  existing.fixStartedAt = new Date().toISOString();
}

export async function recordFixSubmitted(
  outcomeId: string,
  params: { fixMethod: FixMethod; aiSuggestionUsed: boolean; scoreAfter: number; violationsResolvedCount: number },
): Promise<void> {
  const existing = outcomes.get(outcomeId);
  if (!existing) return;
  const now = Date.now();
  existing.fixSubmittedAt = new Date(now).toISOString();
  existing.fixMethod = params.fixMethod;
  existing.aiSuggestionUsed = params.aiSuggestionUsed;
  existing.scoreAfter = params.scoreAfter;
  existing.violationsResolvedCount = params.violationsResolvedCount;
  existing.fixDurationHours = existing.fixStartedAt ? (now - new Date(existing.fixStartedAt).getTime()) / 3600000 : null;
}

export async function recordAaronVerification(
  outcomeId: string,
  params: {
    passed: boolean;
    notes: string;
    difficultyRating: number;
    aiSuggestionAccuracy?: 'exact' | 'modified' | 'rejected';
    screenReaderTested: boolean;
    keyboardTested: boolean;
  },
): Promise<void> {
  const existing = outcomes.get(outcomeId);
  if (!existing) return;
  existing.aaronVerified = params.passed;
  existing.aaronNotes = params.notes;
  existing.aaronDifficultyRating = params.difficultyRating;
  existing.aiSuggestionAccuracy = params.aiSuggestionAccuracy;
  existing.screenReaderTested = params.screenReaderTested;
  existing.keyboardTested = params.keyboardTested;
  existing.fixVerifiedAt = params.passed ? new Date().toISOString() : undefined;
}

export async function getSimilarOutcomes(ruleId: string, industry: string) {
  const similar = [...outcomes.values()].filter((o) => o.ruleId === ruleId && o.industry === industry && o.fixDurationHours != null);
  const anyRule = [...outcomes.values()].filter((o) => o.ruleId === ruleId && o.fixDurationHours != null);
  const pool = similar.length > 0 ? similar : anyRule;
  if (pool.length === 0) {
    return { avgFixHours: 0, medianFixHours: 0, aiAccuracyRate: 0, sampleSize: 0, difficulty: 0 };
  }
  const hours = pool.map((p) => Number(p.fixDurationHours ?? 0)).sort((a, b) => a - b);
  const avgFixHours = hours.reduce((a, b) => a + b, 0) / hours.length;
  const medianFixHours = hours[Math.floor(hours.length / 2)] ?? 0;
  const accuracy = pool.filter((p) => p.aiSuggestionAccuracy === 'exact').length / Math.max(1, pool.filter((p) => p.aiSuggestionUsed).length);
  const difficulty = pool.reduce((sum, p) => sum + (p.aaronDifficultyRating ?? 0), 0) / pool.length;
  return { avgFixHours, medianFixHours, aiAccuracyRate: Math.round(accuracy * 100), sampleSize: pool.length, difficulty };
}

export function listOutcomeRecords(): OutcomeRecord[] {
  return [...outcomes.values()];
}
