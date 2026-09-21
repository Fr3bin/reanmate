"use client";

import { useState } from "react";
import { clearSession } from "@/lib/api/auth";
import { useToast } from "@/components/ToastProvider";

export default function SignOutLink() {
  const [pending, setPending] = useState(false);
  const toast = useToast();
  return (
    <button type="button" disabled={pending} onClick={async () => {
      if (pending) return;
      setPending(true);
      try {
        await clearSession();
        // Clear the Next.js client router cache along with the server session.
        window.location.replace("/");
      } catch {
        toast.error("មិនអាចចេញពីគណនីបានទេ។ សូមព្យាយាមម្ដងទៀត។");
        setPending(false);
      }
    }} className="ui-btn inline-flex min-h-11 items-center rounded-xl border border-white/15 px-3 py-1.5 text-sm text-white/85 transition hover:border-white/40 hover:bg-white/5 disabled:opacity-50">
      {pending ? "កំពុងចេញ…" : "ចេញ"}
    </button>
  );
}
