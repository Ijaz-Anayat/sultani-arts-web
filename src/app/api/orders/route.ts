import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { connectDB } from "@/lib/mongodb";
import { isValidObjectId, serialize } from "@/lib/utils";
import { getDiscountedPrice } from "@/lib/pricing";
import { getGlobalDiscountPercent } from "@/lib/queries";
import { Order } from "@/models/Order";
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
    for (const item of body.items) {
      const quantity = Math.max(1, Math.floor(Number(item.quantity) || 0));
      if (!item.productId || !isValidObjectId(item.productId) || !item.size || quantity < 1) {
        return NextResponse.json({ error: "Each item needs a product, size, and quantity" }, { status: 400 });
      }

      const product = await Product.findById(item.productId).lean();
      if (!product) {
        return NextResponse.json({ error: "A product in the cart is no longer available" }, { status: 400 });
      }

      const size = product.sizes.find((entry) => entry.label === item.size);
      if (!size) {
        return NextResponse.json(
          { error: `Size "${item.size}" is not available for ${product.title}` },
          { status: 400 },
        );
      }

      const unitPrice = getDiscountedPrice(
        size.price,
        globalDiscountPercent,
        product.discountPercent ?? 0,
      );

      items.push({
        product: product._id,
        title: product.title,
        image: product.images[0],
        size: size.label,
        price: unitPrice,
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

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error("Create order failed", err);
    return NextResponse.json({ error: "Could not place order" }, { status: 500 });
  }
}
