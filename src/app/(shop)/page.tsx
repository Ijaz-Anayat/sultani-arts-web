import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/home/hero";
import { FeaturedProducts } from "@/components/home/featured-products";
import { JsonLd } from "@/components/json-ld";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { SITE_CONTACT } from "@/lib/constants";
import { SITE_DESCRIPTION, SITE_NAME, absoluteUrl, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Handmade Islamic Calligraphy",
  description: SITE_DESCRIPTION,
  path: "/",
});

export default function Home() {
  return (
    <main className="flex-1">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE_NAME,
          url: absoluteUrl("/"),
          email: SITE_CONTACT.email,
          telephone: SITE_CONTACT.phone,
          address: {
            "@type": "PostalAddress",
            addressLocality: SITE_CONTACT.location,
            addressCountry: "PK",
          },
          sameAs: [SITE_CONTACT.instagram, SITE_CONTACT.facebook],
        }}
      />
      <Hero />
      <FeaturedProducts limit={4} compact />
      <section className="px-4 py-14 sm:px-5 sm:py-20 md:px-8">
        <div className="mx-auto grid max-w-[1100px] gap-4 sm:grid-cols-3">
          <RevealOnScroll>
            <Link
              href="/categories"
              className="block border border-line bg-cream/50 px-6 py-8 transition-colors hover:border-gold"
            >
              <p className="font-sans text-[0.62rem] tracking-[0.22em] text-gold-deep uppercase">
                Explore
              </p>
              <h2 className="mt-2 font-serif text-2xl">Categories</h2>
            </Link>
          </RevealOnScroll>
          <RevealOnScroll delay={80}>
            <Link
              href="/about"
              className="block border border-line bg-cream/50 px-6 py-8 transition-colors hover:border-gold"
            >
              <p className="font-sans text-[0.62rem] tracking-[0.22em] text-gold-deep uppercase">
                Discover
              </p>
              <h2 className="mt-2 font-serif text-2xl">Our story</h2>
            </Link>
          </RevealOnScroll>
          <RevealOnScroll delay={160}>
            <Link
              href="/contact"
              className="block border border-line bg-cream/50 px-6 py-8 transition-colors hover:border-gold"
            >
              <p className="font-sans text-[0.62rem] tracking-[0.22em] text-gold-deep uppercase">
                Connect
              </p>
              <h2 className="mt-2 font-serif text-2xl">Contact</h2>
            </Link>
          </RevealOnScroll>
        </div>
      </section>
    </main>
  );
}
