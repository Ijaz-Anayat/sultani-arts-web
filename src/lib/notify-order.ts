import { Resend } from "resend";
import { formatPrice } from "@/lib/pricing";

type OrderNotifyItem = {
  title: string;
  size: string;
  price: number;
  quantity: number;
  frameColor?: string;
  framePrice?: number;
  paintingType?: string;
  requestedText?: string;
  designNotes?: string;
  frameSize?: string;
  referenceImageUrl?: string;
};

type OrderNotifyPayload = {
  orderId: string;
  customer: {
    name: string;
    email?: string;
    phone: string;
    address: string;
    city: string;
  };
  items: OrderNotifyItem[];
  totalAmount: number;
  cashOnDelivery?: boolean;
  cashOnDeliveryFee?: number;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function cleanEnv(value?: string) {
  let next = value?.trim() ?? "";
  if (
    (next.startsWith('"') && next.endsWith('"')) ||
    (next.startsWith("'") && next.endsWith("'"))
  ) {
    next = next.slice(1, -1).trim();
  }
  return next.replace(/^RESEND_API_KEY=/i, "").replace(/^RESEND_FROM=/i, "").trim();
}

function siteUrl() {
  const raw = process.env.NEXTAUTH_URL?.trim() || "https://sultani-arts-web.vercel.app";
  return raw.replace(/\/$/, "");
}

function buildOrderEmailHtml(payload: OrderNotifyPayload) {
  const adminUrl = `${siteUrl()}/admin/orders`;
  const itemRows = payload.items
    .map((item, index) => {
      const background = index % 2 === 0 ? "#faf6f0" : "#f3ece3";
      const lineTotal = formatPrice(item.price * item.quantity);
      return `
        <tr>
          <td style="padding:14px 16px;border-bottom:1px solid #e4d9c8;background:${background};vertical-align:top;">
            <p style="margin:0 0 4px;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.4;color:#1c1814;">
              ${escapeHtml(item.title)}
            </p>
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#8c6a35;">
              ${escapeHtml(item.size)}${item.frameColor ? ` · ${escapeHtml(item.frameColor)} frame` : ""}
            </p>
            ${item.paintingType ? `<p style="margin:6px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:#3f3831;">${escapeHtml(item.paintingType)} · “${escapeHtml(item.requestedText ?? "")}"${item.frameSize ? ` · Frame ${escapeHtml(item.frameSize)}` : ""}${item.designNotes ? `<br>${escapeHtml(item.designNotes)}` : ""}${item.referenceImageUrl ? `<br><a href="${escapeHtml(item.referenceImageUrl)}">View reference image</a>` : ""}</p>` : ""}
          </td>
          <td align="center" style="padding:14px 12px;border-bottom:1px solid #e4d9c8;background:${background};font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#3f3831;white-space:nowrap;">
            ${item.quantity}
          </td>
          <td align="right" style="padding:14px 16px;border-bottom:1px solid #e4d9c8;background:${background};font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1c1814;white-space:nowrap;">
            ${escapeHtml(formatPrice(item.price))}
          </td>
          <td align="right" style="padding:14px 16px;border-bottom:1px solid #e4d9c8;background:${background};font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#1c1814;white-space:nowrap;">
            ${escapeHtml(lineTotal)}
          </td>
        </tr>
      `;
    })
    .join("");

  const detailRow = (label: string, value: string) => `
    <tr>
      <td width="120" style="padding:8px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#8c6a35;vertical-align:top;">
        ${label}
      </td>
      <td style="padding:8px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#1c1814;">
        ${value}
      </td>
    </tr>
  `;

  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:#ebe2d4;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ebe2d4;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:#faf6f0;border:1px solid #e4d9c8;">
            <tr>
              <td style="background:#1c1814;padding:28px 32px 24px;">
                <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#c4a574;">
                  Sultani Arts
                </p>
                <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.2;font-weight:normal;color:#faf6f0;">
                  New order received
                </h1>
                <p style="margin:10px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#c4a574;">
                  ${escapeHtml(formatPrice(payload.totalAmount))} · ${escapeHtml(payload.customer.name)}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px 8px;">
                <p style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#8c6a35;">
                  Customer
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  ${detailRow("Name", escapeHtml(payload.customer.name))}
                  ${payload.customer.email ? detailRow("Email", escapeHtml(payload.customer.email)) : ""}
                  ${detailRow("Phone", escapeHtml(payload.customer.phone))}
                  ${detailRow("City", escapeHtml(payload.customer.city))}
                  ${detailRow("Address", escapeHtml(payload.customer.address))}
                  ${detailRow("Order", escapeHtml(payload.orderId))}
                  ${payload.cashOnDelivery ? detailRow("Payment", "Cash on delivery") : ""}
                  ${payload.cashOnDelivery ? detailRow("Cash-on-delivery fee", escapeHtml(formatPrice(payload.cashOnDeliveryFee ?? 0))) : ""}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px 8px;">
                <p style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#8c6a35;">
                  Items
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e4d9c8;">
                  <tr>
                    <th align="left" style="padding:10px 16px;background:#1c1814;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#c4a574;font-weight:normal;">
                      Piece
                    </th>
                    <th align="center" style="padding:10px 12px;background:#1c1814;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#c4a574;font-weight:normal;">
                      Qty
                    </th>
                    <th align="right" style="padding:10px 16px;background:#1c1814;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#c4a574;font-weight:normal;">
                      Price
                    </th>
                    <th align="right" style="padding:10px 16px;background:#1c1814;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#c4a574;font-weight:normal;">
                      Total
                    </th>
                  </tr>
                  ${itemRows}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 8px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#8c6a35;">
                      Order total
                    </td>
                    <td align="right" style="font-family:Georgia,'Times New Roman',serif;font-size:24px;color:#1c1814;">
                      ${escapeHtml(formatPrice(payload.totalAmount))}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:24px 32px 32px;">
                <a href="${escapeHtml(adminUrl)}" style="display:inline-block;background:#1c1814;color:#faf6f0;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;text-decoration:none;padding:14px 28px;">
                  Open orders
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildCustomerOrderEmailHtml(payload: OrderNotifyPayload) {
  const itemRows = payload.items
    .map((item, index) => {
      const background = index % 2 === 0 ? "#faf6f0" : "#f3ece3";
      return `
        <tr>
          <td style="padding:14px 16px;border-bottom:1px solid #e4d9c8;background:${background};vertical-align:top;">
            <p style="margin:0 0 4px;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.4;color:#1c1814;">
              ${escapeHtml(item.title)}
            </p>
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#8c6a35;">
              ${escapeHtml(item.size)}${item.frameColor ? ` · ${escapeHtml(item.frameColor)} frame` : ""}
            </p>
          </td>
          <td align="center" style="padding:14px 12px;border-bottom:1px solid #e4d9c8;background:${background};font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#3f3831;">
            ${item.quantity}
          </td>
          <td align="right" style="padding:14px 16px;border-bottom:1px solid #e4d9c8;background:${background};font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1c1814;white-space:nowrap;">
            ${escapeHtml(formatPrice(item.price * item.quantity))}
          </td>
        </tr>
      `;
    })
    .join("");

  const detailRow = (label: string, value: string) => `
    <tr>
      <td width="120" style="padding:8px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#8c6a35;vertical-align:top;">
        ${label}
      </td>
      <td style="padding:8px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#1c1814;">
        ${value}
      </td>
    </tr>
  `;

  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:#ebe2d4;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ebe2d4;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:#faf6f0;border:1px solid #e4d9c8;">
            <tr>
              <td style="background:#1c1814;padding:28px 32px 24px;">
                <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#c4a574;">
                  Sultani Arts
                </p>
                <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.2;font-weight:normal;color:#faf6f0;">
                  Thank you for your order
                </h1>
                <p style="margin:10px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#c4a574;">
                  Order reference: ${escapeHtml(payload.orderId)}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px 8px;">
                <p style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#1c1814;">
                  Dear ${escapeHtml(payload.customer.name)},
                </p>
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;color:#3f3831;">
                  We have received your order and our team will contact you shortly to confirm it. Here is a summary for your records.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px 8px;">
                <p style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#8c6a35;">
                  Order details
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  ${detailRow("Reference", escapeHtml(payload.orderId))}
                  ${detailRow("Delivery city", escapeHtml(payload.customer.city))}
                  ${detailRow("Address", escapeHtml(payload.customer.address))}
                  ${detailRow("Payment", payload.cashOnDelivery ? "Cash on delivery" : "Our team will confirm payment")}
                  ${payload.cashOnDelivery ? detailRow("COD fee", escapeHtml(formatPrice(payload.cashOnDeliveryFee ?? 0))) : ""}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px 8px;">
                <p style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#8c6a35;">
                  Items
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e4d9c8;">
                  <tr>
                    <th align="left" style="padding:10px 16px;background:#1c1814;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#c4a574;font-weight:normal;">Piece</th>
                    <th align="center" style="padding:10px 12px;background:#1c1814;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#c4a574;font-weight:normal;">Qty</th>
                    <th align="right" style="padding:10px 16px;background:#1c1814;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#c4a574;font-weight:normal;">Total</th>
                  </tr>
                  ${itemRows}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 8px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#8c6a35;">Order total</td>
                    <td align="right" style="font-family:Georgia,'Times New Roman',serif;font-size:24px;color:#1c1814;">${escapeHtml(formatPrice(payload.totalAmount))}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px 32px;">
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.7;color:#3f3831;">
                  If you have any questions, reply to this email and our team will be happy to help.
                  <br /><br />
                  Warm regards,<br />Sultani Arts
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function notifyNewOrder(payload: OrderNotifyPayload) {
  const apiKey = cleanEnv(process.env.RESEND_API_KEY);
  const to = cleanEnv(process.env.ORDER_NOTIFY_EMAIL);
  const from = cleanEnv(process.env.RESEND_FROM) || "Sultani Arts <onboarding@resend.dev>";

  if (!apiKey || !to) {
    throw new Error("Order email not sent: RESEND_API_KEY or ORDER_NOTIFY_EMAIL is missing");
  }

  const itemsText = payload.items
    .map(
      (item) =>
        `- ${item.title} (${item.size}${item.frameColor ? `, ${item.frameColor} frame` : ""}) × ${item.quantity} = ${formatPrice(item.price * item.quantity)}${item.paintingType ? `\n  Type: ${item.paintingType}\n  Calligraphy: ${item.requestedText ?? ""}${item.designNotes ? `\n  Notes: ${item.designNotes}` : ""}${item.referenceImageUrl ? `\n  Reference image: ${item.referenceImageUrl}` : ""}` : ""}`,
    )
    .join("\n");

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject: `New order · ${formatPrice(payload.totalAmount)} · ${payload.customer.name}`,
    text: [
      "A new Sultani Arts order was placed.",
      "",
      `Order: ${payload.orderId}`,
      `Name: ${payload.customer.name}`,
      ...(payload.customer.email ? [`Email: ${payload.customer.email}`] : []),
      `Phone: ${payload.customer.phone}`,
      `City: ${payload.customer.city}`,
      `Address: ${payload.customer.address}`,
      `Payment: ${payload.cashOnDelivery ? "Cash on delivery" : "Not specified"}`,
      ...(payload.cashOnDelivery
        ? [`Cash-on-delivery fee: ${formatPrice(payload.cashOnDeliveryFee ?? 0)}`]
        : []),
      "",
      "Items:",
      itemsText,
      "",
      `Total: ${formatPrice(payload.totalAmount)}`,
    ].join("\n"),
    html: buildOrderEmailHtml(payload),
  });

  if (error) {
    throw new Error(error.message);
  }

  console.info("Order email accepted by Resend", {
    orderId: payload.orderId,
    emailId: data?.id,
  });
}

export async function sendCustomerOrderConfirmation(payload: OrderNotifyPayload) {
  if (!payload.customer.email) {
    throw new Error("Customer order confirmation email requires a customer email address");
  }

  const apiKey = cleanEnv(process.env.RESEND_API_KEY);
  if (!apiKey) {
    throw new Error("Customer order confirmation email not sent: RESEND_API_KEY is missing");
  }

  const from = cleanEnv(process.env.RESEND_FROM) || "Sultani Arts <onboarding@resend.dev>";
  const itemsText = payload.items
    .map(
      (item) =>
        `- ${item.title} (${item.size}${item.frameColor ? `, ${item.frameColor} frame` : ""}) × ${item.quantity} — ${formatPrice(item.price * item.quantity)}`,
    )
    .join("\n");
  const paymentText = payload.cashOnDelivery
    ? `Cash on delivery\nCOD fee: ${formatPrice(payload.cashOnDeliveryFee ?? 0)}`
    : "Our team will confirm payment";

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from,
    to: payload.customer.email,
    replyTo: cleanEnv(process.env.ORDER_NOTIFY_EMAIL) || undefined,
    subject: `Order received · ${payload.orderId} · Sultani Arts`,
    text: [
      `Dear ${payload.customer.name},`,
      "",
      "Thank you for choosing Sultani Arts. We have received your order and our team will contact you shortly to confirm it.",
      "",
      `Order reference: ${payload.orderId}`,
      `Delivery city: ${payload.customer.city}`,
      `Address: ${payload.customer.address}`,
      `Payment: ${paymentText}`,
      "",
      "Items:",
      itemsText,
      "",
      `Order total: ${formatPrice(payload.totalAmount)}`,
      "",
      "If you have any questions, reply to this email and our team will be happy to help.",
      "",
      "Warm regards,",
      "Sultani Arts",
    ].join("\n"),
    html: buildCustomerOrderEmailHtml(payload),
  });

  if (error) {
    throw new Error(error.message);
  }

  console.info("Customer order confirmation accepted by Resend", {
    orderId: payload.orderId,
    emailId: data?.id,
  });
}
