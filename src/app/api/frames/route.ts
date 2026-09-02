import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { connectDB } from "@/lib/mongodb";
import { getFrames } from "@/lib/queries";
import { Frame } from "@/models/Frame";

export async function GET() {
  try {
    const frames = await getFrames();
    return NextResponse.json(frames);
  } catch (err) {
    console.error("List frames failed", err);
    return NextResponse.json({ error: "Failed to load frames" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

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
    const frame = await Frame.create({ sizeLabel, color, price });
    return NextResponse.json(frame, { status: 201 });
  } catch (err) {
    console.error("Create frame failed", err);
    return NextResponse.json(
      { error: "Could not add frame. This size and color may already exist." },
      { status: 400 },
    );
  }
}
