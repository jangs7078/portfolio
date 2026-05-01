"use client";

import { useSyncExternalStore } from "react";

export type Currency = "USD" | "KRW";
export type TimeRange = "1W" | "1M" | "3M" | "YTD" | "1Y" | "ALL";

interface Settings {
  currency: Currency;
  timeRange: TimeRange;
}

const STORAGE_KEY = "portfolio-settings";

const defaults: Settings = { currency: "USD", timeRange: "ALL" };

let listeners: Array<() => void> = [];
let cached: Settings = defaults;

function notify() {
  for (const l of listeners) l();
}

function refresh(): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) { cached = defaults; return; }
    cached = { ...defaults, ...JSON.parse(raw) };
  } catch {
    cached = defaults;
  }
}

function getSnapshot(): Settings {
  return cached;
}

function write(patch: Partial<Settings>) {
  const next = { ...cached, ...patch };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  cached = next;
  notify();
}

// Initialize on load
if (typeof window !== "undefined") {
  refresh();
}

export function setSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
  write({ [key]: value });
}

export function useSettings(): Settings {
  return useSyncExternalStore(
    (cb) => {
      listeners.push(cb);
      return () => {
        listeners = listeners.filter((l) => l !== cb);
      };
    },
    getSnapshot,
    () => defaults,
  );
}
