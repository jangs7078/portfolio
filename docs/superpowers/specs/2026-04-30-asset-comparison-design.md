# Asset Comparison & Action Signal — Design Spec

## Overview

Add two new dashboard components to help identify which assets to buy more of or sell:

1. **Indexed Performance Line Chart** — normalized comparison of all held non-cash assets over time
2. **Action Signal Table** — returns across four periods with momentum + risk-adjusted buy/hold/sell signals

This replaces the existing `AssetPerformance` component, which only shows value bars and 1-day change.

## Data Layer

### New DB function: `getSnapshotHistoryByTicker`

**File:** `src/lib/db.ts`

Query all snapshots for a given set of tickers, ordered by date ascending. Returns `Snapshot[]`. Single query with `.in("ticker", tickers)`, paginated like existing `getSnapshotDates` to handle PostgREST limits.

### New API endpoint: `GET /api/history`

**File:** `src/app/api/history/route.ts`

**Query params:** `tickers` (comma-separated)

**Response:**
```json
{
  "history": {
    "AAPL": {
      "dates": ["2025-01-15", "2025-01-16", ...],
      "values": [15000, 15200, ...],
      "firstBoughtDate": "2025-01-15"
    }
  }
}
```

**Logic per ticker:**
- Query snapshots, group by date, sum `value_usd` (a ticker may appear across multiple accounts)
- `firstBoughtDate` = earliest date where `value_native > 0`
- Return all dates and corresponding aggregated USD values

### Data consumption

The dashboard page fetches `/api/history` with all non-cash tickers after the initial data load. This data feeds both the chart and the table.

## Component 1: Indexed Performance Line Chart

**File:** `src/components/indexed-performance-chart.tsx`

### Props
```ts
interface TickerHistory {
  dates: string[];
  values: number[];
  firstBoughtDate: string;
}

interface Props {
  history: Record<string, TickerHistory>;
  defaultRange?: "1W" | "1M" | "3M" | "YTD" | "1Y" | "ALL";
}
```

### Behavior
- All non-cash assets shown as lines simultaneously
- Y-axis: indexed to 100 at the start of the visible time range. For each ticker, the value at each date = `(value / value_at_range_start) * 100`
- X-axis: date (linear time scale, matching NetWorthChart pattern)
- Time range toggle: 1W, 1M, 3M, YTD, 1Y, ALL — same button style as NetWorthChart
- Tooltip on hover: shows date + each ticker's indexed value and actual % return from range start
- Legend: ticker labels with color dots, rendered below the chart
- Color palette: generated from a set of 12+ visually distinct colors for dark backgrounds
- Tickers with no data in the selected range are hidden

### Styling
- Same card container as other components: `rounded-lg border border-card-border bg-card p-4`
- Title: "Relative Performance"
- Height: `h-72` (slightly taller than NetWorthChart to accommodate more lines)

## Component 2: Action Signal Table

**File:** `src/components/action-signal-table.tsx`

### Props
```ts
interface ActionSignalAsset {
  ticker: string;
  value: number;
  returnSinceBought: number | null; // % — null if insufficient data
  return1W: number | null;
  return1M: number | null;
  return3M: number | null;
  riskLevel: string; // "Low" | "Medium" | "High" | "Very High"
  signal: "Buy" | "Hold" | "Sell";
  reason: string;
}

interface Props {
  assets: ActionSignalAsset[];
}
```

### Table Columns
| Column | Content |
|--------|---------|
| Ticker | Ticker symbol |
| Value | Current USD value, formatted |
| Since Bought | % return since first snapshot with value_native > 0 |
| 1W | % return over 1 week |
| 1M | % return over 1 month |
| 3M | % return over 3 months |
| Risk | Risk level badge |
| Signal | Buy / Hold / Sell pill |
| Why | One-liner justification |

### Signal Logic

**Step 1 — Momentum score** (-3 to +3):
- +1 for each positive period among 1W, 1M, 3M
- -1 for each negative period
- null periods are skipped (don't count for or against)

**Step 2 — Risk-adjusted signal:**

| Momentum | Risk Low/Medium | Risk High/Very High |
|----------|----------------|-------------------|
| >= 2     | **Buy**        | **Buy** (if 3), else **Hold** |
| 1        | **Hold**       | **Hold** |
| 0        | **Hold**       | **Hold** |
| -1       | **Hold**       | **Hold** |
| <= -2    | **Hold**       | **Sell** |
| -3       | **Sell**       | **Sell** |

**Step 3 — One-liner justification** (auto-generated from conditions):

Examples:
- Buy + low risk: "Strong momentum across all periods, low risk"
- Buy + high risk: "Strong momentum justifies high risk exposure"
- Hold + mixed: "Mixed signals — up short-term, down long-term"
- Hold + low risk + negative: "Dipping but low risk — likely temporary"
- Sell + high risk: "Declining on all timeframes with high risk exposure"
- Sell + low risk: "Consistent losses across all periods"

### Sorting
Default: Sells first, then Holds, then Buys. Within each group, sort by momentum score ascending (worst first).

### Styling
- Same card container as other components
- Title: "Action Signals"
- Return percentages: green for positive, red for negative, muted for zero/null
- Signal column: colored pill — green for Buy, yellow for Hold, red for Sell
- Risk column: text badge matching existing risk colors (green/blue/yellow/red)

## Return Computation

All returns are computed from snapshot data on the server in `/api/history`. The client computes returns from the history response:

```
return = ((latest_value - reference_value) / reference_value) * 100
```

Where `reference_value` is the aggregated `value_usd` for that ticker at:
- **Since bought**: `firstBoughtDate`
- **1W**: closest snapshot date to 7 days ago
- **1M**: closest snapshot date to 1 month ago
- **3M**: closest snapshot date to 3 months ago

If no snapshot exists in the relevant range, the return is `null`.

## Dashboard Integration

**File:** `src/app/(app)/dashboard/page.tsx`

### Changes:
1. Remove `AssetPerformance` import and usage
2. Remove `buildAssetPerformance` function
3. Add fetch to `/api/history` in the `useEffect` load function
4. Add return computation logic (client-side, from history data)
5. Add signal computation logic (client-side)
6. Render new components in order:
   - NetWorthChart
   - IndexedPerformanceChart
   - ActionSignalTable
   - Allocation Cards

### Data flow:
```
Dashboard load
  -> fetch snapshots, holdings, investments (existing)
  -> extract non-cash tickers
  -> fetch /api/history?tickers=...
  -> compute indexed values for chart
  -> compute returns + signals for table
  -> render both components
```

## Files Changed

| File | Action |
|------|--------|
| `src/lib/db.ts` | Add `getSnapshotHistoryByTicker` |
| `src/app/api/history/route.ts` | New endpoint |
| `src/components/indexed-performance-chart.tsx` | New component |
| `src/components/action-signal-table.tsx` | New component |
| `src/app/(app)/dashboard/page.tsx` | Integrate new components, remove AssetPerformance |
| `src/components/asset-performance.tsx` | Delete |
