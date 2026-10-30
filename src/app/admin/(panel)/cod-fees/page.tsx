import { CodFeeManager } from "@/components/admin/cod-fee-manager";
import { getCashOnDeliverySettings } from "@/lib/queries";
import { CASH_ON_DELIVERY_FEE } from "@/lib/constants";

export default async function AdminCodFeesPage() {
  const { fees, sizeLabels } = await getCashOnDeliverySettings();

  return (
    <div>
      <p className="font-sans text-[0.65rem] tracking-[0.28em] text-gold-deep uppercase">
        Pricing
      </p>
      <h1 className="mt-2 mb-3 font-serif text-4xl">COD Fees</h1>
      <p className="mb-8 max-w-2xl font-sans text-sm leading-6 text-muted">
        Set an extra cash-on-delivery fee for each product size. For an order with multiple sizes,
        only the highest matching fee is charged once. Unconfigured sizes use the default{" "}
        Rs. {CASH_ON_DELIVERY_FEE} fee.
      </p>
      <CodFeeManager
        initialFees={Object.fromEntries(
          sizeLabels.map((label) => [label, fees[label] ?? CASH_ON_DELIVERY_FEE]),
        )}
      />
    </div>
  );
}
