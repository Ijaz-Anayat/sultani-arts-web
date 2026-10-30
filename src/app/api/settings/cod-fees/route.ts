import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { CACHE_TAGS, revalidateStoreTags } from "@/lib/cache-tags";
import { connectDB } from "@/lib/mongodb";
import { getCashOnDeliveryFees } from "@/lib/queries";
import { Settings } from "@/models/Settings";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const fees = await getCashOnDeliveryFees();
    return NextResponse.json({ fees });
  } catch (err) {
    console.error("Get cash-on-delivery fees failed", err);
    return NextResponse.json({ error: "Failed to load COD fees" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  let body: { fees?: unknown };
  try {
    body = (await request.json()) as { fees?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.fees || typeof body.fees !== "object" || Array.isArray(body.fees)) {
    return NextResponse.json({ error: "COD fees must be provided for each size" }, { status: 400 });
  }

  const entries = Object.entries(body.fees);
  const normalizedSizeLabels = entries.map(([sizeLabel]) => sizeLabel.trim());
  if (
    entries.length > 100 ||
    new Set(normalizedSizeLabels).size !== normalizedSizeLabels.length ||
    entries.some(
      ([sizeLabel, amount]) =>
        !sizeLabel.trim() ||
        sizeLabel.length > 100 ||
        typeof amount !== "number" ||
        !Number.isSafeInteger(amount) ||
        amount < 0,
    )
  ) {
    return NextResponse.json(
      { error: "Each size needs a valid non-negative whole-number fee" },
      { status: 400 },
    );
  }

  try {
    await connectDB();
    const cashOnDeliveryFees = entries.map(([sizeLabel, amount]) => ({
      sizeLabel: sizeLabel.trim(),
      amount,
    }));
    await Settings.findOneAndUpdate(
      { key: "store" },
      { $set: { cashOnDeliveryFees, updatedAt: new Date() } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    revalidateStoreTags(CACHE_TAGS.settings);
    return NextResponse.json({
      fees: Object.fromEntries(
        cashOnDeliveryFees.map(({ sizeLabel, amount }) => [sizeLabel, amount]),
      ),
    });
  } catch (err) {
    console.error("Update cash-on-delivery fees failed", err);
    return NextResponse.json({ error: "Could not save COD fees" }, { status: 500 });
  }
}
