"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  initialGlobalDiscountPercent: number;
};

export function DiscountManager({ initialGlobalDiscountPercent }: Props) {
  const router = useRouter();
  const [globalDiscountPercent, setGlobalDiscountPercent] = useState(
    initialGlobalDiscountPercent,
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setPending(true);

    const response = await fetch("/api/settings/discount", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ globalDiscountPercent }),
    });

    const body = (await response.json()) as {
      globalDiscountPercent?: number;
      error?: string;
    };

    setPending(false);

    if (!response.ok) {
      setError(body.error || "Could not save discount");
      return;
    }

    setGlobalDiscountPercent(body.globalDiscountPercent ?? globalDiscountPercent);
    setSuccess("Store-wide discount updated. Customers will see new prices on the shop.");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-xl space-y-6">
      <div className="border border-line bg-cream/40 p-6">
        <p className="font-sans text-sm leading-7 text-ink-soft">
          Set a discount that applies to every product on the shop. Per-product discounts on the
          product form are added on top of this store-wide rate (maximum 100% total).
        </p>
      </div>

      <label className="block">
        <span className="font-sans text-[0.65rem] tracking-[0.2em] text-muted uppercase">
          Store-wide discount (%)
        </span>
        <div className="mt-2 flex border border-line bg-ivory focus-within:border-gold">
          <input
            required
            type="number"
            min="0"
            max="100"
            step="1"
            value={globalDiscountPercent}
            onChange={(event) => setGlobalDiscountPercent(Number(event.target.value) || 0)}
            className="min-w-0 flex-1 bg-transparent px-4 py-3 outline-none"
          />
          <span className="flex items-center px-4 font-sans text-muted">%</span>
        </div>
        <p className="mt-2 font-sans text-sm text-muted">
          Use 0 to turn off the store-wide discount.
        </p>
      </label>

      {error ? <p className="text-sm text-gold-deep">{error}</p> : null}
      {success ? <p className="text-sm text-ink-soft">{success}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="bg-ink px-8 py-3.5 font-sans text-[0.72rem] tracking-[0.24em] text-ivory uppercase transition-colors hover:bg-gold-deep disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save discount"}
      </button>
    </form>
  );
}
