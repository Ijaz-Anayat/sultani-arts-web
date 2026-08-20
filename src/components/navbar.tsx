"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Logo } from "@/components/logo";
import { useStore } from "@/components/store-provider";
import { isAdminSession } from "@/lib/auth-utils";
import { formatPrice } from "@/lib/pricing";
import { navLinks } from "@/lib/data";

export function Navbar() {
  const { cart, cartCount, cartOpen, setCartOpen, removeFromCart } = useStore();
  const { data: session, status } = useSession();
  const isAdmin = status === "authenticated" && isAdminSession(session);
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
        <p className="mx-auto max-w-[1400px] px-4 py-2 text-center font-sans text-[0.62rem] tracking-[0.18em] uppercase sm:px-6 sm:text-[0.68rem] sm:tracking-[0.28em]">
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
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-5 sm:py-4 md:px-8">
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

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center text-ink-soft transition-colors hover:text-gold-deep"
              aria-label="Search"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>
            <Link
              href="/admin/login"
              className="hidden h-10 w-10 items-center justify-center text-ink-soft transition-colors hover:text-gold-deep sm:flex"
              aria-label="Studio login"
            >
              <User size={18} strokeWidth={1.5} />
            </Link>
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
            className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-4 sm:px-5 md:px-8"
            onSubmit={(event) => {
              event.preventDefault();
              setSearchOpen(false);
            }}
          >
            <Search size={16} className="shrink-0 text-muted" strokeWidth={1.5} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search the collection…"
              className="w-full min-w-0 bg-transparent font-serif text-base text-ink outline-none placeholder:text-muted/70 sm:text-lg"
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
        className={`fixed top-0 right-0 z-[70] flex h-full w-[min(100vw,380px)] flex-col bg-ivory px-6 py-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl transition-transform duration-500 ease-out lg:hidden sm:px-7 ${
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
              className="font-serif text-2xl text-ink transition-colors hover:text-gold-deep sm:text-3xl"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        {isAdmin ? (
          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/admin/dashboard"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 font-sans text-[0.75rem] tracking-[0.22em] text-muted uppercase"
            >
              <User size={16} strokeWidth={1.5} />
              Dashboard
            </Link>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-3 font-sans text-[0.75rem] tracking-[0.22em] text-gold-deep uppercase"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            href="/admin/login"
            onClick={() => setMenuOpen(false)}
            className="mt-8 flex items-center gap-3 font-sans text-[0.75rem] tracking-[0.22em] text-muted uppercase"
          >
            <User size={16} strokeWidth={1.5} />
            Studio login
          </Link>
        )}
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
        className={`fixed top-0 right-0 z-[70] flex h-full w-[min(100vw,420px)] flex-col bg-ivory pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] shadow-2xl transition-transform duration-500 ${
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
                <li key={`${item.productId}-${item.size}`} className="flex gap-4">
                  <div className="relative h-20 w-16 overflow-hidden bg-cream">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-serif text-[1.05rem] leading-snug">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {item.size} · Qty {item.quantity} ·{" "}
                      {item.originalPrice && item.originalPrice > item.price ? (
                        <>
                          {formatPrice(item.price)}{" "}
                          <span className="line-through">{formatPrice(item.originalPrice)}</span>
                        </>
                      ) : (
                        formatPrice(item.price)
                      )}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.productId, item.size)}
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
              <span>{formatPrice(total)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setCartOpen(false)}
              className="block w-full bg-ink py-3.5 text-center font-sans text-xs tracking-[0.28em] text-ivory uppercase transition-colors hover:bg-gold-deep"
            >
              Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
