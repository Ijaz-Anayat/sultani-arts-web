"use client";

import { useState } from "react";
import Image from "next/image";
import { PriceDisplay } from "@/components/price-display";
import { useStore } from "@/components/store-provider";
import { formatPrice, getDiscountedPrice } from "@/lib/pricing";
import { framesForSize } from "@/lib/frames";
import { resolveProductImages } from "@/lib/site-images";
import {
  findFirstAvailableSizeIndex,
  getSizeStock,
  isSizeInStock,
} from "@/lib/product-sizes";
import type { FrameDTO, ProductDTO } from "@/lib/types";

export function ProductDetails({
  product,
  frames = [],
}: {
  product: ProductDTO;
  frames?: FrameDTO[];
}) {
  const { addToCart, setCartOpen, globalDiscountPercent } = useStore();
  const [selectedIndex, setSelectedIndex] = useState(() =>
    findFirstAvailableSizeIndex(product.sizes),
  );
  const images = resolveProductImages(product.images);
  const [imageIndex, setImageIndex] = useState(0);
  const [addFrame, setAddFrame] = useState(false);
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null);
  const size = product.sizes[selectedIndex] ?? product.sizes[0];
  const availableFrames = size ? framesForSize(frames, size.label) : [];
  const selectedFrame =
    addFrame && selectedFrameId
      ? availableFrames.find((frame) => frame._id === selectedFrameId)
      : undefined;
  const image = images[imageIndex] ?? images[0];
  const categoryName =
    typeof product.category === "object" ? product.category.name : "";
  const productDiscountPercent = product.discountPercent ?? 0;
  const selectedOriginal = (size?.price ?? 0) + (selectedFrame?.price ?? 0);
  const selectedDiscounted =
    getDiscountedPrice(size?.price ?? 0, globalDiscountPercent, productDiscountPercent) +
    (selectedFrame?.price ?? 0);
  const selectedInStock = Boolean(size && isSizeInStock(size) && product.inStock);
  const anySizeInStock = product.inStock && product.sizes.some((entry) => isSizeInStock(entry));

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(0,28rem)_minmax(0,26rem)] lg:items-start lg:justify-center lg:gap-10">
      <div className="mx-auto w-full max-w-sm sm:max-w-md lg:mx-0 lg:max-w-none">
        <div className="relative aspect-[5/6] max-h-[min(58vh,480px)] w-full overflow-hidden bg-parchment sm:aspect-[4/5]">
          {image ? (
            <Image
              src={image}
              alt={product.title}
              fill
              className="object-contain p-2"
              sizes="(max-width: 1024px) 85vw, 480px"
              priority
            />
          ) : null}
        </div>
        {images.length > 1 ? (
          <div className="mt-3 grid grid-cols-4 gap-2">
            {images.map((url, index) => (
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
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {product.sizes.map((option, index) => {
              const available = isSizeInStock(option);
              return (
                <button
                  key={option.label}
                  type="button"
                  disabled={!available}
                  onClick={() => {
                    setSelectedIndex(index);
                    setSelectedFrameId(null);
                  }}
                  className={`flex min-h-[118px] flex-col justify-between border px-3 py-3 text-left disabled:cursor-not-allowed disabled:opacity-50 ${
                    index === selectedIndex
                      ? "border-ink bg-cream"
                      : "border-line bg-ivory"
                  }`}
                >
                  <span className="font-serif text-sm leading-snug sm:text-base">
                    {option.label.split(" ")[0]}
                    <span className="mt-0.5 block font-sans text-[0.58rem] tracking-[0.1em] text-muted uppercase">
                      {option.label.includes("(")
                        ? option.label.slice(option.label.indexOf("("))
                        : option.label}
                    </span>
                  </span>
                  <div className="mt-3">
                    {!available ? (
                      <span className="font-sans text-[0.58rem] tracking-[0.14em] text-muted uppercase">
                        Out of stock
                      </span>
                    ) : (
                      <span className="font-sans text-[0.58rem] tracking-[0.1em] text-muted">
                        {getSizeStock(option)} left
                      </span>
                    )}
                    <PriceDisplay
                      originalPrice={option.price}
                      globalDiscountPercent={globalDiscountPercent}
                      productDiscountPercent={productDiscountPercent}
                      size="sm"
                      className="mt-1 block"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {availableFrames.length > 0 ? (
          <div className="mt-6">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={addFrame}
                onChange={(event) => {
                  const checked = event.target.checked;
                  setAddFrame(checked);
                  setSelectedFrameId(checked ? availableFrames[0]?._id ?? null : null);
                }}
                className="h-4 w-4 accent-ink"
              />
              <span className="font-sans text-[0.62rem] tracking-[0.22em] text-muted uppercase">
                Add a frame
              </span>
            </label>
            {addFrame ? (
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {availableFrames.map((frame) => (
                  <button
                    key={frame._id}
                    type="button"
                    onClick={() => setSelectedFrameId(frame._id)}
                    className={`border px-3 py-3 text-left ${
                      selectedFrameId === frame._id
                        ? "border-ink bg-cream"
                        : "border-line bg-ivory"
                    }`}
                  >
                    <span className="block font-serif text-sm">{frame.color}</span>
                    <span className="mt-1 block font-sans text-[0.62rem] text-muted">
                      For {size.label.split(" ")[0]}
                    </span>
                    <span className="mt-2 block font-sans text-sm text-ink">
                      + {formatPrice(frame.price)}
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="mt-6">
          {selectedFrame ? (
            <div className="space-y-1">
              <p className="font-sans text-sm text-ink-soft">
                Painting {formatPrice(selectedDiscounted - selectedFrame.price)}
                {selectedOriginal - selectedFrame.price > selectedDiscounted - selectedFrame.price ? (
                  <span className="ml-2 text-xs text-muted line-through">
                    {formatPrice(selectedOriginal - selectedFrame.price)}
                  </span>
                ) : null}
              </p>
              <p className="font-sans text-sm text-ink-soft">
                Frame · {selectedFrame.color} + {formatPrice(selectedFrame.price)}
              </p>
              <p className="font-serif text-xl text-ink">
                Total {formatPrice(selectedDiscounted)}
              </p>
            </div>
          ) : (
            <PriceDisplay
              originalPrice={size?.price ?? 0}
              globalDiscountPercent={globalDiscountPercent}
              productDiscountPercent={productDiscountPercent}
              size="md"
            />
          )}
        </div>
        <button
          type="button"
          disabled={!selectedInStock || !size || (addFrame && !selectedFrame)}
          onClick={() => {
            if (!size || !image || !selectedInStock) return;
            if (addFrame && !selectedFrame) return;
            addToCart({
              productId: product._id,
              title: product.title,
              image,
              size: size.label,
              price: selectedDiscounted,
              originalPrice: selectedOriginal,
              frameId: selectedFrame?._id,
              frameColor: selectedFrame?.color,
              framePrice: selectedFrame?.price,
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
