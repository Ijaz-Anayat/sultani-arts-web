"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { PriceDisplay } from "@/components/price-display";
import { useStore } from "@/components/store-provider";
import { getDiscountedPrice } from "@/lib/pricing";
import type { ProductDTO } from "@/lib/types";

export function ProductCard({ product }: { product: ProductDTO }) {
  const { addToCart, toggleWishlist, isWishlisted, setCartOpen, globalDiscountPercent } =
    useStore();
  const saved = isWishlisted(product._id);
  const image = product.images[0] ?? "/images/hero.jpg";
  const categoryName =
    typeof product.category === "object" ? product.category.name : "";
  const defaultSize = product.sizes[0];
  const productDiscountPercent = product.discountPercent ?? 0;
  const fromOriginal = product.sizes.length
    ? Math.min(...product.sizes.map((entry) => entry.price))
    : 0;

  function handleAdd() {
    if (!defaultSize) return;
    const discountedPrice = getDiscountedPrice(
      defaultSize.price,
      globalDiscountPercent,
      productDiscountPercent,
    );
    addToCart({
      productId: product._id,
      title: product.title,
      image,
      size: defaultSize.label,
      price: discountedPrice,
      originalPrice: defaultSize.price,
    });
    setCartOpen(true);
  }

  return (
    <article className="group flex min-w-0 flex-col">
      <div className="relative mb-3 overflow-hidden bg-parchment sm:mb-4">
        <Link href={`/product/${product._id}`} className="relative block aspect-[4/5]">
          <Image
            src={image}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
          />
        </Link>
        <button
          type="button"
          onClick={() => toggleWishlist(product._id)}
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
          onClick={handleAdd}
          className="absolute inset-x-2 bottom-2 hidden bg-ink py-2.5 font-sans text-[0.62rem] tracking-[0.16em] text-ivory uppercase transition-all duration-300 hover:bg-gold-deep sm:inset-x-4 sm:bottom-4 sm:block sm:translate-y-0 sm:py-3 sm:text-[0.68rem] sm:tracking-[0.26em] sm:opacity-100 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
        >
          Add to Cart
        </button>
      </div>
      <p className="truncate font-sans text-[0.58rem] tracking-[0.12em] text-gold-deep uppercase sm:text-[0.65rem] sm:tracking-[0.22em]">
        {categoryName}
      </p>
      <Link href={`/product/${product._id}`}>
        <h3 className="mt-1 font-serif text-[1.02rem] leading-snug text-ink sm:mt-1.5 sm:text-[1.35rem]">
          {product.title}
        </h3>
      </Link>
      <p className="mt-1.5 font-sans tracking-wide text-ink-soft sm:mt-2">
        <PriceDisplay
          originalPrice={fromOriginal}
          globalDiscountPercent={globalDiscountPercent}
          productDiscountPercent={productDiscountPercent}
          prefix="From "
          size="sm"
        />
      </p>
      <button
        type="button"
        onClick={handleAdd}
        className="mt-3 w-full bg-ink py-2.5 font-sans text-[0.62rem] tracking-[0.16em] text-ivory uppercase transition-colors hover:bg-gold-deep sm:hidden"
      >
        Add to Cart
      </button>
    </article>
  );
}
