import { connectDB } from "@/lib/mongodb";
import { PageView } from "@/models/PageView";

export type AnalyticsDateRange = {
  from: string;
  to: string;
};

export type PageAnalyticsReport = AnalyticsDateRange & {
  pageViews: number;
  uniqueVisitors: number;
  daily: Array<{ date: string; pageViews: number; visitors: number }>;
  pages: Array<{ path: string; pageViews: number }>;
};

type AnalyticsAggregation = {
  summary: Array<{ pageViews: number; uniqueVisitors: number }>;
  daily: Array<{ _id: string; pageViews: number; visitors: number }>;
  pages: Array<{ _id: string; pageViews: number }>;
};

const PAKISTAN_TIME_ZONE = "Asia/Karachi";
const PAKISTAN_UTC_OFFSET = "+05:00";
const MAX_RANGE_DAYS = 366;

function formatPakistanDate(value: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: PAKISTAN_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(value);
  const part = (type: string) => parts.find((entry) => entry.type === type)?.value;
  const year = part("year");
  const month = part("month");
  const day = part("day");
  if (!year || !month || !day) throw new Error("Could not determine Pakistan date");
  return `${year}-${month}-${day}`;
}

function shiftDate(value: string, days: number): string {
  const date = new Date(`${value}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function getDefaultAnalyticsRange(now = new Date()): AnalyticsDateRange {
  const to = formatPakistanDate(now);
  return { from: shiftDate(to, -6), to };
}

function isDateOnly(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function getAnalyticsDateBounds({ from, to }: AnalyticsDateRange) {
  if (!isDateOnly(from) || !isDateOnly(to) || from > to) {
    throw new Error("Choose a valid date range.");
  }

  const dayCount =
    (Date.parse(`${to}T00:00:00.000Z`) - Date.parse(`${from}T00:00:00.000Z`)) /
      86_400_000 +
    1;
  if (dayCount > MAX_RANGE_DAYS) {
    throw new Error(`Choose a date range of ${MAX_RANGE_DAYS} days or less.`);
  }

  const dayAfterTo = shiftDate(to, 1);
  return {
    from,
    to,
    start: new Date(`${from}T00:00:00.000${PAKISTAN_UTC_OFFSET}`),
    end: new Date(`${dayAfterTo}T00:00:00.000${PAKISTAN_UTC_OFFSET}`),
  };
}

export async function getPageAnalyticsReport(
  range: AnalyticsDateRange,
): Promise<PageAnalyticsReport> {
  const bounds = getAnalyticsDateBounds(range);
  await connectDB();

  const [result] = await PageView.aggregate<AnalyticsAggregation>([
    { $match: { createdAt: { $gte: bounds.start, $lt: bounds.end } } },
    {
      $facet: {
        summary: [
          {
            $group: {
              _id: null,
              pageViews: { $sum: 1 },
              visitors: { $addToSet: "$visitorId" },
            },
          },
          {
            $project: {
              _id: 0,
              pageViews: 1,
              uniqueVisitors: { $size: "$visitors" },
            },
          },
        ],
        daily: [
          {
            $group: {
              _id: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$createdAt",
                  timezone: PAKISTAN_TIME_ZONE,
                },
              },
              pageViews: { $sum: 1 },
              visitors: { $addToSet: "$visitorId" },
            },
          },
          {
            $project: {
              _id: 1,
              pageViews: 1,
              visitors: { $size: "$visitors" },
            },
          },
          { $sort: { _id: 1 } },
        ],
        pages: [
          { $group: { _id: "$path", pageViews: { $sum: 1 } } },
          { $sort: { pageViews: -1, _id: 1 } },
          { $limit: 50 },
        ],
      },
    },
  ]);

  return {
    from: bounds.from,
    to: bounds.to,
    pageViews: result?.summary[0]?.pageViews ?? 0,
    uniqueVisitors: result?.summary[0]?.uniqueVisitors ?? 0,
    daily: (result?.daily ?? []).map((day) => ({
      date: day._id,
      pageViews: day.pageViews,
      visitors: day.visitors,
    })),
    pages: (result?.pages ?? []).map((page) => ({
      path: page._id,
      pageViews: page.pageViews,
    })),
  };
}
