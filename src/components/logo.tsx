import Link from "next/link";

type LogoProps = {
  variant?: "default" | "light" | "stacked";
};

export function Logo({ variant = "default" }: LogoProps) {
  const light = variant === "light";

  return (
    <Link href="/" className="group flex min-w-0 items-center gap-2 sm:gap-3">
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center border sm:h-10 sm:w-10 ${
          light ? "border-gold-soft/60" : "border-gold/70"
        }`}
        aria-hidden
      >
        <svg
          viewBox="0 0 40 40"
          className={`h-5 w-5 sm:h-6 sm:w-6 ${light ? "text-gold-soft" : "text-gold-deep"}`}
        >
          <path
            fill="currentColor"
            d="M20 2.5 22.4 11 31 8.8 25.6 16 34 20 25.6 24 31 31.2 22.4 29 20 37.5 17.6 29 9 31.2 14.4 24 6 20 14.4 16 9 8.8 17.6 11Z"
          />
          <circle cx="20" cy="20" r="3.2" fill="#faf6f0" />
        </svg>
      </span>
      <span className="flex min-w-0 flex-col leading-none">
        <span
          className={`font-script text-[1.45rem] leading-none tracking-wide transition-colors sm:text-[1.85rem] ${
            light ? "text-ivory group-hover:text-gold-soft" : "text-ink group-hover:text-gold-deep"
          }`}
        >
          Sultani
        </span>
        <span
          className={`mt-0.5 text-[0.55rem] font-medium tracking-[0.28em] uppercase sm:mt-1 sm:text-[0.62rem] sm:tracking-[0.46em] ${
            light ? "text-gold-soft" : "text-gold-deep"
          }`}
        >
          Arts
        </span>
      </span>
    </Link>
  );
}
