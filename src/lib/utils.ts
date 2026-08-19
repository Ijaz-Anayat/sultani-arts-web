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

export { formatPrice, startingPrice } from "@/lib/pricing";
