"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Package, Shapes, ShoppingBag, LogOut } from "lucide-react";
import { Logo } from "@/components/logo";
import type { ReactNode } from "react";

const links = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Shapes },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
];

export function AdminShell({
  children,
  email,
}: {
  children: ReactNode;
  email?: string | null;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-full bg-ivory">
      <aside className="hidden w-64 shrink-0 border-r border-line bg-cream/50 md:flex md:flex-col">
        <div className="border-b border-line px-5 py-5">
          <Logo />
          <p className="mt-3 font-sans text-[0.62rem] tracking-[0.22em] text-muted uppercase">
            Atelier admin
          </p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 font-sans text-[0.72rem] tracking-[0.16em] uppercase transition-colors ${
                  active
                    ? "bg-ink text-ivory"
                    : "text-ink-soft hover:bg-parchment hover:text-gold-deep"
                }`}
              >
                <Icon size={16} strokeWidth={1.5} />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-line p-4">
          <p className="truncate font-sans text-xs text-muted">{email}</p>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="mt-3 flex items-center gap-2 font-sans text-[0.68rem] tracking-[0.18em] text-gold-deep uppercase hover:underline"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-line bg-ivory px-4 py-3 md:hidden">
          <Logo />
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="font-sans text-[0.65rem] tracking-[0.18em] text-gold-deep uppercase"
          >
            Logout
          </button>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-line px-3 py-2 md:hidden">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`shrink-0 px-3 py-2 font-sans text-[0.62rem] tracking-[0.16em] uppercase ${
                  active ? "bg-ink text-ivory" : "text-muted"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <main className="flex-1 px-4 py-6 sm:px-6 md:px-10 md:py-10">{children}</main>
      </div>
    </div>
  );
}
