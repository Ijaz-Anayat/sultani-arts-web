import { getCategories, getFrames, getProducts } from "@/lib/queries";
import type { FrameDTO, ProductDTO } from "@/lib/types";

const SIZE_ORDER = new Map([
  ["small", 0],
  ["medium", 1],
  ["large", 2],
]);

export type CustomPaintingType = {
  categoryId: string;
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
  const [categories, products, frames] = await Promise.all([
    getCategories(),
    getProducts(),
    getFrames(),
  ]);

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

      return {
        categoryId: category._id,
        name: category.name,
        slug: category.slug,
        sizes: [...prices.entries()]
          .map(([label, price]) => ({ label, price }))
          .sort((left, right) => {
            const leftRank = SIZE_ORDER.get(left.label.split(" ")[0].toLowerCase()) ?? 3;
            const rightRank = SIZE_ORDER.get(right.label.split(" ")[0].toLowerCase()) ?? 3;
            return leftRank - rightRank || left.label.localeCompare(right.label);
          }),
      };
    })
    .filter((type) => type.sizes.length > 0);

  return { paintingTypes, frames };
}