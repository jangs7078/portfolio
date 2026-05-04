export type AccountType = "checking" | "savings" | "brokerage" | "401k";
export type Country = "US" | "KR";
export type HoldingAssetType = "stock" | "etf" | "index" | "bond" | "cash" | "commodity";
export type PrivateAssetType = "stock" | "lp" | "commodity";
export type RiskLevel = "none" | "low" | "medium" | "high" | "very_high";
export type PriceSource = "comex" | "manual";
export type Currency = "USD" | "KRW";

export interface TickerHistory {
  dates: string[];
  values: number[];
  firstBoughtDate: string | null;
}

export interface Account {
  id: string;
  user_id: string;
  name: string;
  type: AccountType;
  country: Country;
  is_active: boolean;
  created_at: string;
}

export interface Holding {
  id: string;
  user_id: string;
  account_id: string;
  ticker: string;
  name: string;
  asset_type: HoldingAssetType;
  shares: number;
  currency: Currency;
  risk_level: RiskLevel;
  last_updated: string;
}

export interface Snapshot {
  id: string;
  user_id: string;
  date: string;
  holding_id: string | null;
  investment_id: string | null;
  ticker: string;
  value_native: number;
  currency: Currency;
  value_usd: number;
  fx_rate: number | null;
  price_per_unit: number | null;
}

export interface PrivateInvestment {
  id: string;
  user_id: string;
  asset_type: PrivateAssetType;
  name: string;
  currency: Currency;
  quantity: number;
  price_per_unit: number;
  unit_label: string | null;
  ticker: string | null;
  price_source: PriceSource;
  risk_level: RiskLevel;
  notes: string | null;
  is_deleted: boolean;
  last_updated: string;
  created_at: string;
}

export interface ValuationHistory {
  id: string;
  user_id: string;
  investment_id: string;
  date: string;
  value: number;
  note: string | null;
}

export interface Setting {
  id: string;
  user_id: string;
  key: string;
  value: string;
}
