import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  ASSESSMENT_SCALE_VERSION,
  type AnswerRecord,
  type Answers,
  type AnswerValue,
  type Identity,
  type AssessmentSession,
} from "@/types/assessment";

interface AssessmentState {
  identity: Identity | null;
  answers: Answers;
  assessmentScaleVersion: typeof ASSESSMENT_SCALE_VERSION;
  currentIndex: { natural: number; strength: number };
  setIdentity: (identity: Identity) => void;
  setAnswer: (session: AssessmentSession, questionId: string, value: AnswerRecord | AnswerValue) => void;
  setCurrentIndex: (session: AssessmentSession, index: number) => void;
  reset: () => void;
}

const emptyAnswers = (): Answers => ({ natural: {}, strength: {} });
const defaultCurrentIndex = () => ({ natural: 0, strength: 0 });

function isOptionId(value: unknown): value is "A" | "B" | "C" | "D" {
  return value === "A" || value === "B" || value === "C" || value === "D";
}

function normalizeAnswerRecord(raw: unknown): AnswerRecord | null {
  if (typeof raw === "number" && raw >= 1 && raw <= 5) return { format: "scale", value: raw as AnswerValue };
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Partial<AnswerRecord> & { value?: unknown; optionId?: unknown; format?: unknown };
  if ((value.format === "scale" || value.format === "choice_pair") && typeof value.value === "number" && value.value >= 1 && value.value <= 5) {
    return { format: value.format, value: value.value as AnswerValue };
  }
  if (value.format === "action_cards" && isOptionId(value.optionId)) return { format: "action_cards", optionId: value.optionId };
  return null;
}

function sanitizeAnswers(value: unknown): Answers {
  const input = value as Partial<Answers> | undefined;
  const sanitizeSession = (answers: unknown) => {
    const out: Record<string, AnswerRecord> = {};
    if (!answers || typeof answers !== "object") return out;
    for (const [id, raw] of Object.entries(answers as Record<string, unknown>)) {
      const normalized = normalizeAnswerRecord(raw);
      if (normalized) out[id] = normalized;
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
        set((state) => {
          const record: AnswerRecord =
            typeof value === "number" ? { format: "scale", value: value as AnswerValue } : value;
          return {
            answers: {
              ...state.answers,
              [session]: { ...state.answers[session], [questionId]: record },
            },
          };
        }),
      setCurrentIndex: (session, index) =>
        set((state) => ({
          currentIndex: { ...state.currentIndex, [session]: Math.max(0, index) },
        })),
      reset: () =>
        set({ identity: null, answers: emptyAnswers(), assessmentScaleVersion: ASSESSMENT_SCALE_VERSION, currentIndex: defaultCurrentIndex() }),
    }),
    {
      name: "peta-jati-diri-v1",
      version: 5,
      partialize: (state) => ({
        identity: state.identity,
        answers: state.answers,
        assessmentScaleVersion: state.assessmentScaleVersion,
        currentIndex: state.currentIndex,
      }),
      migrate: (persisted, version) => {
        const state = persisted as Partial<AssessmentState> | undefined;
        const shouldReset = version < 5 || state?.assessmentScaleVersion !== ASSESSMENT_SCALE_VERSION;
        return {
          identity: state?.identity ?? null,
          answers: shouldReset ? emptyAnswers() : sanitizeAnswers(state?.answers),
          assessmentScaleVersion: ASSESSMENT_SCALE_VERSION,
          currentIndex: shouldReset ? defaultCurrentIndex() : sanitizeIndex(state?.currentIndex),
        } as AssessmentState;
      },
    },
  ),
);
