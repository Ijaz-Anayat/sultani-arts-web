import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Great_Vibes, Outfit } from "next/font/google";
import { AuthSessionProvider } from "@/components/auth-session-provider";
import { StoreProvider } from "@/components/store-provider";
import { getGlobalDiscountPercent } from "@/lib/queries";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  absoluteUrl,
  getSiteUrl,
} from "@/lib/seo";
import { SITE_IMAGES } from "@/lib/site-images";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Islamic calligraphy",
    "Arabic calligraphy",
    "wall art Pakistan",
    "canvas art Lahore",
    "Ayat al-Kursi",
    "handmade calligraphy",
    "Sultani Arts",
  ],
  authors: [{ name: SITE_NAME }],
  alternates: { canonical: absoluteUrl("/") },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_PK",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    url: absoluteUrl("/"),
    images: [{ url: absoluteUrl(SITE_IMAGES.hero), alt: "Sultani Arts calligraphy atelier" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [absoluteUrl(SITE_IMAGES.hero)],
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  let globalDiscountPercent = 0;
  try {
    globalDiscountPercent = await getGlobalDiscountPercent();
  } catch {
    globalDiscountPercent = 0;
  }

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${outfit.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-ivory font-sans text-ink">
        <AuthSessionProvider>
          <StoreProvider globalDiscountPercent={globalDiscountPercent}>
            {children}
          </StoreProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
