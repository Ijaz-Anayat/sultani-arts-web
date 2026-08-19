"use client";

import {
  formatPrice,
  getDiscountedPrice,
  getEffectiveDiscountPercent,
  hasActiveDiscount,
} from "@/lib/pricing";

type PriceDisplayProps = {
  originalPrice: number;
  globalDiscountPercent?: number;
  productDiscountPercent?: number;
  prefix?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: { sale: "text-sm", original: "text-xs" },
  md: { sale: "text-base", original: "text-sm" },
  lg: { sale: "font-serif text-3xl", original: "text-lg" },
};

export function PriceDisplay({
  originalPrice,
  globalDiscountPercent = 0,
  productDiscountPercent = 0,
  prefix = "",
  size = "sm",
  className = "",
}: PriceDisplayProps) {
  const discounted = getDiscountedPrice(
    originalPrice,
    globalDiscountPercent,
    productDiscountPercent,
  );
  const showDiscount = hasActiveDiscount(globalDiscountPercent, productDiscountPercent);
  const classes = sizeClasses[size];

  if (!showDiscount || discounted >= originalPrice) {
    return (
      <span className={className}>
        {prefix}
        {formatPrice(originalPrice)}
      </span>
    );
  }

  return (
    <span className={`inline-flex flex-wrap items-baseline gap-2 ${className}`}>
      {prefix ? <span className="text-muted">{prefix}</span> : null}
      <span className={`font-medium text-ink ${classes.sale}`}>{formatPrice(discounted)}</span>
      <span className={`text-muted line-through ${classes.original}`}>
        {formatPrice(originalPrice)}
      </span>
      <span className="font-sans text-[0.62rem] tracking-[0.14em] text-gold-deep uppercase">
        {getEffectiveDiscountPercent(globalDiscountPercent, productDiscountPercent)}% off
      </span>
    </span>
  );
}
