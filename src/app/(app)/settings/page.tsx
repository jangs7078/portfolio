"use client";

import { useState } from "react";
import { useSettings, setSetting, type Currency, type TimeRange } from "@/lib/settings";
import { supabase } from "@/lib/supabase";

const currencies: Currency[] = ["USD", "KRW"];
const timeRanges: TimeRange[] = ["1W", "1M", "3M", "YTD", "1Y", "ALL"];

export default function SettingsPage() {
  const settings = useSettings();
  const [resetStatus, setResetStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handlePasswordReset() {
    setResetStatus("sending");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      setResetStatus("error");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(user.email);
    setResetStatus(error ? "error" : "sent");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <section className="rounded-lg border border-card-border bg-card p-4">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted">
          Display
        </h2>
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">Default Currency</p>
              <p className="text-xs text-muted">Currency shown on dashboard</p>
            </div>
            <div className="flex gap-1">
              {currencies.map((c) => (
                <button
                  key={c}
                  onClick={() => setSetting("currency", c)}
                  className={`rounded px-3 py-1 text-sm transition-colors ${
                    settings.currency === c
                      ? "bg-accent/15 text-accent"
                      : "border border-card-border text-muted hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">Default Time Range</p>
              <p className="text-xs text-muted">Chart time range on load</p>
            </div>
            <div className="flex gap-1">
              {timeRanges.map((r) => (
                <button
                  key={r}
                  onClick={() => setSetting("timeRange", r)}
                  className={`rounded px-2 py-1 text-sm transition-colors ${
                    settings.timeRange === r
                      ? "bg-accent/15 text-accent"
                      : "border border-card-border text-muted hover:text-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-card-border bg-card p-4">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted">
          Account
        </h2>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">Password</p>
            <p className="text-xs text-muted">Send a password reset link to your email</p>
          </div>
          <button
            onClick={handlePasswordReset}
            disabled={resetStatus === "sending" || resetStatus === "sent"}
            className="rounded border border-card-border px-3 py-1 text-sm text-muted transition-colors hover:text-foreground disabled:opacity-50"
          >
            {resetStatus === "idle" && "Reset Password"}
            {resetStatus === "sending" && "Sending..."}
            {resetStatus === "sent" && "Email Sent"}
            {resetStatus === "error" && "Failed — Retry"}
          </button>
        </div>
      </section>
    </div>
  );
}
