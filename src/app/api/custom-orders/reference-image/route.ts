import { NextResponse } from "next/server";
import { uploadProductImage } from "@/lib/cloudinary";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Choose an image to upload" }, { status: 400 });
    }
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Upload a JPG, PNG, or WebP image" }, { status: 400 });
    }
    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Image must be smaller than 4 MB" }, { status: 400 });
    }

    const url = await uploadProductImage(
      Buffer.from(await file.arrayBuffer()),
      "sultani-arts/custom-order-references",
    );
    return NextResponse.json({ url });
  } catch (err) {
    console.error("Custom order reference upload failed", err);
    return NextResponse.json({ error: "Could not upload the reference image" }, { status: 500 });
  }
}