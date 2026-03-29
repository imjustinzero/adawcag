'use client';
import { useEffect, useState } from 'react';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(4,12,24,.82)', padding: '8vh 12vw', zIndex: 60 }}>
      <div className="card">
        <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search sites, scans, documents..." style={{ width: '100%', padding: '.8rem' }} />
        <p style={{ color: 'var(--text-secondary)' }}>QUICK ACTIONS · SITES · SCANS · DOCUMENTS</p>
      </div>
    </div>
  );
}
