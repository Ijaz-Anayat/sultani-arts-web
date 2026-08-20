import { notFound } from "next/navigation";
import { ProductDetails } from "@/components/product-details";
import { ProductReviews } from "@/components/product-reviews";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { getProductById, getReviewsForProduct } from "@/lib/queries";
import { isValidObjectId } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isValidObjectId(id)) notFound();

  const product = await getProductById(id).catch(() => null);
  if (!product) notFound();
  const reviews = await getReviewsForProduct(id).catch(() => []);

  return (
    <main className="flex-1 px-4 py-10 sm:px-5 sm:py-12 md:px-8">
      <div className="mx-auto max-w-5xl">
        <RevealOnScroll>
          <ProductDetails product={product} />
        </RevealOnScroll>
        <ProductReviews reviews={reviews} />
      </div>
    </main>
  );
}
