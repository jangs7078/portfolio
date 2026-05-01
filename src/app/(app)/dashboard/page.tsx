"use client";

import { useEffect, useState } from "react";
import { formatCurrency, formatPct } from "@/lib/format";
import {
  getSnapshotsByDate,
  getNetWorthByDate,
  getAllHoldings,
  getPrivateInvestments,
  getLatestSnapshotDate,
  getSnapshotDates,
} from "@/lib/db";
import type { Snapshot, Holding, PrivateInvestment } from "@/lib/types";
import NetWorthChart from "@/components/net-worth-chart";
import AllocationCard from "@/components/allocation-card";
import FxCard from "@/components/fx-card";
import { useSettings } from "@/lib/settings";

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
}

function buildAllocByClass(
  latest: Snapshot[],
  holdings: Holding[],
  investments: PrivateInvestment[],
) {
  const holdingMap = new Map(holdings.map((h) => [h.id, h]));
  const invMap = new Map(investments.map((i) => [i.id, i]));
  const groups: Record<string, number> = {};

  for (const s of latest) {
    let assetType = "Other";
    if (s.holding_id) {
      const h = holdingMap.get(s.holding_id);
      if (h) assetType = h.asset_type;
    } else if (s.investment_id) {
      const inv = invMap.get(s.investment_id);
      if (inv) assetType = inv.asset_type;
    }
    const label = assetType.charAt(0).toUpperCase() + assetType.slice(1);
    groups[label] = (groups[label] || 0) + Number(s.value_usd);
  }

  const total = Object.values(groups).reduce((a, b) => a + b, 0);
  return Object.entries(groups)
    .map(([label, value]) => ({
      label,
      value: Math.round(value),
      pct: Math.round((value / total) * 1000) / 10,
    }))
    .sort((a, b) => {
      const order = ["Cash", "Bond", "Index", "Etf", "Stock", "Commodity", "Lp", "Other"];
      return (order.indexOf(a.label) === -1 ? order.length : order.indexOf(a.label))
        - (order.indexOf(b.label) === -1 ? order.length : order.indexOf(b.label));
    });
}

function buildAllocByRisk(
  latest: Snapshot[],
  holdings: Holding[],
  investments: PrivateInvestment[],
) {
  const colors: Record<string, string> = {
    Low: "#22c55e",
    Medium: "#3b82f6",
    High: "#eab308",
    "Very High": "#ef4444",
  };
  const holdingMap = new Map(holdings.map((h) => [h.id, h]));
  const invMap = new Map(investments.map((i) => [i.id, i]));
  const groups: Record<string, number> = {};

  for (const s of latest) {
    let riskLevel: string | null = null;
    if (s.holding_id) {
      const h = holdingMap.get(s.holding_id);
      if (h) riskLevel = h.risk_level;
    } else if (s.investment_id) {
      const inv = invMap.get(s.investment_id);
      if (inv) riskLevel = inv.risk_level;
    }
    const level = riskLevel
      ? riskLevel.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : "Unclassified";
    groups[level] = (groups[level] || 0) + Number(s.value_usd);
  }

  const total = Object.values(groups).reduce((a, b) => a + b, 0);
  return Object.entries(groups)
    .map(([label, value]) => ({
      label,
      value: Math.round(value),
      pct: Math.round((value / total) * 1000) / 10,
      color: colors[label],
    }))
    .sort((a, b) => {
      const order = ["Low", "Medium", "High", "Very High", "Unclassified"];
      return order.indexOf(a.label) - order.indexOf(b.label);
    });
}

function buildAllocByCurrency(latest: Snapshot[]) {
  const groups: Record<string, number> = {};
  for (const s of latest) {
    groups[s.currency] = (groups[s.currency] || 0) + Number(s.value_usd);
  }
  const total = Object.values(groups).reduce((a, b) => a + b, 0);
  return Object.entries(groups)
    .map(([label, value]) => ({
      label,
      value: Math.round(value),
      pct: Math.round((value / total) * 1000) / 10,
    }))
    .sort((a, b) => b.value - a.value);
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [latestDate, allDates, holdings, investments] =
        await Promise.all([
          getLatestSnapshotDate(),
          getSnapshotDates(),
          getAllHoldings(),
          getPrivateInvestments(),
        ]);

      // find previous date
      const dateIdx = allDates.indexOf(latestDate);
      const prevDate = dateIdx > 0 ? allDates[dateIdx - 1] : latestDate;

      const [latestSnapshots, previousSnapshots, netWorthHistory] =
        await Promise.all([
          getSnapshotsByDate(latestDate),
          getSnapshotsByDate(prevDate),
          getNetWorthByDate(),
        ]);

      const fxRate = Number(latestSnapshots.find((s) => s.fx_rate)?.fx_rate || 0);
      const prevFxRate = Number(previousSnapshots.find((s) => s.fx_rate)?.fx_rate || 0);

      // Fetch live prices for today's net worth
      const holdingTickers = holdings.filter((h) => h.asset_type !== "cash" && h.shares !== 0).map((h) => h.ticker);
      const investmentTickers = investments.filter((i) => i.ticker).map((i) => i.ticker!);
      const allTickers = [...new Set([...holdingTickers, ...investmentTickers])];

      let liveTotalUsd: number | null = null;
      let liveFxRate: number | null = null;
      let liveSnapshots: Snapshot[] | null = null;

      if (allTickers.length > 0) {
        try {
          const res = await fetch(`/api/quotes?tickers=${allTickers.join(",")}`);
          const quoteData = await res.json();
          const prices: Record<string, number | null> = quoteData.prices ?? {};
          liveFxRate = typeof quoteData.fxRate === "number" ? quoteData.fxRate : null;

          // Build a map from holding/investment id to live USD value
          const liveValueByHoldingId = new Map<string, number>();
          const liveValueByInvestmentId = new Map<string, number>();

          let totalUsd = 0;
          for (const h of holdings) {
            if (h.shares === 0) continue;
            let value: number;
            if (h.asset_type === "cash") {
              value = h.shares;
            } else {
              const price = prices[h.ticker];
              if (price == null) continue;
              value = price * h.shares;
            }
            let valueUsd: number;
            if (h.currency === "KRW" && liveFxRate) {
              valueUsd = value / liveFxRate;
            } else {
              valueUsd = value;
            }
            totalUsd += valueUsd;
            liveValueByHoldingId.set(h.id, valueUsd);
          }
          for (const inv of investments) {
            let value: number;
            if (inv.ticker && prices[inv.ticker] != null) {
              value = prices[inv.ticker]! * inv.quantity;
            } else {
              value = inv.quantity * inv.price_per_unit;
            }
            let valueUsd: number;
            if (inv.currency === "KRW" && liveFxRate) {
              valueUsd = value / liveFxRate;
            } else {
              valueUsd = value;
            }
            totalUsd += valueUsd;
            liveValueByInvestmentId.set(inv.id, valueUsd);
          }
          liveTotalUsd = totalUsd;

          // Create live-adjusted snapshots for allocation charts
          liveSnapshots = latestSnapshots.map((s) => {
            const liveValue =
              (s.holding_id && liveValueByHoldingId.get(s.holding_id)) ??
              (s.investment_id && liveValueByInvestmentId.get(s.investment_id)) ??
              null;
            if (liveValue != null) {
              return { ...s, value_usd: liveValue } as Snapshot;
            }
            return s;
          });
        } catch {
          // Fall back to snapshot data
        }
      }

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
      });
      setLoading(false);
    }
    load();
  }, []);

  const settings = useSettings();

  if (loading || !data) {
    return <div className="flex min-h-[50vh] items-center justify-center text-muted">Loading...</div>;
  }

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

  // Append today's live data point to chart history
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

  const currentSnapshots = data.liveSnapshots ?? data.latestSnapshots;
  const allocByClass = buildAllocByClass(currentSnapshots, data.holdings, data.investments);
  const allocByRisk = buildAllocByRisk(currentSnapshots, data.holdings, data.investments);
  const allocByCurrency = buildAllocByCurrency(currentSnapshots);

  return (
    <div className="space-y-6">
      {/* Net Worth Header + FX Rate */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted">Total Net Worth</p>
          <div className="flex items-baseline gap-3">
            <h1 className="text-4xl font-bold tabular-nums">
              {formatCurrency(primaryTotal, primaryCurrency)}
            </h1>
            <span
              className={`text-sm font-medium ${positive ? "text-positive" : "text-negative"}`}
            >
              {positive ? "+" : ""}
              {formatCurrency(primaryChange, primaryCurrency)} ({formatPct(Math.round(dailyChangePct * 100) / 100)})
              today
            </span>
          </div>
          <p className="mt-1 text-lg tabular-nums text-muted">
            {formatCurrency(secondaryTotal, secondaryCurrency)}
          </p>
        </div>
        <div className="shrink-0">
          <FxCard rate={currentFxRate} />
        </div>
      </div>

      {/* Chart */}
      <NetWorthChart data={chartHistory} defaultRange={settings.timeRange} />

      {/* Allocation Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <AllocationCard title="By Asset Class" slices={allocByClass} />
        <AllocationCard title="By Risk Level" slices={allocByRisk} />
        <AllocationCard title="By Currency" slices={allocByCurrency} />
      </div>
    </div>
  );
}
