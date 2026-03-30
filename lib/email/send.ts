import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendEmail({
  to,
  subject,
  html,
  from = 'ADAWCAG <contact@adawcag.org>',
  replyTo = 'contact@adawcag.org',
}: {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}): Promise<{ id?: string; skipped?: boolean }> {
  if (!resend) return { skipped: true };
  const response = await resend.emails.send({ from, to, subject, html, replyTo });
  return { id: response.data?.id };
}
