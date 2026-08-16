"use client";

import Image from "next/image";
import { Heart, Star } from "lucide-react";
import { useStore } from "@/components/store-provider";
import { products, type Product } from "@/lib/data";

export function FeaturedProducts() {
  return (
    <section
      id="collection"
      className="bg-cream/60 px-4 py-14 sm:px-5 sm:py-20 md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-8 text-center sm:mb-12 md:mb-16">
          <p className="font-sans text-[0.65rem] tracking-[0.22em] text-gold-deep uppercase sm:text-[0.7rem] sm:tracking-[0.36em]">
            Selected works
          </p>
          <h2 className="mt-2 font-serif text-3xl sm:mt-3 sm:text-4xl md:text-5xl">
            Featured pieces
          </h2>
          <div className="ornament-line mx-auto mt-5 w-20 sm:mt-6 sm:w-28" />
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isWishlisted, setCartOpen } = useStore();
  const saved = isWishlisted(product.id);

  return (
    <article className="group flex min-w-0 flex-col">
      <div className="relative mb-3 overflow-hidden bg-parchment sm:mb-4">
        <div className="relative aspect-[4/5]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className={`absolute top-2 right-2 flex h-9 w-9 items-center justify-center bg-ivory/90 text-ink transition-colors hover:text-gold-deep sm:top-3 sm:right-3 sm:h-10 sm:w-10 ${
            saved ? "text-gold-deep" : ""
          }`}
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={16}
            strokeWidth={1.5}
            className={saved ? "fill-gold-deep" : ""}
          />
        </button>
        <button
          type="button"
          onClick={() => {
            addToCart(product);
            setCartOpen(true);
          }}
          className="absolute inset-x-2 bottom-2 hidden bg-ink py-2.5 font-sans text-[0.62rem] tracking-[0.16em] text-ivory uppercase transition-all duration-300 hover:bg-gold-deep sm:inset-x-4 sm:bottom-4 sm:block sm:translate-y-0 sm:py-3 sm:text-[0.68rem] sm:tracking-[0.26em] sm:opacity-100 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
        >
          Add to Cart
        </button>
      </div>
      <p className="truncate font-sans text-[0.58rem] tracking-[0.12em] text-gold-deep uppercase sm:text-[0.65rem] sm:tracking-[0.22em]">
        {product.category}
      </p>
      <h3 className="mt-1 font-serif text-[1.02rem] leading-snug text-ink sm:mt-1.5 sm:text-[1.35rem]">
        {product.name}
      </h3>
      <div className="mt-1.5 flex min-w-0 flex-wrap items-center gap-1 text-gold-deep sm:mt-2 sm:gap-1.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={11}
            className={
              index < Math.round(product.rating)
                ? "fill-gold-deep text-gold-deep"
                : "text-sand"
            }
          />
        ))}
        <span className="ml-0.5 font-sans text-[0.7rem] text-muted sm:text-xs">
          {product.rating}
          <span className="hidden sm:inline"> ({product.reviews})</span>
        </span>
      </div>
      <p className="mt-1.5 font-sans text-sm tracking-wide text-ink-soft sm:mt-2">
        ${product.price}
      </p>
      <button
        type="button"
        onClick={() => {
          addToCart(product);
          setCartOpen(true);
        }}
        className="mt-3 w-full bg-ink py-2.5 font-sans text-[0.62rem] tracking-[0.16em] text-ivory uppercase transition-colors hover:bg-gold-deep sm:hidden"
      >
        Add to Cart
      </button>
    </article>
  );
}
