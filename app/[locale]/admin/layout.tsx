import type { ReactNode } from "react";
import Link from "next/link";

export default function AdminLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  return (
    <div className="space-y-6">
      <nav className="flex gap-4 text-sm">
        <Link href={`/${params.locale}/admin`}>Overview</Link>
        <Link href={`/${params.locale}/admin/installs`}>📦 Installs</Link>
      </nav>
      {children}
    </div>
  );
}
