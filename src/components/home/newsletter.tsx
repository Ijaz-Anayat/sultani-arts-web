"use client";

import { FormEvent, useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <section className="px-5 pb-20 md:px-8 md:pb-28">
      <div className="mx-auto max-w-[1400px] border border-line bg-cream px-6 py-16 text-center md:px-16">
        <p className="font-sans text-[0.7rem] tracking-[0.36em] text-gold-deep uppercase">
          The atelier letter
        </p>
        <h2 className="mt-4 font-serif text-3xl md:text-5xl">
          Receive new works first
        </h2>
        <p className="mx-auto mt-4 max-w-lg font-sans text-sm leading-7 text-muted">
          Occasional notes on newly finished pieces, private commissions, and
          the scripts we are studying. No noise — only the studio.
        </p>

        {submitted ? (
          <p className="mt-10 font-serif text-xl text-gold-deep">
            You are on the list. Welcome to the atelier.
          </p>
        ) : (
          <form
            onSubmit={onSubmit}
            className="mx-auto mt-10 flex w-full max-w-lg flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Your email address"
              className="flex-1 border border-line bg-ivory px-4 py-3.5 font-sans text-sm text-ink outline-none placeholder:text-muted focus:border-gold"
            />
            <button
              type="submit"
              className="bg-ink px-7 py-3.5 font-sans text-[0.72rem] tracking-[0.26em] text-ivory uppercase transition-colors hover:bg-gold-deep"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
