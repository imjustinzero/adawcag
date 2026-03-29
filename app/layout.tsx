import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://adawcag.org'),
  title: 'ADAWCAG.org | Accessibility Risk Platform',
  description: 'Scan websites for WCAG 2.1 AA issues and legal accessibility risk.',
  openGraph: {
    title: 'ADAWCAG.org',
    description: 'Accessibility risk intelligence and remediation workflows.',
    images: ['/api/og?title=ADAWCAG.org'],
  },
  alternates: { canonical: '/' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
