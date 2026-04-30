"use client";

import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/format";

const ranges = ["1W", "1M", "3M", "YTD", "1Y", "ALL"] as const;
type Range = (typeof ranges)[number];

interface DataPoint {
  date: string;
  value: number;
  valueKrw: number;
}

interface Props {
  data: DataPoint[];
  defaultRange?: Range;
}

function filterByRange(data: DataPoint[], range: Range) {
  if (range === "ALL" || data.length === 0) return data;
  const latest = new Date(data[data.length - 1].date);
  let cutoff: Date;
  switch (range) {
    case "1W":
      cutoff = new Date(latest);
      cutoff.setDate(cutoff.getDate() - 7);
      break;
    case "1M":
      cutoff = new Date(latest);
      cutoff.setMonth(cutoff.getMonth() - 1);
      break;
    case "3M":
      cutoff = new Date(latest);
      cutoff.setMonth(cutoff.getMonth() - 3);
      break;
    case "YTD":
      cutoff = new Date(latest.getFullYear(), 0, 1);
      break;
    case "1Y":
      cutoff = new Date(latest);
      cutoff.setFullYear(cutoff.getFullYear() - 1);
      break;
  }
  const cutoffStr = cutoff.toISOString().split("T")[0];
  return data.filter((d) => d.date >= cutoffStr);
}

function formatKrwAxis(v: number) {
  if (v >= 100_000_000) return `${(v / 100_000_000).toFixed(1)}억`;
  if (v >= 10_000) return `${(v / 10_000).toFixed(0)}만`;
  return `₩${v.toFixed(0)}`;
}

interface NumericDataPoint extends DataPoint {
  ts: number;
}

export default function NetWorthChart({ data, defaultRange = "ALL" }: Props) {
  const [range, setRange] = useState<Range>(defaultRange);
  const filtered = useMemo(() => {
    const f = filterByRange(data, range);
    return f.map((d) => ({ ...d, ts: new Date(d.date + "T00:00:00").getTime() })) as NumericDataPoint[];
  }, [data, range]);

  const [usdMin, usdMax] = useMemo(() => {
    if (filtered.length === 0) return [0, 0];
    const vals = filtered.map((d) => d.value);
    return [Math.min(...vals), Math.max(...vals)];
  }, [filtered]);

  const [krwMin, krwMax] = useMemo(() => {
    if (filtered.length === 0) return [0, 0];
    const vals = filtered.map((d) => d.valueKrw);
    return [Math.min(...vals), Math.max(...vals)];
  }, [filtered]);

  return (
    <div className="rounded-lg border border-card-border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted">Net Worth</h2>
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
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filtered}>
            <defs>
              <linearGradient id="netWorthGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="krwGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="ts"
              type="number"
              scale="time"
              domain={["dataMin", "dataMax"]}
              tick={{ fill: "#71717a", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(ts: number) => {
                const d = new Date(ts);
                return d.toISOString().split("T")[0];
              }}
            />
            <YAxis
              yAxisId="usd"
              domain={[usdMin, usdMax]}
              tick={{ fill: "#3b82f6", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`}
              width={60}
            />
            <YAxis
              yAxisId="krw"
              orientation="right"
              domain={[krwMin, krwMax]}
              tick={{ fill: "#22c55e", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatKrwAxis}
              width={70}
            />
            <Tooltip
              contentStyle={{
                background: "#111118",
                border: "1px solid #1e1e2a",
                borderRadius: 8,
                color: "#e5e5e5",
                fontSize: 13,
              }}
              formatter={(value, name) => {
                const v = Number(value);
                if (name === "value") return [formatCurrency(v), "USD"];
                return [formatCurrency(v, "KRW"), "KRW"];
              }}
              labelFormatter={(ts) => new Date(Number(ts)).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
              labelStyle={{ color: "#71717a" }}
            />
            <Area
              yAxisId="usd"
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#netWorthGrad)"
            />
            <Area
              yAxisId="krw"
              type="monotone"
              dataKey="valueKrw"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#krwGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
