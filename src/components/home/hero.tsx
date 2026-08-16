import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative isolate min-h-[88vh] overflow-hidden bg-ink">
      <Image
        src="/images/hero.jpg"
        alt="Arched hallway illuminated with Arabic calligraphy"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/88 via-ink/55 to-ink/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-ink/20" />

      <div className="relative mx-auto flex min-h-[88vh] max-w-[1400px] flex-col justify-end px-5 pb-16 pt-28 md:justify-center md:px-8 md:pb-20 md:pt-16">
        <div className="max-w-2xl animate-fade-up text-ivory">
          <p className="mb-5 font-sans text-[0.72rem] tracking-[0.42em] text-gold-soft uppercase">
            The Calligrapher&apos;s Atelier
          </p>
          <h1 className="font-serif text-5xl leading-[0.95] font-medium tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Written with soul.
            <span className="mt-2 block italic text-gold-soft">
              Framed for eternity.
            </span>
          </h1>
          <p className="mt-7 max-w-lg font-sans text-base leading-8 text-ivory/80 sm:text-lg">
            Original calligraphy and artistic prints — pieces that carry
            heritage, devotion, and quiet luxury into the rooms you live in.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="#collection"
              className="inline-flex items-center gap-3 bg-gold px-7 py-3.5 font-sans text-[0.72rem] tracking-[0.28em] text-ink uppercase transition-colors hover:bg-gold-soft"
            >
              Explore Collection
              <ArrowRight size={15} strokeWidth={1.6} />
            </Link>
            <Link
              href="#collection"
              className="inline-flex items-center gap-2 border border-ivory/35 px-7 py-3.5 font-sans text-[0.72rem] tracking-[0.28em] text-ivory uppercase transition-colors hover:border-gold-soft hover:text-gold-soft"
            >
              View All Art
            </Link>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute right-8 bottom-8 hidden font-sans text-[0.65rem] tracking-[0.3em] text-ivory/55 uppercase lg:block">
        Est. atelier · Sultani Arts
      </div>
    </section>
  );
}
