import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <nav className="flex gap-4 text-sm">
        <Link href="/admin">Overview</Link>
        <Link href="/admin/installs">📦 Installs</Link>
      </nav>
      {children}
    </div>
  );
}
