import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { connectDB } from "@/lib/mongodb";
import { getProductById } from "@/lib/queries";
import { isValidObjectId } from "@/lib/utils";
import { parseDiscountPercent } from "@/lib/pricing";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";

type RouteContext = { params: Promise<{ id: string }> };

function parseSizes(raw: unknown) {
  if (!Array.isArray(raw) || raw.length !== 3) return null;
  const sizes = raw.map((item) => {
    const row = item as { label?: string; price?: number | string };
    return { label: String(row.label ?? "").trim(), price: Number(row.price) };
  });
  if (sizes.some((size) => !size.label || Number.isNaN(size.price) || size.price < 0)) {
    return null;
  }
  return sizes;
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  try {
    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (err) {
    console.error("Get product failed", err);
    return NextResponse.json({ error: "Failed to load product" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

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

    const product = await Product.findByIdAndUpdate(
      id,
      {
        title,
        description,
        images,
        category: body.category,
        sizes,
        inStock: body.inStock !== false,
        discountPercent,
      },
      { new: true, runValidators: true },
    ).populate("category");

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (err) {
    console.error("Update product failed", err);
    return NextResponse.json({ error: "Could not update product" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  try {
    await connectDB();
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete product failed", err);
    return NextResponse.json({ error: "Could not delete product" }, { status: 500 });
  }
}
