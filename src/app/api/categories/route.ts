import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { connectDB } from "@/lib/mongodb";
import { getCategories } from "@/lib/queries";
import { slugify } from "@/lib/utils";
import { Category } from "@/models/Category";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (err) {
    console.error("List categories failed", err);
    return NextResponse.json({ error: "Failed to load categories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = (await request.json()) as { name?: string; slug?: string };
    const name = body.name?.trim();
    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const slug = slugify(body.slug?.trim() || name);
    if (!slug) {
      return NextResponse.json({ error: "A valid slug is required" }, { status: 400 });
    }

    await connectDB();
    const category = await Category.create({ name, slug });
    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    console.error("Create category failed", err);
    return NextResponse.json(
      { error: "Could not create category. Name or slug may already exist." },
      { status: 400 },
    );
  }
}
