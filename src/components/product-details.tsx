"use client";

import { useState } from "react";
import Image from "next/image";
import { PriceDisplay } from "@/components/price-display";
import { useStore } from "@/components/store-provider";
import { formatPrice, getDiscountedPrice } from "@/lib/pricing";
import {
  findFirstAvailableSizeIndex,
  getSizeStock,
  isSizeInStock,
} from "@/lib/product-sizes";
import type { ProductDTO } from "@/lib/types";

export function ProductDetails({ product }: { product: ProductDTO }) {
  const { addToCart, setCartOpen, globalDiscountPercent } = useStore();
  const [selectedIndex, setSelectedIndex] = useState(() =>
    findFirstAvailableSizeIndex(product.sizes),
  );
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
  const selectedInStock = Boolean(size && isSizeInStock(size) && product.inStock);
  const anySizeInStock = product.inStock && product.sizes.some((entry) => isSizeInStock(entry));

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,20rem)] lg:items-start lg:justify-center lg:gap-12 xl:max-w-5xl xl:grid-cols-[minmax(0,26rem)_minmax(0,22rem)]">
      <div className="mx-auto w-full max-w-xs sm:max-w-sm lg:mx-0 lg:max-w-none">
        <div className="relative aspect-[5/6] max-h-[min(52vh,420px)] w-full overflow-hidden bg-parchment sm:aspect-[4/5]">
          {image ? (
            <Image
              src={image}
              alt={product.title}
              fill
              className="object-contain p-3"
              sizes="(max-width: 1024px) 80vw, 420px"
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
                className={`relative aspect-square overflow-hidden bg-parchment ${
                  index === imageIndex ? "ring-1 ring-gold" : ""
                }`}
              >
                <Image src={url} alt="" fill className="object-contain p-1" sizes="80px" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
        <p className="font-sans text-[0.62rem] tracking-[0.28em] text-gold-deep uppercase">
          {categoryName}
        </p>
        <h1 className="mt-2 font-serif text-2xl leading-tight sm:text-3xl">{product.title}</h1>
        <p className="mt-4 font-sans text-[0.9rem] leading-7 text-ink-soft sm:text-[0.94rem]">
          {product.description}
        </p>

        <div className="mt-6">
          <p className="font-sans text-[0.62rem] tracking-[0.22em] text-muted uppercase">
            Size
          </p>
          <div className="mt-2 space-y-2">
            {product.sizes.map((option, index) => {
              const available = isSizeInStock(option);
              return (
                <button
                  key={option.label}
                  type="button"
                  disabled={!available}
                  onClick={() => setSelectedIndex(index)}
                  className={`flex w-full items-center justify-between gap-3 border px-3 py-2.5 text-left disabled:cursor-not-allowed disabled:opacity-50 sm:px-3.5 sm:py-3 ${
                    index === selectedIndex
                      ? "border-ink bg-cream"
                      : "border-line bg-ivory"
                  }`}
                >
                  <span className="min-w-0 font-serif text-base leading-snug sm:text-lg">
                    {option.label}
                    {!available ? (
                      <span className="ml-2 block font-sans text-[0.58rem] tracking-[0.14em] text-muted uppercase sm:inline">
                        Out of stock
                      </span>
                    ) : (
                      <span className="ml-0 block font-sans text-[0.58rem] tracking-[0.14em] text-muted sm:ml-2 sm:inline">
                        {getSizeStock(option)} left
                      </span>
                    )}
                  </span>
                  <PriceDisplay
                    originalPrice={option.price}
                    globalDiscountPercent={globalDiscountPercent}
                    productDiscountPercent={productDiscountPercent}
                    size="sm"
                    className="shrink-0 text-right"
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <PriceDisplay
            originalPrice={selectedOriginal}
            globalDiscountPercent={globalDiscountPercent}
            productDiscountPercent={productDiscountPercent}
            size="md"
          />
        </div>
        <button
          type="button"
          disabled={!selectedInStock || !size}
          onClick={() => {
            if (!size || !image || !selectedInStock) return;
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
          className="mt-5 w-full bg-ink py-3 font-sans text-[0.68rem] tracking-[0.22em] text-ivory uppercase transition-colors hover:bg-gold-deep disabled:opacity-50 sm:py-3.5 sm:text-[0.72rem] sm:tracking-[0.24em]"
        >
          {selectedInStock
            ? `Add to cart · ${formatPrice(selectedDiscounted)}`
            : anySizeInStock
              ? "Selected size is out of stock"
              : "Currently unavailable"}
        </button>
      </div>
    </div>
  );
}
