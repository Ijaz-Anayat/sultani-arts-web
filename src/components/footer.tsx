import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/logo";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { SITE_CONTACT } from "@/lib/constants";
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
        <RevealOnScroll>
          <div className="lg:col-span-1">
            <Logo variant="light" />
            <p className="mt-6 max-w-xs font-serif text-lg leading-relaxed text-ivory/75">
              An atelier for calligraphy and artistic pieces that carry heritage
              into contemporary spaces.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={SITE_CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer"
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
                href={SITE_CONTACT.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center border border-ivory/15 text-ivory/80 transition-colors hover:border-gold-soft hover:text-gold-soft"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                  <path d="M14 8h2.5V4.8H14c-2.4 0-4 1.5-4 4.2V11H7.5v3.3H10V22h3.4v-7.7h2.8l.5-3.3H13.4V9.4c0-.9.3-1.4 1.6-1.4Z" />
                </svg>
              </a>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={80}>
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
        </RevealOnScroll>

        <RevealOnScroll delay={120}>
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
        </RevealOnScroll>

        <RevealOnScroll delay={160}>
          <div>
            <h3 className="font-sans text-[0.7rem] tracking-[0.28em] text-gold-soft uppercase">
              Contact
            </h3>
            <ul className="mt-5 space-y-4 text-ivory/80">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-1 shrink-0 text-gold-soft" />
                <span className="font-serif text-lg leading-snug">
                  {SITE_CONTACT.locationLine}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-gold-soft" />
                <a
                  href={SITE_CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-serif text-lg hover:text-gold-soft"
                >
                  {SITE_CONTACT.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-gold-soft" />
                <a
                  href={`mailto:${SITE_CONTACT.email}`}
                  className="break-all font-serif text-lg hover:text-gold-soft"
                >
                  {SITE_CONTACT.email}
                </a>
              </li>
            </ul>
          </div>
        </RevealOnScroll>
      </div>

      <RevealOnScroll direction="fade">
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
      </RevealOnScroll>
    </footer>
  );
}
