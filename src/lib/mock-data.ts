// Mock data for UI development. Will be replaced with Supabase queries.

export const mockNetWorth = {
  total_usd: 487_250.32,
  daily_change_usd: 3_421.87,
  daily_change_pct: 0.71,
};

export const mockNetWorthHistory = [
  { date: "2025-10-01", value: 410_000 },
  { date: "2025-11-01", value: 425_000 },
  { date: "2025-12-01", value: 418_000 },
  { date: "2026-01-01", value: 440_000 },
  { date: "2026-02-01", value: 455_000 },
  { date: "2026-03-01", value: 472_000 },
  { date: "2026-04-01", value: 483_800 },
  { date: "2026-04-25", value: 487_250 },
];

export const mockAssetPerformance = [
  { ticker: "NVDA", name: "NVIDIA", value: 82_400, change_1d: 2.34, change_1m: 8.12 },
  { ticker: "AAPL", name: "Apple", value: 45_200, change_1d: -0.45, change_1m: 1.23 },
  { ticker: "VOO", name: "Vanguard S&P 500", value: 68_500, change_1d: 0.82, change_1m: 3.45 },
  { ticker: "SGOV", name: "iShares 0-3 Month Treasury", value: 25_000, change_1d: 0.01, change_1m: 0.38 },
  { ticker: "삼성전자", name: "Samsung Electronics", value: 31_200, change_1d: -1.12, change_1m: -2.45 },
  { ticker: "CASH_USD", name: "USD Cash", value: 42_000, change_1d: 0, change_1m: 0 },
  { ticker: "CASH_KRW", name: "KRW Cash", value: 18_500, change_1d: 0.05, change_1m: -0.32 },
  { ticker: "SI", name: "Physical Silver", value: 4_950, change_1d: 1.45, change_1m: 5.67 },
  { ticker: "TechCo", name: "TechCo (Angel)", value: 50_000, change_1d: 0, change_1m: 0 },
  { ticker: "VF3", name: "Venture Fund III (LP)", value: 120_000, change_1d: 0, change_1m: 0 },
];

export const mockAllocationByClass = [
  { label: "Stock", value: 158_800, pct: 32.6 },
  { label: "ETF", value: 93_500, pct: 19.2 },
  { label: "Bond/Treasury", value: 25_000, pct: 5.1 },
  { label: "Cash", value: 60_500, pct: 12.4 },
  { label: "LP Fund", value: 120_000, pct: 24.6 },
  { label: "Commodity", value: 4_950, pct: 1.0 },
  { label: "Private Equity", value: 50_000, pct: 10.3 },
];

export const mockAllocationByRisk = [
  { label: "Low", value: 85_500, pct: 17.5, color: "#22c55e" },
  { label: "Medium", value: 68_500, pct: 14.1, color: "#3b82f6" },
  { label: "High", value: 163_350, pct: 33.5, color: "#eab308" },
  { label: "Very High", value: 170_000, pct: 34.9, color: "#ef4444" },
];

export const mockAllocationByCurrency = [
  { label: "USD", value: 437_550, pct: 89.8 },
  { label: "KRW", value: 49_700, pct: 10.2 },
];

export const mockFxRate = {
  rate: 1_372.45,
  change_1d: -0.23,
  change_1w: 0.87,
  change_1m: -1.45,
};

export const mockAccounts = [
  {
    id: "1",
    name: "Chase",
    type: "checking" as const,
    country: "US" as const,
    total_value: 42_000,
    holdings_count: 1,
  },
  {
    id: "2",
    name: "Robinhood",
    type: "brokerage" as const,
    country: "US" as const,
    total_value: 127_600,
    holdings_count: 3,
  },
  {
    id: "3",
    name: "Wealthfront",
    type: "brokerage" as const,
    country: "US" as const,
    total_value: 93_500,
    holdings_count: 4,
  },
  {
    id: "4",
    name: "Charles Schwab",
    type: "401k" as const,
    country: "US" as const,
    total_value: 68_500,
    holdings_count: 2,
  },
  {
    id: "5",
    name: "삼성증권",
    type: "brokerage" as const,
    country: "KR" as const,
    total_value: 31_200,
    holdings_count: 2,
  },
  {
    id: "6",
    name: "하나은행",
    type: "savings" as const,
    country: "KR" as const,
    total_value: 18_500,
    holdings_count: 1,
  },
];
