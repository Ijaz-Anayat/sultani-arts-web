"use client";

import { useRouter } from "next/navigation";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/constants";
import type { OrderDTO } from "@/lib/types";

export function OrdersTable({ orders }: { orders: OrderDTO[] }) {
  const router = useRouter();

  async function updateStatus(id: string, status: OrderStatus) {
    await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  if (orders.length === 0) {
    return <p className="text-muted">No orders yet.</p>;
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <article key={order._id} className="border border-line bg-ivory p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl">{order.customer.name}</h2>
              <p className="mt-1 text-sm text-muted">
                {order.customer.phone} · {order.customer.city}
              </p>
              <p className="mt-1 text-sm text-muted">{order.customer.address}</p>
            </div>
            <div className="text-right">
              <p className="font-serif text-2xl">${order.totalAmount}</p>
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
            </div>
          </div>
          <ul className="mt-4 space-y-2 border-t border-line pt-4">
            {order.items.map((item, index) => (
              <li key={`${order._id}-${index}`} className="flex justify-between text-sm">
                <span>
                  {item.title} · {item.size} × {item.quantity}
                </span>
                <span>${item.price * item.quantity}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
