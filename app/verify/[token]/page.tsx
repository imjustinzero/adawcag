export const runtime = 'edge';
export const revalidate = 3600;

export default async function VerifyPage({ params }: { params: Promise<{ token: string }> }): Promise<JSX.Element> {
  const { token } = await params;
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Certification Verification</h1>
      <p>Verification token: {token}</p>
    </main>
  );
}
