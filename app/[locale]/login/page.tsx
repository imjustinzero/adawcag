'use client';

import { FormEvent, useState } from 'react';

export default function LoginPage(): JSX.Element {
  const [showPassword, setShowPassword] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <form className="w-full space-y-4" onSubmit={onSubmit}>
        <h1 className="text-2xl font-semibold">Login</h1>

        <label className="block text-sm font-medium" htmlFor="email">
          Email
        </label>
        <input className="w-full rounded border px-3 py-2" id="email" name="email" required type="email" />

        <label className="block text-sm font-medium" htmlFor="password">
          Password
        </label>
        <div className="relative">
          <input
            className="w-full rounded border px-3 py-2 pr-10"
            id="password"
            name="password"
            required
            type={showPassword ? 'text' : 'password'}
          />
          <button
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 flex items-center px-3"
            onClick={() => setShowPassword((value) => !value)}
            type="button"
          >
            <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>

        <button className="w-full rounded bg-black px-3 py-2 font-medium text-white" type="submit">
          Log in
        </button>
      </form>
    </main>
  );
}
