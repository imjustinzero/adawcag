'use client';
import { useState } from 'react';

const seed = [
  { id: 1, time: '2m ago', title: 'Critical regression on checkout.com', detail: 'Keyboard trap introduced by deploy' },
  { id: 2, time: '1h ago', title: 'Scan complete — acme.com', detail: 'Score improved: 41 → 67' },
];

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} aria-label="Notifications">🔔 <span>{seed.length}</span></button>
      {open && (
        <div className="card" style={{ position: 'absolute', right: 0, width: 360, zIndex: 20 }}>
          <strong>Notifications</strong>
          {seed.map((n) => <div key={n.id} style={{ marginTop: '.8rem' }}><div>{n.time}</div><div>{n.title}</div><small>{n.detail}</small></div>)}
          <a href="/dashboard/notifications">View all notifications</a>
        </div>
      )}
    </div>
  );
}
