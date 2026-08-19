import Image from "next/image";
import Link from "next/link";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { getCategories } from "@/lib/queries";
import type { CategoryDTO } from "@/lib/types";

export async function FeaturedCategories({ compact = false }: { compact?: boolean }) {
  let categories: CategoryDTO[] = [];
  try {
    categories = await getCategories();
  } catch {
    categories = [];
  }

  const featured = categories[0];
  const second = categories[1];
  const rest = categories.slice(2);

  const heights = compact
    ? {
        featured: "col-span-2 min-h-[180px] sm:min-h-[220px] md:col-span-7 md:min-h-[320px]",
        second: "col-span-2 min-h-[160px] sm:min-h-[200px] md:col-span-5 md:min-h-[320px]",
        rest: "col-span-1 min-h-[140px] sm:min-h-[170px] md:col-span-6 md:min-h-[180px] lg:col-span-3",
      }
    : {
        featured: "col-span-2 min-h-[200px] sm:min-h-[260px] md:col-span-7 md:min-h-[380px]",
        second: "col-span-2 min-h-[180px] sm:min-h-[220px] md:col-span-5 md:min-h-[380px]",
        rest: "col-span-1 min-h-[160px] sm:min-h-[190px] md:col-span-6 md:min-h-[200px] lg:col-span-3",
      };

  return (
    <section id="categories" className={`px-4 sm:px-5 md:px-8 ${compact ? "pb-14 pt-2 md:pb-20" : "py-14 md:py-28"}`}>
      <div className="mx-auto max-w-[1200px]">
        {!compact ? (
          <RevealOnScroll>
            <div className="mb-8 flex flex-col justify-between gap-3 sm:mb-12 md:mb-16 md:flex-row md:items-end md:gap-4">
              <div>
                <p className="font-sans text-[0.65rem] tracking-[0.22em] text-gold-deep uppercase sm:text-[0.7rem] sm:tracking-[0.36em]">
                  The Gallery
                </p>
                <h2 className="mt-2 font-serif text-3xl sm:mt-3 sm:text-4xl md:text-5xl">
                  Featured categories
                </h2>
              </div>
              <p className="max-w-md font-sans text-sm leading-7 text-muted md:text-right">
                From sacred verse to contemporary composition — each collection is
                curated for presence, not volume.
              </p>
            </div>
          </RevealOnScroll>
        ) : null}

        {categories.length === 0 ? (
          <p className="font-serif text-lg text-muted">
            Categories will appear here after the atelier catalogue is seeded.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-12 md:gap-5">
            {featured ? (
              <CategoryCard category={featured} className={heights.featured} delay={0} />
            ) : null}
            {second ? (
              <CategoryCard category={second} className={heights.second} delay={80} />
            ) : null}
            {rest.map((category, index) => (
              <CategoryCard
                key={category._id}
                category={category}
                className={heights.rest}
                delay={(index + 2) * 80}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CategoryCard({
  category,
  className,
  delay = 0,
}: {
  category: CategoryDTO;
  className?: string;
  delay?: number;
}) {
  return (
    <RevealOnScroll delay={delay} className={className}>
      <Link
        href={`/shop?category=${category.slug}`}
        className="group relative block h-full overflow-hidden bg-cream"
      >
      <Image
        src={category.image || "/images/hero.jpg"}
        alt={category.name}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 md:p-6">
        <p className="font-sans text-[0.58rem] tracking-[0.16em] text-gold-soft uppercase sm:text-[0.65rem] sm:tracking-[0.28em]">
          {category.productCount ?? 0} pieces
        </p>
        <h3 className="mt-1 font-serif text-[1.15rem] leading-snug text-ivory sm:text-2xl md:text-[1.7rem]">
          {category.name}
        </h3>
        <span className="mt-2 hidden font-sans text-[0.65rem] tracking-[0.22em] text-ivory/80 uppercase transition-colors group-hover:text-gold-soft sm:mt-3 sm:inline-block">
          Enter collection
        </span>
      </div>
      </Link>
    </RevealOnScroll>
  );
}
