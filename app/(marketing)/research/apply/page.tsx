export default function ResearchApplyPage() {
  return (
    <main className="container" style={{ padding: '2rem 0' }}>
      <h1>Research Access Application</h1>
      <form className="card" method="post" action="/api/research/apply" style={{ display: 'grid', gap: '.75rem' }}>
        <input name="institution" placeholder="Institution" required />
        <input name="department" placeholder="Department" required />
        <input name="principalInvestigator" placeholder="Principal Investigator" required />
        <input type="email" name="email" placeholder="Institutional email" required />
        <textarea name="researchQuestion" placeholder="Research question" maxLength={500} required />
        <input name="datasets" placeholder="Datasets requested (comma separated)" required />
        <textarea name="methodsOverview" placeholder="Methods overview" required />
        <textarea name="expectedOutputs" placeholder="Expected outputs" required />
        <input name="irbApprovalNumber" placeholder="IRB approval number (if Dataset 4)" />
        <textarea name="dataHandlingPlan" placeholder="Data handling plan" required />
        <button className="btn btn-primary" type="submit">Submit Application</button>
      </form>
    </main>
  );
}
