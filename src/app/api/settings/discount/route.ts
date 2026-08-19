import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { connectDB } from "@/lib/mongodb";
import { parseDiscountPercent } from "@/lib/pricing";
import { getGlobalDiscountPercent } from "@/lib/queries";
import { Settings } from "@/models/Settings";

export async function GET() {
  try {
    const globalDiscountPercent = await getGlobalDiscountPercent();
    return NextResponse.json({ globalDiscountPercent });
  } catch (err) {
    console.error("Get discount settings failed", err);
    return NextResponse.json({ error: "Failed to load discount settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = (await request.json()) as { globalDiscountPercent?: unknown };
    const globalDiscountPercent = parseDiscountPercent(body.globalDiscountPercent);

    await connectDB();
    const settings = await Settings.findOneAndUpdate(
      { key: "store" },
      { $set: { globalDiscountPercent, updatedAt: new Date() } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean();

    return NextResponse.json({
      globalDiscountPercent: settings?.globalDiscountPercent ?? globalDiscountPercent,
    });
  } catch (err) {
    console.error("Update discount settings failed", err);
    return NextResponse.json({ error: "Could not save discount settings" }, { status: 400 });
  }
}
