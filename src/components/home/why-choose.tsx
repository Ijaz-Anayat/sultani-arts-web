import { benefits } from "@/lib/data";
import { Award, Gem, PenTool, ShieldCheck } from "lucide-react";

const icons = [Award, Gem, PenTool, ShieldCheck];

export function WhyChoose() {
  return (
    <section className="px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1400px]">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-sans text-[0.7rem] tracking-[0.36em] text-gold-deep uppercase">
            Why Sultani
          </p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Why choose Sultani Arts
          </h2>
        </div>

        <div className="mt-14 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => {
            const Icon = icons[index];
            return (
              <article
                key={benefit.title}
                className="bg-ivory px-8 py-10 transition-colors hover:bg-cream/70"
              >
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
