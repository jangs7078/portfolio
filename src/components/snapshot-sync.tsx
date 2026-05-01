"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

export default function SnapshotSync() {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    async function sync() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      try {
        await fetch("/api/backfill-snapshots", {
          method: "POST",
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
      } catch {
        // Silently fail — backfill is best-effort
      }
    }

    sync();
  }, []);

  return null;
}
