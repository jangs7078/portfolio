#!/usr/bin/env node
// Generate chunked seed SQL files for Supabase MCP execute_sql
// Run: node supabase/generate-seed-v2.mjs
import { writeFileSync } from 'fs';

// ─── Data (same as v1) ───

const HOLDINGS = [
  { key: 'h_039290', account: 'samsung', ticker: '039290', name: 'InfoBankCorp', asset_type: 'stock', currency: 'KRW' },
  { key: 'h_246720', account: 'samsung', ticker: '246720', name: 'Asta Co Ltd', asset_type: 'stock', currency: 'KRW' },
  { key: 'h_000660', account: 'samsung', ticker: '000660', name: 'SK Hynix Inc', asset_type: 'stock', currency: 'KRW' },
  { key: 'h_ceg', account: 'samsung', ticker: 'CEG', name: 'Constellation Energy Corp', asset_type: 'stock', currency: 'USD' },
  { key: 'h_sgov', account: 'samsung', ticker: 'SGOV', name: 'iShares 0-3 Month Treasury Bond ETF', asset_type: 'etf', currency: 'USD' },
  { key: 'h_tlt', account: 'samsung', ticker: 'TLT', name: 'iShares 20+ Year Treasury Bond ETF', asset_type: 'bond', currency: 'USD' },
  { key: 'h_krw_sam', account: 'samsung', ticker: 'CASH_KRW', name: 'KRW Cash', asset_type: 'cash', currency: 'KRW' },
  { key: 'h_sil', account: 'robinhood', ticker: 'SIL', name: 'Global X Silver Miners ETF', asset_type: 'etf', currency: 'USD' },
  { key: 'h_shld', account: 'robinhood', ticker: 'SHLD', name: 'Global X Defense Tech ETF', asset_type: 'etf', currency: 'USD' },
  { key: 'h_xle', account: 'robinhood', ticker: 'XLE', name: 'Energy Select Sector SPDR ETF', asset_type: 'etf', currency: 'USD' },
  { key: 'h_soxx', account: 'robinhood', ticker: 'SOXX', name: 'iShares Semiconductor ETF', asset_type: 'etf', currency: 'USD' },
  { key: 'h_botz', account: 'robinhood', ticker: 'BOTZ', name: 'Global X Robotics & AI ETF', asset_type: 'etf', currency: 'USD' },
  { key: 'h_gev', account: 'robinhood', ticker: 'GEV', name: 'GE Vernova Inc', asset_type: 'stock', currency: 'USD' },
  { key: 'h_googl', account: 'robinhood', ticker: 'GOOGL', name: 'Alphabet Inc Class A', asset_type: 'stock', currency: 'USD' },
  { key: 'h_meta', account: 'robinhood', ticker: 'META', name: 'Meta Platforms Inc', asset_type: 'stock', currency: 'USD' },
  { key: 'h_msft', account: 'robinhood', ticker: 'MSFT', name: 'Microsoft Corp', asset_type: 'stock', currency: 'USD' },
  { key: 'h_panw', account: 'robinhood', ticker: 'PANW', name: 'Palo Alto Networks Inc', asset_type: 'stock', currency: 'USD' },
  { key: 'h_clrb', account: 'robinhood', ticker: 'CLRB', name: 'Cellectar Biosciences Inc', asset_type: 'stock', currency: 'USD' },
  { key: 'h_usd', account: 'robinhood', ticker: 'CASH_USD', name: 'USD Cash', asset_type: 'cash', currency: 'USD' },
  { key: 'h_schwab', account: 'schwab', ticker: 'SCHWAB2055', name: 'Schwab Target 2055 Index Fund', asset_type: 'index', currency: 'USD' },
  { key: 'h_krw_hana', account: 'hana', ticker: 'CASH_KRW', name: 'KRW Cash', asset_type: 'cash', currency: 'KRW' },
  { key: 'h_gold', account: 'hana', ticker: 'GCW00', name: 'Gold', asset_type: 'commodity', currency: 'USD' },
];

const INVESTMENTS = [
  { key: 'inv_scalev', asset_type: 'stock', name: 'Scale - Vested', currency: 'USD', ticker: 'SCALEV', price_source: 'manual' },
  { key: 'inv_scale', asset_type: 'stock', name: 'Scale', currency: 'USD', ticker: 'SCALE', price_source: 'manual' },
  { key: 'inv_silver', asset_type: 'commodity', name: 'Silver', currency: 'USD', ticker: 'SIW00', price_source: 'comex' },
  { key: 'inv_krew', asset_type: 'lp', name: 'Krew Fund', currency: 'KRW', ticker: null, price_source: 'manual' },
  { key: 'inv_infobank_fund', asset_type: 'lp', name: '인포뱅크-서울바이오허브 메디컬 개인투자조합 2호', currency: 'KRW', ticker: null, price_source: 'manual' },
  { key: 'inv_mobilix', asset_type: 'stock', name: '모빌릭스', currency: 'KRW', ticker: null, price_source: 'manual' },
  { key: 'inv_mrmind', asset_type: 'stock', name: '미스터마인드', currency: 'KRW', ticker: null, price_source: 'manual' },
  { key: 'inv_taeju', asset_type: 'stock', name: '태주', currency: 'KRW', ticker: null, price_source: 'manual' },
  { key: 'inv_quad', asset_type: 'stock', name: '쿼드', currency: 'KRW', ticker: null, price_source: 'manual' },
  { key: 'inv_starnex', asset_type: 'stock', name: '스타넥스', currency: 'KRW', ticker: null, price_source: 'manual' },
  { key: 'inv_gravity', asset_type: 'stock', name: '그래비티랩스', currency: 'KRW', ticker: null, price_source: 'manual' },
];

const FUND_LP = { total: 80_000_000, breakdown: { inv_krew: 30_000_000, inv_infobank_fund: 50_000_000 } };
const ANGEL = {
  total: 180_000_000,
  breakdown: { inv_mobilix: 20_000_000, inv_mrmind: 40_000_000, inv_taeju: 70_000_000, inv_quad: 27_000_000, inv_starnex: 3_000_000, inv_gravity: 20_000_000 }
};

const INV_CURRENT = {
  inv_scalev: { price_per_unit: 4.0, quantity: 97569 },
  inv_scale: { price_per_unit: 6.0, quantity: 48875 },
  inv_silver: { price_per_unit: 76.08, quantity: 100, unit_label: 'oz' },
  inv_krew: { price_per_unit: 30_000_000, quantity: 1 },
  inv_infobank_fund: { price_per_unit: 50_000_000, quantity: 1 },
  inv_mobilix: { price_per_unit: 200_000, quantity: 100 },
  inv_mrmind: { price_per_unit: 400_000, quantity: 100 },
  inv_taeju: { price_per_unit: 700_000, quantity: 100 },
  inv_quad: { price_per_unit: 270_000, quantity: 100 },
  inv_starnex: { price_per_unit: 30_000, quantity: 100 },
  inv_gravity: { price_per_unit: 200_000, quantity: 100 },
};

const CURRENT_SHARES = {
  h_039290: 45963, h_246720: 4588, h_000660: 81, h_ceg: 100,
  h_sgov: 7197, h_tlt: 0, h_krw_sam: 1027835741,
  h_sil: 1809, h_shld: 1664, h_xle: 1798, h_soxx: 292,
  h_botz: 854, h_gev: 107, h_googl: 558, h_meta: 101,
  h_msft: 0, h_panw: 353, h_clrb: 1602, h_usd: 330416,
  h_schwab: 1, h_krw_hana: 473156634, h_gold: 227,
};

const SNAPSHOT_DATA = [
  ['2026-03-01',1438.50,157843,22454,0,32716,329447,398854,776049,0,67272,65596,0,0,10574,37702,28103,9964,0,4789,1229915,141146,358000,293250,1205733,328160,8885,55613,125130],
  ['2026-03-02',1452.27,156346,22241,0,32716,329447,398854,768691,20122,67272,65596,0,10044,10574,37702,28103,0,0,4789,1209757,140540,358000,293250,1205733,325048,8885,55086,123944],
  ['2026-03-03',1452.27,156346,22241,0,32487,329513,398053,768691,18328,67019,64998,0,9705,10104,37340,28168,0,0,4292,1209757,140540,358000,293250,1163080,325048,8347,55086,123944],
  ['2026-03-04',1460.75,125861,20573,0,32285,329513,396807,764229,57604,67473,64619,0,9765,10095,37285,28712,0,0,4645,1169892,139206,358000,293250,1165577,323161,8318,54766,123224],
  ['2026-03-05',1479.51,134983,23878,0,33207,329546,395204,754538,54881,65457,64952,0,9621,9780,37008,28405,0,0,4437,1169892,139206,358000,293250,1152865,319064,8218,54072,121662],
  ['2026-03-06',1484.29,139348,23121,0,31906,329677,393735,752108,54259,67412,65056,0,9492,9471,36718,27729,0,0,4421,1169892,139206,358000,293250,1171025,318036,8431,53898,121270],
  ['2026-03-07',1483.89,130558,23034,0,32299,329710,397163,752311,54913,68093,64768,0,9492,9961,37682,27838,0,0,4405,1169892,139206,358000,293250,1158540,318122,8452,53912,121303],
  ['2026-03-08',1483.89,130558,23034,0,32299,329710,397163,752311,54913,68093,64768,0,9492,9961,37682,27838,0,0,4405,1169892,139206,358000,293250,1158540,318122,8452,53912,121303],
  ['2026-03-09',1464.47,132290,23340,0,32299,720801,0,761797,54913,68093,124524,0,9492,9961,37682,27838,0,0,4405,1109958,139206,358000,293250,1158540,322340,8452,54627,122911],
  ['2026-03-10',1472.78,136380,22897,0,31709,720801,0,757498,56334,67080,122932,0,9542,10070,37766,28125,0,0,4885,1109958,141094,361852,293250,1189957,320522,8959,54319,122218],
  ['2026-03-11',1475.34,140038,22577,0,30069,720944,0,756254,116143,125865,125983,0,9547,10172,37970,28159,0,0,4741,989852,141094,361852,293250,1175656,319965,8554,54225,122006],
  ['2026-03-12',1470.58,141898,22713,0,30155,721016,0,758702,112951,126464,127155,0,9360,9985,37337,27442,0,0,5173,989852,141094,361852,293250,1163557,321001,8511,54400,122401],
  ['2026-03-13',1501.85,142922,22698,0,30177,721231,0,742905,106748,125815,127575,0,9160,9660,37180,26390,0,0,5125,989852,141094,361852,293250,1149006,314317,8134,53268,119852],
  ['2026-03-14',1501.75,140024,22333,0,30558,721231,0,742954,107732,127562,128017,0,9308,9928,37584,26980,0,0,5237,989852,141094,361852,293250,1135499,314338,8068,53271,119860],
  ['2026-03-15',1501.75,140024,22333,0,30558,721231,0,742954,107732,127562,128017,0,9308,9928,37584,26980,0,0,5237,989852,141094,361852,293250,1135499,314338,8068,53271,119860],
  ['2026-03-16',1488.91,141231,22525,0,30558,721231,0,749361,107732,127562,128017,0,9308,9928,37584,26980,0,0,5237,989852,141094,361852,293250,1135499,317049,8068,53731,120894],
  ['2026-03-17',1484.87,140842,22648,0,30769,721375,0,751400,106646,128012,129366,0,9305,10129,38243,26774,0,0,5286,989852,141094,361852,293250,1136861,317912,7992,53877,121223],
  ['2026-03-18',1505.25,138324,20848,0,31722,721446,0,741227,158957,126564,129189,0,19621,20603,57846,46792,0,0,5205,868663,148567,361852,293250,1111437,313608,7759,53147,119581],
  ['2026-03-19',1489.84,141297,20171,0,31647,721446,0,748894,149876,126264,131245,0,19637,21057,57740,46109,0,0,5093,868663,148567,361852,293250,1045494,316851,7122,53697,120818],
  ['2026-03-20',1504.31,141772,19855,0,28199,721662,0,741690,143255,121705,131134,0,18917,20426,56588,45118,0,0,5189,868663,148567,361852,293250,1038502,313803,6966,53181,119656],
  ['2026-03-21',1504.21,135364,19002,0,28976,721662,0,741739,149659,121572,131842,0,19277,21183,56787,45909,0,0,4997,868663,148567,361852,293250,1007767,313824,6936,53184,119664],
  ['2026-03-22',1504.21,135364,19002,0,28976,721662,0,741739,149659,121572,131842,0,19277,21183,56787,45909,0,0,4997,868663,148567,361852,293250,1007767,313824,6936,53184,119664],
  ['2026-03-23',1485.36,137082,19243,0,28976,721662,0,751152,149659,121572,131842,0,19277,21183,56787,45909,0,0,4997,868663,148567,361852,293250,1007767,317807,6936,53859,121183],
  ['2026-03-24',1497.31,135988,18599,0,29485,721877,0,745158,150961,120124,134517,0,19041,21826,54603,45062,0,0,4821,868663,148567,361852,293250,1006541,315271,6957,53429,120216],
  ['2026-03-25',1500.97,142853,18554,0,30332,721877,0,743341,154452,122354,133920,0,19356,22169,54695,45212,0,0,4725,868663,148567,361852,293250,1040909,314502,7264,53299,119922],
  ['2026-03-26',1508.36,142305,18463,0,29519,721949,0,739699,146818,119142,136021,0,18742,30559,52813,41613,0,0,4645,858798,146118,361852,293250,1000843,312961,6793,53038,119335],
  ['2026-03-27',1508.00,141120,0,0,30149,722164,0,739875,152282,116264,138320,0,18275,29861,51576,39955,0,0,4325,858798,146118,361852,293250,1027016,313036,6980,53050,119363],
  ['2026-03-28',1508.41,141081,0,0,29861,722236,0,739674,151142,113651,136994,0,18010,28607,51418,40765,0,0,4180,858798,146118,361852,293250,1034553,312951,7057,53036,119331],
  ['2026-03-29',1508.02,141118,0,0,29861,722236,0,739865,151142,113651,136994,0,18010,28607,51418,40765,0,0,4180,858798,146118,361852,293250,1034553,313031,7057,53050,119362],
  ['2026-03-30',1517.13,140271,0,0,29861,722236,0,736061,151142,113651,216736,0,18010,28607,51418,40765,0,0,4180,778745,146118,361852,293250,1034553,311152,7057,52731,118645],
  ['2026-03-31',1504.33,144672,0,0,27925,722236,0,742324,162955,117878,214287,0,18703,30552,54061,43482,0,0,4068,778745,146118,361852,293250,1062042,313799,7492,53180,119655],
  ['2026-04-01',1513.09,144746,0,0,27946,720298,0,738027,168707,122271,106028,0,19086,31317,55909,44021,0,0,4004,727020,151746,390276,293250,1092574,311983,7608,52872,118962],
];

const COL = { DATE:0, FX:1, '039290':2, '246720':3, '000660':4, CEG:5, SGOV:6, TLT:7, KRW_SAM:8, SIL:9, SHLD:10, XLE:11, SOXX:12, BOTZ:13, GEV:14, GOOGL:15, META:16, MSFT:17, PANW:18, CLRB:19, USD:20, SCHWAB:21, SCALEV:22, SCALE:23, GCW00:24, KRW_HANA:25, SIW00:26, FUND:27, ANGEL:28 };
const HOLDING_COL = { h_039290:COL['039290'], h_246720:COL['246720'], h_000660:COL['000660'], h_ceg:COL.CEG, h_sgov:COL.SGOV, h_tlt:COL.TLT, h_krw_sam:COL.KRW_SAM, h_sil:COL.SIL, h_shld:COL.SHLD, h_xle:COL.XLE, h_soxx:COL.SOXX, h_botz:COL.BOTZ, h_gev:COL.GEV, h_googl:COL.GOOGL, h_meta:COL.META, h_msft:COL.MSFT, h_panw:COL.PANW, h_clrb:COL.CLRB, h_usd:COL.USD, h_schwab:COL.SCHWAB, h_krw_hana:COL.KRW_HANA, h_gold:COL.GCW00 };
const INV_COL = { inv_scalev:COL.SCALEV, inv_scale:COL.SCALE, inv_silver:COL.SIW00 };

const SHARES_BY_DATE = {
  '2026-03-01': { h_039290:45963,h_246720:4588,h_000660:0,h_ceg:100,h_sgov:3282,h_tlt:4451,h_krw_sam:1116346838,h_sil:0,h_shld:873,h_xle:1150,h_soxx:0,h_botz:0,h_gev:12,h_googl:123,h_meta:43,h_msft:25,h_panw:0,h_clrb:1602,h_usd:1229915,h_schwab:1,h_krw_hana:472057725,inv_scalev:89500,inv_scale:48875,h_gold:227,inv_silver:100 },
  '2026-03-02': { h_039290:45963,h_246720:4588,h_000660:0,h_ceg:100,h_sgov:3282,h_tlt:4451,h_krw_sam:1116346838,h_sil:172,h_shld:873,h_xle:1150,h_soxx:0,h_botz:263,h_gev:12,h_googl:123,h_meta:43,h_msft:0,h_panw:0,h_clrb:1602,h_usd:1209757,h_schwab:1,h_krw_hana:472057725,inv_scalev:89500,inv_scale:48875,h_gold:227,inv_silver:100 },
  '2026-03-04': { h_039290:45963,h_246720:4588,h_000660:0,h_ceg:100,h_sgov:3282,h_tlt:4451,h_krw_sam:1116346838,h_sil:536,h_shld:873,h_xle:1150,h_soxx:0,h_botz:263,h_gev:12,h_googl:123,h_meta:43,h_msft:0,h_panw:0,h_clrb:1602,h_usd:1169892,h_schwab:1,h_krw_hana:472057725,inv_scalev:89500,inv_scale:48875,h_gold:227,inv_silver:100 },
  '2026-03-09': { h_039290:45963,h_246720:4588,h_000660:0,h_ceg:100,h_sgov:7175,h_tlt:0,h_krw_sam:1115628575,h_sil:536,h_shld:873,h_xle:2211,h_soxx:0,h_botz:263,h_gev:12,h_googl:123,h_meta:43,h_msft:0,h_panw:0,h_clrb:1602,h_usd:1109958,h_schwab:1,h_krw_hana:472057725,inv_scalev:89500,inv_scale:48875,h_gold:227,inv_silver:100 },
  '2026-03-10': { h_039290:45963,h_246720:4588,h_000660:0,h_ceg:100,h_sgov:7175,h_tlt:0,h_krw_sam:1115628575,h_sil:536,h_shld:873,h_xle:2211,h_soxx:0,h_botz:263,h_gev:12,h_googl:123,h_meta:43,h_msft:0,h_panw:0,h_clrb:1602,h_usd:1109958,h_schwab:1,h_krw_hana:472057725,inv_scalev:90463,inv_scale:48875,h_gold:227,inv_silver:100 },
  '2026-03-11': { h_039290:45963,h_246720:4588,h_000660:0,h_ceg:100,h_sgov:7175,h_tlt:0,h_krw_sam:1115731816,h_sil:1132,h_shld:1664,h_xle:2211,h_soxx:0,h_botz:263,h_gev:12,h_googl:123,h_meta:43,h_msft:0,h_panw:0,h_clrb:1602,h_usd:989852,h_schwab:1,h_krw_hana:472057725,inv_scalev:90463,inv_scale:48875,h_gold:227,inv_silver:100 },
  '2026-03-18': { h_039290:45963,h_246720:4588,h_000660:0,h_ceg:100,h_sgov:7175,h_tlt:0,h_krw_sam:1115731816,h_sil:1809,h_shld:1664,h_xle:2211,h_soxx:0,h_botz:563,h_gev:24,h_googl:188,h_meta:76,h_msft:0,h_panw:0,h_clrb:1602,h_usd:868663,h_schwab:1,h_krw_hana:472057725,inv_scalev:90463,inv_scale:48875,h_gold:227,inv_silver:100 },
  '2026-03-26': { h_039290:45963,h_246720:4588,h_000660:0,h_ceg:100,h_sgov:7175,h_tlt:0,h_krw_sam:1115731816,h_sil:1809,h_shld:1664,h_xle:2211,h_soxx:0,h_botz:563,h_gev:35,h_googl:188,h_meta:76,h_msft:0,h_panw:0,h_clrb:1602,h_usd:858798,h_schwab:1,h_krw_hana:472057725,inv_scalev:90463,inv_scale:48875,h_gold:227,inv_silver:100 },
  '2026-03-30': { h_039290:45963,h_246720:4588,h_000660:0,h_ceg:100,h_sgov:7175,h_tlt:0,h_krw_sam:1116700668,h_sil:1809,h_shld:1664,h_xle:3498,h_soxx:0,h_botz:563,h_gev:35,h_googl:188,h_meta:76,h_msft:0,h_panw:0,h_clrb:1602,h_usd:778745,h_schwab:1,h_krw_hana:472057725,inv_scalev:90463,inv_scale:48875,h_gold:227,inv_silver:100 },
  '2026-04-01': { h_039290:45963,h_246720:4588,h_000660:0,h_ceg:100,h_sgov:7175,h_tlt:0,h_krw_sam:1116700668,h_sil:1809,h_shld:1664,h_xle:1798,h_soxx:0,h_botz:563,h_gev:35,h_googl:188,h_meta:76,h_msft:0,h_panw:0,h_clrb:1602,h_usd:727020,h_schwab:1,h_krw_hana:472057725,inv_scalev:97569,inv_scale:48875,h_gold:227,inv_silver:100 },
};

const SHARE_DATES = Object.keys(SHARES_BY_DATE).sort();
function getShares(date) {
  let best = SHARE_DATES[0];
  for (const d of SHARE_DATES) { if (d <= date) best = d; else break; }
  return SHARES_BY_DATE[best];
}

function esc(s) { return s == null ? 'NULL' : `'${String(s).replace(/'/g, "''")}'`; }
function num(n) { return n == null ? 'NULL' : String(n); }

// ─── Part 1: Create temp table + accounts + holdings + investments ───
let part1 = `
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
`;
const accDefs = [
  { key: 'acc_samsung', name: '삼성증권', type: 'brokerage', country: 'KR' },
  { key: 'acc_robinhood', name: 'Robinhood', type: 'brokerage', country: 'US' },
  { key: 'acc_schwab', name: 'Charles Schwab', type: 'brokerage', country: 'US' },
  { key: 'acc_hana', name: '하나은행', type: 'savings', country: 'KR' },
];
const accMap = { samsung: 'acc_samsung', robinhood: 'acc_robinhood', schwab: 'acc_schwab', hana: 'acc_hana' };

for (const a of accDefs) {
  part1 += `  INSERT INTO accounts (user_id, name, type, country) VALUES (uid, ${esc(a.name)}, ${esc(a.type)}, ${esc(a.country)}) RETURNING id INTO new_id;\n`;
  part1 += `  INSERT INTO _seed_ids VALUES ('${a.key}', new_id);\n`;
}

part1 += `\n  -- Holdings\n`;
for (const h of HOLDINGS) {
  const shares = CURRENT_SHARES[h.key] || 0;
  part1 += `  INSERT INTO holdings (user_id, account_id, ticker, name, asset_type, shares, currency)\n`;
  part1 += `    VALUES (uid, (SELECT id FROM _seed_ids WHERE key='${accMap[h.account]}'), ${esc(h.ticker)}, ${esc(h.name)}, ${esc(h.asset_type)}, ${num(shares)}, ${esc(h.currency)}) RETURNING id INTO new_id;\n`;
  part1 += `  INSERT INTO _seed_ids VALUES ('${h.key}', new_id);\n`;
}

part1 += `\n  -- Private Investments\n`;
for (const inv of INVESTMENTS) {
  const cur = INV_CURRENT[inv.key];
  part1 += `  INSERT INTO private_investments (user_id, asset_type, name, price_per_unit, currency, quantity, unit_label, ticker, price_source)\n`;
  part1 += `    VALUES (uid, ${esc(inv.asset_type)}, ${esc(inv.name)}, ${num(cur.price_per_unit)}, ${esc(inv.currency)}, ${num(cur.quantity)}, ${esc(cur.unit_label || null)}, ${esc(inv.ticker)}, ${esc(inv.price_source)}) RETURNING id INTO new_id;\n`;
  part1 += `  INSERT INTO _seed_ids VALUES ('${inv.key}', new_id);\n`;
}

part1 += `\nEND $$;\n`;

writeFileSync('supabase/seed_part1.sql', part1);

// ─── Parts 2+: Snapshots in chunks of 8 dates ───
const CHUNK_SIZE = 8;
let partNum = 2;
for (let i = 0; i < SNAPSHOT_DATA.length; i += CHUNK_SIZE) {
  const chunk = SNAPSHOT_DATA.slice(i, i + CHUNK_SIZE);
  let sql = `-- Part ${partNum}: Snapshots ${chunk[0][0]} to ${chunk[chunk.length-1][0]}\n`;
  sql += `INSERT INTO snapshots (user_id, date, holding_id, investment_id, ticker, value_native, currency, value_usd, fx_rate, price_per_unit) VALUES\n`;

  const allRows = [];
  for (const row of chunk) {
    const date = row[COL.DATE];
    const fx = row[COL.FX];
    const shares = getShares(date);
    const uid = `(SELECT id FROM auth.users LIMIT 1)`;

    // Holdings
    for (const h of HOLDINGS) {
      const colIdx = HOLDING_COL[h.key];
      const valueUsd = row[colIdx];
      if (valueUsd === undefined) continue;
      const isKRW = h.currency === 'KRW';
      const valueNative = isKRW ? Math.round(valueUsd * fx) : valueUsd;
      const shareCount = shares[h.key] || 0;
      let ppu = 'NULL';
      if (shareCount > 0 && valueNative > 0) {
        ppu = h.asset_type === 'cash' ? '1' : String(Math.round((valueNative / shareCount) * 100) / 100);
      }
      const hid = `(SELECT id FROM _seed_ids WHERE key='${h.key}')`;
      allRows.push(`  (${uid}, ${esc(date)}, ${hid}, NULL, ${esc(h.ticker)}, ${num(valueNative)}, ${esc(h.currency)}, ${num(valueUsd)}, ${num(fx)}, ${ppu})`);
    }

    // Investments (Scale, Silver)
    for (const [invKey, colIdx] of Object.entries(INV_COL)) {
      const inv = INVESTMENTS.find(x => x.key === invKey);
      const valueUsd = row[colIdx];
      const isKRW = inv.currency === 'KRW';
      const valueNative = isKRW ? Math.round(valueUsd * fx) : valueUsd;
      const qty = shares[invKey] || 0;
      let ppu = 'NULL';
      if (qty > 0 && valueNative > 0) ppu = String(Math.round((valueNative / qty) * 100) / 100);
      const ticker = inv.ticker || inv.name;
      const iid = `(SELECT id FROM _seed_ids WHERE key='${invKey}')`;
      allRows.push(`  (${uid}, ${esc(date)}, NULL, ${iid}, ${esc(ticker)}, ${num(valueNative)}, ${esc(inv.currency)}, ${num(valueUsd)}, ${num(fx)}, ${ppu})`);
    }

    // Fund LP
    const fundUsd = row[COL.FUND];
    for (const [invKey, krwVal] of Object.entries(FUND_LP.breakdown)) {
      const prop = krwVal / FUND_LP.total;
      const vUsd = Math.round(fundUsd * prop * 100) / 100;
      const inv = INVESTMENTS.find(x => x.key === invKey);
      const ticker = inv.ticker || inv.name;
      const iid = `(SELECT id FROM _seed_ids WHERE key='${invKey}')`;
      allRows.push(`  (${uid}, ${esc(date)}, NULL, ${iid}, ${esc(ticker)}, ${num(krwVal)}, 'KRW', ${num(vUsd)}, ${num(fx)}, NULL)`);
    }

    // Angel
    const angelUsd = row[COL.ANGEL];
    for (const [invKey, krwVal] of Object.entries(ANGEL.breakdown)) {
      const prop = krwVal / ANGEL.total;
      const vUsd = Math.round(angelUsd * prop * 100) / 100;
      const inv = INVESTMENTS.find(x => x.key === invKey);
      const ticker = inv.ticker || inv.name;
      const ppu = krwVal / 100;
      const iid = `(SELECT id FROM _seed_ids WHERE key='${invKey}')`;
      allRows.push(`  (${uid}, ${esc(date)}, NULL, ${iid}, ${esc(ticker)}, ${num(krwVal)}, 'KRW', ${num(vUsd)}, ${num(fx)}, ${num(ppu)})`);
    }
  }

  sql += allRows.join(',\n') + ';\n';
  writeFileSync(`supabase/seed_part${partNum}.sql`, sql);
  partNum++;
}

// Cleanup part
writeFileSync(`supabase/seed_part${partNum}.sql`, `DROP TABLE IF EXISTS _seed_ids;\n`);

console.log(`Generated ${partNum} SQL files (seed_part1.sql through seed_part${partNum}.sql)`);
