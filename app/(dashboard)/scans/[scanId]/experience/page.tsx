import { runScreenReaderSimulation } from '@/lib/simulation/screen-reader-engine';
import { ScreenReaderReport } from '@/components/simulation/ScreenReaderReport';

export default async function ScanExperiencePage({ params }: { params: Promise<{ scanId: string }> }) {
  const { scanId } = await params;
  const report = await runScreenReaderSimulation({ url: 'https://adawcag.org', industry: 'government', orgId: 'demo-org' });
  return (
    <main className="container" style={{ padding: '2rem 0' }}>
      <h1>Scan {scanId} — Screen Reader Experience</h1>
      <ScreenReaderReport report={report} />
    </main>
  );
}
