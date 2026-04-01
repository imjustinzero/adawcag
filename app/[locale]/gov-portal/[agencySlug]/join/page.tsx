import { redirect } from 'next/navigation';

export default function GovPortalJoinPage({ params, searchParams }: { params: { locale: string; agencySlug: string }; searchParams: { token?: string } }) {
  const token = searchParams.token ?? '';
  redirect(`/${params.locale}/api/gov-portal/${params.agencySlug}/join?token=${encodeURIComponent(token)}`);
}
