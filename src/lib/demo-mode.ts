"use client";

import { useSyncExternalStore } from "react";

const SESSION_KEY = "portfolio-demo-mode";

interface DemoState {
  enabled: boolean;
  multiplier: number;
}

const defaultState: DemoState = { enabled: false, multiplier: 1 };

let listeners: Array<() => void> = [];
let cached: DemoState = defaultState;

function notify() {
  for (const l of listeners) l();
}

function refresh(): void {
  if (typeof window === "undefined") return;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) { cached = defaultState; return; }
    cached = { ...defaultState, ...JSON.parse(raw) };
  } catch {
    cached = defaultState;
  }
}

function getSnapshot(): DemoState {
  return cached;
}

if (typeof window !== "undefined") {
  refresh();
}

export function setDemoMode(enabled: boolean) {
  const next: DemoState = enabled
    ? { enabled: true, multiplier: 0.3 + Math.random() * 2.7 }
    : { enabled: false, multiplier: 1 };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
  cached = next;
  notify();
}

export function useDemoMode() {
  const state = useSyncExternalStore(
    (cb) => {
      listeners.push(cb);
      return () => {
        listeners = listeners.filter((l) => l !== cb);
      };
    },
    getSnapshot,
    () => defaultState,
  );

  return {
    isDemoMode: state.enabled,
    scramble: (value: number) => (state.enabled ? value * state.multiplier : value),
  };
}
