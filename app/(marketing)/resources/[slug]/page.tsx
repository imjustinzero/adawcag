const MAP: Record<string,string> = {
  'ada-title-ii-deadline-guide':'Title II enforcement for state and local government websites starts April 24, 2026.',
  'robles-v-dominos':'This case established web accessibility as a core ADA risk area.',
  'wcag-21-vs-22':'WCAG 2.1 AA remains the most common legal benchmark.',
  'respond-to-demand-letter':'Respond quickly, preserve evidence, and begin remediation immediately.',
  'complete-vpat-guide':'A VPAT/ACR documents accessibility conformance for procurement and audits.',
  'lawsuit-statistics-trends':'Lawsuits remain elevated across retail, restaurants, and services.',
};
export default async function ResourcePost({ params }: { params: Promise<{ slug: string }>}) {
  const { slug } = await params;
  return <main className="container" style={{ padding: '2rem 0' }}><article className="card"><h1>{slug}</h1><p>{MAP[slug] ?? 'Post not found.'}</p></article></main>;
}
