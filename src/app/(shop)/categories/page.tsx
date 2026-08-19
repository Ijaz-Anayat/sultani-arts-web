import { FeaturedCategories } from "@/components/home/featured-categories";
import { RevealOnScroll } from "@/components/reveal-on-scroll";

export default function CategoriesPage() {
  return (
    <main className="flex-1">
      <section className="px-4 pt-12 pb-4 sm:px-5 md:px-8">
        <RevealOnScroll>
          <div className="mx-auto max-w-[1200px]">
            <p className="font-sans text-[0.65rem] tracking-[0.28em] text-gold-deep uppercase">
              Collections
            </p>
            <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Categories</h1>
            <p className="mt-4 max-w-2xl font-sans text-sm leading-7 text-muted">
              Browse calligraphy, canvas, and oil painting collections curated for
              contemporary spaces.
            </p>
          </div>
        </RevealOnScroll>
      </section>
      <FeaturedCategories compact />
    </main>
  );
}
