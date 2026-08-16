"use client";

import Image from "next/image";
import { Heart, Star } from "lucide-react";
import { useStore } from "@/components/store-provider";
import { products, type Product } from "@/lib/data";

export function FeaturedProducts() {
  return (
    <section id="collection" className="bg-cream/60 px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-12 text-center md:mb-16">
          <p className="font-sans text-[0.7rem] tracking-[0.36em] text-gold-deep uppercase">
            Selected works
          </p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Featured pieces
          </h2>
          <div className="ornament-line mx-auto mt-6 w-28" />
        </div>

        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
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
    <article className="group">
      <div className="relative mb-4 overflow-hidden bg-parchment">
        <div className="relative aspect-[4/5]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className={`absolute top-3 right-3 flex h-10 w-10 items-center justify-center bg-ivory/90 text-ink transition-colors hover:text-gold-deep ${
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
          className="absolute inset-x-4 bottom-4 translate-y-3 bg-ink py-3 font-sans text-[0.68rem] tracking-[0.26em] text-ivory uppercase opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 max-md:translate-y-0 max-md:opacity-100 hover:bg-gold-deep"
        >
          Add to Cart
        </button>
      </div>
      <p className="font-sans text-[0.65rem] tracking-[0.22em] text-gold-deep uppercase">
        {product.category}
      </p>
      <h3 className="mt-1.5 font-serif text-[1.35rem] leading-snug text-ink">
        {product.name}
      </h3>
      <div className="mt-2 flex items-center gap-1.5 text-gold-deep">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={12}
            className={
              index < Math.round(product.rating)
                ? "fill-gold-deep text-gold-deep"
                : "text-sand"
            }
          />
        ))}
        <span className="ml-1 font-sans text-xs text-muted">
          {product.rating} ({product.reviews})
        </span>
      </div>
      <p className="mt-2 font-sans text-sm tracking-wide text-ink-soft">
        ${product.price}
      </p>
    </article>
  );
}
