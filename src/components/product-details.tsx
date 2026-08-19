"use client";

import { useState } from "react";
import Image from "next/image";
import { PriceDisplay } from "@/components/price-display";
import { useStore } from "@/components/store-provider";
import { formatPrice, getDiscountedPrice } from "@/lib/pricing";
import type { ProductDTO } from "@/lib/types";

export function ProductDetails({ product }: { product: ProductDTO }) {
  const { addToCart, setCartOpen, globalDiscountPercent } = useStore();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const size = product.sizes[selectedIndex] ?? product.sizes[0];
  const image = product.images[imageIndex] ?? product.images[0];
  const categoryName =
    typeof product.category === "object" ? product.category.name : "";
  const productDiscountPercent = product.discountPercent ?? 0;
  const selectedOriginal = size?.price ?? 0;
  const selectedDiscounted = getDiscountedPrice(
    selectedOriginal,
    globalDiscountPercent,
    productDiscountPercent,
  );

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <div>
        <div className="relative aspect-[4/5] overflow-hidden bg-parchment">
          {image ? (
            <Image
              src={image}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          ) : null}
        </div>
        {product.images.length > 1 ? (
          <div className="mt-3 grid grid-cols-4 gap-2">
            {product.images.map((url, index) => (
              <button
                key={url}
                type="button"
                onClick={() => setImageIndex(index)}
                className={`relative aspect-[4/5] overflow-hidden ${
                  index === imageIndex ? "ring-1 ring-gold" : ""
                }`}
              >
                <Image src={url} alt="" fill className="object-cover" sizes="120px" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div>
        <p className="font-sans text-[0.65rem] tracking-[0.28em] text-gold-deep uppercase">
          {categoryName}
        </p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl">{product.title}</h1>
        <p className="mt-6 font-sans text-[0.98rem] leading-8 text-ink-soft">
          {product.description}
        </p>

        <div className="mt-8">
          <p className="font-sans text-[0.65rem] tracking-[0.22em] text-muted uppercase">
            Size
          </p>
          <div className="mt-3 space-y-2">
            {product.sizes.map((option, index) => (
              <button
                key={option.label}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`flex w-full items-center justify-between border px-4 py-3 text-left ${
                  index === selectedIndex
                    ? "border-ink bg-cream"
                    : "border-line bg-ivory"
                }`}
              >
                <span className="font-serif text-lg">{option.label}</span>
                <PriceDisplay
                  originalPrice={option.price}
                  globalDiscountPercent={globalDiscountPercent}
                  productDiscountPercent={productDiscountPercent}
                  size="sm"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <PriceDisplay
            originalPrice={selectedOriginal}
            globalDiscountPercent={globalDiscountPercent}
            productDiscountPercent={productDiscountPercent}
            size="lg"
          />
        </div>
        <button
          type="button"
          disabled={!product.inStock || !size}
          onClick={() => {
            if (!size || !image) return;
            addToCart({
              productId: product._id,
              title: product.title,
              image,
              size: size.label,
              price: selectedDiscounted,
              originalPrice: size.price,
            });
            setCartOpen(true);
          }}
          className="mt-6 w-full bg-ink py-3.5 font-sans text-[0.72rem] tracking-[0.24em] text-ivory uppercase transition-colors hover:bg-gold-deep disabled:opacity-50"
        >
          {product.inStock ? `Add to cart · ${formatPrice(selectedDiscounted)}` : "Currently unavailable"}
        </button>
      </div>
    </div>
  );
}
