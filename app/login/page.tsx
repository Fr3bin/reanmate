"use client";

import Link from "next/link";
import { useState } from "react";
import SiteNavbar from "@/components/SiteNavbar";

export default function LoginPage() {
  const [notice, setNotice] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <SiteNavbar variant="auth" homeHref="/" />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
        <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm">
          <h1 className="text-center font-[family-name:var(--font-display)] text-2xl font-bold text-primary">
            ចូលគណនី
          </h1>

          <form
            className="mt-6 flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              setNotice(true);
            }}
          >
            <label className="text-sm font-medium">
              អ៊ីមែល
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-1 w-full rounded-md border border-line px-3 py-2.5 text-base focus:border-primary focus:outline-none"
              />
            </label>
            <label className="text-sm font-medium">
              ពាក្យសម្ងាត់
              <input
                type="password"
                placeholder="••••••••"
                className="mt-1 w-full rounded-md border border-line px-3 py-2.5 text-base focus:border-primary focus:outline-none"
              />
            </label>
            <button
              type="submit"
              className="min-h-11 rounded-md bg-cta py-2.5 font-bold text-white hover:bg-cta-dark"
            >
              ចូល
            </button>
          </form>

          {notice ? (
            <p className="mt-3 rounded-md bg-section px-3 py-2 text-center text-sm text-ink-muted">
              ការចូលគណនីពិតប្រាកដ នឹងភ្ជាប់ជាមួយម៉ាស៊ីនមេនៅពេលក្រោយ។
              សូមប្រើប៊ូតុងខាងក្រោមសម្រាប់ការសាកល្បង។
            </p>
          ) : null}

          <div className="my-5 flex items-center gap-3 text-xs text-ink-muted">
            <span className="h-px flex-1 bg-line" />
            សម្រាប់ការសាកល្បង
            <span className="h-px flex-1 bg-line" />
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/home"
              className="min-h-11 rounded-md bg-primary py-2.5 text-center font-bold text-white hover:bg-primary-dark"
            >
              បន្តជាសិស្ស
            </Link>
            <Link
              href="/admin"
              className="min-h-11 rounded-md border border-primary py-2.5 text-center font-bold text-primary hover:bg-primary-light"
            >
              បន្តជា Admin
            </Link>
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-ink-muted">
          មិនទាន់មានគណនី?{" "}
          <span className="font-medium text-primary">បង្កើតគណនី (មកដល់ឆាប់ៗ)</span>
        </p>
      </main>
    </div>
  );
}
