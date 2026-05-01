import { createClient } from "@supabase/supabase-js";
import { fetchHistoricalPrices, fetchFxRate } from "@/lib/yahoo";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function POST(request: Request) {
  // Forward the user's auth token so RLS works
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const authedSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } },
  );

  // 1. Get latest snapshot date
  const { data: latestRow, error: latestErr } = await authedSupabase
    .from("snapshots")
    .select("date")
    .order("date", { ascending: false })
    .limit(1)
    .single();

  if (latestErr || !latestRow) {
    return Response.json({ error: "No existing snapshots" }, { status: 400 });
  }

  const latestDate = latestRow.date as string;

  // 2. Calculate missing dates (day after latest through yesterday)
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (latestDate >= yesterdayStr) {
    return Response.json({ message: "Already up to date", filled: 0 });
  }

  const missingDates: string[] = [];
  const cursor = new Date(latestDate);
  cursor.setDate(cursor.getDate() + 1);
  while (cursor <= yesterday) {
    missingDates.push(cursor.toISOString().split("T")[0]);
    cursor.setDate(cursor.getDate() + 1);
  }

  if (missingDates.length === 0) {
    return Response.json({ message: "Already up to date", filled: 0 });
  }

  // 3. Get current holdings and private investments
  const [{ data: holdings }, { data: investments }] = await Promise.all([
    authedSupabase.from("holdings").select("*"),
    authedSupabase.from("private_investments").select("*").eq("is_deleted", false),
  ]);

  if (!holdings || !investments) {
    return Response.json({ error: "Failed to fetch holdings" }, { status: 500 });
  }

  // 4. Collect unique tickers that need historical prices
  const tickersToFetch = new Set<string>();
  for (const h of holdings) {
    if (h.asset_type !== "cash" && h.shares > 0) {
      tickersToFetch.add(h.ticker);
    }
  }
  for (const inv of investments) {
    if (inv.ticker) tickersToFetch.add(inv.ticker);
  }

  // 5. Fetch historical prices for all tickers
  // Start 10 days before first missing date so weekends/holidays can look back
  // to the last trading day's close price
  const paddedStart = new Date(missingDates[0]);
  paddedStart.setDate(paddedStart.getDate() - 10);
  const startDate = paddedStart.toISOString().split("T")[0];
  // Add one day to endDate for Yahoo Finance range (exclusive end)
  const endDateObj = new Date(yesterdayStr);
  endDateObj.setDate(endDateObj.getDate() + 1);
  const endDate = endDateObj.toISOString().split("T")[0];

  const historicalPrices: Record<string, Record<string, number>> = {};
  const priceResults = await Promise.allSettled(
    Array.from(tickersToFetch).map(async (ticker) => {
      const prices = await fetchHistoricalPrices(ticker, startDate, endDate);
      return { ticker, prices };
    })
  );

  for (const result of priceResults) {
    if (result.status === "fulfilled") {
      historicalPrices[result.value.ticker] = result.value.prices;
    }
  }

  // 6. Fetch FX rate (use current as approximation for recent dates)
  const fxRate = await fetchFxRate() ?? 1400;

  // 7. Build snapshot rows for each missing date
  const rows: Array<Record<string, unknown>> = [];

  for (const date of missingDates) {
    // For each date, find the closest available price (same day or most recent before)
    const getPrice = (ticker: string): number | null => {
      const tickerPrices = historicalPrices[ticker];
      if (!tickerPrices) return null;
      // Try exact date
      if (tickerPrices[date] != null) return tickerPrices[date];
      // Try previous dates (up to 7 days back for weekends/holidays)
      const d = new Date(date);
      for (let i = 1; i <= 7; i++) {
        d.setDate(d.getDate() - 1);
        const ds = d.toISOString().split("T")[0];
        if (tickerPrices[ds] != null) return tickerPrices[ds];
      }
      return null;
    };

    // Holdings snapshots
    for (const h of holdings) {
      if (h.shares === 0) continue;

      let pricePerUnit: number;
      let valueNative: number;

      if (h.asset_type === "cash") {
        pricePerUnit = 1;
        valueNative = h.shares;
      } else {
        const price = getPrice(h.ticker);
        if (price == null) continue;
        pricePerUnit = price;
        valueNative = price * h.shares;
      }

      const valueUsd = h.currency === "KRW" ? valueNative / fxRate : valueNative;

      rows.push({
        user_id: user.id,
        date,
        holding_id: h.id,
        investment_id: null,
        ticker: h.ticker,
        value_native: Math.round(valueNative * 100) / 100,
        currency: h.currency,
        value_usd: Math.round(valueUsd * 100) / 100,
        fx_rate: h.currency === "KRW" ? fxRate : null,
        price_per_unit: Math.round(pricePerUnit * 100) / 100,
      });
    }

    // Private investment snapshots
    for (const inv of investments) {
      let pricePerUnit: number;

      if (inv.ticker) {
        const price = getPrice(inv.ticker);
        pricePerUnit = price ?? inv.price_per_unit;
      } else {
        pricePerUnit = inv.price_per_unit;
      }

      const valueNative = pricePerUnit * inv.quantity;
      const valueUsd = inv.currency === "KRW" ? valueNative / fxRate : valueNative;

      rows.push({
        user_id: user.id,
        date,
        holding_id: null,
        investment_id: inv.id,
        ticker: inv.ticker ?? inv.name,
        value_native: Math.round(valueNative * 100) / 100,
        currency: inv.currency,
        value_usd: Math.round(valueUsd * 100) / 100,
        fx_rate: inv.currency === "KRW" ? fxRate : null,
        price_per_unit: Math.round(pricePerUnit * 100) / 100,
      });
    }
  }

  if (rows.length === 0) {
    return Response.json({ message: "No data to backfill", filled: 0 });
  }

  // 8. Insert in batches (Supabase has row limits)
  const BATCH_SIZE = 500;
  let inserted = 0;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { error } = await authedSupabase.from("snapshots").insert(batch);
    if (error) {
      return Response.json({
        error: `Insert failed at batch ${Math.floor(i / BATCH_SIZE)}: ${error.message}`,
        inserted,
      }, { status: 500 });
    }
    inserted += batch.length;
  }

  return Response.json({
    message: `Backfilled ${missingDates.length} days`,
    filled: missingDates.length,
    snapshots: inserted,
    dateRange: { from: missingDates[0], to: missingDates[missingDates.length - 1] },
  });
}
