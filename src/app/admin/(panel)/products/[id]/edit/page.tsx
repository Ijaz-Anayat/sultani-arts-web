import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { getCategories, getProductById } from "@/lib/queries";
import { isValidObjectId } from "@/lib/utils";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isValidObjectId(id)) notFound();

  const [product, categories] = await Promise.all([getProductById(id), getCategories()]);
  if (!product) notFound();

  return (
    <div>
      <p className="font-sans text-[0.65rem] tracking-[0.28em] text-gold-deep uppercase">
        Catalogue
      </p>
      <h1 className="mt-2 mb-8 font-serif text-4xl">Edit product</h1>
      <ProductForm categories={categories} product={product} />
    </div>
  );
}
