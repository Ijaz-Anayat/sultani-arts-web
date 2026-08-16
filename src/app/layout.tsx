import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Great_Vibes, Outfit } from "next/font/google";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { StoreProvider } from "@/components/store-provider";
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
  title: "Sultani Arts | Calligraphy & Artistic Collections",
  description:
    "A modern atelier for Islamic and Arabic calligraphy, wall art, and custom artistic pieces. Where tradition meets contemporary design.",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${outfit.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-ivory font-sans text-ink">
        <StoreProvider>
          <Navbar />
          {children}
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
