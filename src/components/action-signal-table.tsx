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

const riskBadge: Record<string, string> = {
  Low: "bg-accent-light text-warm-dark",
  Medium: "bg-warning/20 text-[#7a6400]",
  High: "bg-bright-orange/40 text-[#8b4000]",
  "Very High": "bg-negative/20 text-negative",
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
    <div className="wise-card p-5">
      <h2 className="mb-3 text-sm font-semibold text-muted">Asset Performance</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-card-border/30 text-xs text-muted">
              <th className="px-2 py-1.5 font-semibold">Name</th>
              <th className="hidden px-2 py-1.5 font-semibold sm:table-cell">Ticker</th>
              <th className="hidden px-2 py-1.5 text-right font-semibold sm:table-cell">Value</th>
              <th className="px-2 py-1.5 text-right font-semibold">Since Bought</th>
              <th className="hidden px-2 py-1.5 text-right font-semibold md:table-cell">1W</th>
              <th className="px-2 py-1.5 text-right font-semibold">1M</th>
              <th className="hidden px-2 py-1.5 text-right font-semibold md:table-cell">3M</th>
              <th className="hidden px-2 py-1.5 font-semibold sm:table-cell">Risk</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((asset) => (
              <tr key={asset.ticker} className="border-b border-card-border/20">
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
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${riskBadge[asset.riskLevel] ?? "bg-muted/15 text-muted"}`}>
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
