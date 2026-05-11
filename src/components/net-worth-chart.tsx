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

  const perfUsd = useMemo(() => {
    if (filtered.length < 2) return null;
    const first = filtered[0].value;
    const last = filtered[filtered.length - 1].value;
    if (first === 0) return null;
    return ((last - first) / first) * 100;
  }, [filtered]);

  const perfKrw = useMemo(() => {
    if (filtered.length < 2) return null;
    const first = filtered[0].valueKrw;
    const last = filtered[filtered.length - 1].valueKrw;
    if (first === 0) return null;
    return ((last - first) / first) * 100;
  }, [filtered]);

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
    <div className="wise-card p-5">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted">Net Worth</h2>
          <div className="flex gap-2">
            {ranges.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`rounded-full px-4 py-1.5 text-sm transition-all ${
                  range === r
                    ? "bg-accent text-accent-dark font-semibold"
                    : "text-muted hover:text-foreground hover:scale-105 active:scale-95"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        {perfUsd !== null && (
          <div className="mt-2 flex items-center justify-end gap-2">
            <span
              className={`text-sm font-semibold ${
                perfUsd >= 0 ? "text-[#9fe870]" : "text-[#d03238]"
              }`}
            >
              {perfUsd >= 0 ? "+" : ""}
              {perfUsd.toFixed(2)}%
            </span>
            {perfKrw !== null && (
              <span
                className={`text-sm font-semibold ${
                  perfKrw >= 0 ? "text-[#38c8ff]" : "text-[#d03238]"
                }`}
              >
                {perfKrw >= 0 ? "+" : ""}
                {perfKrw.toFixed(2)}%
              </span>
            )}
          </div>
        )}
      </div>
      <div className="h-48 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filtered}>
            <defs>
              <linearGradient id="netWorthGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9fe870" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#9fe870" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="krwGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38c8ff" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#38c8ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="ts"
              type="number"
              scale="time"
              domain={["dataMin", "dataMax"]}
              tick={{ fill: "#868685", fontSize: 11 }}
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
              tick={{ fill: "#9fe870", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`}
              width={60}
            />
            <YAxis
              yAxisId="krw"
              orientation="right"
              domain={[krwMin, krwMax]}
              tick={{ fill: "#38c8ff", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatKrwAxis}
              width={70}
            />
            <Tooltip
              contentStyle={{
                background: "#ffffff",
                border: "none",
                borderRadius: 16,
                boxShadow: "0 0 0 1px rgba(14, 15, 12, 0.12)",
                color: "#0e0f0c",
                fontSize: 13,
              }}
              formatter={(value, name) => {
                const v = Number(value);
                if (name === "value") return [formatCurrency(v), "USD"];
                return [formatCurrency(v, "KRW"), "KRW"];
              }}
              labelFormatter={(ts) => new Date(Number(ts)).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
              labelStyle={{ color: "#868685" }}
            />
            <Area
              yAxisId="usd"
              type="monotone"
              dataKey="value"
              stroke="#9fe870"
              strokeWidth={2}
              fill="url(#netWorthGrad)"
            />
            <Area
              yAxisId="krw"
              type="monotone"
              dataKey="valueKrw"
              stroke="#38c8ff"
              strokeWidth={2}
              fill="url(#krwGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
