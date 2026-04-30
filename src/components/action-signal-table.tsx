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
