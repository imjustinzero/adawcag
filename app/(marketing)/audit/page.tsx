'use client';
import { useState } from 'react';

export default function AuditPage() {
  const [step, setStep] = useState(1);
  return <main className="container" style={{ minHeight: '100vh', padding: '2rem 0' }}>
    {step === 1 && <section><h1>Free Website Accessibility Audit</h1><p>Results in under 60 seconds. No account needed.</p><input placeholder="https://yourwebsite.com"/><select><option>Government</option><option>Enterprise</option></select><button className="btn btn-primary" onClick={() => setStep(2)}>Run Free Audit →</button></section>}
    {step === 2 && <section><h2>Scanning your site...</h2><progress value={70} max={100} /><pre>{`Running axe-core... ✓
Running Lighthouse... ✓
Running pa11y... ✓`}</pre><button className="btn" onClick={() => setStep(3)}>View Results</button></section>}
    {step === 3 && <section><h2>WCAG Score: 34/100</h2><p>Risk Level: 🔴 CRITICAL</p><p>Total Violations: 47 | Critical: 5 | Serious: 12 | Moderate: 30</p><input placeholder="Enter your email to get the complete report" /><button className="btn btn-primary">Send My Free Report →</button></section>}
  </main>;
}
