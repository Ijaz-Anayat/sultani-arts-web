export function clampDiscount(value: number) {
  return Math.min(100, Math.max(0, value));
}

export function parseDiscountPercent(value: unknown) {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return 0;
  return clampDiscount(parsed);
}

export function getEffectiveDiscountPercent(globalPercent: number, productPercent = 0) {
  return clampDiscount(globalPercent + productPercent);
}

export function getDiscountedPrice(
  originalPrice: number,
  globalPercent: number,
  productPercent = 0,
) {
  const discount = getEffectiveDiscountPercent(globalPercent, productPercent);
  if (discount <= 0) return originalPrice;
  return Math.round(originalPrice * (1 - discount / 100));
}

export function formatPrice(amount: number) {
  return `Rs. ${amount.toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;
}

export function startingPrice(
  sizes: { price: number }[],
  globalPercent = 0,
  productPercent = 0,
) {
  if (!sizes.length) return 0;
  const minOriginal = Math.min(...sizes.map((size) => size.price));
  return getDiscountedPrice(minOriginal, globalPercent, productPercent);
}

export function hasActiveDiscount(globalPercent: number, productPercent = 0) {
  return getEffectiveDiscountPercent(globalPercent, productPercent) > 0;
}
