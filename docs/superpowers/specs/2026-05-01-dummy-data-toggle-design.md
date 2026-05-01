# Dummy Data Toggle (Demo Mode)

## Problem

The user wants to show the portfolio app to friends without exposing real financial data (net worth, holdings, balances).

## Solution

A "Demo Mode" toggle that scrambles all financial values using a session-scoped random multiplier. Toggled from the settings page, with a persistent "Demo" indicator in the nav bar.

## Scrambling Logic

- On toggle-on, generate a random multiplier between 0.3 and 3.0
- Store the multiplier in `sessionStorage` (resets on browser close)
- Apply the multiplier to all rendered numeric financial values
- The multiplier is consistent for the entire session, so proportions and allocations stay realistic

### What gets scrambled

- All dollar/won amounts (balances, totals, per-holding values)
- Share counts and quantities
- Net worth totals and historical snapshot values
- Price-per-unit on private investments

### What stays real

- Account names, asset types, ticker symbols
- Chart shapes and trends (Y-axis values shift proportionally)
- Navigation, settings, auth — everything non-financial

## Settings Integration

- Add a toggle row to the settings page, alongside the existing currency and time range controls
- Use `sessionStorage` instead of `localStorage` — mode resets when the browser closes
- Follow the existing `useSyncExternalStore` pattern in `src/lib/settings.ts`
- New exported members:
  - `useDemoMode()` — returns `{ isDemoMode: boolean; scramble: (value: number) => number }`
  - `setDemoMode(enabled: boolean)` — toggles demo mode on/off

## Nav Indicator

- When demo mode is on, render a small "Demo" pill/badge in the nav bar
- Subtle but always visible so the user knows they're looking at fake numbers
- No interactivity on the badge itself — toggle lives in settings only

## Data Layer Strategy

Apply scrambling at the **display layer** (components), not the data-fetching layer:

- Real data stays untouched in React state and Supabase queries
- Components call `scramble(value)` before rendering financial numbers
- This avoids side effects on snapshot sync, backfill logic, or any write path

### Integration Points

Each page/component that renders financial values needs to call `scramble()`:

1. **Dashboard page** (`src/app/(app)/dashboard/page.tsx`) — net worth total, per-holding values, account subtotals
2. **Assets page** (`src/app/(app)/assets/page.tsx`) — holding shares, values, private investment amounts
3. **Analytics page** (`src/app/(app)/analytics/page.tsx`) — performance numbers, historical values
4. **Net worth chart** (`src/components/net-worth-chart.tsx`) — Y-axis values in the area chart
5. **Allocation cards** (`src/components/allocation-card.tsx`) — dollar amounts in tooltips/labels

## Session Lifecycle

1. User opens settings → toggles "Demo Mode" on
2. A random multiplier (0.3–3.0) is generated and stored in `sessionStorage`
3. All financial values across the app are multiplied before rendering
4. Nav bar shows "Demo" badge
5. User toggles off → multiplier is cleared, real values render again
6. User closes browser → `sessionStorage` clears automatically, next visit shows real data

## Non-Goals

- No fake account names or ticker substitution
- No server-side awareness of demo mode (purely client-side)
- No URL parameter or shareable demo link
