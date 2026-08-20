import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { getCategories, getProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [categories, products] = await Promise.all([
    getCategories().catch(() => []),
    getProducts(category).catch(() => []),
  ]);

  const active = categories.find((item) => item.slug === category);

  return (
    <main className="flex-1 px-4 py-12 sm:px-5 sm:py-16 md:px-8">
      <div className="mx-auto max-w-[1400px]">
        <RevealOnScroll>
          <div>
            <p className="font-sans text-[0.65rem] tracking-[0.28em] text-gold-deep uppercase">
              The collection
            </p>
            <h1 className="mt-2 font-serif text-4xl sm:text-5xl">
              {active ? active.name : "Shop"}
            </h1>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href="/shop"
                className={`px-4 py-2 font-sans text-[0.65rem] tracking-[0.18em] uppercase ${
                  !category ? "bg-ink text-ivory" : "border border-line text-ink-soft"
                }`}
              >
                All
              </Link>
              {categories.map((item) => (
                <Link
                  key={item._id}
                  href={`/shop?category=${item.slug}`}
                  className={`px-4 py-2 font-sans text-[0.65rem] tracking-[0.18em] uppercase ${
                    category === item.slug
                      ? "bg-ink text-ivory"
                      : "border border-line text-ink-soft"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </RevealOnScroll>

        {products.length === 0 ? (
          <RevealOnScroll delay={80}>
            <p className="mt-16 font-serif text-xl text-muted">
              No pieces in this collection yet.
            </p>
          </RevealOnScroll>
        ) : (
          <div className="mt-12 grid grid-cols-2 items-stretch gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard key={product._id} product={product} revealDelay={index * 70} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
