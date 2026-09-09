"use client";

import Link from "next/link";
import { clearSession } from "@/lib/auth";

export default function LogoutLink() {
  return (
    <Link
      href="/"
      onClick={() => clearSession()}
      className="inline-flex min-h-11 items-center rounded-xl border border-white/15 px-3 py-1.5 text-sm text-white/85 transition hover:border-white/40 hover:bg-white/5"
    >
      ចេញ
    </Link>
  );
}
