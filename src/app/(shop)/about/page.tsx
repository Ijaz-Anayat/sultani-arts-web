import { About } from "@/components/home/about";
import { ArtShowcase } from "@/components/home/art-showcase";
import { WhyChoose } from "@/components/home/why-choose";
import { RevealOnScroll } from "@/components/reveal-on-scroll";

export default function AboutPage() {
  return (
    <main className="flex-1">
      <section className="px-4 pt-12 pb-2 sm:px-5 md:px-8">
        <RevealOnScroll>
          <div className="mx-auto max-w-[1200px]">
            <p className="font-sans text-[0.65rem] tracking-[0.28em] text-gold-deep uppercase">
              Our story
            </p>
            <h1 className="mt-2 font-serif text-4xl sm:text-5xl">About Sultani Arts</h1>
          </div>
        </RevealOnScroll>
      </section>
      <About />
      <WhyChoose />
      <ArtShowcase />
    </main>
  );
}
