INSERT INTO snapshots (user_id, date, holding_id, investment_id, ticker, value_native, currency, value_usd, fx_rate, price_per_unit) VALUES
  ((SELECT id FROM auth.users LIMIT 1), '2026-04-25', NULL, (SELECT id FROM private_investments WHERE ticker='SIW00' AND is_deleted=false LIMIT 1), 'SIW00', 7694, 'USD', 7694, 1476.67, 76.94),
  ((SELECT id FROM auth.users LIMIT 1), '2026-04-25', NULL, (SELECT id FROM private_investments WHERE name='Krew Fund' AND is_deleted=false LIMIT 1), 'Krew Fund', 30000000, 'KRW', 20316, 1476.67, NULL),
  ((SELECT id FROM auth.users LIMIT 1), '2026-04-25', NULL, (SELECT id FROM private_investments WHERE name='인포뱅크-서울바이오허브 메디컬 개인투자조합 2호' AND is_deleted=false LIMIT 1), '인포뱅크-서울바이오허브 메디컬 개인투자조합 2호', 50000000, 'KRW', 33860, 1476.67, NULL),
  ((SELECT id FROM auth.users LIMIT 1), '2026-04-25', NULL, (SELECT id FROM private_investments WHERE name='모빌릭스' AND is_deleted=false LIMIT 1), '모빌릭스', 20000000, 'KRW', 13544, 1476.67, 200000),
  ((SELECT id FROM auth.users LIMIT 1), '2026-04-25', NULL, (SELECT id FROM private_investments WHERE name='미스터마인드' AND is_deleted=false LIMIT 1), '미스터마인드', 40000000, 'KRW', 27088, 1476.67, 400000),
  ((SELECT id FROM auth.users LIMIT 1), '2026-04-25', NULL, (SELECT id FROM private_investments WHERE name='태주' AND is_deleted=false LIMIT 1), '태주', 70000000, 'KRW', 47404, 1476.67, 700000),
  ((SELECT id FROM auth.users LIMIT 1), '2026-04-25', NULL, (SELECT id FROM private_investments WHERE name='쿼드' AND is_deleted=false LIMIT 1), '쿼드', 27000000, 'KRW', 18284.4, 1476.67, 270000),
  ((SELECT id FROM auth.users LIMIT 1), '2026-04-25', NULL, (SELECT id FROM private_investments WHERE name='스타넥스' AND is_deleted=false LIMIT 1), '스타넥스', 3000000, 'KRW', 2031.6, 1476.67, 30000),
  ((SELECT id FROM auth.users LIMIT 1), '2026-04-25', NULL, (SELECT id FROM private_investments WHERE name='그래비티랩스' AND is_deleted=false LIMIT 1), '그래비티랩스', 20000000, 'KRW', 13544, 1476.67, 200000);
