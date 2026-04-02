'use client';

import { useMemo, useState } from 'react';

type RemediationItem = {
  id: string;
  issue_name: string;
  wcag_criterion: string;
  severity: string;
  estimated_hours: number;
  status: 'Unassigned' | 'In Progress' | 'Done';
};

type Violation = { issue_name: string; severity: string; wcag_criterion: string };

export function ScanWorkbench({ scanId, desktopScore, mobileScore, mobileViolations, remediationItems }: {
  scanId: string;
  desktopScore: number;
  mobileScore: number;
  mobileViolations: Violation[];
  remediationItems: RemediationItem[];
}): JSX.Element {
  const [tab, setTab] = useState<'desktop' | 'mobile' | 'roadmap'>('desktop');
  const [items, setItems] = useState(remediationItems);
  const [showVpatModal, setShowVpatModal] = useState(false);

  const doneCount = useMemo(() => items.filter((item) => item.status === 'Done').length, [items]);
  const pct = items.length ? Math.round((doneCount / items.length) * 100) : 0;

  async function markDone(itemId: string): Promise<void> {
    const response = await fetch(`/api/remediation/${itemId}/complete`, { method: 'POST' });
    if (!response.ok) return;
    setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, status: 'Done' } : item)));
  }

  return (
    <section className="card" style={{ display: 'grid', gap: '.9rem' }}>
      <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
        {(['desktop', 'mobile', 'roadmap'] as const).map((name) => (
          <button type="button" key={name} className="btn btn-ghost" onClick={() => setTab(name)} style={{ opacity: tab === name ? 1 : 0.65 }}>
            {name === 'roadmap' ? 'Remediation Roadmap' : name[0].toUpperCase() + name.slice(1)}
          </button>
        ))}
        <button type="button" className="btn btn-primary" onClick={() => setShowVpatModal(true)}>Generate VPAT</button>
      </div>

      {tab === 'desktop' && <p>Desktop accessibility score: <strong>{desktopScore}</strong>/100</p>}

      {tab === 'mobile' && (
        <div style={{ display: 'grid', gap: '.8rem' }}>
          <p style={{ margin: 0 }}>Mobile accessibility score: <strong>{mobileScore}</strong>/100</p>
          <div style={{ background: '#092540', padding: '.7rem', borderRadius: 10 }}>Mobile audit uses iPhone 12 Pro emulation (375px viewport, 2x DPI)</div>
          {desktopScore - mobileScore > 10 && <div style={{ background: '#402300', padding: '.7rem', borderRadius: 10 }}>⚠️ Your mobile experience has significantly more accessibility issues than desktop.</div>}
          <ul>
            {mobileViolations.map((item, idx) => <li key={`${item.issue_name}-${idx}`}>{item.issue_name} · {item.severity} · WCAG {item.wcag_criterion}</li>)}
          </ul>
        </div>
      )}

      {tab === 'roadmap' && (
        <div style={{ display: 'grid', gap: '.75rem' }}>
          <div>
            <p style={{ marginBottom: '.3rem' }}>{doneCount} of {items.length} issues resolved ({pct}%)</p>
            <div style={{ width: '100%', background: 'var(--bg-elevated)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, background: 'var(--accent-primary)', height: 10 }} />
            </div>
          </div>
          {items.map((item) => (
            <article className="card" key={item.id} style={{ display: 'grid', gap: '.4rem' }}>
              <strong>{item.issue_name}</strong>
              <p style={{ margin: 0 }}>WCAG {item.wcag_criterion} · {item.severity} · {item.estimated_hours} hrs · {item.status}</p>
              <button type="button" className="btn btn-primary" onClick={() => markDone(item.id)} disabled={item.status === 'Done'}>Mark Complete</button>
            </article>
          ))}
        </div>
      )}

      {showVpatModal && <VpatModal scanId={scanId} onClose={() => setShowVpatModal(false)} />}
    </section>
  );
}

function VpatModal({ scanId, onClose }: { scanId: string; onClose: () => void }): JSX.Element {
  const [saving, setSaving] = useState(false);

  async function onSubmit(formData: FormData): Promise<void> {
    setSaving(true);
    const payload = {
      scan_id: scanId,
      product_name: String(formData.get('product_name') ?? ''),
      product_version: String(formData.get('product_version') ?? ''),
      company_name: String(formData.get('company_name') ?? ''),
      contact_email: String(formData.get('contact_email') ?? ''),
      evaluation_date: String(formData.get('evaluation_date') ?? ''),
    };

    const response = await fetch('/api/generate-vpat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (response.ok && data.docxBase64) {
      const a = document.createElement('a');
      a.href = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${data.docxBase64}`;
      a.download = `${payload.product_name || 'vpat'}-${scanId}.docx`;
      a.click();
      alert('VPAT generated and downloaded.');
      onClose();
    }

    setSaving(false);
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)', display: 'grid', placeItems: 'center', padding: '1rem' }}>
      <form action={onSubmit} className="card" style={{ width: 'min(560px, 100%)', display: 'grid', gap: '.6rem' }}>
        <h3 style={{ marginTop: 0 }}>Generate VPAT</h3>
        <input name="product_name" required placeholder="Product name" />
        <input name="product_version" required placeholder="Version" />
        <input name="company_name" required placeholder="Company" />
        <input name="contact_email" required type="email" placeholder="Contact email" />
        <input name="evaluation_date" required type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
        <div style={{ display: 'flex', gap: '.6rem' }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Generating...' : 'Generate'}</button>
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
