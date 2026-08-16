import Image from "next/image";
import Link from "next/link";

export function ArtShowcase() {
  return (
    <section className="relative isolate min-h-[70svh] overflow-hidden sm:min-h-[62vh]">
      <Image
        src="/images/showcase.jpg"
        alt="Gold Islamic calligraphy and geometric ornament"
        fill
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-ink/60 sm:bg-ink/55" />
      <div className="relative mx-auto flex min-h-[70svh] max-w-[900px] flex-col items-center justify-center px-4 py-16 text-center text-ivory sm:min-h-[62vh] sm:px-6 sm:py-24">
        <p className="font-sans text-[0.65rem] tracking-[0.22em] text-gold-soft uppercase sm:text-[0.7rem] sm:tracking-[0.4em]">
          Private commissions
        </p>
        <h2 className="mt-4 font-serif text-3xl leading-tight text-pretty sm:mt-5 sm:text-4xl md:text-6xl">
          A verse, a name, a blessing — written for one wall, and one story.
        </h2>
        <p className="mt-4 max-w-xl font-sans text-[0.95rem] leading-7 text-ivory/80 sm:mt-6 sm:text-base sm:leading-8">
          Commission a unique calligraphy piece. We guide you through script,
          composition, scale, and finish, then deliver a work worthy of the
          words it holds.
        </p>
        <Link
          href="#contact"
          className="mt-8 inline-flex w-full max-w-xs items-center justify-center bg-ivory px-6 py-3.5 font-sans text-[0.68rem] tracking-[0.16em] text-ink uppercase transition-colors hover:bg-gold sm:mt-10 sm:w-auto sm:max-w-none sm:px-8 sm:text-[0.72rem] sm:tracking-[0.28em]"
        >
          Begin a commission
        </Link>
      </div>
    </section>
  );
}
