import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { CACHE_TAGS, revalidateStoreTags } from "@/lib/cache-tags";
import { connectDB } from "@/lib/mongodb";
import { isValidObjectId, serialize } from "@/lib/utils";
import { getDiscountedPrice } from "@/lib/pricing";
import { getGlobalDiscountPercent } from "@/lib/queries";
import { frameMatchesSize } from "@/lib/frames";
import { notifyNewOrder } from "@/lib/notify-order";
import { getSizeStock } from "@/lib/product-sizes";
import { Order } from "@/models/Order";
import { Frame } from "@/models/Frame";
import { Product } from "@/models/Product";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(serialize(orders));
  } catch (err) {
    console.error("List orders failed", err);
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      customer?: {
        name?: string;
        phone?: string;
        address?: string;
        city?: string;
      };
      items?: Array<{
        productId?: string;
        size?: string;
        quantity?: number;
        frameId?: string;
      }>;
    };

    const name = body.customer?.name?.trim();
    const phone = body.customer?.phone?.trim();
    const address = body.customer?.address?.trim();
    const city = body.customer?.city?.trim();

    if (!name || !phone || !address || !city) {
      return NextResponse.json(
        { error: "Name, phone, address, and city are required" },
        { status: 400 },
      );
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    await connectDB();
    const globalDiscountPercent = await getGlobalDiscountPercent();

    const items = [];
    const stockUpdates: Array<{ productId: string; sizeLabel: string; quantity: number }> = [];

    for (const item of body.items) {
      const quantity = Math.max(1, Math.floor(Number(item.quantity) || 0));
      if (!item.productId || !isValidObjectId(item.productId) || !item.size || quantity < 1) {
        return NextResponse.json({ error: "Each item needs a product, size, and quantity" }, { status: 400 });
      }

      const product = await Product.findById(item.productId).lean();
      if (!product) {
        return NextResponse.json({ error: "A product in the cart is no longer available" }, { status: 400 });
      }

      if (!product.inStock) {
        return NextResponse.json(
          { error: `${product.title} is currently unavailable` },
          { status: 400 },
        );
      }

      const size = product.sizes.find((entry) => entry.label === item.size);
      if (!size) {
        return NextResponse.json(
          { error: `Size "${item.size}" is not available for ${product.title}` },
          { status: 400 },
        );
      }

      const availableStock = getSizeStock(size);
      if (availableStock < quantity) {
        return NextResponse.json(
          {
            error: `Only ${availableStock} left in stock for ${product.title} (${size.label})`,
          },
          { status: 400 },
        );
      }

      const unitPrice = getDiscountedPrice(
        size.price,
        globalDiscountPercent,
        product.discountPercent ?? 0,
      );

      let frameColor: string | undefined;
      let framePrice = 0;
      if (item.frameId) {
        if (!isValidObjectId(item.frameId)) {
          return NextResponse.json({ error: "Selected frame is invalid" }, { status: 400 });
        }
        const frame = await Frame.findById(item.frameId).lean();
        if (!frame || !frameMatchesSize(frame.sizeLabel, size.label)) {
          return NextResponse.json(
            { error: `Selected frame is not available for ${product.title}` },
            { status: 400 },
          );
        }
        frameColor = frame.color;
        framePrice = frame.price;
      }

      items.push({
        product: product._id,
        title: product.title,
        image: product.images[0],
        size: size.label,
        price: unitPrice + framePrice,
        quantity,
        frameColor,
        framePrice: framePrice || undefined,
      });

      stockUpdates.push({
        productId: String(product._id),
        sizeLabel: size.label,
        quantity,
      });
    }

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      customer: { name, phone, address, city },
      items,
      totalAmount,
      status: "pending",
    });

    for (const update of stockUpdates) {
      const productDoc = await Product.findById(update.productId);
      if (!productDoc) continue;

      const sizeEntry = productDoc.sizes.find((entry) => entry.label === update.sizeLabel);
      if (!sizeEntry) continue;

      sizeEntry.stock = Math.max(0, getSizeStock(sizeEntry) - update.quantity);
      productDoc.inStock = productDoc.sizes.some((entry) => getSizeStock(entry) > 0);
      await productDoc.save();
    }

    revalidateStoreTags(CACHE_TAGS.products);

    try {
      await notifyNewOrder({
        orderId: String(order._id),
        customer: { name, phone, address, city },
        items,
        totalAmount,
      });
    } catch (notifyError) {
      console.error("Order email failed", notifyError);
    }

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error("Create order failed", err);
    return NextResponse.json({ error: "Could not place order" }, { status: 500 });
  }
}
