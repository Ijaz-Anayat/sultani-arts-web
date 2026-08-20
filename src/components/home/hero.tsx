import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SITE_IMAGES } from "@/lib/site-images";

export function Hero() {
  return (
    <section className="relative isolate min-h-[calc(100svh-4.25rem)] overflow-hidden bg-ink sm:min-h-[88vh]">
      <Image
        src={SITE_IMAGES.hero}
        alt="Calligrapher writing Arabic script at the atelier desk"
        fill
        priority
        className="object-cover object-[center_45%] sm:object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/45 to-transparent sm:from-ink/85 sm:via-ink/40 sm:to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-ink/15 sm:from-ink/25" />

      <div className="relative mx-auto flex min-h-[calc(100svh-4.25rem)] max-w-[1400px] flex-col justify-end px-4 pb-10 pt-16 sm:min-h-[88vh] sm:px-5 sm:pt-28 sm:pb-16 md:justify-center md:px-8 md:pb-20 md:pt-16">
        <div className="max-w-2xl animate-fade-up text-ivory">
          <p className="mb-4 font-sans text-[0.65rem] tracking-[0.2em] text-gold-soft uppercase sm:mb-5 sm:text-[0.72rem] sm:tracking-[0.42em]">
            The Calligrapher&apos;s Atelier
          </p>
          <h1 className="font-serif text-[2.45rem] leading-[1.05] font-medium tracking-tight text-pretty sm:text-5xl sm:leading-[0.95] md:text-6xl lg:text-7xl">
            Written with soul.
            <span className="mt-1 block italic text-gold-soft sm:mt-2">
              Framed for eternity.
            </span>
          </h1>
          <p className="mt-5 max-w-lg font-sans text-[0.95rem] leading-7 text-ivory/80 sm:mt-7 sm:text-base sm:leading-8 md:text-lg">
            Original calligraphy and artistic prints — pieces that carry
            heritage, devotion, and quiet luxury into the rooms you live in.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Link
              href="/shop"
              className="inline-flex w-full items-center justify-center gap-3 bg-gold px-6 py-3.5 font-sans text-[0.68rem] tracking-[0.18em] text-ink uppercase transition-colors hover:bg-gold-soft sm:w-auto sm:px-7 sm:text-[0.72rem] sm:tracking-[0.28em]"
            >
              Explore Collection
              <ArrowRight size={15} strokeWidth={1.6} />
            </Link>
            <Link
              href="/shop"
              className="inline-flex w-full items-center justify-center gap-2 border border-ivory/35 px-6 py-3.5 font-sans text-[0.68rem] tracking-[0.18em] text-ivory uppercase transition-colors hover:border-gold-soft hover:text-gold-soft sm:w-auto sm:px-7 sm:text-[0.72rem] sm:tracking-[0.28em]"
            >
              View All Art
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
