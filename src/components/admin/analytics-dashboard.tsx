"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import type { PageAnalyticsReport } from "@/lib/page-analytics";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PK", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00.000Z`));
}

function formatCount(value: number) {
  return new Intl.NumberFormat("en-PK").format(value);
}

function getDailyRows(report: PageAnalyticsReport) {
  const byDate = new Map(report.daily.map((day) => [day.date, day]));
  const rows: Array<{ date: string; pageViews: number; visitors: number }> = [];
  const date = new Date(`${report.from}T00:00:00.000Z`);
  const end = new Date(`${report.to}T00:00:00.000Z`);

  while (date <= end) {
    const key = date.toISOString().slice(0, 10);
    rows.push(byDate.get(key) ?? { date: key, pageViews: 0, visitors: 0 });
    date.setUTCDate(date.getUTCDate() + 1);
  }

  return rows.reverse();
}

export function AnalyticsDashboard({
  initialReport,
}: {
  initialReport: PageAnalyticsReport;
}) {
  const [report, setReport] = useState(initialReport);
  const [from, setFrom] = useState(initialReport.from);
  const [to, setTo] = useState(initialReport.to);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const dailyRows = useMemo(() => getDailyRows(report), [report]);

  async function applyDateFilter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!from || !to || from > to) {
      setError("Choose a valid start and end date.");
      return;
    }

    setPending(true);
    try {
      const params = new URLSearchParams({ from, to });
      const response = await fetch(`/api/analytics?${params.toString()}`);
      const body = (await response.json()) as
        | PageAnalyticsReport
        | { error?: string };

      if (!response.ok || !("pageViews" in body)) {
        setError("error" in body ? body.error || "Could not load analytics." : "Could not load analytics.");
        return;
      }

      setReport(body);
    } catch (requestError) {
      console.error("Analytics date filter request failed", requestError);
      setError("Could not load analytics. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-8 space-y-8">
      <form
        onSubmit={applyDateFilter}
        className="flex flex-col gap-4 border border-line bg-cream/50 p-4 sm:flex-row sm:items-end"
      >
        <label className="flex-1 font-sans text-xs text-muted">
          From
          <input
            type="date"
            value={from}
            max={to}
            onChange={(event) => setFrom(event.target.value)}
            required
            className="mt-2 block w-full border border-line bg-ivory px-3 py-2.5 text-sm text-ink"
          />
        </label>
        <label className="flex-1 font-sans text-xs text-muted">
          To
          <input
            type="date"
            value={to}
            min={from}
            onChange={(event) => setTo(event.target.value)}
            required
            className="mt-2 block w-full border border-line bg-ivory px-3 py-2.5 text-sm text-ink"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="bg-ink px-5 py-2.5 font-sans text-xs tracking-[0.14em] text-ivory uppercase disabled:opacity-60"
        >
          {pending ? "Loading…" : "Apply dates"}
        </button>
      </form>

      <p className="font-sans text-xs text-muted">
        Selected period: {formatDate(report.from)} – {formatDate(report.to)}
      </p>
      {error ? (
        <p role="alert" className="font-sans text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <section aria-label="Visitor totals" className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Page views" value={report.pageViews} />
        <StatCard label="Unique visitors" value={report.uniqueVisitors} />
      </section>

      <section>
        <h2 className="mb-4 font-serif text-2xl">Daily visits</h2>
        {dailyRows.length === 0 ? (
          <p className="border border-line p-5 text-sm text-muted">No visits in this date range.</p>
        ) : (
          <div className="overflow-x-auto border border-line">
            <table className="min-w-full text-left">
              <thead className="bg-cream font-sans text-[0.65rem] tracking-[0.16em] text-muted uppercase">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Visitors</th>
                  <th className="px-4 py-3">Page views</th>
                </tr>
              </thead>
              <tbody>
                {dailyRows.map((day) => (
                  <tr key={day.date} className="border-t border-line font-sans text-sm">
                    <td className="px-4 py-3">{formatDate(day.date)}</td>
                    <td className="px-4 py-3">{formatCount(day.visitors)}</td>
                    <td className="px-4 py-3">{formatCount(day.pageViews)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 font-serif text-2xl">Most viewed pages</h2>
        {report.pages.length === 0 ? (
          <p className="border border-line p-5 text-sm text-muted">No page views in this date range.</p>
        ) : (
          <div className="overflow-x-auto border border-line">
            <table className="min-w-full text-left">
              <thead className="bg-cream font-sans text-[0.65rem] tracking-[0.16em] text-muted uppercase">
                <tr>
                  <th className="px-4 py-3">Page</th>
                  <th className="px-4 py-3">Page views</th>
                </tr>
              </thead>
              <tbody>
                {report.pages.map((page) => (
                  <tr key={page.path} className="border-t border-line font-sans text-sm">
                    <td className="max-w-[70vw] px-4 py-3">
                      {page.product ? (
                        <Link
                          href={page.path}
                          className="flex items-center gap-3 text-ink transition-colors hover:text-gold-deep"
                        >
                          <span className="relative h-14 w-12 shrink-0 overflow-hidden bg-parchment">
                            <Image
                              src={page.product.image}
                              alt=""
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </span>
                          <span className="min-w-0">
                            <span className="block break-words font-medium">
                              {page.product.title}
                            </span>
                            <span className="mt-1 block break-all text-xs text-muted">
                              {page.path}
                            </span>
                          </span>
                        </Link>
                      ) : (
                        <span className="break-all">{page.path}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{formatCount(page.pageViews)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="border-t border-line pt-4 font-sans text-xs leading-5 text-muted">
        Visitor counts are estimates based on a random ID saved in each browser.
        One person using multiple browsers or devices may be counted more than once.
        No names, email addresses, IP addresses, or URL query values are collected.
      </p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-line bg-cream/50 p-6">
      <p className="font-sans text-[0.65rem] tracking-[0.22em] text-muted uppercase">
        {label}
      </p>
      <p className="mt-3 font-serif text-4xl">{formatCount(value)}</p>
    </div>
  );
}
