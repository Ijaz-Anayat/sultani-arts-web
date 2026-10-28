"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_SIZES } from "@/lib/constants";
import { formatPrice } from "@/lib/pricing";
import type { FrameDTO } from "@/lib/types";

const CUSTOM_SIZE_VALUE = "__custom_size__";

export function FramesManager({ frames }: { frames: FrameDTO[] }) {
  const router = useRouter();
  const [sizeLabel, setSizeLabel] = useState<string>(DEFAULT_SIZES[0].label);
  const [customSizeLabel, setCustomSizeLabel] = useState("");
  const [color, setColor] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSize, setEditSize] = useState("");
  const [editCustomSizeLabel, setEditCustomSizeLabel] = useState("");
  const [editColor, setEditColor] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editPending, setEditPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    const savedSizeLabel =
      sizeLabel === CUSTOM_SIZE_VALUE ? customSizeLabel.trim() : sizeLabel;
    if (!savedSizeLabel) {
      setError("Enter a label for the custom frame size.");
      return;
    }
    setPending(true);
    const response = await fetch("/api/frames", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sizeLabel: savedSizeLabel,
        color,
        price: Number(price),
      }),
    });
    const body = (await response.json()) as { error?: string };
    setPending(false);
    if (!response.ok) {
      setError(body.error || "Could not add frame");
      return;
    }
    setSizeLabel(DEFAULT_SIZES[0].label);
    setCustomSizeLabel("");
    setColor("");
    setPrice("");
    router.refresh();
  }

  function startEdit(frame: FrameDTO) {
    setEditingId(frame._id);
    const isPresetSize = DEFAULT_SIZES.some((size) => size.label === frame.sizeLabel);
    setEditSize(isPresetSize ? frame.sizeLabel : CUSTOM_SIZE_VALUE);
    setEditCustomSizeLabel(isPresetSize ? "" : frame.sizeLabel);
    setEditColor(frame.color);
    setEditPrice(String(frame.price));
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditPending(false);
  }

  async function saveEdit(id: string) {
    const savedSizeLabel =
      editSize === CUSTOM_SIZE_VALUE ? editCustomSizeLabel.trim() : editSize;
    if (!savedSizeLabel) {
      setError("Enter a label for the custom frame size.");
      return;
    }
    setEditPending(true);
    setError("");
    const response = await fetch(`/api/frames/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sizeLabel: savedSizeLabel,
        color: editColor,
        price: Number(editPrice),
      }),
    });
    const body = (await response.json()) as { error?: string };
    setEditPending(false);
    if (!response.ok) {
      setError(body.error || "Could not update frame");
      return;
    }
    cancelEdit();
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this frame option?")) return;
    const response = await fetch(`/api/frames/${id}`, { method: "DELETE" });
    const body = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(body.error || "Could not delete frame");
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
              <th className="px-4 py-3">Size</th>
              <th className="px-4 py-3">Color</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {frames.map((frame) => {
              const isEditing = editingId === frame._id;
              return (
                <tr key={frame._id} className="border-t border-line">
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <>
                        <select
                          value={
                            editSize === CUSTOM_SIZE_VALUE ||
                            !DEFAULT_SIZES.some((size) => size.label === editSize)
                              ? CUSTOM_SIZE_VALUE
                              : editSize
                          }
                          onChange={(event) => {
                            setEditSize(event.target.value);
                            if (event.target.value !== CUSTOM_SIZE_VALUE) {
                              setEditCustomSizeLabel("");
                            }
                          }}
                          className="w-full border border-line bg-ivory px-3 py-2 outline-none focus:border-gold"
                        >
                          {DEFAULT_SIZES.map((size) => (
                            <option key={size.label} value={size.label}>
                              {size.label}
                            </option>
                          ))}
                          <option value={CUSTOM_SIZE_VALUE}>Custom size</option>
                        </select>
                        {editSize === CUSTOM_SIZE_VALUE ? (
                          <input
                            required
                            value={editCustomSizeLabel}
                            onChange={(event) => setEditCustomSizeLabel(event.target.value)}
                            placeholder="e.g. 18x24 in"
                            aria-label="Custom frame size"
                            className="mt-2 w-full border border-line bg-ivory px-3 py-2 outline-none focus:border-gold"
                          />
                        ) : null}
                      </>
                    ) : (
                      <span className="font-serif">{frame.sizeLabel}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        value={editColor}
                        onChange={(event) => setEditColor(event.target.value)}
                        className="w-full border border-line bg-ivory px-3 py-2 outline-none focus:border-gold"
                      />
                    ) : (
                      frame.color
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        value={editPrice}
                        onChange={(event) => setEditPrice(event.target.value)}
                        className="w-28 border border-line bg-ivory px-3 py-2 outline-none focus:border-gold"
                      />
                    ) : (
                      formatPrice(frame.price)
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {isEditing ? (
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => saveEdit(frame._id)}
                          disabled={editPending}
                          className="font-sans text-[0.65rem] tracking-[0.16em] text-ink uppercase hover:text-gold-deep disabled:opacity-60"
                        >
                          {editPending ? "Saving…" : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="font-sans text-[0.65rem] tracking-[0.16em] text-muted uppercase hover:text-ink"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => startEdit(frame)}
                          className="font-sans text-[0.65rem] tracking-[0.16em] text-muted uppercase hover:text-ink"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(frame._id)}
                          className="font-sans text-[0.65rem] tracking-[0.16em] text-muted uppercase hover:text-ink"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <form onSubmit={onSubmit} className="border border-line bg-cream/40 p-6">
        <h2 className="font-serif text-2xl">Add frame</h2>
        <label className="mt-4 block">
          <span className="font-sans text-[0.65rem] tracking-[0.2em] text-muted uppercase">
            Size
          </span>
          <select
            value={sizeLabel}
            onChange={(event) => {
              setSizeLabel(event.target.value);
              if (event.target.value !== CUSTOM_SIZE_VALUE) {
                setCustomSizeLabel("");
              }
            }}
            className="mt-2 w-full border border-line bg-ivory px-4 py-3 outline-none focus:border-gold"
          >
            {DEFAULT_SIZES.map((size) => (
              <option key={size.label} value={size.label}>
                {size.label}
              </option>
            ))}
            <option value={CUSTOM_SIZE_VALUE}>Custom size</option>
          </select>
        </label>
        {sizeLabel === CUSTOM_SIZE_VALUE ? (
          <label className="mt-4 block">
            <span className="font-sans text-[0.65rem] tracking-[0.2em] text-muted uppercase">
              Custom size
            </span>
            <input
              required
              value={customSizeLabel}
              onChange={(event) => setCustomSizeLabel(event.target.value)}
              placeholder="e.g. 18x24 in"
              className="mt-2 w-full border border-line bg-ivory px-4 py-3 outline-none focus:border-gold"
            />
          </label>
        ) : null}
        <label className="mt-4 block">
          <span className="font-sans text-[0.65rem] tracking-[0.2em] text-muted uppercase">
            Color
          </span>
          <input
            required
            value={color}
            onChange={(event) => setColor(event.target.value)}
            placeholder="Black, Gold, Walnut…"
            className="mt-2 w-full border border-line bg-ivory px-4 py-3 outline-none focus:border-gold"
          />
        </label>
        <label className="mt-4 block">
          <span className="font-sans text-[0.65rem] tracking-[0.2em] text-muted uppercase">
            Price (PKR)
          </span>
          <input
            required
            type="number"
            min="0"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
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
