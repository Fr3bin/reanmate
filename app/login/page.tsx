"use client";

import { useEffect, useState } from "react";
import Mascot from "@/components/Mascot";
import SiteNavbar from "@/components/SiteNavbar";
import { useToast } from "@/components/ToastProvider";
import {
  authErrorMessage,
  getSession,
  login,
  resetPassword,
  sendPasswordResetCode,
  signup,
  signInWithGoogle,
} from "@/lib/api/auth";
import { destinationAfterLogin } from "@/lib/auth-user";

type Step = "email" | "reset-email" | "reset-code";
type AuthMode = "signin" | "signup";

export default function LoginPage() {
  const [step, setStep] = useState<Step>("email");
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const syncHash = () => {
      const nextMode = window.location.hash === "#signup" ? "signup" : "signin";
      setMode(nextMode);
      setStep("email");
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    let active = true;
    void getSession().then((user) => {
      if (active && user) {
        window.location.replace(destinationAfterLogin(
          new URLSearchParams(window.location.search).get("next"),
          user.role,
        ));
      }
    }).catch(() => { /* The form reports service errors when submitted. */ });
    return () => {
      active = false;
      window.removeEventListener("hashchange", syncHash);
    };
  }, []);

  const nextPath = typeof window === "undefined"
    ? null
    : new URLSearchParams(window.location.search).get("next");
  const safeNextPath = nextPath && /^\/(home|learn|admin)(\/|\?|$)/.test(nextPath) && !nextPath.includes("\\")
    ? nextPath
    : null;
  const callbackURL = safeNextPath ?? "/home";
  const loginHref = safeNextPath ? `/login?next=${encodeURIComponent(safeNextPath)}` : "/login";
  const inputClass =
    "mt-1 w-full rounded-xl border border-line bg-bg/50 px-3 py-2.5 text-base focus:border-primary focus:outline-none";
  const divider = (
    <div className="my-4 flex items-center gap-3 text-xs text-ink-muted">
      <span className="h-px flex-1 bg-line" />
      <span>ឬ</span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
  const googleButton = (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        if (pending) return;
        setPending(true);
        try {
          await signInWithGoogle(callbackURL);
        } catch (error) {
          toast.error(authErrorMessage(error));
          setPending(false);
        }
      }}
      className="ui-btn flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 font-semibold text-ink hover:border-primary/40 disabled:cursor-wait disabled:opacity-60"
    >
      <span className="text-lg font-bold text-primary">G</span>
      {mode === "signup" ? "ចុះឈ្មោះជាមួយ Google" : "ចូលជាមួយ Google"}
    </button>
  );

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <SiteNavbar variant="auth" homeHref="/" />

      <div className="flex flex-1 flex-col lg:flex-row">
        <aside className="relative hidden overflow-hidden bg-primary-dark px-12 py-16 text-white lg:flex lg:w-[44%] lg:flex-col lg:justify-center">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(212,176,92,0.18),_transparent_55%)]"
          />
          <div className="relative">
            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-primary">
              <Mascot size={80} onDark className="mascot-bob" />
            </div>
            <p className="ui-kicker">ReanMate · មិត្ត AI</p>
            <h2 className="mt-3 text-3xl font-bold leading-snug">
              រៀនគណិត និងប្រវត្តិ
              <span className="mt-1 block text-gold">ជាមួយមិត្ត AI</span>
            </h2>
            <ul className="mt-8 space-y-3 text-sm text-white/70">
              <li>មើលវីដេអូ MoEYS តាមមេរៀន</li>
              <li>សួរ AI បើមានចំណុចមិនយល់</li>
              <li>ធ្វើតេស្ត មានការពន្យល់</li>
            </ul>
          </div>
        </aside>

        <main className="rise mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center px-4 py-14 pb-[max(2.5rem,env(safe-area-inset-bottom))] lg:max-w-none lg:px-10">
          <div className="mx-auto w-full max-w-[420px] ui-card px-6 py-8 sm:px-8">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary-dark lg:hidden">
              <Mascot size={64} onDark className="mascot-bob" />
            </div>
            <h1 className="text-center text-2xl font-bold text-primary">
              {step.startsWith("reset")
                ? "កំណត់ពាក្យសម្ងាត់ថ្មី"
                : mode === "signup" ? "ចុះឈ្មោះ" : "ចូលគណនី"}
            </h1>
            <p className="mb-5 mt-2 text-center text-sm text-ink-muted">
              {step.startsWith("reset")
                ? "បញ្ចូលអ៊ីមែល ដើម្បីទទួលលេខកូដ"
                : mode === "signup"
                  ? "បង្កើតគណនីសិស្សដោយប្រើអ៊ីមែល ឬ Google"
                  : "ចូលដោយប្រើអ៊ីមែល ពាក្យសម្ងាត់ ឬ Google"}
            </p>

            {step === "email" ? (
              <>
                <form
                  className="flex flex-col gap-4"
                  onSubmit={async (event) => {
                    event.preventDefault();
                    if (pending) return;
                    const data = new FormData(event.currentTarget);
                    const nextName = String(data.get("name") ?? "").trim();
                    const nextEmail = String(data.get("email") ?? "").trim().toLowerCase();
                    if (mode === "signup" && !nextName) {
                      toast.error("សូមបញ្ចូលឈ្មោះរបស់អ្នក។");
                      return;
                    }
                    const password = String(data.get("password") ?? "");
                    if (mode === "signup") {
                      const confirm = String(data.get("confirm") ?? "");
                      if (password !== confirm) {
                        toast.error("ពាក្យសម្ងាត់ទាំងពីរមិនដូចគ្នាទេ។");
                        return;
                      }
                      setPending(true);
                      try {
                        const user = await signup(nextEmail, password, nextName);
                        toast.success(`សូមស្វាគមន៍ ${user.displayName || user.email}!`);
                        window.location.replace(destinationAfterLogin(nextPath, user.role));
                      } catch (error) {
                        toast.error(authErrorMessage(error, true));
                        setPending(false);
                      }
                      return;
                    }
                    setPending(true);
                    try {
                      const user = await login(nextEmail, password);
                      toast.success(`សូមស្វាគមន៍ ${user.displayName || user.email}!`);
                      window.location.replace(destinationAfterLogin(nextPath, user.role));
                    } catch (error) {
                      toast.error(authErrorMessage(error));
                      setPending(false);
                    }
                  }}
                >
                  {mode === "signup" ? (
                    <label className="text-sm font-medium">
                      ឈ្មោះពេញ
                      <input
                        required
                        maxLength={100}
                        disabled={pending}
                        type="text"
                        name="name"
                        autoComplete="name"
                        placeholder="ឧ. Kim Kheang"
                        className={inputClass}
                      />
                    </label>
                  ) : null}
                  <label className="text-sm font-medium">
                    អ៊ីមែល
                    <input
                      required
                      maxLength={254}
                      disabled={pending}
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </label>
                  <label className="text-sm font-medium">
                    ពាក្យសម្ងាត់
                    <input
                      required
                      minLength={8}
                      maxLength={128}
                      disabled={pending}
                      type="password"
                      name="password"
                      autoComplete={mode === "signup" ? "new-password" : "current-password"}
                      placeholder="យ៉ាងហោចណាស់ ៨ តួអក្សរ"
                      className={inputClass}
                    />
                  </label>
                  {mode === "signup" ? (
                    <label className="text-sm font-medium">
                      បញ្ជាក់ពាក្យសម្ងាត់
                      <input
                        required
                        minLength={8}
                        maxLength={128}
                        disabled={pending}
                        type="password"
                        name="confirm"
                        autoComplete="new-password"
                        placeholder="យ៉ាងហោចណាស់ ៨ តួអក្សរ"
                        className={inputClass}
                      />
                    </label>
                  ) : null}
                  <button
                    type="submit"
                    disabled={pending}
                    aria-busy={pending}
                    className="ui-btn min-h-11 rounded-xl bg-primary py-2.5 font-semibold text-white hover:bg-primary-dark disabled:cursor-wait disabled:opacity-60"
                  >
                    {pending ? mode === "signup" ? "កំពុងបង្កើត…" : "កំពុងចូល…" : mode === "signup" ? "បង្កើតគណនី" : "ចូលគណនី"}
                  </button>
                  {mode === "signin" ? (
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => setStep("reset-email")}
                      className="ui-btn min-h-11 rounded-xl px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5 disabled:opacity-60"
                    >
                      ភ្លេចពាក្យសម្ងាត់?
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => {
                        window.history.replaceState(null, "", loginHref);
                        setMode("signin");
                        setStep("email");
                      }}
                      className="ui-btn flex min-h-11 items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5"
                    >
                      មានគណនីរួចហើយ?
                    </button>
                  )}
                </form>
                {divider}
                {googleButton}
              </>
            ) : (
              step === "reset-email" ? (
                <form
                  className="flex flex-col gap-4"
                  onSubmit={async (event) => {
                    event.preventDefault();
                    if (pending) return;
                    const data = new FormData(event.currentTarget);
                    const nextEmail = String(data.get("email") ?? "").trim().toLowerCase();
                    setPending(true);
                    try {
                      await sendPasswordResetCode(nextEmail);
                      setEmail(nextEmail);
                      setStep("reset-code");
                      toast.success("បានផ្ញើលេខកូដកំណត់ពាក្យសម្ងាត់ថ្មី។");
                    } catch (error) {
                      toast.error(authErrorMessage(error));
                    } finally {
                      setPending(false);
                    }
                  }}
                >
                  <label className="text-sm font-medium">
                    អ៊ីមែល
                    <input
                      required
                      maxLength={254}
                      disabled={pending}
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={pending}
                    aria-busy={pending}
                    className="ui-btn min-h-11 rounded-xl bg-primary py-2.5 font-semibold text-white hover:bg-primary-dark disabled:cursor-wait disabled:opacity-60"
                  >
                    {pending ? "កំពុងផ្ញើ…" : "ផ្ញើលេខកូដ"}
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => setStep("email")}
                    className="ui-btn min-h-11 rounded-xl border border-line px-4 py-2.5 font-semibold text-primary hover:border-primary/40 disabled:opacity-60"
                  >
                    ត្រឡប់ទៅចូលគណនី
                  </button>
                </form>
              ) : (
                <form
                  className="flex flex-col gap-4"
                  onSubmit={async (event) => {
                    event.preventDefault();
                    if (pending) return;
                    const data = new FormData(event.currentTarget);
                    const password = String(data.get("password") ?? "");
                    const confirm = String(data.get("confirm") ?? "");
                    if (password !== confirm) {
                      toast.error("ពាក្យសម្ងាត់ទាំងពីរមិនដូចគ្នាទេ។");
                      return;
                    }
                    setPending(true);
                    try {
                      await resetPassword(email, String(data.get("code") ?? ""), password);
                      toast.success("បានកំណត់ពាក្យសម្ងាត់ថ្មី។ សូមចូលគណនីម្ដងទៀត។");
                      setStep("email");
                    } catch (error) {
                      toast.error(authErrorMessage(error));
                      setPending(false);
                    }
                  }}
                >
                  <label className="text-sm font-medium">
                    លេខកូដ
                    <input
                      required
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      disabled={pending}
                      type="text"
                      name="code"
                      autoComplete="one-time-code"
                      placeholder="123456"
                      className={inputClass}
                    />
                  </label>
                  <label className="text-sm font-medium">
                    ពាក្យសម្ងាត់ថ្មី
                    <input
                      required
                      minLength={8}
                      maxLength={128}
                      disabled={pending}
                      type="password"
                      name="password"
                      autoComplete="new-password"
                      placeholder="យ៉ាងហោចណាស់ ៨ តួអក្សរ"
                      className={inputClass}
                    />
                  </label>
                  <label className="text-sm font-medium">
                    បញ្ជាក់ពាក្យសម្ងាត់ថ្មី
                    <input
                      required
                      minLength={8}
                      maxLength={128}
                      disabled={pending}
                      type="password"
                      name="confirm"
                      autoComplete="new-password"
                      placeholder="យ៉ាងហោចណាស់ ៨ តួអក្សរ"
                      className={inputClass}
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={pending}
                    aria-busy={pending}
                    className="ui-btn min-h-11 rounded-xl bg-primary py-2.5 font-semibold text-white hover:bg-primary-dark disabled:cursor-wait disabled:opacity-60"
                  >
                    {pending ? "កំពុងរក្សាទុក…" : "រក្សាទុកពាក្យសម្ងាត់ថ្មី"}
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => setStep("reset-email")}
                    className="ui-btn min-h-11 rounded-xl border border-line px-4 py-2.5 font-semibold text-primary hover:border-primary/40 disabled:opacity-60"
                  >
                    ផ្លាស់ប្តូរអ៊ីមែល
                  </button>
                </form>
              )
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
