export {
  CATEGORY_FALLBACK_IMAGES,
  DEFAULT_CATEGORY_IMAGE,
  SITE_IMAGES,
  SEED_PRODUCT_IMAGES,
} from "@/lib/site-images";

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

export const CART_STORAGE_KEY = "sultani-arts-cart";
export const WISHLIST_STORAGE_KEY = "sultani-arts-wishlist";

export const SITE_CONTACT = {
  email: "team.sultaniarts@gmail.com",
  phone: "+923392008163",
  phoneDisplay: "0339 2008163",
  whatsappUrl: "https://wa.me/923392008163",
  location: "Township, Lahore",
  locationLine: "Township, Lahore, Pakistan",
  instagram: "https://www.instagram.com/sultaniarts010?igsh=ejJibGhtam1hb3Bl",
  facebook: "https://www.facebook.com/profile.php?id=61593303458306",
} as const;
