import Link from 'next/link';

const navLinks = [
  ['/', 'Home'],
  ['/en/ada-wcag-scan-tool', 'Scan Tool'],
  ['/en/pricing', 'Pricing'],
  ['/en/ecommerce', 'E-Commerce'],
  ['/en/docs', 'Docs'],
  ['/en/locations', 'Locations'],
  ['/en/login', 'Log in'],
  ['/en/signup', 'Start free trial'],
] as const;

const footerLinks = [
  '/en/docs',
  '/en/security',
  '/en/accessibility',
  '/en/vpat',
  '/en/changelog',
  '/en/risk',
  '/en/contact',
  '/en/demo',
  '/en/developers',
  '/en/compliance-calendar',
  '/en/faq',
  '/rss.xml',
  '/sitemap.xml',
] as const;

export default function LocaleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="container" style={{ display: 'flex', gap: '1rem', padding: '1rem 0', flexWrap: 'wrap' }}>
        {navLinks.map(([href, label]) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
      </header>
      {children}
      <footer className="container" style={{ display: 'flex', gap: '.75rem', padding: '2rem 0', flexWrap: 'wrap' }}>
        {footerLinks.map((href) => (
          <Link key={href} href={href}>
            {href.replace('/en/', '').replace('/', '') || 'home'}
          </Link>
        ))}
      </footer>
    </>
  );
}
