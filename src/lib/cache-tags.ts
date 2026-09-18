import { revalidateTag } from "next/cache";

export const CACHE_TAGS = {
  products: "products",
  categories: "categories",
  settings: "settings",
  frames: "frames",
  reviews: "reviews",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

/** Invalidate tagged data caches from Route Handlers (Next.js 16 requires a profile). */
export function revalidateStoreTags(...tags: CacheTag[]) {
  const unique = [...new Set(tags)];
  for (const tag of unique) {
    revalidateTag(tag, "max");
  }
}
