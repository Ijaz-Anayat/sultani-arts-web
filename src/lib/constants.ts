export const DEFAULT_SIZES = [
  { label: "Small (12x16 in)", price: 0, stock: 0 },
  { label: "Medium (16x20 in)", price: 0, stock: 0 },
  { label: "Large (20x24 in)", price: 0, stock: 0 },
] as const;

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  canvas: "/images/wall.jpg",
  "oil-painting": "/images/prints.jpg",
  calligraphy: "/images/islamic.jpg",
};

export const DEFAULT_CATEGORY_IMAGE = "/images/hero.jpg";

export const CART_STORAGE_KEY = "sultani-arts-cart";
export const WISHLIST_STORAGE_KEY = "sultani-arts-wishlist";
