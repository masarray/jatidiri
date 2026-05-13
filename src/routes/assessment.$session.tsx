import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
    title: "Sesi 1 — Zona Kekuatan Alami",
    help: "Pilih yang paling menggambarkan gerak alami kamu, bukan jawaban yang terlihat paling baik.",
  },
  strength: {
    title: "Sesi 2 — Kemampuan yang Sudah Terlihat",
    help: "Nilai kemampuan yang sudah terlihat dalam pengalaman nyata, bukan sekadar minat.",
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
      if (/^[1-5]$/.test(event.key)) {
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
    <main className="h-[100svh] overflow-hidden bg-[linear-gradient(180deg,#fbf8ef_0%,#f7f4ec_48%,#f4f1e9_100%)] text-foreground">
      <div className="mx-auto flex h-full w-full max-w-md flex-col px-3.5 pb-[max(.7rem,env(safe-area-inset-bottom))] pt-3 sm:px-5 sm:py-4">
        <div className="shrink-0">
          <ProgressTracker
            current={idx + 1}
            total={questions.length}
            label={LABELS[s].title}
            canGoBack={idx > 0 && !locked}
            onBack={goBack}
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pt-3.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <QuestionCard number={question.number} total={questions.length} text={question.text}>
            <AnswerScale
              value={sessionAnswers[question.id]}
              onSelect={handleSelect}
              session={s}
              disabled={locked}
            />
          </QuestionCard>
        </div>
      </div>
    </main>
  );
}
