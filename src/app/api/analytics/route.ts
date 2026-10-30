import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import {
  getAnalyticsDateBounds,
  getDefaultAnalyticsRange,
  getPageAnalyticsReport,
} from "@/lib/page-analytics";
import { connectDB } from "@/lib/mongodb";
import { PageView } from "@/models/PageView";

const VISITOR_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { path?: unknown; visitorId?: unknown };
    const path = body.path;
    const visitorId = body.visitorId;

    if (
      typeof path !== "string" ||
      path.length > 300 ||
      !path.startsWith("/") ||
      path.startsWith("//") ||
      path.startsWith("/admin") ||
      path.startsWith("/api") ||
      path.includes("?") ||
      path.includes("#") ||
      typeof visitorId !== "string" ||
      !VISITOR_ID_PATTERN.test(visitorId)
    ) {
      return NextResponse.json({ error: "Invalid page view" }, { status: 400 });
    }

    await connectDB();
    await PageView.create({ path, visitorId });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Record page view failed", error);
    return NextResponse.json({ error: "Could not record page view" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const url = new URL(request.url);
    const defaults = getDefaultAnalyticsRange();
    const range = {
      from: url.searchParams.get("from") ?? defaults.from,
      to: url.searchParams.get("to") ?? defaults.to,
    };
    getAnalyticsDateBounds(range);

    return NextResponse.json(await getPageAnalyticsReport(range));
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Choose")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Load page analytics failed", error);
    return NextResponse.json({ error: "Could not load analytics" }, { status: 500 });
  }
}
