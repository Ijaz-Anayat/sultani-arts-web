import { ProductForm } from "@/components/admin/product-form";
import { getCategories } from "@/lib/queries";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div>
      <p className="font-sans text-[0.65rem] tracking-[0.28em] text-gold-deep uppercase">
        Catalogue
      </p>
      <h1 className="mt-2 mb-8 font-serif text-4xl">New product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
