
-- Part 1: Setup accounts, holdings, private investments
DROP TABLE IF EXISTS _seed_ids;
CREATE TABLE _seed_ids (key TEXT PRIMARY KEY, id UUID);

DO $$
DECLARE
  uid UUID;
  new_id UUID;
BEGIN
  SELECT id INTO uid FROM auth.users LIMIT 1;
  IF uid IS NULL THEN RAISE EXCEPTION 'No user found'; END IF;

  -- Accounts
  INSERT INTO accounts (user_id, name, type, country) VALUES (uid, '삼성증권', 'brokerage', 'KR') RETURNING id INTO new_id;
  INSERT INTO _seed_ids VALUES ('acc_samsung', new_id);
  INSERT INTO accounts (user_id, name, type, country) VALUES (uid, 'Robinhood', 'brokerage', 'US') RETURNING id INTO new_id;
  INSERT INTO _seed_ids VALUES ('acc_robinhood', new_id);
  INSERT INTO accounts (user_id, name, type, country) VALUES (uid, 'Charles Schwab', 'brokerage', 'US') RETURNING id INTO new_id;
  INSERT INTO _seed_ids VALUES ('acc_schwab', new_id);
  INSERT INTO accounts (user_id, name, type, country) VALUES (uid, '하나은행', 'savings', 'KR') RETURNING id INTO new_id;
  INSERT INTO _seed_ids VALUES ('acc_hana', new_id);

  -- Holdings
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, (SELECT id FROM _seed_ids WHERE key='acc_samsung'), '039290', 'InfoBankCorp', 'stock', 45963, 'KRW') RETURNING id INTO new_id;
  INSERT INTO _seed_ids VALUES ('h_039290', new_id);
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, (SELECT id FROM _seed_ids WHERE key='acc_samsung'), '246720', 'Asta Co Ltd', 'stock', 4588, 'KRW') RETURNING id INTO new_id;
  INSERT INTO _seed_ids VALUES ('h_246720', new_id);
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, (SELECT id FROM _seed_ids WHERE key='acc_samsung'), '000660', 'SK Hynix Inc', 'stock', 81, 'KRW') RETURNING id INTO new_id;
  INSERT INTO _seed_ids VALUES ('h_000660', new_id);
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, (SELECT id FROM _seed_ids WHERE key='acc_samsung'), 'CEG', 'Constellation Energy Corp', 'stock', 100, 'USD') RETURNING id INTO new_id;
  INSERT INTO _seed_ids VALUES ('h_ceg', new_id);
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, (SELECT id FROM _seed_ids WHERE key='acc_samsung'), 'SGOV', 'iShares 0-3 Month Treasury Bond ETF', 'etf', 7197, 'USD') RETURNING id INTO new_id;
  INSERT INTO _seed_ids VALUES ('h_sgov', new_id);
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, (SELECT id FROM _seed_ids WHERE key='acc_samsung'), 'TLT', 'iShares 20+ Year Treasury Bond ETF', 'bond', 0, 'USD') RETURNING id INTO new_id;
  INSERT INTO _seed_ids VALUES ('h_tlt', new_id);
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, (SELECT id FROM _seed_ids WHERE key='acc_samsung'), 'CASH_KRW', 'KRW Cash', 'cash', 1027835741, 'KRW') RETURNING id INTO new_id;
  INSERT INTO _seed_ids VALUES ('h_krw_sam', new_id);
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, (SELECT id FROM _seed_ids WHERE key='acc_robinhood'), 'SIL', 'Global X Silver Miners ETF', 'etf', 1809, 'USD') RETURNING id INTO new_id;
  INSERT INTO _seed_ids VALUES ('h_sil', new_id);
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, (SELECT id FROM _seed_ids WHERE key='acc_robinhood'), 'SHLD', 'Global X Defense Tech ETF', 'etf', 1664, 'USD') RETURNING id INTO new_id;
  INSERT INTO _seed_ids VALUES ('h_shld', new_id);
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, (SELECT id FROM _seed_ids WHERE key='acc_robinhood'), 'XLE', 'Energy Select Sector SPDR ETF', 'etf', 1798, 'USD') RETURNING id INTO new_id;
  INSERT INTO _seed_ids VALUES ('h_xle', new_id);
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, (SELECT id FROM _seed_ids WHERE key='acc_robinhood'), 'SOXX', 'iShares Semiconductor ETF', 'etf', 292, 'USD') RETURNING id INTO new_id;
  INSERT INTO _seed_ids VALUES ('h_soxx', new_id);
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, (SELECT id FROM _seed_ids WHERE key='acc_robinhood'), 'BOTZ', 'Global X Robotics & AI ETF', 'etf', 854, 'USD') RETURNING id INTO new_id;
  INSERT INTO _seed_ids VALUES ('h_botz', new_id);
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, (SELECT id FROM _seed_ids WHERE key='acc_robinhood'), 'GEV', 'GE Vernova Inc', 'stock', 107, 'USD') RETURNING id INTO new_id;
  INSERT INTO _seed_ids VALUES ('h_gev', new_id);
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, (SELECT id FROM _seed_ids WHERE key='acc_robinhood'), 'GOOGL', 'Alphabet Inc Class A', 'stock', 558, 'USD') RETURNING id INTO new_id;
  INSERT INTO _seed_ids VALUES ('h_googl', new_id);
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, (SELECT id FROM _seed_ids WHERE key='acc_robinhood'), 'META', 'Meta Platforms Inc', 'stock', 101, 'USD') RETURNING id INTO new_id;
  INSERT INTO _seed_ids VALUES ('h_meta', new_id);
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, (SELECT id FROM _seed_ids WHERE key='acc_robinhood'), 'MSFT', 'Microsoft Corp', 'stock', 0, 'USD') RETURNING id INTO new_id;
  INSERT INTO _seed_ids VALUES ('h_msft', new_id);
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, (SELECT id FROM _seed_ids WHERE key='acc_robinhood'), 'PANW', 'Palo Alto Networks Inc', 'stock', 353, 'USD') RETURNING id INTO new_id;
  INSERT INTO _seed_ids VALUES ('h_panw', new_id);
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, (SELECT id FROM _seed_ids WHERE key='acc_robinhood'), 'CLRB', 'Cellectar Biosciences Inc', 'stock', 1602, 'USD') RETURNING id INTO new_id;
  INSERT INTO _seed_ids VALUES ('h_clrb', new_id);
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, (SELECT id FROM _seed_ids WHERE key='acc_robinhood'), 'CASH_USD', 'USD Cash', 'cash', 330416, 'USD') RETURNING id INTO new_id;
  INSERT INTO _seed_ids VALUES ('h_usd', new_id);
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, (SELECT id FROM _seed_ids WHERE key='acc_schwab'), 'SCHWAB2055', 'Schwab Target 2055 Index Fund', 'index', 1, 'USD') RETURNING id INTO new_id;
  INSERT INTO _seed_ids VALUES ('h_schwab', new_id);
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, (SELECT id FROM _seed_ids WHERE key='acc_hana'), 'CASH_KRW', 'KRW Cash', 'cash', 473156634, 'KRW') RETURNING id INTO new_id;
  INSERT INTO _seed_ids VALUES ('h_krw_hana', new_id);
  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)
    VALUES (uid, (SELECT id FROM _seed_ids WHERE key='acc_hana'), 'GCW00', 'Gold', 'commodity', 227, 'USD') RETURNING id INTO new_id;
  INSERT INTO _seed_ids VALUES ('h_gold', new_id);

  -- Private Investments
  INSERT INTO private_investments (user_id, asset_type, name, price_per_unit, currency, quantity, unit_label, ticker, price_source)
    VALUES (uid, 'stock', 'Scale - Vested', 4.0, 'USD', 97569, NULL, 'SCALEV', 'manual') RETURNING id INTO new_id;
  INSERT INTO _seed_ids VALUES ('inv_scalev', new_id);
  INSERT INTO private_investments (user_id, asset_type, name, price_per_unit, currency, quantity, unit_label, ticker, price_source)
    VALUES (uid, 'stock', 'Scale', 6.0, 'USD', 48875, NULL, 'SCALE', 'manual') RETURNING id INTO new_id;
  INSERT INTO _seed_ids VALUES ('inv_scale', new_id);
  INSERT INTO private_investments (user_id, asset_type, name, price_per_unit, currency, quantity, unit_label, ticker, price_source)
    VALUES (uid, 'commodity', 'Silver', 76.08, 'USD', 100, 'oz', 'SIW00', 'comex') RETURNING id INTO new_id;
  INSERT INTO _seed_ids VALUES ('inv_silver', new_id);
  INSERT INTO private_investments (user_id, asset_type, name, price_per_unit, currency, quantity, unit_label, ticker, price_source)
    VALUES (uid, 'lp', 'Krew Fund', 30000000, 'KRW', 1, NULL, NULL, 'manual') RETURNING id INTO new_id;
  INSERT INTO _seed_ids VALUES ('inv_krew', new_id);
  INSERT INTO private_investments (user_id, asset_type, name, price_per_unit, currency, quantity, unit_label, ticker, price_source)
    VALUES (uid, 'lp', '인포뱅크-서울바이오허브 메디컬 개인투자조합 2호', 50000000, 'KRW', 1, NULL, NULL, 'manual') RETURNING id INTO new_id;
  INSERT INTO _seed_ids VALUES ('inv_infobank_fund', new_id);
  INSERT INTO private_investments (user_id, asset_type, name, price_per_unit, currency, quantity, unit_label, ticker, price_source)
    VALUES (uid, 'stock', '모빌릭스', 200000, 'KRW', 100, NULL, NULL, 'manual') RETURNING id INTO new_id;
  INSERT INTO _seed_ids VALUES ('inv_mobilix', new_id);
  INSERT INTO private_investments (user_id, asset_type, name, price_per_unit, currency, quantity, unit_label, ticker, price_source)
    VALUES (uid, 'stock', '미스터마인드', 400000, 'KRW', 100, NULL, NULL, 'manual') RETURNING id INTO new_id;
  INSERT INTO _seed_ids VALUES ('inv_mrmind', new_id);
  INSERT INTO private_investments (user_id, asset_type, name, price_per_unit, currency, quantity, unit_label, ticker, price_source)
    VALUES (uid, 'stock', '태주', 700000, 'KRW', 100, NULL, NULL, 'manual') RETURNING id INTO new_id;
  INSERT INTO _seed_ids VALUES ('inv_taeju', new_id);
  INSERT INTO private_investments (user_id, asset_type, name, price_per_unit, currency, quantity, unit_label, ticker, price_source)
    VALUES (uid, 'stock', '쿼드', 270000, 'KRW', 100, NULL, NULL, 'manual') RETURNING id INTO new_id;
  INSERT INTO _seed_ids VALUES ('inv_quad', new_id);
  INSERT INTO private_investments (user_id, asset_type, name, price_per_unit, currency, quantity, unit_label, ticker, price_source)
    VALUES (uid, 'stock', '스타넥스', 30000, 'KRW', 100, NULL, NULL, 'manual') RETURNING id INTO new_id;
  INSERT INTO _seed_ids VALUES ('inv_starnex', new_id);
  INSERT INTO private_investments (user_id, asset_type, name, price_per_unit, currency, quantity, unit_label, ticker, price_source)
    VALUES (uid, 'stock', '그래비티랩스', 200000, 'KRW', 100, NULL, NULL, 'manual') RETURNING id INTO new_id;
  INSERT INTO _seed_ids VALUES ('inv_gravity', new_id);

END $$;
