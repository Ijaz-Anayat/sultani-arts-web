import Link from "next/link";

type LogoProps = {
  variant?: "default" | "light" | "stacked";
};

export function Logo({ variant = "default" }: LogoProps) {
  const light = variant === "light";

  return (
    <Link href="/" className="group flex items-center gap-3">
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center border ${
          light ? "border-gold-soft/60" : "border-gold/70"
        }`}
        aria-hidden
      >
        <svg
          viewBox="0 0 40 40"
          className={`h-6 w-6 ${light ? "text-gold-soft" : "text-gold-deep"}`}
        >
          <path
            fill="currentColor"
            d="M20 2.5 22.4 11 31 8.8 25.6 16 34 20 25.6 24 31 31.2 22.4 29 20 37.5 17.6 29 9 31.2 14.4 24 6 20 14.4 16 9 8.8 17.6 11Z"
          />
          <circle cx="20" cy="20" r="3.2" fill={light ? "#faf6f0" : "#faf6f0"} />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-script text-[1.85rem] leading-none tracking-wide transition-colors ${
            light ? "text-ivory group-hover:text-gold-soft" : "text-ink group-hover:text-gold-deep"
          }`}
        >
          Sultani
        </span>
        <span
          className={`mt-1 text-[0.62rem] font-medium tracking-[0.46em] uppercase ${
            light ? "text-gold-soft" : "text-gold-deep"
          }`}
        >
          Arts
        </span>
      </span>
    </Link>
  );
}
