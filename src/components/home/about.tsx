import Image from "next/image";

export function About() {
  return (
    <section id="about" className="px-4 py-14 sm:px-5 sm:py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-[1400px] items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden bg-cream">
            <Image
              src="/images/about.jpg"
              alt="Sacred manuscript and Arabic calligraphy"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="mt-4 border border-line bg-ivory p-4 md:hidden">
            <p className="font-script text-3xl text-gold-deep">Sultani</p>
            <p className="mt-1 font-sans text-[0.62rem] tracking-[0.16em] text-muted uppercase">
              Crafted slowly, meant to remain
            </p>
          </div>
          <div className="absolute -right-3 -bottom-6 hidden max-w-[220px] border border-line bg-ivory p-6 shadow-[0_20px_40px_-28px_rgba(28,24,20,0.4)] md:block lg:-right-8">
            <p className="font-script text-4xl text-gold-deep">Sultani</p>
            <p className="mt-2 font-sans text-[0.65rem] tracking-[0.2em] text-muted uppercase">
              Crafted slowly, meant to remain
            </p>
          </div>
        </div>

        <div>
          <p className="font-sans text-[0.65rem] tracking-[0.22em] text-gold-deep uppercase sm:text-[0.7rem] sm:tracking-[0.36em]">
            The House
          </p>
          <h2 className="mt-3 font-serif text-3xl leading-tight sm:mt-4 sm:text-4xl md:text-5xl">
            Where tradition meets
            <span className="italic text-gold-deep"> contemporary art.</span>
          </h2>
          <div className="ornament-line mt-5 w-24 sm:mt-7" />
          <div className="mt-6 space-y-4 font-sans text-[0.95rem] leading-7 text-ink-soft sm:mt-8 sm:space-y-5 sm:text-[0.98rem] sm:leading-8">
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
            className="mt-8 inline-flex border-b border-gold pb-1 font-sans text-[0.68rem] tracking-[0.16em] text-gold-deep uppercase transition-colors hover:border-ink hover:text-ink sm:mt-10 sm:text-[0.72rem] sm:tracking-[0.26em]"
          >
            Visit the atelier
          </a>
        </div>
      </div>
    </section>
  );
}
