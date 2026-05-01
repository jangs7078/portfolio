"use client";

interface Props {
  rate: number;
}

export default function FxCard({ rate }: Props) {
  return (
    <div className="rounded-lg border border-card-border bg-card p-4">
      <h2 className="mb-1 text-sm font-medium text-muted">KRW / USD</h2>
      <div className="text-2xl font-bold tabular-nums">
        {rate.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </div>
    </div>
  );
}
