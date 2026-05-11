import { createFileRoute, useNavigate, useParams, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo } from "react";
import { ChevronLeft } from "lucide-react";
import { useAssessmentStore } from "@/store/assessmentStore";
import { naturalQuestions } from "@/data/questionsNatural";
import { strengthQuestions } from "@/data/questionsStrength";
import { AnswerScale } from "@/components/assessment/AnswerScale";
import { ProgressTracker } from "@/components/assessment/ProgressTracker";
import { QuestionCard } from "@/components/assessment/QuestionCard";
import { progressFor } from "@/engine/scoring";
import type { AnswerValue, AssessmentSession } from "@/types/assessment";

export const Route = createFileRoute("/assessment/$session")({
  component: AssessmentPage,
});

const LABELS: Record<AssessmentSession, { left: string; right: string; title: string; help: string }> = {
  natural: {
    left: "Sangat bukan saya banget",
    right: "Sangat saya banget",
    title: "Sesi 1 — Bakat Alami",
    help: "Jawab spontan sesuai pola yang paling terasa.",
  },
  strength: {
    left: "Sangat Lemah",
    right: "Sangat Kuat",
    title: "Sesi 2 — Kekuatan Aktivitas",
    help: "Jawab berdasarkan pengalaman nyata.",
  },
};

function AssessmentPage() {
  const { session } = useParams({ from: "/assessment/$session" });
  const s = session as AssessmentSession;
  const navigate = useNavigate();
  const { identity, answers, currentIndex, setAnswer, setCurrentIndex } = useAssessmentStore();

  const questions = useMemo(() => (s === "natural" ? naturalQuestions : strengthQuestions), [s]);
  const sessionAnswers = answers[s];
  const idx = Math.min(Math.max(currentIndex[s] ?? 0, 0), questions.length - 1);
  const question = questions[idx];
  const naturalProgress = progressFor("natural", answers);

  useEffect(() => {
    if (!identity) {
      navigate({ to: "/identity" });
      return;
    }
    if (s === "strength" && !naturalProgress.done) {
      navigate({ to: "/assessment/$session", params: { session: "natural" } });
    }
  }, [identity, navigate, naturalProgress.done, s]);

  const handleSelect = useCallback(
    (value: AnswerValue) => {
      if (!question) return;
      setAnswer(s, question.id, value);
      setTimeout(() => {
        if (idx + 1 >= questions.length) {
          if (s === "natural") navigate({ to: "/transition" });
          else navigate({ to: "/completion" });
        } else {
          setCurrentIndex(s, idx + 1);
        }
      }, 430);
    },
    [idx, navigate, question, questions.length, s, setAnswer, setCurrentIndex],
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || target?.isContentEditable) return;
      if (/^[1-7]$/.test(event.key)) {
        event.preventDefault();
        handleSelect(Number(event.key) as AnswerValue);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleSelect]);

  function goBack() {
    if (idx > 0) setCurrentIndex(s, idx - 1);
  }

  if (!question) return null;

  return (
    <main className="assessment-shell min-h-dvh bg-background flex flex-col">
      <div className="sticky top-0 z-10 border-b border-border/40 bg-background/88 backdrop-blur-md">
        <div className="mx-auto max-w-md px-3.5 py-2.5 sm:px-5">
          <div className="mb-1.5 flex items-center justify-between">
            <button
              onClick={goBack}
              disabled={idx === 0}
              className="inline-flex items-center gap-1 text-[11px] text-muted-foreground disabled:opacity-30"
            >
              <ChevronLeft className="size-3.5" /> Sebelumnya
            </button>
            <Link to="/" className="text-[11px] text-muted-foreground">
              Jeda
            </Link>
          </div>
          <ProgressTracker current={idx + 1} total={questions.length} label={LABELS[s].title} />
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-md flex-1 px-3.5 py-3 sm:px-5 sm:py-5">
        <div className="w-full">
          <QuestionCard number={question.number} total={questions.length} text={question.text}>
            <AnswerScale
              value={sessionAnswers[question.id]}
              onSelect={handleSelect}
              leftLabel={LABELS[s].left}
              rightLabel={LABELS[s].right}
              session={s}
            />
          </QuestionCard>

          <p className="mt-2 text-center text-[10.5px] leading-tight text-muted-foreground sm:mt-4 sm:text-[11px]">
            {LABELS[s].help} <span className="hidden sm:inline">Desktop: tekan angka 1–7.</span>
          </p>
        </div>
      </div>
    </main>
  );
}
