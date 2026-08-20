"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { PriceDisplay } from "@/components/price-display";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { useStore } from "@/components/store-provider";
import { getDiscountedPrice } from "@/lib/pricing";
import { findFirstAvailableSizeIndex, isSizeInStock } from "@/lib/product-sizes";
import { resolveProductImage, SITE_IMAGES } from "@/lib/site-images";
import type { ProductDTO } from "@/lib/types";

function ProductCardTitle({
  title,
  href,
  compact,
}: {
  title: string;
  href: string;
  compact: boolean;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [clamped, setClamped] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const checkClamp = () => {
      setClamped(element.scrollHeight > element.clientHeight + 1);
    };

    checkClamp();
    window.addEventListener("resize", checkClamp);
    return () => window.removeEventListener("resize", checkClamp);
  }, [title]);

  return (
    <div className="min-h-[4.15rem] sm:min-h-0">
      <Link href={href}>
        <h3
          ref={ref}
          className={`font-serif leading-snug text-ink line-clamp-2 sm:line-clamp-3 ${
            compact ? "text-[0.92rem] sm:text-[1.05rem]" : "text-[1.02rem] sm:text-[1.35rem]"
          }`}
        >
          {title}
        </h3>
      </Link>
      <div className="mt-0.5 h-4 sm:h-auto">
        {clamped ? (
          <Link
            href={href}
            className="inline-block font-sans text-[0.58rem] tracking-[0.14em] text-gold-deep uppercase sm:text-[0.62rem]"
          >
            View more
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export function ProductCard({
  product,
  revealDelay = 0,
  compact = false,
}: {
  product: ProductDTO;
  revealDelay?: number;
  compact?: boolean;
}) {
  const { addToCart, toggleWishlist, isWishlisted, setCartOpen, globalDiscountPercent } =
    useStore();
  const saved = isWishlisted(product._id);
  const image = resolveProductImage(product.images[0]);
  const [imageSrc, setImageSrc] = useState(image);
  const categoryName =
    typeof product.category === "object" ? product.category.name : "";
  const defaultSizeIndex = findFirstAvailableSizeIndex(product.sizes);
  const defaultSize = product.sizes[defaultSizeIndex];
  const productDiscountPercent = product.discountPercent ?? 0;
  const fromOriginal = product.sizes.length
    ? Math.min(...product.sizes.map((entry) => entry.price))
    : 0;
  const canAdd =
    product.inStock && product.sizes.some((entry) => isSizeInStock(entry)) && defaultSize;

  useEffect(() => {
    setImageSrc(image);
  }, [image]);

  function handleAdd() {
    if (!defaultSize || !canAdd) return;
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
    <RevealOnScroll delay={revealDelay} className="h-full">
      <article className="group flex h-full min-w-0 flex-col">
      <div className={`relative overflow-hidden bg-parchment ${compact ? "mb-2 sm:mb-3" : "mb-3 sm:mb-4"}`}>
        <Link
          href={`/product/${product._id}`}
          className={`relative block ${compact ? "aspect-[3/4] max-h-[220px] sm:max-h-[260px]" : "aspect-[4/5]"}`}
        >
          <Image
            src={imageSrc}
            alt={product.title}
            fill
            onError={() => setImageSrc(SITE_IMAGES.productFallback)}
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
        {canAdd ? (
          <button
            type="button"
            onClick={handleAdd}
            className="absolute inset-x-2 bottom-2 hidden bg-ink py-2.5 font-sans text-[0.62rem] tracking-[0.16em] text-ivory uppercase transition-all duration-300 hover:bg-gold-deep sm:inset-x-4 sm:bottom-4 sm:block sm:translate-y-0 sm:py-3 sm:text-[0.68rem] sm:tracking-[0.26em] sm:opacity-100 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
          >
            Add to Cart
          </button>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col">
        <p className="truncate font-sans text-[0.58rem] tracking-[0.12em] text-gold-deep uppercase sm:text-[0.65rem] sm:tracking-[0.22em]">
          {categoryName}
        </p>
        <div className="mt-1">
          <ProductCardTitle
            title={product.title}
            href={`/product/${product._id}`}
            compact={compact}
          />
        </div>
        <div className="mt-auto pt-1.5 sm:pt-2">
          <p className="font-sans tracking-wide text-ink-soft">
            <PriceDisplay
              originalPrice={fromOriginal}
              globalDiscountPercent={globalDiscountPercent}
              productDiscountPercent={productDiscountPercent}
              prefix="From "
              size="sm"
            />
          </p>
          {canAdd ? (
            <button
              type="button"
              onClick={handleAdd}
              className="mt-3 w-full bg-ink py-2.5 font-sans text-[0.62rem] tracking-[0.16em] text-ivory uppercase transition-colors hover:bg-gold-deep sm:hidden"
            >
              Add to Cart
            </button>
          ) : (
            <p className="mt-3 font-sans text-[0.62rem] tracking-[0.14em] text-muted uppercase">
              Out of stock
            </p>
          )}
        </div>
      </div>
      </article>
    </RevealOnScroll>
  );
}
