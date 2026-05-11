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

const emptyAnswers: Answers = { natural: {}, strength: {} };

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set) => ({
      identity: null,
      answers: emptyAnswers,
      currentIndex: { natural: 0, strength: 0 },
      setIdentity: (identity) => set({ identity }),
      setAnswer: (session, questionId, value) =>
        set((state) => ({
          answers: {
            ...state.answers,
            [session]: { ...state.answers[session], [questionId]: value },
          },
        })),
      setCurrentIndex: (session, index) =>
        set((state) => ({ currentIndex: { ...state.currentIndex, [session]: index } })),
      reset: () =>
        set({ identity: null, answers: emptyAnswers, currentIndex: { natural: 0, strength: 0 } }),
    }),
    { name: "peta-jati-diri-v1" },
  ),
);
