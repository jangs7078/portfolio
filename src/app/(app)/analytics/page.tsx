"use client";

import { useEffect, useState } from "react";
import {
  getLatestSnapshotDate,
  getSnapshotsByDate,
  getAllHoldings,
  getPrivateInvestments,
  getSnapshotHistoryByTicker,
} from "@/lib/db";
import type { Snapshot, Holding, PrivateInvestment, TickerHistory } from "@/lib/types";
import ActionSignalTable from "@/components/action-signal-table";
import type { ActionSignalAsset } from "@/components/action-signal-table";

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

  if (refDate < history.dates[0]) return null;

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

    let name = ticker;
    let riskRaw: string = "medium";
    const holding = holdingMap.get(ticker);
    const inv = invMap.get(ticker);
    if (holding) {
      name = holding.name;
      riskRaw = holding.risk_level;
    } else if (inv) {
      name = inv.name;
      riskRaw = inv.risk_level;
    }

    const riskLevel = riskRaw
      .replace("_", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    results.push({
      ticker,
      name,
      value,
      returnSinceBought,
      return1W,
      return1M,
      return3M,
      riskLevel,
    });
  }

  return results;
}

export default function AnalyticsPage() {
  const [actionSignals, setActionSignals] = useState<ActionSignalAsset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [latestDate, holdings, investments] = await Promise.all([
        getLatestSnapshotDate(),
        getAllHoldings(),
        getPrivateInvestments(),
      ]);

      const latestSnapshots = await getSnapshotsByDate(latestDate);

      // Fetch live prices
      const holdingTickers = holdings.filter((h) => h.asset_type !== "cash" && h.shares !== 0).map((h) => h.ticker);
      const investmentTickers = investments.filter((i) => i.ticker).map((i) => i.ticker!);
      const allTickers = [...new Set([...holdingTickers, ...investmentTickers])];

      let liveSnapshots = latestSnapshots;
      let livePrices: Record<string, number | null> = {};
      if (allTickers.length > 0) {
        try {
          const res = await fetch(`/api/quotes?tickers=${allTickers.join(",")}`);
          const quoteData = await res.json();
          livePrices = quoteData.prices ?? {};
          const prices = livePrices;
          const liveFxRate = typeof quoteData.fxRate === "number" ? quoteData.fxRate : null;

          const liveValueByHoldingId = new Map<string, number>();
          const liveValueByInvestmentId = new Map<string, number>();

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
            liveValueByInvestmentId.set(inv.id, valueUsd);
          }

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

      // Fetch per-ticker history
      let tickerHistory: Record<string, TickerHistory> = {};
      const nonCashTickers = [
        ...holdings.filter((h) => h.asset_type !== "cash" && h.shares !== 0).map((h) => h.ticker),
        ...investments.filter((i) => !i.is_deleted).map((i) => i.ticker).filter((t): t is string => t !== null),
      ];
      const uniqueNonCash = [...new Set(nonCashTickers)];
      if (uniqueNonCash.length > 0) {
        try {
          const histSnapshots = await getSnapshotHistoryByTicker(uniqueNonCash);

          const grouped: Record<string, Record<string, { price: number | null; hasNative: boolean }>> = {};
          for (const snap of histSnapshots) {
            if (!grouped[snap.ticker]) grouped[snap.ticker] = {};
            const byDate = grouped[snap.ticker];
            if (!byDate[snap.date]) {
              byDate[snap.date] = {
                price: snap.price_per_unit != null ? Number(snap.price_per_unit) : null,
                hasNative: false,
              };
            } else if (byDate[snap.date].price === null && snap.price_per_unit != null) {
              byDate[snap.date].price = Number(snap.price_per_unit);
            }
            if (Number(snap.value_native) > 0) byDate[snap.date].hasNative = true;
          }

          for (const [ticker, byDate] of Object.entries(grouped)) {
            const sortedDates = Object.keys(byDate).sort();
            const dates: string[] = [];
            const values: number[] = [];
            let firstBoughtDate: string | null = null;
            for (const date of sortedDates) {
              const price = byDate[date].price;
              if (price == null || price <= 0) continue;
              dates.push(date);
              values.push(price);
              if (firstBoughtDate === null && byDate[date].hasNative) {
                firstBoughtDate = date;
              }
            }
            if (dates.length > 0) {
              tickerHistory[ticker] = { dates, values, firstBoughtDate };
            }
          }
        } catch {
          // Fall back to empty
        }
      }

      // Append today's live price to each ticker history so returns reflect current prices
      const today = new Date().toISOString().split("T")[0];
      for (const [ticker, th] of Object.entries(tickerHistory)) {
        const livePrice = livePrices[ticker];
        if (livePrice == null || livePrice <= 0) continue;
        const lastDate = th.dates[th.dates.length - 1];
        if (lastDate === today) {
          // Replace today's value with live price
          th.values[th.values.length - 1] = livePrice;
        } else {
          th.dates.push(today);
          th.values.push(livePrice);
        }
      }

      setActionSignals(buildActionSignals(tickerHistory, liveSnapshots, holdings, investments));
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center text-muted">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <ActionSignalTable assets={actionSignals} />
    </div>
  );
}
