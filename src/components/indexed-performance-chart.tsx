"use client";

import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const ranges = ["1W", "1M", "3M", "YTD", "1Y", "ALL"] as const;
type Range = (typeof ranges)[number];

export interface TickerHistory {
  dates: string[];
  values: number[];
  firstBoughtDate: string | null;
}

interface Props {
  history: Record<string, TickerHistory>;
  defaultRange?: Range;
}

// 16 visually distinct colors for dark backgrounds
const COLORS = [
  "#3b82f6", "#ef4444", "#22c55e", "#eab308", "#8b5cf6",
  "#f97316", "#06b6d4", "#ec4899", "#14b8a6", "#f43f5e",
  "#a855f7", "#84cc16", "#0ea5e9", "#d946ef", "#64748b",
  "#fb923c",
];

function getCutoffDate(latest: Date, range: Range): Date {
  const cutoff = new Date(latest);
  switch (range) {
    case "1W":
      cutoff.setDate(cutoff.getDate() - 7);
      break;
    case "1M":
      cutoff.setMonth(cutoff.getMonth() - 1);
      break;
    case "3M":
      cutoff.setMonth(cutoff.getMonth() - 3);
      break;
    case "YTD":
      return new Date(latest.getFullYear(), 0, 1);
    case "1Y":
      cutoff.setFullYear(cutoff.getFullYear() - 1);
      break;
    case "ALL":
      return new Date(0);
  }
  return cutoff;
}

export default function IndexedPerformanceChart({
  history,
  defaultRange = "ALL",
}: Props) {
  const [range, setRange] = useState<Range>(defaultRange);

  const tickers = useMemo(() => Object.keys(history).sort(), [history]);

  const chartData = useMemo(() => {
    // Collect all unique dates across all tickers
    const allDatesSet = new Set<string>();
    for (const th of Object.values(history)) {
      for (const d of th.dates) allDatesSet.add(d);
    }
    const allDates = Array.from(allDatesSet).sort();
    if (allDates.length === 0) return [];

    const latestDate = new Date(allDates[allDates.length - 1] + "T00:00:00");
    const cutoff = getCutoffDate(latestDate, range);
    const cutoffStr = cutoff.toISOString().split("T")[0];

    const filteredDates = allDates.filter((d) => d >= cutoffStr);
    if (filteredDates.length === 0) return [];

    // For each ticker, build a date->value map and find the base value
    // (first available value in the filtered range)
    const tickerMaps: Record<string, { map: Map<string, number>; base: number | null }> = {};

    for (const [ticker, th] of Object.entries(history)) {
      const map = new Map<string, number>();
      for (let i = 0; i < th.dates.length; i++) {
        map.set(th.dates[i], th.values[i]);
      }

      // Find base value: first date in filtered range that has a value
      let base: number | null = null;
      for (const d of filteredDates) {
        const v = map.get(d);
        if (v != null && v > 0) {
          base = v;
          break;
        }
      }

      tickerMaps[ticker] = { map, base };
    }

    // Build chart data points
    return filteredDates.map((date) => {
      const point: Record<string, number | string> = {
        date,
        ts: new Date(date + "T00:00:00").getTime(),
      };
      for (const ticker of tickers) {
        const { map, base } = tickerMaps[ticker];
        const val = map.get(date);
        if (val != null && base != null && base > 0) {
          point[ticker] = Math.round(((val / base) * 100) * 100) / 100;
        }
      }
      return point;
    });
  }, [history, range, tickers]);

  if (tickers.length === 0) return null;

  return (
    <div className="rounded-lg border border-card-border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted">Relative Performance</h2>
        <div className="flex gap-1">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded px-2 py-0.5 text-xs transition-colors ${
                range === r
                  ? "bg-accent/15 text-accent"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis
              dataKey="ts"
              type="number"
              scale="time"
              domain={["dataMin", "dataMax"]}
              tick={{ fill: "#71717a", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(ts: number) =>
                new Date(ts).toISOString().split("T")[0]
              }
            />
            <YAxis
              tick={{ fill: "#71717a", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `${v}`}
              width={40}
            />
            <Tooltip
              contentStyle={{
                background: "#111118",
                border: "1px solid #1e1e2a",
                borderRadius: 8,
                color: "#e5e5e5",
                fontSize: 12,
              }}
              labelFormatter={(ts: number) =>
                new Date(ts).toISOString().split("T")[0]
              }
              formatter={(value: number, name: string) => [
                `${value.toFixed(1)} (${value >= 100 ? "+" : ""}${(value - 100).toFixed(1)}%)`,
                name,
              ]}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
            />
            {tickers.map((ticker, i) => (
              <Line
                key={ticker}
                type="monotone"
                dataKey={ticker}
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={1.5}
                dot={false}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
