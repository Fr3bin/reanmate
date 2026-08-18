import Image from "next/image";
import Link from "next/link";
import SiteNavbar from "@/components/SiteNavbar";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-bg">
      <SiteNavbar variant="landing" homeHref="/" />

      <section className="relative isolate overflow-hidden lg:min-h-[calc(100vh-4rem)]">
        <Image
          src="/hero-school.jpg"
          alt="អគារសាលា"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-primary-dark/80 lg:bg-gradient-to-r lg:from-primary-dark/92 lg:via-primary-dark/70 lg:to-primary-dark/25"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-primary-dark/70 via-transparent to-black/20"
        />

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col justify-center px-4 py-8 sm:px-6 sm:py-10 lg:min-h-[calc(100vh-4rem)] lg:py-16">
          <div className="grid w-full items-center gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <div className="text-center text-white lg:text-left">
              <p className="mb-3 text-sm font-medium tracking-wide text-gold">
                AI Tutor · សម្រាប់សិស្សខ្មែរ
              </p>
              <h1 className="font-[family-name:var(--font-display)] text-[1.55rem] font-black leading-[1.5] sm:text-4xl lg:text-[2.65rem]">
                រៀនគណិត និងប្រវត្តិ
                <span className="mt-1 block text-gold">ជាមួយគ្រូ AI ផ្ទាល់ខ្លួន</span>
              </h1>
              <p className="mx-auto mt-4 max-w-md text-[1.02rem] leading-relaxed text-white/85 lg:mx-0">
                មើលវីដេអូ MoEYS សួរគ្រូ AI ជាភាសាខ្មែរ រួចធ្វើតេស្ត —
                តាមសៀវភៅសិក្សារបស់ក្រសួង សម្រាប់ថ្នាក់ទី១០ ដល់ទី១២។
              </p>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <Link
                  href="/login"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-cta px-7 py-3 text-base font-bold text-white shadow-[0_8px_24px_rgba(242,107,107,0.35)] transition hover:bg-cta-dark sm:w-auto"
                >
                  ចាប់ផ្តើមរៀន
                </Link>
                <Link
                  href="/login"
                  className="hidden min-h-12 items-center justify-center rounded-lg border border-white/40 px-6 py-3 text-base font-medium text-white transition hover:bg-white/10 sm:inline-flex"
                >
                  ចូលគណនី
                </Link>
              </div>

              <ul className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-white/75 lg:justify-start">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  វីដេអូ MoEYS
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  គ្រូ AI ភាសាខ្មែរ
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  តេស្ត + ការពន្យល់
                </li>
              </ul>
            </div>

            <div className="mx-auto w-full max-w-[19.5rem] sm:max-w-md lg:ml-auto lg:max-w-[640px]">
              <div className="landing-float-wrap">
                <span className="landing-chip landing-chip-sqrt" aria-hidden>
                  √x
                </span>

                <div className="landing-hero-stage">
                  <div className="landing-mascot">
                    <Image
                      src="/mascot.png"
                      alt="គ្រូ AI"
                      width={420}
                      height={420}
                      priority
                      className="h-auto w-full select-none"
                    />
                  </div>

                  <div className="landing-card-col">
                    <span className="landing-chip landing-chip-a" aria-hidden>
                      និទ្ទេស A
                    </span>
                    <span className="landing-chip landing-chip-emc" aria-hidden>
                      E=mc²
                    </span>
                    <div className="landing-float-shadow" aria-hidden />
                    <article className="landing-float overflow-hidden rounded-2xl bg-white ring-1 ring-white/40">
                      <div className="flex items-center gap-2 border-b border-line bg-primary px-3 py-2.5 sm:px-4">
                        <span className="h-2 w-2 rounded-full bg-white/35" />
                        <span className="h-2 w-2 rounded-full bg-white/35" />
                        <span className="h-2 w-2 rounded-full bg-white/35" />
                        <p className="ml-2 min-w-0 flex-1 truncate text-center text-xs font-medium text-white/90">
                          មេរៀនទី១ · អនុគមន៍
                        </p>
                        <span className="shrink-0 rounded bg-white/15 px-2 py-0.5 text-[10px] text-white">
                          ថ្នាក់ទី១០
                        </span>
                      </div>

                      <div className="p-3 sm:p-4">
                        <div className="relative overflow-hidden rounded-xl bg-primary-dark">
                          <div className="flex aspect-[16/9] flex-col items-center justify-center gap-2">
                            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold text-base font-bold text-primary-dark shadow">
                              ▶
                            </span>
                            <p className="text-[11px] text-white/70">វីដេអូ MoEYS</p>
                          </div>
                        </div>
                        <p className="mt-1.5 text-[11px] text-ink-muted">
                          ប្រភព៖ ក្រសួងអប់រំ យុវជន និងកីឡា
                        </p>

                        <div className="mt-4 space-y-2.5">
                          <div className="ml-4 rounded-2xl rounded-tr-md bg-primary px-3 py-2.5 text-[13px] leading-snug text-white sm:ml-6 sm:px-3.5">
                            តើដែនកំណត់នៃ f(x) = 1/x គឺជាអ្វី?
                          </div>
                          <div className="mr-3 rounded-2xl rounded-tl-md bg-primary-light px-3 py-2.5 text-[13px] leading-snug text-ink sm:mr-4 sm:px-3.5">
                            ដែនកំណត់គឺ ℝ\{"{0}"} ព្រោះមិនអាចចែកនឹងសូន្យបាន។
                            <span className="mt-2 flex">
                              <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-[11px] font-medium text-primary shadow-sm">
                                🔊 ស្តាប់
                              </span>
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 rounded-xl bg-cta py-2.5 text-center text-sm font-bold text-white shadow-sm">
                          ចាប់ផ្តើមតេស្ត
                        </div>
                      </div>
                    </article>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-primary sm:text-3xl">
              រៀនតាមជំហានទាំង៣
            </h2>
            <p className="mt-2 text-ink-muted">សាមញ្ញ ងាយយល់ និងសម្រាប់សិស្សគ្រប់កម្រិត</p>
          </div>

          <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-3 sm:gap-6">
            {[
              {
                step: "១",
                title: "មើលវីដេអូ MoEYS",
                body: "វីដេអូមេរៀនផ្លូវការពីក្រសួងអប់រំ តាមជំពូកសៀវភៅសិក្សា",
              },
              {
                step: "២",
                title: "សួរគ្រូ AI",
                body: "ចំណុចណាមិនយល់ សួរបានភ្លាមៗ ជាភាសាខ្មែរ មានសំឡេងអានចម្លើយ",
              },
              {
                step: "៣",
                title: "ធ្វើតេស្ត",
                body: "សំណួរ MCQ ជាមួយការពន្យល់ថាហេតុអ្វីចម្លើយត្រឹមត្រូវ",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-line bg-bg px-5 py-7 text-center sm:px-6 sm:py-8"
              >
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-black text-white">
                  {item.step}
                </span>
                <h3 className="mt-4 text-lg font-bold text-primary sm:mt-5">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-line bg-primary px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center text-sm text-white/80">
        <p>
          គ្រូ AI អាចមានកំហុស។ វីដេអូ MoEYS និងសៀវភៅសិក្សាផ្លូវការ
          គឺជាប្រភពយោងចម្បង។
        </p>
        <p className="mt-2 text-white/55">© {new Date().getFullYear()} AI Tutor</p>
      </footer>
    </div>
  );
}
