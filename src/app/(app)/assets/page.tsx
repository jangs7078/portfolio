"use client";

import { useState, useEffect, useCallback } from "react";
import { formatCurrency } from "@/lib/format";
import {
  getAccounts,
  createAccount,
  getHoldingsByAccount,
  createHolding,
  updateHolding,
  getPrivateInvestments,
  createPrivateInvestment,
  updatePrivateInvestment,
  getAllHoldings,
} from "@/lib/db";
import type {
  Account,
  Holding,
  PrivateInvestment,
  HoldingAssetType,
  PrivateAssetType,
  Currency,
  RiskLevel,
} from "@/lib/types";

// ── Inline Form Components ──

function AddAccountForm({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("brokerage");
  const [country, setCountry] = useState("US");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await createAccount({ name, type: type as Account["type"], country: country as Account["country"] });
    setSaving(false);
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-accent/30 bg-card p-4 space-y-3">
      <h3 className="text-sm font-medium">New Account</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <input placeholder="Account name" value={name} onChange={(e) => setName(e.target.value)} required
          className="rounded border border-card-border bg-background px-2 py-1.5 text-sm outline-none focus:border-accent" />
        <select value={type} onChange={(e) => setType(e.target.value)}
          className="rounded border border-card-border bg-background px-2 py-1.5 text-sm outline-none focus:border-accent">
          <option value="checking">Checking</option>
          <option value="savings">Savings</option>
          <option value="brokerage">Brokerage</option>
          <option value="401k">401(k)</option>
        </select>
        <select value={country} onChange={(e) => setCountry(e.target.value)}
          className="rounded border border-card-border bg-background px-2 py-1.5 text-sm outline-none focus:border-accent">
          <option value="US">US</option>
          <option value="KR">KR</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={saving}
          className="rounded bg-accent px-3 py-1 text-xs font-medium text-white hover:bg-accent-hover disabled:opacity-50">
          {saving ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={onCancel} className="rounded px-3 py-1 text-xs text-muted hover:text-foreground">Cancel</button>
      </div>
    </form>
  );
}

function AddHoldingForm({ accountId, onSave, onCancel }: { accountId: string; onSave: () => void; onCancel: () => void }) {
  const [ticker, setTicker] = useState("");
  const [name, setName] = useState("");
  const [assetType, setAssetType] = useState<HoldingAssetType>("stock");
  const [shares, setShares] = useState("");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("medium");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await createHolding({
      account_id: accountId,
      ticker: ticker.toUpperCase(),
      name,
      asset_type: assetType,
      shares: parseFloat(shares),
      currency,
      risk_level: riskLevel,
    });
    setSaving(false);
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 rounded border border-accent/30 p-3 space-y-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
        <input placeholder="Ticker" value={ticker} onChange={(e) => setTicker(e.target.value)} required
          className="rounded border border-card-border bg-background px-2 py-1.5 text-xs outline-none focus:border-accent" />
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required
          className="rounded border border-card-border bg-background px-2 py-1.5 text-xs outline-none focus:border-accent" />
        <select value={assetType} onChange={(e) => setAssetType(e.target.value as HoldingAssetType)}
          className="rounded border border-card-border bg-background px-2 py-1.5 text-xs outline-none focus:border-accent">
          <option value="stock">Stock</option>
          <option value="etf">ETF</option>
          <option value="index">Index</option>
          <option value="bond">Bond</option>
          <option value="commodity">Commodity</option>
          <option value="cash">Cash</option>
        </select>
        <input placeholder="Shares" type="number" step="any" value={shares} onChange={(e) => setShares(e.target.value)} required
          className="rounded border border-card-border bg-background px-2 py-1.5 text-xs outline-none focus:border-accent" />
        <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}
          className="rounded border border-card-border bg-background px-2 py-1.5 text-xs outline-none focus:border-accent">
          <option value="USD">USD</option>
          <option value="KRW">KRW</option>
        </select>
        <select value={riskLevel} onChange={(e) => setRiskLevel(e.target.value as RiskLevel)}
          className="rounded border border-card-border bg-background px-2 py-1.5 text-xs outline-none focus:border-accent">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="very_high">Very High</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={saving}
          className="rounded bg-accent px-3 py-1 text-xs font-medium text-white hover:bg-accent-hover disabled:opacity-50">
          {saving ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={onCancel} className="rounded px-3 py-1 text-xs text-muted hover:text-foreground">Cancel</button>
      </div>
    </form>
  );
}

function EditHoldingRow({ holding, onSave, onCancel }: { holding: Holding; onSave: () => void; onCancel: () => void }) {
  const [name, setName] = useState(holding.name);
  const [assetType, setAssetType] = useState<HoldingAssetType>(holding.asset_type);
  const [shares, setShares] = useState(String(holding.shares));
  const [currency, setCurrency] = useState<Currency>(holding.currency);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>(holding.risk_level);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateHolding(holding.id, {
      name,
      asset_type: assetType,
      shares: parseFloat(shares),
      currency,
      risk_level: riskLevel,
    });
    setSaving(false);
    onSave();
  };

  return (
    <tr className="border-b border-card-border last:border-0">
      <td className="py-2 font-medium">{holding.ticker}</td>
      <td className="py-2">
        <input value={name} onChange={(e) => setName(e.target.value)}
          className="w-full rounded border border-card-border bg-background px-1.5 py-0.5 text-sm outline-none focus:border-accent" />
      </td>
      <td className="py-2">
        <select value={assetType} onChange={(e) => setAssetType(e.target.value as HoldingAssetType)}
          className="rounded border border-card-border bg-background px-1 py-0.5 text-xs outline-none focus:border-accent">
          <option value="stock">Stock</option>
          <option value="etf">ETF</option>
          <option value="index">Index</option>
          <option value="bond">Bond</option>
          <option value="commodity">Commodity</option>
          <option value="cash">Cash</option>
        </select>
      </td>
      <td className="py-2">
        <select value={riskLevel} onChange={(e) => setRiskLevel(e.target.value as RiskLevel)}
          className="rounded border border-card-border bg-background px-1 py-0.5 text-xs outline-none focus:border-accent">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="very_high">Very High</option>
        </select>
      </td>
      <td className="py-2 text-right">
        <input type="number" step="any" value={shares} onChange={(e) => setShares(e.target.value)}
          className="w-24 rounded border border-card-border bg-background px-1.5 py-0.5 text-right text-sm outline-none focus:border-accent" />
      </td>
      <td className="py-2 text-right tabular-nums text-muted">—</td>
      <td className="py-2 text-right space-x-1">
        <button onClick={handleSubmit} disabled={saving} className={saveBtnClass}>
          {saving ? "..." : "Save"}
        </button>
        <button onClick={onCancel} className={cancelBtnClass}>Cancel</button>
      </td>
    </tr>
  );
}

function EditInvestmentRow({ inv, onSave, onCancel }: { inv: PrivateInvestment; onSave: () => void; onCancel: () => void }) {
  const [name, setName] = useState(inv.name);
  const [pricePerUnit, setPricePerUnit] = useState(String(inv.price_per_unit));
  const [quantity, setQuantity] = useState(String(inv.quantity));
  const [ticker, setTicker] = useState(inv.ticker || "");
  const [riskLevel, setRiskLevel] = useState<RiskLevel>(inv.risk_level);
  const [notes, setNotes] = useState(inv.notes || "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updatePrivateInvestment(inv.id, {
      name,
      price_per_unit: parseFloat(pricePerUnit),
      quantity: parseFloat(quantity),
      ticker: ticker || null,
      risk_level: riskLevel,
      notes: notes || null,
    });
    setSaving(false);
    onSave();
  };

  return (
    <div className="rounded border border-accent/30 p-3 space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] uppercase text-muted">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)}
            className="w-full rounded border border-card-border bg-background px-2 py-1 text-sm outline-none focus:border-accent" />
        </div>
        <div>
          <label className="text-[10px] uppercase text-muted">Price per unit</label>
          <input type="number" step="any" value={pricePerUnit} onChange={(e) => setPricePerUnit(e.target.value)}
            className="w-full rounded border border-card-border bg-background px-2 py-1 text-sm outline-none focus:border-accent" />
        </div>
        <div>
          <label className="text-[10px] uppercase text-muted">Quantity</label>
          <input type="number" step="any" value={quantity} onChange={(e) => setQuantity(e.target.value)}
            className="w-full rounded border border-card-border bg-background px-2 py-1 text-sm outline-none focus:border-accent" />
        </div>
        <div>
          <label className="text-[10px] uppercase text-muted">Ticker</label>
          <input value={ticker} onChange={(e) => setTicker(e.target.value)}
            className="w-full rounded border border-card-border bg-background px-2 py-1 text-sm outline-none focus:border-accent" />
        </div>
        <div>
          <label className="text-[10px] uppercase text-muted">Risk</label>
          <select value={riskLevel} onChange={(e) => setRiskLevel(e.target.value as RiskLevel)}
            className="w-full rounded border border-card-border bg-background px-2 py-1 text-sm outline-none focus:border-accent">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="very_high">Very High</option>
          </select>
        </div>
      </div>
      <div>
        <label className="text-[10px] uppercase text-muted">Notes</label>
        <input value={notes} onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded border border-card-border bg-background px-2 py-1 text-sm outline-none focus:border-accent" />
      </div>
      <div className="flex gap-2">
        <button onClick={handleSubmit} disabled={saving} className={saveBtnClass}>
          {saving ? "Saving..." : "Save"}
        </button>
        <button onClick={onCancel} className={cancelBtnClass}>Cancel</button>
      </div>
    </div>
  );
}

function AddInvestmentForm({ defaultType, onSave, onCancel }: { defaultType?: PrivateAssetType; onSave: () => void; onCancel: () => void }) {
  const [assetType, setAssetType] = useState<PrivateAssetType>(defaultType ?? "stock");
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [quantity, setQuantity] = useState("");
  const [unitLabel, setUnitLabel] = useState("");
  const [ticker, setTicker] = useState("");
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("medium");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const isCommodity = assetType === "commodity";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await createPrivateInvestment({
      asset_type: assetType,
      name,
      price_per_unit: parseFloat(value),
      currency,
      quantity: quantity ? parseFloat(quantity) : 1,
      unit_label: unitLabel || null,
      ticker: ticker || null,
      price_source: isCommodity && ticker ? "comex" : "manual",
      risk_level: riskLevel,
      notes: notes || null,
    });
    setSaving(false);
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-accent/30 bg-card p-4 space-y-3">
      <h3 className="text-sm font-medium">New Private Investment</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <select value={assetType} onChange={(e) => setAssetType(e.target.value as PrivateAssetType)}
          className="rounded border border-card-border bg-background px-2 py-1.5 text-sm outline-none focus:border-accent">
          <option value="stock">Stock (Private)</option>
          <option value="lp">LP Fund</option>
          <option value="commodity">Commodity</option>
        </select>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required
          className="rounded border border-card-border bg-background px-2 py-1.5 text-sm outline-none focus:border-accent" />
        <input placeholder="Price per unit" type="number" step="any" value={value} onChange={(e) => setValue(e.target.value)} required
          className="rounded border border-card-border bg-background px-2 py-1.5 text-sm outline-none focus:border-accent" />
        <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}
          className="rounded border border-card-border bg-background px-2 py-1.5 text-sm outline-none focus:border-accent">
          <option value="USD">USD</option>
          <option value="KRW">KRW</option>
        </select>
        <select value={riskLevel} onChange={(e) => setRiskLevel(e.target.value as RiskLevel)}
          className="rounded border border-card-border bg-background px-2 py-1.5 text-sm outline-none focus:border-accent">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="very_high">Very High</option>
        </select>
        {isCommodity && (
          <>
            <input placeholder="Quantity (e.g. 150)" type="number" step="any" value={quantity} onChange={(e) => setQuantity(e.target.value)}
              className="rounded border border-card-border bg-background px-2 py-1.5 text-sm outline-none focus:border-accent" />
            <input placeholder="Unit (e.g. oz)" value={unitLabel} onChange={(e) => setUnitLabel(e.target.value)}
              className="rounded border border-card-border bg-background px-2 py-1.5 text-sm outline-none focus:border-accent" />
            <input placeholder="COMEX ticker (e.g. SI)" value={ticker} onChange={(e) => setTicker(e.target.value)}
              className="rounded border border-card-border bg-background px-2 py-1.5 text-sm outline-none focus:border-accent" />
          </>
        )}
      </div>
      <textarea placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
        className="w-full rounded border border-card-border bg-background px-2 py-1.5 text-sm outline-none focus:border-accent" />
      <div className="flex gap-2">
        <button type="submit" disabled={saving}
          className="rounded bg-accent px-3 py-1 text-xs font-medium text-white hover:bg-accent-hover disabled:opacity-50">
          {saving ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={onCancel} className="rounded px-3 py-1 text-xs text-muted hover:text-foreground">Cancel</button>
      </div>
    </form>
  );
}

// ── Shared button styles ──
const editBtnClass = "rounded bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent transition-colors hover:bg-accent/25";
const saveBtnClass = "rounded bg-accent px-2 py-0.5 text-xs font-medium text-white hover:bg-accent-hover disabled:opacity-50";
const cancelBtnClass = "rounded px-2 py-0.5 text-xs text-muted hover:text-foreground";

const riskColors: Record<RiskLevel, string> = {
  low: "text-green-400",
  medium: "text-yellow-400",
  high: "text-orange-400",
  very_high: "text-red-400",
};

const riskLabels: Record<RiskLevel, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  very_high: "Very High",
};

// ── Account Card with Holdings ──

function AccountCard({ account, prices, fxRate, onRefresh }: { account: Account; prices: Record<string, number | null>; fxRate: number | null; onRefresh: () => void }) {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [showAddHolding, setShowAddHolding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const h = await getHoldingsByAccount(account.id);
    setHoldings(h);
    setLoading(false);
  }, [account.id]);

  useEffect(() => { load(); }, [load]);


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
  const accountTotalUsd = holdings.reduce((sum, h) => sum + getValueUsd(h), 0);

  return (
    <div className="rounded-lg border border-card-border bg-card p-4">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <h3 className="font-medium">{account.name}</h3>
          <span className="text-xs text-muted">{account.country} / {account.type}</span>
          {!loading && (
            <span className="text-sm font-bold tabular-nums text-accent">
              {formatCurrency(accountTotalUsd, "USD")}
              {fxRate && (
                <span className="ml-2 text-xs font-medium text-muted">
                  ({formatCurrency(accountTotalUsd * fxRate, "KRW")})
                </span>
              )}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowAddHolding(true)}
            className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-accent-hover">
            + Add Holding
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-xs text-muted">Loading...</p>
      ) : holdings.length === 0 ? (
        <p className="text-xs text-muted">No holdings yet.</p>
      ) : (
        <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-sm table-fixed">
          <colgroup>
            <col className="w-[22%]" />
            <col className="w-[12%]" />
            <col className="w-[10%]" />
            <col className="w-[10%]" />
            <col className="w-[12%]" />
            <col className="w-[22%]" />
            <col className="w-[12%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-card-border text-left text-xs text-muted">
              <th className="pb-2">Name</th>
              <th className="pb-2">Ticker</th>
              <th className="pb-2">Type</th>
              <th className="pb-2">Risk</th>
              <th className="pb-2 text-right">Shares</th>
              <th className="pb-2 text-right">Value</th>
              <th className="pb-2"></th>
            </tr>
          </thead>
          <tbody>
            {holdings
              .filter((h) => h.shares !== 0)
              .sort((a, b) => (a.asset_type === "cash" ? 1 : 0) - (b.asset_type === "cash" ? 1 : 0))
              .map((h) =>
              editingId === h.id ? (
                <EditHoldingRow
                  key={h.id}
                  holding={h}
                  onSave={() => { setEditingId(null); load(); }}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <tr key={h.id} className="border-b border-card-border last:border-0">
                  <td className="py-2 font-medium truncate">{h.name}</td>
                  <td className="py-2 text-muted">{h.ticker}</td>
                  <td className="py-2 text-xs text-muted">{h.asset_type}</td>
                  <td className={`py-2 text-xs font-medium ${riskColors[h.risk_level]}`}>{riskLabels[h.risk_level]}</td>
                  <td className="py-2 text-right tabular-nums">{h.shares.toLocaleString()}</td>
                  <td className="py-2 text-right tabular-nums font-medium">
                    {h.asset_type === "cash" || prices[h.ticker] != null
                      ? formatCurrency(getValue(h), h.currency)
                      : <span className="text-muted">—</span>}
                  </td>
                  <td className="py-2 text-right space-x-1">
                    <button onClick={() => setEditingId(h.id)} className={editBtnClass}>Edit</button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
        </div>
      )}

      {showAddHolding && (
        <AddHoldingForm
          accountId={account.id}
          onSave={() => { setShowAddHolding(false); load(); }}
          onCancel={() => setShowAddHolding(false)}
        />
      )}
    </div>
  );
}

// ── Main Page ──

export default function ManagePage() {
  const [section, setSection] = useState<"holdings" | "private">("holdings");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [investments, setInvestments] = useState<PrivateInvestment[]>([]);
  const [prices, setPrices] = useState<Record<string, number | null>>({});
  const [fxRate, setFxRate] = useState<number | null>(null);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [addingInvType, setAddingInvType] = useState<PrivateAssetType | null>(null);
  const [editingInvId, setEditingInvId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pricesLoading, setPricesLoading] = useState(false);

  const fetchPrices = useCallback(async () => {
    const [allHoldings, allInvestments] = await Promise.all([
      getAllHoldings(),
      getPrivateInvestments(),
    ]);
    const holdingTickers = allHoldings
      .filter((h) => h.asset_type !== "cash")
      .map((h) => h.ticker);
    const investmentTickers = allInvestments
      .filter((i) => i.ticker)
      .map((i) => i.ticker!);
    const tickers = [...new Set([...holdingTickers, ...investmentTickers])];
    if (tickers.length === 0) return;

    setPricesLoading(true);
    try {
      const res = await fetch(`/api/quotes?tickers=${tickers.join(",")}`);
      const data = await res.json();
      setPrices(data.prices ?? {});
      if (typeof data.fxRate === "number") setFxRate(data.fxRate);
    } catch {
      // Keep existing prices on error
    }
    setPricesLoading(false);
  }, []);

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    const a = await getAccounts();
    setAccounts(a);
    setLoading(false);
  }, []);

  const loadInvestments = useCallback(async () => {
    setLoading(true);
    const inv = await getPrivateInvestments();
    setInvestments(inv);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAccounts();
    loadInvestments();
    fetchPrices();
  }, [loadAccounts, loadInvestments, fetchPrices]);


  const groupedInvestments = {
    stock: investments.filter((i) => i.asset_type === "stock"),
    lp: investments.filter((i) => i.asset_type === "lp"),
    commodity: investments.filter((i) => i.asset_type === "commodity"),
  };

  const groupLabels: Record<string, string> = {
    stock: "Stock (Private)",
    lp: "LP Funds",
    commodity: "Physical Commodities",
  };

  // For private investments with COMEX tickers, use live prices if available
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Assets</h1>
        {pricesLoading && <span className="text-xs text-muted">Fetching prices...</span>}
      </div>

      {/* Section Toggle */}
      <div className="flex gap-1 border-b border-card-border pb-px">
        {[
          { key: "holdings" as const, label: "Holdings" },
          { key: "private" as const, label: "Private Investments" },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => setSection(s.key)}
            className={`border-b-2 px-4 py-2 text-sm transition-colors ${
              section === s.key
                ? "border-accent text-accent"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {section === "holdings" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Accounts & Holdings</h2>
            <button
              onClick={() => setShowAddAccount(true)}
              className="text-sm font-medium text-accent transition-colors hover:text-accent-hover"
            >
              + Add Account
            </button>
          </div>

          {showAddAccount && (
            <AddAccountForm
              onSave={() => { setShowAddAccount(false); loadAccounts(); }}
              onCancel={() => setShowAddAccount(false)}
            />
          )}

          {loading ? (
            <p className="text-sm text-muted">Loading...</p>
          ) : accounts.length === 0 ? (
            <p className="text-center text-sm text-muted">
              No accounts yet. Click &quot;+ Add Account&quot; to get started.
            </p>
          ) : (
            [...accounts].sort((a, b) => a.name.localeCompare(b.name)).map((acct) => (
              <AccountCard key={acct.id} account={acct} prices={prices} fxRate={fxRate} onRefresh={() => { loadAccounts(); fetchPrices(); }} />
            ))
          )}
        </div>
      )}

      {section === "private" && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Private Investments</h2>

          {(["stock", "lp", "commodity"] as const).map((type) => {
            const items = groupedInvestments[type];
            return (
              <div key={type} className="rounded-lg border border-card-border bg-card p-4">
                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <h3 className="font-medium">{groupLabels[type]}</h3>
                    {items.length > 0 && (
                      <span className="text-sm font-bold tabular-nums text-accent">
                        {formatCurrency(
                          items.reduce((sum, inv) => sum + getInvValueUsd(inv), 0),
                          "USD",
                        )}
                        {fxRate && (
                          <span className="ml-2 text-xs font-medium text-muted">
                            ({formatCurrency(
                              items.reduce((sum, inv) => sum + getInvValueUsd(inv), 0) * fxRate,
                              "KRW",
                            )})
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setAddingInvType(type)}
                    className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-accent-hover"
                  >
                    + Add
                  </button>
                </div>
                {items.length === 0 && addingInvType !== type && (
                  <p className="text-xs text-muted">No investments yet.</p>
                )}
                {items.length > 0 && (
                <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-sm table-fixed">
                  <colgroup>
                    <col className="w-[26%]" />
                    <col className="w-[10%]" />
                    <col className="w-[10%]" />
                    <col className="w-[10%]" />
                    <col className="w-[14%]" />
                    <col className="w-[22%]" />
                    <col className="w-[8%]" />
                  </colgroup>
                  <thead>
                    <tr className="border-b border-card-border text-left text-xs text-muted">
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Ticker</th>
                      <th className="pb-2">Type</th>
                      <th className="pb-2">Risk</th>
                      <th className="pb-2 text-right">Quantity</th>
                      <th className="pb-2 text-right">Value</th>
                      <th className="pb-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((inv) =>
                      editingInvId === inv.id ? (
                        <tr key={inv.id}>
                          <td colSpan={7} className="py-2">
                            <EditInvestmentRow
                              inv={inv}
                              onSave={() => { setEditingInvId(null); loadInvestments(); }}
                              onCancel={() => setEditingInvId(null)}
                            />
                          </td>
                        </tr>
                      ) : (
                        <tr key={inv.id} className="border-b border-card-border last:border-0">
                          <td className="py-2 font-medium truncate">{inv.name}</td>
                          <td className="py-2 text-muted">{inv.ticker ?? "—"}</td>
                          <td className="py-2 text-xs text-muted">{inv.asset_type}</td>
                          <td className={`py-2 text-xs font-medium ${riskColors[inv.risk_level]}`}>{riskLabels[inv.risk_level]}</td>
                          <td className="py-2 text-right tabular-nums">
                            {inv.quantity.toLocaleString()}{inv.unit_label ? ` ${inv.unit_label}` : ""}
                          </td>
                          <td className="py-2 text-right tabular-nums font-medium">
                            {formatCurrency(getInvValue(inv), inv.currency)}
                          </td>
                          <td className="py-2 text-right">
                            <button onClick={() => setEditingInvId(inv.id)} className={editBtnClass}>Edit</button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
                </div>
                )}
                {addingInvType === type && (
                  <AddInvestmentForm
                    defaultType={type}
                    onSave={() => { setAddingInvType(null); loadInvestments(); }}
                    onCancel={() => setAddingInvType(null)}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
