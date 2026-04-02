export default function NewSitePage() {
  return (
    <main className="container" style={{ padding: '2rem 0' }}>
      <h1>Add site</h1>
      <p>Add your site and run a scan — takes under 5 minutes.</p>
      <form className="card" style={{ display: 'grid', gap: '.75rem', maxWidth: 520 }} method="post" action="/api/scans">
        <input name="url" placeholder="https://example.com" required type="url" />
        <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          <input type="checkbox" name="mobile_audit" defaultChecked />
          Include Mobile Audit
        </label>
        <button className="btn btn-primary" type="submit">Save site</button>
      </form>
    </main>
  );
}
