"use client";

import { useState } from "react";
import { useSettings, setSetting, type Currency, type TimeRange } from "@/lib/settings";
import { useDemoMode, setDemoMode } from "@/lib/demo-mode";
import { supabase } from "@/lib/supabase";

const currencies: Currency[] = ["USD", "KRW"];
const timeRanges: TimeRange[] = ["1W", "1M", "3M", "YTD", "1Y", "ALL"];

export default function SettingsPage() {
  const settings = useSettings();
  const { isDemoMode } = useDemoMode();
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
    <div className="space-y-8">
      <h1 className="text-2xl font-extrabold tracking-tight">Settings</h1>

      <section className="wise-card p-5">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted">
          Display
        </h2>
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">Default Currency</p>
              <p className="text-xs text-muted">Currency shown on dashboard</p>
            </div>
            <div className="flex gap-2">
              {currencies.map((c) => (
                <button
                  key={c}
                  onClick={() => setSetting("currency", c)}
                  className={`rounded-full px-4 py-1.5 text-sm transition-all ${
                    settings.currency === c
                      ? "bg-accent text-accent-dark font-semibold"
                      : "text-muted hover:text-foreground hover:scale-105 active:scale-95"
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
            <div className="flex gap-2">
              {timeRanges.map((r) => (
                <button
                  key={r}
                  onClick={() => setSetting("timeRange", r)}
                  className={`rounded-full px-4 py-1.5 text-sm transition-all ${
                    settings.timeRange === r
                      ? "bg-accent text-accent-dark font-semibold"
                      : "text-muted hover:text-foreground hover:scale-105 active:scale-95"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">Demo Mode</p>
              <p className="text-xs text-muted">Scramble financial values for privacy</p>
            </div>
            <div className="flex gap-2">
              {(["Off", "On"] as const).map((label) => {
                const isOn = label === "On";
                const active = isDemoMode === isOn;
                return (
                  <button
                    key={label}
                    onClick={() => setDemoMode(isOn)}
                    className={`rounded-full px-4 py-1.5 text-sm transition-all ${
                      active
                        ? "bg-accent text-accent-dark font-semibold"
                        : "text-muted hover:text-foreground hover:scale-105 active:scale-95"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="wise-card p-5">
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
            className="wise-btn border border-card-border px-5 py-2 text-sm text-muted"
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
