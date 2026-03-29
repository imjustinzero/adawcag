type Certification = {
  id: string;
  name: string;
  status: string;
  expiresAt: string;
};

function needsRenewal(expiresAtIso: string) {
  const now = new Date();
  const expiry = new Date(expiresAtIso);
  const ms = expiry.getTime() - now.getTime();
  const daysRemaining = Math.ceil(ms / (1000 * 60 * 60 * 24));

  return daysRemaining <= 30;
}

export default function CertificationsPage() {
  const certifications: Certification[] = [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Certifications</h1>
      <p className="text-sm text-muted-foreground">
        Certifications auto-expire every 90 days. Renew for $299/quarter to maintain your compliance badge and
        public verification page.
      </p>

      <div className="space-y-4">
        {certifications.map((cert) => (
          <div key={cert.id} className="rounded border p-4">
            <h2 className="font-medium">{cert.name}</h2>
            <p>Status: {cert.status}</p>
            <p>Expires: {new Date(cert.expiresAt).toLocaleDateString()}</p>

            {needsRenewal(cert.expiresAt) && (
              <form method="POST" action="/api/stripe/checkout" className="mt-3">
                <input type="hidden" name="plan" value="cert_renewal" />
                <button type="submit" className="rounded bg-black px-3 py-2 text-white">
                  Renew — $299/qtr
                </button>
              </form>
            )}
          </div>
        ))}
      </div>

      {!certifications.length && (
        <div className="rounded border border-dashed p-6 text-sm text-muted-foreground">
          No certifications found yet. Issue one to see renewal controls.
        </div>
      )}
    </div>
  );
}
