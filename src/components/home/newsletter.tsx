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
    <section className="px-4 pb-14 sm:px-5 sm:pb-20 md:px-8 md:pb-28">
      <div className="mx-auto max-w-[1400px] border border-line bg-cream px-4 py-12 text-center sm:px-6 sm:py-16 md:px-16">
        <p className="font-sans text-[0.65rem] tracking-[0.22em] text-gold-deep uppercase sm:text-[0.7rem] sm:tracking-[0.36em]">
          The atelier letter
        </p>
        <h2 className="mt-3 font-serif text-3xl sm:mt-4 md:text-5xl">
          Receive new works first
        </h2>
        <p className="mx-auto mt-3 max-w-lg font-sans text-sm leading-7 text-muted sm:mt-4">
          Occasional notes on newly finished pieces, private commissions, and
          the scripts we are studying. No noise — only the studio.
        </p>

        {submitted ? (
          <p className="mt-8 font-serif text-xl text-gold-deep sm:mt-10">
            You are on the list. Welcome to the atelier.
          </p>
        ) : (
          <form
            onSubmit={onSubmit}
            className="mx-auto mt-8 flex w-full max-w-lg flex-col gap-3 sm:mt-10 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Your email address"
              className="min-w-0 flex-1 border border-line bg-ivory px-4 py-3.5 font-sans text-base text-ink outline-none placeholder:text-muted focus:border-gold"
            />
            <button
              type="submit"
              className="bg-ink px-7 py-3.5 font-sans text-[0.68rem] tracking-[0.16em] text-ivory uppercase transition-colors hover:bg-gold-deep sm:text-[0.72rem] sm:tracking-[0.26em]"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
