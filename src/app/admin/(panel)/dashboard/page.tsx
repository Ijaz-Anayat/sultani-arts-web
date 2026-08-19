import Link from "next/link";
import { getDashboardStats } from "@/lib/queries";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <p className="font-sans text-[0.65rem] tracking-[0.28em] text-gold-deep uppercase">
        Overview
      </p>
      <h1 className="mt-2 font-serif text-4xl">Dashboard</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Products" value={stats.productCount} href="/admin/products" />
        <StatCard label="Categories" value={stats.categoryCount} href="/admin/categories" />
        <StatCard label="Orders" value={stats.orderCount} href="/admin/orders" />
      </div>

      <div className="mt-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-2xl">Recent orders</h2>
          <Link
            href="/admin/orders"
            className="font-sans text-[0.68rem] tracking-[0.2em] text-gold-deep uppercase"
          >
            View all
          </Link>
        </div>
        {stats.recentOrders.length === 0 ? (
          <p className="text-muted">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto border border-line">
            <table className="min-w-full text-left">
              <thead className="bg-cream font-sans text-[0.65rem] tracking-[0.18em] text-muted uppercase">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order._id} className="border-t border-line">
                    <td className="px-4 py-3 font-serif">{order.customer.name}</td>
                    <td className="px-4 py-3">${order.totalAmount}</td>
                    <td className="px-4 py-3 capitalize">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link href={href} className="border border-line bg-cream/50 p-6 transition-colors hover:border-gold">
      <p className="font-sans text-[0.65rem] tracking-[0.22em] text-muted uppercase">{label}</p>
      <p className="mt-3 font-serif text-4xl">{value}</p>
    </Link>
  );
}
