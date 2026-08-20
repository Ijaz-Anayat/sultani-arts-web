const unsplash = (id: string, width = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;

export const SITE_IMAGES = {
  hero: "/images/hero.png",
  about: unsplash("photo-1579783902614-a3fb3927b6a5", 1400),
  showcase: unsplash("photo-1579783902614-a3fb3927b6a5", 2000),
  productFallback: unsplash("photo-1579783902614-a3fb3927b6a5", 900),
} as const;

export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  canvas: unsplash("photo-1579783902614-a3fb3927b6a5", 1000),
  "oil-painting": unsplash("photo-1579783902614-a3fb3927b6a5", 1000),
  calligraphy: unsplash("photo-1579783902614-a3fb3927b6a5", 1000),
};

export const DEFAULT_CATEGORY_IMAGE = SITE_IMAGES.productFallback;

const BROKEN_IMAGE_PATTERNS = ["photo-1564760055775", "photo-1541961017774", "photo-1513364776144"];

export function resolveProductImage(url?: string | null): string {
  if (!url) return SITE_IMAGES.productFallback;
  if (url.startsWith("/images/")) return SITE_IMAGES.productFallback;
  if (BROKEN_IMAGE_PATTERNS.some((pattern) => url.includes(pattern))) {
    return SITE_IMAGES.productFallback;
  }
  return url;
}

export function resolveProductImages(images?: string[] | null): string[] {
  const resolved = (images ?? []).map((url) => resolveProductImage(url));
  return resolved.length > 0 ? resolved : [SITE_IMAGES.productFallback];
}

export const SEED_PRODUCT_IMAGES = {
  "La Ilaha Illallah — Marbled Calligraphy Oil Painting": unsplash(
    "photo-1579783902614-a3fb3927b6a5",
  ),
  "Ayat al-Kursi — Gold Leaf Canvas": unsplash("photo-1579783902614-a3fb3927b6a5"),
  "Bismillah — Contemporary Naskh Panel": unsplash("photo-1579783902614-a3fb3927b6a5"),
  "Al-Fatiha — Framed Wall Art": unsplash("photo-1579783902614-a3fb3927b6a5"),
  "Geometric Tawhid Study — Canvas Print": unsplash("photo-1579783902614-a3fb3927b6a5"),
  "Floral Kufic Panel — Oil on Canvas": unsplash("photo-1579783902614-a3fb3927b6a5"),
} as const;
