"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, Frame as FrameIcon, ImagePlus, X } from "lucide-react";
import { framesForSize } from "@/lib/frames";
import type { CustomOrderOptions } from "@/lib/custom-order-options";
import { formatPrice } from "@/lib/pricing";

type Props = { options: CustomOrderOptions };

function dimensionsForSize(label: string) {
  const match = label.match(/\(([^)]+)\)/);
  return match?.[1]?.replace(/x/gi, "×") ?? label;
}

export function CustomOrderForm({ options }: Props) {
  const firstType = options.paintingTypes[0];
  const [typeSlug, setTypeSlug] = useState(firstType?.slug ?? "");
  const [sizeLabel, setSizeLabel] = useState(firstType?.sizes[0]?.label ?? "");
  const [frameEnabled, setFrameEnabled] = useState(false);
  const [frameId, setFrameId] = useState("");
  const [requestedText, setRequestedText] = useState("");
  const [designNotes, setDesignNotes] = useState("");
  const [referenceImageUrl, setReferenceImageUrl] = useState("");
  const [referenceImageName, setReferenceImageName] = useState("");
  const [uploadingReference, setUploadingReference] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "", city: "" });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");

  const selectedType = options.paintingTypes.find((type) => type.slug === typeSlug) ?? firstType;
  const selectedSize = selectedType?.sizes.find((size) => size.label === sizeLabel) ?? selectedType?.sizes[0];
  const availableFrames = selectedSize ? framesForSize(options.frames, selectedSize.label) : [];
  const selectedFrame = frameEnabled ? availableFrames.find((frame) => frame._id === frameId) : undefined;
  const total = (selectedSize?.price ?? 0) + (selectedFrame?.price ?? 0);

  function selectType(nextTypeSlug: string) {
    const nextType = options.paintingTypes.find((type) => type.slug === nextTypeSlug);
    const nextSizeLabel = nextType?.sizes[0]?.label ?? "";
    setTypeSlug(nextTypeSlug);
    setSizeLabel(nextSizeLabel);
    setFrameId(
      frameEnabled
        ? framesForSize(options.frames, nextSizeLabel)[0]?._id ?? ""
        : "",
    );
  }

  function selectSize(nextSizeLabel: string) {
    setSizeLabel(nextSizeLabel);
    const nextFrames = framesForSize(options.frames, nextSizeLabel);
    setFrameId(frameEnabled ? nextFrames[0]?._id ?? "" : "");
  }

  function toggleFrame(enabled: boolean) {
    setFrameEnabled(enabled);
    setFrameId(enabled ? availableFrames[0]?._id ?? "" : "");
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);

    try {
      const response = await fetch("/api/custom-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paintingTypeSlug: selectedType?.slug,
          size: selectedSize?.label,
          frameId: selectedFrame?._id,
          requestedText,
          designNotes,
          referenceImageUrl,
          customer,
        }),
      });
      const body = (await response.json()) as { _id?: string; error?: string };
      if (!response.ok || !body._id) {
        setError(body.error || "Could not place your custom order");
        return;
      }
      setOrderId(body._id);
    } catch {
      setError("A connection error prevented your order from being placed. Please try again.");
    } finally {
      setPending(false);
    }
  }

  if (orderId) {
    return (
      <section className="border border-line bg-cream/50 px-6 py-14 text-center sm:px-10">
        <span className="mx-auto flex h-11 w-11 items-center justify-center border border-gold text-gold-deep">
          <Check size={20} />
        </span>
        <p className="mt-5 font-sans text-[0.65rem] tracking-[0.28em] text-gold-deep uppercase">
          Commission received
        </p>
        <h2 className="mt-2 font-serif text-3xl">We will be in touch</h2>
        <p className="mx-auto mt-3 max-w-lg font-sans text-sm leading-7 text-muted">
          Your custom order is saved. Our studio will confirm the calligraphy details and
          delivery with you shortly.
        </p>
        <p className="mt-5 font-sans text-xs tracking-[0.14em] text-muted uppercase">
          Reference {orderId} · {formatPrice(total)}
        </p>
        <Link href="/shop" className="mt-7 inline-block bg-ink px-6 py-3 font-sans text-xs tracking-[0.2em] text-ivory uppercase">
          Continue browsing
        </Link>
      </section>
    );
  }

  if (!selectedType || !selectedSize) {
    return (
      <p className="border border-line bg-cream/40 p-6 font-serif text-lg text-muted">
        Custom pricing is not available right now. Please contact the studio to place a commission.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section className="space-y-8">
        <div>
          <label htmlFor="painting-type" className="font-sans text-[0.65rem] tracking-[0.22em] text-muted uppercase">
            Painting type
          </label>
          <select
            id="painting-type"
            value={selectedType.slug}
            onChange={(event) => selectType(event.target.value)}
            className="mt-2 w-full border border-line bg-ivory px-4 py-3 font-serif text-lg outline-none focus:border-gold"
          >
            {options.paintingTypes.map((type) => (
              <option key={type.slug} value={type.slug}>{type.name}</option>
            ))}
          </select>
          <p className="mt-2 font-sans text-xs leading-5 text-muted">
            Starting price is based on the lowest listed piece in this medium and size.
          </p>
        </div>

        <fieldset>
          <legend className="font-sans text-[0.65rem] tracking-[0.22em] text-muted uppercase">Painting size</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {selectedType.sizes.map((size) => {
              const active = size.label === selectedSize.label;
              return (
                <button
                  key={size.label}
                  type="button"
                  aria-pressed={active}
                  onClick={() => selectSize(size.label)}
                  className={`min-h-24 border px-4 py-3 text-left transition-colors ${active ? "border-ink bg-cream" : "border-line bg-ivory hover:border-gold"}`}
                >
                  <span className="block font-serif text-lg">{size.label.split(" ")[0]}</span>
                  <span className="mt-1 block font-sans text-[0.62rem] tracking-[0.08em] text-muted uppercase">
                    {dimensionsForSize(size.label)}
                  </span>
                  <span className="mt-3 block font-sans text-sm">From {formatPrice(size.price)}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <section className="border-t border-line pt-6">
          <label className="flex cursor-pointer items-center justify-between gap-4">
            <span>
              <span className="block font-serif text-xl">Include a frame</span>
              <span className="mt-1 block font-sans text-xs text-muted">Frame dimensions follow the selected painting size.</span>
            </span>
            <input
              type="checkbox"
              checked={frameEnabled}
              onChange={(event) => toggleFrame(event.target.checked)}
              className="h-5 w-5 accent-ink"
              aria-label="Include a frame"
            />
          </label>
          {frameEnabled && availableFrames.length > 0 ? (
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {availableFrames.map((frame) => {
                const active = frame._id === frameId;
                return (
                  <button
                    key={frame._id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFrameId(frame._id)}
                    className={`border px-3 py-3 text-left transition-colors ${active ? "border-ink bg-cream" : "border-line bg-ivory hover:border-gold"}`}
                  >
                    <FrameIcon size={16} strokeWidth={1.5} className="text-gold-deep" />
                    <span className="mt-2 block font-serif text-base">{frame.color}</span>
                    <span className="mt-1 block font-sans text-[0.62rem] text-muted">Fits {dimensionsForSize(frame.sizeLabel)}</span>
                    <span className="mt-2 block font-sans text-sm">+ {formatPrice(frame.price)}</span>
                  </button>
                );
              })}
            </div>
          ) : null}
          {frameEnabled && availableFrames.length === 0 ? (
            <p className="mt-3 font-sans text-sm text-muted">No frames are available for this size. You can continue without one.</p>
          ) : null}
        </section>

        <div className="border-t border-line pt-6">
          <h2 className="font-serif text-2xl">Your calligraphy</h2>
          <label htmlFor="requested-text" className="mt-4 block font-sans text-[0.65rem] tracking-[0.18em] text-muted uppercase">
            Verse, name, or phrase
          </label>
          <input
            id="requested-text"
            required
            maxLength={120}
            value={requestedText}
            onChange={(event) => setRequestedText(event.target.value)}
            placeholder="Enter the text you would like written"
            className="mt-2 w-full border border-line bg-ivory px-4 py-3 font-serif text-lg outline-none focus:border-gold"
          />
          <label htmlFor="design-notes" className="mt-5 block font-sans text-[0.65rem] tracking-[0.18em] text-muted uppercase">
            Design notes <span className="normal-case tracking-normal">(optional)</span>
          </label>
          <textarea
            id="design-notes"
            rows={3}
            maxLength={500}
            value={designNotes}
            onChange={(event) => setDesignNotes(event.target.value)}
            placeholder="Preferred colours, layout, or other details"
            className="mt-2 w-full resize-y border border-line bg-ivory px-4 py-3 font-sans text-sm leading-6 outline-none focus:border-gold"
          />
        </div>

        <div className="border-t border-line pt-6">
          <label htmlFor="reference-image" className="font-sans text-[0.65rem] tracking-[0.18em] text-muted uppercase">
            Reference image <span className="normal-case tracking-normal">(optional)</span>
          </label>
          <p className="mt-2 font-sans text-xs leading-5 text-muted">
            Share an image for visual context. JPG, PNG, or WebP, up to 4 MB.
          </p>
          {referenceImageUrl ? (
            <div className="mt-3 flex items-center gap-3 border border-line bg-ivory p-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-parchment">
                <Image src={referenceImageUrl} alt="Uploaded reference" fill sizes="64px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-sans text-sm">{referenceImageName}</p>
                <p className="mt-1 font-sans text-xs text-muted">Uploaded</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setReferenceImageUrl("");
                  setReferenceImageName("");
                }}
                aria-label="Remove reference image"
                className="flex h-9 w-9 shrink-0 items-center justify-center text-muted hover:text-ink"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label htmlFor="reference-image" className="mt-3 flex min-h-12 w-fit cursor-pointer items-center gap-2 border border-line bg-ivory px-4 py-3 font-sans text-xs tracking-[0.12em] uppercase hover:border-gold">
              <ImagePlus size={16} strokeWidth={1.5} />
              {uploadingReference ? "Uploading image…" : "Choose reference image"}
              <input
                id="reference-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                disabled={uploadingReference || pending}
                onChange={async (event) => {
                  const input = event.currentTarget;
                  const file = input.files?.[0];
                  input.value = "";
                  if (!file) return;
                  setUploadError("");
                  if (file.size > 4 * 1024 * 1024) {
                    setUploadError("Image must be smaller than 4 MB.");
                    return;
                  }

                  const data = new FormData();
                  data.set("file", file);
                  setUploadingReference(true);
                  try {
                    const response = await fetch("/api/custom-orders/reference-image", {
                      method: "POST",
                      body: data,
                    });
                    const result = (await response.json()) as { url?: string; error?: string };
                    if (!response.ok || !result.url) {
                      setUploadError(result.error || "Could not upload this image.");
                      return;
                    }
                    setReferenceImageUrl(result.url);
                    setReferenceImageName(file.name);
                  } catch {
                    setUploadError("A connection error prevented the image upload.");
                  } finally {
                    setUploadingReference(false);
                  }
                }}
              />
            </label>
          )}
          {uploadError ? <p role="alert" className="mt-2 font-sans text-sm text-gold-deep">{uploadError}</p> : null}
        </div>
      </section>

      <aside className="order-2 border border-line bg-cream/40 p-5 sm:p-6 lg:sticky lg:top-28 lg:order-none lg:self-start">
        <p className="font-sans text-[0.62rem] tracking-[0.22em] text-gold-deep uppercase">Order summary</p>
        <h2 className="mt-2 font-serif text-2xl">Your commission</h2>
        <dl className="mt-5 space-y-3 border-y border-line py-4 font-sans text-sm">
          <div className="flex justify-between gap-4"><dt className="text-muted">Type</dt><dd className="text-right">{selectedType.name}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-muted">Size</dt><dd className="text-right">{dimensionsForSize(selectedSize.label)}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-muted">Painting</dt><dd className="text-right">{formatPrice(selectedSize.price)}</dd></div>
          {selectedFrame ? (
            <div className="flex justify-between gap-4"><dt className="text-muted">{selectedFrame.color} frame · {dimensionsForSize(selectedFrame.sizeLabel)}</dt><dd className="text-right">{formatPrice(selectedFrame.price)}</dd></div>
          ) : (
            <div className="flex justify-between gap-4"><dt className="text-muted">Frame</dt><dd className="text-right">Not included</dd></div>
          )}
          <div className="flex justify-between gap-4"><dt className="text-muted">Calligraphy</dt><dd className="max-w-[65%] text-right">{requestedText.trim() || "Your chosen text"}</dd></div>
        </dl>
        <div className="flex items-baseline justify-between gap-4 pt-4">
          <span className="font-sans text-xs tracking-[0.16em] uppercase">Estimated total</span>
          <span className="font-serif text-2xl">{formatPrice(total)}</span>
        </div>
        <p className="mt-3 font-sans text-xs leading-5 text-muted">The studio will confirm your design and delivery details after receiving the commission.</p>
      </aside>

      <section className="order-3 border-t border-line pt-6 lg:order-none lg:col-start-1">
        <h2 className="font-serif text-2xl">Delivery details</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input required maxLength={100} autoComplete="name" placeholder="Full name" value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} className="border border-line bg-ivory px-4 py-3 outline-none focus:border-gold" />
          <input required maxLength={32} autoComplete="tel" placeholder="Phone" value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} className="border border-line bg-ivory px-4 py-3 outline-none focus:border-gold" />
          <input required maxLength={100} autoComplete="address-level2" placeholder="City" value={customer.city} onChange={(event) => setCustomer({ ...customer, city: event.target.value })} className="border border-line bg-ivory px-4 py-3 outline-none focus:border-gold" />
          <input required maxLength={300} autoComplete="street-address" placeholder="Delivery address" value={customer.address} onChange={(event) => setCustomer({ ...customer, address: event.target.value })} className="border border-line bg-ivory px-4 py-3 outline-none focus:border-gold sm:col-span-2" />
        </div>
        {error ? <p role="alert" className="mt-4 font-sans text-sm text-gold-deep">{error}</p> : null}
        <button type="submit" disabled={pending || uploadingReference || (frameEnabled && availableFrames.length > 0 && !selectedFrame)} className="mt-5 w-full bg-ink px-5 py-3.5 font-sans text-[0.68rem] tracking-[0.2em] text-ivory uppercase transition-colors hover:bg-gold-deep disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto">
          {pending ? "Submitting commission…" : `Place custom order · ${formatPrice(total)}`}
        </button>
      </section>
    </form>
  );
}