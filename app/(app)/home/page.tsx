import ContinueCard from "@/components/ContinueCard";
import HomeHero from "@/components/HomeHero";
import PageTitle from "@/components/PageTitle";
import { GRADES } from "@/lib/api";
import { toKhmerNumber } from "@/lib/format";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-10">
      <HomeHero />
      <ContinueCard />

      <section>
        <PageTitle>មេរៀនសាកល្បង</PageTitle>
        <p className="mt-3 text-sm text-ink-muted">
          ថ្នាក់ទី១០ មានមេរៀនសាកល្បងពីរ។ ថ្នាក់ទី១១ និងទី១២ នឹងមកដល់ឆាប់ៗ។
        </p>
        <div className="stagger mt-6 grid gap-4 sm:grid-cols-2">
          <Link href="/learn/10/math" className="ui-card group p-5 sm:p-6">
            <p className="text-xs font-semibold text-gold">ថ្នាក់ទី១០</p>
            <p className="mt-2 text-xl font-bold text-primary group-hover:text-primary-dark">
              គណិតវិទ្យា
            </p>
            <p className="mt-1 text-sm text-ink-muted">មេរៀនទី១ · អនុគមន៍</p>
            <p className="mt-4 text-sm font-semibold text-cta">ចូលរៀន →</p>
          </Link>
          <Link href="/learn/10/history" className="ui-card group p-5 sm:p-6">
            <p className="text-xs font-semibold text-gold">ថ្នាក់ទី១០</p>
            <p className="mt-2 text-xl font-bold text-primary group-hover:text-primary-dark">
              ប្រវត្តិវិទ្យា
            </p>
            <p className="mt-1 text-sm text-ink-muted">មេរៀនទី១ · អាណាចក្រហ្វូណន</p>
            <p className="mt-4 text-sm font-semibold text-cta">ចូលរៀន →</p>
          </Link>
        </div>
      </section>

      <section>
        <PageTitle>ជ្រើសរើសថ្នាក់</PageTitle>
        <div className="stagger mt-6 grid gap-4 sm:grid-cols-3 sm:gap-5">
          {GRADES.map((grade) => {
            const hasDemo = grade === 10;
            return (
              <Link
                key={grade}
                href={`/learn/${grade}`}
                className={`ui-card group relative overflow-hidden px-6 py-8 text-center ${
                  hasDemo ? "ring-1 ring-gold/40" : ""
                }`}
              >
                <span className="absolute inset-x-8 top-0 h-px bg-gold/80" />
                {hasDemo ? (
                  <span className="absolute right-4 top-4 rounded-full bg-gold/15 px-2.5 py-0.5 text-[10px] font-semibold text-gold">
                    សាកល្បង
                  </span>
                ) : (
                  <span className="absolute right-4 top-4 text-[10px] text-ink-muted">
                    កំពុងរៀបចំ
                  </span>
                )}
                <span className="text-4xl font-bold text-primary">
                  {toKhmerNumber(grade)}
                </span>
                <p className="mt-3 text-base font-semibold text-ink">
                  ថ្នាក់ទី{toKhmerNumber(grade)}
                </p>
                <p className="mt-2 text-xs text-ink-muted">
                  {hasDemo ? "មានមេរៀនសាកល្បង" : "មេរៀននឹងមកដល់ឆាប់ៗ"}
                </p>
                <p className="mt-4 text-xs font-semibold text-cta">
                  ជ្រើសមុខវិជ្ជា →
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
