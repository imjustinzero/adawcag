import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'ADAWCAG.org – ADA & WCAG 2.1 Compliance Platform',
  description: 'ADAWCAG.org provides ADA and WCAG 2.1 compliance scanning, remediation guidance, and reporting.',
};


export default function GovPortalJoinPage({ params, searchParams }: { params: { locale: string; agencySlug: string }; searchParams: { token?: string } }) {
  const token = searchParams.token ?? '';
  redirect(`/${params.locale}/api/gov-portal/${params.agencySlug}/join?token=${encodeURIComponent(token)}`);
}
