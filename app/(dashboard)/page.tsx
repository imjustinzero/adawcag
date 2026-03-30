import { DashboardEmptyState } from '@/components/dashboard/EmptyState';

export default function DashboardPage(): JSX.Element {
  const sitesCount = 0;

  if (sitesCount === 0) {
    return (
      <main className="container" style={{ padding: '2rem 0' }}>
        <DashboardEmptyState />
      </main>
    );
  }

  return (
    <main className="container" style={{ padding: '2rem 0' }}>
      <h1>Dashboard Command Center</h1>
      <div className="card">Plan-aware dashboard placeholders for Starter, Agency, and Enterprise views.</div>
    </main>
  );
}
