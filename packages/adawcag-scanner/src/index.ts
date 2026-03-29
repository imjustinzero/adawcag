export interface ScanOptions {
  apiKey: string;
  wcagLevel?: '2.0A' | '2.0AA' | '2.1A' | '2.1AA' | '2.2AA';
  failOn?: ('critical' | 'serious' | 'moderate' | 'minor')[];
  maxViolations?: number;
  timeout?: number;
  pages?: string[];
  gitSha?: string;
  environment?: 'production' | 'staging' | 'preview';
}

export interface ScanResult {
  scanId: string;
  url: string;
  score: number;
  gate: 'pass' | 'fail' | 'warning';
  violations: { total: number; critical: number; serious: number; moderate: number; minor: number };
  topViolations: string[];
  reportUrl: string;
  legalRiskFlag: boolean;
}

export async function scan(url: string, _options: ScanOptions): Promise<ScanResult> {
  return {
    scanId: 'mock-scan-id',
    url,
    score: 100,
    gate: 'pass',
    violations: { total: 0, critical: 0, serious: 0, moderate: 0, minor: 0 },
    topViolations: [],
    reportUrl: '',
    legalRiskFlag: false
  };
}

export async function scanAndFail(url: string, options: ScanOptions): Promise<void> {
  const result = await scan(url, options);
  if (result.gate === 'fail') {
    process.exitCode = 1;
  }
}
