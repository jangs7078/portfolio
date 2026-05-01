"use client";

import { formatCurrency, formatPct } from "@/lib/format";

export interface ActionSignalAsset {
  ticker: string;
  name: string;
  value: number;
  returnSinceBought: number | null;
  return1W: number | null;
  return1M: number | null;
  return3M: number | null;
  riskLevel: string;
}

interface Props {
  assets: ActionSignalAsset[];
}

const riskColors: Record<string, string> = {
  Low: "text-positive",
  Medium: "text-accent",
  High: "text-warning",
  "Very High": "text-negative",
};

function ReturnCell({ value, className = "" }: { value: number | null; className?: string }) {
  if (value === null) return <td className={`px-2 py-1.5 text-right text-xs text-muted ${className}`}>--</td>;
  return (
    <td
      className={`px-2 py-1.5 text-right text-xs font-medium ${
        value > 0 ? "text-positive" : value < 0 ? "text-negative" : "text-muted"
      } ${className}`}
    >
      {formatPct(Math.round(value * 100) / 100)}
    </td>
  );
}

export default function ActionSignalTable({ assets }: Props) {
  const sorted = [...assets].sort((a, b) => {
    const ra = a.returnSinceBought ?? -Infinity;
    const rb = b.returnSinceBought ?? -Infinity;
    return rb - ra;
  });

  return (
    <div className="rounded-lg border border-card-border bg-card p-4">
      <h2 className="mb-3 text-sm font-medium text-muted">Asset Performance</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-card-border text-xs text-muted">
              <th className="px-2 py-1.5 font-medium">Name</th>
              <th className="hidden px-2 py-1.5 font-medium sm:table-cell">Ticker</th>
              <th className="hidden px-2 py-1.5 text-right font-medium sm:table-cell">Value</th>
              <th className="px-2 py-1.5 text-right font-medium">Since Bought</th>
              <th className="hidden px-2 py-1.5 text-right font-medium md:table-cell">1W</th>
              <th className="px-2 py-1.5 text-right font-medium">1M</th>
              <th className="hidden px-2 py-1.5 text-right font-medium md:table-cell">3M</th>
              <th className="hidden px-2 py-1.5 font-medium sm:table-cell">Risk</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((asset) => (
              <tr key={asset.ticker} className="border-b border-card-border/50">
                <td className="px-2 py-1.5 text-xs font-medium truncate max-w-32">{asset.name}</td>
                <td className="hidden px-2 py-1.5 text-xs text-muted sm:table-cell">{asset.ticker}</td>
                <td className="hidden px-2 py-1.5 text-right text-xs text-muted sm:table-cell">
                  {formatCurrency(asset.value)}
                </td>
                <ReturnCell value={asset.returnSinceBought} />
                <ReturnCell value={asset.return1W} className="hidden md:table-cell" />
                <ReturnCell value={asset.return1M} />
                <ReturnCell value={asset.return3M} className="hidden md:table-cell" />
                <td className="hidden px-2 py-1.5 sm:table-cell">
                  <span className={`text-xs font-medium ${riskColors[asset.riskLevel] ?? "text-muted"}`}>
                    {asset.riskLevel}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
