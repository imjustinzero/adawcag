import { getBenchmarkSites, getBenchmarkSummary } from '@/lib/benchmark/site-list-builder';

export type ResearchApplication = {
  id: string;
  institution: string;
  department: string;
  principalInvestigator: string;
  email: string;
  researchQuestion: string;
  datasets: string[];
  methodsOverview: string;
  expectedOutputs: string;
  irbApprovalNumber?: string;
  dataHandlingPlan: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
};

const applications: ResearchApplication[] = [];

export function validateResearchApiKey(key: string | null): boolean {
  return Boolean(key && key.startsWith('rk_'));
}

export async function getResearchOutcomes(filters?: Record<string, string>) {
  const sample = [
    { industry: 'government', rule_id: 'color-contrast', impact: 'serious', sample_size: 18, avg_fix_hours: 3.1, ai_accuracy_rate: 72 },
    { industry: 'healthcare', rule_id: 'label', impact: 'critical', sample_size: 12, avg_fix_hours: 4.3, ai_accuracy_rate: 67 },
  ];
  return sample.filter((row) => !filters?.industry || row.industry === filters.industry);
}

export async function getResearchBenchmark(filters?: Record<string, string>) {
  const state = filters?.state;
  return getBenchmarkSites(state);
}

export async function getResearchImpact() {
  return [
    { industry: 'government', state: 'CA', visual: 12400, mobility: 3200, cognitive: 28000, hearing: 840 },
    { industry: 'healthcare', state: 'NY', visual: 8400, mobility: 2900, cognitive: 14000, hearing: 500 },
  ];
}

export async function getDatasetsMetadata() {
  const summary = await getBenchmarkSummary();
  return [
    { id: 'outcomes', records: 12847, format: ['JSONL', 'CSV'], minSampleSize: 5 },
    { id: 'impact', records: 2847, format: ['CSV'], minSampleSize: 5 },
    { id: 'benchmark', records: summary.tracked, format: ['CSV', 'Parquet'], minSampleSize: 1 },
    { id: 'simulation', records: 500, format: ['JSONL'], minSampleSize: 5 },
  ];
}

export function submitResearchApplication(input: Omit<ResearchApplication, 'id' | 'submittedAt' | 'status'>) {
  const app: ResearchApplication = { ...input, id: crypto.randomUUID(), submittedAt: new Date().toISOString(), status: 'pending' };
  applications.push(app);
  return app;
}

export function listResearchApplications() {
  return applications;
}
