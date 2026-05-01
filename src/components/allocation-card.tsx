"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/format";

interface Slice {
  label: string;
  value: number;
  pct: number;
  color?: string;
}

const DEFAULT_COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#06b6d4",
  "#22c55e",
  "#eab308",
  "#ef4444",
  "#f97316",
];

export default function AllocationCard({
  title,
  slices,
}: {
  title: string;
  slices: Slice[];
}) {
  return (
    <div className="rounded-lg border border-card-border bg-card p-4">
      <h2 className="mb-3 text-sm font-medium text-muted">{title}</h2>
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        {/* Pie Chart */}
        <div className="h-28 w-28 shrink-0 sm:h-32 sm:w-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={slices}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={28}
                outerRadius={56}
                strokeWidth={1}
                stroke="var(--color-card)"
              >
                {slices.map((s, i) => (
                  <Cell
                    key={s.label}
                    fill={s.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Legend */}
        <div className="min-w-0 flex-1 space-y-1.5">
          {slices.map((s, i) => (
            <div key={s.label} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{
                    backgroundColor: s.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length],
                  }}
                />
                <span className="truncate">{s.label}</span>
              </div>
              <div className="flex gap-3 shrink-0">
                <span className="text-muted">{s.pct.toFixed(1)}%</span>
                <span className="w-20 text-right">{formatCurrency(s.value)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
