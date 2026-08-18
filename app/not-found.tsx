import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 text-center">
      <p className="text-sm font-medium text-gold">៤០៤</p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold text-primary">
        រកមិនឃើញទំព័រនេះ
      </h1>
      <p className="mt-2 max-w-sm text-sm text-ink-muted">
        ទំព័រដែលអ្នកស្វែងរកមិនមានទេ ឬមេរៀននេះមិនទាន់ត្រូវបានអនុម័ត។
      </p>
      <Link
        href="/home"
        className="mt-6 rounded-lg bg-cta px-5 py-2.5 font-bold text-white hover:bg-cta-dark"
      >
        ត្រឡប់ទៅទំព័រដើម
      </Link>
    </div>
  );
}
