const unsplash = (id: string, width = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;

const pexels = (id: number, width = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;

export const SITE_IMAGES = {
  hero: "/images/hero.png",
  about: pexels(31515941, 1400),
  showcase: pexels(32323933, 2000),
  productFallback: pexels(1183266, 900),
} as const;

export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  canvas: pexels(29849649, 1000),
  "oil-painting": pexels(32369476, 1000),
  calligraphy: pexels(31515941, 1000),
};

export const DEFAULT_CATEGORY_IMAGE = SITE_IMAGES.productFallback;

const BROKEN_IMAGE_PATTERNS = [
  "photo-1564760055775",
  "photo-1541961017774",
  "photo-1513364776144",
  "photo-1579783902614-a3fb3927b6a5",
  "photo-1579783902610-fdc5a3970b6c",
  "photo-1578301978693",
  "photo-1547891654",
];

export const PRODUCT_IMAGES: Record<string, string> = {
  '"La Ilaha Illallah" Marbled Islamic Calligraphy Oil Painting — Framed Wall Art':
    "https://res.cloudinary.com/ufutnnr6/image/upload/v1787175630/sultani-arts/products/uly6df9cx8hdcpxs8us1.png",
  "Ayat al-Kursi — Gold Leaf Canvas": pexels(32323933),
  "Bismillah — Contemporary Calligraphy Panel": pexels(31515941),
  "Marbled Tawhid — Oil on Canvas": pexels(32369476),
  "Al-Fatiha — Framed Wall Art": pexels(29849649),
  "Floral Kufic — Statement Canvas": pexels(2832382),
  "La Ilaha Illallah — Marbled Calligraphy Oil Painting": pexels(3769021),
  "Bismillah — Contemporary Naskh Panel": pexels(1191710),
  "Geometric Tawhid Study — Canvas Print": pexels(2897372),
  "Floral Kufic Panel — Oil on Canvas": pexels(3094215),
};

export const SEED_PRODUCT_IMAGES = PRODUCT_IMAGES;

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

export function imageForProductTitle(title: string): string {
  return PRODUCT_IMAGES[title] ?? SITE_IMAGES.productFallback;
}
