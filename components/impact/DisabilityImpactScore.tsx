'use client';

type Props = {
  data: {
    totalUsersImpacted: number;
    impactByDisabilityType: { visual: number; mobility: number; hearing: number; cognitive: number };
    lostRevenueEstimate: number | null;
    methodology: string;
  };
};

export function DisabilityImpactScore({ data }: Props) {
  return (
    <section className="card" style={{ borderLeft: '4px solid #f97316' }}>
      <h2 style={{ marginTop: 0 }}>Disability Impact Analysis</h2>
      <p className="kpi">Estimated users impacted this month: {data.totalUsersImpacted.toLocaleString()}</p>
      <ul>
        <li>👁 Visual: {data.impactByDisabilityType.visual.toLocaleString()}</li>
        <li>🖐 Mobility: {data.impactByDisabilityType.mobility.toLocaleString()}</li>
        <li>👂 Hearing: {data.impactByDisabilityType.hearing.toLocaleString()}</li>
        <li>🧠 Cognitive: {data.impactByDisabilityType.cognitive.toLocaleString()}</li>
      </ul>
      <p>Estimated annual revenue impact: {data.lostRevenueEstimate == null ? 'N/A' : `$${data.lostRevenueEstimate.toLocaleString()}/year`}</p>
      <small style={{ color: 'var(--text-secondary)' }}>ⓘ Methodology: {data.methodology}</small>
    </section>
  );
}
