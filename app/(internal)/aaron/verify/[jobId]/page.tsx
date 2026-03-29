const AARON_CHECKLIST = {
  screenReader: ['NVDA + Chrome announced correctly', 'VoiceOver + Safari announced correctly', 'Reading order logical', 'Dynamic updates announced'],
  keyboard: ['Reachable with Tab', 'No keyboard trap', 'Visible focus indicator', 'Enter/Space activates'],
  visual: ['Contrast 4.5:1 (normal text)', 'Contrast 3:1 (large text)', 'No color-only meaning', 'Zoom 200% holds'],
  content: ['Alt text descriptive', 'Form label associated', 'Error identifies field', 'Heading hierarchy logical'],
};

export default async function AaronVerifyPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  return (
    <main className="container" style={{ padding: '2rem 0' }}>
      <h1>Aaron Verification — Job {jobId}</h1>
      <section className="card">
        <h2>Research Verification Checklist</h2>
        {Object.entries(AARON_CHECKLIST).map(([section, items]) => (
          <div key={section}>
            <h3 style={{ textTransform: 'capitalize' }}>{section}</h3>
            <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        ))}
        <p>Capture: AI accuracy (Exact / Modified / Rejected), difficulty (1-5), screen reader tested, keyboard tested.</p>
      </section>
    </main>
  );
}
