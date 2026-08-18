import ContinueCard from "@/components/ContinueCard";
import PageTitle from "@/components/PageTitle";
import { GRADES } from "@/lib/api";
import { toKhmerNumber } from "@/lib/format";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8">
      <ContinueCard />

      <section>
        <PageTitle>ជ្រើសរើសថ្នាក់របស់អ្នក</PageTitle>
        <p className="mt-3 text-sm text-ink-muted">
          រៀនគណិតវិទ្យា និងប្រវត្តិវិទ្យា តាមកម្មវិធីសិក្សារបស់ក្រសួង។
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3 sm:gap-5">
          {GRADES.map((grade) => (
            <Link
              key={grade}
              href={`/learn/${grade}`}
              className="group rounded-2xl border border-line bg-surface p-7 text-center shadow-sm transition hover:border-primary hover:shadow-md sm:p-8"
            >
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-2xl font-black text-primary ring-2 ring-transparent transition group-hover:bg-gold group-hover:text-primary-dark group-hover:ring-gold/40">
                {toKhmerNumber(grade)}
              </span>
              <p className="mt-4 text-lg font-bold text-ink">ថ្នាក់ទី{toKhmerNumber(grade)}</p>
              <p className="mt-1 text-sm text-ink-muted">គណិតវិទ្យា · ប្រវត្តិវិទ្យា</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
