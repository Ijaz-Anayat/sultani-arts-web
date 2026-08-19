import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { connectDB } from "@/lib/mongodb";
import { isValidObjectId, slugify } from "@/lib/utils";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: RouteContext) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  try {
    const body = (await request.json()) as { name?: string; slug?: string };
    const name = body.name?.trim();
    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    await connectDB();
    const category = await Category.findByIdAndUpdate(
      id,
      { name, slug: slugify(body.slug?.trim() || name) },
      { new: true, runValidators: true },
    );

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (err) {
    console.error("Update category failed", err);
    return NextResponse.json({ error: "Could not update category" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  try {
    await connectDB();
    const productCount = await Product.countDocuments({ category: id });
    if (productCount > 0) {
      return NextResponse.json(
        { error: "Remove or reassign products in this category first." },
        { status: 409 },
      );
    }

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete category failed", err);
    return NextResponse.json({ error: "Could not delete category" }, { status: 500 });
  }
}
