function appBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL ?? "http://localhost:3000";
}

async function getInstallStats(locale: string) {
  const response = await fetch(`${appBaseUrl()}/${locale}/api/install/stats`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return { total: 0 };
  }

  return response.json();
}

export default async function DevelopersPage({ params }: { params: { locale: string } }) {
  const stats = await getInstallStats(params.locale);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Developers</h1>
      <p>Use the ADAWCAG REST API and tooling to automate compliance checks in CI.</p>

      <section className="rounded border p-4">
        <h2 className="font-medium">npm package: npm install adawcag · npx adawcag scan</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Install command runs a lightweight hook that can report anonymous install events (source/version only) so
          we can improve package reliability and CI onboarding.
        </p>
        <pre className="mt-3 rounded bg-slate-100 p-3 text-sm">npm install adawcag{"\n"}npx adawcag scan</pre>
        <p className="mt-3 text-sm">
          Total tracked installs: <span className="rounded bg-slate-100 px-2 py-1 font-semibold">{stats.total}</span>
        </p>
      </section>
    </div>
  );
}
