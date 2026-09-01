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
              ${escapeHtml(item.size)}
            </p>
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
                  ${detailRow("Phone", escapeHtml(payload.customer.phone))}
                  ${detailRow("City", escapeHtml(payload.customer.city))}
                  ${detailRow("Address", escapeHtml(payload.customer.address))}
                  ${detailRow("Order", escapeHtml(payload.orderId))}
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

export async function notifyNewOrder(payload: OrderNotifyPayload) {
  const apiKey = cleanEnv(process.env.RESEND_API_KEY);
  const to = cleanEnv(process.env.ORDER_NOTIFY_EMAIL);
  const from = cleanEnv(process.env.RESEND_FROM) || "Sultani Arts <onboarding@resend.dev>";

  if (!apiKey || !to) {
    console.warn("Order email skipped: RESEND_API_KEY or ORDER_NOTIFY_EMAIL is missing");
    return;
  }

  const itemsText = payload.items
    .map((item) => `- ${item.title} (${item.size}) × ${item.quantity} = ${formatPrice(item.price * item.quantity)}`)
    .join("\n");

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
    html: buildOrderEmailHtml(payload),
  });

  if (error) {
    throw new Error(error.message);
  }
}
