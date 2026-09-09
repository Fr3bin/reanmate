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
          ថ្នាក់ទី១០ ដល់ទី១២ មានមេរៀនគណិតវិទ្យា និងប្រវត្តិវិទ្យា។ ជ្រើសមេរៀនខាងក្រោម។
        </p>
        <div className="stagger mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(
            [
              { href: "/learn/10/math", grade: "ថ្នាក់ទី១០", subject: "គណិតវិទ្យា", lesson: "អនុគមន៍" },
              { href: "/learn/10/history", grade: "ថ្នាក់ទី១០", subject: "ប្រវត្តិវិទ្យា", lesson: "អាណាចក្រហ្វូណន" },
              { href: "/learn/11/math", grade: "ថ្នាក់ទី១១", subject: "គណិតវិទ្យា", lesson: "សុី្វតចំនួនពិត" },
              { href: "/learn/11/history", grade: "ថ្នាក់ទី១១", subject: "ប្រវត្តិវិទ្យា", lesson: "សហរដ្ឋអាមេរិក" },
              { href: "/learn/12/math", grade: "ថ្នាក់ទី១២", subject: "គណិតវិទ្យា", lesson: "លីមីតនៃអនុគមន៍" },
              { href: "/learn/12/history", grade: "ថ្នាក់ទី១២", subject: "ប្រវត្តិវិទ្យា", lesson: "អាណាព្យាបាលបារាំង" },
            ] as const
          ).map((item) => (
            <Link key={item.href} href={item.href} className="ui-card group p-5 sm:p-6">
              <p className="text-xs font-semibold text-gold">{item.grade}</p>
              <p className="mt-2 text-xl font-bold text-primary group-hover:text-primary-dark">
                {item.subject}
              </p>
              <p className="mt-1 text-sm text-ink-muted">{item.lesson}</p>
              <p className="mt-4 text-sm font-semibold text-cta">ចូលរៀន →</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <PageTitle>ជ្រើសរើសថ្នាក់</PageTitle>
        <div className="stagger mt-6 grid gap-4 sm:grid-cols-3 sm:gap-5">
          {GRADES.map((grade) => {
            return (
              <Link
                key={grade}
                href={`/learn/${grade}`}
                className="ui-card group relative overflow-hidden px-6 py-8 text-center ring-1 ring-gold/40"
              >
                <span className="absolute inset-x-8 top-0 h-px bg-gold/80" />
                <span className="absolute right-4 top-4 rounded-full bg-gold/15 px-2.5 py-0.5 text-[10px] font-semibold text-gold">
                  សាកល្បង
                </span>
                <span className="text-4xl font-bold text-primary">
                  {toKhmerNumber(grade)}
                </span>
                <p className="mt-3 text-base font-semibold text-ink">
                  ថ្នាក់ទី{toKhmerNumber(grade)}
                </p>
                <p className="mt-2 text-xs text-ink-muted">មានមេរៀនសាកល្បង</p>
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
