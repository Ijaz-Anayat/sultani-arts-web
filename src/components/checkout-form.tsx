"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/components/store-provider";
import { formatPrice } from "@/lib/pricing";

export function CheckoutForm() {
  const { cart, clearCart } = useStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setPending(true);

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: { name, phone, address, city },
        items: cart.map((item) => ({
          productId: item.productId,
          size: item.size,
          quantity: item.quantity,
        })),
      }),
    });

    const body = (await response.json()) as { _id?: string; error?: string };
    setPending(false);

    if (!response.ok || !body._id) {
      setError(body.error || "Could not place the order");
      return;
    }

    clearCart();
    setOrderId(body._id);
  }

  if (orderId) {
    return (
      <div className="border border-line bg-cream/50 px-6 py-16 text-center">
        <p className="font-sans text-[0.65rem] tracking-[0.28em] text-gold-deep uppercase">
          Confirmed
        </p>
        <h1 className="mt-3 font-serif text-4xl">Thank you</h1>
        <p className="mx-auto mt-4 max-w-md font-serif text-lg text-muted">
          Your order has been received. We will contact you shortly to confirm
          shipping.
        </p>
        <p className="mt-4 font-sans text-xs tracking-[0.16em] text-muted uppercase">
          Reference {orderId}
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-block bg-ink px-6 py-3 font-sans text-[0.68rem] tracking-[0.2em] text-ivory uppercase"
        >
          Continue browsing
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="text-center">
        <h1 className="font-serif text-4xl">Your cart is empty</h1>
        <Link
          href="/shop"
          className="mt-6 inline-block font-sans text-[0.7rem] tracking-[0.2em] text-gold-deep uppercase"
        >
          Browse the collection
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
      <form onSubmit={onSubmit} className="space-y-4">
        <h1 className="font-serif text-4xl">Checkout</h1>
        <p className="font-serif text-muted">
          Guest order — no account needed. We only need where to send the work.
        </p>
        <input
          required
          placeholder="Full name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full border border-line bg-ivory px-4 py-3 outline-none focus:border-gold"
        />
        <input
          required
          placeholder="Phone"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="w-full border border-line bg-ivory px-4 py-3 outline-none focus:border-gold"
        />
        <input
          required
          placeholder="Address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          className="w-full border border-line bg-ivory px-4 py-3 outline-none focus:border-gold"
        />
        <input
          required
          placeholder="City"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          className="w-full border border-line bg-ivory px-4 py-3 outline-none focus:border-gold"
        />
        {error ? <p className="text-sm text-gold-deep">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="w-full bg-ink py-3.5 font-sans text-[0.72rem] tracking-[0.24em] text-ivory uppercase hover:bg-gold-deep disabled:opacity-60"
        >
          {pending ? "Placing order…" : `Place order · ${formatPrice(total)}`}
        </button>
      </form>

      <aside className="border border-line bg-cream/40 p-6">
        <h2 className="font-serif text-2xl">Summary</h2>
        <ul className="mt-5 space-y-4">
          {cart.map((item) => (
            <li key={`${item.productId}-${item.size}`} className="flex gap-3">
              <div className="relative h-16 w-12 overflow-hidden bg-parchment">
                <Image src={item.image} alt="" fill className="object-cover" sizes="48px" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-serif">{item.title}</p>
                <p className="text-xs text-muted">
                  {item.size} × {item.quantity}
                </p>
              </div>
              <div className="text-right text-sm">
                <p>{formatPrice(item.price * item.quantity)}</p>
                {item.originalPrice && item.originalPrice > item.price ? (
                  <p className="text-xs text-muted line-through">
                    {formatPrice(item.originalPrice * item.quantity)}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-between border-t border-line pt-4 font-sans text-sm uppercase tracking-wide">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </aside>
    </div>
  );
}
