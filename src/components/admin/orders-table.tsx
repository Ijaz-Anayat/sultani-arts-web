"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, SlidersHorizontal, Trash2, X } from "lucide-react";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/constants";
import { formatPrice } from "@/lib/pricing";
import { resolveProductImage } from "@/lib/site-images";
import type { OrderDTO } from "@/lib/types";

type OrderSort = "newest" | "oldest" | "highest-total" | "lowest-total";

export function OrdersTable({ orders }: { orders: OrderDTO[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [sort, setSort] = useState<OrderSort>("newest");
  const [deleteError, setDeleteError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function updateStatus(id: string, status: OrderStatus) {
    await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  async function deleteOrder(id: string, customerName: string) {
    if (
      !window.confirm(
        `Permanently delete the order for ${customerName}? This cannot be undone.`,
      )
    ) {
      return;
    }

    setDeleteError("");
    setDeletingId(id);
    try {
      const response = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) {
        setDeleteError(body.error || "Could not delete order");
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Delete order request failed", error);
      setDeleteError("Could not delete order. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  const visibleOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders
      .filter((order) => {
        if (statusFilter !== "all" && order.status !== statusFilter) return false;
        if (!query) return true;

        const searchableText = [
          order._id,
          order.customer.name,
          order.customer.email,
          order.customer.phone,
          order.customer.city,
          order.customer.address,
          ...order.items.map((item) => item.title),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return searchableText.includes(query);
      })
      .sort((left, right) => {
        if (sort === "highest-total") return right.totalAmount - left.totalAmount;
        if (sort === "lowest-total") return left.totalAmount - right.totalAmount;

        const dateDifference =
          new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
        return sort === "newest" ? -dateDifference : dateDifference;
      });
  }, [orders, search, sort, statusFilter]);

  const hasActiveFilters = search.trim() !== "" || statusFilter !== "all";

  if (orders.length === 0) {
    return <p className="text-muted">No orders yet.</p>;
  }

  return (
    <div className="space-y-6">
      <section
        aria-label="Filter orders"
        className="border border-line bg-cream/50 p-4 sm:p-5"
      >
        <div className="mb-4 flex items-center gap-2">
          <SlidersHorizontal size={16} strokeWidth={1.6} className="text-gold-deep" />
          <p className="font-sans text-[0.65rem] tracking-[0.2em] text-muted uppercase">
            Find and filter orders
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_200px_200px]">
          <label className="relative block">
            <span className="sr-only">Search orders</span>
            <Search
              size={17}
              strokeWidth={1.7}
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search customer, email, phone, product…"
              className="w-full border border-line bg-ivory py-3 pr-4 pl-10 font-sans text-sm text-ink outline-none transition-colors placeholder:text-muted/80 focus:border-gold"
            />
          </label>
          <label>
            <span className="sr-only">Filter by status</span>
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as OrderStatus | "all")
              }
              className="w-full border border-line bg-ivory px-4 py-3 font-sans text-sm text-ink capitalize outline-none transition-colors focus:border-gold"
            >
              <option value="all">All statuses</option>
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Sort orders</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as OrderSort)}
              className="w-full border border-line bg-ivory px-4 py-3 font-sans text-sm text-ink outline-none transition-colors focus:border-gold"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="highest-total">Highest total</option>
              <option value="lowest-total">Lowest total</option>
            </select>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <p aria-live="polite" className="font-sans text-xs text-muted">
            Showing {visibleOrders.length} of {orders.length} orders
          </p>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
              }}
              className="inline-flex items-center gap-1.5 font-sans text-xs text-gold-deep transition-colors hover:text-ink"
            >
              <X size={14} aria-hidden="true" />
              Clear filters
            </button>
          ) : null}
        </div>
      </section>

      {deleteError ? (
        <p role="alert" className="font-sans text-sm text-red-700">
          {deleteError}
        </p>
      ) : null}

      {visibleOrders.length === 0 ? (
        <div className="border border-line bg-ivory px-5 py-12 text-center">
          <p className="font-serif text-xl">No matching orders</p>
          <p className="mt-2 font-sans text-sm text-muted">
            Try changing your search or status filter.
          </p>
        </div>
      ) : null}

      {visibleOrders.map((order) => (
        <article key={order._id} className="border border-line bg-ivory p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl">{order.customer.name}</h2>
              <p className="mt-1 text-sm text-muted">
                {order.customer.phone} · {order.customer.city}
              </p>
              <p className="mt-1 text-sm text-muted">
                {order.customer.email || "Email not recorded"}
              </p>
              <p className="mt-1 text-sm text-muted">
                Placed{" "}
                <time dateTime={order.createdAt}>
                  {new Intl.DateTimeFormat("en-GB", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(order.createdAt))}
                </time>
              </p>
              <p className="mt-1 text-sm text-muted">{order.customer.address}</p>
            </div>
            <div className="text-right">
              <p className="font-serif text-2xl">{formatPrice(order.totalAmount)}</p>
              {order.cashOnDelivery ? (
                <p className="mt-1 font-sans text-xs text-muted">
                  Cash on delivery · {formatPrice(order.cashOnDeliveryFee ?? 0)} fee
                </p>
              ) : null}
              <select
                value={order.status}
                onChange={(event) =>
                  updateStatus(order._id, event.target.value as OrderStatus)
                }
                className="mt-2 border border-line bg-cream px-3 py-2 font-sans text-sm capitalize"
              >
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => deleteOrder(order._id, order.customer.name)}
                disabled={deletingId !== null}
                aria-label={`Delete order for ${order.customer.name}`}
                className="mt-2 inline-flex items-center gap-1.5 border border-line px-3 py-2 font-sans text-xs text-muted transition-colors hover:border-red-300 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 size={14} aria-hidden="true" />
                {deletingId === order._id ? "Deleting…" : "Delete order"}
              </button>
            </div>
          </div>
          <ul className="mt-4 space-y-2 border-t border-line pt-4">
            {order.items.map((item, index) => (
              <li
                key={`${order._id}-${index}`}
                className="grid min-w-0 grid-cols-[48px_minmax(0,1fr)_auto] items-start gap-3 text-sm sm:grid-cols-[56px_minmax(0,1fr)_auto]"
              >
                <div className="relative h-16 w-12 overflow-hidden bg-parchment sm:h-[4.5rem] sm:w-14">
                  <Image
                    src={resolveProductImage(item.image)}
                    alt={item.title}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="break-words">
                    {item.title} · {item.size}
                    {item.frameColor ? ` · ${item.frameColor} frame` : ""} × {item.quantity}
                  </p>
                  {item.paintingType ? (
                    <p className="pt-1 text-xs text-muted">
                      {item.paintingType} · “{item.requestedText}”
                      {item.frameSize ? ` · Frame ${item.frameSize}` : ""}
                      {item.designNotes ? ` · ${item.designNotes}` : ""}
                      {item.referenceImageUrl ? (
                        <>
                          {" · "}
                          <a href={item.referenceImageUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                            Reference image
                          </a>
                        </>
                      ) : null}
                    </p>
                  ) : null}
                </div>
                <span className="text-right">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
