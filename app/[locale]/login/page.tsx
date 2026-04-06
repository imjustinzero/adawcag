import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ADAWCAG.org – ADA & WCAG 2.1 Compliance Platform',
  description: 'Sign in to ADAWCAG.org to manage scans, remediation workflows, and compliance reporting.',
};

export default function LoginPage(): JSX.Element {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <form className="w-full space-y-4">
        <h1 className="text-2xl font-semibold">Login</h1>

        <label className="block text-sm font-medium" htmlFor="email">
          Email
        </label>
        <input className="w-full rounded border px-3 py-2" id="email" name="email" required type="email" autoComplete="email" />

        <label className="block text-sm font-medium" htmlFor="password">
          Password
        </label>
        <input
          className="w-full rounded border px-3 py-2"
          id="password"
          name="password"
          required
          type="password"
          autoComplete="current-password"
        />

        <button className="w-full rounded bg-black px-3 py-2 font-medium text-white" type="submit">
          Log in
        </button>
      </form>
    </main>
  );
}
