import type { ReviewDTO } from "@/lib/types";

export type { ReviewDTO };

export function hashProductId(productId: string): number {
  let hash = 2166136261;
  for (let index = 0; index < productId.length; index += 1) {
    hash ^= productId.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

const STRIDES = [11, 13, 17, 19, 21, 23, 27, 29, 31, 37, 41, 43, 47, 49, 53, 57];

export function pickReviewIndexes(productId: string, poolSize: number): number[] {
  if (poolSize < 4) return [];
  const hash = hashProductId(productId);
  const count = 4 + (hash % 4);
  const stride = STRIDES[hash % STRIDES.length];
  const start = hash % poolSize;
  const indexes: number[] = [];
  const used = new Set<number>();

  for (let offset = 0; indexes.length < count && offset < poolSize; offset += 1) {
    const index = (start + offset * stride) % poolSize;
    if (used.has(index)) continue;
    used.add(index);
    indexes.push(index);
  }

  return indexes;
}
