"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealDirection = "up" | "left" | "right" | "fade";

type RevealOnScrollProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: RevealDirection;
};

export function RevealOnScroll({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-direction={direction}
      className={`reveal reveal-${direction} ${visible ? "reveal-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
