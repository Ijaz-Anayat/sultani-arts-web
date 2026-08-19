import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Newsletter } from "@/components/home/newsletter";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { SITE_CONTACT } from "@/lib/constants";

export default function ContactPage() {
  return (
    <main className="flex-1">
      <section className="px-4 py-12 sm:px-5 sm:py-16 md:px-8">
        <div className="mx-auto max-w-[900px]">
          <RevealOnScroll>
            <p className="font-sans text-[0.65rem] tracking-[0.28em] text-gold-deep uppercase">
              Get in touch
            </p>
            <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Contact us</h1>
            <p className="mt-4 font-sans text-sm leading-7 text-muted">
              Visit our atelier in {SITE_CONTACT.location}, commission a piece, or
              message us on WhatsApp for a quick reply.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={80}>
            <ul className="mt-10 space-y-5 border border-line bg-cream/40 p-6 sm:p-8">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-gold-deep" />
                <div>
                  <p className="font-sans text-[0.62rem] tracking-[0.2em] text-muted uppercase">
                    Location
                  </p>
                  <p className="mt-1 font-serif text-xl">{SITE_CONTACT.locationLine}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-gold-deep" />
                <div>
                  <p className="font-sans text-[0.62rem] tracking-[0.2em] text-muted uppercase">
                    Phone / WhatsApp
                  </p>
                  <a
                    href={SITE_CONTACT.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block font-serif text-xl hover:text-gold-deep"
                  >
                    {SITE_CONTACT.phoneDisplay}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-gold-deep" />
                <div>
                  <p className="font-sans text-[0.62rem] tracking-[0.2em] text-muted uppercase">
                    Email
                  </p>
                  <a
                    href={`mailto:${SITE_CONTACT.email}`}
                    className="mt-1 inline-block break-all font-serif text-xl hover:text-gold-deep"
                  >
                    {SITE_CONTACT.email}
                  </a>
                </div>
              </li>
            </ul>
          </RevealOnScroll>

          <RevealOnScroll delay={120}>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={SITE_CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex bg-[#25D366] px-6 py-3 font-sans text-[0.68rem] tracking-[0.2em] text-white uppercase transition-colors hover:bg-[#20bd5a]"
              >
                Message on WhatsApp
              </a>
              <Link
                href="/shop"
                className="inline-flex border border-line bg-ivory px-6 py-3 font-sans text-[0.68rem] tracking-[0.2em] text-ink uppercase transition-colors hover:border-gold"
              >
                Browse shop
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>
      <Newsletter />
    </main>
  );
}
