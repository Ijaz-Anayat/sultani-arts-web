import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/queries";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/shop"), lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/categories"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/about"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/contact"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  let products: Awaited<ReturnType<typeof getProducts>> = [];
  try {
    products = await getProducts();
  } catch {
    products = [];
  }

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: absoluteUrl(`/product/${product._id}`),
    lastModified: product.createdAt ? new Date(product.createdAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
