import { config } from "dotenv";
import { resolve } from "node:path";
import mongoose from "mongoose";
import { imageForProductTitle, PRODUCT_IMAGES } from "../src/lib/site-images";

config({ path: resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "Sultani-arts";

const DEFAULT_SIZES = [
  { label: "Small (12x16 in)", price: 300, stock: 5 },
  { label: "Medium (16x20 in)", price: 1200, stock: 2 },
  { label: "Large (20x24 in)", price: 2000, stock: 0 },
];

const SAMPLE_PRODUCTS = [
  {
    title: "La Ilaha Illallah — Marbled Calligraphy Oil Painting",
    description:
      "Hand-painted Islamic calligraphy on a marbled background with a natural wood frame. A serene focal piece for living rooms and prayer spaces.",
    categorySlug: "oil-painting",
    images: [PRODUCT_IMAGES["La Ilaha Illallah — Marbled Calligraphy Oil Painting"]],
    sizes: DEFAULT_SIZES,
    discountPercent: 15,
  },
  {
    title: "Ayat al-Kursi — Gold Leaf Canvas",
    description:
      "Classic Ayat al-Kursi rendered in gold leaf on premium canvas. Museum-quality finish with rich texture and depth.",
    categorySlug: "canvas",
    images: [PRODUCT_IMAGES["Ayat al-Kursi — Gold Leaf Canvas"]],
    sizes: [
      { label: "Small (12x16 in)", price: 450, stock: 4 },
      { label: "Medium (16x20 in)", price: 1500, stock: 3 },
      { label: "Large (20x24 in)", price: 2400, stock: 1 },
    ],
    discountPercent: 10,
  },
  {
    title: "Bismillah — Contemporary Naskh Panel",
    description:
      "Elegant Bismillah composition in contemporary naskh script. Ideal for entryways, offices, and gifting.",
    categorySlug: "calligraphy",
    images: [PRODUCT_IMAGES["Bismillah — Contemporary Naskh Panel"]],
    sizes: [
      { label: "Small (12x16 in)", price: 350, stock: 6 },
      { label: "Medium (16x20 in)", price: 1100, stock: 4 },
      { label: "Large (20x24 in)", price: 1800, stock: 2 },
    ],
    discountPercent: 0,
  },
  {
    title: "Al-Fatiha — Framed Wall Art",
    description:
      "Surah Al-Fatiha in balanced proportions with a soft parchment tone palette and archival framing.",
    categorySlug: "calligraphy",
    images: [PRODUCT_IMAGES["Al-Fatiha — Framed Wall Art"]],
    sizes: [
      { label: "Small (12x16 in)", price: 400, stock: 3 },
      { label: "Medium (16x20 in)", price: 1300, stock: 2 },
      { label: "Large (20x24 in)", price: 2100, stock: 1 },
    ],
    discountPercent: 5,
  },
  {
    title: "Geometric Tawhid Study — Canvas Print",
    description:
      "Modern geometric interpretation of Tawhid with layered gold accents. A statement piece for minimal interiors.",
    categorySlug: "canvas",
    images: [PRODUCT_IMAGES["Geometric Tawhid Study — Canvas Print"]],
    sizes: [
      { label: "Small (12x16 in)", price: 280, stock: 8 },
      { label: "Medium (16x20 in)", price: 950, stock: 5 },
      { label: "Large (20x24 in)", price: 1600, stock: 2 },
    ],
    discountPercent: 0,
  },
  {
    title: "Floral Kufic Panel — Oil on Canvas",
    description:
      "Floral kufic composition with deep emerald and gold tones. Hand-finished details on stretched canvas.",
    categorySlug: "oil-painting",
    images: [PRODUCT_IMAGES["Floral Kufic Panel — Oil on Canvas"]],
    sizes: [
      { label: "Small (12x16 in)", price: 520, stock: 2 },
      { label: "Medium (16x20 in)", price: 1650, stock: 2 },
      { label: "Large (20x24 in)", price: 2600, stock: 1 },
    ],
    discountPercent: 12,
  },
];

function isBrokenImage(url: string) {
  return (
    !url ||
    url.startsWith("/images/") ||
    url.includes("photo-1564760055775") ||
    url.includes("photo-1541961017774") ||
    url.includes("photo-1513364776144") ||
    url.includes("photo-1579783902614-a3fb3927b6a5") ||
    url.includes("photo-1579783902610-fdc5a3970b6c") ||
    url.includes("photo-1578301978693") ||
    url.includes("photo-1547891654")
  );
}

async function seedProducts() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from .env.local");
  }

  await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
  const { Category } = await import("../src/models/Category");
  const { Product } = await import("../src/models/Product");

  for (const item of SAMPLE_PRODUCTS) {
    const category = await Category.findOne({ slug: item.categorySlug });
    if (!category) {
      console.log(`Skipped (category missing): ${item.title}`);
      continue;
    }

    const existing = await Product.findOne({ title: item.title });
    if (existing) {
      await Product.updateOne(
        { _id: existing._id },
        {
          $set: {
            images: item.images,
            description: item.description,
            sizes: item.sizes,
            discountPercent: item.discountPercent,
            inStock: item.sizes.some((size) => size.stock > 0),
          },
        },
      );
      console.log(`Product updated: ${item.title}`);
      continue;
    }

    await Product.create({
      title: item.title,
      description: item.description,
      images: item.images,
      category: category._id,
      sizes: item.sizes,
      discountPercent: item.discountPercent,
      inStock: item.sizes.some((size) => size.stock > 0),
    });
    console.log(`Product added: ${item.title}`);
  }

  const allProducts = await Product.find();
  const usedImages = new Set<string>();

  for (const product of allProducts) {
    const mappedImage = imageForProductTitle(product.title);
    const currentImage = product.images?.[0] ?? "";
    const shouldUseMapped =
      PRODUCT_IMAGES[product.title] &&
      (isBrokenImage(currentImage) || currentImage !== mappedImage);

    let nextImage = shouldUseMapped ? mappedImage : currentImage;

    if (!nextImage || isBrokenImage(nextImage)) {
      nextImage = mappedImage;
    }

    if (usedImages.has(nextImage)) {
      nextImage = mappedImage;
    }

    if (usedImages.has(nextImage)) {
      console.log(`Skipped duplicate image for: ${product.title}`);
      continue;
    }

    if (product.images?.[0] !== nextImage) {
      product.images = [nextImage];
      await product.save();
      console.log(`Image fixed: ${product.title}`);
    }

    usedImages.add(nextImage);
  }

  const count = await Product.countDocuments();
  console.log(`Total products in database: ${count}`);
  await mongoose.disconnect();
}

seedProducts().catch((error) => {
  console.error(error);
  process.exit(1);
});
