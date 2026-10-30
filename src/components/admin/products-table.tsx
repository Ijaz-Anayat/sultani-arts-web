"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ProductDTO } from "@/lib/types";
import { formatPrice, startingPrice } from "@/lib/pricing";
import { getTotalStock } from "@/lib/product-sizes";
import { resolveProductImage } from "@/lib/site-images";

export function ProductsTable({ products }: { products: ProductDTO[] }) {
  const router = useRouter();

  async function remove(id: string) {
    if (!confirm("Delete this product?")) return;
    const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (response.ok) router.refresh();
  }

  if (products.length === 0) {
    return <p className="text-muted">No products yet. Add the first piece.</p>;
  }

  return (
    <div className="overflow-x-auto border border-line">
      <table className="min-w-full text-left">
        <thead className="bg-cream font-sans text-[0.65rem] tracking-[0.18em] text-muted uppercase">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Home priority</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">From</th>
            <th className="px-4 py-3">Discount</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="border-t border-line">
              <td className="min-w-[240px] px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-16 w-12 shrink-0 overflow-hidden bg-parchment">
                    <Image
                      src={resolveProductImage(product.images[0])}
                      alt={product.title}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <span className="font-serif">{product.title}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-muted">
                {product.priority ?? 20}
              </td>
              <td className="px-4 py-3 text-sm text-muted">
                {typeof product.category === "object" ? product.category.name : "—"}
              </td>
              <td className="px-4 py-3">{formatPrice(startingPrice(product.sizes))}</td>
              <td className="px-4 py-3 text-sm text-muted">
                {product.discountPercent ? `${product.discountPercent}%` : "—"}
              </td>
              <td className="px-4 py-3 text-sm">{getTotalStock(product.sizes)} units</td>
              <td className="px-4 py-3 text-sm text-muted">
                {!product.inStock
                  ? "Hidden"
                  : getTotalStock(product.sizes) > 0
                    ? "Available"
                    : "Out of stock"}
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/admin/products/${product._id}/edit`}
                  className="mr-4 font-sans text-[0.65rem] tracking-[0.16em] text-gold-deep uppercase"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => remove(product._id)}
                  className="font-sans text-[0.65rem] tracking-[0.16em] text-muted uppercase hover:text-ink"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
