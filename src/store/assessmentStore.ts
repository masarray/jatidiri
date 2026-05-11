import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Answers, AnswerValue, Identity, AssessmentSession } from "@/types/assessment";

interface AssessmentState {
  identity: Identity | null;
  answers: Answers;
  currentIndex: { natural: number; strength: number };
  setIdentity: (identity: Identity) => void;
  setAnswer: (session: AssessmentSession, questionId: string, value: AnswerValue) => void;
  setCurrentIndex: (session: AssessmentSession, index: number) => void;
  reset: () => void;
}

const emptyAnswers = (): Answers => ({ natural: {}, strength: {} });
const defaultCurrentIndex = () => ({ natural: 0, strength: 0 });

function sanitizeAnswers(value: unknown): Answers {
  const input = value as Partial<Answers> | undefined;
  return {
    natural: input?.natural && typeof input.natural === "object" ? input.natural : {},
    strength: input?.strength && typeof input.strength === "object" ? input.strength : {},
  } as Answers;
}

function sanitizeIndex(value: unknown) {
  const input = value as Partial<{ natural: number; strength: number }> | undefined;
  return {
    natural: Number.isFinite(input?.natural) ? Math.max(0, Number(input?.natural)) : 0,
    strength: Number.isFinite(input?.strength) ? Math.max(0, Number(input?.strength)) : 0,
  };
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set) => ({
      identity: null,
      answers: emptyAnswers(),
      currentIndex: defaultCurrentIndex(),
      setIdentity: (identity) => set({ identity }),
      setAnswer: (session, questionId, value) =>
        set((state) => ({
          answers: {
            ...state.answers,
            [session]: { ...state.answers[session], [questionId]: value },
          },
        })),
      setCurrentIndex: (session, index) =>
        set((state) => ({
          currentIndex: { ...state.currentIndex, [session]: Math.max(0, index) },
        })),
      reset: () =>
        set({ identity: null, answers: emptyAnswers(), currentIndex: defaultCurrentIndex() }),
    }),
    {
      name: "peta-jati-diri-v1",
      version: 2,
      partialize: (state) => ({
        identity: state.identity,
        answers: state.answers,
        currentIndex: state.currentIndex,
      }),
      migrate: (persisted) => {
        const state = persisted as Partial<AssessmentState> | undefined;
        return {
          identity: state?.identity ?? null,
          answers: sanitizeAnswers(state?.answers),
          currentIndex: sanitizeIndex(state?.currentIndex),
        } as AssessmentState;
      },
    },
  ),
);
