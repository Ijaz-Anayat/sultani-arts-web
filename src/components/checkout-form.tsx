"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/components/store-provider";
import { getCashOnDeliveryFeeForOrder, formatPrice } from "@/lib/pricing";
import { createOrderWhatsAppUrl } from "@/lib/order-whatsapp";
import type { CashOnDeliveryFees } from "@/lib/types";

export function CheckoutForm({ cashOnDeliveryFees }: { cashOnDeliveryFees: CashOnDeliveryFees }) {
  const { cart, clearCart } = useStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [cashOnDelivery, setCashOnDelivery] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [whatsAppUrl, setWhatsAppUrl] = useState<string | null>(null);
  const [whatsAppUnavailable, setWhatsAppUnavailable] = useState(false);
  const [customerEmailSent, setCustomerEmailSent] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const codFee = getCashOnDeliveryFeeForOrder(
    cart.map((item) => item.size),
    cashOnDeliveryFees,
  );
  const total = subtotal + (cashOnDelivery ? codFee : 0);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setPending(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name, email, phone, address, city },
          items: cart.map((item) => ({
            productId: item.productId,
            size: item.size,
            quantity: item.quantity,
            frameId: item.frameId,
          })),
          cashOnDelivery,
        }),
      });

      const body = (await response.json()) as {
        _id?: string;
        totalAmount?: number;
        cashOnDeliveryFee?: number;
        customerEmailSent?: boolean;
        error?: string;
      };

      if (!response.ok || !body._id) {
        setError(body.error || "Could not place the order");
        return;
      }

      const confirmationUrl =
        typeof body.totalAmount === "number"
          ? createOrderWhatsAppUrl(phone, {
              customerName: name,
              orderId: body._id,
              items: cart,
              totalAmount: body.totalAmount,
              cashOnDelivery,
              cashOnDeliveryFee: body.cashOnDeliveryFee ?? 0,
            })
          : null;

      clearCart();
      setWhatsAppUrl(confirmationUrl);
      setWhatsAppUnavailable(!confirmationUrl);
      setCustomerEmailSent(body.customerEmailSent === true);
      setOrderId(body._id);
    } catch (requestError) {
      console.error("Place order request failed", requestError);
      setError("Could not place the order. Please check your connection and try again.");
    } finally {
      setPending(false);
    }
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
        <p className="mx-auto mt-3 max-w-md font-sans text-sm leading-6 text-muted" role="status">
          {customerEmailSent
            ? `A confirmation email has been sent to ${email}.`
            : `Your order is confirmed, but we could not send a confirmation email to ${email}. Please check the address or contact us if you need help.`}
        </p>
        <p className="mt-4 font-sans text-xs tracking-[0.16em] text-muted uppercase">
          Reference {orderId}
        </p>
        {whatsAppUrl ? (
          <div className="mx-auto mt-8 max-w-md">
            <p className="font-sans text-sm leading-6 text-muted">
              Share your order details with Sultani Arts on WhatsApp so our team can confirm it.
            </p>
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block bg-[#25D366] px-6 py-3 font-sans text-[0.68rem] tracking-[0.12em] text-white uppercase transition-colors hover:bg-[#20bd5a]"
            >
              Send order details to Sultani Arts
            </a>
            <p className="mt-2 font-sans text-xs text-muted">
              WhatsApp will open with a message ready. Tap Send to share it with our team.
            </p>
          </div>
        ) : null}
        {whatsAppUnavailable ? (
          <p className="mx-auto mt-6 max-w-md font-sans text-sm text-muted">
            We could not prepare the WhatsApp message because the phone number format is not
            supported. Your order is confirmed; our team will contact you using the details
            provided.
          </p>
        ) : null}
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
    <div className="mx-auto grid w-full min-w-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
      <form onSubmit={onSubmit} className="min-w-0 space-y-4">
        <h1 className="font-serif text-4xl">Checkout</h1>
        <p className="font-serif text-muted">
          Guest order — no account needed. We only need where to send the work.
        </p>
        <input
          required
          placeholder="Full name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="min-h-12 w-full min-w-0 border border-line bg-ivory px-4 py-3 outline-none focus:border-gold"
        />
        <input
          required
          type="email"
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="min-h-12 w-full min-w-0 border border-line bg-ivory px-4 py-3 outline-none focus:border-gold"
        />
        <input
          required
          autoComplete="tel"
          placeholder="Phone"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="min-h-12 w-full min-w-0 border border-line bg-ivory px-4 py-3 outline-none focus:border-gold"
        />
        <input
          required
          placeholder="Address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          className="min-h-12 w-full min-w-0 border border-line bg-ivory px-4 py-3 outline-none focus:border-gold"
        />
        <input
          required
          placeholder="City"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          className="min-h-12 w-full min-w-0 border border-line bg-ivory px-4 py-3 outline-none focus:border-gold"
        />
        <label className="flex cursor-pointer items-start gap-3 border border-line bg-cream/40 p-4">
          <input
            type="checkbox"
            checked={cashOnDelivery}
            onChange={(event) => setCashOnDelivery(event.target.checked)}
            className="mt-1 h-4 w-4 accent-ink"
          />
          <span>
            <span className="block font-sans text-sm text-ink">Cash on delivery</span>
            <span className="mt-1 block font-sans text-xs text-muted">
              Add {formatPrice(codFee)} cash-on-delivery fee
            </span>
          </span>
        </label>
        {error ? <p className="text-sm text-gold-deep">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="flex min-h-12 w-full flex-wrap items-center justify-center gap-x-2 bg-ink px-3 py-3 font-sans text-[0.68rem] tracking-[0.12em] text-ivory uppercase hover:bg-gold-deep disabled:opacity-60 sm:text-[0.72rem] sm:tracking-[0.2em]"
        >
          <span>{pending ? "Placing order…" : "Place order"}</span>
          <span className="whitespace-nowrap tracking-normal">{formatPrice(total)}</span>
        </button>
      </form>

      <aside className="min-w-0 border border-line bg-cream/40 p-4 sm:p-6">
        <h2 className="font-serif text-2xl">Summary</h2>
        <ul className="mt-5 space-y-4">
          {cart.map((item) => (
            <li
              key={`${item.productId}-${item.size}-${item.frameId ?? "none"}`}
              className="grid min-w-0 grid-cols-[48px_minmax(0,1fr)_auto] items-center gap-2 sm:gap-3"
            >
              <div className="relative h-16 w-12 overflow-hidden bg-parchment">
                <Image src={item.image} alt="" fill className="object-cover" sizes="48px" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-serif">{item.title}</p>
                <p className="text-xs text-muted">
                  {item.size}
                  {item.frameColor ? ` · ${item.frameColor} frame` : ""} × {item.quantity}
                </p>
              </div>
              <div className="min-w-0 text-right text-xs sm:text-sm">
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
        <div className="mt-6 space-y-3 border-t border-line pt-4 font-sans text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {cashOnDelivery ? (
            <div className="flex justify-between">
              <span className="text-muted">Cash on delivery</span>
              <span>{formatPrice(codFee)}</span>
            </div>
          ) : null}
          <div className="flex justify-between border-t border-line pt-3 font-sans uppercase tracking-wide">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
