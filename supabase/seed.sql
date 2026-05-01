-- Portfolio Seed Data
-- Generated from Google Sheets data (3/1/2026 - 4/1/2026)
-- Run in Supabase SQL Editor (bypasses RLS)

DO $$
DECLARE
  uid UUID;
  acc_samsung UUID;
  acc_robinhood UUID;
  acc_schwab UUID;
  acc_hana UUID;
  h_039290 UUID;
  h_246720 UUID;
  h_000660 UUID;
  h_ceg UUID;
  h_sgov UUID;
  h_tlt UUID;
  h_krw_sam UUID;
  h_sil UUID;
  h_shld UUID;
  h_xle UUID;
  h_soxx UUID;
  h_botz UUID;
  h_gev UUID;
  h_googl UUID;
  h_meta UUID;
  h_msft UUID;
  h_panw UUID;
  h_clrb UUID;
  h_usd UUID;
  h_schwab UUID;
  h_krw_hana UUID;
  inv_scalev UUID;
  inv_scale UUID;
  inv_gold UUID;
  inv_silver UUID;
  inv_krew UUID;
  inv_infobank_fund UUID;
  inv_mobilix UUID;
  inv_mrmind UUID;
  inv_taeju UUID;
  inv_quad UUID;
  inv_starnex UUID;
  inv_gravity UUID;
BEGIN

  -- Get the first user (must exist)
  SELECT id INTO uid FROM auth.users LIMIT 1;
  IF uid IS NULL THEN RAISE EXCEPTION 'No user found in auth.users. Sign up first.'; END IF;

  -- Accounts
  INSERT INTO accounts (user_id, name, type, country) VALUES (uid, '삼성증권', 'brokerage', 'KR') RETURNING id INTO acc_samsung;
  INSERT INTO accounts (user_id, name, type, country) VALUES (uid, 'Robinhood', 'brokerage', 'US') RETURNING id INTO acc_robinhood;
  INSERT INTO accounts (user_id, name, type, country) VALUES (uid, 'Charles Schwab', 'brokerage', 'US') RETURNING id INTO acc_schwab;
  INSERT INTO accounts (user_id, name, type, country) VALUES (uid, '하나은행', 'savings', 'KR') RETURNING id INTO acc_hana;

  -- Holdings
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, acc_samsung, '039290', 'InfoBankCorp', 'stock', 45963, 'KRW')
    RETURNING id INTO h_039290;
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, acc_samsung, '246720', 'Asta Co Ltd', 'stock', 4588, 'KRW')
    RETURNING id INTO h_246720;
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, acc_samsung, '000660', 'SK Hynix Inc', 'stock', 81, 'KRW')
    RETURNING id INTO h_000660;
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, acc_samsung, 'CEG', 'Constellation Energy Corp', 'stock', 100, 'USD')
    RETURNING id INTO h_ceg;
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, acc_samsung, 'SGOV', 'iShares 0-3 Month Treasury Bond ETF', 'etf', 7197, 'USD')
    RETURNING id INTO h_sgov;
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, acc_samsung, 'TLT', 'iShares 20+ Year Treasury Bond ETF', 'bond', 0, 'USD')
    RETURNING id INTO h_tlt;
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, acc_samsung, 'CASH_KRW', 'KRW Cash', 'cash', 1027835741, 'KRW')
    RETURNING id INTO h_krw_sam;
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, acc_robinhood, 'SIL', 'Global X Silver Miners ETF', 'etf', 1809, 'USD')
    RETURNING id INTO h_sil;
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, acc_robinhood, 'SHLD', 'Global X Defense Tech ETF', 'etf', 1664, 'USD')
    RETURNING id INTO h_shld;
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, acc_robinhood, 'XLE', 'Energy Select Sector SPDR ETF', 'etf', 1798, 'USD')
    RETURNING id INTO h_xle;
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, acc_robinhood, 'SOXX', 'iShares Semiconductor ETF', 'etf', 292, 'USD')
    RETURNING id INTO h_soxx;
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, acc_robinhood, 'BOTZ', 'Global X Robotics & AI ETF', 'etf', 854, 'USD')
    RETURNING id INTO h_botz;
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, acc_robinhood, 'GEV', 'GE Vernova Inc', 'stock', 107, 'USD')
    RETURNING id INTO h_gev;
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, acc_robinhood, 'GOOGL', 'Alphabet Inc Class A', 'stock', 558, 'USD')
    RETURNING id INTO h_googl;
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, acc_robinhood, 'META', 'Meta Platforms Inc', 'stock', 101, 'USD')
    RETURNING id INTO h_meta;
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, acc_robinhood, 'MSFT', 'Microsoft Corp', 'stock', 0, 'USD')
    RETURNING id INTO h_msft;
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, acc_robinhood, 'PANW', 'Palo Alto Networks Inc', 'stock', 353, 'USD')
    RETURNING id INTO h_panw;
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, acc_robinhood, 'CLRB', 'Cellectar Biosciences Inc', 'stock', 1602, 'USD')
    RETURNING id INTO h_clrb;
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, acc_robinhood, 'CASH_USD', 'USD Cash', 'cash', 330416, 'USD')
    RETURNING id INTO h_usd;
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, acc_schwab, 'SCHWAB2055', 'Schwab Target 2055 Index Fund', 'index', 1, 'USD')
    RETURNING id INTO h_schwab;
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, acc_hana, 'CASH_KRW', 'KRW Cash', 'cash', 473156634, 'KRW')
    RETURNING id INTO h_krw_hana;

  -- Private Investments
  INSERT INTO private_investments (user_id, asset_type, name, current_value, cost_basis_total, currency, quantity, unit_label, ticker, price_source)
    VALUES (uid, 'stock', 'Scale - Vested', 390276, NULL, 'USD', 97569, NULL, 'SCALEV', 'manual')
    RETURNING id INTO inv_scalev;
  INSERT INTO private_investments (user_id, asset_type, name, current_value, cost_basis_total, currency, quantity, unit_label, ticker, price_source)
    VALUES (uid, 'stock', 'Scale', 293250, NULL, 'USD', 48875, NULL, 'SCALE', 'manual')
    RETURNING id INTO inv_scale;
  INSERT INTO private_investments (user_id, asset_type, name, current_value, cost_basis_total, currency, quantity, unit_label, ticker, price_source)
    VALUES (uid, 'commodity', 'Gold', 1092574, NULL, 'USD', 227, 'oz', 'GCW00', 'comex')
    RETURNING id INTO inv_gold;
  INSERT INTO private_investments (user_id, asset_type, name, current_value, cost_basis_total, currency, quantity, unit_label, ticker, price_source)
    VALUES (uid, 'commodity', 'Silver', 7608, NULL, 'USD', 100, 'oz', 'SIW00', 'comex')
    RETURNING id INTO inv_silver;
  INSERT INTO private_investments (user_id, asset_type, name, current_value, cost_basis_total, currency, quantity, unit_label, ticker, price_source)
    VALUES (uid, 'lp', 'Krew Fund', 30000000, 30000000, 'KRW', NULL, NULL, NULL, 'manual')
    RETURNING id INTO inv_krew;
  INSERT INTO private_investments (user_id, asset_type, name, current_value, cost_basis_total, currency, quantity, unit_label, ticker, price_source)
    VALUES (uid, 'lp', '인포뱅크-서울바이오허브 메디컬 개인투자조합 2호', 50000000, 50000000, 'KRW', NULL, NULL, NULL, 'manual')
    RETURNING id INTO inv_infobank_fund;
  INSERT INTO private_investments (user_id, asset_type, name, current_value, cost_basis_total, currency, quantity, unit_label, ticker, price_source)
    VALUES (uid, 'stock', '모빌릭스', 20000000, 20000000, 'KRW', 100, NULL, NULL, 'manual')
    RETURNING id INTO inv_mobilix;
  INSERT INTO private_investments (user_id, asset_type, name, current_value, cost_basis_total, currency, quantity, unit_label, ticker, price_source)
    VALUES (uid, 'stock', '미스터마인드', 40000000, 40000000, 'KRW', 100, NULL, NULL, 'manual')
    RETURNING id INTO inv_mrmind;
  INSERT INTO private_investments (user_id, asset_type, name, current_value, cost_basis_total, currency, quantity, unit_label, ticker, price_source)
    VALUES (uid, 'stock', '태주', 70000000, 70000000, 'KRW', 100, NULL, NULL, 'manual')
    RETURNING id INTO inv_taeju;
  INSERT INTO private_investments (user_id, asset_type, name, current_value, cost_basis_total, currency, quantity, unit_label, ticker, price_source)
    VALUES (uid, 'stock', '쿼드', 27000000, 27000000, 'KRW', 100, NULL, NULL, 'manual')
    RETURNING id INTO inv_quad;
  INSERT INTO private_investments (user_id, asset_type, name, current_value, cost_basis_total, currency, quantity, unit_label, ticker, price_source)
    VALUES (uid, 'stock', '스타넥스', 3000000, 3000000, 'KRW', 100, NULL, NULL, 'manual')
    RETURNING id INTO inv_starnex;
  INSERT INTO private_investments (user_id, asset_type, name, current_value, cost_basis_total, currency, quantity, unit_label, ticker, price_source)
    VALUES (uid, 'stock', '그래비티랩스', 20000000, 20000000, 'KRW', 100, NULL, NULL, 'manual')
    RETURNING id INTO inv_gravity;

  -- Snapshots
  -- 2026-03-01
  INSERT INTO snapshots (user_id, date, holding_id, investment_id, ticker, value_native, currency, value_usd, fx_rate, price_per_unit) VALUES
    (uid, '2026-03-01', h_039290, NULL, '039290', 227057156, 'KRW', 157843, 1438.5, 4940),
    (uid, '2026-03-01', h_246720, NULL, '246720', 32300079, 'KRW', 22454, 1438.5, 7040.12),
    (uid, '2026-03-01', h_000660, NULL, '000660', 0, 'KRW', 0, 1438.5, NULL),
    (uid, '2026-03-01', h_ceg, NULL, 'CEG', 32716, 'USD', 32716, 1438.5, 327.16),
    (uid, '2026-03-01', h_sgov, NULL, 'SGOV', 329447, 'USD', 329447, 1438.5, 100.38),
    (uid, '2026-03-01', h_tlt, NULL, 'TLT', 398854, 'USD', 398854, 1438.5, 89.61),
    (uid, '2026-03-01', h_krw_sam, NULL, 'CASH_KRW', 1116346487, 'KRW', 776049, 1438.5, 1),
    (uid, '2026-03-01', h_sil, NULL, 'SIL', 0, 'USD', 0, 1438.5, NULL),
    (uid, '2026-03-01', h_shld, NULL, 'SHLD', 67272, 'USD', 67272, 1438.5, 77.06),
    (uid, '2026-03-01', h_xle, NULL, 'XLE', 65596, 'USD', 65596, 1438.5, 57.04),
    (uid, '2026-03-01', h_soxx, NULL, 'SOXX', 0, 'USD', 0, 1438.5, NULL),
    (uid, '2026-03-01', h_botz, NULL, 'BOTZ', 0, 'USD', 0, 1438.5, NULL),
    (uid, '2026-03-01', h_gev, NULL, 'GEV', 10574, 'USD', 10574, 1438.5, 881.17),
    (uid, '2026-03-01', h_googl, NULL, 'GOOGL', 37702, 'USD', 37702, 1438.5, 306.52),
    (uid, '2026-03-01', h_meta, NULL, 'META', 28103, 'USD', 28103, 1438.5, 653.56),
    (uid, '2026-03-01', h_msft, NULL, 'MSFT', 9964, 'USD', 9964, 1438.5, 398.56),
    (uid, '2026-03-01', h_panw, NULL, 'PANW', 0, 'USD', 0, 1438.5, NULL),
    (uid, '2026-03-01', h_clrb, NULL, 'CLRB', 4789, 'USD', 4789, 1438.5, 2.99),
    (uid, '2026-03-01', h_usd, NULL, 'CASH_USD', 1229915, 'USD', 1229915, 1438.5, 1),
    (uid, '2026-03-01', h_schwab, NULL, 'SCHWAB2055', 141146, 'USD', 141146, 1438.5, 141146),
    (uid, '2026-03-01', h_krw_hana, NULL, 'CASH_KRW', 472058160, 'KRW', 328160, 1438.5, 1),
    (uid, '2026-03-01', NULL, inv_scalev, 'SCALEV', 358000, 'USD', 358000, 1438.5, 4),
    (uid, '2026-03-01', NULL, inv_scale, 'SCALE', 293250, 'USD', 293250, 1438.5, 6),
    (uid, '2026-03-01', NULL, inv_gold, 'GCW00', 1205733, 'USD', 1205733, 1438.5, 5311.6),
    (uid, '2026-03-01', NULL, inv_silver, 'SIW00', 8885, 'USD', 8885, 1438.5, 88.85),
    (uid, '2026-03-01', NULL, inv_krew, 'Krew Fund', 30000000, 'KRW', 20854.88, 1438.5, NULL),
    (uid, '2026-03-01', NULL, inv_infobank_fund, '인포뱅크-서울바이오허브 메디컬 개인투자조합 2호', 50000000, 'KRW', 34758.13, 1438.5, NULL),
    (uid, '2026-03-01', NULL, inv_mobilix, '모빌릭스', 20000000, 'KRW', 13903.33, 1438.5, 200000),
    (uid, '2026-03-01', NULL, inv_mrmind, '미스터마인드', 40000000, 'KRW', 27806.67, 1438.5, 400000),
    (uid, '2026-03-01', NULL, inv_taeju, '태주', 70000000, 'KRW', 48661.67, 1438.5, 700000),
    (uid, '2026-03-01', NULL, inv_quad, '쿼드', 27000000, 'KRW', 18769.5, 1438.5, 270000),
    (uid, '2026-03-01', NULL, inv_starnex, '스타넥스', 3000000, 'KRW', 2085.5, 1438.5, 30000),
    (uid, '2026-03-01', NULL, inv_gravity, '그래비티랩스', 20000000, 'KRW', 13903.33, 1438.5, 200000);

  -- 2026-03-02
  INSERT INTO snapshots (user_id, date, holding_id, investment_id, ticker, value_native, currency, value_usd, fx_rate, price_per_unit) VALUES
    (uid, '2026-03-02', h_039290, NULL, '039290', 227056605, 'KRW', 156346, 1452.27, 4939.99),
    (uid, '2026-03-02', h_246720, NULL, '246720', 32299937, 'KRW', 22241, 1452.27, 7040.09),
    (uid, '2026-03-02', h_000660, NULL, '000660', 0, 'KRW', 0, 1452.27, NULL),
    (uid, '2026-03-02', h_ceg, NULL, 'CEG', 32716, 'USD', 32716, 1452.27, 327.16),
    (uid, '2026-03-02', h_sgov, NULL, 'SGOV', 329447, 'USD', 329447, 1452.27, 100.38),
    (uid, '2026-03-02', h_tlt, NULL, 'TLT', 398854, 'USD', 398854, 1452.27, 89.61),
    (uid, '2026-03-02', h_krw_sam, NULL, 'CASH_KRW', 1116346879, 'KRW', 768691, 1452.27, 1),
    (uid, '2026-03-02', h_sil, NULL, 'SIL', 20122, 'USD', 20122, 1452.27, 116.99),
    (uid, '2026-03-02', h_shld, NULL, 'SHLD', 67272, 'USD', 67272, 1452.27, 77.06),
    (uid, '2026-03-02', h_xle, NULL, 'XLE', 65596, 'USD', 65596, 1452.27, 57.04),
    (uid, '2026-03-02', h_soxx, NULL, 'SOXX', 0, 'USD', 0, 1452.27, NULL),
    (uid, '2026-03-02', h_botz, NULL, 'BOTZ', 10044, 'USD', 10044, 1452.27, 38.19),
    (uid, '2026-03-02', h_gev, NULL, 'GEV', 10574, 'USD', 10574, 1452.27, 881.17),
    (uid, '2026-03-02', h_googl, NULL, 'GOOGL', 37702, 'USD', 37702, 1452.27, 306.52),
    (uid, '2026-03-02', h_meta, NULL, 'META', 28103, 'USD', 28103, 1452.27, 653.56),
    (uid, '2026-03-02', h_msft, NULL, 'MSFT', 0, 'USD', 0, 1452.27, NULL),
    (uid, '2026-03-02', h_panw, NULL, 'PANW', 0, 'USD', 0, 1452.27, NULL),
    (uid, '2026-03-02', h_clrb, NULL, 'CLRB', 4789, 'USD', 4789, 1452.27, 2.99),
    (uid, '2026-03-02', h_usd, NULL, 'CASH_USD', 1209757, 'USD', 1209757, 1452.27, 1),
    (uid, '2026-03-02', h_schwab, NULL, 'SCHWAB2055', 140540, 'USD', 140540, 1452.27, 140540),
    (uid, '2026-03-02', h_krw_hana, NULL, 'CASH_KRW', 472057459, 'KRW', 325048, 1452.27, 1),
    (uid, '2026-03-02', NULL, inv_scalev, 'SCALEV', 358000, 'USD', 358000, 1452.27, 4),
    (uid, '2026-03-02', NULL, inv_scale, 'SCALE', 293250, 'USD', 293250, 1452.27, 6),
    (uid, '2026-03-02', NULL, inv_gold, 'GCW00', 1205733, 'USD', 1205733, 1452.27, 5311.6),
    (uid, '2026-03-02', NULL, inv_silver, 'SIW00', 8885, 'USD', 8885, 1452.27, 88.85),
    (uid, '2026-03-02', NULL, inv_krew, 'Krew Fund', 30000000, 'KRW', 20657.25, 1452.27, NULL),
    (uid, '2026-03-02', NULL, inv_infobank_fund, '인포뱅크-서울바이오허브 메디컬 개인투자조합 2호', 50000000, 'KRW', 34428.75, 1452.27, NULL),
    (uid, '2026-03-02', NULL, inv_mobilix, '모빌릭스', 20000000, 'KRW', 13771.56, 1452.27, 200000),
    (uid, '2026-03-02', NULL, inv_mrmind, '미스터마인드', 40000000, 'KRW', 27543.11, 1452.27, 400000),
    (uid, '2026-03-02', NULL, inv_taeju, '태주', 70000000, 'KRW', 48200.44, 1452.27, 700000),
    (uid, '2026-03-02', NULL, inv_quad, '쿼드', 27000000, 'KRW', 18591.6, 1452.27, 270000),
    (uid, '2026-03-02', NULL, inv_starnex, '스타넥스', 3000000, 'KRW', 2065.73, 1452.27, 30000),
    (uid, '2026-03-02', NULL, inv_gravity, '그래비티랩스', 20000000, 'KRW', 13771.56, 1452.27, 200000);

  -- 2026-03-03
  INSERT INTO snapshots (user_id, date, holding_id, investment_id, ticker, value_native, currency, value_usd, fx_rate, price_per_unit) VALUES
    (uid, '2026-03-03', h_039290, NULL, '039290', 227056605, 'KRW', 156346, 1452.27, 4939.99),
    (uid, '2026-03-03', h_246720, NULL, '246720', 32299937, 'KRW', 22241, 1452.27, 7040.09),
    (uid, '2026-03-03', h_000660, NULL, '000660', 0, 'KRW', 0, 1452.27, NULL),
    (uid, '2026-03-03', h_ceg, NULL, 'CEG', 32487, 'USD', 32487, 1452.27, 324.87),
    (uid, '2026-03-03', h_sgov, NULL, 'SGOV', 329513, 'USD', 329513, 1452.27, 100.4),
    (uid, '2026-03-03', h_tlt, NULL, 'TLT', 398053, 'USD', 398053, 1452.27, 89.43),
    (uid, '2026-03-03', h_krw_sam, NULL, 'CASH_KRW', 1116346879, 'KRW', 768691, 1452.27, 1),
    (uid, '2026-03-03', h_sil, NULL, 'SIL', 18328, 'USD', 18328, 1452.27, 106.56),
    (uid, '2026-03-03', h_shld, NULL, 'SHLD', 67019, 'USD', 67019, 1452.27, 76.77),
    (uid, '2026-03-03', h_xle, NULL, 'XLE', 64998, 'USD', 64998, 1452.27, 56.52),
    (uid, '2026-03-03', h_soxx, NULL, 'SOXX', 0, 'USD', 0, 1452.27, NULL),
    (uid, '2026-03-03', h_botz, NULL, 'BOTZ', 9705, 'USD', 9705, 1452.27, 36.9),
    (uid, '2026-03-03', h_gev, NULL, 'GEV', 10104, 'USD', 10104, 1452.27, 842),
    (uid, '2026-03-03', h_googl, NULL, 'GOOGL', 37340, 'USD', 37340, 1452.27, 303.58),
    (uid, '2026-03-03', h_meta, NULL, 'META', 28168, 'USD', 28168, 1452.27, 655.07),
    (uid, '2026-03-03', h_msft, NULL, 'MSFT', 0, 'USD', 0, 1452.27, NULL),
    (uid, '2026-03-03', h_panw, NULL, 'PANW', 0, 'USD', 0, 1452.27, NULL),
    (uid, '2026-03-03', h_clrb, NULL, 'CLRB', 4292, 'USD', 4292, 1452.27, 2.68),
    (uid, '2026-03-03', h_usd, NULL, 'CASH_USD', 1209757, 'USD', 1209757, 1452.27, 1),
    (uid, '2026-03-03', h_schwab, NULL, 'SCHWAB2055', 140540, 'USD', 140540, 1452.27, 140540),
    (uid, '2026-03-03', h_krw_hana, NULL, 'CASH_KRW', 472057459, 'KRW', 325048, 1452.27, 1),
    (uid, '2026-03-03', NULL, inv_scalev, 'SCALEV', 358000, 'USD', 358000, 1452.27, 4),
    (uid, '2026-03-03', NULL, inv_scale, 'SCALE', 293250, 'USD', 293250, 1452.27, 6),
    (uid, '2026-03-03', NULL, inv_gold, 'GCW00', 1163080, 'USD', 1163080, 1452.27, 5123.7),
    (uid, '2026-03-03', NULL, inv_silver, 'SIW00', 8347, 'USD', 8347, 1452.27, 83.47),
    (uid, '2026-03-03', NULL, inv_krew, 'Krew Fund', 30000000, 'KRW', 20657.25, 1452.27, NULL),
    (uid, '2026-03-03', NULL, inv_infobank_fund, '인포뱅크-서울바이오허브 메디컬 개인투자조합 2호', 50000000, 'KRW', 34428.75, 1452.27, NULL),
    (uid, '2026-03-03', NULL, inv_mobilix, '모빌릭스', 20000000, 'KRW', 13771.56, 1452.27, 200000),
    (uid, '2026-03-03', NULL, inv_mrmind, '미스터마인드', 40000000, 'KRW', 27543.11, 1452.27, 400000),
    (uid, '2026-03-03', NULL, inv_taeju, '태주', 70000000, 'KRW', 48200.44, 1452.27, 700000),
    (uid, '2026-03-03', NULL, inv_quad, '쿼드', 27000000, 'KRW', 18591.6, 1452.27, 270000),
    (uid, '2026-03-03', NULL, inv_starnex, '스타넥스', 3000000, 'KRW', 2065.73, 1452.27, 30000),
    (uid, '2026-03-03', NULL, inv_gravity, '그래비티랩스', 20000000, 'KRW', 13771.56, 1452.27, 200000);

  -- 2026-03-04
  INSERT INTO snapshots (user_id, date, holding_id, investment_id, ticker, value_native, currency, value_usd, fx_rate, price_per_unit) VALUES
    (uid, '2026-03-04', h_039290, NULL, '039290', 183851456, 'KRW', 125861, 1460.75, 3999.99),
    (uid, '2026-03-04', h_246720, NULL, '246720', 30052010, 'KRW', 20573, 1460.75, 6550.13),
    (uid, '2026-03-04', h_000660, NULL, '000660', 0, 'KRW', 0, 1460.75, NULL),
    (uid, '2026-03-04', h_ceg, NULL, 'CEG', 32285, 'USD', 32285, 1460.75, 322.85),
    (uid, '2026-03-04', h_sgov, NULL, 'SGOV', 329513, 'USD', 329513, 1460.75, 100.4),
    (uid, '2026-03-04', h_tlt, NULL, 'TLT', 396807, 'USD', 396807, 1460.75, 89.15),
    (uid, '2026-03-04', h_krw_sam, NULL, 'CASH_KRW', 1116347512, 'KRW', 764229, 1460.75, 1),
    (uid, '2026-03-04', h_sil, NULL, 'SIL', 57604, 'USD', 57604, 1460.75, 107.47),
    (uid, '2026-03-04', h_shld, NULL, 'SHLD', 67473, 'USD', 67473, 1460.75, 77.29),
    (uid, '2026-03-04', h_xle, NULL, 'XLE', 64619, 'USD', 64619, 1460.75, 56.19),
    (uid, '2026-03-04', h_soxx, NULL, 'SOXX', 0, 'USD', 0, 1460.75, NULL),
    (uid, '2026-03-04', h_botz, NULL, 'BOTZ', 9765, 'USD', 9765, 1460.75, 37.13),
    (uid, '2026-03-04', h_gev, NULL, 'GEV', 10095, 'USD', 10095, 1460.75, 841.25),
    (uid, '2026-03-04', h_googl, NULL, 'GOOGL', 37285, 'USD', 37285, 1460.75, 303.13),
    (uid, '2026-03-04', h_meta, NULL, 'META', 28712, 'USD', 28712, 1460.75, 667.72),
    (uid, '2026-03-04', h_msft, NULL, 'MSFT', 0, 'USD', 0, 1460.75, NULL),
    (uid, '2026-03-04', h_panw, NULL, 'PANW', 0, 'USD', 0, 1460.75, NULL),
    (uid, '2026-03-04', h_clrb, NULL, 'CLRB', 4645, 'USD', 4645, 1460.75, 2.9),
    (uid, '2026-03-04', h_usd, NULL, 'CASH_USD', 1169892, 'USD', 1169892, 1460.75, 1),
    (uid, '2026-03-04', h_schwab, NULL, 'SCHWAB2055', 139206, 'USD', 139206, 1460.75, 139206),
    (uid, '2026-03-04', h_krw_hana, NULL, 'CASH_KRW', 472057431, 'KRW', 323161, 1460.75, 1),
    (uid, '2026-03-04', NULL, inv_scalev, 'SCALEV', 358000, 'USD', 358000, 1460.75, 4),
    (uid, '2026-03-04', NULL, inv_scale, 'SCALE', 293250, 'USD', 293250, 1460.75, 6),
    (uid, '2026-03-04', NULL, inv_gold, 'GCW00', 1165577, 'USD', 1165577, 1460.75, 5134.7),
    (uid, '2026-03-04', NULL, inv_silver, 'SIW00', 8318, 'USD', 8318, 1460.75, 83.18),
    (uid, '2026-03-04', NULL, inv_krew, 'Krew Fund', 30000000, 'KRW', 20537.25, 1460.75, NULL),
    (uid, '2026-03-04', NULL, inv_infobank_fund, '인포뱅크-서울바이오허브 메디컬 개인투자조합 2호', 50000000, 'KRW', 34228.75, 1460.75, NULL),
    (uid, '2026-03-04', NULL, inv_mobilix, '모빌릭스', 20000000, 'KRW', 13691.56, 1460.75, 200000),
    (uid, '2026-03-04', NULL, inv_mrmind, '미스터마인드', 40000000, 'KRW', 27383.11, 1460.75, 400000),
    (uid, '2026-03-04', NULL, inv_taeju, '태주', 70000000, 'KRW', 47920.44, 1460.75, 700000),
    (uid, '2026-03-04', NULL, inv_quad, '쿼드', 27000000, 'KRW', 18483.6, 1460.75, 270000),
    (uid, '2026-03-04', NULL, inv_starnex, '스타넥스', 3000000, 'KRW', 2053.73, 1460.75, 30000),
    (uid, '2026-03-04', NULL, inv_gravity, '그래비티랩스', 20000000, 'KRW', 13691.56, 1460.75, 200000);

  -- 2026-03-05
  INSERT INTO snapshots (user_id, date, holding_id, investment_id, ticker, value_native, currency, value_usd, fx_rate, price_per_unit) VALUES
    (uid, '2026-03-05', h_039290, NULL, '039290', 199708698, 'KRW', 134983, 1479.51, 4344.99),
    (uid, '2026-03-05', h_246720, NULL, '246720', 35327740, 'KRW', 23878, 1479.51, 7700.03),
    (uid, '2026-03-05', h_000660, NULL, '000660', 0, 'KRW', 0, 1479.51, NULL),
    (uid, '2026-03-05', h_ceg, NULL, 'CEG', 33207, 'USD', 33207, 1479.51, 332.07),
    (uid, '2026-03-05', h_sgov, NULL, 'SGOV', 329546, 'USD', 329546, 1479.51, 100.41),
    (uid, '2026-03-05', h_tlt, NULL, 'TLT', 395204, 'USD', 395204, 1479.51, 88.79),
    (uid, '2026-03-05', h_krw_sam, NULL, 'CASH_KRW', 1116346516, 'KRW', 754538, 1479.51, 1),
    (uid, '2026-03-05', h_sil, NULL, 'SIL', 54881, 'USD', 54881, 1479.51, 102.39),
    (uid, '2026-03-05', h_shld, NULL, 'SHLD', 65457, 'USD', 65457, 1479.51, 74.98),
    (uid, '2026-03-05', h_xle, NULL, 'XLE', 64952, 'USD', 64952, 1479.51, 56.48),
    (uid, '2026-03-05', h_soxx, NULL, 'SOXX', 0, 'USD', 0, 1479.51, NULL),
    (uid, '2026-03-05', h_botz, NULL, 'BOTZ', 9621, 'USD', 9621, 1479.51, 36.58),
    (uid, '2026-03-05', h_gev, NULL, 'GEV', 9780, 'USD', 9780, 1479.51, 815),
    (uid, '2026-03-05', h_googl, NULL, 'GOOGL', 37008, 'USD', 37008, 1479.51, 300.88),
    (uid, '2026-03-05', h_meta, NULL, 'META', 28405, 'USD', 28405, 1479.51, 660.58),
    (uid, '2026-03-05', h_msft, NULL, 'MSFT', 0, 'USD', 0, 1479.51, NULL),
    (uid, '2026-03-05', h_panw, NULL, 'PANW', 0, 'USD', 0, 1479.51, NULL),
    (uid, '2026-03-05', h_clrb, NULL, 'CLRB', 4437, 'USD', 4437, 1479.51, 2.77),
    (uid, '2026-03-05', h_usd, NULL, 'CASH_USD', 1169892, 'USD', 1169892, 1479.51, 1),
    (uid, '2026-03-05', h_schwab, NULL, 'SCHWAB2055', 139206, 'USD', 139206, 1479.51, 139206),
    (uid, '2026-03-05', h_krw_hana, NULL, 'CASH_KRW', 472058379, 'KRW', 319064, 1479.51, 1),
    (uid, '2026-03-05', NULL, inv_scalev, 'SCALEV', 358000, 'USD', 358000, 1479.51, 4),
    (uid, '2026-03-05', NULL, inv_scale, 'SCALE', 293250, 'USD', 293250, 1479.51, 6),
    (uid, '2026-03-05', NULL, inv_gold, 'GCW00', 1152865, 'USD', 1152865, 1479.51, 5078.7),
    (uid, '2026-03-05', NULL, inv_silver, 'SIW00', 8218, 'USD', 8218, 1479.51, 82.18),
    (uid, '2026-03-05', NULL, inv_krew, 'Krew Fund', 30000000, 'KRW', 20277, 1479.51, NULL),
    (uid, '2026-03-05', NULL, inv_infobank_fund, '인포뱅크-서울바이오허브 메디컬 개인투자조합 2호', 50000000, 'KRW', 33795, 1479.51, NULL),
    (uid, '2026-03-05', NULL, inv_mobilix, '모빌릭스', 20000000, 'KRW', 13518, 1479.51, 200000),
    (uid, '2026-03-05', NULL, inv_mrmind, '미스터마인드', 40000000, 'KRW', 27036, 1479.51, 400000),
    (uid, '2026-03-05', NULL, inv_taeju, '태주', 70000000, 'KRW', 47313, 1479.51, 700000),
    (uid, '2026-03-05', NULL, inv_quad, '쿼드', 27000000, 'KRW', 18249.3, 1479.51, 270000),
    (uid, '2026-03-05', NULL, inv_starnex, '스타넥스', 3000000, 'KRW', 2027.7, 1479.51, 30000),
    (uid, '2026-03-05', NULL, inv_gravity, '그래비티랩스', 20000000, 'KRW', 13518, 1479.51, 200000);

  -- 2026-03-06
  INSERT INTO snapshots (user_id, date, holding_id, investment_id, ticker, value_native, currency, value_usd, fx_rate, price_per_unit) VALUES
    (uid, '2026-03-06', h_039290, NULL, '039290', 206832843, 'KRW', 139348, 1484.29, 4499.99),
    (uid, '2026-03-06', h_246720, NULL, '246720', 34318269, 'KRW', 23121, 1484.29, 7480.01),
    (uid, '2026-03-06', h_000660, NULL, '000660', 0, 'KRW', 0, 1484.29, NULL),
    (uid, '2026-03-06', h_ceg, NULL, 'CEG', 31906, 'USD', 31906, 1484.29, 319.06),
    (uid, '2026-03-06', h_sgov, NULL, 'SGOV', 329677, 'USD', 329677, 1484.29, 100.45),
    (uid, '2026-03-06', h_tlt, NULL, 'TLT', 393735, 'USD', 393735, 1484.29, 88.46),
    (uid, '2026-03-06', h_krw_sam, NULL, 'CASH_KRW', 1116346383, 'KRW', 752108, 1484.29, 1),
    (uid, '2026-03-06', h_sil, NULL, 'SIL', 54259, 'USD', 54259, 1484.29, 101.23),
    (uid, '2026-03-06', h_shld, NULL, 'SHLD', 67412, 'USD', 67412, 1484.29, 77.22),
    (uid, '2026-03-06', h_xle, NULL, 'XLE', 65056, 'USD', 65056, 1484.29, 56.57),
    (uid, '2026-03-06', h_soxx, NULL, 'SOXX', 0, 'USD', 0, 1484.29, NULL),
    (uid, '2026-03-06', h_botz, NULL, 'BOTZ', 9492, 'USD', 9492, 1484.29, 36.09),
    (uid, '2026-03-06', h_gev, NULL, 'GEV', 9471, 'USD', 9471, 1484.29, 789.25),
    (uid, '2026-03-06', h_googl, NULL, 'GOOGL', 36718, 'USD', 36718, 1484.29, 298.52),
    (uid, '2026-03-06', h_meta, NULL, 'META', 27729, 'USD', 27729, 1484.29, 644.86),
    (uid, '2026-03-06', h_msft, NULL, 'MSFT', 0, 'USD', 0, 1484.29, NULL),
    (uid, '2026-03-06', h_panw, NULL, 'PANW', 0, 'USD', 0, 1484.29, NULL),
    (uid, '2026-03-06', h_clrb, NULL, 'CLRB', 4421, 'USD', 4421, 1484.29, 2.76),
    (uid, '2026-03-06', h_usd, NULL, 'CASH_USD', 1169892, 'USD', 1169892, 1484.29, 1),
    (uid, '2026-03-06', h_schwab, NULL, 'SCHWAB2055', 139206, 'USD', 139206, 1484.29, 139206),
    (uid, '2026-03-06', h_krw_hana, NULL, 'CASH_KRW', 472057654, 'KRW', 318036, 1484.29, 1),
    (uid, '2026-03-06', NULL, inv_scalev, 'SCALEV', 358000, 'USD', 358000, 1484.29, 4),
    (uid, '2026-03-06', NULL, inv_scale, 'SCALE', 293250, 'USD', 293250, 1484.29, 6),
    (uid, '2026-03-06', NULL, inv_gold, 'GCW00', 1171025, 'USD', 1171025, 1484.29, 5158.7),
    (uid, '2026-03-06', NULL, inv_silver, 'SIW00', 8431, 'USD', 8431, 1484.29, 84.31),
    (uid, '2026-03-06', NULL, inv_krew, 'Krew Fund', 30000000, 'KRW', 20211.75, 1484.29, NULL),
    (uid, '2026-03-06', NULL, inv_infobank_fund, '인포뱅크-서울바이오허브 메디컬 개인투자조합 2호', 50000000, 'KRW', 33686.25, 1484.29, NULL),
    (uid, '2026-03-06', NULL, inv_mobilix, '모빌릭스', 20000000, 'KRW', 13474.44, 1484.29, 200000),
    (uid, '2026-03-06', NULL, inv_mrmind, '미스터마인드', 40000000, 'KRW', 26948.89, 1484.29, 400000),
    (uid, '2026-03-06', NULL, inv_taeju, '태주', 70000000, 'KRW', 47160.56, 1484.29, 700000),
    (uid, '2026-03-06', NULL, inv_quad, '쿼드', 27000000, 'KRW', 18190.5, 1484.29, 270000),
    (uid, '2026-03-06', NULL, inv_starnex, '스타넥스', 3000000, 'KRW', 2021.17, 1484.29, 30000),
    (uid, '2026-03-06', NULL, inv_gravity, '그래비티랩스', 20000000, 'KRW', 13474.44, 1484.29, 200000);

  -- 2026-03-07
  INSERT INTO snapshots (user_id, date, holding_id, investment_id, ticker, value_native, currency, value_usd, fx_rate, price_per_unit) VALUES
    (uid, '2026-03-07', h_039290, NULL, '039290', 193733711, 'KRW', 130558, 1483.89, 4214.99),
    (uid, '2026-03-07', h_246720, NULL, '246720', 34179922, 'KRW', 23034, 1483.89, 7449.85),
    (uid, '2026-03-07', h_000660, NULL, '000660', 0, 'KRW', 0, 1483.89, NULL),
    (uid, '2026-03-07', h_ceg, NULL, 'CEG', 32299, 'USD', 32299, 1483.89, 322.99),
    (uid, '2026-03-07', h_sgov, NULL, 'SGOV', 329710, 'USD', 329710, 1483.89, 100.46),
    (uid, '2026-03-07', h_tlt, NULL, 'TLT', 397163, 'USD', 397163, 1483.89, 89.23),
    (uid, '2026-03-07', h_krw_sam, NULL, 'CASH_KRW', 1116346770, 'KRW', 752311, 1483.89, 1),
    (uid, '2026-03-07', h_sil, NULL, 'SIL', 54913, 'USD', 54913, 1483.89, 102.45),
    (uid, '2026-03-07', h_shld, NULL, 'SHLD', 68093, 'USD', 68093, 1483.89, 78),
    (uid, '2026-03-07', h_xle, NULL, 'XLE', 64768, 'USD', 64768, 1483.89, 56.32),
    (uid, '2026-03-07', h_soxx, NULL, 'SOXX', 0, 'USD', 0, 1483.89, NULL),
    (uid, '2026-03-07', h_botz, NULL, 'BOTZ', 9492, 'USD', 9492, 1483.89, 36.09),
    (uid, '2026-03-07', h_gev, NULL, 'GEV', 9961, 'USD', 9961, 1483.89, 830.08),
    (uid, '2026-03-07', h_googl, NULL, 'GOOGL', 37682, 'USD', 37682, 1483.89, 306.36),
    (uid, '2026-03-07', h_meta, NULL, 'META', 27838, 'USD', 27838, 1483.89, 647.4),
    (uid, '2026-03-07', h_msft, NULL, 'MSFT', 0, 'USD', 0, 1483.89, NULL),
    (uid, '2026-03-07', h_panw, NULL, 'PANW', 0, 'USD', 0, 1483.89, NULL),
    (uid, '2026-03-07', h_clrb, NULL, 'CLRB', 4405, 'USD', 4405, 1483.89, 2.75),
    (uid, '2026-03-07', h_usd, NULL, 'CASH_USD', 1169892, 'USD', 1169892, 1483.89, 1),
    (uid, '2026-03-07', h_schwab, NULL, 'SCHWAB2055', 139206, 'USD', 139206, 1483.89, 139206),
    (uid, '2026-03-07', h_krw_hana, NULL, 'CASH_KRW', 472058055, 'KRW', 318122, 1483.89, 1),
    (uid, '2026-03-07', NULL, inv_scalev, 'SCALEV', 358000, 'USD', 358000, 1483.89, 4),
    (uid, '2026-03-07', NULL, inv_scale, 'SCALE', 293250, 'USD', 293250, 1483.89, 6),
    (uid, '2026-03-07', NULL, inv_gold, 'GCW00', 1158540, 'USD', 1158540, 1483.89, 5103.7),
    (uid, '2026-03-07', NULL, inv_silver, 'SIW00', 8452, 'USD', 8452, 1483.89, 84.52),
    (uid, '2026-03-07', NULL, inv_krew, 'Krew Fund', 30000000, 'KRW', 20217, 1483.89, NULL),
    (uid, '2026-03-07', NULL, inv_infobank_fund, '인포뱅크-서울바이오허브 메디컬 개인투자조합 2호', 50000000, 'KRW', 33695, 1483.89, NULL),
    (uid, '2026-03-07', NULL, inv_mobilix, '모빌릭스', 20000000, 'KRW', 13478.11, 1483.89, 200000),
    (uid, '2026-03-07', NULL, inv_mrmind, '미스터마인드', 40000000, 'KRW', 26956.22, 1483.89, 400000),
    (uid, '2026-03-07', NULL, inv_taeju, '태주', 70000000, 'KRW', 47173.39, 1483.89, 700000),
    (uid, '2026-03-07', NULL, inv_quad, '쿼드', 27000000, 'KRW', 18195.45, 1483.89, 270000),
    (uid, '2026-03-07', NULL, inv_starnex, '스타넥스', 3000000, 'KRW', 2021.72, 1483.89, 30000),
    (uid, '2026-03-07', NULL, inv_gravity, '그래비티랩스', 20000000, 'KRW', 13478.11, 1483.89, 200000);

  -- 2026-03-08
  INSERT INTO snapshots (user_id, date, holding_id, investment_id, ticker, value_native, currency, value_usd, fx_rate, price_per_unit) VALUES
    (uid, '2026-03-08', h_039290, NULL, '039290', 193733711, 'KRW', 130558, 1483.89, 4214.99),
    (uid, '2026-03-08', h_246720, NULL, '246720', 34179922, 'KRW', 23034, 1483.89, 7449.85),
    (uid, '2026-03-08', h_000660, NULL, '000660', 0, 'KRW', 0, 1483.89, NULL),
    (uid, '2026-03-08', h_ceg, NULL, 'CEG', 32299, 'USD', 32299, 1483.89, 322.99),
    (uid, '2026-03-08', h_sgov, NULL, 'SGOV', 329710, 'USD', 329710, 1483.89, 100.46),
    (uid, '2026-03-08', h_tlt, NULL, 'TLT', 397163, 'USD', 397163, 1483.89, 89.23),
    (uid, '2026-03-08', h_krw_sam, NULL, 'CASH_KRW', 1116346770, 'KRW', 752311, 1483.89, 1),
    (uid, '2026-03-08', h_sil, NULL, 'SIL', 54913, 'USD', 54913, 1483.89, 102.45),
    (uid, '2026-03-08', h_shld, NULL, 'SHLD', 68093, 'USD', 68093, 1483.89, 78),
    (uid, '2026-03-08', h_xle, NULL, 'XLE', 64768, 'USD', 64768, 1483.89, 56.32),
    (uid, '2026-03-08', h_soxx, NULL, 'SOXX', 0, 'USD', 0, 1483.89, NULL),
    (uid, '2026-03-08', h_botz, NULL, 'BOTZ', 9492, 'USD', 9492, 1483.89, 36.09),
    (uid, '2026-03-08', h_gev, NULL, 'GEV', 9961, 'USD', 9961, 1483.89, 830.08),
    (uid, '2026-03-08', h_googl, NULL, 'GOOGL', 37682, 'USD', 37682, 1483.89, 306.36),
    (uid, '2026-03-08', h_meta, NULL, 'META', 27838, 'USD', 27838, 1483.89, 647.4),
    (uid, '2026-03-08', h_msft, NULL, 'MSFT', 0, 'USD', 0, 1483.89, NULL),
    (uid, '2026-03-08', h_panw, NULL, 'PANW', 0, 'USD', 0, 1483.89, NULL),
    (uid, '2026-03-08', h_clrb, NULL, 'CLRB', 4405, 'USD', 4405, 1483.89, 2.75),
    (uid, '2026-03-08', h_usd, NULL, 'CASH_USD', 1169892, 'USD', 1169892, 1483.89, 1),
    (uid, '2026-03-08', h_schwab, NULL, 'SCHWAB2055', 139206, 'USD', 139206, 1483.89, 139206),
    (uid, '2026-03-08', h_krw_hana, NULL, 'CASH_KRW', 472058055, 'KRW', 318122, 1483.89, 1),
    (uid, '2026-03-08', NULL, inv_scalev, 'SCALEV', 358000, 'USD', 358000, 1483.89, 4),
    (uid, '2026-03-08', NULL, inv_scale, 'SCALE', 293250, 'USD', 293250, 1483.89, 6),
    (uid, '2026-03-08', NULL, inv_gold, 'GCW00', 1158540, 'USD', 1158540, 1483.89, 5103.7),
    (uid, '2026-03-08', NULL, inv_silver, 'SIW00', 8452, 'USD', 8452, 1483.89, 84.52),
    (uid, '2026-03-08', NULL, inv_krew, 'Krew Fund', 30000000, 'KRW', 20217, 1483.89, NULL),
    (uid, '2026-03-08', NULL, inv_infobank_fund, '인포뱅크-서울바이오허브 메디컬 개인투자조합 2호', 50000000, 'KRW', 33695, 1483.89, NULL),
    (uid, '2026-03-08', NULL, inv_mobilix, '모빌릭스', 20000000, 'KRW', 13478.11, 1483.89, 200000),
    (uid, '2026-03-08', NULL, inv_mrmind, '미스터마인드', 40000000, 'KRW', 26956.22, 1483.89, 400000),
    (uid, '2026-03-08', NULL, inv_taeju, '태주', 70000000, 'KRW', 47173.39, 1483.89, 700000),
    (uid, '2026-03-08', NULL, inv_quad, '쿼드', 27000000, 'KRW', 18195.45, 1483.89, 270000),
    (uid, '2026-03-08', NULL, inv_starnex, '스타넥스', 3000000, 'KRW', 2021.72, 1483.89, 30000),
    (uid, '2026-03-08', NULL, inv_gravity, '그래비티랩스', 20000000, 'KRW', 13478.11, 1483.89, 200000);

  -- 2026-03-09
  INSERT INTO snapshots (user_id, date, holding_id, investment_id, ticker, value_native, currency, value_usd, fx_rate, price_per_unit) VALUES
    (uid, '2026-03-09', h_039290, NULL, '039290', 193734736, 'KRW', 132290, 1464.47, 4215.02),
    (uid, '2026-03-09', h_246720, NULL, '246720', 34180730, 'KRW', 23340, 1464.47, 7450.03),
    (uid, '2026-03-09', h_000660, NULL, '000660', 0, 'KRW', 0, 1464.47, NULL),
    (uid, '2026-03-09', h_ceg, NULL, 'CEG', 32299, 'USD', 32299, 1464.47, 322.99),
    (uid, '2026-03-09', h_sgov, NULL, 'SGOV', 720801, 'USD', 720801, 1464.47, 100.46),
    (uid, '2026-03-09', h_tlt, NULL, 'TLT', 0, 'USD', 0, 1464.47, NULL),
    (uid, '2026-03-09', h_krw_sam, NULL, 'CASH_KRW', 1115628853, 'KRW', 761797, 1464.47, 1),
    (uid, '2026-03-09', h_sil, NULL, 'SIL', 54913, 'USD', 54913, 1464.47, 102.45),
    (uid, '2026-03-09', h_shld, NULL, 'SHLD', 68093, 'USD', 68093, 1464.47, 78),
    (uid, '2026-03-09', h_xle, NULL, 'XLE', 124524, 'USD', 124524, 1464.47, 56.32),
    (uid, '2026-03-09', h_soxx, NULL, 'SOXX', 0, 'USD', 0, 1464.47, NULL),
    (uid, '2026-03-09', h_botz, NULL, 'BOTZ', 9492, 'USD', 9492, 1464.47, 36.09),
    (uid, '2026-03-09', h_gev, NULL, 'GEV', 9961, 'USD', 9961, 1464.47, 830.08),
    (uid, '2026-03-09', h_googl, NULL, 'GOOGL', 37682, 'USD', 37682, 1464.47, 306.36),
    (uid, '2026-03-09', h_meta, NULL, 'META', 27838, 'USD', 27838, 1464.47, 647.4),
    (uid, '2026-03-09', h_msft, NULL, 'MSFT', 0, 'USD', 0, 1464.47, NULL),
    (uid, '2026-03-09', h_panw, NULL, 'PANW', 0, 'USD', 0, 1464.47, NULL),
    (uid, '2026-03-09', h_clrb, NULL, 'CLRB', 4405, 'USD', 4405, 1464.47, 2.75),
    (uid, '2026-03-09', h_usd, NULL, 'CASH_USD', 1109958, 'USD', 1109958, 1464.47, 1),
    (uid, '2026-03-09', h_schwab, NULL, 'SCHWAB2055', 139206, 'USD', 139206, 1464.47, 139206),
    (uid, '2026-03-09', h_krw_hana, NULL, 'CASH_KRW', 472057260, 'KRW', 322340, 1464.47, 1),
    (uid, '2026-03-09', NULL, inv_scalev, 'SCALEV', 358000, 'USD', 358000, 1464.47, 4),
    (uid, '2026-03-09', NULL, inv_scale, 'SCALE', 293250, 'USD', 293250, 1464.47, 6),
    (uid, '2026-03-09', NULL, inv_gold, 'GCW00', 1158540, 'USD', 1158540, 1464.47, 5103.7),
    (uid, '2026-03-09', NULL, inv_silver, 'SIW00', 8452, 'USD', 8452, 1464.47, 84.52),
    (uid, '2026-03-09', NULL, inv_krew, 'Krew Fund', 30000000, 'KRW', 20485.13, 1464.47, NULL),
    (uid, '2026-03-09', NULL, inv_infobank_fund, '인포뱅크-서울바이오허브 메디컬 개인투자조합 2호', 50000000, 'KRW', 34141.88, 1464.47, NULL),
    (uid, '2026-03-09', NULL, inv_mobilix, '모빌릭스', 20000000, 'KRW', 13656.78, 1464.47, 200000),
    (uid, '2026-03-09', NULL, inv_mrmind, '미스터마인드', 40000000, 'KRW', 27313.56, 1464.47, 400000),
    (uid, '2026-03-09', NULL, inv_taeju, '태주', 70000000, 'KRW', 47798.72, 1464.47, 700000),
    (uid, '2026-03-09', NULL, inv_quad, '쿼드', 27000000, 'KRW', 18436.65, 1464.47, 270000),
    (uid, '2026-03-09', NULL, inv_starnex, '스타넥스', 3000000, 'KRW', 2048.52, 1464.47, 30000),
    (uid, '2026-03-09', NULL, inv_gravity, '그래비티랩스', 20000000, 'KRW', 13656.78, 1464.47, 200000);

  -- 2026-03-10
  INSERT INTO snapshots (user_id, date, holding_id, investment_id, ticker, value_native, currency, value_usd, fx_rate, price_per_unit) VALUES
    (uid, '2026-03-10', h_039290, NULL, '039290', 200857736, 'KRW', 136380, 1472.78, 4369.99),
    (uid, '2026-03-10', h_246720, NULL, '246720', 33722244, 'KRW', 22897, 1472.78, 7350.1),
    (uid, '2026-03-10', h_000660, NULL, '000660', 0, 'KRW', 0, 1472.78, NULL),
    (uid, '2026-03-10', h_ceg, NULL, 'CEG', 31709, 'USD', 31709, 1472.78, 317.09),
    (uid, '2026-03-10', h_sgov, NULL, 'SGOV', 720801, 'USD', 720801, 1472.78, 100.46),
    (uid, '2026-03-10', h_tlt, NULL, 'TLT', 0, 'USD', 0, 1472.78, NULL),
    (uid, '2026-03-10', h_krw_sam, NULL, 'CASH_KRW', 1115627904, 'KRW', 757498, 1472.78, 1),
    (uid, '2026-03-10', h_sil, NULL, 'SIL', 56334, 'USD', 56334, 1472.78, 105.1),
    (uid, '2026-03-10', h_shld, NULL, 'SHLD', 67080, 'USD', 67080, 1472.78, 76.84),
    (uid, '2026-03-10', h_xle, NULL, 'XLE', 122932, 'USD', 122932, 1472.78, 55.6),
    (uid, '2026-03-10', h_soxx, NULL, 'SOXX', 0, 'USD', 0, 1472.78, NULL),
    (uid, '2026-03-10', h_botz, NULL, 'BOTZ', 9542, 'USD', 9542, 1472.78, 36.28),
    (uid, '2026-03-10', h_gev, NULL, 'GEV', 10070, 'USD', 10070, 1472.78, 839.17),
    (uid, '2026-03-10', h_googl, NULL, 'GOOGL', 37766, 'USD', 37766, 1472.78, 307.04),
    (uid, '2026-03-10', h_meta, NULL, 'META', 28125, 'USD', 28125, 1472.78, 654.07),
    (uid, '2026-03-10', h_msft, NULL, 'MSFT', 0, 'USD', 0, 1472.78, NULL),
    (uid, '2026-03-10', h_panw, NULL, 'PANW', 0, 'USD', 0, 1472.78, NULL),
    (uid, '2026-03-10', h_clrb, NULL, 'CLRB', 4885, 'USD', 4885, 1472.78, 3.05),
    (uid, '2026-03-10', h_usd, NULL, 'CASH_USD', 1109958, 'USD', 1109958, 1472.78, 1),
    (uid, '2026-03-10', h_schwab, NULL, 'SCHWAB2055', 141094, 'USD', 141094, 1472.78, 141094),
    (uid, '2026-03-10', h_krw_hana, NULL, 'CASH_KRW', 472058391, 'KRW', 320522, 1472.78, 1),
    (uid, '2026-03-10', NULL, inv_scalev, 'SCALEV', 361852, 'USD', 361852, 1472.78, 4),
    (uid, '2026-03-10', NULL, inv_scale, 'SCALE', 293250, 'USD', 293250, 1472.78, 6),
    (uid, '2026-03-10', NULL, inv_gold, 'GCW00', 1189957, 'USD', 1189957, 1472.78, 5242.1),
    (uid, '2026-03-10', NULL, inv_silver, 'SIW00', 8959, 'USD', 8959, 1472.78, 89.59),
    (uid, '2026-03-10', NULL, inv_krew, 'Krew Fund', 30000000, 'KRW', 20369.63, 1472.78, NULL),
    (uid, '2026-03-10', NULL, inv_infobank_fund, '인포뱅크-서울바이오허브 메디컬 개인투자조합 2호', 50000000, 'KRW', 33949.38, 1472.78, NULL),
    (uid, '2026-03-10', NULL, inv_mobilix, '모빌릭스', 20000000, 'KRW', 13579.78, 1472.78, 200000),
    (uid, '2026-03-10', NULL, inv_mrmind, '미스터마인드', 40000000, 'KRW', 27159.56, 1472.78, 400000),
    (uid, '2026-03-10', NULL, inv_taeju, '태주', 70000000, 'KRW', 47529.22, 1472.78, 700000),
    (uid, '2026-03-10', NULL, inv_quad, '쿼드', 27000000, 'KRW', 18332.7, 1472.78, 270000),
    (uid, '2026-03-10', NULL, inv_starnex, '스타넥스', 3000000, 'KRW', 2036.97, 1472.78, 30000),
    (uid, '2026-03-10', NULL, inv_gravity, '그래비티랩스', 20000000, 'KRW', 13579.78, 1472.78, 200000);

  -- 2026-03-11
  INSERT INTO snapshots (user_id, date, holding_id, investment_id, ticker, value_native, currency, value_usd, fx_rate, price_per_unit) VALUES
    (uid, '2026-03-11', h_039290, NULL, '039290', 206603663, 'KRW', 140038, 1475.34, 4495),
    (uid, '2026-03-11', h_246720, NULL, '246720', 33308751, 'KRW', 22577, 1475.34, 7259.97),
    (uid, '2026-03-11', h_000660, NULL, '000660', 0, 'KRW', 0, 1475.34, NULL),
    (uid, '2026-03-11', h_ceg, NULL, 'CEG', 30069, 'USD', 30069, 1475.34, 300.69),
    (uid, '2026-03-11', h_sgov, NULL, 'SGOV', 720944, 'USD', 720944, 1475.34, 100.48),
    (uid, '2026-03-11', h_tlt, NULL, 'TLT', 0, 'USD', 0, 1475.34, NULL),
    (uid, '2026-03-11', h_krw_sam, NULL, 'CASH_KRW', 1115731776, 'KRW', 756254, 1475.34, 1),
    (uid, '2026-03-11', h_sil, NULL, 'SIL', 116143, 'USD', 116143, 1475.34, 102.6),
    (uid, '2026-03-11', h_shld, NULL, 'SHLD', 125865, 'USD', 125865, 1475.34, 75.64),
    (uid, '2026-03-11', h_xle, NULL, 'XLE', 125983, 'USD', 125983, 1475.34, 56.98),
    (uid, '2026-03-11', h_soxx, NULL, 'SOXX', 0, 'USD', 0, 1475.34, NULL),
    (uid, '2026-03-11', h_botz, NULL, 'BOTZ', 9547, 'USD', 9547, 1475.34, 36.3),
    (uid, '2026-03-11', h_gev, NULL, 'GEV', 10172, 'USD', 10172, 1475.34, 847.67),
    (uid, '2026-03-11', h_googl, NULL, 'GOOGL', 37970, 'USD', 37970, 1475.34, 308.7),
    (uid, '2026-03-11', h_meta, NULL, 'META', 28159, 'USD', 28159, 1475.34, 654.86),
    (uid, '2026-03-11', h_msft, NULL, 'MSFT', 0, 'USD', 0, 1475.34, NULL),
    (uid, '2026-03-11', h_panw, NULL, 'PANW', 0, 'USD', 0, 1475.34, NULL),
    (uid, '2026-03-11', h_clrb, NULL, 'CLRB', 4741, 'USD', 4741, 1475.34, 2.96),
    (uid, '2026-03-11', h_usd, NULL, 'CASH_USD', 989852, 'USD', 989852, 1475.34, 1),
    (uid, '2026-03-11', h_schwab, NULL, 'SCHWAB2055', 141094, 'USD', 141094, 1475.34, 141094),
    (uid, '2026-03-11', h_krw_hana, NULL, 'CASH_KRW', 472057163, 'KRW', 319965, 1475.34, 1),
    (uid, '2026-03-11', NULL, inv_scalev, 'SCALEV', 361852, 'USD', 361852, 1475.34, 4),
    (uid, '2026-03-11', NULL, inv_scale, 'SCALE', 293250, 'USD', 293250, 1475.34, 6),
    (uid, '2026-03-11', NULL, inv_gold, 'GCW00', 1175656, 'USD', 1175656, 1475.34, 5179.1),
    (uid, '2026-03-11', NULL, inv_silver, 'SIW00', 8554, 'USD', 8554, 1475.34, 85.54),
    (uid, '2026-03-11', NULL, inv_krew, 'Krew Fund', 30000000, 'KRW', 20334.38, 1475.34, NULL),
    (uid, '2026-03-11', NULL, inv_infobank_fund, '인포뱅크-서울바이오허브 메디컬 개인투자조합 2호', 50000000, 'KRW', 33890.63, 1475.34, NULL),
    (uid, '2026-03-11', NULL, inv_mobilix, '모빌릭스', 20000000, 'KRW', 13556.22, 1475.34, 200000),
    (uid, '2026-03-11', NULL, inv_mrmind, '미스터마인드', 40000000, 'KRW', 27112.44, 1475.34, 400000),
    (uid, '2026-03-11', NULL, inv_taeju, '태주', 70000000, 'KRW', 47446.78, 1475.34, 700000),
    (uid, '2026-03-11', NULL, inv_quad, '쿼드', 27000000, 'KRW', 18300.9, 1475.34, 270000),
    (uid, '2026-03-11', NULL, inv_starnex, '스타넥스', 3000000, 'KRW', 2033.43, 1475.34, 30000),
    (uid, '2026-03-11', NULL, inv_gravity, '그래비티랩스', 20000000, 'KRW', 13556.22, 1475.34, 200000);

  -- 2026-03-12
  INSERT INTO snapshots (user_id, date, holding_id, investment_id, ticker, value_native, currency, value_usd, fx_rate, price_per_unit) VALUES
    (uid, '2026-03-12', h_039290, NULL, '039290', 208672361, 'KRW', 141898, 1470.58, 4540.01),
    (uid, '2026-03-12', h_246720, NULL, '246720', 33401284, 'KRW', 22713, 1470.58, 7280.14),
    (uid, '2026-03-12', h_000660, NULL, '000660', 0, 'KRW', 0, 1470.58, NULL),
    (uid, '2026-03-12', h_ceg, NULL, 'CEG', 30155, 'USD', 30155, 1470.58, 301.55),
    (uid, '2026-03-12', h_sgov, NULL, 'SGOV', 721016, 'USD', 721016, 1470.58, 100.49),
    (uid, '2026-03-12', h_tlt, NULL, 'TLT', 0, 'USD', 0, 1470.58, NULL),
    (uid, '2026-03-12', h_krw_sam, NULL, 'CASH_KRW', 1115731987, 'KRW', 758702, 1470.58, 1),
    (uid, '2026-03-12', h_sil, NULL, 'SIL', 112951, 'USD', 112951, 1470.58, 99.78),
    (uid, '2026-03-12', h_shld, NULL, 'SHLD', 126464, 'USD', 126464, 1470.58, 76),
    (uid, '2026-03-12', h_xle, NULL, 'XLE', 127155, 'USD', 127155, 1470.58, 57.51),
    (uid, '2026-03-12', h_soxx, NULL, 'SOXX', 0, 'USD', 0, 1470.58, NULL),
    (uid, '2026-03-12', h_botz, NULL, 'BOTZ', 9360, 'USD', 9360, 1470.58, 35.59),
    (uid, '2026-03-12', h_gev, NULL, 'GEV', 9985, 'USD', 9985, 1470.58, 832.08),
    (uid, '2026-03-12', h_googl, NULL, 'GOOGL', 37337, 'USD', 37337, 1470.58, 303.55),
    (uid, '2026-03-12', h_meta, NULL, 'META', 27442, 'USD', 27442, 1470.58, 638.19),
    (uid, '2026-03-12', h_msft, NULL, 'MSFT', 0, 'USD', 0, 1470.58, NULL),
    (uid, '2026-03-12', h_panw, NULL, 'PANW', 0, 'USD', 0, 1470.58, NULL),
    (uid, '2026-03-12', h_clrb, NULL, 'CLRB', 5173, 'USD', 5173, 1470.58, 3.23),
    (uid, '2026-03-12', h_usd, NULL, 'CASH_USD', 989852, 'USD', 989852, 1470.58, 1),
    (uid, '2026-03-12', h_schwab, NULL, 'SCHWAB2055', 141094, 'USD', 141094, 1470.58, 141094),
    (uid, '2026-03-12', h_krw_hana, NULL, 'CASH_KRW', 472057651, 'KRW', 321001, 1470.58, 1),
    (uid, '2026-03-12', NULL, inv_scalev, 'SCALEV', 361852, 'USD', 361852, 1470.58, 4),
    (uid, '2026-03-12', NULL, inv_scale, 'SCALE', 293250, 'USD', 293250, 1470.58, 6),
    (uid, '2026-03-12', NULL, inv_gold, 'GCW00', 1163557, 'USD', 1163557, 1470.58, 5125.8),
    (uid, '2026-03-12', NULL, inv_silver, 'SIW00', 8511, 'USD', 8511, 1470.58, 85.11),
    (uid, '2026-03-12', NULL, inv_krew, 'Krew Fund', 30000000, 'KRW', 20400, 1470.58, NULL),
    (uid, '2026-03-12', NULL, inv_infobank_fund, '인포뱅크-서울바이오허브 메디컬 개인투자조합 2호', 50000000, 'KRW', 34000, 1470.58, NULL),
    (uid, '2026-03-12', NULL, inv_mobilix, '모빌릭스', 20000000, 'KRW', 13600.11, 1470.58, 200000),
    (uid, '2026-03-12', NULL, inv_mrmind, '미스터마인드', 40000000, 'KRW', 27200.22, 1470.58, 400000),
    (uid, '2026-03-12', NULL, inv_taeju, '태주', 70000000, 'KRW', 47600.39, 1470.58, 700000),
    (uid, '2026-03-12', NULL, inv_quad, '쿼드', 27000000, 'KRW', 18360.15, 1470.58, 270000),
    (uid, '2026-03-12', NULL, inv_starnex, '스타넥스', 3000000, 'KRW', 2040.02, 1470.58, 30000),
    (uid, '2026-03-12', NULL, inv_gravity, '그래비티랩스', 20000000, 'KRW', 13600.11, 1470.58, 200000);

  -- 2026-03-13
  INSERT INTO snapshots (user_id, date, holding_id, investment_id, ticker, value_native, currency, value_usd, fx_rate, price_per_unit) VALUES
    (uid, '2026-03-13', h_039290, NULL, '039290', 214647406, 'KRW', 142922, 1501.85, 4670),
    (uid, '2026-03-13', h_246720, NULL, '246720', 34088991, 'KRW', 22698, 1501.85, 7430.03),
    (uid, '2026-03-13', h_000660, NULL, '000660', 0, 'KRW', 0, 1501.85, NULL),
    (uid, '2026-03-13', h_ceg, NULL, 'CEG', 30177, 'USD', 30177, 1501.85, 301.77),
    (uid, '2026-03-13', h_sgov, NULL, 'SGOV', 721231, 'USD', 721231, 1501.85, 100.52),
    (uid, '2026-03-13', h_tlt, NULL, 'TLT', 0, 'USD', 0, 1501.85, NULL),
    (uid, '2026-03-13', h_krw_sam, NULL, 'CASH_KRW', 1115731874, 'KRW', 742905, 1501.85, 1),
    (uid, '2026-03-13', h_sil, NULL, 'SIL', 106748, 'USD', 106748, 1501.85, 94.3),
    (uid, '2026-03-13', h_shld, NULL, 'SHLD', 125815, 'USD', 125815, 1501.85, 75.61),
    (uid, '2026-03-13', h_xle, NULL, 'XLE', 127575, 'USD', 127575, 1501.85, 57.7),
    (uid, '2026-03-13', h_soxx, NULL, 'SOXX', 0, 'USD', 0, 1501.85, NULL),
    (uid, '2026-03-13', h_botz, NULL, 'BOTZ', 9160, 'USD', 9160, 1501.85, 34.83),
    (uid, '2026-03-13', h_gev, NULL, 'GEV', 9660, 'USD', 9660, 1501.85, 805),
    (uid, '2026-03-13', h_googl, NULL, 'GOOGL', 37180, 'USD', 37180, 1501.85, 302.28),
    (uid, '2026-03-13', h_meta, NULL, 'META', 26390, 'USD', 26390, 1501.85, 613.72),
    (uid, '2026-03-13', h_msft, NULL, 'MSFT', 0, 'USD', 0, 1501.85, NULL),
    (uid, '2026-03-13', h_panw, NULL, 'PANW', 0, 'USD', 0, 1501.85, NULL),
    (uid, '2026-03-13', h_clrb, NULL, 'CLRB', 5125, 'USD', 5125, 1501.85, 3.2),
    (uid, '2026-03-13', h_usd, NULL, 'CASH_USD', 989852, 'USD', 989852, 1501.85, 1),
    (uid, '2026-03-13', h_schwab, NULL, 'SCHWAB2055', 141094, 'USD', 141094, 1501.85, 141094),
    (uid, '2026-03-13', h_krw_hana, NULL, 'CASH_KRW', 472056986, 'KRW', 314317, 1501.85, 1),
    (uid, '2026-03-13', NULL, inv_scalev, 'SCALEV', 361852, 'USD', 361852, 1501.85, 4),
    (uid, '2026-03-13', NULL, inv_scale, 'SCALE', 293250, 'USD', 293250, 1501.85, 6),
    (uid, '2026-03-13', NULL, inv_gold, 'GCW00', 1149006, 'USD', 1149006, 1501.85, 5061.7),
    (uid, '2026-03-13', NULL, inv_silver, 'SIW00', 8134, 'USD', 8134, 1501.85, 81.34),
    (uid, '2026-03-13', NULL, inv_krew, 'Krew Fund', 30000000, 'KRW', 19975.5, 1501.85, NULL),
    (uid, '2026-03-13', NULL, inv_infobank_fund, '인포뱅크-서울바이오허브 메디컬 개인투자조합 2호', 50000000, 'KRW', 33292.5, 1501.85, NULL),
    (uid, '2026-03-13', NULL, inv_mobilix, '모빌릭스', 20000000, 'KRW', 13316.89, 1501.85, 200000),
    (uid, '2026-03-13', NULL, inv_mrmind, '미스터마인드', 40000000, 'KRW', 26633.78, 1501.85, 400000),
    (uid, '2026-03-13', NULL, inv_taeju, '태주', 70000000, 'KRW', 46609.11, 1501.85, 700000),
    (uid, '2026-03-13', NULL, inv_quad, '쿼드', 27000000, 'KRW', 17977.8, 1501.85, 270000),
    (uid, '2026-03-13', NULL, inv_starnex, '스타넥스', 3000000, 'KRW', 1997.53, 1501.85, 30000),
    (uid, '2026-03-13', NULL, inv_gravity, '그래비티랩스', 20000000, 'KRW', 13316.89, 1501.85, 200000);

  -- 2026-03-14
  INSERT INTO snapshots (user_id, date, holding_id, investment_id, ticker, value_native, currency, value_usd, fx_rate, price_per_unit) VALUES
    (uid, '2026-03-14', h_039290, NULL, '039290', 210281042, 'KRW', 140024, 1501.75, 4575.01),
    (uid, '2026-03-14', h_246720, NULL, '246720', 33538583, 'KRW', 22333, 1501.75, 7310.07),
    (uid, '2026-03-14', h_000660, NULL, '000660', 0, 'KRW', 0, 1501.75, NULL),
    (uid, '2026-03-14', h_ceg, NULL, 'CEG', 30558, 'USD', 30558, 1501.75, 305.58),
    (uid, '2026-03-14', h_sgov, NULL, 'SGOV', 721231, 'USD', 721231, 1501.75, 100.52),
    (uid, '2026-03-14', h_tlt, NULL, 'TLT', 0, 'USD', 0, 1501.75, NULL),
    (uid, '2026-03-14', h_krw_sam, NULL, 'CASH_KRW', 1115731170, 'KRW', 742954, 1501.75, 1),
    (uid, '2026-03-14', h_sil, NULL, 'SIL', 107732, 'USD', 107732, 1501.75, 95.17),
    (uid, '2026-03-14', h_shld, NULL, 'SHLD', 127562, 'USD', 127562, 1501.75, 76.66),
    (uid, '2026-03-14', h_xle, NULL, 'XLE', 128017, 'USD', 128017, 1501.75, 57.9),
    (uid, '2026-03-14', h_soxx, NULL, 'SOXX', 0, 'USD', 0, 1501.75, NULL),
    (uid, '2026-03-14', h_botz, NULL, 'BOTZ', 9308, 'USD', 9308, 1501.75, 35.39),
    (uid, '2026-03-14', h_gev, NULL, 'GEV', 9928, 'USD', 9928, 1501.75, 827.33),
    (uid, '2026-03-14', h_googl, NULL, 'GOOGL', 37584, 'USD', 37584, 1501.75, 305.56),
    (uid, '2026-03-14', h_meta, NULL, 'META', 26980, 'USD', 26980, 1501.75, 627.44),
    (uid, '2026-03-14', h_msft, NULL, 'MSFT', 0, 'USD', 0, 1501.75, NULL),
    (uid, '2026-03-14', h_panw, NULL, 'PANW', 0, 'USD', 0, 1501.75, NULL),
    (uid, '2026-03-14', h_clrb, NULL, 'CLRB', 5237, 'USD', 5237, 1501.75, 3.27),
    (uid, '2026-03-14', h_usd, NULL, 'CASH_USD', 989852, 'USD', 989852, 1501.75, 1),
    (uid, '2026-03-14', h_schwab, NULL, 'SCHWAB2055', 141094, 'USD', 141094, 1501.75, 141094),
    (uid, '2026-03-14', h_krw_hana, NULL, 'CASH_KRW', 472057092, 'KRW', 314338, 1501.75, 1),
    (uid, '2026-03-14', NULL, inv_scalev, 'SCALEV', 361852, 'USD', 361852, 1501.75, 4),
    (uid, '2026-03-14', NULL, inv_scale, 'SCALE', 293250, 'USD', 293250, 1501.75, 6),
    (uid, '2026-03-14', NULL, inv_gold, 'GCW00', 1135499, 'USD', 1135499, 1501.75, 5002.2),
    (uid, '2026-03-14', NULL, inv_silver, 'SIW00', 8068, 'USD', 8068, 1501.75, 80.68),
    (uid, '2026-03-14', NULL, inv_krew, 'Krew Fund', 30000000, 'KRW', 19976.63, 1501.75, NULL),
    (uid, '2026-03-14', NULL, inv_infobank_fund, '인포뱅크-서울바이오허브 메디컬 개인투자조합 2호', 50000000, 'KRW', 33294.38, 1501.75, NULL),
    (uid, '2026-03-14', NULL, inv_mobilix, '모빌릭스', 20000000, 'KRW', 13317.78, 1501.75, 200000),
    (uid, '2026-03-14', NULL, inv_mrmind, '미스터마인드', 40000000, 'KRW', 26635.56, 1501.75, 400000),
    (uid, '2026-03-14', NULL, inv_taeju, '태주', 70000000, 'KRW', 46612.22, 1501.75, 700000),
    (uid, '2026-03-14', NULL, inv_quad, '쿼드', 27000000, 'KRW', 17979, 1501.75, 270000),
    (uid, '2026-03-14', NULL, inv_starnex, '스타넥스', 3000000, 'KRW', 1997.67, 1501.75, 30000),
    (uid, '2026-03-14', NULL, inv_gravity, '그래비티랩스', 20000000, 'KRW', 13317.78, 1501.75, 200000);

  -- 2026-03-15
  INSERT INTO snapshots (user_id, date, holding_id, investment_id, ticker, value_native, currency, value_usd, fx_rate, price_per_unit) VALUES
    (uid, '2026-03-15', h_039290, NULL, '039290', 210281042, 'KRW', 140024, 1501.75, 4575.01),
    (uid, '2026-03-15', h_246720, NULL, '246720', 33538583, 'KRW', 22333, 1501.75, 7310.07),
    (uid, '2026-03-15', h_000660, NULL, '000660', 0, 'KRW', 0, 1501.75, NULL),
    (uid, '2026-03-15', h_ceg, NULL, 'CEG', 30558, 'USD', 30558, 1501.75, 305.58),
    (uid, '2026-03-15', h_sgov, NULL, 'SGOV', 721231, 'USD', 721231, 1501.75, 100.52),
    (uid, '2026-03-15', h_tlt, NULL, 'TLT', 0, 'USD', 0, 1501.75, NULL),
    (uid, '2026-03-15', h_krw_sam, NULL, 'CASH_KRW', 1115731170, 'KRW', 742954, 1501.75, 1),
    (uid, '2026-03-15', h_sil, NULL, 'SIL', 107732, 'USD', 107732, 1501.75, 95.17),
    (uid, '2026-03-15', h_shld, NULL, 'SHLD', 127562, 'USD', 127562, 1501.75, 76.66),
    (uid, '2026-03-15', h_xle, NULL, 'XLE', 128017, 'USD', 128017, 1501.75, 57.9),
    (uid, '2026-03-15', h_soxx, NULL, 'SOXX', 0, 'USD', 0, 1501.75, NULL),
    (uid, '2026-03-15', h_botz, NULL, 'BOTZ', 9308, 'USD', 9308, 1501.75, 35.39),
    (uid, '2026-03-15', h_gev, NULL, 'GEV', 9928, 'USD', 9928, 1501.75, 827.33),
    (uid, '2026-03-15', h_googl, NULL, 'GOOGL', 37584, 'USD', 37584, 1501.75, 305.56),
    (uid, '2026-03-15', h_meta, NULL, 'META', 26980, 'USD', 26980, 1501.75, 627.44),
    (uid, '2026-03-15', h_msft, NULL, 'MSFT', 0, 'USD', 0, 1501.75, NULL),
    (uid, '2026-03-15', h_panw, NULL, 'PANW', 0, 'USD', 0, 1501.75, NULL),
    (uid, '2026-03-15', h_clrb, NULL, 'CLRB', 5237, 'USD', 5237, 1501.75, 3.27),
    (uid, '2026-03-15', h_usd, NULL, 'CASH_USD', 989852, 'USD', 989852, 1501.75, 1),
    (uid, '2026-03-15', h_schwab, NULL, 'SCHWAB2055', 141094, 'USD', 141094, 1501.75, 141094),
    (uid, '2026-03-15', h_krw_hana, NULL, 'CASH_KRW', 472057092, 'KRW', 314338, 1501.75, 1),
    (uid, '2026-03-15', NULL, inv_scalev, 'SCALEV', 361852, 'USD', 361852, 1501.75, 4),
    (uid, '2026-03-15', NULL, inv_scale, 'SCALE', 293250, 'USD', 293250, 1501.75, 6),
    (uid, '2026-03-15', NULL, inv_gold, 'GCW00', 1135499, 'USD', 1135499, 1501.75, 5002.2),
    (uid, '2026-03-15', NULL, inv_silver, 'SIW00', 8068, 'USD', 8068, 1501.75, 80.68),
    (uid, '2026-03-15', NULL, inv_krew, 'Krew Fund', 30000000, 'KRW', 19976.63, 1501.75, NULL),
    (uid, '2026-03-15', NULL, inv_infobank_fund, '인포뱅크-서울바이오허브 메디컬 개인투자조합 2호', 50000000, 'KRW', 33294.38, 1501.75, NULL),
    (uid, '2026-03-15', NULL, inv_mobilix, '모빌릭스', 20000000, 'KRW', 13317.78, 1501.75, 200000),
    (uid, '2026-03-15', NULL, inv_mrmind, '미스터마인드', 40000000, 'KRW', 26635.56, 1501.75, 400000),
    (uid, '2026-03-15', NULL, inv_taeju, '태주', 70000000, 'KRW', 46612.22, 1501.75, 700000),
    (uid, '2026-03-15', NULL, inv_quad, '쿼드', 27000000, 'KRW', 17979, 1501.75, 270000),
    (uid, '2026-03-15', NULL, inv_starnex, '스타넥스', 3000000, 'KRW', 1997.67, 1501.75, 30000),
    (uid, '2026-03-15', NULL, inv_gravity, '그래비티랩스', 20000000, 'KRW', 13317.78, 1501.75, 200000);

  -- 2026-03-16
  INSERT INTO snapshots (user_id, date, holding_id, investment_id, ticker, value_native, currency, value_usd, fx_rate, price_per_unit) VALUES
    (uid, '2026-03-16', h_039290, NULL, '039290', 210280248, 'KRW', 141231, 1488.91, 4574.99),
    (uid, '2026-03-16', h_246720, NULL, '246720', 33537698, 'KRW', 22525, 1488.91, 7309.87),
    (uid, '2026-03-16', h_000660, NULL, '000660', 0, 'KRW', 0, 1488.91, NULL),
    (uid, '2026-03-16', h_ceg, NULL, 'CEG', 30558, 'USD', 30558, 1488.91, 305.58),
    (uid, '2026-03-16', h_sgov, NULL, 'SGOV', 721231, 'USD', 721231, 1488.91, 100.52),
    (uid, '2026-03-16', h_tlt, NULL, 'TLT', 0, 'USD', 0, 1488.91, NULL),
    (uid, '2026-03-16', h_krw_sam, NULL, 'CASH_KRW', 1115731087, 'KRW', 749361, 1488.91, 1),
    (uid, '2026-03-16', h_sil, NULL, 'SIL', 107732, 'USD', 107732, 1488.91, 95.17),
    (uid, '2026-03-16', h_shld, NULL, 'SHLD', 127562, 'USD', 127562, 1488.91, 76.66),
    (uid, '2026-03-16', h_xle, NULL, 'XLE', 128017, 'USD', 128017, 1488.91, 57.9),
    (uid, '2026-03-16', h_soxx, NULL, 'SOXX', 0, 'USD', 0, 1488.91, NULL),
    (uid, '2026-03-16', h_botz, NULL, 'BOTZ', 9308, 'USD', 9308, 1488.91, 35.39),
    (uid, '2026-03-16', h_gev, NULL, 'GEV', 9928, 'USD', 9928, 1488.91, 827.33),
    (uid, '2026-03-16', h_googl, NULL, 'GOOGL', 37584, 'USD', 37584, 1488.91, 305.56),
    (uid, '2026-03-16', h_meta, NULL, 'META', 26980, 'USD', 26980, 1488.91, 627.44),
    (uid, '2026-03-16', h_msft, NULL, 'MSFT', 0, 'USD', 0, 1488.91, NULL),
    (uid, '2026-03-16', h_panw, NULL, 'PANW', 0, 'USD', 0, 1488.91, NULL),
    (uid, '2026-03-16', h_clrb, NULL, 'CLRB', 5237, 'USD', 5237, 1488.91, 3.27),
    (uid, '2026-03-16', h_usd, NULL, 'CASH_USD', 989852, 'USD', 989852, 1488.91, 1),
    (uid, '2026-03-16', h_schwab, NULL, 'SCHWAB2055', 141094, 'USD', 141094, 1488.91, 141094),
    (uid, '2026-03-16', h_krw_hana, NULL, 'CASH_KRW', 472057427, 'KRW', 317049, 1488.91, 1),
    (uid, '2026-03-16', NULL, inv_scalev, 'SCALEV', 361852, 'USD', 361852, 1488.91, 4),
    (uid, '2026-03-16', NULL, inv_scale, 'SCALE', 293250, 'USD', 293250, 1488.91, 6),
    (uid, '2026-03-16', NULL, inv_gold, 'GCW00', 1135499, 'USD', 1135499, 1488.91, 5002.2),
    (uid, '2026-03-16', NULL, inv_silver, 'SIW00', 8068, 'USD', 8068, 1488.91, 80.68),
    (uid, '2026-03-16', NULL, inv_krew, 'Krew Fund', 30000000, 'KRW', 20149.13, 1488.91, NULL),
    (uid, '2026-03-16', NULL, inv_infobank_fund, '인포뱅크-서울바이오허브 메디컬 개인투자조합 2호', 50000000, 'KRW', 33581.88, 1488.91, NULL),
    (uid, '2026-03-16', NULL, inv_mobilix, '모빌릭스', 20000000, 'KRW', 13432.67, 1488.91, 200000),
    (uid, '2026-03-16', NULL, inv_mrmind, '미스터마인드', 40000000, 'KRW', 26865.33, 1488.91, 400000),
    (uid, '2026-03-16', NULL, inv_taeju, '태주', 70000000, 'KRW', 47014.33, 1488.91, 700000),
    (uid, '2026-03-16', NULL, inv_quad, '쿼드', 27000000, 'KRW', 18134.1, 1488.91, 270000),
    (uid, '2026-03-16', NULL, inv_starnex, '스타넥스', 3000000, 'KRW', 2014.9, 1488.91, 30000),
    (uid, '2026-03-16', NULL, inv_gravity, '그래비티랩스', 20000000, 'KRW', 13432.67, 1488.91, 200000);

  -- 2026-03-17
  INSERT INTO snapshots (user_id, date, holding_id, investment_id, ticker, value_native, currency, value_usd, fx_rate, price_per_unit) VALUES
    (uid, '2026-03-17', h_039290, NULL, '039290', 209132061, 'KRW', 140842, 1484.87, 4550.01),
    (uid, '2026-03-17', h_246720, NULL, '246720', 33629336, 'KRW', 22648, 1484.87, 7329.85),
    (uid, '2026-03-17', h_000660, NULL, '000660', 0, 'KRW', 0, 1484.87, NULL),
    (uid, '2026-03-17', h_ceg, NULL, 'CEG', 30769, 'USD', 30769, 1484.87, 307.69),
    (uid, '2026-03-17', h_sgov, NULL, 'SGOV', 721375, 'USD', 721375, 1484.87, 100.54),
    (uid, '2026-03-17', h_tlt, NULL, 'TLT', 0, 'USD', 0, 1484.87, NULL),
    (uid, '2026-03-17', h_krw_sam, NULL, 'CASH_KRW', 1115731318, 'KRW', 751400, 1484.87, 1),
    (uid, '2026-03-17', h_sil, NULL, 'SIL', 106646, 'USD', 106646, 1484.87, 94.21),
    (uid, '2026-03-17', h_shld, NULL, 'SHLD', 128012, 'USD', 128012, 1484.87, 76.93),
    (uid, '2026-03-17', h_xle, NULL, 'XLE', 129366, 'USD', 129366, 1484.87, 58.51),
    (uid, '2026-03-17', h_soxx, NULL, 'SOXX', 0, 'USD', 0, 1484.87, NULL),
    (uid, '2026-03-17', h_botz, NULL, 'BOTZ', 9305, 'USD', 9305, 1484.87, 35.38),
    (uid, '2026-03-17', h_gev, NULL, 'GEV', 10129, 'USD', 10129, 1484.87, 844.08),
    (uid, '2026-03-17', h_googl, NULL, 'GOOGL', 38243, 'USD', 38243, 1484.87, 310.92),
    (uid, '2026-03-17', h_meta, NULL, 'META', 26774, 'USD', 26774, 1484.87, 622.65),
    (uid, '2026-03-17', h_msft, NULL, 'MSFT', 0, 'USD', 0, 1484.87, NULL),
    (uid, '2026-03-17', h_panw, NULL, 'PANW', 0, 'USD', 0, 1484.87, NULL),
    (uid, '2026-03-17', h_clrb, NULL, 'CLRB', 5286, 'USD', 5286, 1484.87, 3.3),
    (uid, '2026-03-17', h_usd, NULL, 'CASH_USD', 989852, 'USD', 989852, 1484.87, 1),
    (uid, '2026-03-17', h_schwab, NULL, 'SCHWAB2055', 141094, 'USD', 141094, 1484.87, 141094),
    (uid, '2026-03-17', h_krw_hana, NULL, 'CASH_KRW', 472057991, 'KRW', 317912, 1484.87, 1),
    (uid, '2026-03-17', NULL, inv_scalev, 'SCALEV', 361852, 'USD', 361852, 1484.87, 4),
    (uid, '2026-03-17', NULL, inv_scale, 'SCALE', 293250, 'USD', 293250, 1484.87, 6),
    (uid, '2026-03-17', NULL, inv_gold, 'GCW00', 1136861, 'USD', 1136861, 1484.87, 5008.2),
    (uid, '2026-03-17', NULL, inv_silver, 'SIW00', 7992, 'USD', 7992, 1484.87, 79.92),
    (uid, '2026-03-17', NULL, inv_krew, 'Krew Fund', 30000000, 'KRW', 20203.88, 1484.87, NULL),
    (uid, '2026-03-17', NULL, inv_infobank_fund, '인포뱅크-서울바이오허브 메디컬 개인투자조합 2호', 50000000, 'KRW', 33673.13, 1484.87, NULL),
    (uid, '2026-03-17', NULL, inv_mobilix, '모빌릭스', 20000000, 'KRW', 13469.22, 1484.87, 200000),
    (uid, '2026-03-17', NULL, inv_mrmind, '미스터마인드', 40000000, 'KRW', 26938.44, 1484.87, 400000),
    (uid, '2026-03-17', NULL, inv_taeju, '태주', 70000000, 'KRW', 47142.28, 1484.87, 700000),
    (uid, '2026-03-17', NULL, inv_quad, '쿼드', 27000000, 'KRW', 18183.45, 1484.87, 270000),
    (uid, '2026-03-17', NULL, inv_starnex, '스타넥스', 3000000, 'KRW', 2020.38, 1484.87, 30000),
    (uid, '2026-03-17', NULL, inv_gravity, '그래비티랩스', 20000000, 'KRW', 13469.22, 1484.87, 200000);

  -- 2026-03-18
  INSERT INTO snapshots (user_id, date, holding_id, investment_id, ticker, value_native, currency, value_usd, fx_rate, price_per_unit) VALUES
    (uid, '2026-03-18', h_039290, NULL, '039290', 208212201, 'KRW', 138324, 1505.25, 4530),
    (uid, '2026-03-18', h_246720, NULL, '246720', 31381452, 'KRW', 20848, 1505.25, 6839.9),
    (uid, '2026-03-18', h_000660, NULL, '000660', 0, 'KRW', 0, 1505.25, NULL),
    (uid, '2026-03-18', h_ceg, NULL, 'CEG', 31722, 'USD', 31722, 1505.25, 317.22),
    (uid, '2026-03-18', h_sgov, NULL, 'SGOV', 721446, 'USD', 721446, 1505.25, 100.55),
    (uid, '2026-03-18', h_tlt, NULL, 'TLT', 0, 'USD', 0, 1505.25, NULL),
    (uid, '2026-03-18', h_krw_sam, NULL, 'CASH_KRW', 1115731942, 'KRW', 741227, 1505.25, 1),
    (uid, '2026-03-18', h_sil, NULL, 'SIL', 158957, 'USD', 158957, 1505.25, 87.87),
    (uid, '2026-03-18', h_shld, NULL, 'SHLD', 126564, 'USD', 126564, 1505.25, 76.06),
    (uid, '2026-03-18', h_xle, NULL, 'XLE', 129189, 'USD', 129189, 1505.25, 58.43),
    (uid, '2026-03-18', h_soxx, NULL, 'SOXX', 0, 'USD', 0, 1505.25, NULL),
    (uid, '2026-03-18', h_botz, NULL, 'BOTZ', 19621, 'USD', 19621, 1505.25, 34.85),
    (uid, '2026-03-18', h_gev, NULL, 'GEV', 20603, 'USD', 20603, 1505.25, 858.46),
    (uid, '2026-03-18', h_googl, NULL, 'GOOGL', 57846, 'USD', 57846, 1505.25, 307.69),
    (uid, '2026-03-18', h_meta, NULL, 'META', 46792, 'USD', 46792, 1505.25, 615.68),
    (uid, '2026-03-18', h_msft, NULL, 'MSFT', 0, 'USD', 0, 1505.25, NULL),
    (uid, '2026-03-18', h_panw, NULL, 'PANW', 0, 'USD', 0, 1505.25, NULL),
    (uid, '2026-03-18', h_clrb, NULL, 'CLRB', 5205, 'USD', 5205, 1505.25, 3.25),
    (uid, '2026-03-18', h_usd, NULL, 'CASH_USD', 868663, 'USD', 868663, 1505.25, 1),
    (uid, '2026-03-18', h_schwab, NULL, 'SCHWAB2055', 148567, 'USD', 148567, 1505.25, 148567),
    (uid, '2026-03-18', h_krw_hana, NULL, 'CASH_KRW', 472058442, 'KRW', 313608, 1505.25, 1),
    (uid, '2026-03-18', NULL, inv_scalev, 'SCALEV', 361852, 'USD', 361852, 1505.25, 4),
    (uid, '2026-03-18', NULL, inv_scale, 'SCALE', 293250, 'USD', 293250, 1505.25, 6),
    (uid, '2026-03-18', NULL, inv_gold, 'GCW00', 1111437, 'USD', 1111437, 1505.25, 4896.2),
    (uid, '2026-03-18', NULL, inv_silver, 'SIW00', 7759, 'USD', 7759, 1505.25, 77.59),
    (uid, '2026-03-18', NULL, inv_krew, 'Krew Fund', 30000000, 'KRW', 19930.13, 1505.25, NULL),
    (uid, '2026-03-18', NULL, inv_infobank_fund, '인포뱅크-서울바이오허브 메디컬 개인투자조합 2호', 50000000, 'KRW', 33216.88, 1505.25, NULL),
    (uid, '2026-03-18', NULL, inv_mobilix, '모빌릭스', 20000000, 'KRW', 13286.78, 1505.25, 200000),
    (uid, '2026-03-18', NULL, inv_mrmind, '미스터마인드', 40000000, 'KRW', 26573.56, 1505.25, 400000),
    (uid, '2026-03-18', NULL, inv_taeju, '태주', 70000000, 'KRW', 46503.72, 1505.25, 700000),
    (uid, '2026-03-18', NULL, inv_quad, '쿼드', 27000000, 'KRW', 17937.15, 1505.25, 270000),
    (uid, '2026-03-18', NULL, inv_starnex, '스타넥스', 3000000, 'KRW', 1993.02, 1505.25, 30000),
    (uid, '2026-03-18', NULL, inv_gravity, '그래비티랩스', 20000000, 'KRW', 13286.78, 1505.25, 200000);

  -- 2026-03-19
  INSERT INTO snapshots (user_id, date, holding_id, investment_id, ticker, value_native, currency, value_usd, fx_rate, price_per_unit) VALUES
    (uid, '2026-03-19', h_039290, NULL, '039290', 210509922, 'KRW', 141297, 1489.84, 4579.99),
    (uid, '2026-03-19', h_246720, NULL, '246720', 30051563, 'KRW', 20171, 1489.84, 6550.04),
    (uid, '2026-03-19', h_000660, NULL, '000660', 0, 'KRW', 0, 1489.84, NULL),
    (uid, '2026-03-19', h_ceg, NULL, 'CEG', 31647, 'USD', 31647, 1489.84, 316.47),
    (uid, '2026-03-19', h_sgov, NULL, 'SGOV', 721446, 'USD', 721446, 1489.84, 100.55),
    (uid, '2026-03-19', h_tlt, NULL, 'TLT', 0, 'USD', 0, 1489.84, NULL),
    (uid, '2026-03-19', h_krw_sam, NULL, 'CASH_KRW', 1115732237, 'KRW', 748894, 1489.84, 1),
    (uid, '2026-03-19', h_sil, NULL, 'SIL', 149876, 'USD', 149876, 1489.84, 82.85),
    (uid, '2026-03-19', h_shld, NULL, 'SHLD', 126264, 'USD', 126264, 1489.84, 75.88),
    (uid, '2026-03-19', h_xle, NULL, 'XLE', 131245, 'USD', 131245, 1489.84, 59.36),
    (uid, '2026-03-19', h_soxx, NULL, 'SOXX', 0, 'USD', 0, 1489.84, NULL),
    (uid, '2026-03-19', h_botz, NULL, 'BOTZ', 19637, 'USD', 19637, 1489.84, 34.88),
    (uid, '2026-03-19', h_gev, NULL, 'GEV', 21057, 'USD', 21057, 1489.84, 877.38),
    (uid, '2026-03-19', h_googl, NULL, 'GOOGL', 57740, 'USD', 57740, 1489.84, 307.13),
    (uid, '2026-03-19', h_meta, NULL, 'META', 46109, 'USD', 46109, 1489.84, 606.7),
    (uid, '2026-03-19', h_msft, NULL, 'MSFT', 0, 'USD', 0, 1489.84, NULL),
    (uid, '2026-03-19', h_panw, NULL, 'PANW', 0, 'USD', 0, 1489.84, NULL),
    (uid, '2026-03-19', h_clrb, NULL, 'CLRB', 5093, 'USD', 5093, 1489.84, 3.18),
    (uid, '2026-03-19', h_usd, NULL, 'CASH_USD', 868663, 'USD', 868663, 1489.84, 1),
    (uid, '2026-03-19', h_schwab, NULL, 'SCHWAB2055', 148567, 'USD', 148567, 1489.84, 148567),
    (uid, '2026-03-19', h_krw_hana, NULL, 'CASH_KRW', 472057294, 'KRW', 316851, 1489.84, 1),
    (uid, '2026-03-19', NULL, inv_scalev, 'SCALEV', 361852, 'USD', 361852, 1489.84, 4),
    (uid, '2026-03-19', NULL, inv_scale, 'SCALE', 293250, 'USD', 293250, 1489.84, 6),
    (uid, '2026-03-19', NULL, inv_gold, 'GCW00', 1045494, 'USD', 1045494, 1489.84, 4605.7),
    (uid, '2026-03-19', NULL, inv_silver, 'SIW00', 7122, 'USD', 7122, 1489.84, 71.22),
    (uid, '2026-03-19', NULL, inv_krew, 'Krew Fund', 30000000, 'KRW', 20136.38, 1489.84, NULL),
    (uid, '2026-03-19', NULL, inv_infobank_fund, '인포뱅크-서울바이오허브 메디컬 개인투자조합 2호', 50000000, 'KRW', 33560.63, 1489.84, NULL),
    (uid, '2026-03-19', NULL, inv_mobilix, '모빌릭스', 20000000, 'KRW', 13424.22, 1489.84, 200000),
    (uid, '2026-03-19', NULL, inv_mrmind, '미스터마인드', 40000000, 'KRW', 26848.44, 1489.84, 400000),
    (uid, '2026-03-19', NULL, inv_taeju, '태주', 70000000, 'KRW', 46984.78, 1489.84, 700000),
    (uid, '2026-03-19', NULL, inv_quad, '쿼드', 27000000, 'KRW', 18122.7, 1489.84, 270000),
    (uid, '2026-03-19', NULL, inv_starnex, '스타넥스', 3000000, 'KRW', 2013.63, 1489.84, 30000),
    (uid, '2026-03-19', NULL, inv_gravity, '그래비티랩스', 20000000, 'KRW', 13424.22, 1489.84, 200000);

  -- 2026-03-20
  INSERT INTO snapshots (user_id, date, holding_id, investment_id, ticker, value_native, currency, value_usd, fx_rate, price_per_unit) VALUES
    (uid, '2026-03-20', h_039290, NULL, '039290', 213269037, 'KRW', 141772, 1504.31, 4640.02),
    (uid, '2026-03-20', h_246720, NULL, '246720', 29868075, 'KRW', 19855, 1504.31, 6510.04),
    (uid, '2026-03-20', h_000660, NULL, '000660', 0, 'KRW', 0, 1504.31, NULL),
    (uid, '2026-03-20', h_ceg, NULL, 'CEG', 28199, 'USD', 28199, 1504.31, 281.99),
    (uid, '2026-03-20', h_sgov, NULL, 'SGOV', 721662, 'USD', 721662, 1504.31, 100.58),
    (uid, '2026-03-20', h_tlt, NULL, 'TLT', 0, 'USD', 0, 1504.31, NULL),
    (uid, '2026-03-20', h_krw_sam, NULL, 'CASH_KRW', 1115731684, 'KRW', 741690, 1504.31, 1),
    (uid, '2026-03-20', h_sil, NULL, 'SIL', 143255, 'USD', 143255, 1504.31, 79.19),
    (uid, '2026-03-20', h_shld, NULL, 'SHLD', 121705, 'USD', 121705, 1504.31, 73.14),
    (uid, '2026-03-20', h_xle, NULL, 'XLE', 131134, 'USD', 131134, 1504.31, 59.31),
    (uid, '2026-03-20', h_soxx, NULL, 'SOXX', 0, 'USD', 0, 1504.31, NULL),
    (uid, '2026-03-20', h_botz, NULL, 'BOTZ', 18917, 'USD', 18917, 1504.31, 33.6),
    (uid, '2026-03-20', h_gev, NULL, 'GEV', 20426, 'USD', 20426, 1504.31, 851.08),
    (uid, '2026-03-20', h_googl, NULL, 'GOOGL', 56588, 'USD', 56588, 1504.31, 301),
    (uid, '2026-03-20', h_meta, NULL, 'META', 45118, 'USD', 45118, 1504.31, 593.66),
    (uid, '2026-03-20', h_msft, NULL, 'MSFT', 0, 'USD', 0, 1504.31, NULL),
    (uid, '2026-03-20', h_panw, NULL, 'PANW', 0, 'USD', 0, 1504.31, NULL),
    (uid, '2026-03-20', h_clrb, NULL, 'CLRB', 5189, 'USD', 5189, 1504.31, 3.24),
    (uid, '2026-03-20', h_usd, NULL, 'CASH_USD', 868663, 'USD', 868663, 1504.31, 1),
    (uid, '2026-03-20', h_schwab, NULL, 'SCHWAB2055', 148567, 'USD', 148567, 1504.31, 148567),
    (uid, '2026-03-20', h_krw_hana, NULL, 'CASH_KRW', 472056991, 'KRW', 313803, 1504.31, 1),
    (uid, '2026-03-20', NULL, inv_scalev, 'SCALEV', 361852, 'USD', 361852, 1504.31, 4),
    (uid, '2026-03-20', NULL, inv_scale, 'SCALE', 293250, 'USD', 293250, 1504.31, 6),
    (uid, '2026-03-20', NULL, inv_gold, 'GCW00', 1038502, 'USD', 1038502, 1504.31, 4574.9),
    (uid, '2026-03-20', NULL, inv_silver, 'SIW00', 6966, 'USD', 6966, 1504.31, 69.66),
    (uid, '2026-03-20', NULL, inv_krew, 'Krew Fund', 30000000, 'KRW', 19942.88, 1504.31, NULL),
    (uid, '2026-03-20', NULL, inv_infobank_fund, '인포뱅크-서울바이오허브 메디컬 개인투자조합 2호', 50000000, 'KRW', 33238.13, 1504.31, NULL),
    (uid, '2026-03-20', NULL, inv_mobilix, '모빌릭스', 20000000, 'KRW', 13295.11, 1504.31, 200000),
    (uid, '2026-03-20', NULL, inv_mrmind, '미스터마인드', 40000000, 'KRW', 26590.22, 1504.31, 400000),
    (uid, '2026-03-20', NULL, inv_taeju, '태주', 70000000, 'KRW', 46532.89, 1504.31, 700000),
    (uid, '2026-03-20', NULL, inv_quad, '쿼드', 27000000, 'KRW', 17948.4, 1504.31, 270000),
    (uid, '2026-03-20', NULL, inv_starnex, '스타넥스', 3000000, 'KRW', 1994.27, 1504.31, 30000),
    (uid, '2026-03-20', NULL, inv_gravity, '그래비티랩스', 20000000, 'KRW', 13295.11, 1504.31, 200000);

  -- 2026-03-21
  INSERT INTO snapshots (user_id, date, holding_id, investment_id, ticker, value_native, currency, value_usd, fx_rate, price_per_unit) VALUES
    (uid, '2026-03-21', h_039290, NULL, '039290', 203615882, 'KRW', 135364, 1504.21, 4430),
    (uid, '2026-03-21', h_246720, NULL, '246720', 28582998, 'KRW', 19002, 1504.21, 6229.95),
    (uid, '2026-03-21', h_000660, NULL, '000660', 0, 'KRW', 0, 1504.21, NULL),
    (uid, '2026-03-21', h_ceg, NULL, 'CEG', 28976, 'USD', 28976, 1504.21, 289.76),
    (uid, '2026-03-21', h_sgov, NULL, 'SGOV', 721662, 'USD', 721662, 1504.21, 100.58),
    (uid, '2026-03-21', h_tlt, NULL, 'TLT', 0, 'USD', 0, 1504.21, NULL),
    (uid, '2026-03-21', h_krw_sam, NULL, 'CASH_KRW', 1115731221, 'KRW', 741739, 1504.21, 1),
    (uid, '2026-03-21', h_sil, NULL, 'SIL', 149659, 'USD', 149659, 1504.21, 82.73),
    (uid, '2026-03-21', h_shld, NULL, 'SHLD', 121572, 'USD', 121572, 1504.21, 73.06),
    (uid, '2026-03-21', h_xle, NULL, 'XLE', 131842, 'USD', 131842, 1504.21, 59.63),
    (uid, '2026-03-21', h_soxx, NULL, 'SOXX', 0, 'USD', 0, 1504.21, NULL),
    (uid, '2026-03-21', h_botz, NULL, 'BOTZ', 19277, 'USD', 19277, 1504.21, 34.24),
    (uid, '2026-03-21', h_gev, NULL, 'GEV', 21183, 'USD', 21183, 1504.21, 882.63),
    (uid, '2026-03-21', h_googl, NULL, 'GOOGL', 56787, 'USD', 56787, 1504.21, 302.06),
    (uid, '2026-03-21', h_meta, NULL, 'META', 45909, 'USD', 45909, 1504.21, 604.07),
    (uid, '2026-03-21', h_msft, NULL, 'MSFT', 0, 'USD', 0, 1504.21, NULL),
    (uid, '2026-03-21', h_panw, NULL, 'PANW', 0, 'USD', 0, 1504.21, NULL),
    (uid, '2026-03-21', h_clrb, NULL, 'CLRB', 4997, 'USD', 4997, 1504.21, 3.12),
    (uid, '2026-03-21', h_usd, NULL, 'CASH_USD', 868663, 'USD', 868663, 1504.21, 1),
    (uid, '2026-03-21', h_schwab, NULL, 'SCHWAB2055', 148567, 'USD', 148567, 1504.21, 148567),
    (uid, '2026-03-21', h_krw_hana, NULL, 'CASH_KRW', 472057199, 'KRW', 313824, 1504.21, 1),
    (uid, '2026-03-21', NULL, inv_scalev, 'SCALEV', 361852, 'USD', 361852, 1504.21, 4),
    (uid, '2026-03-21', NULL, inv_scale, 'SCALE', 293250, 'USD', 293250, 1504.21, 6),
    (uid, '2026-03-21', NULL, inv_gold, 'GCW00', 1007767, 'USD', 1007767, 1504.21, 4439.5),
    (uid, '2026-03-21', NULL, inv_silver, 'SIW00', 6936, 'USD', 6936, 1504.21, 69.36),
    (uid, '2026-03-21', NULL, inv_krew, 'Krew Fund', 30000000, 'KRW', 19944, 1504.21, NULL),
    (uid, '2026-03-21', NULL, inv_infobank_fund, '인포뱅크-서울바이오허브 메디컬 개인투자조합 2호', 50000000, 'KRW', 33240, 1504.21, NULL),
    (uid, '2026-03-21', NULL, inv_mobilix, '모빌릭스', 20000000, 'KRW', 13296, 1504.21, 200000),
    (uid, '2026-03-21', NULL, inv_mrmind, '미스터마인드', 40000000, 'KRW', 26592, 1504.21, 400000),
    (uid, '2026-03-21', NULL, inv_taeju, '태주', 70000000, 'KRW', 46536, 1504.21, 700000),
    (uid, '2026-03-21', NULL, inv_quad, '쿼드', 27000000, 'KRW', 17949.6, 1504.21, 270000),
    (uid, '2026-03-21', NULL, inv_starnex, '스타넥스', 3000000, 'KRW', 1994.4, 1504.21, 30000),
    (uid, '2026-03-21', NULL, inv_gravity, '그래비티랩스', 20000000, 'KRW', 13296, 1504.21, 200000);

  -- 2026-03-22
  INSERT INTO snapshots (user_id, date, holding_id, investment_id, ticker, value_native, currency, value_usd, fx_rate, price_per_unit) VALUES
    (uid, '2026-03-22', h_039290, NULL, '039290', 203615882, 'KRW', 135364, 1504.21, 4430),
    (uid, '2026-03-22', h_246720, NULL, '246720', 28582998, 'KRW', 19002, 1504.21, 6229.95),
    (uid, '2026-03-22', h_000660, NULL, '000660', 0, 'KRW', 0, 1504.21, NULL),
    (uid, '2026-03-22', h_ceg, NULL, 'CEG', 28976, 'USD', 28976, 1504.21, 289.76),
    (uid, '2026-03-22', h_sgov, NULL, 'SGOV', 721662, 'USD', 721662, 1504.21, 100.58),
    (uid, '2026-03-22', h_tlt, NULL, 'TLT', 0, 'USD', 0, 1504.21, NULL),
    (uid, '2026-03-22', h_krw_sam, NULL, 'CASH_KRW', 1115731221, 'KRW', 741739, 1504.21, 1),
    (uid, '2026-03-22', h_sil, NULL, 'SIL', 149659, 'USD', 149659, 1504.21, 82.73),
    (uid, '2026-03-22', h_shld, NULL, 'SHLD', 121572, 'USD', 121572, 1504.21, 73.06),
    (uid, '2026-03-22', h_xle, NULL, 'XLE', 131842, 'USD', 131842, 1504.21, 59.63),
    (uid, '2026-03-22', h_soxx, NULL, 'SOXX', 0, 'USD', 0, 1504.21, NULL),
    (uid, '2026-03-22', h_botz, NULL, 'BOTZ', 19277, 'USD', 19277, 1504.21, 34.24),
    (uid, '2026-03-22', h_gev, NULL, 'GEV', 21183, 'USD', 21183, 1504.21, 882.63),
    (uid, '2026-03-22', h_googl, NULL, 'GOOGL', 56787, 'USD', 56787, 1504.21, 302.06),
    (uid, '2026-03-22', h_meta, NULL, 'META', 45909, 'USD', 45909, 1504.21, 604.07),
    (uid, '2026-03-22', h_msft, NULL, 'MSFT', 0, 'USD', 0, 1504.21, NULL),
    (uid, '2026-03-22', h_panw, NULL, 'PANW', 0, 'USD', 0, 1504.21, NULL),
    (uid, '2026-03-22', h_clrb, NULL, 'CLRB', 4997, 'USD', 4997, 1504.21, 3.12),
    (uid, '2026-03-22', h_usd, NULL, 'CASH_USD', 868663, 'USD', 868663, 1504.21, 1),
    (uid, '2026-03-22', h_schwab, NULL, 'SCHWAB2055', 148567, 'USD', 148567, 1504.21, 148567),
    (uid, '2026-03-22', h_krw_hana, NULL, 'CASH_KRW', 472057199, 'KRW', 313824, 1504.21, 1),
    (uid, '2026-03-22', NULL, inv_scalev, 'SCALEV', 361852, 'USD', 361852, 1504.21, 4),
    (uid, '2026-03-22', NULL, inv_scale, 'SCALE', 293250, 'USD', 293250, 1504.21, 6),
    (uid, '2026-03-22', NULL, inv_gold, 'GCW00', 1007767, 'USD', 1007767, 1504.21, 4439.5),
    (uid, '2026-03-22', NULL, inv_silver, 'SIW00', 6936, 'USD', 6936, 1504.21, 69.36),
    (uid, '2026-03-22', NULL, inv_krew, 'Krew Fund', 30000000, 'KRW', 19944, 1504.21, NULL),
    (uid, '2026-03-22', NULL, inv_infobank_fund, '인포뱅크-서울바이오허브 메디컬 개인투자조합 2호', 50000000, 'KRW', 33240, 1504.21, NULL),
    (uid, '2026-03-22', NULL, inv_mobilix, '모빌릭스', 20000000, 'KRW', 13296, 1504.21, 200000),
    (uid, '2026-03-22', NULL, inv_mrmind, '미스터마인드', 40000000, 'KRW', 26592, 1504.21, 400000),
    (uid, '2026-03-22', NULL, inv_taeju, '태주', 70000000, 'KRW', 46536, 1504.21, 700000),
    (uid, '2026-03-22', NULL, inv_quad, '쿼드', 27000000, 'KRW', 17949.6, 1504.21, 270000),
    (uid, '2026-03-22', NULL, inv_starnex, '스타넥스', 3000000, 'KRW', 1994.4, 1504.21, 30000),
    (uid, '2026-03-22', NULL, inv_gravity, '그래비티랩스', 20000000, 'KRW', 13296, 1504.21, 200000);

  -- 2026-03-23
  INSERT INTO snapshots (user_id, date, holding_id, investment_id, ticker, value_native, currency, value_usd, fx_rate, price_per_unit) VALUES
    (uid, '2026-03-23', h_039290, NULL, '039290', 203616120, 'KRW', 137082, 1485.36, 4430),
    (uid, '2026-03-23', h_246720, NULL, '246720', 28582782, 'KRW', 19243, 1485.36, 6229.9),
    (uid, '2026-03-23', h_000660, NULL, '000660', 0, 'KRW', 0, 1485.36, NULL),
    (uid, '2026-03-23', h_ceg, NULL, 'CEG', 28976, 'USD', 28976, 1485.36, 289.76),
    (uid, '2026-03-23', h_sgov, NULL, 'SGOV', 721662, 'USD', 721662, 1485.36, 100.58),
    (uid, '2026-03-23', h_tlt, NULL, 'TLT', 0, 'USD', 0, 1485.36, NULL),
    (uid, '2026-03-23', h_krw_sam, NULL, 'CASH_KRW', 1115731135, 'KRW', 751152, 1485.36, 1),
    (uid, '2026-03-23', h_sil, NULL, 'SIL', 149659, 'USD', 149659, 1485.36, 82.73),
    (uid, '2026-03-23', h_shld, NULL, 'SHLD', 121572, 'USD', 121572, 1485.36, 73.06),
    (uid, '2026-03-23', h_xle, NULL, 'XLE', 131842, 'USD', 131842, 1485.36, 59.63),
    (uid, '2026-03-23', h_soxx, NULL, 'SOXX', 0, 'USD', 0, 1485.36, NULL),
    (uid, '2026-03-23', h_botz, NULL, 'BOTZ', 19277, 'USD', 19277, 1485.36, 34.24),
    (uid, '2026-03-23', h_gev, NULL, 'GEV', 21183, 'USD', 21183, 1485.36, 882.63),
    (uid, '2026-03-23', h_googl, NULL, 'GOOGL', 56787, 'USD', 56787, 1485.36, 302.06),
    (uid, '2026-03-23', h_meta, NULL, 'META', 45909, 'USD', 45909, 1485.36, 604.07),
    (uid, '2026-03-23', h_msft, NULL, 'MSFT', 0, 'USD', 0, 1485.36, NULL),
    (uid, '2026-03-23', h_panw, NULL, 'PANW', 0, 'USD', 0, 1485.36, NULL),
    (uid, '2026-03-23', h_clrb, NULL, 'CLRB', 4997, 'USD', 4997, 1485.36, 3.12),
    (uid, '2026-03-23', h_usd, NULL, 'CASH_USD', 868663, 'USD', 868663, 1485.36, 1),
    (uid, '2026-03-23', h_schwab, NULL, 'SCHWAB2055', 148567, 'USD', 148567, 1485.36, 148567),
    (uid, '2026-03-23', h_krw_hana, NULL, 'CASH_KRW', 472057806, 'KRW', 317807, 1485.36, 1),
    (uid, '2026-03-23', NULL, inv_scalev, 'SCALEV', 361852, 'USD', 361852, 1485.36, 4),
    (uid, '2026-03-23', NULL, inv_scale, 'SCALE', 293250, 'USD', 293250, 1485.36, 6),
    (uid, '2026-03-23', NULL, inv_gold, 'GCW00', 1007767, 'USD', 1007767, 1485.36, 4439.5),
    (uid, '2026-03-23', NULL, inv_silver, 'SIW00', 6936, 'USD', 6936, 1485.36, 69.36),
    (uid, '2026-03-23', NULL, inv_krew, 'Krew Fund', 30000000, 'KRW', 20197.13, 1485.36, NULL),
    (uid, '2026-03-23', NULL, inv_infobank_fund, '인포뱅크-서울바이오허브 메디컬 개인투자조합 2호', 50000000, 'KRW', 33661.88, 1485.36, NULL),
    (uid, '2026-03-23', NULL, inv_mobilix, '모빌릭스', 20000000, 'KRW', 13464.78, 1485.36, 200000),
    (uid, '2026-03-23', NULL, inv_mrmind, '미스터마인드', 40000000, 'KRW', 26929.56, 1485.36, 400000),
    (uid, '2026-03-23', NULL, inv_taeju, '태주', 70000000, 'KRW', 47126.72, 1485.36, 700000),
    (uid, '2026-03-23', NULL, inv_quad, '쿼드', 27000000, 'KRW', 18177.45, 1485.36, 270000),
    (uid, '2026-03-23', NULL, inv_starnex, '스타넥스', 3000000, 'KRW', 2019.72, 1485.36, 30000),
    (uid, '2026-03-23', NULL, inv_gravity, '그래비티랩스', 20000000, 'KRW', 13464.78, 1485.36, 200000);

  -- 2026-03-24
  INSERT INTO snapshots (user_id, date, holding_id, investment_id, ticker, value_native, currency, value_usd, fx_rate, price_per_unit) VALUES
    (uid, '2026-03-24', h_039290, NULL, '039290', 203616192, 'KRW', 135988, 1497.31, 4430),
    (uid, '2026-03-24', h_246720, NULL, '246720', 27848469, 'KRW', 18599, 1497.31, 6069.85),
    (uid, '2026-03-24', h_000660, NULL, '000660', 0, 'KRW', 0, 1497.31, NULL),
    (uid, '2026-03-24', h_ceg, NULL, 'CEG', 29485, 'USD', 29485, 1497.31, 294.85),
    (uid, '2026-03-24', h_sgov, NULL, 'SGOV', 721877, 'USD', 721877, 1497.31, 100.61),
    (uid, '2026-03-24', h_tlt, NULL, 'TLT', 0, 'USD', 0, 1497.31, NULL),
    (uid, '2026-03-24', h_krw_sam, NULL, 'CASH_KRW', 1115732525, 'KRW', 745158, 1497.31, 1),
    (uid, '2026-03-24', h_sil, NULL, 'SIL', 150961, 'USD', 150961, 1497.31, 83.45),
    (uid, '2026-03-24', h_shld, NULL, 'SHLD', 120124, 'USD', 120124, 1497.31, 72.19),
    (uid, '2026-03-24', h_xle, NULL, 'XLE', 134517, 'USD', 134517, 1497.31, 60.84),
    (uid, '2026-03-24', h_soxx, NULL, 'SOXX', 0, 'USD', 0, 1497.31, NULL),
    (uid, '2026-03-24', h_botz, NULL, 'BOTZ', 19041, 'USD', 19041, 1497.31, 33.82),
    (uid, '2026-03-24', h_gev, NULL, 'GEV', 21826, 'USD', 21826, 1497.31, 909.42),
    (uid, '2026-03-24', h_googl, NULL, 'GOOGL', 54603, 'USD', 54603, 1497.31, 290.44),
    (uid, '2026-03-24', h_meta, NULL, 'META', 45062, 'USD', 45062, 1497.31, 592.92),
    (uid, '2026-03-24', h_msft, NULL, 'MSFT', 0, 'USD', 0, 1497.31, NULL),
    (uid, '2026-03-24', h_panw, NULL, 'PANW', 0, 'USD', 0, 1497.31, NULL),
    (uid, '2026-03-24', h_clrb, NULL, 'CLRB', 4821, 'USD', 4821, 1497.31, 3.01),
    (uid, '2026-03-24', h_usd, NULL, 'CASH_USD', 868663, 'USD', 868663, 1497.31, 1),
    (uid, '2026-03-24', h_schwab, NULL, 'SCHWAB2055', 148567, 'USD', 148567, 1497.31, 148567),
    (uid, '2026-03-24', h_krw_hana, NULL, 'CASH_KRW', 472058421, 'KRW', 315271, 1497.31, 1),
    (uid, '2026-03-24', NULL, inv_scalev, 'SCALEV', 361852, 'USD', 361852, 1497.31, 4),
    (uid, '2026-03-24', NULL, inv_scale, 'SCALE', 293250, 'USD', 293250, 1497.31, 6),
    (uid, '2026-03-24', NULL, inv_gold, 'GCW00', 1006541, 'USD', 1006541, 1497.31, 4434.1),
    (uid, '2026-03-24', NULL, inv_silver, 'SIW00', 6957, 'USD', 6957, 1497.31, 69.57),
    (uid, '2026-03-24', NULL, inv_krew, 'Krew Fund', 30000000, 'KRW', 20035.88, 1497.31, NULL),
    (uid, '2026-03-24', NULL, inv_infobank_fund, '인포뱅크-서울바이오허브 메디컬 개인투자조합 2호', 50000000, 'KRW', 33393.13, 1497.31, NULL),
    (uid, '2026-03-24', NULL, inv_mobilix, '모빌릭스', 20000000, 'KRW', 13357.33, 1497.31, 200000),
    (uid, '2026-03-24', NULL, inv_mrmind, '미스터마인드', 40000000, 'KRW', 26714.67, 1497.31, 400000),
    (uid, '2026-03-24', NULL, inv_taeju, '태주', 70000000, 'KRW', 46750.67, 1497.31, 700000),
    (uid, '2026-03-24', NULL, inv_quad, '쿼드', 27000000, 'KRW', 18032.4, 1497.31, 270000),
    (uid, '2026-03-24', NULL, inv_starnex, '스타넥스', 3000000, 'KRW', 2003.6, 1497.31, 30000),
    (uid, '2026-03-24', NULL, inv_gravity, '그래비티랩스', 20000000, 'KRW', 13357.33, 1497.31, 200000);

  -- 2026-03-25
  INSERT INTO snapshots (user_id, date, holding_id, investment_id, ticker, value_native, currency, value_usd, fx_rate, price_per_unit) VALUES
    (uid, '2026-03-25', h_039290, NULL, '039290', 214418067, 'KRW', 142853, 1500.97, 4665.01),
    (uid, '2026-03-25', h_246720, NULL, '246720', 27848997, 'KRW', 18554, 1500.97, 6069.96),
    (uid, '2026-03-25', h_000660, NULL, '000660', 0, 'KRW', 0, 1500.97, NULL),
    (uid, '2026-03-25', h_ceg, NULL, 'CEG', 30332, 'USD', 30332, 1500.97, 303.32),
    (uid, '2026-03-25', h_sgov, NULL, 'SGOV', 721877, 'USD', 721877, 1500.97, 100.61),
    (uid, '2026-03-25', h_tlt, NULL, 'TLT', 0, 'USD', 0, 1500.97, NULL),
    (uid, '2026-03-25', h_krw_sam, NULL, 'CASH_KRW', 1115732541, 'KRW', 743341, 1500.97, 1),
    (uid, '2026-03-25', h_sil, NULL, 'SIL', 154452, 'USD', 154452, 1500.97, 85.38),
    (uid, '2026-03-25', h_shld, NULL, 'SHLD', 122354, 'USD', 122354, 1500.97, 73.53),
    (uid, '2026-03-25', h_xle, NULL, 'XLE', 133920, 'USD', 133920, 1500.97, 60.57),
    (uid, '2026-03-25', h_soxx, NULL, 'SOXX', 0, 'USD', 0, 1500.97, NULL),
    (uid, '2026-03-25', h_botz, NULL, 'BOTZ', 19356, 'USD', 19356, 1500.97, 34.38),
    (uid, '2026-03-25', h_gev, NULL, 'GEV', 22169, 'USD', 22169, 1500.97, 923.71),
    (uid, '2026-03-25', h_googl, NULL, 'GOOGL', 54695, 'USD', 54695, 1500.97, 290.93),
    (uid, '2026-03-25', h_meta, NULL, 'META', 45212, 'USD', 45212, 1500.97, 594.89),
    (uid, '2026-03-25', h_msft, NULL, 'MSFT', 0, 'USD', 0, 1500.97, NULL),
    (uid, '2026-03-25', h_panw, NULL, 'PANW', 0, 'USD', 0, 1500.97, NULL),
    (uid, '2026-03-25', h_clrb, NULL, 'CLRB', 4725, 'USD', 4725, 1500.97, 2.95),
    (uid, '2026-03-25', h_usd, NULL, 'CASH_USD', 868663, 'USD', 868663, 1500.97, 1),
    (uid, '2026-03-25', h_schwab, NULL, 'SCHWAB2055', 148567, 'USD', 148567, 1500.97, 148567),
    (uid, '2026-03-25', h_krw_hana, NULL, 'CASH_KRW', 472058067, 'KRW', 314502, 1500.97, 1),
    (uid, '2026-03-25', NULL, inv_scalev, 'SCALEV', 361852, 'USD', 361852, 1500.97, 4),
    (uid, '2026-03-25', NULL, inv_scale, 'SCALE', 293250, 'USD', 293250, 1500.97, 6),
    (uid, '2026-03-25', NULL, inv_gold, 'GCW00', 1040909, 'USD', 1040909, 1500.97, 4585.5),
    (uid, '2026-03-25', NULL, inv_silver, 'SIW00', 7264, 'USD', 7264, 1500.97, 72.64),
    (uid, '2026-03-25', NULL, inv_krew, 'Krew Fund', 30000000, 'KRW', 19987.13, 1500.97, NULL),
    (uid, '2026-03-25', NULL, inv_infobank_fund, '인포뱅크-서울바이오허브 메디컬 개인투자조합 2호', 50000000, 'KRW', 33311.88, 1500.97, NULL),
    (uid, '2026-03-25', NULL, inv_mobilix, '모빌릭스', 20000000, 'KRW', 13324.67, 1500.97, 200000),
    (uid, '2026-03-25', NULL, inv_mrmind, '미스터마인드', 40000000, 'KRW', 26649.33, 1500.97, 400000),
    (uid, '2026-03-25', NULL, inv_taeju, '태주', 70000000, 'KRW', 46636.33, 1500.97, 700000),
    (uid, '2026-03-25', NULL, inv_quad, '쿼드', 27000000, 'KRW', 17988.3, 1500.97, 270000),
    (uid, '2026-03-25', NULL, inv_starnex, '스타넥스', 3000000, 'KRW', 1998.7, 1500.97, 30000),
    (uid, '2026-03-25', NULL, inv_gravity, '그래비티랩스', 20000000, 'KRW', 13324.67, 1500.97, 200000);

  -- 2026-03-26
  INSERT INTO snapshots (user_id, date, holding_id, investment_id, ticker, value_native, currency, value_usd, fx_rate, price_per_unit) VALUES
    (uid, '2026-03-26', h_039290, NULL, '039290', 214647170, 'KRW', 142305, 1508.36, 4670),
    (uid, '2026-03-26', h_246720, NULL, '246720', 27848851, 'KRW', 18463, 1508.36, 6069.93),
    (uid, '2026-03-26', h_000660, NULL, '000660', 0, 'KRW', 0, 1508.36, NULL),
    (uid, '2026-03-26', h_ceg, NULL, 'CEG', 29519, 'USD', 29519, 1508.36, 295.19),
    (uid, '2026-03-26', h_sgov, NULL, 'SGOV', 721949, 'USD', 721949, 1508.36, 100.62),
    (uid, '2026-03-26', h_tlt, NULL, 'TLT', 0, 'USD', 0, 1508.36, NULL),
    (uid, '2026-03-26', h_krw_sam, NULL, 'CASH_KRW', 1115732384, 'KRW', 739699, 1508.36, 1),
    (uid, '2026-03-26', h_sil, NULL, 'SIL', 146818, 'USD', 146818, 1508.36, 81.16),
    (uid, '2026-03-26', h_shld, NULL, 'SHLD', 119142, 'USD', 119142, 1508.36, 71.6),
    (uid, '2026-03-26', h_xle, NULL, 'XLE', 136021, 'USD', 136021, 1508.36, 61.52),
    (uid, '2026-03-26', h_soxx, NULL, 'SOXX', 0, 'USD', 0, 1508.36, NULL),
    (uid, '2026-03-26', h_botz, NULL, 'BOTZ', 18742, 'USD', 18742, 1508.36, 33.29),
    (uid, '2026-03-26', h_gev, NULL, 'GEV', 30559, 'USD', 30559, 1508.36, 873.11),
    (uid, '2026-03-26', h_googl, NULL, 'GOOGL', 52813, 'USD', 52813, 1508.36, 280.92),
    (uid, '2026-03-26', h_meta, NULL, 'META', 41613, 'USD', 41613, 1508.36, 547.54),
    (uid, '2026-03-26', h_msft, NULL, 'MSFT', 0, 'USD', 0, 1508.36, NULL),
    (uid, '2026-03-26', h_panw, NULL, 'PANW', 0, 'USD', 0, 1508.36, NULL),
    (uid, '2026-03-26', h_clrb, NULL, 'CLRB', 4645, 'USD', 4645, 1508.36, 2.9),
    (uid, '2026-03-26', h_usd, NULL, 'CASH_USD', 858798, 'USD', 858798, 1508.36, 1),
    (uid, '2026-03-26', h_schwab, NULL, 'SCHWAB2055', 146118, 'USD', 146118, 1508.36, 146118),
    (uid, '2026-03-26', h_krw_hana, NULL, 'CASH_KRW', 472057854, 'KRW', 312961, 1508.36, 1),
    (uid, '2026-03-26', NULL, inv_scalev, 'SCALEV', 361852, 'USD', 361852, 1508.36, 4),
    (uid, '2026-03-26', NULL, inv_scale, 'SCALE', 293250, 'USD', 293250, 1508.36, 6),
    (uid, '2026-03-26', NULL, inv_gold, 'GCW00', 1000843, 'USD', 1000843, 1508.36, 4409),
    (uid, '2026-03-26', NULL, inv_silver, 'SIW00', 6793, 'USD', 6793, 1508.36, 67.93),
    (uid, '2026-03-26', NULL, inv_krew, 'Krew Fund', 30000000, 'KRW', 19889.25, 1508.36, NULL),
    (uid, '2026-03-26', NULL, inv_infobank_fund, '인포뱅크-서울바이오허브 메디컬 개인투자조합 2호', 50000000, 'KRW', 33148.75, 1508.36, NULL),
    (uid, '2026-03-26', NULL, inv_mobilix, '모빌릭스', 20000000, 'KRW', 13259.44, 1508.36, 200000),
    (uid, '2026-03-26', NULL, inv_mrmind, '미스터마인드', 40000000, 'KRW', 26518.89, 1508.36, 400000),
    (uid, '2026-03-26', NULL, inv_taeju, '태주', 70000000, 'KRW', 46408.06, 1508.36, 700000),
    (uid, '2026-03-26', NULL, inv_quad, '쿼드', 27000000, 'KRW', 17900.25, 1508.36, 270000),
    (uid, '2026-03-26', NULL, inv_starnex, '스타넥스', 3000000, 'KRW', 1988.92, 1508.36, 30000),
    (uid, '2026-03-26', NULL, inv_gravity, '그래비티랩스', 20000000, 'KRW', 13259.44, 1508.36, 200000);

  -- 2026-03-27
  INSERT INTO snapshots (user_id, date, holding_id, investment_id, ticker, value_native, currency, value_usd, fx_rate, price_per_unit) VALUES
    (uid, '2026-03-27', h_039290, NULL, '039290', 212808960, 'KRW', 141120, 1508, 4630.01),
    (uid, '2026-03-27', h_246720, NULL, '246720', 0, 'KRW', 0, 1508, NULL),
    (uid, '2026-03-27', h_000660, NULL, '000660', 0, 'KRW', 0, 1508, NULL),
    (uid, '2026-03-27', h_ceg, NULL, 'CEG', 30149, 'USD', 30149, 1508, 301.49),
    (uid, '2026-03-27', h_sgov, NULL, 'SGOV', 722164, 'USD', 722164, 1508, 100.65),
    (uid, '2026-03-27', h_tlt, NULL, 'TLT', 0, 'USD', 0, 1508, NULL),
    (uid, '2026-03-27', h_krw_sam, NULL, 'CASH_KRW', 1115731500, 'KRW', 739875, 1508, 1),
    (uid, '2026-03-27', h_sil, NULL, 'SIL', 152282, 'USD', 152282, 1508, 84.18),
    (uid, '2026-03-27', h_shld, NULL, 'SHLD', 116264, 'USD', 116264, 1508, 69.87),
    (uid, '2026-03-27', h_xle, NULL, 'XLE', 138320, 'USD', 138320, 1508, 62.56),
    (uid, '2026-03-27', h_soxx, NULL, 'SOXX', 0, 'USD', 0, 1508, NULL),
    (uid, '2026-03-27', h_botz, NULL, 'BOTZ', 18275, 'USD', 18275, 1508, 32.46),
    (uid, '2026-03-27', h_gev, NULL, 'GEV', 29861, 'USD', 29861, 1508, 853.17),
    (uid, '2026-03-27', h_googl, NULL, 'GOOGL', 51576, 'USD', 51576, 1508, 274.34),
    (uid, '2026-03-27', h_meta, NULL, 'META', 39955, 'USD', 39955, 1508, 525.72),
    (uid, '2026-03-27', h_msft, NULL, 'MSFT', 0, 'USD', 0, 1508, NULL),
    (uid, '2026-03-27', h_panw, NULL, 'PANW', 0, 'USD', 0, 1508, NULL),
    (uid, '2026-03-27', h_clrb, NULL, 'CLRB', 4325, 'USD', 4325, 1508, 2.7),
    (uid, '2026-03-27', h_usd, NULL, 'CASH_USD', 858798, 'USD', 858798, 1508, 1),
    (uid, '2026-03-27', h_schwab, NULL, 'SCHWAB2055', 146118, 'USD', 146118, 1508, 146118),
    (uid, '2026-03-27', h_krw_hana, NULL, 'CASH_KRW', 472058288, 'KRW', 313036, 1508, 1),
    (uid, '2026-03-27', NULL, inv_scalev, 'SCALEV', 361852, 'USD', 361852, 1508, 4),
    (uid, '2026-03-27', NULL, inv_scale, 'SCALE', 293250, 'USD', 293250, 1508, 6),
    (uid, '2026-03-27', NULL, inv_gold, 'GCW00', 1027016, 'USD', 1027016, 1508, 4524.3),
    (uid, '2026-03-27', NULL, inv_silver, 'SIW00', 6980, 'USD', 6980, 1508, 69.8),
    (uid, '2026-03-27', NULL, inv_krew, 'Krew Fund', 30000000, 'KRW', 19893.75, 1508, NULL),
    (uid, '2026-03-27', NULL, inv_infobank_fund, '인포뱅크-서울바이오허브 메디컬 개인투자조합 2호', 50000000, 'KRW', 33156.25, 1508, NULL),
    (uid, '2026-03-27', NULL, inv_mobilix, '모빌릭스', 20000000, 'KRW', 13262.56, 1508, 200000),
    (uid, '2026-03-27', NULL, inv_mrmind, '미스터마인드', 40000000, 'KRW', 26525.11, 1508, 400000),
    (uid, '2026-03-27', NULL, inv_taeju, '태주', 70000000, 'KRW', 46418.94, 1508, 700000),
    (uid, '2026-03-27', NULL, inv_quad, '쿼드', 27000000, 'KRW', 17904.45, 1508, 270000),
    (uid, '2026-03-27', NULL, inv_starnex, '스타넥스', 3000000, 'KRW', 1989.38, 1508, 30000),
    (uid, '2026-03-27', NULL, inv_gravity, '그래비티랩스', 20000000, 'KRW', 13262.56, 1508, 200000);

  -- 2026-03-28
  INSERT INTO snapshots (user_id, date, holding_id, investment_id, ticker, value_native, currency, value_usd, fx_rate, price_per_unit) VALUES
    (uid, '2026-03-28', h_039290, NULL, '039290', 212807991, 'KRW', 141081, 1508.41, 4629.98),
    (uid, '2026-03-28', h_246720, NULL, '246720', 0, 'KRW', 0, 1508.41, NULL),
    (uid, '2026-03-28', h_000660, NULL, '000660', 0, 'KRW', 0, 1508.41, NULL),
    (uid, '2026-03-28', h_ceg, NULL, 'CEG', 29861, 'USD', 29861, 1508.41, 298.61),
    (uid, '2026-03-28', h_sgov, NULL, 'SGOV', 722236, 'USD', 722236, 1508.41, 100.66),
    (uid, '2026-03-28', h_tlt, NULL, 'TLT', 0, 'USD', 0, 1508.41, NULL),
    (uid, '2026-03-28', h_krw_sam, NULL, 'CASH_KRW', 1115731658, 'KRW', 739674, 1508.41, 1),
    (uid, '2026-03-28', h_sil, NULL, 'SIL', 151142, 'USD', 151142, 1508.41, 83.55),
    (uid, '2026-03-28', h_shld, NULL, 'SHLD', 113651, 'USD', 113651, 1508.41, 68.3),
    (uid, '2026-03-28', h_xle, NULL, 'XLE', 136994, 'USD', 136994, 1508.41, 61.96),
    (uid, '2026-03-28', h_soxx, NULL, 'SOXX', 0, 'USD', 0, 1508.41, NULL),
    (uid, '2026-03-28', h_botz, NULL, 'BOTZ', 18010, 'USD', 18010, 1508.41, 31.99),
    (uid, '2026-03-28', h_gev, NULL, 'GEV', 28607, 'USD', 28607, 1508.41, 817.34),
    (uid, '2026-03-28', h_googl, NULL, 'GOOGL', 51418, 'USD', 51418, 1508.41, 273.5),
    (uid, '2026-03-28', h_meta, NULL, 'META', 40765, 'USD', 40765, 1508.41, 536.38),
    (uid, '2026-03-28', h_msft, NULL, 'MSFT', 0, 'USD', 0, 1508.41, NULL),
    (uid, '2026-03-28', h_panw, NULL, 'PANW', 0, 'USD', 0, 1508.41, NULL),
    (uid, '2026-03-28', h_clrb, NULL, 'CLRB', 4180, 'USD', 4180, 1508.41, 2.61),
    (uid, '2026-03-28', h_usd, NULL, 'CASH_USD', 858798, 'USD', 858798, 1508.41, 1),
    (uid, '2026-03-28', h_schwab, NULL, 'SCHWAB2055', 146118, 'USD', 146118, 1508.41, 146118),
    (uid, '2026-03-28', h_krw_hana, NULL, 'CASH_KRW', 472058418, 'KRW', 312951, 1508.41, 1),
    (uid, '2026-03-28', NULL, inv_scalev, 'SCALEV', 361852, 'USD', 361852, 1508.41, 4),
    (uid, '2026-03-28', NULL, inv_scale, 'SCALE', 293250, 'USD', 293250, 1508.41, 6),
    (uid, '2026-03-28', NULL, inv_gold, 'GCW00', 1034553, 'USD', 1034553, 1508.41, 4557.5),
    (uid, '2026-03-28', NULL, inv_silver, 'SIW00', 7057, 'USD', 7057, 1508.41, 70.57),
    (uid, '2026-03-28', NULL, inv_krew, 'Krew Fund', 30000000, 'KRW', 19888.5, 1508.41, NULL),
    (uid, '2026-03-28', NULL, inv_infobank_fund, '인포뱅크-서울바이오허브 메디컬 개인투자조합 2호', 50000000, 'KRW', 33147.5, 1508.41, NULL),
    (uid, '2026-03-28', NULL, inv_mobilix, '모빌릭스', 20000000, 'KRW', 13259, 1508.41, 200000),
    (uid, '2026-03-28', NULL, inv_mrmind, '미스터마인드', 40000000, 'KRW', 26518, 1508.41, 400000),
    (uid, '2026-03-28', NULL, inv_taeju, '태주', 70000000, 'KRW', 46406.5, 1508.41, 700000),
    (uid, '2026-03-28', NULL, inv_quad, '쿼드', 27000000, 'KRW', 17899.65, 1508.41, 270000),
    (uid, '2026-03-28', NULL, inv_starnex, '스타넥스', 3000000, 'KRW', 1988.85, 1508.41, 30000),
    (uid, '2026-03-28', NULL, inv_gravity, '그래비티랩스', 20000000, 'KRW', 13259, 1508.41, 200000);

  -- 2026-03-29
  INSERT INTO snapshots (user_id, date, holding_id, investment_id, ticker, value_native, currency, value_usd, fx_rate, price_per_unit) VALUES
    (uid, '2026-03-29', h_039290, NULL, '039290', 212808766, 'KRW', 141118, 1508.02, 4630),
    (uid, '2026-03-29', h_246720, NULL, '246720', 0, 'KRW', 0, 1508.02, NULL),
    (uid, '2026-03-29', h_000660, NULL, '000660', 0, 'KRW', 0, 1508.02, NULL),
    (uid, '2026-03-29', h_ceg, NULL, 'CEG', 29861, 'USD', 29861, 1508.02, 298.61),
    (uid, '2026-03-29', h_sgov, NULL, 'SGOV', 722236, 'USD', 722236, 1508.02, 100.66),
    (uid, '2026-03-29', h_tlt, NULL, 'TLT', 0, 'USD', 0, 1508.02, NULL),
    (uid, '2026-03-29', h_krw_sam, NULL, 'CASH_KRW', 1115731217, 'KRW', 739865, 1508.02, 1),
    (uid, '2026-03-29', h_sil, NULL, 'SIL', 151142, 'USD', 151142, 1508.02, 83.55),
    (uid, '2026-03-29', h_shld, NULL, 'SHLD', 113651, 'USD', 113651, 1508.02, 68.3),
    (uid, '2026-03-29', h_xle, NULL, 'XLE', 136994, 'USD', 136994, 1508.02, 61.96),
    (uid, '2026-03-29', h_soxx, NULL, 'SOXX', 0, 'USD', 0, 1508.02, NULL),
    (uid, '2026-03-29', h_botz, NULL, 'BOTZ', 18010, 'USD', 18010, 1508.02, 31.99),
    (uid, '2026-03-29', h_gev, NULL, 'GEV', 28607, 'USD', 28607, 1508.02, 817.34),
    (uid, '2026-03-29', h_googl, NULL, 'GOOGL', 51418, 'USD', 51418, 1508.02, 273.5),
    (uid, '2026-03-29', h_meta, NULL, 'META', 40765, 'USD', 40765, 1508.02, 536.38),
    (uid, '2026-03-29', h_msft, NULL, 'MSFT', 0, 'USD', 0, 1508.02, NULL),
    (uid, '2026-03-29', h_panw, NULL, 'PANW', 0, 'USD', 0, 1508.02, NULL),
    (uid, '2026-03-29', h_clrb, NULL, 'CLRB', 4180, 'USD', 4180, 1508.02, 2.61),
    (uid, '2026-03-29', h_usd, NULL, 'CASH_USD', 858798, 'USD', 858798, 1508.02, 1),
    (uid, '2026-03-29', h_schwab, NULL, 'SCHWAB2055', 146118, 'USD', 146118, 1508.02, 146118),
    (uid, '2026-03-29', h_krw_hana, NULL, 'CASH_KRW', 472057009, 'KRW', 313031, 1508.02, 1),
    (uid, '2026-03-29', NULL, inv_scalev, 'SCALEV', 361852, 'USD', 361852, 1508.02, 4),
    (uid, '2026-03-29', NULL, inv_scale, 'SCALE', 293250, 'USD', 293250, 1508.02, 6),
    (uid, '2026-03-29', NULL, inv_gold, 'GCW00', 1034553, 'USD', 1034553, 1508.02, 4557.5),
    (uid, '2026-03-29', NULL, inv_silver, 'SIW00', 7057, 'USD', 7057, 1508.02, 70.57),
    (uid, '2026-03-29', NULL, inv_krew, 'Krew Fund', 30000000, 'KRW', 19893.75, 1508.02, NULL),
    (uid, '2026-03-29', NULL, inv_infobank_fund, '인포뱅크-서울바이오허브 메디컬 개인투자조합 2호', 50000000, 'KRW', 33156.25, 1508.02, NULL),
    (uid, '2026-03-29', NULL, inv_mobilix, '모빌릭스', 20000000, 'KRW', 13262.44, 1508.02, 200000),
    (uid, '2026-03-29', NULL, inv_mrmind, '미스터마인드', 40000000, 'KRW', 26524.89, 1508.02, 400000),
    (uid, '2026-03-29', NULL, inv_taeju, '태주', 70000000, 'KRW', 46418.56, 1508.02, 700000),
    (uid, '2026-03-29', NULL, inv_quad, '쿼드', 27000000, 'KRW', 17904.3, 1508.02, 270000),
    (uid, '2026-03-29', NULL, inv_starnex, '스타넥스', 3000000, 'KRW', 1989.37, 1508.02, 30000),
    (uid, '2026-03-29', NULL, inv_gravity, '그래비티랩스', 20000000, 'KRW', 13262.44, 1508.02, 200000);

  -- 2026-03-30
  INSERT INTO snapshots (user_id, date, holding_id, investment_id, ticker, value_native, currency, value_usd, fx_rate, price_per_unit) VALUES
    (uid, '2026-03-30', h_039290, NULL, '039290', 212809342, 'KRW', 140271, 1517.13, 4630.01),
    (uid, '2026-03-30', h_246720, NULL, '246720', 0, 'KRW', 0, 1517.13, NULL),
    (uid, '2026-03-30', h_000660, NULL, '000660', 0, 'KRW', 0, 1517.13, NULL),
    (uid, '2026-03-30', h_ceg, NULL, 'CEG', 29861, 'USD', 29861, 1517.13, 298.61),
    (uid, '2026-03-30', h_sgov, NULL, 'SGOV', 722236, 'USD', 722236, 1517.13, 100.66),
    (uid, '2026-03-30', h_tlt, NULL, 'TLT', 0, 'USD', 0, 1517.13, NULL),
    (uid, '2026-03-30', h_krw_sam, NULL, 'CASH_KRW', 1116700225, 'KRW', 736061, 1517.13, 1),
    (uid, '2026-03-30', h_sil, NULL, 'SIL', 151142, 'USD', 151142, 1517.13, 83.55),
    (uid, '2026-03-30', h_shld, NULL, 'SHLD', 113651, 'USD', 113651, 1517.13, 68.3),
    (uid, '2026-03-30', h_xle, NULL, 'XLE', 216736, 'USD', 216736, 1517.13, 61.96),
    (uid, '2026-03-30', h_soxx, NULL, 'SOXX', 0, 'USD', 0, 1517.13, NULL),
    (uid, '2026-03-30', h_botz, NULL, 'BOTZ', 18010, 'USD', 18010, 1517.13, 31.99),
    (uid, '2026-03-30', h_gev, NULL, 'GEV', 28607, 'USD', 28607, 1517.13, 817.34),
    (uid, '2026-03-30', h_googl, NULL, 'GOOGL', 51418, 'USD', 51418, 1517.13, 273.5),
    (uid, '2026-03-30', h_meta, NULL, 'META', 40765, 'USD', 40765, 1517.13, 536.38),
    (uid, '2026-03-30', h_msft, NULL, 'MSFT', 0, 'USD', 0, 1517.13, NULL),
    (uid, '2026-03-30', h_panw, NULL, 'PANW', 0, 'USD', 0, 1517.13, NULL),
    (uid, '2026-03-30', h_clrb, NULL, 'CLRB', 4180, 'USD', 4180, 1517.13, 2.61),
    (uid, '2026-03-30', h_usd, NULL, 'CASH_USD', 778745, 'USD', 778745, 1517.13, 1),
    (uid, '2026-03-30', h_schwab, NULL, 'SCHWAB2055', 146118, 'USD', 146118, 1517.13, 146118),
    (uid, '2026-03-30', h_krw_hana, NULL, 'CASH_KRW', 472058034, 'KRW', 311152, 1517.13, 1),
    (uid, '2026-03-30', NULL, inv_scalev, 'SCALEV', 361852, 'USD', 361852, 1517.13, 4),
    (uid, '2026-03-30', NULL, inv_scale, 'SCALE', 293250, 'USD', 293250, 1517.13, 6),
    (uid, '2026-03-30', NULL, inv_gold, 'GCW00', 1034553, 'USD', 1034553, 1517.13, 4557.5),
    (uid, '2026-03-30', NULL, inv_silver, 'SIW00', 7057, 'USD', 7057, 1517.13, 70.57),
    (uid, '2026-03-30', NULL, inv_krew, 'Krew Fund', 30000000, 'KRW', 19774.13, 1517.13, NULL),
    (uid, '2026-03-30', NULL, inv_infobank_fund, '인포뱅크-서울바이오허브 메디컬 개인투자조합 2호', 50000000, 'KRW', 32956.88, 1517.13, NULL),
    (uid, '2026-03-30', NULL, inv_mobilix, '모빌릭스', 20000000, 'KRW', 13182.78, 1517.13, 200000),
    (uid, '2026-03-30', NULL, inv_mrmind, '미스터마인드', 40000000, 'KRW', 26365.56, 1517.13, 400000),
    (uid, '2026-03-30', NULL, inv_taeju, '태주', 70000000, 'KRW', 46139.72, 1517.13, 700000),
    (uid, '2026-03-30', NULL, inv_quad, '쿼드', 27000000, 'KRW', 17796.75, 1517.13, 270000),
    (uid, '2026-03-30', NULL, inv_starnex, '스타넥스', 3000000, 'KRW', 1977.42, 1517.13, 30000),
    (uid, '2026-03-30', NULL, inv_gravity, '그래비티랩스', 20000000, 'KRW', 13182.78, 1517.13, 200000);

  -- 2026-03-31
  INSERT INTO snapshots (user_id, date, holding_id, investment_id, ticker, value_native, currency, value_usd, fx_rate, price_per_unit) VALUES
    (uid, '2026-03-31', h_039290, NULL, '039290', 217634430, 'KRW', 144672, 1504.33, 4734.99),
    (uid, '2026-03-31', h_246720, NULL, '246720', 0, 'KRW', 0, 1504.33, NULL),
    (uid, '2026-03-31', h_000660, NULL, '000660', 0, 'KRW', 0, 1504.33, NULL),
    (uid, '2026-03-31', h_ceg, NULL, 'CEG', 27925, 'USD', 27925, 1504.33, 279.25),
    (uid, '2026-03-31', h_sgov, NULL, 'SGOV', 722236, 'USD', 722236, 1504.33, 100.66),
    (uid, '2026-03-31', h_tlt, NULL, 'TLT', 0, 'USD', 0, 1504.33, NULL),
    (uid, '2026-03-31', h_krw_sam, NULL, 'CASH_KRW', 1116700263, 'KRW', 742324, 1504.33, 1),
    (uid, '2026-03-31', h_sil, NULL, 'SIL', 162955, 'USD', 162955, 1504.33, 90.08),
    (uid, '2026-03-31', h_shld, NULL, 'SHLD', 117878, 'USD', 117878, 1504.33, 70.84),
    (uid, '2026-03-31', h_xle, NULL, 'XLE', 214287, 'USD', 214287, 1504.33, 61.26),
    (uid, '2026-03-31', h_soxx, NULL, 'SOXX', 0, 'USD', 0, 1504.33, NULL),
    (uid, '2026-03-31', h_botz, NULL, 'BOTZ', 18703, 'USD', 18703, 1504.33, 33.22),
    (uid, '2026-03-31', h_gev, NULL, 'GEV', 30552, 'USD', 30552, 1504.33, 872.91),
    (uid, '2026-03-31', h_googl, NULL, 'GOOGL', 54061, 'USD', 54061, 1504.33, 287.56),
    (uid, '2026-03-31', h_meta, NULL, 'META', 43482, 'USD', 43482, 1504.33, 572.13),
    (uid, '2026-03-31', h_msft, NULL, 'MSFT', 0, 'USD', 0, 1504.33, NULL),
    (uid, '2026-03-31', h_panw, NULL, 'PANW', 0, 'USD', 0, 1504.33, NULL),
    (uid, '2026-03-31', h_clrb, NULL, 'CLRB', 4068, 'USD', 4068, 1504.33, 2.54),
    (uid, '2026-03-31', h_usd, NULL, 'CASH_USD', 778745, 'USD', 778745, 1504.33, 1),
    (uid, '2026-03-31', h_schwab, NULL, 'SCHWAB2055', 146118, 'USD', 146118, 1504.33, 146118),
    (uid, '2026-03-31', h_krw_hana, NULL, 'CASH_KRW', 472057250, 'KRW', 313799, 1504.33, 1),
    (uid, '2026-03-31', NULL, inv_scalev, 'SCALEV', 361852, 'USD', 361852, 1504.33, 4),
    (uid, '2026-03-31', NULL, inv_scale, 'SCALE', 293250, 'USD', 293250, 1504.33, 6),
    (uid, '2026-03-31', NULL, inv_gold, 'GCW00', 1062042, 'USD', 1062042, 1504.33, 4678.6),
    (uid, '2026-03-31', NULL, inv_silver, 'SIW00', 7492, 'USD', 7492, 1504.33, 74.92),
    (uid, '2026-03-31', NULL, inv_krew, 'Krew Fund', 30000000, 'KRW', 19942.5, 1504.33, NULL),
    (uid, '2026-03-31', NULL, inv_infobank_fund, '인포뱅크-서울바이오허브 메디컬 개인투자조합 2호', 50000000, 'KRW', 33237.5, 1504.33, NULL),
    (uid, '2026-03-31', NULL, inv_mobilix, '모빌릭스', 20000000, 'KRW', 13295, 1504.33, 200000),
    (uid, '2026-03-31', NULL, inv_mrmind, '미스터마인드', 40000000, 'KRW', 26590, 1504.33, 400000),
    (uid, '2026-03-31', NULL, inv_taeju, '태주', 70000000, 'KRW', 46532.5, 1504.33, 700000),
    (uid, '2026-03-31', NULL, inv_quad, '쿼드', 27000000, 'KRW', 17948.25, 1504.33, 270000),
    (uid, '2026-03-31', NULL, inv_starnex, '스타넥스', 3000000, 'KRW', 1994.25, 1504.33, 30000),
    (uid, '2026-03-31', NULL, inv_gravity, '그래비티랩스', 20000000, 'KRW', 13295, 1504.33, 200000);

  -- 2026-04-01
  INSERT INTO snapshots (user_id, date, holding_id, investment_id, ticker, value_native, currency, value_usd, fx_rate, price_per_unit) VALUES
    (uid, '2026-04-01', h_039290, NULL, '039290', 219013725, 'KRW', 144746, 1513.09, 4765),
    (uid, '2026-04-01', h_246720, NULL, '246720', 0, 'KRW', 0, 1513.09, NULL),
    (uid, '2026-04-01', h_000660, NULL, '000660', 0, 'KRW', 0, 1513.09, NULL),
    (uid, '2026-04-01', h_ceg, NULL, 'CEG', 27946, 'USD', 27946, 1513.09, 279.46),
    (uid, '2026-04-01', h_sgov, NULL, 'SGOV', 720298, 'USD', 720298, 1513.09, 100.39),
    (uid, '2026-04-01', h_tlt, NULL, 'TLT', 0, 'USD', 0, 1513.09, NULL),
    (uid, '2026-04-01', h_krw_sam, NULL, 'CASH_KRW', 1116701273, 'KRW', 738027, 1513.09, 1),
    (uid, '2026-04-01', h_sil, NULL, 'SIL', 168707, 'USD', 168707, 1513.09, 93.26),
    (uid, '2026-04-01', h_shld, NULL, 'SHLD', 122271, 'USD', 122271, 1513.09, 73.48),
    (uid, '2026-04-01', h_xle, NULL, 'XLE', 106028, 'USD', 106028, 1513.09, 58.97),
    (uid, '2026-04-01', h_soxx, NULL, 'SOXX', 0, 'USD', 0, 1513.09, NULL),
    (uid, '2026-04-01', h_botz, NULL, 'BOTZ', 19086, 'USD', 19086, 1513.09, 33.9),
    (uid, '2026-04-01', h_gev, NULL, 'GEV', 31317, 'USD', 31317, 1513.09, 894.77),
    (uid, '2026-04-01', h_googl, NULL, 'GOOGL', 55909, 'USD', 55909, 1513.09, 297.39),
    (uid, '2026-04-01', h_meta, NULL, 'META', 44021, 'USD', 44021, 1513.09, 579.22),
    (uid, '2026-04-01', h_msft, NULL, 'MSFT', 0, 'USD', 0, 1513.09, NULL),
    (uid, '2026-04-01', h_panw, NULL, 'PANW', 0, 'USD', 0, 1513.09, NULL),
    (uid, '2026-04-01', h_clrb, NULL, 'CLRB', 4004, 'USD', 4004, 1513.09, 2.5),
    (uid, '2026-04-01', h_usd, NULL, 'CASH_USD', 727020, 'USD', 727020, 1513.09, 1),
    (uid, '2026-04-01', h_schwab, NULL, 'SCHWAB2055', 151746, 'USD', 151746, 1513.09, 151746),
    (uid, '2026-04-01', h_krw_hana, NULL, 'CASH_KRW', 472058357, 'KRW', 311983, 1513.09, 1),
    (uid, '2026-04-01', NULL, inv_scalev, 'SCALEV', 390276, 'USD', 390276, 1513.09, 4),
    (uid, '2026-04-01', NULL, inv_scale, 'SCALE', 293250, 'USD', 293250, 1513.09, 6),
    (uid, '2026-04-01', NULL, inv_gold, 'GCW00', 1092574, 'USD', 1092574, 1513.09, 4813.1),
    (uid, '2026-04-01', NULL, inv_silver, 'SIW00', 7608, 'USD', 7608, 1513.09, 76.08),
    (uid, '2026-04-01', NULL, inv_krew, 'Krew Fund', 30000000, 'KRW', 19827, 1513.09, NULL),
    (uid, '2026-04-01', NULL, inv_infobank_fund, '인포뱅크-서울바이오허브 메디컬 개인투자조합 2호', 50000000, 'KRW', 33045, 1513.09, NULL),
    (uid, '2026-04-01', NULL, inv_mobilix, '모빌릭스', 20000000, 'KRW', 13218, 1513.09, 200000),
    (uid, '2026-04-01', NULL, inv_mrmind, '미스터마인드', 40000000, 'KRW', 26436, 1513.09, 400000),
    (uid, '2026-04-01', NULL, inv_taeju, '태주', 70000000, 'KRW', 46263, 1513.09, 700000),
    (uid, '2026-04-01', NULL, inv_quad, '쿼드', 27000000, 'KRW', 17844.3, 1513.09, 270000),
    (uid, '2026-04-01', NULL, inv_starnex, '스타넥스', 3000000, 'KRW', 1982.7, 1513.09, 30000),
    (uid, '2026-04-01', NULL, inv_gravity, '그래비티랩스', 20000000, 'KRW', 13218, 1513.09, 200000);

  RAISE NOTICE 'Seed complete: % snapshot dates, % accounts, % holdings, % investments',
    32, 4, 21, 12;

END $$;
