import { DiscountManager } from "@/components/admin/discount-manager";
import { getGlobalDiscountPercent } from "@/lib/queries";

export default async function AdminDiscountPage() {
  const globalDiscountPercent = await getGlobalDiscountPercent();

  return (
    <div>
      <p className="font-sans text-[0.65rem] tracking-[0.28em] text-gold-deep uppercase">
        Pricing
      </p>
      <h1 className="mt-2 mb-8 font-serif text-4xl">Discount</h1>
      <DiscountManager initialGlobalDiscountPercent={globalDiscountPercent} />
    </div>
  );
}
