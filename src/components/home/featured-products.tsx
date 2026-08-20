import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { getProducts } from "@/lib/queries";
import type { ProductDTO } from "@/lib/types";

type Props = {
  limit?: number;
  compact?: boolean;
};

export async function FeaturedProducts({ limit = 8, compact = false }: Props) {
  let products: ProductDTO[] = [];
  try {
    products = (await getProducts()).slice(0, limit);
  } catch {
    products = [];
  }

  return (
    <section
      id="collection"
      className={`bg-cream/60 px-4 sm:px-5 md:px-8 ${compact ? "py-12 md:py-16" : "py-14 md:py-28"}`}
    >
      <div className="mx-auto max-w-[1200px]">
        <RevealOnScroll>
          <div className={`mb-8 text-center ${compact ? "sm:mb-8" : "sm:mb-12 md:mb-16"}`}>
            <p className="font-sans text-[0.65rem] tracking-[0.22em] text-gold-deep uppercase sm:text-[0.7rem] sm:tracking-[0.36em]">
              Selected works
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:mt-3 sm:text-4xl md:text-5xl">
              Featured pieces
            </h2>
            <div className="ornament-line mx-auto mt-5 w-20 sm:mt-6 sm:w-28" />
          </div>
        </RevealOnScroll>

        {products.length === 0 ? (
          <p className="text-center font-serif text-lg text-muted">
            New works will appear here once they are added to the atelier.
          </p>
        ) : (
          <div
            className={`grid grid-cols-2 items-stretch gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-8 ${
              compact ? "lg:grid-cols-4" : "lg:grid-cols-4"
            }`}
          >
            {products.map((product, index) => (
              <ProductCard
                key={product._id}
                product={product}
                revealDelay={index * 70}
                compact={compact}
              />
            ))}
          </div>
        )}

        {compact ? (
          <RevealOnScroll delay={120}>
            <div className="mt-10 text-center">
              <Link
                href="/shop"
                className="inline-flex border border-line bg-ivory px-6 py-3 font-sans text-[0.68rem] tracking-[0.2em] text-ink uppercase transition-colors hover:border-gold"
              >
                View all pieces
              </Link>
            </div>
          </RevealOnScroll>
        ) : null}
      </div>
    </section>
  );
}
