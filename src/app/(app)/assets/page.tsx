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
import { useDemoMode } from "@/lib/demo-mode";

// ── Dialog Modal ──

function DialogModal({ title, badge, onClose, children }: { title: string; badge?: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50" onClick={onClose}>
      <div className="w-full max-w-sm mx-4 rounded-2xl bg-background p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-foreground">{title}</h3>
            {badge && <span className="text-[11px] font-semibold bg-accent-light text-accent-dark px-2 py-0.5 rounded-full">{badge}</span>}
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-surface flex items-center justify-center text-muted hover:text-foreground text-sm">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function DialogSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted mb-2 pb-1 border-b border-card-border/30">{title}</div>
      {children}
    </div>
  );
}

function DialogField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-medium text-muted mb-1">{label}</label>
      {children}
    </div>
  );
}

function DialogActions({ saving, onCancel }: { saving: boolean; onCancel: () => void }) {
  return (
    <div className="flex gap-2 mt-5">
      <button type="button" onClick={onCancel} className="flex-1 rounded-full py-2.5 border border-card-border text-sm font-medium text-muted hover:text-foreground">Cancel</button>
      <button type="submit" disabled={saving} className="flex-1 rounded-full py-2.5 bg-accent text-sm font-semibold text-accent-dark">{saving ? "Saving..." : "Save"}</button>
    </div>
  );
}

const fieldClass = "w-full px-3 py-2 border border-card-border/50 rounded-xl text-sm font-[Inter] text-foreground bg-background outline-none focus:border-accent";

// ── Form Components ──

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
    <DialogModal title="New Account" onClose={onCancel}>
      <form onSubmit={handleSubmit}>
        <DialogSection title="Details">
          <div className="space-y-3">
            <DialogField label="Name">
              <input placeholder="Account name" value={name} onChange={(e) => setName(e.target.value)} required className={fieldClass} />
            </DialogField>
            <div className="flex gap-2">
              <DialogField label="Type">
                <select value={type} onChange={(e) => setType(e.target.value)} className={fieldClass}>
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                  <option value="brokerage">Brokerage</option>
                  <option value="401k">401(k)</option>
                </select>
              </DialogField>
              <DialogField label="Country">
                <select value={country} onChange={(e) => setCountry(e.target.value)} className={fieldClass}>
                  <option value="US">US</option>
                  <option value="KR">KR</option>
                </select>
              </DialogField>
            </div>
          </div>
        </DialogSection>
        <DialogActions saving={saving} onCancel={onCancel} />
      </form>
    </DialogModal>
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
    <DialogModal title="Add Holding" onClose={onCancel}>
      <form onSubmit={handleSubmit}>
        <DialogSection title="Identity">
          <div className="space-y-3">
            <div className="flex gap-2">
              <DialogField label="Ticker">
                <input placeholder="AAPL" value={ticker} onChange={(e) => setTicker(e.target.value)} required className={fieldClass} />
              </DialogField>
              <div className="flex-[2]">
                <DialogField label="Name">
                  <input placeholder="Apple Inc." value={name} onChange={(e) => setName(e.target.value)} required className={fieldClass} />
                </DialogField>
              </div>
            </div>
          </div>
        </DialogSection>
        <DialogSection title="Classification">
          <div className="flex gap-2">
            <DialogField label="Type">
              <select value={assetType} onChange={(e) => setAssetType(e.target.value as HoldingAssetType)} className={fieldClass}>
                <option value="stock">Stock</option>
                <option value="etf">ETF</option>
                <option value="index">Index</option>
                <option value="bond">Bond</option>
                <option value="commodity">Commodity</option>
                <option value="cash">Cash</option>
              </select>
            </DialogField>
            <DialogField label="Risk">
              <select value={riskLevel} onChange={(e) => setRiskLevel(e.target.value as RiskLevel)} className={fieldClass}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="very_high">Very High</option>
              </select>
            </DialogField>
          </div>
        </DialogSection>
        <DialogSection title="Position">
          <div className="flex gap-2">
            <DialogField label="Shares">
              <input type="number" step="any" placeholder="0" value={shares} onChange={(e) => setShares(e.target.value)} required className={fieldClass} />
            </DialogField>
            <DialogField label="Currency">
              <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className={fieldClass}>
                <option value="USD">USD</option>
                <option value="KRW">KRW</option>
              </select>
            </DialogField>
          </div>
        </DialogSection>
        <DialogActions saving={saving} onCancel={onCancel} />
      </form>
    </DialogModal>
  );
}

function EditHoldingDialog({ holding, onSave, onCancel }: { holding: Holding; onSave: () => void; onCancel: () => void }) {
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
    <DialogModal title="Edit Holding" badge={holding.ticker} onClose={onCancel}>
      <form onSubmit={handleSubmit}>
        <DialogSection title="Identity">
          <DialogField label="Name">
            <input value={name} onChange={(e) => setName(e.target.value)} className={fieldClass} />
          </DialogField>
        </DialogSection>
        <DialogSection title="Classification">
          <div className="flex gap-2">
            <DialogField label="Type">
              <select value={assetType} onChange={(e) => setAssetType(e.target.value as HoldingAssetType)} className={fieldClass}>
                <option value="stock">Stock</option>
                <option value="etf">ETF</option>
                <option value="index">Index</option>
                <option value="bond">Bond</option>
                <option value="commodity">Commodity</option>
                <option value="cash">Cash</option>
              </select>
            </DialogField>
            <DialogField label="Risk">
              <select value={riskLevel} onChange={(e) => setRiskLevel(e.target.value as RiskLevel)} className={fieldClass}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="very_high">Very High</option>
              </select>
            </DialogField>
          </div>
        </DialogSection>
        <DialogSection title="Position">
          <div className="flex gap-2">
            <DialogField label="Shares">
              <input type="number" step="any" value={shares} onChange={(e) => setShares(e.target.value)} className={fieldClass} />
            </DialogField>
            <DialogField label="Currency">
              <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className={fieldClass}>
                <option value="USD">USD</option>
                <option value="KRW">KRW</option>
              </select>
            </DialogField>
          </div>
        </DialogSection>
        <DialogActions saving={saving} onCancel={onCancel} />
      </form>
    </DialogModal>
  );
}

function EditInvestmentDialog({ inv, onSave, onCancel }: { inv: PrivateInvestment; onSave: () => void; onCancel: () => void }) {
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
    <DialogModal title="Edit Investment" badge={inv.ticker ?? undefined} onClose={onCancel}>
      <form onSubmit={handleSubmit}>
        <DialogSection title="Identity">
          <div className="space-y-3">
            <DialogField label="Name">
              <input value={name} onChange={(e) => setName(e.target.value)} className={fieldClass} />
            </DialogField>
            <DialogField label="Ticker">
              <input value={ticker} onChange={(e) => setTicker(e.target.value)} placeholder="Optional" className={fieldClass} />
            </DialogField>
          </div>
        </DialogSection>
        <DialogSection title="Position">
          <div className="space-y-3">
            <div className="flex gap-2">
              <DialogField label="Price per unit">
                <input type="number" step="any" value={pricePerUnit} onChange={(e) => setPricePerUnit(e.target.value)} className={fieldClass} />
              </DialogField>
              <DialogField label="Quantity">
                <input type="number" step="any" value={quantity} onChange={(e) => setQuantity(e.target.value)} className={fieldClass} />
              </DialogField>
            </div>
            <DialogField label="Risk">
              <select value={riskLevel} onChange={(e) => setRiskLevel(e.target.value as RiskLevel)} className={fieldClass}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="very_high">Very High</option>
              </select>
            </DialogField>
          </div>
        </DialogSection>
        <DialogSection title="Notes">
          <DialogField label="Notes">
            <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" className={fieldClass} />
          </DialogField>
        </DialogSection>
        <DialogActions saving={saving} onCancel={onCancel} />
      </form>
    </DialogModal>
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
    <DialogModal title="New Investment" onClose={onCancel}>
      <form onSubmit={handleSubmit}>
        <DialogSection title="Identity">
          <div className="space-y-3">
            <div className="flex gap-2">
              <DialogField label="Type">
                <select value={assetType} onChange={(e) => setAssetType(e.target.value as PrivateAssetType)} className={fieldClass}>
                  <option value="stock">Stock (Private)</option>
                  <option value="lp">LP Fund</option>
                  <option value="commodity">Commodity</option>
                </select>
              </DialogField>
              <div className="flex-[2]">
                <DialogField label="Name">
                  <input placeholder="Company name" value={name} onChange={(e) => setName(e.target.value)} required className={fieldClass} />
                </DialogField>
              </div>
            </div>
          </div>
        </DialogSection>
        <DialogSection title="Position">
          <div className="space-y-3">
            <div className="flex gap-2">
              <DialogField label="Price per unit">
                <input type="number" step="any" placeholder="0" value={value} onChange={(e) => setValue(e.target.value)} required className={fieldClass} />
              </DialogField>
              <DialogField label="Currency">
                <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className={fieldClass}>
                  <option value="USD">USD</option>
                  <option value="KRW">KRW</option>
                </select>
              </DialogField>
            </div>
            <DialogField label="Risk">
              <select value={riskLevel} onChange={(e) => setRiskLevel(e.target.value as RiskLevel)} className={fieldClass}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="very_high">Very High</option>
              </select>
            </DialogField>
            {isCommodity && (
              <>
                <div className="flex gap-2">
                  <DialogField label="Quantity">
                    <input type="number" step="any" placeholder="150" value={quantity} onChange={(e) => setQuantity(e.target.value)} className={fieldClass} />
                  </DialogField>
                  <DialogField label="Unit">
                    <input placeholder="oz" value={unitLabel} onChange={(e) => setUnitLabel(e.target.value)} className={fieldClass} />
                  </DialogField>
                </div>
                <DialogField label="COMEX Ticker">
                  <input placeholder="SI" value={ticker} onChange={(e) => setTicker(e.target.value)} className={fieldClass} />
                </DialogField>
              </>
            )}
          </div>
        </DialogSection>
        <DialogSection title="Notes">
          <DialogField label="Notes">
            <textarea placeholder="Optional" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className={fieldClass} />
          </DialogField>
        </DialogSection>
        <DialogActions saving={saving} onCancel={onCancel} />
      </form>
    </DialogModal>
  );
}

// ── Shared button styles ──
const editBtnClass = "wise-btn bg-accent-dark/8 px-4 py-1.5 text-sm font-medium text-accent";

const riskBadge: Record<RiskLevel, string> = {
  low: "bg-accent-light text-warm-dark",
  medium: "bg-warning/20 text-[#7a6400]",
  high: "bg-bright-orange/40 text-[#8b4000]",
  very_high: "bg-negative/20 text-negative",
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
  const { scramble } = useDemoMode();

  const load = useCallback(async () => {
    setLoading(true);
    const h = await getHoldingsByAccount(account.id);
    setHoldings(h);
    setLoading(false);
  }, [account.id]);

  useEffect(() => { load(); }, [load]);


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
  const accountTotalUsd = holdings.reduce((sum, h) => sum + getValueUsd(h), 0);

  return (
    <div className="wise-card p-5">
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
            className="wise-btn bg-accent px-5 py-2 text-sm font-medium text-accent-dark">
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
        <table className="w-full min-w-[700px] text-sm table-fixed whitespace-nowrap">
          <colgroup>
            <col style={{ width: 160 }} />
            <col style={{ width: 90 }} />
            <col style={{ width: 80 }} />
            <col style={{ width: 80 }} />
            <col style={{ width: 100 }} />
            <col style={{ width: 120 }} />
            <col style={{ width: 60 }} />
          </colgroup>
          <thead>
            <tr className="border-b border-card-border text-left text-xs text-muted">
              <th className="pb-2">Name</th>
              <th className="pb-2 px-2">Ticker</th>
              <th className="pb-2 px-2">Type</th>
              <th className="pb-2 px-2">Risk</th>
              <th className="pb-2 px-2 text-right">Shares</th>
              <th className="pb-2 px-2 text-right">Value</th>
              <th className="pb-2"></th>
            </tr>
          </thead>
          <tbody>
            {holdings
              .filter((h) => h.shares !== 0)
              .sort((a, b) => (a.asset_type === "cash" ? 1 : 0) - (b.asset_type === "cash" ? 1 : 0))
              .map((h) => (
                <tr key={h.id} className="border-b border-card-border last:border-0">
                  <td className="py-2 font-medium truncate">{h.name}</td>
                  <td className="py-2 px-2 text-muted truncate">{h.ticker}</td>
                  <td className="py-2 px-2 text-xs text-muted">{h.asset_type}</td>
                  <td className="py-2 px-2"><span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${riskBadge[h.risk_level]}`}>{riskLabels[h.risk_level]}</span></td>
                  <td className="py-2 px-2 text-right tabular-nums">{scramble(h.shares).toLocaleString()}</td>
                  <td className="py-2 px-2 text-right tabular-nums font-medium">
                    {h.asset_type === "cash" || prices[h.ticker] != null
                      ? formatCurrency(getValue(h), h.currency)
                      : <span className="text-muted">—</span>}
                  </td>
                  <td className="py-2 pl-2 text-right">
                    <button onClick={() => setEditingId(h.id)} className={editBtnClass}>Edit</button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
        </div>
      )}

      {editingId && (() => {
        const h = holdings.find((h) => h.id === editingId);
        return h ? (
          <EditHoldingDialog
            holding={h}
            onSave={() => { setEditingId(null); load(); }}
            onCancel={() => setEditingId(null)}
          />
        ) : null;
      })()}

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
  const { scramble } = useDemoMode();

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
      return scramble(prices[inv.ticker]! * inv.quantity);
    }
    return scramble(inv.quantity * inv.price_per_unit);
  };

  const getInvValueUsd = (inv: PrivateInvestment) => {
    const native = getInvValue(inv);
    if (inv.currency === "KRW" && fxRate) return native / fxRate;
    return native;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight">Assets</h1>
        {pricesLoading && <span className="text-xs text-muted">Fetching prices...</span>}
      </div>

      {/* Section Toggle */}
      <div className="flex gap-6 border-b border-card-border">
        {[
          { key: "holdings" as const, label: "Holdings" },
          { key: "private" as const, label: "Private Investments" },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => setSection(s.key)}
            className={`relative pb-3 text-sm transition-colors ${
              section === s.key
                ? "text-foreground font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-accent after:rounded-full"
                : "text-muted hover:text-foreground"
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
              <div key={type} className="wise-card p-5">
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
                    className="wise-btn bg-accent px-5 py-2 text-sm font-medium text-accent-dark"
                  >
                    + Add
                  </button>
                </div>
                {items.length === 0 && addingInvType !== type && (
                  <p className="text-xs text-muted">No investments yet.</p>
                )}
                {items.length > 0 && (
                <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-sm table-fixed whitespace-nowrap">
                  <colgroup>
                    <col style={{ width: 160 }} />
                    <col style={{ width: 90 }} />
                    <col style={{ width: 80 }} />
                    <col style={{ width: 80 }} />
                    <col style={{ width: 100 }} />
                    <col style={{ width: 120 }} />
                    <col style={{ width: 60 }} />
                  </colgroup>
                  <thead>
                    <tr className="border-b border-card-border text-left text-xs text-muted">
                      <th className="pb-2">Name</th>
                      <th className="pb-2 px-2">Ticker</th>
                      <th className="pb-2 px-2">Type</th>
                      <th className="pb-2 px-2">Risk</th>
                      <th className="pb-2 px-2 text-right">Quantity</th>
                      <th className="pb-2 px-2 text-right">Value</th>
                      <th className="pb-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((inv) => (
                        <tr key={inv.id} className="border-b border-card-border last:border-0">
                          <td className="py-2 font-medium truncate">{inv.name}</td>
                          <td className="py-2 px-2 text-muted truncate">{inv.ticker ?? "—"}</td>
                          <td className="py-2 px-2 text-xs text-muted">{inv.asset_type}</td>
                          <td className="py-2 px-2"><span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${riskBadge[inv.risk_level]}`}>{riskLabels[inv.risk_level]}</span></td>
                          <td className="py-2 px-2 text-right tabular-nums">
                            {scramble(inv.quantity).toLocaleString()}{inv.unit_label ? ` ${inv.unit_label}` : ""}
                          </td>
                          <td className="py-2 px-2 text-right tabular-nums font-medium">
                            {formatCurrency(getInvValue(inv), inv.currency)}
                          </td>
                          <td className="py-2 pl-2 text-right">
                            <button onClick={() => setEditingInvId(inv.id)} className={editBtnClass}>Edit</button>
                          </td>
                        </tr>
                    ))}
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

          {editingInvId && (() => {
            const inv = investments.find((i) => i.id === editingInvId);
            return inv ? (
              <EditInvestmentDialog
                inv={inv}
                onSave={() => { setEditingInvId(null); loadInvestments(); }}
                onCancel={() => setEditingInvId(null)}
              />
            ) : null;
          })()}
        </div>
      )}
    </div>
  );
}
