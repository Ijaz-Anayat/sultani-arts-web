import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { WhatsAppFloat } from "@/components/whatsapp-float";

/** Storefront pages can be cached; catalog queries also use tagged ISR (60s). */
export const revalidate = 60;

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
