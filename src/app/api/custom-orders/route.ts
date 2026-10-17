import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getCustomOrderOptions } from "@/lib/custom-order-options";
import { frameMatchesSize } from "@/lib/frames";
import { notifyNewOrder } from "@/lib/notify-order";
import { Order } from "@/models/Order";

type CustomOrderBody = {
  paintingTypeSlug?: string;
  size?: string;
  frameId?: string;
  referenceImageUrl?: string;
  requestedText?: string;
  designNotes?: string;
  customer?: {
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
  };
};

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    let body: CustomOrderBody;
    try {
      const payload: unknown = await request.json();
      if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
        return NextResponse.json({ error: "Request body must be a JSON object" }, { status: 400 });
      }
      body = payload as CustomOrderBody;
    } catch {
      return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
    }

    const name = cleanString(body.customer?.name);
    const phone = cleanString(body.customer?.phone);
    const address = cleanString(body.customer?.address);
    const city = cleanString(body.customer?.city);
    const requestedText = cleanString(body.requestedText);
    const designNotes = cleanString(body.designNotes);
    const referenceImageUrl = cleanString(body.referenceImageUrl);

    if (!name || !phone || !address || !city || !requestedText) {
      return NextResponse.json({ error: "Complete the calligraphy and delivery details" }, { status: 400 });
    }
    if (name.length > 100 || phone.length > 32 || address.length > 300 || city.length > 100 || requestedText.length > 120 || designNotes.length > 500 || referenceImageUrl.length > 1000) {
      return NextResponse.json({ error: "One or more fields exceed the allowed length" }, { status: 400 });
    }
    if (referenceImageUrl) {
      try {
        const referenceUrl = new URL(referenceImageUrl);
        if (
          referenceUrl.protocol !== "https:" ||
          referenceUrl.hostname !== "res.cloudinary.com" ||
          !referenceUrl.pathname.includes("/sultani-arts/custom-order-references/")
        ) {
          return NextResponse.json({ error: "Reference image URL is invalid" }, { status: 400 });
        }
      } catch {
        return NextResponse.json({ error: "Reference image URL is invalid" }, { status: 400 });
      }
    }

    const options = await getCustomOrderOptions();
    const paintingType = options.paintingTypes.find((type) => type.slug === body.paintingTypeSlug);
    const size = paintingType?.sizes.find((entry) => entry.label === body.size);
    if (!paintingType || !size) {
      return NextResponse.json({ error: "That painting type or size is no longer available" }, { status: 400 });
    }

    await connectDB();
    let frame: (typeof options.frames)[number] | undefined;
    if (body.frameId) {
      frame = options.frames.find((entry) => entry._id === body.frameId);
      if (!frame || !frameMatchesSize(frame.sizeLabel, size.label)) {
        return NextResponse.json({ error: "That frame does not fit the selected painting size" }, { status: 400 });
      }
    }

    const totalAmount = size.price + (frame?.price ?? 0);
    const item = {
      title: `Custom ${paintingType.name} commission`,
      size: size.label,
      price: totalAmount,
      quantity: 1,
      frameColor: frame?.color,
      framePrice: frame?.price,
      paintingType: paintingType.name,
      requestedText,
      designNotes: designNotes || undefined,
      frameSize: frame?.sizeLabel,
      referenceImageUrl: referenceImageUrl || undefined,
    };
    const customer = { name, phone, address, city };

    const order = await Order.create({
      customer,
      items: [item],
      totalAmount,
      status: "pending",
    });

    try {
      await notifyNewOrder({
        orderId: String(order._id),
        customer,
        items: [item],
        totalAmount,
      });
    } catch (notifyError) {
      console.error("Custom order email failed", notifyError);
    }

    return NextResponse.json({ _id: String(order._id) }, { status: 201 });
  } catch (err) {
    console.error("Create custom order failed", err);
    return NextResponse.json({ error: "Could not place your custom order" }, { status: 500 });
  }
}