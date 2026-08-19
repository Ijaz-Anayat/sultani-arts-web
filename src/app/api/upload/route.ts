import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { uploadProductImage } from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Image file is required" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const secureUrl = await uploadProductImage(buffer);

    return NextResponse.json({ url: secureUrl });
  } catch (err) {
    console.error("Upload failed", err);
    const message =
      err instanceof Error && err.message
        ? err.message
        : "Image upload failed. Check Cloudinary environment variables on Vercel.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
