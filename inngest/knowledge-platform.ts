import { getNextBenchmarkBatch, scanBenchmarkSite } from '@/lib/benchmark/site-list-builder';
import { runScreenReaderSimulation } from '@/lib/simulation/screen-reader-engine';
import { generateAnnualReport } from '@/lib/reports/annual-report-generator';

export const knowledgePlatformFunctions = [
  {
    id: 'benchmark-scan-batch',
    name: 'Benchmark: Daily scan batch',
    cron: '0 6 * * *',
    run: async () => {
      const sites = await getNextBenchmarkBatch(500);
      await Promise.allSettled(sites.map((site) => scanBenchmarkSite(site)));
      return { scanned: sites.length };
    },
  },
  {
    id: 'refresh-outcome-stats',
    name: 'Refresh outcome statistics',
    cron: '0 3 * * 1',
    run: async () => ({ refreshed: true }),
  },
  {
    id: 'screen-reader-simulation',
    name: 'Screen reader simulation',
    event: 'simulation/requested',
    run: async (event: { data: { url: string; industry: string; orgId: string } }) => runScreenReaderSimulation(event.data),
  },
  {
    id: 'generate-annual-report',
    name: 'Generate annual outcomes report',
    event: 'report/annual-requested',
    run: async (event: { data: { year: number } }) => generateAnnualReport(event.data.year),
  },
] as const;
