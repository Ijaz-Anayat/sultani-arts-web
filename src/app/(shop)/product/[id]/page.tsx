import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { ProductDetails } from "@/components/product-details";
import { ProductReviews } from "@/components/product-reviews";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { startingPrice } from "@/lib/pricing";
import { isSizeInStock } from "@/lib/product-sizes";
import { getFrames, getGlobalDiscountPercent, getProductById, getReviewsForProduct } from "@/lib/queries";
import { resolveProductImage } from "@/lib/site-images";
import { SITE_NAME, absoluteUrl, pageMetadata } from "@/lib/seo";
import { isValidObjectId } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  if (!isValidObjectId(id)) {
    return pageMetadata({
      title: "Product",
      description: "Sultani Arts calligraphy piece.",
      path: `/product/${id}`,
      index: false,
    });
  }

  const product = await getProductById(id).catch(() => null);
  if (!product) {
    return pageMetadata({
      title: "Product not found",
      description: "This Sultani Arts piece is no longer available.",
      path: `/product/${id}`,
      index: false,
    });
  }

  const categoryName =
    typeof product.category === "object" ? product.category.name : "Calligraphy";

  return pageMetadata({
    title: product.title,
    description:
      product.description.slice(0, 155) ||
      `Handmade ${categoryName.toLowerCase()} from Sultani Arts in Lahore.`,
    path: `/product/${product._id}`,
    image: resolveProductImage(product.images[0]),
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isValidObjectId(id)) notFound();

  const product = await getProductById(id).catch(() => null);
  if (!product) notFound();
  const [reviews, frames] = await Promise.all([
    getReviewsForProduct(id).catch(() => []),
    getFrames().catch(() => []),
  ]);

  const globalDiscountPercent = await getGlobalDiscountPercent().catch(() => 0);
  const price = startingPrice(product.sizes, globalDiscountPercent, product.discountPercent);
  const inStock = product.inStock && product.sizes.some((entry) => isSizeInStock(entry));
  const ratingCount = reviews.length;
  const ratingValue =
    ratingCount > 0
      ? Number(
          (reviews.reduce((sum, review) => sum + review.rating, 0) / ratingCount).toFixed(1),
        )
      : undefined;
  const image = resolveProductImage(product.images[0]);

  return (
    <main className="flex-1 px-4 py-10 sm:px-5 sm:py-12 md:px-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.title,
          description: product.description,
          image: [absoluteUrl(image)],
          brand: { "@type": "Brand", name: SITE_NAME },
          sku: product._id,
          offers: {
            "@type": "Offer",
            url: absoluteUrl(`/product/${product._id}`),
            priceCurrency: "PKR",
            price,
            availability: inStock
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            itemCondition: "https://schema.org/NewCondition",
          },
          ...(ratingValue
            ? {
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue,
                  reviewCount: ratingCount,
                },
              }
            : {}),
        }}
      />
      <div className="mx-auto max-w-5xl">
        <RevealOnScroll>
          <ProductDetails product={product} frames={frames} />
        </RevealOnScroll>
        <ProductReviews reviews={reviews} />
      </div>
    </main>
  );
}
