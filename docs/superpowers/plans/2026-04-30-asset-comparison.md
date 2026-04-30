# Asset Comparison & Action Signals Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an indexed performance line chart and an action signal table to the dashboard so the user can compare asset returns and see buy/hold/sell recommendations.

**Architecture:** New server-side API endpoint (`/api/history`) queries all snapshots for held tickers and returns time-series data. Two new client components consume this data: `IndexedPerformanceChart` (Recharts multi-line chart normalized to 100) and `ActionSignalTable` (table with return columns and signal logic). The existing `AssetPerformance` component is removed.

**Tech Stack:** Next.js 16 App Router, React 19, Recharts 3, Supabase, TypeScript, Tailwind 4

**Spec:** `docs/superpowers/specs/2026-04-30-asset-comparison-design.md`

---

### Task 1: Add `getSnapshotHistoryByTicker` to db.ts

**Files:**
- Modify: `src/lib/db.ts`

- [ ] **Step 1: Add the function at the end of `src/lib/db.ts`**

Add this after the existing `getNetWorthByDate` function:

```ts
export async function getSnapshotHistoryByTicker(tickers: string[]) {
  if (tickers.length === 0) return [] as Snapshot[];
  const all: Snapshot[] = [];
  const pageSize = 1000;
  let offset = 0;
  while (true) {
    const { data, error } = await supabase
      .from("snapshots")
      .select("*")
      .in("ticker", tickers)
      .order("date", { ascending: true })
      .range(offset, offset + pageSize - 1);
    if (error) throw error;
    all.push(...(data as Snapshot[]));
    if (data.length < pageSize) break;
    offset += pageSize;
  }
  return all;
}
```

- [ ] **Step 2: Verify the build compiles**

Run: `npx next build 2>&1 | tail -5` (or `npm run build`)
Expected: Build succeeds (no type errors).

- [ ] **Step 3: Commit**

```bash
git add src/lib/db.ts
git commit -m "feat: add getSnapshotHistoryByTicker to query snapshot history for multiple tickers"
```

---

### Task 2: Create `/api/history` endpoint

**Files:**
- Create: `src/app/api/history/route.ts`

- [ ] **Step 1: Create the route file**

Create `src/app/api/history/route.ts`:

```ts
import { getSnapshotHistoryByTicker } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tickersParam = searchParams.get("tickers");

  if (!tickersParam) {
    return Response.json({ error: "Missing tickers parameter" }, { status: 400 });
  }

  const tickers = tickersParam.split(",").map((t) => t.trim()).filter(Boolean);
  if (tickers.length === 0) {
    return Response.json({ history: {} });
  }

  const snapshots = await getSnapshotHistoryByTicker(tickers);

  // Group by ticker, aggregate value_usd by date
  const history: Record<
    string,
    { dates: string[]; values: number[]; firstBoughtDate: string | null }
  > = {};

  // Intermediate: ticker -> date -> { usd: number, hasNative: boolean }
  const grouped: Record<string, Record<string, { usd: number; hasNative: boolean }>> = {};

  for (const snap of snapshots) {
    if (!grouped[snap.ticker]) grouped[snap.ticker] = {};
    const byDate = grouped[snap.ticker];
    if (!byDate[snap.date]) byDate[snap.date] = { usd: 0, hasNative: false };
    byDate[snap.date].usd += Number(snap.value_usd);
    if (Number(snap.value_native) > 0) byDate[snap.date].hasNative = true;
  }

  for (const [ticker, byDate] of Object.entries(grouped)) {
    const sortedDates = Object.keys(byDate).sort();
    const dates: string[] = [];
    const values: number[] = [];
    let firstBoughtDate: string | null = null;

    for (const date of sortedDates) {
      dates.push(date);
      values.push(byDate[date].usd);
      if (firstBoughtDate === null && byDate[date].hasNative) {
        firstBoughtDate = date;
      }
    }

    history[ticker] = { dates, values, firstBoughtDate };
  }

  return Response.json({ history });
}
```

- [ ] **Step 2: Verify the build compiles**

Run: `npm run build 2>&1 | tail -5`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/history/route.ts
git commit -m "feat: add /api/history endpoint for per-ticker snapshot history"
```

---

### Task 3: Create `IndexedPerformanceChart` component

**Files:**
- Create: `src/components/indexed-performance-chart.tsx`

- [ ] **Step 1: Create the component file**

Create `src/components/indexed-performance-chart.tsx`:

```tsx
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
```

- [ ] **Step 2: Verify the build compiles**

Run: `npm run build 2>&1 | tail -5`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/indexed-performance-chart.tsx
git commit -m "feat: add IndexedPerformanceChart component for relative asset comparison"
```

---

### Task 4: Create `ActionSignalTable` component

**Files:**
- Create: `src/components/action-signal-table.tsx`

- [ ] **Step 1: Create the component file**

Create `src/components/action-signal-table.tsx`:

```tsx
"use client";

import { formatCurrency, formatPct } from "@/lib/format";

export interface ActionSignalAsset {
  ticker: string;
  value: number;
  returnSinceBought: number | null;
  return1W: number | null;
  return1M: number | null;
  return3M: number | null;
  riskLevel: string;
  signal: "Buy" | "Hold" | "Sell";
  reason: string;
}

interface Props {
  assets: ActionSignalAsset[];
}

const signalColors: Record<string, string> = {
  Buy: "bg-positive/15 text-positive",
  Hold: "bg-warning/15 text-warning",
  Sell: "bg-negative/15 text-negative",
};

const riskColors: Record<string, string> = {
  Low: "text-positive",
  Medium: "text-accent",
  High: "text-warning",
  "Very High": "text-negative",
};

function ReturnCell({ value }: { value: number | null }) {
  if (value === null) return <td className="px-2 py-1.5 text-right text-xs text-muted">--</td>;
  return (
    <td
      className={`px-2 py-1.5 text-right text-xs font-medium ${
        value > 0 ? "text-positive" : value < 0 ? "text-negative" : "text-muted"
      }`}
    >
      {formatPct(Math.round(value * 100) / 100)}
    </td>
  );
}

export default function ActionSignalTable({ assets }: Props) {
  // Sort: Sell first, then Hold, then Buy. Within group sort by worst momentum first.
  const sortOrder = { Sell: 0, Hold: 1, Buy: 2 };
  const sorted = [...assets].sort((a, b) => {
    const sigDiff = sortOrder[a.signal] - sortOrder[b.signal];
    if (sigDiff !== 0) return sigDiff;
    // Within same signal, sort by average return ascending (worst first)
    const avgA = avgReturn(a);
    const avgB = avgReturn(b);
    return avgA - avgB;
  });

  return (
    <div className="rounded-lg border border-card-border bg-card p-4">
      <h2 className="mb-3 text-sm font-medium text-muted">Action Signals</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-card-border text-xs text-muted">
              <th className="px-2 py-1.5 font-medium">Ticker</th>
              <th className="px-2 py-1.5 text-right font-medium">Value</th>
              <th className="px-2 py-1.5 text-right font-medium">Since Bought</th>
              <th className="px-2 py-1.5 text-right font-medium">1W</th>
              <th className="px-2 py-1.5 text-right font-medium">1M</th>
              <th className="px-2 py-1.5 text-right font-medium">3M</th>
              <th className="px-2 py-1.5 font-medium">Risk</th>
              <th className="px-2 py-1.5 font-medium">Signal</th>
              <th className="px-2 py-1.5 font-medium">Why</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((asset) => (
              <tr key={asset.ticker} className="border-b border-card-border/50">
                <td className="px-2 py-1.5 text-xs font-medium">{asset.ticker}</td>
                <td className="px-2 py-1.5 text-right text-xs text-muted">
                  {formatCurrency(asset.value)}
                </td>
                <ReturnCell value={asset.returnSinceBought} />
                <ReturnCell value={asset.return1W} />
                <ReturnCell value={asset.return1M} />
                <ReturnCell value={asset.return3M} />
                <td className="px-2 py-1.5">
                  <span className={`text-xs font-medium ${riskColors[asset.riskLevel] ?? "text-muted"}`}>
                    {asset.riskLevel}
                  </span>
                </td>
                <td className="px-2 py-1.5">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${signalColors[asset.signal]}`}
                  >
                    {asset.signal}
                  </span>
                </td>
                <td className="px-2 py-1.5 text-xs text-muted max-w-48">{asset.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function avgReturn(a: ActionSignalAsset): number {
  const returns = [a.return1W, a.return1M, a.return3M].filter(
    (r): r is number => r !== null
  );
  if (returns.length === 0) return 0;
  return returns.reduce((s, v) => s + v, 0) / returns.length;
}
```

- [ ] **Step 2: Verify the build compiles**

Run: `npm run build 2>&1 | tail -5`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/action-signal-table.tsx
git commit -m "feat: add ActionSignalTable component with buy/hold/sell signals"
```

---

### Task 5: Integrate into dashboard and remove AssetPerformance

**Files:**
- Modify: `src/app/(app)/dashboard/page.tsx`
- Delete: `src/components/asset-performance.tsx`

- [ ] **Step 1: Update imports in `src/app/(app)/dashboard/page.tsx`**

Replace the `AssetPerformance` import and add new imports. Change:

```ts
import AssetPerformance from "@/components/asset-performance";
```

to:

```ts
import IndexedPerformanceChart from "@/components/indexed-performance-chart";
import ActionSignalTable from "@/components/action-signal-table";
import type { TickerHistory } from "@/components/indexed-performance-chart";
import type { ActionSignalAsset } from "@/components/action-signal-table";
```

- [ ] **Step 2: Remove `buildAssetPerformance` function**

Delete the entire `buildAssetPerformance` function (lines 33-60 in the current file).

- [ ] **Step 3: Add `tickerHistory` to `DashboardData` interface**

Add a new field to the `DashboardData` interface:

```ts
interface DashboardData {
  latestSnapshots: Snapshot[];
  previousSnapshots: Snapshot[];
  netWorthHistory: { date: string; value: number; valueKrw: number; fxRate: number }[];
  holdings: Holding[];
  investments: PrivateInvestment[];
  fxRate: number;
  prevFxRate: number;
  liveTotalUsd: number | null;
  liveFxRate: number | null;
  liveSnapshots: Snapshot[] | null;
  tickerHistory: Record<string, TickerHistory>;
}
```

- [ ] **Step 4: Fetch history data in the `useEffect` load function**

After the live quotes block (after `liveTotalUsd` is set, around line 257), add:

```ts
      // Fetch per-ticker history for performance chart & signal table
      let tickerHistory: Record<string, TickerHistory> = {};
      const nonCashTickers = [
        ...holdings.filter((h) => h.asset_type !== "cash" && h.shares !== 0).map((h) => h.ticker),
        ...investments.filter((i) => !i.is_deleted).map((i) => i.ticker).filter((t): t is string => t !== null),
      ];
      const uniqueNonCash = [...new Set(nonCashTickers)];
      if (uniqueNonCash.length > 0) {
        try {
          const histRes = await fetch(`/api/history?tickers=${uniqueNonCash.join(",")}`);
          const histData = await histRes.json();
          tickerHistory = histData.history ?? {};
        } catch {
          // Fall back to empty
        }
      }
```

Then include `tickerHistory` in the `setData` call:

```ts
      setData({
        latestSnapshots,
        previousSnapshots,
        netWorthHistory,
        holdings,
        investments,
        fxRate,
        prevFxRate,
        liveTotalUsd,
        liveFxRate,
        liveSnapshots,
        tickerHistory,
      });
```

- [ ] **Step 5: Add signal computation logic**

Add these two functions before the `DashboardPage` component (after the `buildAllocByCurrency` function):

```ts
function computeReturn(
  history: TickerHistory,
  periodDays: number | "since_bought",
): number | null {
  if (history.dates.length === 0) return null;

  const latestValue = history.values[history.values.length - 1];
  if (latestValue <= 0) return null;

  let refDate: string;
  if (periodDays === "since_bought") {
    if (!history.firstBoughtDate) return null;
    refDate = history.firstBoughtDate;
  } else {
    const latest = new Date(history.dates[history.dates.length - 1]);
    const cutoff = new Date(latest);
    cutoff.setDate(cutoff.getDate() - periodDays);
    refDate = cutoff.toISOString().split("T")[0];
  }

  // Find closest date on or after refDate
  let refIdx = -1;
  for (let i = 0; i < history.dates.length; i++) {
    if (history.dates[i] >= refDate) {
      refIdx = i;
      break;
    }
  }
  if (refIdx === -1) return null;

  const refValue = history.values[refIdx];
  if (refValue <= 0) return null;

  return ((latestValue - refValue) / refValue) * 100;
}

function computeSignal(
  return1W: number | null,
  return1M: number | null,
  return3M: number | null,
  riskLevel: string,
): { signal: "Buy" | "Hold" | "Sell"; reason: string } {
  const periods = [return1W, return1M, return3M];
  let momentum = 0;
  for (const r of periods) {
    if (r !== null) {
      momentum += r > 0 ? 1 : r < 0 ? -1 : 0;
    }
  }

  const isHighRisk = riskLevel === "High" || riskLevel === "Very High";
  const riskLabel = isHighRisk ? "high risk" : "low risk";

  if (momentum >= 3) {
    return {
      signal: isHighRisk ? "Buy" : "Buy",
      reason: isHighRisk
        ? "Strong momentum justifies high risk exposure"
        : "Strong momentum across all periods, low risk",
    };
  }
  if (momentum === 2) {
    return {
      signal: isHighRisk ? "Hold" : "Buy",
      reason: isHighRisk
        ? `Mostly positive but ${riskLabel} — watch closely`
        : "Positive trend across most periods, safe to add",
    };
  }
  if (momentum === 1) {
    return {
      signal: "Hold",
      reason: `Mixed signals — some periods up, some down (${riskLabel})`,
    };
  }
  if (momentum === 0) {
    return {
      signal: "Hold",
      reason: `Flat or mixed movement (${riskLabel})`,
    };
  }
  if (momentum === -1) {
    return {
      signal: "Hold",
      reason: isHighRisk
        ? "Slight decline with high risk — consider reducing"
        : "Minor dip but low risk — likely temporary",
    };
  }
  if (momentum === -2) {
    return {
      signal: isHighRisk ? "Sell" : "Hold",
      reason: isHighRisk
        ? "Declining on most timeframes with high risk exposure"
        : "Dipping but low risk — hold unless trend continues",
    };
  }
  // momentum <= -3
  return {
    signal: "Sell",
    reason: `Consistent losses across all periods (${riskLabel})`,
  };
}

function buildActionSignals(
  tickerHistory: Record<string, TickerHistory>,
  latestSnapshots: Snapshot[],
  holdings: Holding[],
  investments: PrivateInvestment[],
): ActionSignalAsset[] {
  const holdingMap = new Map(holdings.map((h) => [h.ticker, h]));
  const invMap = new Map(
    investments.filter((i) => i.ticker).map((i) => [i.ticker!, i]),
  );

  // Current value by ticker from latest snapshots
  const valueByTicker = new Map<string, number>();
  for (const s of latestSnapshots) {
    valueByTicker.set(s.ticker, (valueByTicker.get(s.ticker) || 0) + Number(s.value_usd));
  }

  const results: ActionSignalAsset[] = [];

  for (const [ticker, th] of Object.entries(tickerHistory)) {
    const value = valueByTicker.get(ticker) ?? 0;
    if (value <= 0) continue;

    const returnSinceBought = computeReturn(th, "since_bought");
    const return1W = computeReturn(th, 7);
    const return1M = computeReturn(th, 30);
    const return3M = computeReturn(th, 90);

    // Determine risk level
    let riskRaw: string = "medium";
    const holding = holdingMap.get(ticker);
    const inv = invMap.get(ticker);
    if (holding) riskRaw = holding.risk_level;
    else if (inv) riskRaw = inv.risk_level;

    const riskLevel = riskRaw
      .replace("_", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const { signal, reason } = computeSignal(return1W, return1M, return3M, riskLevel);

    results.push({
      ticker,
      value,
      returnSinceBought,
      return1W,
      return1M,
      return3M,
      riskLevel,
      signal,
      reason,
    });
  }

  return results;
}
```

- [ ] **Step 6: Update the render section**

Replace the lines that compute `assets` and render `<AssetPerformance>`:

Remove:
```tsx
  const assets = buildAssetPerformance(data.latestSnapshots, data.previousSnapshots);
```

and

```tsx
      {/* Asset Performance */}
      <AssetPerformance assets={assets} />
```

Add in their place (after `allocByCurrency`, before the `return`):

```ts
  const actionSignals = buildActionSignals(
    data.tickerHistory,
    currentSnapshots,
    data.holdings,
    data.investments,
  );
```

Then update the JSX. The full return should be:

```tsx
    <div className="space-y-6">
      {/* Net Worth Header + FX Rate */}
      <div className="flex items-start justify-between">
        {/* ... existing header unchanged ... */}
      </div>

      {/* Chart */}
      <NetWorthChart data={chartHistory} defaultRange={settings.timeRange} />

      {/* Relative Performance */}
      <IndexedPerformanceChart history={data.tickerHistory} defaultRange={settings.timeRange} />

      {/* Action Signals */}
      <ActionSignalTable assets={actionSignals} />

      {/* Allocation Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <AllocationCard title="By Asset Class" slices={allocByClass} />
        <AllocationCard title="By Risk Level" slices={allocByRisk} />
        <AllocationCard title="By Currency" slices={allocByCurrency} />
      </div>
    </div>
```

- [ ] **Step 7: Delete `src/components/asset-performance.tsx`**

```bash
rm src/components/asset-performance.tsx
```

- [ ] **Step 8: Verify the build compiles**

Run: `npm run build 2>&1 | tail -10`
Expected: Build succeeds with no errors.

- [ ] **Step 9: Commit**

```bash
git add src/app/\(app\)/dashboard/page.tsx src/components/action-signal-table.tsx src/components/indexed-performance-chart.tsx
git add -u src/components/asset-performance.tsx
git commit -m "feat: integrate indexed performance chart and action signals, remove AssetPerformance"
```

---

### Task 6: Manual QA in browser

**Files:** None (testing only)

- [ ] **Step 1: Start dev server**

Run: `npm run dev`

- [ ] **Step 2: Open dashboard and verify**

Open `http://localhost:3000` (or wherever the dashboard is routed) in a browser. Check:

1. NetWorthChart still renders correctly
2. Indexed Performance Chart shows below NetWorthChart with multiple colored lines
3. Time range toggles (1W, 1M, 3M, YTD, 1Y, ALL) work on both charts
4. Tooltip on the performance chart shows ticker names and indexed values
5. Action Signal Table shows below the chart with all columns populated
6. Signal pills are colored (green/yellow/red)
7. Return percentages are colored (green/red/muted)
8. Sorting: Sell items appear at top, Buy at bottom
9. "Why" column has readable one-liners
10. Allocation cards still render correctly at the bottom
11. No console errors
12. AssetPerformance section is gone

- [ ] **Step 3: Commit any fixes if needed**
