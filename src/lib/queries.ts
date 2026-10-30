import { unstable_cache } from "next/cache";
import type { PipelineStage } from "mongoose";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { connectDB } from "@/lib/mongodb";
import { CATEGORY_FALLBACK_IMAGES, DEFAULT_CATEGORY_IMAGE } from "@/lib/constants";
import { resolveProductImage, resolveProductImages } from "@/lib/site-images";
import { serialize } from "@/lib/utils";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
import { Frame } from "@/models/Frame";
import { Review } from "@/models/Review";
import { Settings } from "@/models/Settings";
import { PageView } from "@/models/PageView";
import { DEFAULT_SIZES } from "@/lib/constants";
import { REVIEW_POOL } from "@/lib/review-pool-data";
import { pickReviewIndexes, type ReviewDTO } from "@/lib/reviews";
import type {
  CashOnDeliveryFees,
  CategoryDTO,
  FrameDTO,
  ProductDTO,
  OrderDTO,
} from "@/lib/types";

const STORE_REVALIDATE_SECONDS = 60;

function normalizeProduct<T extends ProductDTO>(product: T): T {
  return {
    ...product,
    images: resolveProductImages(product.images),
  };
}

async function fetchGlobalDiscountPercent(): Promise<number> {
  await connectDB();
  const settings = await Settings.findOne({ key: "store" }).lean();
  return settings?.globalDiscountPercent ?? 0;
}

export async function getGlobalDiscountPercent(): Promise<number> {
  return unstable_cache(fetchGlobalDiscountPercent, ["global-discount"], {
    revalidate: STORE_REVALIDATE_SECONDS,
    tags: [CACHE_TAGS.settings],
  })();
}

export async function getCashOnDeliveryFees(): Promise<CashOnDeliveryFees> {
  await connectDB();
  const settings = await Settings.findOne({ key: "store" }).lean();
  return Object.fromEntries(
    (settings?.cashOnDeliveryFees ?? []).map(({ sizeLabel, amount }) => [sizeLabel, amount]),
  );
}

export async function getCashOnDeliverySettings(): Promise<{
  fees: CashOnDeliveryFees;
  sizeLabels: string[];
}> {
  await connectDB();
  const [settings, productSizeLabels] = await Promise.all([
    Settings.findOne({ key: "store" }).lean(),
    Product.distinct("sizes.label"),
  ]);
  const fees = Object.fromEntries(
    (settings?.cashOnDeliveryFees ?? []).map(({ sizeLabel, amount }) => [sizeLabel, amount]),
  );
  const sizeLabels = [
    ...new Set([
      ...productSizeLabels.filter((label): label is string => typeof label === "string" && label.length > 0),
      ...Object.keys(fees),
    ]),
  ].sort((left, right) => left.localeCompare(right));

  return { fees, sizeLabels };
}

async function fetchCategories(): Promise<CategoryDTO[]> {
  await connectDB();

  const [categories, stats] = await Promise.all([
    Category.find().sort({ name: 1 }).lean(),
    Product.aggregate<{ _id: unknown; count: number; image?: string }>([
      { $sort: { createdAt: 1 } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          image: { $first: { $arrayElemAt: ["$images", 0] } },
        },
      },
    ]),
  ]);

  const statsMap = new Map(
    stats.map((item) => [
      String(item._id),
      {
        count: item.count,
        image: item.image ? resolveProductImage(item.image) : undefined,
      },
    ]),
  );

  return categories.map((category) => {
    const id = String(category._id);
    const entry = statsMap.get(id);
    return {
      _id: id,
      name: category.name,
      slug: category.slug,
      productCount: entry?.count ?? 0,
      image:
        entry?.image ??
        CATEGORY_FALLBACK_IMAGES[category.slug] ??
        DEFAULT_CATEGORY_IMAGE,
      createdAt: category.createdAt ? new Date(category.createdAt).toISOString() : undefined,
    };
  });
}

export async function getCategories(): Promise<CategoryDTO[]> {
  return unstable_cache(fetchCategories, ["categories"], {
    revalidate: STORE_REVALIDATE_SECONDS,
    tags: [CACHE_TAGS.categories, CACHE_TAGS.products],
  })();
}

type ProductQueryOptions = {
  limit?: number;
  priorityOrder?: boolean;
};

async function fetchProducts(
  categorySlug?: string,
  options: ProductQueryOptions = {},
): Promise<ProductDTO[]> {
  await connectDB();

  const filter: Record<string, unknown> = {};
  if (categorySlug) {
    const category = await Category.findOne({ slug: categorySlug }).lean();
    if (!category) return [];
    filter.category = category._id;
  }

  if (options.priorityOrder) {
    const pipeline: PipelineStage[] = [
      { $match: filter },
      { $addFields: { sortPriority: { $ifNull: ["$priority", 20] } } },
      { $sort: { sortPriority: 1, createdAt: -1 } },
      ...(options.limit && options.limit > 0 ? [{ $limit: options.limit }] : []),
      {
        $lookup: {
          from: Category.collection.name,
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      { $project: { sortPriority: 0 } },
    ];
    const products = await Product.aggregate(pipeline);
    return serialize(products as unknown as ProductDTO[]).map(normalizeProduct);
  }

  let query = Product.find(filter).populate("category").sort({ createdAt: -1 });
  if (options.limit && options.limit > 0) query = query.limit(options.limit);
  const products = await query.lean();
  return serialize(products as unknown as ProductDTO[]).map(normalizeProduct);
}

export async function getProducts(
  categorySlug?: string,
  options: ProductQueryOptions = {},
): Promise<ProductDTO[]> {
  const limitKey = options.limit && options.limit > 0 ? String(options.limit) : "all";
  const priorityKey = options.priorityOrder ? "priority" : "date";
  return unstable_cache(
    () => fetchProducts(categorySlug, options),
    ["products", categorySlug ?? "all", limitKey, priorityKey],
    {
      revalidate: STORE_REVALIDATE_SECONDS,
      tags: [CACHE_TAGS.products],
    },
  )();
}

async function fetchProductById(id: string): Promise<ProductDTO | null> {
  await connectDB();
  const product = await Product.findById(id).populate("category").lean();
  if (!product) return null;
  return normalizeProduct(serialize(product as unknown as ProductDTO));
}

export async function getProductById(id: string): Promise<ProductDTO | null> {
  return unstable_cache(() => fetchProductById(id), ["product", id], {
    revalidate: STORE_REVALIDATE_SECONDS,
    tags: [CACHE_TAGS.products],
  })();
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

async function fetchReviewsForProduct(productId: string): Promise<ReviewDTO[]> {
  await connectDB();

  const poolSize = await Review.countDocuments();
  let pool: Array<{
    _id?: unknown;
    name: string;
    location: string;
    rating: number;
    body: string;
    postedAt: Date | string;
    index?: number;
  }>;

  if (poolSize < 4) {
    const now = Date.now();
    pool = REVIEW_POOL.map((review, index) => ({
      index,
      name: review.name,
      location: review.location,
      rating: review.rating,
      body: review.body,
      postedAt: new Date(now - review.daysAgo * 24 * 60 * 60 * 1000),
    }));
  } else {
    const indexes = pickReviewIndexes(productId, poolSize);
    pool = await Review.find({ index: { $in: indexes } }).lean();
    const byIndex = new Map(pool.map((review) => [review.index, review]));
    return indexes
      .map((index) => byIndex.get(index))
      .filter(Boolean)
      .map((review) => toReviewDTO(review!))
      .sort((left, right) => +new Date(right.postedAt) - +new Date(left.postedAt));
  }

  return pickReviewIndexes(productId, pool.length)
    .map((index) => pool[index])
    .filter(Boolean)
    .map(toReviewDTO)
    .sort((left, right) => +new Date(right.postedAt) - +new Date(left.postedAt));
}

export async function getReviewsForProduct(productId: string): Promise<ReviewDTO[]> {
  return unstable_cache(() => fetchReviewsForProduct(productId), ["reviews", productId], {
    revalidate: 300,
    tags: [CACHE_TAGS.reviews],
  })();
}

export async function getDashboardStats() {
  await connectDB();

  const [productCount, categoryCount, orderCount, pageViewCount, recentOrders] = await Promise.all([
    Product.countDocuments(),
    Category.countDocuments(),
    Order.countDocuments(),
    PageView.countDocuments(),
    Order.find().sort({ createdAt: -1 }).limit(6).lean(),
  ]);

  return {
    productCount,
    categoryCount,
    orderCount,
    pageViewCount,
    recentOrders: serialize(recentOrders as unknown as OrderDTO[]),
  };
}

const DEFAULT_FRAME_COLORS = [
  { color: "Black", prices: [800, 1200, 1800] },
  { color: "Gold", prices: [1100, 1600, 2300] },
  { color: "Walnut", prices: [950, 1400, 2000] },
] as const;

async function fetchFrames(): Promise<FrameDTO[]> {
  await connectDB();

  let frames = await Frame.find().sort({ sizeLabel: 1, color: 1 }).lean();
  if (frames.length === 0) {
    await Frame.insertMany(
      DEFAULT_FRAME_COLORS.flatMap((entry) =>
        DEFAULT_SIZES.map((size, index) => ({
          sizeLabel: size.label,
          color: entry.color,
          price: entry.prices[index],
        })),
      ),
    );
    frames = await Frame.find().sort({ sizeLabel: 1, color: 1 }).lean();
  }

  return serialize(frames as unknown as FrameDTO[]);
}

export async function getFrames(): Promise<FrameDTO[]> {
  return unstable_cache(fetchFrames, ["frames"], {
    revalidate: STORE_REVALIDATE_SECONDS,
    tags: [CACHE_TAGS.frames],
  })();
}
