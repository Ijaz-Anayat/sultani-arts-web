import { Star } from "lucide-react";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import type { ReviewDTO } from "@/lib/types";

function formatReviewDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={13}
          strokeWidth={1.5}
          className={index < rating ? "fill-gold text-gold" : "text-line"}
        />
      ))}
    </div>
  );
}

export function ProductReviews({ reviews }: { reviews: ReviewDTO[] }) {
  if (reviews.length === 0) return null;

  const average =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <section className="mt-14 border-t border-line pt-10 sm:mt-16 sm:pt-12">
      <RevealOnScroll>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-sans text-[0.62rem] tracking-[0.28em] text-gold-deep uppercase">
              Collector notes
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl">Reviews</h2>
          </div>
          <p className="font-sans text-sm text-ink-soft">
            <span className="font-medium text-ink">{average.toFixed(1)}</span>
            <span className="text-muted"> / 5 · {reviews.length} reviews</span>
          </p>
        </div>
      </RevealOnScroll>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {reviews.map((review, index) => (
          <RevealOnScroll key={review._id} delay={index * 60}>
            <article className="flex h-full flex-col border border-line bg-ivory px-5 py-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-serif text-[1.05rem] text-ink">{review.name}</p>
                  <p className="mt-0.5 font-sans text-[0.68rem] tracking-[0.12em] text-muted uppercase">
                    {review.location}
                  </p>
                </div>
                <Stars rating={review.rating} />
              </div>
              <p className="mt-4 flex-1 font-sans text-[0.9rem] leading-7 text-ink-soft">
                {review.body}
              </p>
              <p className="mt-4 font-sans text-[0.62rem] tracking-[0.16em] text-muted uppercase">
                {formatReviewDate(review.postedAt)}
              </p>
            </article>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
