import { createFileRoute, useNavigate, useParams, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

const LABELS: Record<AssessmentSession, { title: string; help: string }> = {
  natural: {
    title: "Sesi 1 — Bakat Alami",
    help: "Jawab spontan sesuai pola yang paling terasa.",
  },
  strength: {
    title: "Sesi 2 — Kekuatan Aktivitas",
    help: "Jawab berdasarkan pengalaman nyata.",
  },
};

function AssessmentPage() {
  const { session } = useParams({ from: "/assessment/$session" });
  const s = session as AssessmentSession;
  const navigate = useNavigate();
  const { identity, answers, currentIndex, setAnswer, setCurrentIndex } = useAssessmentStore();
  const [locked, setLocked] = useState(false);
  const unlockTimerRef = useRef<number | null>(null);

  const questions = useMemo(() => (s === "natural" ? naturalQuestions : strengthQuestions), [s]);
  const sessionAnswers = answers[s];
  const idx = Math.min(Math.max(currentIndex[s] ?? 0, 0), questions.length - 1);
  const question = questions[idx];
  const naturalProgress = progressFor("natural", answers);

  useEffect(() => {
    return () => {
      if (unlockTimerRef.current) window.clearTimeout(unlockTimerRef.current);
    };
  }, []);

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
      if (!question || locked) return;
      setLocked(true);
      setAnswer(s, question.id, value);

      window.setTimeout(() => {
        if (idx + 1 >= questions.length) {
          if (s === "natural") navigate({ to: "/transition" });
          else navigate({ to: "/completion" });
        } else {
          setCurrentIndex(s, idx + 1);
          unlockTimerRef.current = window.setTimeout(() => setLocked(false), 42);
        }
      }, 74);
    },
    [idx, locked, navigate, question, questions.length, s, setAnswer, setCurrentIndex],
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
    if (idx > 0 && !locked) setCurrentIndex(s, idx - 1);
  }

  if (!question) return null;

  return (
    <main className="h-[100svh] overflow-hidden bg-background text-foreground">
      <div className="mx-auto flex h-full w-full max-w-md flex-col px-3 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 sm:px-5 sm:py-4">
        <div className="shrink-0">
          <div className="mb-2 flex items-center justify-between px-1">
            <button
              type="button"
              onClick={goBack}
              disabled={idx === 0 || locked}
              className="inline-flex items-center gap-1 rounded-full px-1.5 py-1 text-[11px] text-muted-foreground transition active:scale-[0.98] disabled:opacity-30"
            >
              <ChevronLeft className="size-3.5" /> Sebelumnya
            </button>
            <Link to="/" className="rounded-full px-2 py-1 text-[11px] text-muted-foreground transition active:scale-[0.98]">
              Jeda
            </Link>
          </div>
          <ProgressTracker current={idx + 1} total={questions.length} label={LABELS[s].title} />
        </div>

        <div className="min-h-0 flex-1 overflow-hidden pt-3">
          <QuestionCard number={question.number} total={questions.length} text={question.text}>
            <AnswerScale
              value={sessionAnswers[question.id]}
              onSelect={handleSelect}
              session={s}
              disabled={locked}
            />
          </QuestionCard>

          <p className="mt-1.5 hidden text-center text-[10.5px] leading-tight text-muted-foreground sm:block">
            {LABELS[s].help} Desktop: tekan angka 1–7.
          </p>
        </div>
      </div>
    </main>
  );
}
