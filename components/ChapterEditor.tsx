"use client";

import Link from "next/link";
import { useState } from "react";
import { generateChapterContent } from "@/lib/api";
import { toKhmerNumber } from "@/lib/format";
import type { Chapter, Grade, SubjectId } from "@/lib/types";

interface EditableQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

/**
 * Single long-form editor: metadata → MoEYS → source text → Generate →
 * review summary/MCQs → approve. Saving is mocked until the backend exists.
 */
export default function ChapterEditor({ chapter }: { chapter: Chapter | null }) {
  const [grade, setGrade] = useState(chapter?.grade ?? 10);
  const [subject, setSubject] = useState<SubjectId>(chapter?.subject ?? "math");
  const [title, setTitle] = useState(chapter?.title ?? "");
  const [sortOrder, setSortOrder] = useState(chapter?.sortOrder ?? 1);
  const [embedUrl, setEmbedUrl] = useState(chapter?.moeysEmbedUrl ?? "");
  const [credit, setCredit] = useState(
    chapter?.moeysCredit ??
      "វីដេអូមេរៀនផលិតដោយ ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)។ ខ្លឹមសារដើមជាកម្មសិទ្ធិរបស់ក្រសួង។",
  );
  const [sourceText, setSourceText] = useState(chapter?.sourceText ?? "");
  const [summary, setSummary] = useState(chapter?.summary ?? "");
  const [questions, setQuestions] = useState<EditableQuestion[]>(
    chapter?.questions.map((q) => ({
      prompt: q.prompt,
      options: [...q.options],
      correctIndex: q.correctIndex,
      explanation: q.explanation,
    })) ?? [],
  );
  const [status, setStatus] = useState(chapter?.status ?? "draft");
  const [generating, setGenerating] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const generate = async () => {
    if (!sourceText.trim() || generating) return;
    setGenerating(true);
    const generated = await generateChapterContent(subject);
    setSummary(generated.summary);
    setQuestions(generated.questions.map((q) => ({ ...q, options: [...q.options] })));
    setGenerating(false);
  };

  const updateQuestion = (
    index: number,
    patch: Partial<EditableQuestion>,
  ): void => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, ...patch } : q)),
    );
  };

  const save = (nextStatus: "draft" | "approved") => {
    setStatus(nextStatus);
    setSavedNotice(
      nextStatus === "approved"
        ? "បានអនុម័ត (សាកល្បង — ការរក្សាទុកពិតប្រាកដនឹងភ្ជាប់ជាមួយម៉ាស៊ីនមេ)"
        : "បានរក្សាទុកជាព្រាង (សាកល្បង)",
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const inputClass =
    "mt-1 w-full rounded-md border border-line px-3 py-2.5 text-base focus:border-primary focus:outline-none";

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      {savedNotice ? (
        <div className="rounded-lg bg-success-soft px-4 py-3 text-sm font-bold text-success">
          {savedNotice}
        </div>
      ) : null}

      {/* 1. Metadata */}
      <section className="rounded-xl border border-line bg-surface p-5">
        <h2 className="font-bold text-primary">១. ព័ត៌មានមេរៀន</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">
            ថ្នាក់
            <select
              value={grade}
              onChange={(e) => setGrade(Number(e.target.value) as Grade)}
              className={inputClass}
            >
              <option value={10}>ថ្នាក់ទី១០</option>
              <option value={11}>ថ្នាក់ទី១១</option>
              <option value={12}>ថ្នាក់ទី១២</option>
            </select>
          </label>
          <label className="text-sm font-medium">
            មុខវិជ្ជា
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as SubjectId)}
              className={inputClass}
            >
              <option value="math">គណិតវិទ្យា</option>
              <option value="history">ប្រវត្តិវិទ្យា</option>
            </select>
          </label>
          <label className="text-sm font-medium sm:col-span-2">
            ចំណងជើងមេរៀន
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ឧ. អនុគមន៍"
              className={inputClass}
            />
          </label>
          <label className="text-sm font-medium">
            លំដាប់មេរៀន
            <input
              type="number"
              min={1}
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className={inputClass}
            />
          </label>
        </div>
      </section>

      {/* 2. MoEYS video */}
      <section className="rounded-xl border border-line bg-surface p-5">
        <h2 className="font-bold text-primary">២. វីដេអូ MoEYS</h2>
        <div className="mt-4 flex flex-col gap-4">
          <label className="text-sm font-medium">
            Embed URL
            <input
              value={embedUrl}
              onChange={(e) => setEmbedUrl(e.target.value)}
              placeholder="https://…"
              className={inputClass}
            />
          </label>
          <label className="text-sm font-medium">
            អត្ថបទបញ្ជាក់ប្រភព (Credit)
            <textarea
              value={credit}
              onChange={(e) => setCredit(e.target.value)}
              rows={2}
              className={inputClass}
            />
          </label>
        </div>
      </section>

      {/* 3. Source text + Generate */}
      <section className="rounded-xl border border-line bg-surface p-5">
        <h2 className="font-bold text-primary">៣. អត្ថបទប្រភព (ពីសៀវភៅសិក្សា)</h2>
        <p className="mt-1 text-sm text-ink-muted">
          បិទភ្ជាប់អត្ថបទមេរៀនពី PDF សៀវភៅសិក្សា រួចចុច «បង្កើតដោយ AI» —
          AI នឹងសរសេរសង្ខេប និងសំណួរ MCQ ឱ្យស្វ័យប្រវត្តិ។
        </p>
        <textarea
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          rows={7}
          placeholder="បិទភ្ជាប់អត្ថបទមេរៀននៅទីនេះ…"
          className={inputClass}
        />
        <button
          type="button"
          onClick={generate}
          disabled={!sourceText.trim() || generating}
          className="mt-4 min-h-11 w-full rounded-lg bg-primary px-6 py-2.5 font-bold text-white hover:bg-primary-dark disabled:opacity-50 sm:w-auto"
        >
          {generating ? "កំពុងបង្កើត…" : "✨ បង្កើតដោយ AI"}
        </button>
        {generating ? (
          <p className="mt-2 text-sm text-ink-muted">
            AI កំពុងអានអត្ថបទប្រភព និងសរសេរសង្ខេប + សំណួរ… (សាកល្បង)
          </p>
        ) : null}
      </section>

      {/* 4. Review generated content */}
      <section className="rounded-xl border border-line bg-surface p-5">
        <h2 className="font-bold text-primary">៤. សង្ខេបមេរៀន (ពិនិត្យ និងកែសម្រួល)</h2>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={7}
          placeholder="សង្ខេបនឹងបង្ហាញនៅទីនេះបន្ទាប់ពីបង្កើតដោយ AI…"
          className={inputClass}
        />
      </section>

      <section className="rounded-xl border border-line bg-surface p-5">
        <h2 className="font-bold text-primary">
          ៥. សំណួរ MCQ ({questions.length})
        </h2>
        {questions.length === 0 ? (
          <p className="mt-3 rounded-lg bg-bg px-4 py-6 text-center text-sm text-ink-muted">
            មិនទាន់មានសំណួរ — ប្រើ «បង្កើតដោយ AI» ខាងលើ
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-5">
            {questions.map((question, qIndex) => (
              <div key={qIndex} className="rounded-lg border border-line p-4">
                <label className="text-sm font-medium">
                  សំណួរទី{toKhmerNumber(qIndex + 1)}
                  <input
                    value={question.prompt}
                    onChange={(e) => updateQuestion(qIndex, { prompt: e.target.value })}
                    className={inputClass}
                  />
                </label>
                <div className="mt-3 flex flex-col gap-2">
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={question.correctIndex === optionIndex}
                        onChange={() =>
                          updateQuestion(qIndex, { correctIndex: optionIndex })
                        }
                        title="ចម្លើយត្រឹមត្រូវ"
                      />
                      <input
                        value={option}
                        onChange={(e) => {
                          const options = [...question.options];
                          options[optionIndex] = e.target.value;
                          updateQuestion(qIndex, { options });
                        }}
                        className="w-full rounded-md border border-line px-3 py-2 text-base focus:border-primary focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
                <label className="mt-3 block text-sm font-medium">
                  ការពន្យល់
                  <textarea
                    value={question.explanation}
                    onChange={(e) =>
                      updateQuestion(qIndex, { explanation: e.target.value })
                    }
                    rows={2}
                    className={inputClass}
                  />
                </label>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 6. Publish */}
      <section className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface p-5">
        <span className="text-sm font-medium">
          ស្ថានភាព៖{" "}
          {status === "approved" ? (
            <span className="font-bold text-success">បានអនុម័ត</span>
          ) : (
            <span className="font-bold text-cta">ព្រាង</span>
          )}
        </span>
        <div className="ml-auto flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <button
            type="button"
            onClick={() => save("draft")}
            className="min-h-11 rounded-lg border border-primary px-5 py-2.5 font-bold text-primary hover:bg-primary-light"
          >
            រក្សាទុកជាព្រាង
          </button>
          <button
            type="button"
            onClick={() => save("approved")}
            disabled={!title.trim() || !summary.trim() || questions.length === 0}
            className="min-h-11 rounded-lg bg-cta px-5 py-2.5 font-bold text-white hover:bg-cta-dark disabled:opacity-50"
          >
            អនុម័ត និងផ្សព្វផ្សាយ
          </button>
        </div>
      </section>

      <Link href="/admin" className="text-sm text-ink-muted hover:text-primary">
        ← ត្រឡប់ទៅបញ្ជីមេរៀន
      </Link>
    </div>
  );
}
