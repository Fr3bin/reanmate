"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { recordQuizResult } from "@/lib/progress";
import { toKhmerNumber } from "@/lib/format";
import type { Chapter } from "@/lib/types";

interface NextChapterInfo {
  id: string;
  title: string;
  grade: number;
  subject: string;
}

export default function QuizRunner({
  chapter,
  nextChapter,
}: {
  chapter: Chapter;
  nextChapter: NextChapterInfo | null;
}) {
  // question id -> selected option index
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);

  const questions = useMemo(
    () => [...chapter.questions].sort((a, b) => a.sortOrder - b.sortOrder),
    [chapter.questions],
  );

  const answeredCount = Object.keys(answers).length;
  const correctCount = questions.filter(
    (q) => answers[q.id] === q.correctIndex,
  ).length;
  const scorePercent =
    questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const passed = scorePercent >= 70;

  const select = (questionId: string, optionIndex: number) => {
    // Lock the answer after first pick — feedback is immediate
    if (answers[questionId] !== undefined || finished) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const finish = () => {
    setFinished(true);
    recordQuizResult(chapter.id, scorePercent);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const retry = () => {
    setAnswers({});
    setFinished(false);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="flex flex-col gap-6">
      {finished ? (
        <div
          className={`rounded-xl p-6 text-center ${
            passed ? "bg-success-soft" : "bg-error-soft"
          }`}
        >
          <p className="text-3xl font-black">
            {toKhmerNumber(correctCount)}/{toKhmerNumber(questions.length)} (
            {toKhmerNumber(scorePercent)}%)
          </p>
          {passed ? (
            <>
              <p className="mt-2 text-lg font-bold text-success">
                🎉 អបអរសាទរ! អ្នកបានបញ្ចប់មេរៀននេះ
              </p>
              {nextChapter ? (
                <Link
                  href={`/learn/${nextChapter.grade}/${nextChapter.subject}/${nextChapter.id}`}
                  className="mt-4 inline-block max-w-full break-words rounded-lg bg-primary px-6 py-2.5 font-bold text-white hover:bg-primary-dark"
                >
                  មេរៀនបន្ទាប់៖ {nextChapter.title} →
                </Link>
              ) : (
                <Link
                  href={`/learn/${chapter.grade}/${chapter.subject}`}
                  className="mt-4 inline-block max-w-full rounded-lg bg-primary px-6 py-2.5 font-bold text-white hover:bg-primary-dark"
                >
                  ត្រឡប់ទៅបញ្ជីមេរៀន
                </Link>
              )}
            </>
          ) : (
            <>
              <p className="mt-2 text-lg font-bold text-error">
                ត្រូវការ ៧០% ដើម្បីបញ្ចប់មេរៀន — កុំបោះបង់!
              </p>
              <button
                type="button"
                onClick={retry}
                className="mt-4 rounded-lg bg-cta px-6 py-2.5 font-bold text-white hover:bg-cta-dark"
              >
                ព្យាយាមម្តងទៀត
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="rounded-md bg-section px-4 py-2 text-sm text-ink-muted">
          បានឆ្លើយ {toKhmerNumber(answeredCount)}/{toKhmerNumber(questions.length)} —
          ជ្រើសរើសចម្លើយ រួចមើលការពន្យល់ភ្លាមៗ
        </div>
      )}

      {questions.map((question, qIndex) => {
        const selected = answers[question.id];
        const isAnswered = selected !== undefined;

        return (
          <div
            key={question.id}
            className="rounded-xl border border-line bg-surface p-4 sm:p-5"
          >
            <p className="font-bold">
              {toKhmerNumber(qIndex + 1)}. {question.prompt}
            </p>

            <div className="mt-4 flex flex-col gap-2">
              {question.options.map((option, optionIndex) => {
                const isCorrect = optionIndex === question.correctIndex;
                const isSelected = selected === optionIndex;

                let style = "border-line bg-surface hover:border-primary";
                if (isAnswered) {
                  if (isCorrect) style = "border-success bg-success-soft";
                  else if (isSelected) style = "border-error bg-error-soft";
                  else style = "border-line bg-surface opacity-60";
                }

                return (
                  <button
                    key={optionIndex}
                    type="button"
                    onClick={() => select(question.id, optionIndex)}
                    disabled={isAnswered}
                    className={`rounded-lg border px-4 py-2.5 text-left text-[15px] transition ${style}`}
                  >
                    {option}
                    {isAnswered && isCorrect ? (
                      <span className="ml-2 font-bold text-success">✓</span>
                    ) : null}
                    {isAnswered && isSelected && !isCorrect ? (
                      <span className="ml-2 font-bold text-error">✗</span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            {isAnswered ? (
              <div className="mt-4 rounded-lg bg-primary-light p-4 text-sm">
                <p className="font-bold text-primary">ការពន្យល់</p>
                <p className="mt-1">{question.explanation}</p>
              </div>
            ) : null}
          </div>
        );
      })}

      {!finished ? (
        <button
          type="button"
          onClick={finish}
          disabled={answeredCount < questions.length}
          className="min-h-12 w-full rounded-xl bg-cta py-3.5 text-lg font-bold text-white transition hover:bg-cta-dark disabled:opacity-50"
        >
          {answeredCount < questions.length
            ? `សូមឆ្លើយសំណួរទាំងអស់ (${toKhmerNumber(answeredCount)}/${toKhmerNumber(questions.length)})`
            : "បញ្ចប់តេស្ត"}
        </button>
      ) : null}
    </div>
  );
}
