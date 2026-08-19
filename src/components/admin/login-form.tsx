"use client";

import { FormEvent, useState } from "react";
import { loginAdmin } from "@/lib/admin-login";
import { Logo } from "@/components/logo";

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setPending(true);

    try {
      const result = await loginAdmin(email.trim().toLowerCase(), password);
      if (result?.error) {
        setError(result.error);
        setPending(false);
      }
    } catch (err) {
      setError("Could not sign in. Check the email, password, and try again.");
      setPending(false);
      console.error(err);
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center bg-ivory px-4 py-16">
      <div className="w-full max-w-md border border-line bg-cream/60 px-6 py-10 sm:px-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo variant="stacked" />
          <p className="mt-6 font-sans text-[0.68rem] tracking-[0.28em] text-gold-deep uppercase">
            Atelier access
          </p>
          <h1 className="mt-2 font-serif text-3xl">Admin login</h1>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="font-sans text-[0.65rem] tracking-[0.2em] text-muted uppercase">
              Email
            </span>
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full border border-line bg-ivory px-4 py-3 font-sans text-ink outline-none focus:border-gold"
            />
          </label>
          <label className="block">
            <span className="font-sans text-[0.65rem] tracking-[0.2em] text-muted uppercase">
              Password
            </span>
            <div className="mt-2 flex border border-line bg-ivory focus-within:border-gold">
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="min-w-0 flex-1 bg-transparent px-4 py-3 font-sans text-ink outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((open) => !open)}
                className="px-3 font-sans text-[0.62rem] tracking-[0.16em] text-muted uppercase"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <p className="mt-2 font-sans text-[0.7rem] text-muted">
              {password.length} characters · paste the 16-character password, do not type it
            </p>
          </label>
          {error ? <p className="font-sans text-sm text-gold-deep">{error}</p> : null}
          <button
            type="submit"
            disabled={pending}
            className="w-full bg-ink py-3.5 font-sans text-[0.72rem] tracking-[0.24em] text-ivory uppercase transition-colors hover:bg-gold-deep disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Enter dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
