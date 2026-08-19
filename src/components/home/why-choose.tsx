import { benefits } from "@/lib/data";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { Award, Gem, PenTool, ShieldCheck } from "lucide-react";

const icons = [Award, Gem, PenTool, ShieldCheck];

export function WhyChoose() {
  return (
    <section className="px-4 py-14 sm:px-5 sm:py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1400px]">
        <RevealOnScroll>
          <div className="mx-auto max-w-2xl px-2 text-center">
          <p className="font-sans text-[0.65rem] tracking-[0.22em] text-gold-deep uppercase sm:text-[0.7rem] sm:tracking-[0.36em]">
            Why Sultani
          </p>
          <h2 className="mt-2 font-serif text-3xl text-pretty sm:mt-3 sm:text-4xl md:text-5xl">
            Why choose Sultani Arts
          </h2>
          </div>
        </RevealOnScroll>

        <div className="mt-8 grid gap-px bg-line sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => {
            const Icon = icons[index];
            return (
              <RevealOnScroll key={benefit.title} delay={index * 80}>
                <article className="h-full bg-ivory px-5 py-8 transition-colors hover:bg-cream/70 sm:px-8 sm:py-10">
                <Icon
                  size={22}
                  strokeWidth={1.4}
                  className="text-gold-deep"
                />
                <h3 className="mt-6 font-serif text-2xl">{benefit.title}</h3>
                <p className="mt-3 font-sans text-sm leading-7 text-muted">
                  {benefit.description}
                </p>
                </article>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
