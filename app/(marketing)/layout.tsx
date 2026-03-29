import type { Metadata } from 'next';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'ADAWCAG.org | ADA & WCAG Compliance',
  description: 'Run a free accessibility audit and reduce ADA lawsuit exposure.',
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
