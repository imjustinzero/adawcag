import Link from 'next/link';

export function DisabledButton({
  children,
  reason,
  ctaText,
  ctaHref,
}: {
  children: React.ReactNode;
  reason: string;
  ctaText?: string;
  ctaHref?: string;
}) {
  return (
    <div className="group relative inline-block">
      <button disabled className="cursor-not-allowed rounded bg-gray-700 px-4 py-2 text-sm text-gray-400 opacity-40">
        {children}
      </button>
      <div className="absolute bottom-full left-1/2 z-50 mb-2 hidden w-64 -translate-x-1/2 rounded-lg border border-gray-700 bg-gray-900 p-3 text-xs text-gray-300 shadow-xl group-hover:block">
        <p className="mb-2">{reason}</p>
        {ctaText && ctaHref ? (
          <Link href={ctaHref} className="font-medium text-green-400 hover:text-green-300">
            {ctaText} →
          </Link>
        ) : null}
      </div>
    </div>
  );
}
