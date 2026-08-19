"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { DEFAULT_SIZES } from "@/lib/constants";
import type { CategoryDTO, ProductDTO, ProductSize } from "@/lib/types";

type Props = {
  categories: CategoryDTO[];
  product?: ProductDTO;
};

export function ProductForm({ categories, product }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(product?.title ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [category, setCategory] = useState(
    typeof product?.category === "object" ? product.category._id : (product?.category ?? ""),
  );
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [sizes, setSizes] = useState<ProductSize[]>(
    product?.sizes?.length === 3
      ? product.sizes
      : DEFAULT_SIZES.map((size) => ({ ...size })),
  );
  const [inStock, setInStock] = useState(product?.inStock ?? true);
  const [discountPercent, setDiscountPercent] = useState(product?.discountPercent ?? 0);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      for (const file of Array.from(files)) {
        const data = new FormData();
        data.append("file", file);
        const response = await fetch("/api/upload", { method: "POST", body: data });
        const payload = (await response.json()) as { url?: string; error?: string };
        if (!response.ok || !payload.url) {
          throw new Error(payload.error || "Upload failed");
        }
        setImages((current) => [...current, payload.url as string]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setPending(true);

    const payload = {
      title,
      description,
      images,
      category,
      sizes,
      inStock,
      discountPercent,
    };

    const response = await fetch(
      product ? `/api/products/${product._id}` : "/api/products",
      {
        method: product ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    const body = (await response.json()) as { error?: string };
    setPending(false);

    if (!response.ok) {
      setError(body.error || "Could not save product");
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-6">
      <label className="block">
        <span className="font-sans text-[0.65rem] tracking-[0.2em] text-muted uppercase">
          Title
        </span>
        <input
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="mt-2 w-full border border-line bg-ivory px-4 py-3 outline-none focus:border-gold"
        />
      </label>

      <label className="block">
        <span className="font-sans text-[0.65rem] tracking-[0.2em] text-muted uppercase">
          Description
        </span>
        <textarea
          required
          rows={5}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="mt-2 w-full border border-line bg-ivory px-4 py-3 outline-none focus:border-gold"
        />
      </label>

      <label className="block">
        <span className="font-sans text-[0.65rem] tracking-[0.2em] text-muted uppercase">
          Category
        </span>
        <select
          required
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="mt-2 w-full border border-line bg-ivory px-4 py-3 outline-none focus:border-gold"
        >
          <option value="">Select a category</option>
          {categories.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>

      <div>
        <p className="font-sans text-[0.65rem] tracking-[0.2em] text-muted uppercase">
          Images
        </p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(event) => uploadFiles(event.target.files)}
          className="mt-2 w-full border border-line bg-ivory px-4 py-3 font-sans text-sm"
        />
        {uploading ? (
          <p className="mt-2 text-sm text-muted">Uploading to Cloudinary…</p>
        ) : null}
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((url) => (
            <div key={url} className="relative aspect-[4/5] overflow-hidden bg-parchment">
              <Image src={url} alt="" fill className="object-cover" sizes="160px" />
              <button
                type="button"
                onClick={() => setImages((current) => current.filter((item) => item !== url))}
                className="absolute top-1 right-1 bg-ink/80 px-2 py-1 text-[0.6rem] text-ivory uppercase"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="font-sans text-[0.65rem] tracking-[0.2em] text-muted uppercase">
          Sizes & prices
        </p>
        <p className="mt-1 mb-4 font-sans text-sm text-muted">
          Each product needs 3 size options. Shop and cart use the price you enter for the selected size.
        </p>
        <div className="space-y-4">
          {sizes.map((size, index) => (
            <div key={index} className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="font-sans text-[0.65rem] tracking-[0.2em] text-muted uppercase">
                  Size {index + 1}
                </span>
                <input
                  required
                  placeholder="e.g. Small (12x16 in)"
                  value={size.label}
                  onChange={(event) =>
                    setSizes((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, label: event.target.value } : item,
                      ),
                    )
                  }
                  className="mt-2 w-full border border-line bg-ivory px-4 py-3 outline-none focus:border-gold"
                />
              </label>
              <label className="block">
                <span className="font-sans text-[0.65rem] tracking-[0.2em] text-muted uppercase">
                  Price (PKR)
                </span>
                <div className="mt-2 flex border border-line bg-ivory focus-within:border-gold">
                  <span className="flex items-center px-3 font-sans text-[0.72rem] text-muted">
                    Rs.
                  </span>
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    value={size.price || ""}
                    onChange={(event) =>
                      setSizes((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index
                            ? { ...item, price: Number(event.target.value) || 0 }
                            : item,
                        ),
                      )
                    }
                    className="min-w-0 flex-1 bg-transparent px-4 py-3 outline-none"
                  />
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="font-sans text-[0.65rem] tracking-[0.2em] text-muted uppercase">
          Product discount (%)
        </span>
        <div className="mt-2 flex border border-line bg-ivory focus-within:border-gold">
          <input
            type="number"
            min="0"
            max="100"
            step="1"
            value={discountPercent}
            onChange={(event) => setDiscountPercent(Number(event.target.value) || 0)}
            className="min-w-0 flex-1 bg-transparent px-4 py-3 outline-none"
          />
          <span className="flex items-center px-4 font-sans text-muted">%</span>
        </div>
        <p className="mt-2 font-sans text-sm text-muted">
          Extra discount for this product only. It is added to the store-wide discount from the
          Discount page.
        </p>
      </label>

      <label className="flex items-center gap-3 font-sans text-sm">
        <input
          type="checkbox"
          checked={inStock}
          onChange={(event) => setInStock(event.target.checked)}
        />
        In stock
      </label>

      {error ? <p className="text-sm text-gold-deep">{error}</p> : null}

      <button
        type="submit"
        disabled={pending || uploading}
        className="bg-ink px-8 py-3.5 font-sans text-[0.72rem] tracking-[0.24em] text-ivory uppercase transition-colors hover:bg-gold-deep disabled:opacity-60"
      >
        {pending ? "Saving…" : product ? "Update product" : "Create product"}
      </button>
    </form>
  );
}
