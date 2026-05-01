# Dummy Data Toggle (Demo Mode) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Demo Mode" toggle that scrambles all financial values with a session-scoped random multiplier so the user can show the app without exposing real data.

**Architecture:** A `useDemoMode()` hook backed by `sessionStorage` provides a `scramble(value)` function. The scramble is applied at the display layer — each page/component calls `scramble()` before rendering financial numbers. The nav bar shows a "Demo" pill when active. The settings page gets a toggle row.

**Tech Stack:** React 19, Next.js 16, TypeScript, Tailwind CSS 4, `useSyncExternalStore`

---

## File Structure

| Action | File | Responsibility |
|--------|------|---------------|
| Create | `src/lib/demo-mode.ts` | Demo mode external store: `useDemoMode()`, `setDemoMode()`, `scramble()` |
| Modify | `src/components/nav.tsx` | Add "Demo" badge when demo mode is active |
| Modify | `src/app/(app)/settings/page.tsx` | Add Demo Mode toggle row |
| Modify | `src/app/(app)/dashboard/page.tsx` | Scramble all financial values |
| Modify | `src/components/net-worth-chart.tsx` | Scramble chart Y-axis values and tooltip |
| Modify | `src/components/allocation-card.tsx` | Scramble dollar values in legend |
| Modify | `src/app/(app)/assets/page.tsx` | Scramble holding values, shares, account totals, investment values |
| Modify | `src/app/(app)/analytics/page.tsx` | Scramble asset values in the action signal data |
| Modify | `src/components/action-signal-table.tsx` | Scramble value column |

---

### Task 1: Create the Demo Mode Store

**Files:**
- Create: `src/lib/demo-mode.ts`

- [ ] **Step 1: Create the demo mode external store**

```ts
"use client";

import { useSyncExternalStore } from "react";

const SESSION_KEY = "portfolio-demo-mode";

interface DemoState {
  enabled: boolean;
  multiplier: number;
}

const defaultState: DemoState = { enabled: false, multiplier: 1 };

let listeners: Array<() => void> = [];
let cached: DemoState = defaultState;

function notify() {
  for (const l of listeners) l();
}

function refresh(): void {
  if (typeof window === "undefined") return;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) { cached = defaultState; return; }
    cached = { ...defaultState, ...JSON.parse(raw) };
  } catch {
    cached = defaultState;
  }
}

function getSnapshot(): DemoState {
  return cached;
}

if (typeof window !== "undefined") {
  refresh();
}

export function setDemoMode(enabled: boolean) {
  const next: DemoState = enabled
    ? { enabled: true, multiplier: 0.3 + Math.random() * 2.7 }
    : { enabled: false, multiplier: 1 };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
  cached = next;
  notify();
}

export function useDemoMode() {
  const state = useSyncExternalStore(
    (cb) => {
      listeners.push(cb);
      return () => {
        listeners = listeners.filter((l) => l !== cb);
      };
    },
    getSnapshot,
    () => defaultState,
  );

  return {
    isDemoMode: state.enabled,
    scramble: (value: number) => (state.enabled ? value * state.multiplier : value),
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/demo-mode.ts
git commit -m "feat: add demo mode external store with session-scoped scrambling"
```

---

### Task 2: Add Demo Mode Toggle to Settings Page

**Files:**
- Modify: `src/app/(app)/settings/page.tsx`

- [ ] **Step 1: Add the demo mode toggle to the Display section**

Add import at the top of the file, after the existing settings import:

```ts
import { useDemoMode, setDemoMode } from "@/lib/demo-mode";
```

Inside `SettingsPage()`, after `const settings = useSettings();`, add:

```ts
const { isDemoMode } = useDemoMode();
```

Add a new toggle row inside the Display section's `<div className="space-y-4">`, after the time range row (after the closing `</div>` of the time range flex container):

```tsx
<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
  <div>
    <p className="font-medium">Demo Mode</p>
    <p className="text-xs text-muted">Scramble financial values for privacy</p>
  </div>
  <div className="flex gap-2">
    {(["Off", "On"] as const).map((label) => {
      const isOn = label === "On";
      const active = isDemoMode === isOn;
      return (
        <button
          key={label}
          onClick={() => setDemoMode(isOn)}
          className={`rounded-full px-4 py-1.5 text-sm transition-all ${
            active
              ? "bg-accent text-accent-dark font-semibold"
              : "text-muted hover:text-foreground hover:scale-105 active:scale-95"
          }`}
        >
          {label}
        </button>
      );
    })}
  </div>
</div>
```

- [ ] **Step 2: Verify the settings page renders the toggle**

Run the dev server and navigate to `/settings`. Confirm the Demo Mode toggle appears in the Display section below the time range selector. Click On/Off and verify the button state changes.

- [ ] **Step 3: Commit**

```bash
git add src/app/\(app\)/settings/page.tsx
git commit -m "feat: add demo mode toggle to settings page"
```

---

### Task 3: Add Demo Badge to Nav Bar

**Files:**
- Modify: `src/components/nav.tsx`

- [ ] **Step 1: Add the demo badge to the nav**

Add import at the top of the file:

```ts
import { useDemoMode } from "@/lib/demo-mode";
```

Inside the `Nav` component, after `const pathname = usePathname();`, add:

```ts
const { isDemoMode } = useDemoMode();
```

Add the badge right after the closing `</div>` of the links flex container (the `<div className="flex w-full justify-around ...">`) and before the closing `</div>` of the `mx-auto` wrapper:

```tsx
{isDemoMode && (
  <span className="rounded-full bg-warning/20 px-3 py-1 text-xs font-semibold text-[#7a6400]">
    Demo
  </span>
)}
```

- [ ] **Step 2: Verify the badge appears**

With the dev server running, go to settings, toggle Demo Mode on, and verify the "Demo" badge appears in the nav bar. Toggle off and confirm it disappears.

- [ ] **Step 3: Commit**

```bash
git add src/components/nav.tsx
git commit -m "feat: show Demo badge in nav when demo mode is active"
```

---

### Task 4: Scramble Dashboard Values

**Files:**
- Modify: `src/app/(app)/dashboard/page.tsx`

- [ ] **Step 1: Add demo mode scrambling to the dashboard**

Add import at the top:

```ts
import { useDemoMode } from "@/lib/demo-mode";
```

Inside `DashboardPage()`, after `const settings = useSettings();`, add:

```ts
const { scramble } = useDemoMode();
```

Apply `scramble()` to every financial value that gets rendered. Replace the following block (lines ~252-265, the value computation section after the loading check):

```ts
const snapshotTotalUsd = data.latestSnapshots.reduce((sum, s) => sum + Number(s.value_usd), 0);
const totalUsd = data.liveTotalUsd ?? snapshotTotalUsd;
const prevTotalUsd = data.previousSnapshots.reduce((sum, s) => sum + Number(s.value_usd), 0);
const dailyChange = totalUsd - prevTotalUsd;
const dailyChangePct = prevTotalUsd > 0 ? (dailyChange / prevTotalUsd) * 100 : 0;
const positive = dailyChange >= 0;
const currentFxRate = data.liveFxRate ?? data.fxRate;

const showKrw = settings.currency === "KRW";
const primaryTotal = showKrw ? Math.round(totalUsd * currentFxRate) : totalUsd;
const primaryChange = showKrw ? Math.round(dailyChange * currentFxRate) : dailyChange;
const primaryCurrency = showKrw ? "KRW" as const : "USD" as const;
const secondaryTotal = showKrw ? totalUsd : Math.round(totalUsd * currentFxRate);
const secondaryCurrency = showKrw ? "USD" as const : "KRW" as const;
```

With this scrambled version:

```ts
const snapshotTotalUsd = data.latestSnapshots.reduce((sum, s) => sum + Number(s.value_usd), 0);
const totalUsd = scramble(data.liveTotalUsd ?? snapshotTotalUsd);
const prevTotalUsd = scramble(data.previousSnapshots.reduce((sum, s) => sum + Number(s.value_usd), 0));
const dailyChange = totalUsd - prevTotalUsd;
const dailyChangePct = prevTotalUsd > 0 ? (dailyChange / prevTotalUsd) * 100 : 0;
const positive = dailyChange >= 0;
const currentFxRate = data.liveFxRate ?? data.fxRate;

const showKrw = settings.currency === "KRW";
const primaryTotal = showKrw ? Math.round(totalUsd * currentFxRate) : totalUsd;
const primaryChange = showKrw ? Math.round(dailyChange * currentFxRate) : dailyChange;
const primaryCurrency = showKrw ? "KRW" as const : "USD" as const;
const secondaryTotal = showKrw ? totalUsd : Math.round(totalUsd * currentFxRate);
const secondaryCurrency = showKrw ? "USD" as const : "KRW" as const;
```

Also scramble the chart history. Replace the `chartHistory` block:

```ts
const chartHistory = (() => {
  if (data.liveTotalUsd == null || currentFxRate === 0) return data.netWorthHistory;
  const today = new Date().toISOString().split("T")[0];
  const history = data.netWorthHistory.filter((d) => d.date < today);
  history.push({
    date: today,
    value: Math.round(data.liveTotalUsd),
    valueKrw: Math.round(data.liveTotalUsd * currentFxRate),
    fxRate: currentFxRate,
  });
  return history;
})();
```

With:

```ts
const chartHistory = (() => {
  const applyScramble = (history: typeof data.netWorthHistory) =>
    history.map((d) => ({ ...d, value: scramble(d.value), valueKrw: scramble(d.valueKrw) }));

  if (data.liveTotalUsd == null || currentFxRate === 0) return applyScramble(data.netWorthHistory);
  const today = new Date().toISOString().split("T")[0];
  const history = data.netWorthHistory.filter((d) => d.date < today);
  history.push({
    date: today,
    value: Math.round(data.liveTotalUsd),
    valueKrw: Math.round(data.liveTotalUsd * currentFxRate),
    fxRate: currentFxRate,
  });
  return applyScramble(history);
})();
```

Also scramble the allocation card values. Replace the three allocation lines:

```ts
const currentSnapshots = data.liveSnapshots ?? data.latestSnapshots;
const allocByClass = buildAllocByClass(currentSnapshots, data.holdings, data.investments);
const allocByRisk = buildAllocByRisk(currentSnapshots, data.holdings, data.investments);
const allocByCurrency = buildAllocByCurrency(currentSnapshots);
```

With scrambled snapshot values:

```ts
const currentSnapshots = (data.liveSnapshots ?? data.latestSnapshots).map((s) => ({
  ...s,
  value_usd: scramble(Number(s.value_usd)),
}));
const allocByClass = buildAllocByClass(currentSnapshots, data.holdings, data.investments);
const allocByRisk = buildAllocByRisk(currentSnapshots, data.holdings, data.investments);
const allocByCurrency = buildAllocByCurrency(currentSnapshots);
```

- [ ] **Step 2: Verify dashboard scrambling**

With demo mode on, navigate to the dashboard. Verify:
- Net worth header shows different (scrambled) numbers
- Chart Y-axis values are scrambled
- Allocation card dollar amounts are scrambled
- Allocation percentages remain the same (since we apply a uniform multiplier)

Toggle demo mode off and confirm real values return.

- [ ] **Step 3: Commit**

```bash
git add src/app/\(app\)/dashboard/page.tsx
git commit -m "feat: scramble dashboard financial values in demo mode"
```

---

### Task 5: Scramble Assets Page Values

**Files:**
- Modify: `src/app/(app)/assets/page.tsx`

- [ ] **Step 1: Add demo mode scrambling to the AccountCard component**

Add import at the top of the file:

```ts
import { useDemoMode } from "@/lib/demo-mode";
```

Inside the `AccountCard` component, after the `const [loading, setLoading] = useState(true);` line, add:

```ts
const { scramble } = useDemoMode();
```

Wrap `getValue` and `getValueUsd` returns with `scramble`. Replace:

```ts
const getValue = (h: Holding) => {
  if (h.asset_type === "cash") return h.shares;
  const price = prices[h.ticker];
  if (price == null) return 0;
  return price * h.shares;
};

// Convert all holdings to USD for the account total
const getValueUsd = (h: Holding) => {
  const native = getValue(h);
  if (h.currency === "KRW" && fxRate) return native / fxRate;
  return native;
};
```

With:

```ts
const getValue = (h: Holding) => {
  if (h.asset_type === "cash") return scramble(h.shares);
  const price = prices[h.ticker];
  if (price == null) return 0;
  return scramble(price * h.shares);
};

// Convert all holdings to USD for the account total
const getValueUsd = (h: Holding) => {
  if (h.asset_type === "cash") {
    const native = scramble(h.shares);
    if (h.currency === "KRW" && fxRate) return native / fxRate;
    return native;
  }
  const price = prices[h.ticker];
  if (price == null) return 0;
  const native = scramble(price * h.shares);
  if (h.currency === "KRW" && fxRate) return native / fxRate;
  return native;
};
```

Also scramble the shares display in the table. Find the shares `<td>`:

```tsx
<td className="py-2 px-2 text-right tabular-nums">{h.shares.toLocaleString()}</td>
```

Replace with:

```tsx
<td className="py-2 px-2 text-right tabular-nums">{scramble(h.shares).toLocaleString()}</td>
```

- [ ] **Step 2: Add demo mode scrambling to the ManagePage private investments section**

Inside `ManagePage`, after `const [pricesLoading, setPricesLoading] = useState(false);`, add:

```ts
const { scramble } = useDemoMode();
```

Replace `getInvValue` and `getInvValueUsd`:

```ts
const getInvValue = (inv: PrivateInvestment) => {
  if (inv.ticker && prices[inv.ticker] != null) {
    return prices[inv.ticker]! * inv.quantity;
  }
  return inv.quantity * inv.price_per_unit;
};

const getInvValueUsd = (inv: PrivateInvestment) => {
  const native = getInvValue(inv);
  if (inv.currency === "KRW" && fxRate) return native / fxRate;
  return native;
};
```

With:

```ts
const getInvValue = (inv: PrivateInvestment) => {
  if (inv.ticker && prices[inv.ticker] != null) {
    return scramble(prices[inv.ticker]! * inv.quantity);
  }
  return scramble(inv.quantity * inv.price_per_unit);
};

const getInvValueUsd = (inv: PrivateInvestment) => {
  const native = getInvValue(inv);
  if (inv.currency === "KRW" && fxRate) return native / fxRate;
  return native;
};
```

Also scramble the quantity display in the private investments table. Find:

```tsx
<td className="py-2 px-2 text-right tabular-nums">
  {inv.quantity.toLocaleString()}{inv.unit_label ? ` ${inv.unit_label}` : ""}
</td>
```

Replace with:

```tsx
<td className="py-2 px-2 text-right tabular-nums">
  {scramble(inv.quantity).toLocaleString()}{inv.unit_label ? ` ${inv.unit_label}` : ""}
</td>
```

- [ ] **Step 3: Verify assets page scrambling**

With demo mode on, navigate to `/assets`. Verify:
- Account totals are scrambled
- Individual holding values and shares are scrambled
- Private investment values and quantities are scrambled
- Toggle off and confirm real values return

- [ ] **Step 4: Commit**

```bash
git add src/app/\(app\)/assets/page.tsx
git commit -m "feat: scramble assets page financial values in demo mode"
```

---

### Task 6: Scramble Analytics Page Values

**Files:**
- Modify: `src/app/(app)/analytics/page.tsx`
- Modify: `src/components/action-signal-table.tsx`

- [ ] **Step 1: Scramble analytics values**

In `src/app/(app)/analytics/page.tsx`, add import:

```ts
import { useDemoMode } from "@/lib/demo-mode";
```

Inside `AnalyticsPage()`, after `const [loading, setLoading] = useState(true);`, add:

```ts
const { scramble } = useDemoMode();
```

Replace the line that sets action signals:

```ts
setActionSignals(buildActionSignals(tickerHistory, liveSnapshots, holdings, investments));
```

This won't work directly since `scramble` changes per render but `setActionSignals` runs once in the effect. Instead, scramble at render time. After the loading check, before the return, add:

```ts
const scrambledSignals = actionSignals.map((a) => ({ ...a, value: scramble(a.value) }));
```

And pass `scrambledSignals` to the table instead of `actionSignals`:

Replace:

```tsx
<ActionSignalTable assets={actionSignals} />
```

With:

```tsx
<ActionSignalTable assets={scrambledSignals} />
```

- [ ] **Step 2: Verify analytics scrambling**

With demo mode on, navigate to `/analytics`. Verify the Value column shows scrambled numbers. Return percentages should remain unchanged (they're computed from price history, not portfolio values). Toggle off and confirm real values return.

- [ ] **Step 3: Commit**

```bash
git add src/app/\(app\)/analytics/page.tsx
git commit -m "feat: scramble analytics page values in demo mode"
```

---

### Task 7: Final Verification

- [ ] **Step 1: End-to-end test**

With the dev server running:

1. Go to `/settings`, toggle Demo Mode **On**
2. Verify "Demo" badge appears in nav bar
3. Navigate to `/dashboard` — all dollar amounts and chart values should be scrambled
4. Navigate to `/assets` — all shares, values, and totals should be scrambled
5. Navigate to `/analytics` — value column should be scrambled
6. Toggle Demo Mode **Off** in settings
7. Verify "Demo" badge disappears
8. Verify all pages show real values again
9. Close the browser tab, reopen the app — confirm demo mode is off (sessionStorage cleared)

- [ ] **Step 2: Commit all changes (if any fixups needed)**

```bash
git add -A
git commit -m "fix: demo mode polish"
```
