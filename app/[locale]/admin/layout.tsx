import Link from 'next/link';
import { ReactNode } from 'react';

const NAV_ITEMS = [
  { label: 'Tenants', href: '/admin/tenants' },
  { label: 'Leads', href: '/admin/leads' },
  { label: 'Issues', href: '/admin/issues' },
  { label: '🏅 Certifications', href: '/admin/certifications' },
  { label: '🛍️ Marketplace Devs', href: '/admin/marketplace' },
  { label: '⚖️ ADA Cases', href: '/admin/ada-cases' },
  { label: '🏛️ RFP Opportunities', href: '/admin/rfps' },
  { label: '📦 Installs', href: '/admin/installs' },
];

export default function AdminLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24 }}>
      <aside>
        <h3>Admin</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </aside>
      <main>{children}</main>
    </div>
  );
}
