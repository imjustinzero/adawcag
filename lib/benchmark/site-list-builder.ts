export type BenchmarkSite = { url: string; category: string; state: string; organization_name: string; wcag_score: number; total_violations: number; critical_violations: number; score_delta_30d: number };

const MOCK_SITES: BenchmarkSite[] = [
  { url: 'https://www.usa.gov', category: 'government', state: 'DC', organization_name: 'USA.gov', wcag_score: 72, total_violations: 34, critical_violations: 2, score_delta_30d: 4 },
  { url: 'https://www.ca.gov', category: 'government', state: 'CA', organization_name: 'California Portal', wcag_score: 51, total_violations: 79, critical_violations: 9, score_delta_30d: 2 },
  { url: 'https://www.nyc.gov', category: 'government', state: 'NY', organization_name: 'NYC.gov', wcag_score: 48, total_violations: 92, critical_violations: 11, score_delta_30d: -1 },
];

export async function getNextBenchmarkBatch(limit = 500): Promise<BenchmarkSite[]> {
  return MOCK_SITES.slice(0, Math.min(limit, MOCK_SITES.length));
}

export async function scanBenchmarkSite(site: BenchmarkSite): Promise<BenchmarkSite> {
  return { ...site, wcag_score: Math.max(0, Math.min(100, site.wcag_score + (Math.random() > 0.5 ? 1 : -1))) };
}

export async function getBenchmarkSummary() {
  const tracked = MOCK_SITES.length;
  const avg = Math.round(MOCK_SITES.reduce((s, v) => s + v.wcag_score, 0) / tracked);
  const criticalRisk = MOCK_SITES.filter((s) => s.wcag_score < 50).length;
  return { lastUpdated: new Date().toISOString(), tracked, averageScore: avg, criticalRisk };
}

export async function getBenchmarkSites(state?: string) {
  return state ? MOCK_SITES.filter((s) => s.state.toLowerCase() === state.toLowerCase()) : MOCK_SITES;
}
