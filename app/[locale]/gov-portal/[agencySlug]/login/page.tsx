import Link from 'next/link';

export default function GovPortalLoginPage({ params }: { params: { locale: string; agencySlug: string } }) {
  return (
    <main style={{ padding: 24 }}>
      <h1>Government Portal Login</h1>
      <p>This portal uses invite links (magic links). Ask your Agency Admin to invite you.</p>
      <p>
        Demo join link:{' '}
        <Link href={`/${params.locale}/gov-portal/${params.agencySlug}/join?token=demo-token`}>
          /gov-portal/{params.agencySlug}/join
        </Link>
      </p>
    </main>
  );
}
