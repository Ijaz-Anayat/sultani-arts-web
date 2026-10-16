import type { Metadata } from "next";
import Image from "next/image";
import { CustomOrderForm } from "@/components/custom-order-form";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { getCustomOrderOptions } from "@/lib/custom-order-options";
import { pageMetadata } from "@/lib/seo";
import { SITE_IMAGES } from "@/lib/site-images";

export const metadata: Metadata = pageMetadata({
  title: "Custom Calligraphy Order",
  description:
    "Commission custom Islamic calligraphy with your choice of painting type, size, and frame.",
  path: "/custom-order",
});

export default async function CustomOrderPage() {
  const options = await getCustomOrderOptions().catch(() => ({ paintingTypes: [], frames: [] }));

  return (
    <main className="flex-1 px-4 py-12 sm:px-5 sm:py-16 md:px-8">
      <div className="mx-auto max-w-[1180px]">
        <RevealOnScroll>
          <div className="mb-10 grid gap-7 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-center">
            <div className="max-w-2xl">
              <p className="font-sans text-[0.65rem] tracking-[0.28em] text-gold-deep uppercase">
                Made for your space
              </p>
              <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Custom calligraphy</h1>
              <p className="mt-4 font-sans text-sm leading-7 text-muted">
                Choose a medium and size, then share the words you would like us to write. Your
                frame options and total update with each choice.
              </p>
            </div>
            <div className="relative aspect-[5/3] overflow-hidden bg-parchment lg:aspect-[4/3]">
              <Image
                src={SITE_IMAGES.hero}
                alt="Arabic calligraphy being written in an artist's studio"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 300px"
                className="object-cover"
              />
            </div>
          </div>
        </RevealOnScroll>
        <CustomOrderForm options={options} />
      </div>
    </main>
  );
}