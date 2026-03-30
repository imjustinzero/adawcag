const STATUS_CONFIG = {
  queued: { label: 'In queue', color: '#6b7280', icon: '⏳' },
  running: { label: 'Scanning...', color: '#2563eb', icon: '🔄' },
  completed: { label: 'Complete', color: '#16a34a', icon: '✅' },
  failed: { label: 'Failed', color: '#dc2626', icon: '❌' },
  retrying: { label: 'Retrying...', color: '#ca8a04', icon: '⚠️' },
} as const;

export function ScanStatusBadge({ status }: { status: keyof typeof STATUS_CONFIG }): JSX.Element {
  const cfg = STATUS_CONFIG[status];
  return <span style={{ color: cfg.color }}>{cfg.icon} {cfg.label}</span>;
}
