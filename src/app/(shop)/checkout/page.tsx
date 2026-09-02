import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Checkout",
  description: "Complete your Sultani Arts guest order.",
  path: "/checkout",
  index: false,
});

export default function CheckoutPage() {
  return (
    <main className="flex-1 px-4 py-12 sm:px-5 sm:py-16 md:px-8">
      <div className="mx-auto max-w-[1100px]">
        <RevealOnScroll>
          <CheckoutForm />
        </RevealOnScroll>
      </div>
    </main>
  );
}
