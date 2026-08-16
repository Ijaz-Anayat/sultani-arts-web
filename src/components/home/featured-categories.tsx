import Image from "next/image";
import { categories } from "@/lib/data";

export function FeaturedCategories() {
  const [featured, second, ...rest] = categories;

  return (
    <section id="categories" className="px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-12 flex flex-col justify-between gap-4 md:mb-16 md:flex-row md:items-end">
          <div>
            <p className="font-sans text-[0.7rem] tracking-[0.36em] text-gold-deep uppercase">
              The Gallery
            </p>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">
              Featured categories
            </h2>
          </div>
          <p className="max-w-md font-sans text-sm leading-7 text-muted md:text-right">
            From sacred verse to contemporary composition — each collection is
            curated for presence, not volume.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-12 md:gap-5">
          <CategoryCard
            category={featured}
            className="min-h-[360px] md:col-span-7 md:min-h-[480px]"
          />
          <CategoryCard
            category={second}
            className="min-h-[280px] md:col-span-5 md:min-h-[480px]"
          />
          {rest.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              className="min-h-[240px] md:col-span-6 lg:col-span-3"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({
  category,
  className,
}: {
  category: (typeof categories)[number];
  className?: string;
}) {
  return (
    <a
      href="#collection"
      className={`group relative block overflow-hidden bg-cream ${className ?? ""}`}
    >
      <Image
        src={category.image}
        alt={category.name}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="font-sans text-[0.65rem] tracking-[0.28em] text-gold-soft uppercase">
          {category.pieces} pieces
        </p>
        <h3 className="mt-1 font-serif text-2xl text-ivory md:text-[1.7rem]">
          {category.name}
        </h3>
        <span className="mt-3 inline-block font-sans text-[0.65rem] tracking-[0.22em] text-ivory/80 uppercase transition-colors group-hover:text-gold-soft">
          Enter collection
        </span>
      </div>
    </a>
  );
}
