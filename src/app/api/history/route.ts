import { getSnapshotHistoryByTicker } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tickersParam = searchParams.get("tickers");

  if (!tickersParam) {
    return Response.json({ error: "Missing tickers parameter" }, { status: 400 });
  }

  const tickers = tickersParam.split(",").map((t) => t.trim()).filter(Boolean);
  if (tickers.length === 0) {
    return Response.json({ history: {} });
  }

  const snapshots = await getSnapshotHistoryByTicker(tickers);

  // Group by ticker, aggregate value_usd by date
  const history: Record<
    string,
    { dates: string[]; values: number[]; firstBoughtDate: string | null }
  > = {};

  // Intermediate: ticker -> date -> { usd: number, hasNative: boolean }
  const grouped: Record<string, Record<string, { usd: number; hasNative: boolean }>> = {};

  for (const snap of snapshots) {
    if (!grouped[snap.ticker]) grouped[snap.ticker] = {};
    const byDate = grouped[snap.ticker];
    if (!byDate[snap.date]) byDate[snap.date] = { usd: 0, hasNative: false };
    byDate[snap.date].usd += Number(snap.value_usd);
    if (Number(snap.value_native) > 0) byDate[snap.date].hasNative = true;
  }

  for (const [ticker, byDate] of Object.entries(grouped)) {
    const sortedDates = Object.keys(byDate).sort();
    const dates: string[] = [];
    const values: number[] = [];
    let firstBoughtDate: string | null = null;

    for (const date of sortedDates) {
      dates.push(date);
      values.push(byDate[date].usd);
      if (firstBoughtDate === null && byDate[date].hasNative) {
        firstBoughtDate = date;
      }
    }

    history[ticker] = { dates, values, firstBoughtDate };
  }

  return Response.json({ history });
}
