import Image from "next/image";
import Link from "next/link";

export function ArtShowcase() {
  return (
    <section className="relative isolate min-h-[62vh] overflow-hidden">
      <Image
        src="/images/showcase.jpg"
        alt="Gold Islamic calligraphy and geometric ornament"
        fill
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-ink/55" />
      <div className="relative mx-auto flex min-h-[62vh] max-w-[900px] flex-col items-center justify-center px-6 py-24 text-center text-ivory">
        <p className="font-sans text-[0.7rem] tracking-[0.4em] text-gold-soft uppercase">
          Private commissions
        </p>
        <h2 className="mt-5 font-serif text-4xl leading-tight text-balance md:text-6xl">
          A verse, a name, a blessing — written for one wall, and one story.
        </h2>
        <p className="mt-6 max-w-xl font-sans text-base leading-8 text-ivory/80">
          Commission a unique calligraphy piece. We guide you through script,
          composition, scale, and finish, then deliver a work worthy of the
          words it holds.
        </p>
        <Link
          href="#contact"
          className="mt-10 inline-flex bg-ivory px-8 py-3.5 font-sans text-[0.72rem] tracking-[0.28em] text-ink uppercase transition-colors hover:bg-gold hover:text-ink"
        >
          Begin a commission
        </Link>
      </div>
    </section>
  );
}
