import type { Metadata } from "next";
import { SITE_IMAGES } from "@/lib/site-images";

export const SITE_NAME = "Sultani Arts";
export const SITE_TAGLINE = "Calligraphy & Artistic Collections";
export const SITE_DESCRIPTION =
  "Handmade Islamic and Arabic calligraphy, canvas, and oil paintings from Township, Lahore. Original wall art for homes, offices, and gifts.";

export function getSiteUrl() {
  const raw =
    process.env.NEXTAUTH_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    "https://sultani-arts-web.vercel.app";
  return raw.replace(/\/$/, "");
}

export function absoluteUrl(path = "/") {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = getSiteUrl();
  if (path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageMetadata({
  title,
  description,
  path,
  image,
  index = true,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  index?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image ? absoluteUrl(image) : absoluteUrl(SITE_IMAGES.hero);

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_PK",
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      images: [{ url: ogImage, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [ogImage],
    },
  };
}
