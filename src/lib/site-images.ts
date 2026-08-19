const unsplash = (id: string, width = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;

export const SITE_IMAGES = {
  hero: unsplash("photo-1564760055775-d263b8f3f1a6", 2000),
  about: unsplash("photo-1579783902614-a3fb3927b6a5", 1400),
  showcase: unsplash("photo-1541961017774-22349e4a1262", 2000),
  productFallback: unsplash("photo-1513364776144-60967b0f800f", 900),
} as const;

export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  canvas: unsplash("photo-1547891654-da6684e177b2", 1000),
  "oil-painting": unsplash("photo-1578301978693-85fa9d032843", 1000),
  calligraphy: unsplash("photo-1564760055775-d263b8f3f1a6", 1000),
};

export const DEFAULT_CATEGORY_IMAGE = SITE_IMAGES.productFallback;

export function resolveProductImage(url?: string | null): string {
  if (!url) return SITE_IMAGES.productFallback;
  if (url.startsWith("/images/")) return SITE_IMAGES.productFallback;
  return url;
}

export function resolveProductImages(images?: string[] | null): string[] {
  const resolved = (images ?? []).map((url) => resolveProductImage(url));
  return resolved.length > 0 ? resolved : [SITE_IMAGES.productFallback];
}

export const SEED_PRODUCT_IMAGES = {
  "La Ilaha Illallah — Marbled Calligraphy Oil Painting": unsplash(
    "photo-1564760055775-d263b8f3f1a6",
  ),
  "Ayat al-Kursi — Gold Leaf Canvas": unsplash("photo-1541961017774-22349e4a1262"),
  "Bismillah — Contemporary Naskh Panel": unsplash("photo-1513364776144-60967b0f800f"),
  "Al-Fatiha — Framed Wall Art": unsplash("photo-1579783902614-a3fb3927b6a5"),
  "Geometric Tawhid Study — Canvas Print": unsplash("photo-1547891654-da6684e177b2"),
  "Floral Kufic Panel — Oil on Canvas": unsplash("photo-1578301978693-85fa9d032843"),
} as const;
