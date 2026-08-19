import Link from "next/link";
import { ProductsTable } from "@/components/admin/products-table";
import { getProducts } from "@/lib/queries";

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-sans text-[0.65rem] tracking-[0.28em] text-gold-deep uppercase">
            Catalogue
          </p>
          <h1 className="mt-2 font-serif text-4xl">Products</h1>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-ink px-5 py-3 font-sans text-[0.68rem] tracking-[0.2em] text-ivory uppercase hover:bg-gold-deep"
        >
          Add product
        </Link>
      </div>
      <div className="mt-8">
        <ProductsTable products={products} />
      </div>
    </div>
  );
}
