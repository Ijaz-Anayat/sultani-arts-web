import { SITE_CONTACT } from "@/lib/constants";
import { formatPrice } from "@/lib/pricing";
import type { CartItem } from "@/lib/types";

type OrderConfirmation = {
  customerName: string;
  orderId: string;
  items: Pick<CartItem, "title" | "size" | "quantity">[];
  totalAmount: number;
  cashOnDelivery: boolean;
  cashOnDeliveryFee: number;
};

function normalizeCustomerPhone(phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);

  if (digits.length === 11 && digits.startsWith("0")) {
    digits = `92${digits.slice(1)}`;
  } else if (digits.length === 10 && digits.startsWith("3")) {
    digits = `92${digits}`;
  }

  return /^[1-9]\d{7,14}$/.test(digits) ? `+${digits}` : null;
}

export function createOrderWhatsAppUrl(phone: string, order: OrderConfirmation) {
  const customerPhone = normalizeCustomerPhone(phone);
  if (!customerPhone) return null;

  const itemLines = order.items
    .map(
      (item) =>
        `• ${item.title.replace(/[\r\n]+/g, " ")} — ${item.size} × ${item.quantity}`,
    )
    .join("\n");
  const paymentDetails = order.cashOnDelivery
    ? `Payment: Cash on Delivery\nCOD fee: ${formatPrice(order.cashOnDeliveryFee)}`
    : "Payment: As selected at checkout";
  const message = [
    "Assalamu Alaikum Sultani Arts,",
    "",
    "I have just placed an order on your website. Please confirm it.",
    "",
    `Order reference: ${order.orderId}`,
    `Customer name: ${order.customerName.replace(/[\r\n]+/g, " ").trim()}`,
    `Customer phone: ${customerPhone}`,
    "Order details:",
    itemLines,
    "",
    paymentDetails,
    `Total: ${formatPrice(order.totalAmount)}`,
    "",
    "Please contact me to confirm the order and delivery details.",
    "Thank you.",
  ].join("\n");

  const url = new URL(SITE_CONTACT.whatsappUrl);
  url.searchParams.set("text", message);
  return url.toString();
}
