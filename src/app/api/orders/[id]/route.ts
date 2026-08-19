import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { connectDB } from "@/lib/mongodb";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/constants";
import { isValidObjectId } from "@/lib/utils";
import { Order } from "@/models/Order";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: RouteContext) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  try {
    const body = (await request.json()) as { status?: string };
    const status = body.status as OrderStatus | undefined;
    if (!status || !ORDER_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid order status" }, { status: 400 });
    }

    await connectDB();
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (err) {
    console.error("Update order failed", err);
    return NextResponse.json({ error: "Could not update order" }, { status: 500 });
  }
}
