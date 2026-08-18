import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

type SiteNavbarProps = {
  homeHref?: string;
  variant?: "landing" | "app" | "auth";
  gradeLabel?: string;
  isAdmin?: boolean;
};

/**
 * Brand-green academic navbar.
 * MoEYS-inspired: deep teal bar, gold hairline, coral primary action.
 */
export default function SiteNavbar({
  homeHref = "/",
  variant = "landing",
  gradeLabel,
  isAdmin = false,
}: SiteNavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-primary-dark text-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4 sm:h-[3.75rem] sm:gap-3 sm:px-6">
        <Link href={homeHref} className="min-w-0 shrink">
          <BrandLogo size={32} onDark />
        </Link>

        {variant === "landing" ? (
          <nav className="flex shrink-0 items-center gap-1 sm:gap-2">
            <Link
              href="/login"
              className="hidden min-h-10 items-center rounded px-3 py-1.5 text-sm text-white/80 transition hover:text-white sm:inline-flex"
            >
              ចូលគណនី
            </Link>
            <Link
              href="/login"
              className="inline-flex min-h-10 items-center rounded-lg bg-cta px-3 py-2 text-sm font-bold text-white transition hover:bg-cta-dark sm:px-4"
            >
              ចាប់ផ្តើមរៀន
            </Link>
          </nav>
        ) : null}

        {variant === "app" ? (
          <nav className="flex shrink-0 items-center gap-1 sm:gap-2">
            {isAdmin ? (
              <>
                <span className="hidden rounded-full border border-gold/50 px-2.5 py-1 text-xs font-bold text-gold sm:inline">
                  Admin
                </span>
                <Link
                  href="/home"
                  className="rounded px-2 py-1.5 text-sm text-white/80 transition hover:text-white sm:px-3"
                >
                  ទិដ្ឋភាពសិស្ស
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/home"
                  className="rounded px-2 py-1.5 text-sm text-white/80 transition hover:text-white sm:px-3"
                >
                  ទំព័រដើម
                </Link>
                {gradeLabel ? (
                  <span className="hidden rounded border border-gold/40 px-2.5 py-1 text-xs text-gold sm:inline">
                    {gradeLabel}
                  </span>
                ) : null}
              </>
            )}
            <Link
              href="/"
              className="rounded-lg border border-white/25 px-2.5 py-1.5 text-sm text-white/90 transition hover:border-white/50 hover:bg-white/5 sm:px-3"
            >
              ចេញ
            </Link>
          </nav>
        ) : null}

        {variant === "auth" ? (
          <Link
            href="/"
            className="rounded px-2.5 py-1.5 text-sm text-white/80 transition hover:text-white"
          >
            ត្រឡប់
          </Link>
        ) : null}
      </div>
      <div className="h-[3px] bg-gradient-to-r from-gold/40 via-gold to-gold/40" />
    </header>
  );
}
