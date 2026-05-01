import { fetchQuote, fetchFxRate } from "@/lib/yahoo";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tickers = searchParams.get("tickers");

  if (!tickers) {
    return Response.json({ error: "Missing tickers parameter" }, { status: 400 });
  }

  const symbols = tickers.split(",").map((t) => t.trim()).filter(Boolean);
  if (symbols.length === 0) {
    return Response.json({ prices: {} });
  }

  const prices: Record<string, number | null> = {};

  const results = await Promise.allSettled(
    symbols.map(async (symbol) => {
      const price = await fetchQuote(symbol);
      return { symbol, price };
    })
  );

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (result.status === "fulfilled") {
      prices[result.value.symbol] = result.value.price;
    } else {
      prices[symbols[i]] = null;
    }
  }

  const fxRate = await fetchFxRate();

  return Response.json({ prices, fxRate });
}
