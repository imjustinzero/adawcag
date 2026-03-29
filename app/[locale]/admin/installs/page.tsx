async function getInstallData() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/admin/installs`, {
    headers: { "x-admin": "true" },
    cache: "no-store",
  });

  if (!response.ok) {
    return { sources: [], trend: [] };
  }

  return response.json();
}

function sparkline(values: number[]) {
  const blocks = ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█"];
  const max = Math.max(...values, 1);
  return values
    .map((value) => blocks[Math.min(blocks.length - 1, Math.floor((value / max) * (blocks.length - 1)))])
    .join("");
}

export default async function AdminInstallsPage() {
  const data = await getInstallData();
  const trendValues = (data.trend ?? []).map((d: { count: number }) => d.count);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">📦 Installs</h1>

      <div className="rounded border p-4">
        <h2 className="font-medium">Install Counts by Source</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {(data.sources ?? []).map((row: { source: string; count: number }) => (
            <li key={row.source}>
              {row.source}: <strong>{row.count}</strong>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded border p-4">
        <h2 className="font-medium">30-Day Trend</h2>
        <p className="mt-2 font-mono text-lg">{trendValues.length ? sparkline(trendValues) : "No data"}</p>
      </div>
    </div>
  );
}
