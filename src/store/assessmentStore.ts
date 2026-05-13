import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ASSESSMENT_SCALE_VERSION, type Answers, type AnswerValue, type Identity, type AssessmentSession } from "@/types/assessment";

interface AssessmentState {
  identity: Identity | null;
  answers: Answers;
  assessmentScaleVersion: typeof ASSESSMENT_SCALE_VERSION;
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
  const sanitizeSession = (answers: unknown) => {
    const out: Record<string, AnswerValue> = {};
    if (!answers || typeof answers !== "object") return out;
    for (const [id, raw] of Object.entries(answers as Record<string, unknown>)) {
      if (typeof raw === "number" && raw >= 1 && raw <= 5) out[id] = raw as AnswerValue;
    }
    return out;
  };

  return {
    natural: sanitizeSession(input?.natural),
    strength: sanitizeSession(input?.strength),
  };
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
      assessmentScaleVersion: ASSESSMENT_SCALE_VERSION,
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
        set({ identity: null, answers: emptyAnswers(), assessmentScaleVersion: ASSESSMENT_SCALE_VERSION, currentIndex: defaultCurrentIndex() }),
    }),
    {
      name: "peta-jati-diri-v1",
      version: 4,
      partialize: (state) => ({
        identity: state.identity,
        answers: state.answers,
        assessmentScaleVersion: state.assessmentScaleVersion,
        currentIndex: state.currentIndex,
      }),
      migrate: (persisted, version) => {
        const state = persisted as Partial<AssessmentState> | undefined;
        const isOldScale = version < 3 || state?.assessmentScaleVersion !== ASSESSMENT_SCALE_VERSION;
        return {
          identity: state?.identity ?? null,
          answers: isOldScale ? emptyAnswers() : sanitizeAnswers(state?.answers),
          assessmentScaleVersion: ASSESSMENT_SCALE_VERSION,
          currentIndex: isOldScale ? defaultCurrentIndex() : sanitizeIndex(state?.currentIndex),
        } as AssessmentState;
      },
    },
  ),
);
