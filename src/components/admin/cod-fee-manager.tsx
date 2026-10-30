"use client";

import { FormEvent, useState } from "react";

type Props = {
  initialFees: Record<string, number>;
};

export function CodFeeManager({ initialFees }: Props) {
  const [fees, setFees] = useState(initialFees);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setPending(true);

    try {
      const response = await fetch("/api/settings/cod-fees", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fees }),
      });
      const body = (await response.json()) as { fees?: Record<string, number>; error?: string };

      if (!response.ok || !body.fees) {
        setError(body.error || "Could not save COD fees");
        return;
      }

      setFees(body.fees);
      setSuccess("Cash-on-delivery fees updated.");
    } catch (err) {
      console.error("Save cash-on-delivery fees request failed", err);
      setError("Could not save COD fees. Please check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-4 border border-line bg-cream/40 p-5 sm:p-6">
        {Object.entries(fees).map(([sizeLabel, amount]) => (
          <label key={sizeLabel} className="block">
            <span className="font-sans text-[0.65rem] tracking-[0.2em] text-muted uppercase">
              {sizeLabel}
            </span>
            <div className="mt-2 flex border border-line bg-ivory focus-within:border-gold">
              <span className="flex items-center px-4 font-sans text-muted">Rs.</span>
              <input
                required
                type="number"
                min="0"
                step="1"
                value={amount}
                onChange={(event) =>
                  setFees((current) => ({
                    ...current,
                    [sizeLabel]: Number(event.target.value) || 0,
                  }))
                }
                className="min-w-0 flex-1 bg-transparent px-4 py-3 outline-none"
              />
            </div>
          </label>
        ))}
        {Object.keys(fees).length === 0 ? (
          <p className="font-sans text-sm text-muted">
            Add a product first to configure its size-based COD fee.
          </p>
        ) : null}
      </div>

      {error ? <p className="text-sm text-gold-deep">{error}</p> : null}
      {success ? <p className="text-sm text-ink-soft">{success}</p> : null}

      <button
        type="submit"
        disabled={pending || Object.keys(fees).length === 0}
        className="bg-ink px-8 py-3.5 font-sans text-[0.72rem] tracking-[0.24em] text-ivory uppercase transition-colors hover:bg-gold-deep disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save COD fees"}
      </button>
    </form>
  );
}
