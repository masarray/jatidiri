import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAssessmentStore } from "@/store/assessmentStore";
import { naturalQuestions } from "@/data/questionsNatural";
import { strengthQuestions } from "@/data/questionsStrength";
import { AnswerScale } from "@/components/assessment/AnswerScale";
import { ProgressTracker } from "@/components/assessment/ProgressTracker";
import { QuestionCard } from "@/components/assessment/QuestionCard";
import { progressFor } from "@/engine/scoring";
import type { ActionCardOption, AnswerRecord, AnswerValue, AssessmentSession, QuestionItem } from "@/types/assessment";

export const Route = createFileRoute("/assessment/$session")({
  component: AssessmentPage,
});

const LABELS: Record<AssessmentSession, { title: string; help: string }> = {
  natural: {
    title: "Sesi 1 — Context Action Cards",
    help: "Bayangkan situasinya. Pilih respons yang paling mungkin kamu lakukan secara alami, bukan yang paling ideal.",
  },
  strength: {
    title: "Sesi 2 — Bukti Kemampuan",
    help: "Pilih respons yang paling menggambarkan pengalaman nyata kamu saat kemampuan itu dipakai.",
  },
};

interface ActionCardsProps {
  question: Extract<QuestionItem, { format: "action_cards" }>;
  value?: AnswerRecord;
  disabled: boolean;
  onSelect: (optionId: ActionCardOption["id"]) => void;
}

function ActionCards({ question, value, disabled, onSelect }: ActionCardsProps) {
  const selected = value?.format === "action_cards" ? value.optionId : undefined;

  return (
    <div className="grid gap-2.5">
      {question.options.map((option) => {
        const active = selected === option.id;
        return (
          <button
            key={option.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(option.id)}
            className={`group relative flex min-h-[4.35rem] w-full items-center gap-3 overflow-hidden rounded-[1.05rem] border px-3.5 py-3 text-left transition-[transform,box-shadow,background,border-color,color] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#77be91]/25 disabled:pointer-events-none disabled:opacity-80 sm:min-h-[4.15rem] ${
              active
                ? "translate-y-[1px] border-[#8acaa1] bg-[linear-gradient(145deg,#f7fff8_0%,#edf8f0_100%)] text-[#24313a] shadow-[inset_4px_4px_10px_rgba(139,161,137,0.20),inset_-4px_-4px_10px_rgba(255,255,255,0.98),0_6px_14px_rgba(95,185,133,0.12)]"
                : "border-[#dfe9dc] bg-[linear-gradient(145deg,#ffffff_0%,#fbfff8_100%)] text-[#24313a] shadow-[6px_6px_14px_rgba(98,116,94,0.13),-6px_-6px_14px_rgba(255,255,255,0.96)] hover:-translate-y-[1px] hover:border-[#bfdabd] hover:bg-white hover:shadow-[7px_7px_16px_rgba(98,116,94,0.15),-7px_-7px_16px_rgba(255,255,255,0.98)] active:translate-y-[1px] active:scale-[0.996] active:bg-[#f1f8ef] active:text-[#33424a] active:shadow-[inset_4px_4px_10px_rgba(139,161,137,0.23),inset_-4px_-4px_10px_rgba(255,255,255,0.98)]"
            }`}
            aria-pressed={active}
          >
            <span
              className={`pointer-events-none absolute inset-x-4 top-0 h-px transition-opacity duration-150 ${
                active ? "opacity-0" : "bg-white/85 opacity-100"
              }`}
            />
            <span
              aria-hidden="true"
              className={`grid h-[1.08rem] w-[1.08rem] shrink-0 place-items-center rounded-[0.36rem] border transition-[background,border-color,box-shadow,transform] duration-150 ${
                active
                  ? "border-[#62b985] bg-[#62b985] text-white shadow-[inset_2px_2px_4px_rgba(52,122,80,0.28),inset_-2px_-2px_4px_rgba(255,255,255,0.24)]"
                  : "border-[#cfe2ce] bg-[#f8fcf6] text-[#4fb07a] shadow-[inset_1px_1px_2px_rgba(135,151,130,0.12),inset_-1px_-1px_2px_rgba(255,255,255,0.95)] group-hover:border-[#7fc69a] group-hover:bg-white group-active:scale-95 group-active:border-[#62b985] group-active:bg-[#eef9f1]"
              }`}
            >
              <svg
                viewBox="0 0 12 10"
                className={`h-2.5 w-2.5 transition-opacity duration-150 ${
                  active ? "opacity-100" : "opacity-0 group-hover:opacity-70 group-active:opacity-100"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 5.2 4.2 8.3 11 1" />
              </svg>
            </span>
            <span className="min-w-0 flex-1 text-[0.93rem] font-medium leading-[1.48] tracking-[-0.003em] sm:text-[0.96rem]">
              {option.text}
            </span>
          </button>
        );
      })}
      <p className="px-1 pt-0.5 text-[10.5px] leading-relaxed text-muted-foreground/88">
        Pilih yang paling mungkin terjadi. Tidak ada jawaban paling baik.
      </p>
    </div>
  );
}

function AssessmentPage() {
  const { session } = useParams({ from: "/assessment/$session" });
  const s = session as AssessmentSession;
  const navigate = useNavigate();
  const { identity, answers, currentIndex, setAnswer, setCurrentIndex } = useAssessmentStore();
  const [locked, setLocked] = useState(false);
  const unlockTimerRef = useRef<number | null>(null);

  const questions = useMemo<QuestionItem[]>(() => (s === "natural" ? naturalQuestions : strengthQuestions), [s]);
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

  const advance = useCallback(() => {
    window.setTimeout(() => {
      if (idx + 1 >= questions.length) {
        if (s === "natural") navigate({ to: "/transition" });
        else navigate({ to: "/completion" });
      } else {
        setCurrentIndex(s, idx + 1);
        unlockTimerRef.current = window.setTimeout(() => setLocked(false), 36);
      }
    }, 86);
  }, [idx, navigate, questions.length, s, setCurrentIndex]);

  const handleScaleSelect = useCallback(
    (value: AnswerValue) => {
      if (!question || locked) return;
      setLocked(true);
      setAnswer(s, question.id, { format: question.format === "choice_pair" ? "choice_pair" : "scale", value });
      advance();
    },
    [advance, locked, question, s, setAnswer],
  );

  const handleActionSelect = useCallback(
    (optionId: ActionCardOption["id"]) => {
      if (!question || locked) return;
      if ("vibrate" in window.navigator) {
        window.navigator.vibrate(8);
      }
      setLocked(true);
      setAnswer(s, question.id, { format: "action_cards", optionId });
      advance();
    },
    [advance, locked, question, s, setAnswer],
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || target?.isContentEditable) return;
      if (!question) return;
      if (question.format === "action_cards" && /^[1-4]$/.test(event.key)) {
        event.preventDefault();
        const option = question.options[Number(event.key) - 1];
        if (option) handleActionSelect(option.id);
        return;
      }
      if (/^[1-5]$/.test(event.key)) {
        event.preventDefault();
        handleScaleSelect(Number(event.key) as AnswerValue);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleActionSelect, handleScaleSelect, question]);

  function goBack() {
    if (idx > 0 && !locked) setCurrentIndex(s, idx - 1);
  }

  if (!question) return null;

  return (
    <main className="h-[100svh] overflow-hidden bg-[linear-gradient(180deg,#fbf8ef_0%,#f7f4ec_52%,#f4f1e9_100%)] text-foreground">
      <div className="mx-auto flex h-full w-full max-w-md flex-col px-3 pb-[max(.65rem,env(safe-area-inset-bottom))] pt-2.5 sm:px-5 sm:py-4">
        <div className="shrink-0">
          <ProgressTracker
            current={idx + 1}
            total={questions.length}
            label={LABELS[s].title}
            canGoBack={idx > 0 && !locked}
            onBack={goBack}
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pt-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <QuestionCard
            number={question.number}
            total={questions.length}
            text={question.text}
            situation={question.format === "action_cards" ? question.situation : undefined}
            prompt={question.format === "action_cards" ? question.prompt : undefined}
            patternArea={question.format === "action_cards" ? question.patternArea : undefined}
          >
            {question.format === "action_cards" ? (
              <ActionCards
                question={question}
                value={sessionAnswers[question.id]}
                disabled={locked}
                onSelect={handleActionSelect}
              />
            ) : (
              <AnswerScale
                value={(() => { const current = sessionAnswers[question.id]; return current?.format === "scale" || current?.format === "choice_pair" ? current.value : undefined; })()}
                onSelect={handleScaleSelect}
                session={s}
                disabled={locked}
              />
            )}
          </QuestionCard>
        </div>
      </div>
    </main>
  );
}
