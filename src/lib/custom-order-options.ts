import { getCategories, getFrames, getProducts } from "@/lib/queries";
import type { FrameDTO, ProductDTO } from "@/lib/types";

const SIZE_ORDER = new Map([
  ["small", 0],
  ["medium", 1],
  ["large", 2],
]);

const FALLBACK_TYPES = [
  {
    name: "Canvas",
    slug: "canvas",
    sizes: [
      { label: "Small (12x16 in)", price: 280 },
      { label: "Medium (16x20 in)", price: 950 },
      { label: "Large (20x24 in)", price: 1600 },
    ],
  },
  {
    name: "Oil Painting",
    slug: "oil-painting",
    sizes: [
      { label: "Small (12x16 in)", price: 300 },
      { label: "Medium (16x20 in)", price: 1200 },
      { label: "Large (20x24 in)", price: 2000 },
    ],
  },
  {
    name: "Calligraphy",
    slug: "calligraphy",
    sizes: [
      { label: "Small (12x16 in)", price: 350 },
      { label: "Medium (16x20 in)", price: 1100 },
      { label: "Large (20x24 in)", price: 1800 },
    ],
  },
] as const;

export type CustomPaintingType = {
  name: string;
  slug: string;
  sizes: Array<{ label: string; price: number }>;
};

export type CustomOrderOptions = {
  paintingTypes: CustomPaintingType[];
  frames: FrameDTO[];
};

function productCategoryId(product: ProductDTO) {
  return typeof product.category === "string" ? product.category : product.category._id;
}

export async function getCustomOrderOptions(): Promise<CustomOrderOptions> {
  const [categoriesResult, productsResult, framesResult] = await Promise.allSettled([
    getCategories(),
    getProducts(),
    getFrames(),
  ]);
  const categories = categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
  const products = productsResult.status === "fulfilled" ? productsResult.value : [];
  const frames = framesResult.status === "fulfilled" ? framesResult.value : [];

  const paintingTypes = categories
    .filter((category) => /calligraphy|canvas|oil|painting/i.test(`${category.name} ${category.slug}`))
    .map((category) => {
      const prices = new Map<string, number>();

      for (const product of products.filter((entry) => productCategoryId(entry) === category._id)) {
        for (const size of product.sizes) {
          const current = prices.get(size.label);
          if (current === undefined || size.price < current) {
            prices.set(size.label, size.price);
          }
        }
      }

      const fallback = FALLBACK_TYPES.find((type) => type.slug === category.slug);
      const sizes = prices.size > 0
        ? [...prices.entries()].map(([label, price]) => ({ label, price }))
        : fallback?.sizes.map((size) => ({ ...size })) ?? [];

      return {
        name: category.name,
        slug: category.slug,
        sizes: sizes
          .sort((left, right) => {
            const leftRank = SIZE_ORDER.get(left.label.split(" ")[0].toLowerCase()) ?? 3;
            const rightRank = SIZE_ORDER.get(right.label.split(" ")[0].toLowerCase()) ?? 3;
            return leftRank - rightRank || left.label.localeCompare(right.label);
          }),
      };
    })
    .filter((type) => type.sizes.length > 0);

  return {
    paintingTypes: paintingTypes.length > 0
      ? paintingTypes
      : FALLBACK_TYPES.map((type) => ({ ...type, sizes: type.sizes.map((size) => ({ ...size })) })),
    frames,
  };
}