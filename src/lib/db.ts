import { supabase } from "./supabase";
import type {
  Account,
  Holding,
  PrivateInvestment,
  ValuationHistory,
  Snapshot,
} from "./types";

// ── Accounts ──

export async function getAccounts() {
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("is_active", true)
    .order("created_at");
  if (error) throw error;
  return data as Account[];
}

export async function createAccount(
  account: Pick<Account, "name" | "type" | "country">
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("accounts")
    .insert({ ...account, user_id: user.id })
    .select()
    .single();
  if (error) throw error;
  return data as Account;
}

export async function deleteAccount(id: string) {
  const { error } = await supabase.from("accounts").delete().eq("id", id);
  if (error) throw error;
}

// ── Holdings ──

export async function getHoldingsByAccount(accountId: string) {
  const { data, error } = await supabase
    .from("holdings")
    .select("*")
    .eq("account_id", accountId)
    .order("ticker");
  if (error) throw error;
  return data as Holding[];
}

export async function getAllHoldings() {
  const { data, error } = await supabase
    .from("holdings")
    .select("*")
    .order("ticker");
  if (error) throw error;
  return data as Holding[];
}

export async function createHolding(
  holding: Pick<
    Holding,
    "account_id" | "ticker" | "name" | "asset_type" | "shares" | "currency" | "risk_level"
  >
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("holdings")
    .insert({ ...holding, user_id: user.id })
    .select()
    .single();
  if (error) throw error;
  return data as Holding;
}

export async function updateHolding(
  id: string,
  updates: Partial<Pick<Holding, "shares" | "name" | "asset_type" | "currency" | "risk_level">>
) {
  const { data, error } = await supabase
    .from("holdings")
    .update({ ...updates, last_updated: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Holding;
}

export async function deleteHolding(id: string) {
  const { error } = await supabase.from("holdings").delete().eq("id", id);
  if (error) throw error;
}

// ── Private Investments ──

export async function getPrivateInvestments() {
  const { data, error } = await supabase
    .from("private_investments")
    .select("*")
    .eq("is_deleted", false)
    .order("asset_type")
    .order("name");
  if (error) throw error;
  return data as PrivateInvestment[];
}

export async function createPrivateInvestment(
  investment: Pick<
    PrivateInvestment,
    "asset_type" | "name" | "price_per_unit" | "currency" | "quantity" | "unit_label" | "ticker" | "price_source" | "risk_level" | "notes"
  >
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("private_investments")
    .insert({ ...investment, user_id: user.id })
    .select()
    .single();
  if (error) throw error;
  return data as PrivateInvestment;
}

export async function updatePrivateInvestment(
  id: string,
  updates: Partial<
    Pick<PrivateInvestment, "price_per_unit" | "name" | "quantity" | "ticker" | "price_source" | "risk_level" | "notes">
  >
) {
  const { data, error } = await supabase
    .from("private_investments")
    .update({ ...updates, last_updated: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as PrivateInvestment;
}

export async function deletePrivateInvestment(id: string) {
  const { error } = await supabase
    .from("private_investments")
    .update({ is_deleted: true })
    .eq("id", id);
  if (error) throw error;
}

// ── Valuation History ──

export async function getValuationHistory(investmentId: string) {
  const { data, error } = await supabase
    .from("valuation_history")
    .select("*")
    .eq("investment_id", investmentId)
    .order("date", { ascending: false });
  if (error) throw error;
  return data as ValuationHistory[];
}

export async function addValuation(
  investmentId: string,
  value: number,
  note?: string
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Insert valuation history entry
  const { error: histError } = await supabase
    .from("valuation_history")
    .insert({
      user_id: user.id,
      investment_id: investmentId,
      date: new Date().toISOString().split("T")[0],
      value,
      note,
    });
  if (histError) throw histError;

  // Update price_per_unit on the investment
  const { error: updateError } = await supabase
    .from("private_investments")
    .update({ price_per_unit: value, last_updated: new Date().toISOString() })
    .eq("id", investmentId);
  if (updateError) throw updateError;
}

// ── Snapshots ──

export async function getLatestSnapshotDate() {
  const { data, error } = await supabase
    .from("snapshots")
    .select("date")
    .order("date", { ascending: false })
    .limit(1)
    .single();
  if (error) throw error;
  return data.date as string;
}

export async function getSnapshotsByDate(date: string) {
  const { data, error } = await supabase
    .from("snapshots")
    .select("*")
    .eq("date", date)
    .order("value_usd", { ascending: false });
  if (error) throw error;
  return data as Snapshot[];
}

export async function getSnapshotDates() {
  // Paginate to avoid PostgREST max_rows (default 1000)
  const all: { date: string }[] = [];
  const pageSize = 1000;
  let offset = 0;
  while (true) {
    const { data, error } = await supabase
      .from("snapshots")
      .select("date")
      .order("date", { ascending: true })
      .range(offset, offset + pageSize - 1);
    if (error) throw error;
    all.push(...data);
    if (data.length < pageSize) break;
    offset += pageSize;
  }
  const seen = new Set<string>();
  return all.filter((d) => {
    if (seen.has(d.date)) return false;
    seen.add(d.date);
    return true;
  }).map((d) => d.date as string);
}

export async function getNetWorthByDate() {
  // Paginate to avoid PostgREST max_rows (default 1000)
  const all: { date: string; value_usd: number; fx_rate: number | null }[] = [];
  const pageSize = 1000;
  let offset = 0;
  while (true) {
    const { data, error } = await supabase
      .from("snapshots")
      .select("date, value_usd, fx_rate")
      .order("date")
      .range(offset, offset + pageSize - 1);
    if (error) throw error;
    all.push(...data);
    if (data.length < pageSize) break;
    offset += pageSize;
  }
  const byDate: Record<string, { usd: number; fx: number }> = {};
  for (const row of all) {
    if (!byDate[row.date]) byDate[row.date] = { usd: 0, fx: 0 };
    byDate[row.date].usd += Number(row.value_usd);
    if (row.fx_rate && row.fx_rate > 0) byDate[row.date].fx = Number(row.fx_rate);
  }
  return Object.entries(byDate)
    .map(([date, { usd, fx }]) => ({
      date,
      value: Math.round(usd),
      valueKrw: Math.round(usd * fx),
      fxRate: fx,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function getSnapshotHistoryByTicker(tickers: string[]) {
  if (tickers.length === 0) return [] as Snapshot[];
  const all: Snapshot[] = [];
  const pageSize = 1000;
  let offset = 0;
  while (true) {
    const { data, error } = await supabase
      .from("snapshots")
      .select("*")
      .in("ticker", tickers)
      .order("date", { ascending: true })
      .range(offset, offset + pageSize - 1);
    if (error) throw error;
    all.push(...(data as Snapshot[]));
    if (data.length < pageSize) break;
    offset += pageSize;
  }
  return all;
}

