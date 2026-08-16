import Image from "next/image";

export function About() {
  return (
    <section id="about" className="px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden bg-cream">
            <Image
              src="/images/about.jpg"
              alt="Sacred manuscript and Arabic calligraphy"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="absolute -right-3 -bottom-6 hidden max-w-[220px] border border-line bg-ivory p-6 shadow-[0_20px_40px_-28px_rgba(28,24,20,0.4)] md:block lg:-right-8">
            <p className="font-script text-4xl text-gold-deep">Sultani</p>
            <p className="mt-2 font-sans text-[0.65rem] tracking-[0.2em] text-muted uppercase">
              Crafted slowly, meant to remain
            </p>
          </div>
        </div>

        <div>
          <p className="font-sans text-[0.7rem] tracking-[0.36em] text-gold-deep uppercase">
            The House
          </p>
          <h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">
            Where tradition meets
            <span className="italic text-gold-deep"> contemporary art.</span>
          </h2>
          <div className="ornament-line mt-7 w-24" />
          <div className="mt-8 space-y-5 font-sans text-[0.98rem] leading-8 text-ink-soft">
            <p>
              Sultani Arts brings together traditional calligraphy and modern
              artistic design to create meaningful pieces for homes, offices,
              and personal collections.
            </p>
            <p>
              We work with calligraphers who still sit with paper, ink, and
              silence — then compose those works into contemporary forms: gold
              leaf panels, quiet prints, and architectural wall pieces.
            </p>
            <p>
              Every work is meant to be lived with. Not as decoration, but as a
              daily companion of meaning, beauty, and cultural memory.
            </p>
          </div>
          <a
            href="#contact"
            className="mt-10 inline-flex border-b border-gold pb-1 font-sans text-[0.72rem] tracking-[0.26em] text-gold-deep uppercase transition-colors hover:border-ink hover:text-ink"
          >
            Visit the atelier
          </a>
        </div>
      </div>
    </section>
  );
}
