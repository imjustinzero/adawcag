import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAgencyBySlug, govAuditLogs, govMembers, verifyGovPortalSession } from '@/lib/gov-portal/store';

export const metadata: Metadata = {
  title: 'ADAWCAG.org – ADA & WCAG 2.1 Compliance Platform',
  description: 'ADAWCAG.org provides ADA and WCAG 2.1 compliance scanning, remediation guidance, and reporting.',
};


export default async function GovPortalAdminPage({ params }: { params: { locale: string; agencySlug: string } }) {
  const cookieStore = await cookies();
  const session = verifyGovPortalSession(cookieStore.get('gov_portal_session')?.value);
  const agency = getAgencyBySlug(params.agencySlug);

  if (!agency || !session || session.agencyId !== agency.id || session.role !== 'Agency_Admin') {
    redirect(`/${params.locale}/gov-portal/${params.agencySlug}/login`);
  }

  const members = govMembers.filter((member) => member.agencyId === agency.id);
  const logs = govAuditLogs.filter((entry) => entry.agencyId === agency.id).slice(0, 50);

  return (
    <main style={{ padding: 24 }}>
      <h1>Agency Admin</h1>
      <h2>Invite team member</h2>
      <form action={`/${params.locale}/api/gov-portal/${params.agencySlug}/invite`} method="post">
        <input name="email" placeholder="name@agency.gov" required />
        <select name="role" defaultValue="Viewer">
          <option value="Agency_Admin">Agency Admin</option>
          <option value="Dept_Manager">Department Manager</option>
          <option value="Viewer">Viewer</option>
        </select>
        <input name="department" placeholder="Department (for manager)" />
        <button type="submit">Send invite</button>
      </form>

      <h2>Branding</h2>
      <form action={`/${params.locale}/api/gov-portal/${params.agencySlug}/admin`} method="post">
        <input type="hidden" name="action" value="branding" />
        <input name="portalTitle" placeholder="Portal title" defaultValue={agency.portalTitle} />
        <input name="logoUrl" placeholder="Logo URL" defaultValue={agency.logoUrl ?? ''} />
        <input name="sealUrl" placeholder="Seal URL" defaultValue={agency.sealUrl ?? ''} />
        <input name="primaryColor" placeholder="#003262" defaultValue={agency.primaryColor} />
        <input name="secondaryColor" placeholder="#FDB515" defaultValue={agency.secondaryColor} />
        <button type="submit">Save branding</button>
      </form>

      <h2>Members</h2>
      <ul>
        {members.map((member) => (
          <li key={member.id}>
            {member.email} — {member.role} {member.department ? `(${member.department})` : ''}
          </li>
        ))}
      </ul>

      <h2>Audit log</h2>
      <table>
        <thead><tr><th>Time</th><th>User</th><th>Action</th><th>Detail</th></tr></thead>
        <tbody>
          {logs.map((entry) => (
            <tr key={entry.id}><td>{entry.createdAt}</td><td>{entry.memberEmail}</td><td>{entry.action}</td><td>{entry.detail}</td></tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
