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
        <p className="mb-3 font-sans text-[0.65rem] tracking-[0.2em] text-muted uppercase">
          Sizes (3 required)
        </p>
        <div className="space-y-3">
          {sizes.map((size, index) => (
            <div key={index} className="grid gap-3 sm:grid-cols-2">
              <input
                required
                value={size.label}
                onChange={(event) =>
                  setSizes((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, label: event.target.value } : item,
                    ),
                  )
                }
                className="border border-line bg-ivory px-4 py-3 outline-none focus:border-gold"
              />
              <input
                required
                type="number"
                min="0"
                step="1"
                value={size.price}
                onChange={(event) =>
                  setSizes((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index
                        ? { ...item, price: Number(event.target.value) }
                        : item,
                    ),
                  )
                }
                className="border border-line bg-ivory px-4 py-3 outline-none focus:border-gold"
              />
            </div>
          ))}
        </div>
      </div>

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
