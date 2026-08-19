import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { NewsletterSubscriber } from "@/models/NewsletterSubscriber";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = body.email?.trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
    }

    await connectDB();
    await NewsletterSubscriber.updateOne(
      { email },
      { $setOnInsert: { email, createdAt: new Date() } },
      { upsert: true },
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Newsletter subscribe failed", err);
    return NextResponse.json({ error: "Could not subscribe" }, { status: 500 });
  }
}
