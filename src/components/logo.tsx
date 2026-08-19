import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  variant?: "default" | "light" | "stacked";
};

export function Logo({ variant = "default" }: LogoProps) {
  const stacked = variant === "stacked";

  return (
    <Link href="/" className="group inline-flex shrink-0 items-center">
      <Image
        src="/logo.png"
        alt="Sultani Arts"
        width={798}
        height={856}
        priority
        className={
          stacked
            ? "h-[6.5rem] w-auto sm:h-32"
            : "h-11 w-auto sm:h-[3.4rem]"
        }
      />
    </Link>
  );
}
