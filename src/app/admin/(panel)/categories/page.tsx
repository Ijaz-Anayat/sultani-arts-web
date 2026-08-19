import { CategoriesManager } from "@/components/admin/categories-manager";
import { getCategories } from "@/lib/queries";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <p className="font-sans text-[0.65rem] tracking-[0.28em] text-gold-deep uppercase">
        Catalogue
      </p>
      <h1 className="mt-2 mb-8 font-serif text-4xl">Categories</h1>
      <CategoriesManager categories={categories} />
    </div>
  );
}
