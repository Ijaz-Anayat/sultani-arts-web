"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { useStore } from "@/components/store-provider";
import { navLinks } from "@/lib/data";

export function Navbar() {
  const { cart, cartCount, cartOpen, setCartOpen, removeFromCart } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || cartOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, cartOpen]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <div className="hidden border-b border-line bg-ink text-ivory md:block">
        <p className="mx-auto max-w-[1400px] px-6 py-2 text-center font-sans text-[0.68rem] tracking-[0.28em] uppercase">
          Complimentary framing consult · Worldwide insured shipping
        </p>
      </div>

      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "border-line bg-ivory/95 shadow-[0_8px_30px_-24px_rgba(28,24,20,0.45)] backdrop-blur-md"
            : "border-transparent bg-ivory"
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-5 py-4 md:px-8">
          <Logo />

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative font-sans text-[0.78rem] font-medium tracking-[0.22em] text-ink-soft uppercase transition-colors hover:text-gold-deep after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center text-ink-soft transition-colors hover:text-gold-deep"
              aria-label="Search"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              className="hidden h-10 w-10 items-center justify-center text-ink-soft transition-colors hover:text-gold-deep sm:flex"
              aria-label="Account"
            >
              <User size={18} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative flex h-10 w-10 items-center justify-center text-ink-soft transition-colors hover:text-gold-deep"
              aria-label="Cart"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center bg-gold px-1 text-[0.58rem] text-ivory">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center text-ink-soft lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div
          className={`overflow-hidden border-t border-line bg-cream/80 transition-all duration-300 ${
            searchOpen ? "max-h-28 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <form
            className="mx-auto flex max-w-[1400px] items-center gap-3 px-5 py-4 md:px-8"
            onSubmit={(event) => {
              event.preventDefault();
              setSearchOpen(false);
            }}
          >
            <Search size={16} className="text-muted" strokeWidth={1.5} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search calligraphy, prints, commissions…"
              className="w-full bg-transparent font-serif text-lg text-ink outline-none placeholder:text-muted/70"
            />
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="text-muted hover:text-ink"
              aria-label="Close search"
            >
              <X size={16} />
            </button>
          </form>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[60] bg-ink/40 transition-opacity duration-300 lg:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMenuOpen(false)}
      />
      <aside
        className={`fixed top-0 right-0 z-[70] flex h-full w-[min(88vw,380px)] flex-col bg-ivory px-7 py-6 shadow-2xl transition-transform duration-500 ease-out lg:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Logo />
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="flex h-10 w-10 items-center justify-center"
            aria-label="Close menu"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>
        <nav className="mt-10 flex flex-col gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-serif text-3xl text-ink transition-colors hover:text-gold-deep"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="mt-8 flex items-center gap-3 font-sans text-[0.75rem] tracking-[0.22em] text-muted uppercase"
        >
          <User size={16} strokeWidth={1.5} />
          Account
        </button>
        <p className="mt-auto border-t border-line pt-6 font-sans text-xs tracking-[0.2em] text-muted uppercase">
          Atelier of written art
        </p>
      </aside>

      <div
        className={`fixed inset-0 z-[60] bg-ink/40 transition-opacity duration-300 ${
          cartOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setCartOpen(false)}
      />
      <aside
        className={`fixed top-0 right-0 z-[70] flex h-full w-[min(92vw,420px)] flex-col bg-ivory shadow-2xl transition-transform duration-500 ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-serif text-2xl">Your collection</h2>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            aria-label="Close cart"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {cart.length === 0 ? (
            <p className="font-serif text-lg text-muted">
              Your cart is waiting for a first piece.
            </p>
          ) : (
            <ul className="space-y-5">
              {cart.map((item) => (
                <li key={item.id} className="flex gap-4">
                  <div className="relative h-20 w-16 overflow-hidden bg-cream">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-serif text-[1.05rem] leading-snug">
                      {item.name}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      Qty {item.quantity} · ${item.price}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="mt-1 text-xs tracking-wide text-gold-deep uppercase hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {cart.length > 0 && (
          <div className="border-t border-line px-6 py-5">
            <div className="mb-4 flex justify-between font-sans text-sm tracking-wide uppercase">
              <span>Subtotal</span>
              <span>${total.toFixed(0)}</span>
            </div>
            <button
              type="button"
              className="w-full bg-ink py-3.5 font-sans text-xs tracking-[0.28em] text-ivory uppercase transition-colors hover:bg-gold-deep"
            >
              Checkout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
