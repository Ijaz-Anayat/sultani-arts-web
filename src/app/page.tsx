import { FeaturedCategories } from "@/components/home/featured-categories";
import { FeaturedProducts } from "@/components/home/featured-products";
import { About } from "@/components/home/about";
import { ArtShowcase } from "@/components/home/art-showcase";
import { Hero } from "@/components/home/hero";
import { Newsletter } from "@/components/home/newsletter";
import { WhyChoose } from "@/components/home/why-choose";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <FeaturedCategories />
      <FeaturedProducts />
      <About />
      <ArtShowcase />
      <WhyChoose />
      <Newsletter />
    </main>
  );
}
