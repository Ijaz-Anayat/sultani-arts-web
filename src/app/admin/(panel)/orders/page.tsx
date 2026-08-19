import { OrdersTable } from "@/components/admin/orders-table";
import { connectDB } from "@/lib/mongodb";
import { serialize } from "@/lib/utils";
import { Order } from "@/models/Order";
import type { OrderDTO } from "@/lib/types";

export default async function AdminOrdersPage() {
  await connectDB();
  const orders = serialize(
    (await Order.find().sort({ createdAt: -1 }).lean()) as unknown as OrderDTO[],
  );

  return (
    <div>
      <p className="font-sans text-[0.65rem] tracking-[0.28em] text-gold-deep uppercase">
        Studio
      </p>
      <h1 className="mt-2 mb-8 font-serif text-4xl">Orders</h1>
      <OrdersTable orders={orders} />
    </div>
  );
}
