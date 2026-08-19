import { CheckoutForm } from "@/components/checkout-form";
import { RevealOnScroll } from "@/components/reveal-on-scroll";

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
