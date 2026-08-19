import { notFound } from "next/navigation";
import { ProductDetails } from "@/components/product-details";
import { getProductById } from "@/lib/queries";
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

  return (
    <main className="flex-1 px-4 py-12 sm:px-5 sm:py-16 md:px-8">
      <div className="mx-auto max-w-[1400px]">
        <ProductDetails product={product} />
      </div>
    </main>
  );
}
