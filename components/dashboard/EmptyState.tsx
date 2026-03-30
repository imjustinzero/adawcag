import Link from 'next/link';

export function DashboardEmptyState(): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="text-6xl mb-6">🔍</div>
      <h2 className="text-2xl font-semibold text-white mb-3">Let's find your first violation</h2>
      <p className="text-gray-400 mb-8 max-w-md">
        Add your website and run a free scan. We'll show you every WCAG violation, ranked by legal risk, with exact fix guidance.
      </p>
      <div className="flex gap-4">
        <Link href="/en/sites/new" className="bg-green-500 hover:bg-green-400 text-black font-semibold px-6 py-3 rounded-lg">Add your website →</Link>
        <Link href="/en/docs" className="border border-gray-600 text-gray-300 px-6 py-3 rounded-lg hover:border-gray-400">How it works</Link>
      </div>
      <p className="text-gray-600 text-sm mt-8">Average first scan completes in under 5 minutes.</p>
    </div>
  );
}
