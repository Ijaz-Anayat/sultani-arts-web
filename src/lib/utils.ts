export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function serialize<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function isValidObjectId(id: string) {
  return /^[a-fA-F0-9]{24}$/.test(id);
}

export function formatPrice(amount: number) {
  return `$${amount.toFixed(0)}`;
}

export function startingPrice(sizes: { price: number }[]) {
  if (!sizes.length) return 0;
  return Math.min(...sizes.map((size) => size.price));
}
