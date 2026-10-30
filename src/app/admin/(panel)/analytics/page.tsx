import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard";
import {
  getDefaultAnalyticsRange,
  getPageAnalyticsReport,
} from "@/lib/page-analytics";

export default async function AdminAnalyticsPage() {
  const range = getDefaultAnalyticsRange();
  const report = await getPageAnalyticsReport(range);

  return (
    <div>
      <p className="font-sans text-[0.65rem] tracking-[0.28em] text-gold-deep uppercase">
        Store insights
      </p>
      <h1 className="mt-2 font-serif text-4xl">Visitor analytics</h1>
      <p className="mt-2 max-w-2xl font-sans text-sm leading-6 text-muted">
        See how many visitors opened your pages and which pages they viewed.
        Dates and daily totals use Pakistan time.
      </p>
      <AnalyticsDashboard initialReport={report} />
    </div>
  );
}
