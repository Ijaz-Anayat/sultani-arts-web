import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/logo";
import { navLinks } from "@/lib/data";
import { getCategories } from "@/lib/queries";

export async function Footer() {
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  try {
    categories = await getCategories();
  } catch {
    categories = [];
  }
  return (
    <footer id="contact" className="mt-8 border-t border-line bg-ink text-ivory">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-12 sm:gap-12 sm:px-5 sm:py-16 md:grid-cols-2 md:px-8 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Logo variant="light" />
          <p className="mt-6 max-w-xs font-serif text-lg leading-relaxed text-ivory/75">
            An atelier for calligraphy and artistic pieces that carry heritage
            into contemporary spaces.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center border border-ivory/15 text-ivory/80 transition-colors hover:border-gold-soft hover:text-gold-soft"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center border border-ivory/15 text-ivory/80 transition-colors hover:border-gold-soft hover:text-gold-soft"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                <path d="M14 8h2.5V4.8H14c-2.4 0-4 1.5-4 4.2V11H7.5v3.3H10V22h3.4v-7.7h2.8l.5-3.3H13.4V9.4c0-.9.3-1.4 1.6-1.4Z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Pinterest"
              className="flex h-10 w-10 items-center justify-center border border-ivory/15 text-ivory/80 transition-colors hover:border-gold-soft hover:text-gold-soft"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                <path d="M12 2C6.5 2 2 6.3 2 11.6c0 4 2.5 7.4 6.1 8.7-.1-.7-.2-1.9 0-2.7.2-.7 1.4-6 1.4-6s-.4-.7-.4-1.8c0-1.7 1-2.9 2.2-2.9 1 0 1.5.8 1.5 1.7 0 1-.7 2.6-1 4-.3 1.2.6 2.2 1.8 2.2 2.1 0 3.6-2.7 3.6-5.9 0-2.4-1.6-4.2-4.6-4.2-3.3 0-5.4 2.5-5.4 5.2 0 1 .3 2 1 2.6.1.1.1.2.1.4l-.4 1.5c-.1.3-.2.4-.5.2-1.9-.8-2.8-3-2.8-5.4 0-4 3.4-8.7 10-8.7 5.3 0 8.8 3.8 8.8 8 0 5.4-3 9.5-7.5 9.5-1.5 0-2.9-.8-3.4-1.7l-.9 3.5c-.3 1.2-1.2 2.7-1.8 3.6 1.4.4 2.8.6 4.3.6 5.5 0 10-4.5 10-10S17.5 2 12 2Z" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-sans text-[0.7rem] tracking-[0.28em] text-gold-soft uppercase">
            Quick links
          </h3>
          <ul className="mt-5 space-y-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="font-serif text-lg text-ivory/80 transition-colors hover:text-gold-soft"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-[0.7rem] tracking-[0.28em] text-gold-soft uppercase">
            Shop categories
          </h3>
          <ul className="mt-5 space-y-3">
            {categories.map((category) => (
              <li key={category._id}>
                <a
                  href={`/shop?category=${category.slug}`}
                  className="font-serif text-lg text-ivory/80 transition-colors hover:text-gold-soft"
                >
                  {category.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-[0.7rem] tracking-[0.28em] text-gold-soft uppercase">
            Contact
          </h3>
          <ul className="mt-5 space-y-4 text-ivory/80">
            <li className="flex items-start gap-3">
              <MapPin size={16} className="mt-1 shrink-0 text-gold-soft" />
              <span className="font-serif text-lg leading-snug">
                Atelier 14, Calligraphers&apos; Quarter
                <br />
                Lahore, Pakistan
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-gold-soft" />
              <a href="tel:+923001234567" className="font-serif text-lg hover:text-gold-soft">
                +92 300 123 4567
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-gold-soft" />
              <a
                href="mailto:studio@sultaniarts.com"
                className="break-all font-serif text-lg hover:text-gold-soft"
              >
                studio@sultaniarts.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-2 px-4 py-5 text-center sm:gap-3 md:flex-row md:px-8 md:text-left">
          <p className="font-sans text-[0.62rem] tracking-[0.12em] text-ivory/50 uppercase sm:text-[0.68rem] sm:tracking-[0.18em]">
            © {new Date().getFullYear()} Sultani Arts. All rights reserved.
          </p>
          <p className="font-sans text-[0.62rem] tracking-[0.12em] text-ivory/50 uppercase sm:text-[0.68rem] sm:tracking-[0.18em]">
            Art · Calligraphy · Culture
          </p>
        </div>
      </div>
    </footer>
  );
}
