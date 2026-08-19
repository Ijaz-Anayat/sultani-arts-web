import { connectDB } from "@/lib/mongodb";
import { CATEGORY_FALLBACK_IMAGES, DEFAULT_CATEGORY_IMAGE } from "@/lib/constants";
import { serialize } from "@/lib/utils";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
import type { CategoryDTO, ProductDTO, OrderDTO } from "@/lib/types";

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
      coverMap.set(key, product.images[0]);
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

  return serialize(products as unknown as ProductDTO[]);
}

export async function getProductById(id: string): Promise<ProductDTO | null> {
  await connectDB();
  const product = await Product.findById(id).populate("category").lean();
  if (!product) return null;
  return serialize(product as unknown as ProductDTO);
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
