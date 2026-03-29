import { listResearchApplications } from '@/lib/research/data';

export default function InternalResearchApplicationsPage() {
  const apps = listResearchApplications();
  return <main className="container" style={{padding:'2rem 0'}}><h1>Research Applications</h1><pre>{JSON.stringify(apps, null, 2)}</pre></main>;
}
