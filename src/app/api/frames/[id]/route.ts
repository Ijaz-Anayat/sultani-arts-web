import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { CACHE_TAGS, revalidateStoreTags } from "@/lib/cache-tags";
import { connectDB } from "@/lib/mongodb";
import { isValidObjectId } from "@/lib/utils";
import { Frame } from "@/models/Frame";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: RouteContext) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Frame not found" }, { status: 404 });
  }

  try {
    const body = (await request.json()) as {
      sizeLabel?: string;
      color?: string;
      price?: number;
    };
    const sizeLabel = body.sizeLabel?.trim();
    const color = body.color?.trim();
    const price = Number(body.price);

    if (!sizeLabel || !color) {
      return NextResponse.json({ error: "Frame size and color are required" }, { status: 400 });
    }
    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json({ error: "A valid frame price is required" }, { status: 400 });
    }

    await connectDB();
    const frame = await Frame.findByIdAndUpdate(
      id,
      { sizeLabel, color, price },
      { new: true, runValidators: true },
    );

    if (!frame) {
      return NextResponse.json({ error: "Frame not found" }, { status: 404 });
    }

    revalidateStoreTags(CACHE_TAGS.frames);
    return NextResponse.json(frame);
  } catch (err) {
    console.error("Update frame failed", err);
    return NextResponse.json({ error: "Could not update frame" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await context.params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Frame not found" }, { status: 404 });
  }

  try {
    await connectDB();
    const deleted = await Frame.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Frame not found" }, { status: 404 });
    }
    revalidateStoreTags(CACHE_TAGS.frames);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete frame failed", err);
    return NextResponse.json({ error: "Could not delete frame" }, { status: 500 });
  }
}
