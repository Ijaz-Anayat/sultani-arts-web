import type { ProductSize } from "@/lib/types";

export function parseSizes(raw: unknown): ProductSize[] | null {
  if (!Array.isArray(raw) || raw.length !== 3) {
    return null;
  }

  const sizes = raw.map((item) => {
    const row = item as { label?: string; price?: number | string; stock?: number | string };
    const label = String(row.label ?? "").trim();
    const price = Number(row.price);
    const stock = Math.max(0, Math.floor(Number(row.stock) || 0));
    return { label, price, stock };
  });

  if (sizes.some((size) => !size.label || Number.isNaN(size.price) || size.price < 0)) {
    return null;
  }

  return sizes;
}

export function getSizeStock(size: Pick<ProductSize, "stock">) {
  return size.stock ?? 0;
}

export function isSizeInStock(size: Pick<ProductSize, "stock">) {
  return getSizeStock(size) > 0;
}

export function getTotalStock(sizes: Pick<ProductSize, "stock">[]) {
  return sizes.reduce((sum, size) => sum + getSizeStock(size), 0);
}

export function findFirstAvailableSizeIndex(sizes: ProductSize[]) {
  const index = sizes.findIndex((size) => isSizeInStock(size));
  return index >= 0 ? index : 0;
}
