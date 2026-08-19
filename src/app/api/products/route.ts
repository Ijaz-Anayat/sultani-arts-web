import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { connectDB } from "@/lib/mongodb";
import { getProducts } from "@/lib/queries";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { isValidObjectId } from "@/lib/utils";
import { parseDiscountPercent } from "@/lib/pricing";

function parseSizes(raw: unknown) {
  if (!Array.isArray(raw) || raw.length !== 3) {
    return null;
  }

  const sizes = raw.map((item) => {
    const row = item as { label?: string; price?: number | string };
    const label = String(row.label ?? "").trim();
    const price = Number(row.price);
    return { label, price };
  });

  if (sizes.some((size) => !size.label || Number.isNaN(size.price) || size.price < 0)) {
    return null;
  }

  return sizes;
}

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get("category") ?? undefined;
    const products = await getProducts(category);
    return NextResponse.json(products);
  } catch (err) {
    console.error("List products failed", err);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = (await request.json()) as {
      title?: string;
      description?: string;
      images?: string[];
      category?: string;
      sizes?: unknown;
      inStock?: boolean;
      discountPercent?: unknown;
    };

    const title = body.title?.trim();
    const description = body.description?.trim();
    const images = Array.isArray(body.images)
      ? body.images.filter((url) => typeof url === "string" && url.length > 0)
      : [];
    const sizes = parseSizes(body.sizes);
    const discountPercent = parseDiscountPercent(body.discountPercent);

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }
    if (images.length < 1) {
      return NextResponse.json({ error: "At least one image is required" }, { status: 400 });
    }
    if (!body.category || !isValidObjectId(body.category)) {
      return NextResponse.json({ error: "A valid category is required" }, { status: 400 });
    }
    if (!sizes) {
      return NextResponse.json(
        { error: "Exactly 3 size options with labels and prices are required" },
        { status: 400 },
      );
    }

    await connectDB();
    const category = await Category.findById(body.category);
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 400 });
    }

    const product = await Product.create({
      title,
      description,
      images,
      category: body.category,
      sizes,
      inStock: body.inStock !== false,
      discountPercent,
    });

    const populated = await product.populate("category");
    return NextResponse.json(populated, { status: 201 });
  } catch (err) {
    console.error("Create product failed", err);
    return NextResponse.json({ error: "Could not create product" }, { status: 400 });
  }
}
