"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { CategoryDTO } from "@/lib/types";

export function CategoriesManager({ categories }: { categories: CategoryDTO[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setPending(true);
    const response = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const body = (await response.json()) as { error?: string };
    setPending(false);
    if (!response.ok) {
      setError(body.error || "Could not add category");
      return;
    }
    setName("");
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this category?")) return;
    const response = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    const body = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(body.error || "Could not delete category");
      return;
    }
    setError("");
    router.refresh();
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="overflow-x-auto border border-line">
        <table className="min-w-full text-left">
          <thead className="bg-cream font-sans text-[0.65rem] tracking-[0.18em] text-muted uppercase">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Pieces</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id} className="border-t border-line">
                <td className="px-4 py-3 font-serif">{category.name}</td>
                <td className="px-4 py-3 text-sm text-muted">{category.slug}</td>
                <td className="px-4 py-3">{category.productCount ?? 0}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => remove(category._id)}
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

      <form onSubmit={onSubmit} className="border border-line bg-cream/40 p-6">
        <h2 className="font-serif text-2xl">Add category</h2>
        <label className="mt-4 block">
          <span className="font-sans text-[0.65rem] tracking-[0.2em] text-muted uppercase">
            Name
          </span>
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 w-full border border-line bg-ivory px-4 py-3 outline-none focus:border-gold"
          />
        </label>
        {error ? <p className="mt-3 text-sm text-gold-deep">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="mt-5 w-full bg-ink py-3 font-sans text-[0.68rem] tracking-[0.2em] text-ivory uppercase hover:bg-gold-deep disabled:opacity-60"
        >
          {pending ? "Saving…" : "Add"}
        </button>
      </form>
    </div>
  );
}
