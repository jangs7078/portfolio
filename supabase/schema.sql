-- Portfolio Dashboard: Full Database Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- 1. Accounts
CREATE TABLE accounts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users NOT NULL,
  name          TEXT NOT NULL,
  type          TEXT NOT NULL,
  country       TEXT NOT NULL DEFAULT 'US',
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own accounts"
  ON accounts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 2. Holdings
CREATE TABLE holdings (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID REFERENCES auth.users NOT NULL,
  account_id          UUID REFERENCES accounts ON DELETE CASCADE NOT NULL,
  ticker              TEXT NOT NULL,
  name                TEXT NOT NULL,
  asset_type          TEXT NOT NULL,
  shares              DECIMAL NOT NULL DEFAULT 0,
  currency            TEXT NOT NULL DEFAULT 'USD',
  risk_level          TEXT NOT NULL DEFAULT 'medium',
  last_updated        TIMESTAMPTZ DEFAULT now(),
  UNIQUE(account_id, ticker)
);

ALTER TABLE holdings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own holdings"
  ON holdings FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3. Private Investments
CREATE TABLE private_investments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES auth.users NOT NULL,
  asset_type       TEXT NOT NULL,
  name             TEXT NOT NULL,
  price_per_unit   DECIMAL NOT NULL,
  currency         TEXT NOT NULL DEFAULT 'USD',
  quantity         DECIMAL NOT NULL DEFAULT 1,
  unit_label       TEXT,
  ticker           TEXT,
  price_source     TEXT DEFAULT 'manual',
  risk_level       TEXT NOT NULL DEFAULT 'medium',
  notes            TEXT,
  is_deleted       BOOLEAN DEFAULT false,
  last_updated     TIMESTAMPTZ DEFAULT now(),
  created_at       TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE private_investments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own private investments"
  ON private_investments FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Snapshots
CREATE TABLE snapshots (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users NOT NULL,
  date            DATE NOT NULL,
  holding_id      UUID REFERENCES holdings ON DELETE SET NULL,
  investment_id   UUID REFERENCES private_investments ON DELETE SET NULL,
  ticker          TEXT NOT NULL,
  value_native    DECIMAL NOT NULL,
  currency        TEXT NOT NULL,
  value_usd       DECIMAL NOT NULL,
  fx_rate         DECIMAL,
  price_per_unit  DECIMAL,
  UNIQUE(date, holding_id),
  UNIQUE(date, investment_id)
);

ALTER TABLE snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own snapshots"
  ON snapshots FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_snapshots_date ON snapshots(date);
CREATE INDEX idx_snapshots_ticker ON snapshots(ticker, date);

-- 5. Valuation History
CREATE TABLE valuation_history (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users NOT NULL,
  investment_id   UUID REFERENCES private_investments ON DELETE CASCADE NOT NULL,
  date            DATE NOT NULL,
  value           DECIMAL NOT NULL,
  note            TEXT
);

ALTER TABLE valuation_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own valuation history"
  ON valuation_history FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_valuation_date ON valuation_history(investment_id, date);

-- 6. Risk Classifications
CREATE TABLE risk_classifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users NOT NULL,
  ticker      TEXT NOT NULL,
  risk_level  TEXT NOT NULL,
  reason      TEXT,
  UNIQUE(user_id, ticker)
);

ALTER TABLE risk_classifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own risk classifications"
  ON risk_classifications FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 7. Settings
CREATE TABLE settings (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  key     TEXT NOT NULL,
  value   TEXT NOT NULL,
  UNIQUE(user_id, key)
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own settings"
  ON settings FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Default risk classifications (inserted after first user signs up)
-- Run this separately after creating your account, replacing YOUR_USER_ID:
--
-- INSERT INTO risk_classifications (user_id, ticker, risk_level, reason) VALUES
--   ('YOUR_USER_ID', 'CASH_USD', 'low', 'Cash'),
--   ('YOUR_USER_ID', 'CASH_KRW', 'low', 'Cash'),
--   ('YOUR_USER_ID', 'SGOV', 'low', 'Short-term treasury'),
--   ('YOUR_USER_ID', 'BND', 'low', 'Total bond market'),
--   ('YOUR_USER_ID', 'VOO', 'medium', 'S&P 500 index'),
--   ('YOUR_USER_ID', 'VTI', 'medium', 'Total stock market'),
--   ('YOUR_USER_ID', 'VXUS', 'medium', 'International stocks'),
--   ('YOUR_USER_ID', 'NVDA', 'high', 'Individual stock'),
--   ('YOUR_USER_ID', 'AAPL', 'high', 'Individual stock'),
--   ('YOUR_USER_ID', 'MSFT', 'high', 'Individual stock'),
--   ('YOUR_USER_ID', 'SI', 'high', 'Physical commodity');
