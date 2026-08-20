import { connectDB } from "@/lib/mongodb";
import { CATEGORY_FALLBACK_IMAGES, DEFAULT_CATEGORY_IMAGE } from "@/lib/constants";
import { resolveProductImage, resolveProductImages } from "@/lib/site-images";
import { serialize } from "@/lib/utils";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
import { Review } from "@/models/Review";
import { Settings } from "@/models/Settings";
import { REVIEW_POOL } from "@/lib/review-pool-data";
import { pickReviewIndexes, type ReviewDTO } from "@/lib/reviews";
import type { CategoryDTO, ProductDTO, OrderDTO } from "@/lib/types";

function normalizeProduct<T extends ProductDTO>(product: T): T {
  return {
    ...product,
    images: resolveProductImages(product.images),
  };
}

export async function getGlobalDiscountPercent(): Promise<number> {
  await connectDB();
  const settings = await Settings.findOne({ key: "store" }).lean();
  return settings?.globalDiscountPercent ?? 0;
}

export async function getCategories(): Promise<CategoryDTO[]> {
  await connectDB();

  const [categories, counts, coverProducts] = await Promise.all([
    Category.find().sort({ name: 1 }).lean(),
    Product.aggregate<{ _id: unknown; count: number }>([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]),
    Product.find({}, { category: 1, images: 1 })
      .sort({ createdAt: 1 })
      .lean(),
  ]);

  const countMap = new Map(counts.map((item) => [String(item._id), item.count]));
  const coverMap = new Map<string, string>();
  for (const product of coverProducts) {
    const key = String(product.category);
    if (!coverMap.has(key) && product.images?.[0]) {
      coverMap.set(key, resolveProductImage(product.images[0]));
    }
  }

  return categories.map((category) => {
    const id = String(category._id);
    return {
      _id: id,
      name: category.name,
      slug: category.slug,
      productCount: countMap.get(id) ?? 0,
      image:
        coverMap.get(id) ??
        CATEGORY_FALLBACK_IMAGES[category.slug] ??
        DEFAULT_CATEGORY_IMAGE,
      createdAt: category.createdAt ? new Date(category.createdAt).toISOString() : undefined,
    };
  });
}

export async function getProducts(categorySlug?: string): Promise<ProductDTO[]> {
  await connectDB();

  const filter: Record<string, unknown> = {};
  if (categorySlug) {
    const category = await Category.findOne({ slug: categorySlug }).lean();
    if (!category) return [];
    filter.category = category._id;
  }

  const products = await Product.find(filter)
    .populate("category")
    .sort({ createdAt: -1 })
    .lean();

  return serialize(products as unknown as ProductDTO[]).map(normalizeProduct);
}

export async function getProductById(id: string): Promise<ProductDTO | null> {
  await connectDB();
  const product = await Product.findById(id).populate("category").lean();
  if (!product) return null;
  return normalizeProduct(serialize(product as unknown as ProductDTO));
}

function toReviewDTO(review: {
  _id?: unknown;
  name: string;
  location: string;
  rating: number;
  body: string;
  postedAt: Date | string;
  index?: number;
}): ReviewDTO {
  const postedAt =
    review.postedAt instanceof Date
      ? review.postedAt.toISOString()
      : new Date(review.postedAt).toISOString();

  return {
    _id: review._id ? String(review._id) : `pool-${review.index ?? review.name}`,
    name: review.name,
    location: review.location,
    rating: review.rating,
    body: review.body,
    postedAt,
  };
}

export async function getReviewsForProduct(productId: string): Promise<ReviewDTO[]> {
  await connectDB();

  let pool: Array<{
    _id?: unknown;
    name: string;
    location: string;
    rating: number;
    body: string;
    postedAt: Date | string;
    index?: number;
  }> = await Review.find().sort({ index: 1 }).lean();

  if (pool.length < 4) {
    const now = Date.now();
    pool = REVIEW_POOL.map((review, index) => ({
      index,
      name: review.name,
      location: review.location,
      rating: review.rating,
      body: review.body,
      postedAt: new Date(now - review.daysAgo * 24 * 60 * 60 * 1000),
    }));
  }

  return pickReviewIndexes(productId, pool.length)
    .map((index) => pool[index])
    .filter(Boolean)
    .map(toReviewDTO)
    .sort((left, right) => +new Date(right.postedAt) - +new Date(left.postedAt));
}

export async function getDashboardStats() {
  await connectDB();

  const [productCount, categoryCount, orderCount, recentOrders] = await Promise.all([
    Product.countDocuments(),
    Category.countDocuments(),
    Order.countDocuments(),
    Order.find().sort({ createdAt: -1 }).limit(6).lean(),
  ]);

  return {
    productCount,
    categoryCount,
    orderCount,
    recentOrders: serialize(recentOrders as unknown as OrderDTO[]),
  };
}
