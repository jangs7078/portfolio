import YahooFinance from "yahoo-finance2";

export const yf = new YahooFinance({
  suppressNotices: ["yahooSurvey", "ripHistorical"],
});

const isKoreanTicker = (s: string) => /^\d+$/.test(s);

const tickerAliases: Record<string, string> = {
  SCHWAB2055: "SWYJX",
};

const comexToYahoo: Record<string, string> = {
  GC: "GC=F", SI: "SI=F", CL: "CL=F", PL: "PL=F",
  PA: "PA=F", HG: "HG=F", NG: "NG=F",
};

function resolveComex(symbol: string): string | null {
  if (comexToYahoo[symbol.toUpperCase()]) return comexToYahoo[symbol.toUpperCase()];
  const base = symbol.toUpperCase().replace(/[A-Z]\d{2}$/, "");
  if (comexToYahoo[base]) return comexToYahoo[base];
  return null;
}

/** Resolve a portfolio ticker to the Yahoo Finance symbol used for quotes */
export function resolveYahooSymbol(symbol: string): string | null {
  if (isKoreanTicker(symbol)) return null; // handled separately
  const futures = resolveComex(symbol);
  if (futures) return futures;
  return tickerAliases[symbol.toUpperCase()] ?? symbol;
}

/** Fetch a single live quote price for a portfolio ticker */
export async function fetchQuote(symbol: string): Promise<number | null> {
  if (isKoreanTicker(symbol)) {
    const attempts = await Promise.allSettled(
      [".KS", ".KQ"].map(async (suffix) => {
        const quote = await yf.quote(symbol + suffix) as Record<string, unknown>;
        if (typeof quote.regularMarketPrice !== "number") return null;
        const name = String(quote.shortName ?? "");
        const isGarbled = name.includes(",");
        return { price: quote.regularMarketPrice, isGarbled };
      })
    );
    const resolved = attempts
      .filter((a): a is PromiseFulfilledResult<{ price: number; isGarbled: boolean } | null> => a.status === "fulfilled")
      .map((a) => a.value)
      .filter((v): v is { price: number; isGarbled: boolean } => v !== null);
    const best = resolved.find((r) => !r.isGarbled) ?? resolved[0];
    return best?.price ?? null;
  }

  const yahooSymbol = resolveYahooSymbol(symbol);
  if (!yahooSymbol) return null;
  const quote = await yf.quote(yahooSymbol) as Record<string, unknown>;
  return typeof quote.regularMarketPrice === "number" ? quote.regularMarketPrice : null;
}

/** Fetch historical close prices for a portfolio ticker over a date range.
 *  Returns a map of date string (YYYY-MM-DD) → close price. */
export async function fetchHistoricalPrices(
  symbol: string,
  startDate: string,
  endDate: string,
): Promise<Record<string, number>> {
  let yahooSymbol: string;

  if (isKoreanTicker(symbol)) {
    // Determine correct suffix
    const attempts = await Promise.allSettled(
      [".KS", ".KQ"].map(async (suffix) => {
        const quote = await yf.quote(symbol + suffix) as Record<string, unknown>;
        if (typeof quote.regularMarketPrice !== "number") return null;
        const name = String(quote.shortName ?? "");
        return { suffix, isGarbled: name.includes(",") };
      })
    );
    const resolved = attempts
      .filter((a): a is PromiseFulfilledResult<{ suffix: string; isGarbled: boolean } | null> => a.status === "fulfilled")
      .map((a) => a.value)
      .filter((v): v is { suffix: string; isGarbled: boolean } => v !== null);
    const best = resolved.find((r) => !r.isGarbled) ?? resolved[0];
    if (!best) return {};
    yahooSymbol = symbol + best.suffix;
  } else {
    const resolved = resolveYahooSymbol(symbol);
    if (!resolved) return {};
    yahooSymbol = resolved;
  }

  try {
    const chart = await yf.chart(yahooSymbol, {
      period1: startDate,
      period2: endDate,
    }) as unknown as { quotes?: Array<{ date: Date; close: number | null }> };

    const quotes = chart.quotes;
    if (!quotes) return {};

    const prices: Record<string, number> = {};
    for (const q of quotes) {
      if (q.close != null) {
        const dateStr = q.date.toISOString().split("T")[0];
        prices[dateStr] = q.close;
      }
    }
    return prices;
  } catch {
    return {};
  }
}

export async function fetchFxRate(): Promise<number | null> {
  try {
    const quote = await yf.quote("USDKRW=X") as Record<string, unknown>;
    return typeof quote.regularMarketPrice === "number" ? quote.regularMarketPrice : null;
  } catch {
    return null;
  }
}
