#!/usr/bin/env node
// Generate snapshot SQL for April 2-25, 2026
import { writeFileSync } from 'fs';

const ROWS = [
  ['2026-04-02',1510.22,134978,0,0,27282,720585,0,739429,167604,123069,106532,0,18804,31450,55605,43659,0,0,4084,727020,151746,390276,293250,1062292,312575,7292,52972,119188],
  ['2026-04-03',1511.26,135949,0,0,27516,720657,0,738920,166356,124434,107305,0,18911,31408,56398,43550,0,0,4341,727020,151746,390276,293250,1063427,312360,7285,52936,119106],
  ['2026-04-04',1511.26,134733,0,0,27516,720657,0,738920,166356,124434,107305,0,18911,31408,56398,43550,0,0,4341,727020,151746,390276,293250,1063427,312360,7285,52936,119106],
  ['2026-04-05',1510.26,134822,0,0,27516,720657,0,739410,166356,124434,107305,0,18911,31408,56398,43550,0,0,4341,727020,151746,390276,293250,1063427,312567,7285,52971,119185],
  ['2026-04-06',1508.85,134948,0,0,27516,720657,0,740101,166356,124434,107305,0,18911,31408,56398,43550,0,0,4341,727020,151746,390276,293250,1063427,312859,7285,53021,119296],
  ['2026-04-07',1500.16,144002,0,17097,27258,722939,0,724655,167948,123003,108168,0,28515,65574,115464,58080,0,0,4405,606744,153751,390276,293250,1063427,314672,7199,53328,119987],
  ['2026-04-08',1477.60,147445,0,19575,28427,722939,0,735719,173465,124733,104374,0,29992,67397,119947,61854,0,0,4421,606744,153751,390276,293250,1084424,319476,7539,54142,121819],
  ['2026-04-09',1474.28,155259,0,18954,28025,723011,0,737376,173049,123552,103079,0,29822,69697,120389,63467,0,0,4517,606744,153751,390276,293250,1093686,320195,7644,54264,122093],
  ['2026-04-10',1484.57,152480,0,19370,28650,723299,0,732367,174858,120973,102378,0,30257,71375,119917,63616,0,0,4421,606744,158590,394124,293250,1086740,318716,7648,53888,121247],
  ['2026-04-11',1484.57,150468,0,19615,29172,723370,0,732367,175961,124001,102684,0,30718,71361,121455,64088,0,0,4389,606744,158590,394124,293250,1082200,318716,7567,53888,121247],
  ['2026-04-12',1483.18,150609,0,19633,29172,723370,0,733053,175961,124001,102684,0,30718,71361,121455,64088,0,0,4389,606744,158590,394124,293250,1082200,319015,7567,53938,121361],
  ['2026-04-13',1483.18,150609,0,19633,29172,723370,0,733053,175961,124001,102684,0,30718,71361,121455,64088,0,0,4389,606744,158590,394124,293250,1082200,319015,7567,53938,121361],
  ['2026-04-14',1470.41,152855,0,21004,29661,723370,0,739556,180520,123685,100598,60988,31248,71100,125840,66911,0,10019,4725,535867,161701,394124,293250,1100973,321786,7953,54407,122415],
  ['2026-04-15',1475.06,156735,0,21564,29473,723514,0,737225,176540,124118,100256,61083,31367,70986,127431,67830,0,10175,4869,535867,161701,394124,293250,1094957,320771,7963,54235,122029],
  ['2026-04-16',1475.06,160786,0,63425,29914,723514,0,696616,175799,122703,101731,61704,31350,104680,127016,68364,0,30556,4821,481626,169617,394124,293250,1091484,320771,7871,54235,122029],
  ['2026-04-17',1478.92,160988,0,61780,29621,723730,0,694798,182673,122054,98926,63188,31948,107294,129155,69544,0,30717,4677,481626,169617,394124,293250,1107669,319934,8243,54094,121710],
  ['2026-04-18',1478.92,158812,0,63861,28756,723802,0,694798,179905,121455,99016,63468,32025,105949,127545,67762,0,31029,4725,481626,169617,394124,293250,1096138,319934,8062,54094,121710],
  ['2026-04-20',1470.26,159748,0,64238,28756,723802,0,699020,179905,121455,99016,63468,32025,105949,127545,67762,0,31029,4725,481842,171854,394124,293250,1096138,321818,8062,54412,122427],
  ['2026-04-21',1486.80,154261,0,66683,27770,723946,0,691244,170390,117295,100454,63946,31376,106069,125606,67553,0,32018,4549,481842,171854,394124,293250,1071349,318238,7704,53807,121065],
  ['2026-04-22',1478.96,157876,0,66982,28716,724018,0,694972,175708,116963,101659,126077,31914,120649,189341,68147,0,63964,4613,330416,169689,394124,293250,1078931,319925,7853,54092,121707],
  ['2026-04-23',1480.95,153939,0,67001,29277,724090,0,694038,170390,114533,102450,128772,31308,123000,189101,66574,0,61143,4469,330416,169689,394124,293250,1072348,319495,7606,54019,121544],
  ['2026-04-24',1476.64,155478,0,67032,31353,724306,0,696064,171620,112436,102252,134787,31905,122963,192175,68178,0,63025,4421,330416,169689,394124,293250,1076184,320428,7694,54177,121898],
  ['2026-04-25',1476.67,155475,0,67031,31353,724306,0,696050,171620,112436,102252,134787,31905,122963,192175,68178,0,63025,4421,330416,169689,394124,293250,1076184,320421,7694,54176,121896],
];

// Column indices: DATE=0, FX=1, then assets...
const COL = { '039290':2, '246720':3, '000660':4, CEG:5, SGOV:6, TLT:7, KRW_SAM:8, SIL:9, SHLD:10, XLE:11, SOXX:12, BOTZ:13, GEV:14, GOOGL:15, META:16, MSFT:17, PANW:18, CLRB:19, USD:20, SCHWAB:21, SCALEV:22, SCALE:23, GCW00:24, KRW_HANA:25, SIW00:26, FUND:27, ANGEL:28 };

// Holdings: key -> { ticker, currency, asset_type, colIdx }
const HOLDINGS = [
  { key: 'h_039290', ticker: '039290', currency: 'KRW', asset_type: 'stock', col: COL['039290'] },
  { key: 'h_246720', ticker: '246720', currency: 'KRW', asset_type: 'stock', col: COL['246720'] },
  { key: 'h_000660', ticker: '000660', currency: 'KRW', asset_type: 'stock', col: COL['000660'] },
  { key: 'h_ceg', ticker: 'CEG', currency: 'USD', asset_type: 'stock', col: COL.CEG },
  { key: 'h_sgov', ticker: 'SGOV', currency: 'USD', asset_type: 'etf', col: COL.SGOV },
  { key: 'h_tlt', ticker: 'TLT', currency: 'USD', asset_type: 'bond', col: COL.TLT },
  { key: 'h_krw_sam', ticker: 'CASH_KRW', currency: 'KRW', asset_type: 'cash', col: COL.KRW_SAM, account: 'samsung' },
  { key: 'h_sil', ticker: 'SIL', currency: 'USD', asset_type: 'etf', col: COL.SIL },
  { key: 'h_shld', ticker: 'SHLD', currency: 'USD', asset_type: 'etf', col: COL.SHLD },
  { key: 'h_xle', ticker: 'XLE', currency: 'USD', asset_type: 'etf', col: COL.XLE },
  { key: 'h_soxx', ticker: 'SOXX', currency: 'USD', asset_type: 'etf', col: COL.SOXX },
  { key: 'h_botz', ticker: 'BOTZ', currency: 'USD', asset_type: 'etf', col: COL.BOTZ },
  { key: 'h_gev', ticker: 'GEV', currency: 'USD', asset_type: 'stock', col: COL.GEV },
  { key: 'h_googl', ticker: 'GOOGL', currency: 'USD', asset_type: 'stock', col: COL.GOOGL },
  { key: 'h_meta', ticker: 'META', currency: 'USD', asset_type: 'stock', col: COL.META },
  { key: 'h_msft', ticker: 'MSFT', currency: 'USD', asset_type: 'stock', col: COL.MSFT },
  { key: 'h_panw', ticker: 'PANW', currency: 'USD', asset_type: 'stock', col: COL.PANW },
  { key: 'h_clrb', ticker: 'CLRB', currency: 'USD', asset_type: 'stock', col: COL.CLRB },
  { key: 'h_usd', ticker: 'CASH_USD', currency: 'USD', asset_type: 'cash', col: COL.USD },
  { key: 'h_schwab', ticker: 'SCHWAB2055', currency: 'USD', asset_type: 'index', col: COL.SCHWAB },
  { key: 'h_krw_hana', ticker: 'CASH_KRW', currency: 'KRW', asset_type: 'cash', col: COL.KRW_HANA, account: 'hana' },
  { key: 'h_gold', ticker: 'GCW00', currency: 'USD', asset_type: 'commodity', col: COL.GCW00 },
];

const INV_COL = { inv_scalev: COL.SCALEV, inv_scale: COL.SCALE, inv_silver: COL.SIW00 };
const INV_DEFS = [
  { key: 'inv_scalev', ticker: 'SCALEV', currency: 'USD' },
  { key: 'inv_scale', ticker: 'SCALE', currency: 'USD' },
  { key: 'inv_silver', ticker: 'SIW00', currency: 'USD' },
];

const FUND_LP = { total: 80_000_000, breakdown: { inv_krew: 30_000_000, inv_infobank_fund: 50_000_000 } };
const FUND_TICKERS = { inv_krew: 'Krew Fund', inv_infobank_fund: '인포뱅크-서울바이오허브 메디컬 개인투자조합 2호' };
const ANGEL = {
  total: 180_000_000,
  breakdown: { inv_mobilix: 20_000_000, inv_mrmind: 40_000_000, inv_taeju: 70_000_000, inv_quad: 27_000_000, inv_starnex: 3_000_000, inv_gravity: 20_000_000 }
};
const ANGEL_TICKERS = { inv_mobilix: '모빌릭스', inv_mrmind: '미스터마인드', inv_taeju: '태주', inv_quad: '쿼드', inv_starnex: '스타넥스', inv_gravity: '그래비티랩스' };

// Share counts by date (use nearest earlier date)
const SHARES_BY_DATE = {
  '2026-04-01': { h_039290:45963,h_246720:4588,h_000660:0,h_ceg:100,h_sgov:7175,h_tlt:0,h_krw_sam:1116700668,h_sil:1809,h_shld:1664,h_xle:1798,h_soxx:0,h_botz:563,h_gev:35,h_googl:188,h_meta:76,h_msft:0,h_panw:0,h_clrb:1602,h_usd:727020,h_schwab:1,h_krw_hana:472057725,h_gold:227,inv_scalev:97569,inv_scale:48875,inv_silver:100 },
  '2026-04-07': { h_039290:45963,h_246720:4588,h_000660:28,h_ceg:100,h_sgov:7197,h_tlt:0,h_krw_sam:1087098984,h_sil:1809,h_shld:1664,h_xle:1798,h_soxx:0,h_botz:854,h_gev:72,h_googl:378,h_meta:101,h_msft:0,h_panw:0,h_clrb:1602,h_usd:606744,h_schwab:1,h_krw_hana:472057725,h_gold:227,inv_scalev:97569,inv_scale:48875,inv_silver:100 },
  '2026-04-10': { h_039290:45963,h_246720:4588,h_000660:28,h_ceg:100,h_sgov:7197,h_tlt:0,h_krw_sam:1087249656,h_sil:1809,h_shld:1664,h_xle:1798,h_soxx:0,h_botz:854,h_gev:72,h_googl:378,h_meta:101,h_msft:0,h_panw:0,h_clrb:1602,h_usd:606744,h_schwab:1,h_krw_hana:473156634,h_gold:227,inv_scalev:98531,inv_scale:48875,inv_silver:100 },
  '2026-04-14': { h_039290:45963,h_246720:4588,h_000660:28,h_ceg:100,h_sgov:7197,h_tlt:0,h_krw_sam:1087450566,h_sil:1809,h_shld:1664,h_xle:1798,h_soxx:152,h_botz:854,h_gev:72,h_googl:378,h_meta:101,h_msft:0,h_panw:62,h_clrb:1602,h_usd:535867,h_schwab:1,h_krw_hana:473156634,h_gold:227,inv_scalev:98531,inv_scale:48875,inv_silver:100 },
  '2026-04-16': { h_039290:45963,h_246720:4588,h_000660:81,h_ceg:100,h_sgov:7197,h_tlt:0,h_krw_sam:1027551010,h_sil:1809,h_shld:1664,h_xle:1798,h_soxx:152,h_botz:854,h_gev:72,h_googl:378,h_meta:101,h_msft:0,h_panw:183,h_clrb:1602,h_usd:481626,h_schwab:1,h_krw_hana:473156634,h_gold:227,inv_scalev:98531,inv_scale:48875,inv_silver:100 },
  '2026-04-20': { h_039290:45963,h_246720:4588,h_000660:81,h_ceg:100,h_sgov:7197,h_tlt:0,h_krw_sam:1027740839,h_sil:1809,h_shld:1664,h_xle:1798,h_soxx:152,h_botz:854,h_gev:107,h_googl:378,h_meta:101,h_msft:0,h_panw:183,h_clrb:1602,h_usd:481842,h_schwab:1,h_krw_hana:473156634,h_gold:227,inv_scalev:98531,inv_scale:48875,inv_silver:100 },
  '2026-04-22': { h_039290:45963,h_246720:4588,h_000660:81,h_ceg:100,h_sgov:7197,h_tlt:0,h_krw_sam:1027835741,h_sil:1809,h_shld:1664,h_xle:1798,h_soxx:292,h_botz:854,h_gev:107,h_googl:558,h_meta:101,h_msft:0,h_panw:353,h_clrb:1602,h_usd:330416,h_schwab:1,h_krw_hana:473156634,h_gold:227,inv_scalev:98531,inv_scale:48875,inv_silver:100 },
};

const shareDates = Object.keys(SHARES_BY_DATE).sort();
function getShares(date) {
  let best = shareDates[0];
  for (const sd of shareDates) {
    if (sd <= date) best = sd; else break;
  }
  return SHARES_BY_DATE[best];
}

const esc = (v) => v === null || v === undefined ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`;
const num = (v) => v === null || v === undefined ? 'NULL' : String(v);

// Generate SQL
let sql = `-- Snapshot data for April 2-25, 2026\n`;
sql += `INSERT INTO snapshots (user_id, date, holding_id, investment_id, ticker, value_native, currency, value_usd, fx_rate, price_per_unit) VALUES\n`;

const allValues = [];
for (const row of ROWS) {
  const date = row[0];
  const fx = row[1];
  const shares = getShares(date);
  const uid = `(SELECT id FROM auth.users LIMIT 1)`;

  // Holdings
  for (const h of HOLDINGS) {
    const valueUsd = row[h.col];
    if (valueUsd === undefined) continue;
    const isKRW = h.currency === 'KRW';
    const valueNative = isKRW ? Math.round(valueUsd * fx) : valueUsd;
    const shareCount = shares[h.key] || 0;
    let ppu = 'NULL';
    if (shareCount > 0 && valueNative > 0) {
      ppu = h.asset_type === 'cash' ? '1' : String(Math.round((valueNative / shareCount) * 100) / 100);
    }
    // Look up holding_id by ticker + account
    let hid;
    if (h.ticker === 'CASH_KRW' && h.account === 'samsung') {
      hid = `(SELECT h.id FROM holdings h JOIN accounts a ON h.account_id=a.id WHERE h.ticker='CASH_KRW' AND a.name='삼성증권' LIMIT 1)`;
    } else if (h.ticker === 'CASH_KRW' && h.account === 'hana') {
      hid = `(SELECT h.id FROM holdings h JOIN accounts a ON h.account_id=a.id WHERE h.ticker='CASH_KRW' AND a.name='하나은행' LIMIT 1)`;
    } else {
      hid = `(SELECT id FROM holdings WHERE ticker=${esc(h.ticker)} LIMIT 1)`;
    }
    allValues.push(`  (${uid}, ${esc(date)}, ${hid}, NULL, ${esc(h.ticker)}, ${num(valueNative)}, ${esc(h.currency)}, ${num(valueUsd)}, ${num(fx)}, ${ppu})`);
  }

  // Investments (Scale, Silver)
  for (const inv of INV_DEFS) {
    const colIdx = INV_COL[inv.key];
    const valueUsd = row[colIdx];
    const valueNative = valueUsd;
    const qty = shares[inv.key] || 0;
    let ppu = 'NULL';
    if (qty > 0 && valueNative > 0) ppu = String(Math.round((valueNative / qty) * 100) / 100);
    const iid = `(SELECT id FROM private_investments WHERE ticker=${esc(inv.ticker)} AND is_deleted=false LIMIT 1)`;
    allValues.push(`  (${uid}, ${esc(date)}, NULL, ${iid}, ${esc(inv.ticker)}, ${num(valueNative)}, ${esc(inv.currency)}, ${num(valueUsd)}, ${num(fx)}, ${ppu})`);
  }

  // Fund LP
  const fundUsd = row[COL.FUND];
  for (const [invKey, krwVal] of Object.entries(FUND_LP.breakdown)) {
    const prop = krwVal / FUND_LP.total;
    const vUsd = Math.round(fundUsd * prop * 100) / 100;
    const ticker = FUND_TICKERS[invKey];
    const iid = `(SELECT id FROM private_investments WHERE name=${esc(ticker)} AND is_deleted=false LIMIT 1)`;
    allValues.push(`  (${uid}, ${esc(date)}, NULL, ${iid}, ${esc(ticker)}, ${num(krwVal)}, 'KRW', ${num(vUsd)}, ${num(fx)}, NULL)`);
  }

  // Angel
  const angelUsd = row[COL.ANGEL];
  for (const [invKey, krwVal] of Object.entries(ANGEL.breakdown)) {
    const prop = krwVal / ANGEL.total;
    const vUsd = Math.round(angelUsd * prop * 100) / 100;
    const ticker = ANGEL_TICKERS[invKey];
    const ppu = krwVal / 100;
    const iid = `(SELECT id FROM private_investments WHERE name=${esc(ticker)} AND is_deleted=false LIMIT 1)`;
    allValues.push(`  (${uid}, ${esc(date)}, NULL, ${iid}, ${esc(ticker)}, ${num(krwVal)}, 'KRW', ${num(vUsd)}, ${num(fx)}, ${num(ppu)})`);
  }
}

// Split into chunks of ~250 rows each (to stay within MCP limits)
const chunkSize = 250;
for (let i = 0; i < allValues.length; i += chunkSize) {
  const chunk = allValues.slice(i, i + chunkSize);
  const partNum = Math.floor(i / chunkSize) + 1;
  let partSql = `INSERT INTO snapshots (user_id, date, holding_id, investment_id, ticker, value_native, currency, value_usd, fx_rate, price_per_unit) VALUES\n`;
  partSql += chunk.join(',\n') + ';\n';
  writeFileSync(`supabase/snapshot_apr_part${partNum}.sql`, partSql);
}

console.log(`Generated ${Math.ceil(allValues.length / chunkSize)} SQL files with ${allValues.length} total rows`);
