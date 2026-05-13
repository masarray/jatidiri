export type AssessmentSession = "natural" | "strength";

export type Cluster =
  | "Thinking"
  | "Striving"
  | "Relating"
  | "Influencing"
  | "Creating"
  | "Operating"
  | "Supporting"
  | "Analyzing";

export type QuestionItemType =
  | "energy"
  | "thinking"
  | "habit"
  | "tradeoff"
  | "drain"
  | "social_desirability"
  | "activity";

export type QuestionScoreLane = "natural" | "strength" | "fatigue" | "adaptive" | "quality";

export type QuestionPolarity = "positive" | "reverse";

export type QuestionBiasRisk = "low" | "medium" | "high";

export type QuestionFormat = "scale" | "choice_pair";

export interface QuestionChoice {
  text: string;
  cluster: Cluster;
  microRoles?: string[];
  itemType?: QuestionItemType;
  scoreLane?: QuestionScoreLane;
  polarity?: QuestionPolarity;
  biasRisk?: QuestionBiasRisk;
  weight?: number;
}

export interface QuestionItem {
  id: string;
  session: AssessmentSession;
  number: number;
  text: string;
  cluster: Cluster;
  /**
   * scale = ordinary 1-5 fit/capability item.
   * choice_pair = A/B trade-off item. Answer 1-2 strengthens A, 4-5 strengthens B, 3 keeps both moderate.
   */
  format?: QuestionFormat;
  choiceA?: QuestionChoice;
  choiceB?: QuestionChoice;
  /**
   * Optional metadata for the Smart Advisory engine.
   * This makes every question self-describing, instead of relying only on external maps.
   */
  microRoles?: string[];
  itemType?: QuestionItemType;
  scoreLane?: QuestionScoreLane;
  polarity?: QuestionPolarity;
  biasRisk?: QuestionBiasRisk;
  /**
   * Relative scoring weight. Use lower values for social desirability, drain-only,
   * or early/soft indicators so the engine does not over-read one sentence.
   */
  weight?: number;
}

export const ASSESSMENT_SCALE_VERSION = "v4-quick-scan-tradeoff";
export const ANSWER_VALUES = [1, 2, 3, 4, 5] as const;

export type AnswerValue = (typeof ANSWER_VALUES)[number];

export interface Identity {
  name: string;
  purpose?: string;
  startedAt: string;
}

export interface Answers {
  natural: Record<string, AnswerValue>;
  strength: Record<string, AnswerValue>;
}

export interface ClusterScore {
  cluster: Cluster;
  natural: number; // 0-100, already adjusted for response-quality guardrails
  strength: number; // 0-100, already adjusted for response-quality guardrails
  naturalRaw: number; // 0-100, direct average before adjustment
  strengthRaw: number; // 0-100, direct average before adjustment
  naturalItems: number;
  strengthItems: number;
}

export type Zone =
  | "Natural & Explored"
  | "Natural but Dormant"
  | "Adaptive / Survival"
  | "Weak / Draining";

export interface ClusterReport extends ClusterScore {
  zone: Zone;
}

export type ReadingQualityLevel = "Stabil" | "Cukup Stabil" | "Perlu Dibaca Hati-hati";

export interface ReadingQuality {
  score: number; // 0-100
  level: ReadingQualityLevel;
  summary: string;
  notes: string[];
  metrics: {
    completionPercent: number;
    variation: number;
    dominantAnswerRatio: number;
    neutralRatio: number;
    extremeHighRatio: number;
    extremeLowRatio: number;
    socialDesirabilityScore: number;
  };
}
