import { Resend } from "resend";
import { formatPrice } from "@/lib/pricing";

type OrderNotifyItem = {
  title: string;
  size: string;
  price: number;
  quantity: number;
};

type OrderNotifyPayload = {
  orderId: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    city: string;
  };
  items: OrderNotifyItem[];
  totalAmount: number;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function notifyNewOrder(payload: OrderNotifyPayload) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.ORDER_NOTIFY_EMAIL?.trim();
  const from = process.env.RESEND_FROM?.trim() || "Sultani Arts <onboarding@resend.dev>";

  if (!apiKey || !to) {
    console.warn("Order email skipped: RESEND_API_KEY or ORDER_NOTIFY_EMAIL is missing");
    return;
  }

  const itemsText = payload.items
    .map((item) => `- ${item.title} (${item.size}) × ${item.quantity} = ${formatPrice(item.price * item.quantity)}`)
    .join("\n");

  const itemsHtml = payload.items
    .map(
      (item) =>
        `<li>${escapeHtml(item.title)} (${escapeHtml(item.size)}) × ${item.quantity} — ${escapeHtml(
          formatPrice(item.price * item.quantity),
        )}</li>`,
    )
    .join("");

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    subject: `New order · ${formatPrice(payload.totalAmount)} · ${payload.customer.name}`,
    text: [
      "A new Sultani Arts order was placed.",
      "",
      `Order: ${payload.orderId}`,
      `Name: ${payload.customer.name}`,
      `Phone: ${payload.customer.phone}`,
      `City: ${payload.customer.city}`,
      `Address: ${payload.customer.address}`,
      "",
      "Items:",
      itemsText,
      "",
      `Total: ${formatPrice(payload.totalAmount)}`,
    ].join("\n"),
    html: `
      <p>A new Sultani Arts order was placed.</p>
      <p>
        <strong>Order:</strong> ${escapeHtml(payload.orderId)}<br />
        <strong>Name:</strong> ${escapeHtml(payload.customer.name)}<br />
        <strong>Phone:</strong> ${escapeHtml(payload.customer.phone)}<br />
        <strong>City:</strong> ${escapeHtml(payload.customer.city)}<br />
        <strong>Address:</strong> ${escapeHtml(payload.customer.address)}
      </p>
      <p><strong>Items</strong></p>
      <ul>${itemsHtml}</ul>
      <p><strong>Total: ${escapeHtml(formatPrice(payload.totalAmount))}</strong></p>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
}
