export function formatCurrency(value: number, currency: "USD" | "KRW" = "USD"): string {
  if (currency === "KRW") {
    return `₩${Math.round(value).toLocaleString()}`;
  }
  return `$${Math.ceil(value).toLocaleString()}`;
}

export function formatPct(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatCompact(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}
